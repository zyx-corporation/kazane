import json
import os
import socket
import sqlite3
import subprocess
import tempfile
import time
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ControlPlaneTest(unittest.TestCase):
    def test_typed_writes_and_default_deny(self) -> None:
        with tempfile.TemporaryDirectory(prefix="kzc-", dir="/tmp") as tmp:
            home = Path(tmp)
            base = home / "Library" / "Application Support" / "jp.zyxcorp.kazane"
            base.mkdir(parents=True)
            db = base / "kazane.db"
            con = sqlite3.connect(db)
            con.executescript(
                """
                CREATE TABLE agent_profiles (
                  id TEXT PRIMARY KEY, gate_stops TEXT NOT NULL DEFAULT ''
                );
                INSERT INTO agent_profiles VALUES ('AGT-TEST','本番反映／外部送信');
                CREATE TABLE work_items (
                  id TEXT PRIMARY KEY, title TEXT, domain TEXT, assignee TEXT, col TEXT,
                  status TEXT, risk TEXT, context_id TEXT, next_action TEXT, gate TEXT,
                  rde INTEGER, morning INTEGER, bounced INTEGER, gate_perm TEXT,
                  gate_stops TEXT, ctx_json TEXT, ho_json TEXT, ev_json TEXT,
                  github_links_json TEXT, source TEXT, source_ref TEXT, project TEXT,
                  created_at TEXT, updated_at TEXT
                );
                CREATE TABLE privileged_operation_requests (
                  id TEXT PRIMARY KEY, agent_id TEXT, operation TEXT, args_json TEXT,
                  decision TEXT, reason TEXT, created_at TEXT
                );
                """
            )
            con.close()
            env = {**os.environ, "HOME": str(home)}
            processes = []
            try:
                for role in ("kazane-privd", "kazaned"):
                    process = subprocess.Popen(
                        [str(ROOT / "scripts" / role), "serve"], env=env,
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                    )
                    processes.append(process)
                for role in ("kazane-privd", "kazaned"):
                    path = base / f"{role}.sock"
                    for _ in range(50):
                        if path.exists():
                            break
                        time.sleep(0.05)
                    self.assertTrue(path.exists())

                denied_missing = self.rpc(base / "kazaned.sock", "create_work_item", {"title": "missing identity"})
                self.assertIn("required", denied_missing["error"])

                denied_unknown = self.rpc(base / "kazaned.sock", "create_work_item", {"title": "unknown", "agent_id": "NOPE"})
                self.assertIn("unknown agent profile", denied_unknown["error"])

                denied_gate = self.rpc(base / "kazaned.sock", "create_work_item", {"title": "本番反映", "agent_id": "AGT-TEST"})
                self.assertIn("gate stop matched", denied_gate["error"])

                denied_operation = self.rpc(base / "kazane-privd.sock", "authorize", {
                    "agent_id": "AGT-TEST", "requested_operation": "shell", "payload": {},
                })
                self.assertFalse(denied_operation["allowed"])

                allowed = self.rpc(base / "kazaned.sock", "create_work_item", {
                    "title": "typed write", "agent_id": "AGT-TEST", "project": "Kazane",
                })
                self.assertEqual(allowed["created"], "WI-001")

                con = sqlite3.connect(db)
                item = con.execute("SELECT title,project FROM work_items WHERE id='WI-001'").fetchone()
                decisions = con.execute(
                    "SELECT decision,count(*) FROM privileged_operation_requests GROUP BY decision"
                ).fetchall()
                con.close()
                self.assertEqual(item, ("typed write", "Kazane"))
                self.assertEqual(dict(decisions), {"allow": 1, "deny": 4})
            finally:
                for process in reversed(processes):
                    process.terminate()
                    process.wait(timeout=3)

    @staticmethod
    def rpc(path: Path, operation: str, arguments: dict) -> dict:
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as client:
            client.settimeout(3)
            client.connect(str(path))
            client.sendall(json.dumps({"operation": operation, "arguments": arguments}).encode() + b"\n")
            return json.loads(client.makefile("r", encoding="utf-8").readline())


