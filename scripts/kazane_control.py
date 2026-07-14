"""Phase A local control-plane and privilege-boundary implementation."""

from __future__ import annotations

import datetime
import json
import os
import re
import signal
import socket
import socketserver
import sqlite3
import subprocess
import sys
import time
import uuid
from pathlib import Path
from typing import Any

BUNDLE_ID = "jp.zyxcorp.kazane"
BASE_DIR = (
    Path.home() / "Library" / "Application Support" / BUNDLE_ID
    if sys.platform == "darwin"
    else Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local" / "share")) / BUNDLE_ID
)
DB_PATH = BASE_DIR / "kazane.db"
TASKS_DIR = BASE_DIR / "tasks"
SCRIPT_DIR = Path(__file__).resolve().parent
COL_STATUS = {
    "inbox": "Inbox", "ai": "AI Working", "human": "Needs Human",
    "gate": "Expert / Gate", "done": "Done / Logged",
}
WRITE_OPERATIONS = {
    "create_work_item", "update_work_item", "submit_handoff", "add_evidence",
    "mail_import", "calendar_import",
}

# Operations reviewer role may never initiate
REVIEWER_DENIED_OPERATIONS = {
    "create_work_item", "update_work_item", "mail_import", "calendar_import",
}

# Operations only owner role may initiate (regardless of agent_profiles)
OWNER_ONLY_OPERATIONS: set[str] = set()  # reserved for future privileged ops


def now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


def paths(role: str) -> tuple[Path, Path, Path]:
    return (
        BASE_DIR / f"{role}.sock",
        BASE_DIR / f"{role}.pid",
        BASE_DIR / f"{role}.log",
    )


def rpc(role: str, operation: str, arguments: dict[str, Any], timeout: float = 5) -> dict[str, Any]:
    socket_path, _, _ = paths(role)
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as client:
        client.settimeout(timeout)
        client.connect(str(socket_path))
        client.sendall(json.dumps({"operation": operation, "arguments": arguments}, ensure_ascii=False).encode() + b"\n")
        raw = client.makefile("r", encoding="utf-8").readline()
    return json.loads(raw)


def running_pid(role: str) -> int | None:
    _, pid_path, _ = paths(role)
    try:
        pid = int(pid_path.read_text(encoding="utf-8"))
        os.kill(pid, 0)
        return pid
    except (FileNotFoundError, ValueError, ProcessLookupError, PermissionError):
        return None


def ensure_daemon(role: str) -> None:
    socket_path, _, _ = paths(role)
    if running_pid(role) and socket_path.exists():
        return
    subprocess.run([str(SCRIPT_DIR / role), "start"], check=True, capture_output=True, text=True)
    for _ in range(50):
        if socket_path.exists():
            return
        time.sleep(0.05)
    raise RuntimeError(f"{role} did not create its IPC socket")


def audit_authorization(agent_id: str, operation: str, arguments: dict[str, Any], decision: str, reason: str) -> None:
    con = sqlite3.connect(DB_PATH)
    try:
        con.executescript(
            """CREATE TABLE IF NOT EXISTS privileged_operation_requests (
                 id TEXT PRIMARY KEY NOT NULL,
                 agent_id TEXT NOT NULL DEFAULT '', operation TEXT NOT NULL DEFAULT '',
                 args_json TEXT NOT NULL DEFAULT '{}', decision TEXT NOT NULL DEFAULT 'deny',
                 reason TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now'))
               );
               CREATE INDEX IF NOT EXISTS idx_privileged_operation_created
                 ON privileged_operation_requests(created_at);"""
        )
        con.execute(
            """INSERT INTO privileged_operation_requests
               (id,agent_id,operation,args_json,decision,reason,created_at)
               VALUES (?,?,?,?,?,?,?)""",
            (f"POR-{uuid.uuid4().hex}", agent_id, operation,
             json.dumps(arguments, ensure_ascii=False), decision, reason, now()),
        )
        con.commit()
    finally:
        con.close()


def _lookup_user_role(user_id: str) -> str | None:
    """Return the role string for a human user, or None if not found."""
    try:
        con = sqlite3.connect(DB_PATH)
        row = con.execute(
            "SELECT role, enabled FROM users WHERE id=?", (user_id,)
        ).fetchone()
        con.close()
        if row and row[1]:  # enabled=1
            return row[0]
    except Exception:
        pass
    return None