class RoleAuthorizationTest(unittest.TestCase):
    """WI-903: role-based allow/deny tests (unit-level, no daemon required)."""

    def _make_db(self, tmp_dir: str) -> Path:
        base = Path(tmp_dir) / "Library" / "Application Support" / "jp.zyxcorp.kazane"
        base.mkdir(parents=True)
        db = base / "kazane.db"
        con = sqlite3.connect(db)
        con.executescript(
            """
            CREATE TABLE agent_profiles (id TEXT PRIMARY KEY, gate_stops TEXT NOT NULL DEFAULT '');
            INSERT INTO agent_profiles VALUES ('AGT-TEST','');

            CREATE TABLE users (
              id TEXT PRIMARY KEY, name TEXT, email TEXT,
              role TEXT NOT NULL DEFAULT 'operator', enabled INTEGER NOT NULL DEFAULT 1,
              created_at TEXT
            );
            INSERT INTO users VALUES ('USR-owner','Owner','o@x.jp','owner',1,'2026-07-13');
            INSERT INTO users VALUES ('USR-op','Operator','op@x.jp','operator',1,'2026-07-13');
            INSERT INTO users VALUES ('USR-rev','Reviewer','rv@x.jp','reviewer',1,'2026-07-13');
            INSERT INTO users VALUES ('USR-disabled','Disabled','d@x.jp','operator',0,'2026-07-13');

            CREATE TABLE privileged_operation_requests (
              id TEXT PRIMARY KEY, agent_id TEXT, operation TEXT,
              args_json TEXT, decision TEXT, reason TEXT, created_at TEXT
            );
            """
        )
        con.close()
        return base

    def _authorize(self, base: Path, **kwargs) -> dict:
        """Call authorize() directly via kazane_control import."""
        import importlib.util, sys as _sys
        spec = importlib.util.spec_from_file_location(
            "kazane_control", str(ROOT / "scripts" / "kazane_control.py")
        )
        mod = importlib.util.module_from_spec(spec)
        # patch DB_PATH and TASKS_DIR
        orig_db = None
        try:
            spec.loader.exec_module(mod)
            orig_db = mod.DB_PATH
            mod.DB_PATH = base / "kazane.db"
            return mod.authorize(kwargs)
        finally:
            if orig_db is not None:
                mod.DB_PATH = orig_db

    def test_owner_can_write(self):
        with tempfile.TemporaryDirectory(prefix="kz-role-") as tmp:
            base = self._make_db(tmp)
            result = self._authorize(base,
                user_id="USR-owner",
                requested_operation="create_work_item",
                payload={"title": "test"},
            )
            self.assertTrue(result["allowed"], msg=result.get("reason"))
            self.assertIn("owner", result["reason"])

    def test_operator_can_write(self):
        with tempfile.TemporaryDirectory(prefix="kz-role-") as tmp:
            base = self._make_db(tmp)
            result = self._authorize(base,
                user_id="USR-op",
                requested_operation="submit_handoff",
                payload={},
            )
            self.assertTrue(result["allowed"], msg=result.get("reason"))

    def test_reviewer_denied_create(self):
        with tempfile.TemporaryDirectory(prefix="kz-role-") as tmp:
            base = self._make_db(tmp)
            result = self._authorize(base,
                user_id="USR-rev",
                requested_operation="create_work_item",
                payload={"title": "test"},
            )
            self.assertFalse(result["allowed"])
            self.assertIn("reviewer", result["reason"])

    def test_reviewer_denied_update(self):
        with tempfile.TemporaryDirectory(prefix="kz-role-") as tmp:
            base = self._make_db(tmp)
            result = self._authorize(base,
                user_id="USR-rev",
                requested_operation="update_work_item",
                payload={"wi_id": "WI-001"},
            )
            self.assertFalse(result["allowed"])
            self.assertIn("reviewer", result["reason"])

    def test_reviewer_can_submit_handoff(self):
        """reviewer may approve/submit handoffs (not a write-gated op for reviewers)."""
        with tempfile.TemporaryDirectory(prefix="kz-role-") as tmp:
            base = self._make_db(tmp)
            result = self._authorize(base,
                user_id="USR-rev",
                requested_operation="submit_handoff",
                payload={},
            )
            self.assertTrue(result["allowed"], msg=result.get("reason"))

    def test_disabled_user_denied(self):
        with tempfile.TemporaryDirectory(prefix="kz-role-") as tmp:
            base = self._make_db(tmp)
            result = self._authorize(base,
                user_id="USR-disabled",
                requested_operation="create_work_item",
                payload={},
            )
            self.assertFalse(result["allowed"])
            self.assertIn("disabled", result["reason"])

    def test_unknown_user_denied(self):
        with tempfile.TemporaryDirectory(prefix="kz-role-") as tmp:
            base = self._make_db(tmp)
            result = self._authorize(base,
                user_id="USR-nobody",
                requested_operation="create_work_item",
                payload={},
            )
            self.assertFalse(result["allowed"])
            self.assertIn("unknown", result["reason"])

    def test_audit_records_created(self):
        with tempfile.TemporaryDirectory(prefix="kz-role-") as tmp:
            base = self._make_db(tmp)
            # One allow (owner), one deny (reviewer create)
            for uid, op, expect in [
                ("USR-owner", "create_work_item", True),
                ("USR-rev", "create_work_item", False),
            ]:
                self._authorize(base, user_id=uid, requested_operation=op, payload={})

            con = sqlite3.connect(str(base / "kazane.db"))
            rows = con.execute(
                "SELECT decision FROM privileged_operation_requests ORDER BY created_at"
            ).fetchall()
            con.close()
            decisions = [r[0] for r in rows]
            self.assertIn("allow", decisions)
            self.assertIn("deny", decisions)


if __name__ == "__main__":
    unittest.main()