def authorize(arguments: dict[str, Any]) -> dict[str, Any]:
    agent_id = str(arguments.get("agent_id", ""))
    user_id = str(arguments.get("user_id", ""))
    operation = str(arguments.get("requested_operation", ""))
    payload = arguments.get("payload") or {}

    if operation not in WRITE_OPERATIONS:
        result = {"allowed": False, "reason": "unknown operation: default deny"}
    elif not agent_id and not user_id:
        result = {"allowed": False, "reason": "agent_id or user_id is required for state-changing operations"}
    elif user_id:
        # Human user path: role-based check
        role = _lookup_user_role(user_id)
        if role is None:
            result = {"allowed": False, "reason": f"unknown or disabled user: {user_id}"}
        elif operation in OWNER_ONLY_OPERATIONS and role != "owner":
            result = {"allowed": False, "reason": f"operation {operation!r} requires owner role (caller has {role!r})"}
        elif role == "reviewer" and operation in REVIEWER_DENIED_OPERATIONS:
            result = {"allowed": False, "reason": f"reviewer role may not perform {operation!r}"}
        else:
            result = {"allowed": True, "reason": f"user role {role!r} permits {operation!r}"}
    else:
        # Agent path: agent_profiles gate_stops check
        con = sqlite3.connect(DB_PATH)
        row = con.execute("SELECT gate_stops FROM agent_profiles WHERE id=?", (agent_id,)).fetchone()
        con.close()
        if not row:
            result = {"allowed": False, "reason": f"unknown agent profile: {agent_id}"}
        else:
            operation_summary = json.dumps(payload, ensure_ascii=False)
            matched = next((stop.strip() for stop in row[0].split("／") if stop.strip() and stop.strip() in operation_summary), "")
            result = (
                {"allowed": False, "reason": f"gate stop matched: {matched}"}
                if matched else {"allowed": True, "reason": "known typed operation within agent profile"}
            )

    actor = user_id or agent_id
    audit_authorization(actor, operation, payload, "allow" if result["allowed"] else "deny", result["reason"])
    return result


def next_wi_id(con: sqlite3.Connection) -> str:
    rows = con.execute("SELECT id FROM work_items WHERE id LIKE 'WI-%'").fetchall()
    nums = [int(row[0][3:]) for row in rows if re.fullmatch(r"WI-\d+", row[0])]
    return f"WI-{max(nums, default=0) + 1:03d}"


def notify_agentd(event: dict[str, Any]) -> None:
    socket_path = BASE_DIR / "kazane-agentd.sock"
    if not socket_path.exists():
        return
    try:
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as client:
            client.settimeout(1)
            client.connect(str(socket_path))
            client.sendall(json.dumps({"type": "notify", "event": event}, ensure_ascii=False).encode() + b"\n")
    except OSError:
        pass


def create_work_item(args: dict[str, Any]) -> dict[str, Any]:
    con = sqlite3.connect(DB_PATH)
    wi_id = next_wi_id(con)
    title = args["title"]
    domain = args.get("domain", "開発")
    assignee = args.get("assignee", "AI番頭")
    ctx_id = args.get("context_id", "—")
    next_action = args.get("next_action", "AIが着手予定")
    ctx = {"question": "（未記入）", "purpose": "目的を記入。", "constraint": "制約を記入。", "unresolved": "未解決点を記入。"}
    ho = {"did": "未着手。", "uncertain": "—", "bounce": "—", "next": next_action}
    con.execute(
        """INSERT INTO work_items
           (id,title,domain,assignee,col,status,risk,context_id,next_action,gate,
            rde,morning,bounced,gate_perm,gate_stops,ctx_json,ho_json,ev_json,
            github_links_json,source,source_ref,project,created_at,updated_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,0,0,0,?,?,?,?,'[]','[]',?,?,?,?,?)""",
        (wi_id, title, domain, assignee, "inbox", "Inbox", args.get("risk", "中"), ctx_id,
         next_action, "AI権限内で着手可", "整理・下調べ・草案", "外部送信／契約／金銭／専門家判断",
         json.dumps(ctx, ensure_ascii=False), json.dumps(ho, ensure_ascii=False),
         args.get("source", "manual"), args.get("source_ref", ""), args.get("project", ""), now(), now()),
    )
    con.commit()
    con.close()
    return {"created": wi_id, "title": title}


def update_work_item(args: dict[str, Any]) -> dict[str, Any]:
    fields: list[str] = []
    values: list[Any] = []
    for key, column in (("title", "title"), ("assignee", "assignee"), ("risk", "risk"),
                        ("next_action", "next_action"), ("project", "project")):
        if args.get(key) is not None:
            fields.append(f"{column}=?")
            values.append(args[key])
    if args.get("col"):
        fields.extend(["col=?", "status=?"])
        values.extend([args["col"], COL_STATUS.get(args["col"], args["col"])])
    if not fields:
        return {"error": "更新フィールドが指定されていません"}
    fields.append("updated_at=?")
    values.extend([now(), args["id"]])
    con = sqlite3.connect(DB_PATH)
    cur = con.execute(f"UPDATE work_items SET {', '.join(fields)} WHERE id=?", values)
    con.commit()
    con.close()
    return {"updated": args["id"]} if cur.rowcount else {"error": f"Not found: {args['id']}"}


def submit_handoff(args: dict[str, Any]) -> dict[str, Any]:
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    wi_id = args["wi_id"]
    row = con.execute("SELECT title,domain,assignee,context_id,ho_json,risk FROM work_items WHERE id=?", (wi_id,)).fetchone()
    if not row:
        con.close()
        return {"error": f"Not found: {wi_id}"}
    escalate = bool(args.get("escalate", False))
    next_agent = args.get("next_agent", "")
    reason = args.get("escalation_reason", "")
    target = "gate" if escalate else ("ai" if next_agent else "done")
    ho_id = f"HO-{datetime.datetime.now(datetime.timezone.utc):%Y%m%d%H%M%S}-{uuid.uuid4().hex[:6]}"
    did = args["did"]
    next_text = args["next"]
    ho = {
        "did": did, "judged": "" if escalate else "責任範囲内で完了と判断した。",
        "couldnt": reason if escalate else "", "uncertain": args.get("uncertain", "—"),
        "bounce": "責任境界を超えるため人間判断へ引き継ぐ。" if escalate else "", "next": next_text,
    }
    embedded = json.loads(row["ho_json"] or "{}")
    embedded.update(ho)
    wi_label = f"{wi_id} {row['title']}"
    next_value = "人間が状況を確認する。" if escalate else (f"{next_agent} が引き継ぎ" if next_agent else "完了・記録済")
    try:
        con.execute("BEGIN")
        con.execute(
            """INSERT INTO handoff_notes
               (id,wi,assignee,domain,did,judged,couldnt,uncertain,bounce,next,upd_ctx,
                ev_json,gate,ask,escalated,escalation_reason,created_at)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (ho_id, wi_label, row["assignee"], row["domain"], did, ho["judged"], ho["couldnt"],
             ho["uncertain"], ho["bounce"], next_text, "", "[]", "エスカレーション" if escalate else "",
             "人間が判断・承認をお願いします。" if escalate else "", int(escalate), reason, now()),
        )
        con.execute(
            """UPDATE work_items SET col=?,status=?,assignee=?,next_action=?,ho_json=?,
               agent_escalated=?,escalation_reason=?,bounced=?,updated_at=? WHERE id=?""",
            (target, COL_STATUS[target], next_agent or row["assignee"], next_value,
             json.dumps(embedded, ensure_ascii=False), int(escalate), reason if escalate else "",
             int(escalate), now(), wi_id),
        )
        con.execute(
            "INSERT INTO events (id,wi_id,event_type,from_col,to_col,actor,note,created_at) VALUES (?,?,?,?,?,?,?,?)",
            (f"EV-{uuid.uuid4().hex}", wi_id, "agent_escalated" if escalate else "agent_handoff",
             "ai", target, args["agent_id"], did[:200], now()),
        )
        con.commit()
    except Exception:
        con.rollback()
        raise
    finally:
        con.close()
    if next_agent:
        TASKS_DIR.mkdir(parents=True, exist_ok=True)
        task = {"id": wi_id, "title": row["title"], "domain": row["domain"], "assignee": next_agent,
                "contextId": row["context_id"], "nextAction": next_value, "risk": row["risk"],
                "routedFrom": args["agent_id"]}
        (TASKS_DIR / f"{wi_id}.json").write_text(json.dumps(task, ensure_ascii=False, indent=2), encoding="utf-8")
        notify_agentd({"type": "task_assigned", "id": wi_id, "payload": task})
    (TASKS_DIR / f"{wi_id}.lock").unlink(missing_ok=True)
    return {"submitted": ho_id, "wi": wi_id, "next_agent": next_agent or None, "col": target}


def add_evidence(args: dict[str, Any]) -> dict[str, Any]:
    ev_id = f"EV-{uuid.uuid4().hex}"
    con = sqlite3.connect(DB_PATH)
    con.execute(
        "INSERT INTO evidence_log (id,type,label,trust,store,wi_id,ho_id,ctx_id,note,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
        (ev_id, args["type"], args["label"], args.get("trust", "中"), args.get("store", ""),
         args["wi_id"], "", "", args.get("note", ""), now()),
    )
    con.commit()
    con.close()
    return {"added": ev_id, "wi": args["wi_id"]}


def run_import(operation: str, args: dict[str, Any]) -> dict[str, Any]:
    if operation == "mail_import":
        command = [str(SCRIPT_DIR / "kazane-agent"), "mail-import", "--from", args["from_addr"],
                   "--subject", args["subject"], "--snippet", args.get("snippet", ""),
                   "--thread-id", args.get("thread_id", ""), "--domain", args.get("domain", "顧客対応"),
                   "--ctx", args.get("context_id", "—"), "--risk", args.get("risk", "中")]
    else:
        command = [str(SCRIPT_DIR / "kazane-agent"), "calendar-import", "--title", args["title"],
                   "--date", args.get("date", ""), "--attendees", args.get("attendees", ""),
                   "--event-id", args.get("event_id", ""), "--domain", args.get("domain", "会議"),
                   "--ctx", args.get("context_id", "—")]
        if args.get("wi_id"):
            command.extend(["--wi", args["wi_id"]])
    result = subprocess.run(command, check=True, capture_output=True, text=True)
    return {"ok": True, "output": result.stdout.strip()}


def control(operation: str, arguments: dict[str, Any]) -> dict[str, Any]:
    if operation == "health":
        return {"ok": True, "service": "kazaned"}
    ensure_daemon("kazane-privd")
    auth = rpc("kazane-privd", "authorize", {
        "agent_id": arguments.get("agent_id", ""), "requested_operation": operation, "payload": arguments,
    })
    if not auth.get("allowed"):
        return {"error": auth.get("reason", "denied")}
    handlers = {
        "create_work_item": create_work_item, "update_work_item": update_work_item,
        "submit_handoff": submit_handoff, "add_evidence": add_evidence,
    }
    if operation in handlers:
        return handlers[operation](arguments)
    if operation in {"mail_import", "calendar_import"}:
        return run_import(operation, arguments)
    return {"error": "unknown operation: default deny"}


class ThreadingUnixServer(socketserver.ThreadingMixIn, socketserver.UnixStreamServer):
    daemon_threads = True


def handler_for(role: str):
    class Handler(socketserver.StreamRequestHandler):
        def handle(self) -> None:
            try:
                request = json.loads(self.rfile.readline())
                operation = request.get("operation", "")
                arguments = request.get("arguments") or {}
                result = authorize(arguments) if role == "kazane-privd" and operation == "authorize" else (
                    {"error": "unknown operation: default deny"} if role == "kazane-privd" else control(operation, arguments)
                )
            except Exception as error:
                result = {"error": str(error)}
            self.wfile.write(json.dumps(result, ensure_ascii=False).encode() + b"\n")
    return Handler


def serve(role: str) -> None:
    BASE_DIR.mkdir(parents=True, exist_ok=True)
    socket_path, pid_path, _ = paths(role)
    socket_path.unlink(missing_ok=True)
    pid_path.write_text(str(os.getpid()), encoding="utf-8")
    server = ThreadingUnixServer(str(socket_path), handler_for(role))
    os.chmod(socket_path, 0o600)
    try:
        server.serve_forever()
    finally:
        server.server_close()
        socket_path.unlink(missing_ok=True)
        pid_path.unlink(missing_ok=True)


def daemon_main(role: str) -> int:
    command = sys.argv[1] if len(sys.argv) > 1 else "serve"
    socket_path, pid_path, log_path = paths(role)
    if command == "serve":
        serve(role)
        return 0
    if command == "start":
        pid = running_pid(role)
        if pid and socket_path.exists():
            print(f"{role} already running (pid={pid})")
            return 0
        BASE_DIR.mkdir(parents=True, exist_ok=True)
        with log_path.open("ab") as log:
            process = subprocess.Popen([sys.executable, str(SCRIPT_DIR / role), "serve"],
                stdin=subprocess.DEVNULL, stdout=log, stderr=log, start_new_session=True)
        print(f"{role} started (pid={process.pid})")
        return 0
    if command == "stop":
        pid = running_pid(role)
        if pid:
            os.kill(pid, signal.SIGTERM)
            print(f"{role} stopped (pid={pid})")
        else:
            print(f"{role} is not running")
        return 0
    if command == "status":
        pid = running_pid(role)
        print(f"running (pid={pid})" if pid else "stopped")
        return 0 if pid else 1
    print(f"Usage: {role} [serve|start|stop|status]", file=sys.stderr)
    return 2
