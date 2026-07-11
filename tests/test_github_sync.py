import json
import os
import sqlite3
import subprocess
import tempfile
import textwrap
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class GitHubSyncTest(unittest.TestCase):
    def test_issue_ids_are_namespaced_by_repository(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            home = Path(tmp)
            base = home / "Library" / "Application Support" / "jp.zyxcorp.kazane"
            base.mkdir(parents=True)
            db = base / "kazane.db"
            con = sqlite3.connect(db)
            con.executescript(
                """
                CREATE TABLE work_items (
                  id TEXT PRIMARY KEY, title TEXT, domain TEXT, assignee TEXT, col TEXT,
                  status TEXT, risk TEXT, context_id TEXT, next_action TEXT, gate TEXT,
                  rde INTEGER, morning INTEGER, bounced INTEGER, gate_perm TEXT,
                  gate_stops TEXT, ctx_json TEXT, ho_json TEXT, ev_json TEXT,
                  github_links_json TEXT, audit_required INTEGER, reviewer TEXT,
                  deviation_risk TEXT, drift_note TEXT, source TEXT, source_ref TEXT,
                  project TEXT, created_at TEXT, updated_at TEXT
                );
                CREATE TABLE events (
                  id TEXT PRIMARY KEY, wi_id TEXT, event_type TEXT, from_col TEXT,
                  to_col TEXT, actor TEXT, note TEXT, created_at TEXT
                );
                CREATE TABLE handoff_notes (id TEXT PRIMARY KEY, wi TEXT);
                CREATE TABLE evidence_log (id TEXT PRIMARY KEY, wi_id TEXT);
                """
            )
            con.close()

            bin_dir = home / "bin"
            bin_dir.mkdir()
            gh = bin_dir / "gh"
            gh.write_text(
                textwrap.dedent(
                    """\
                    #!/usr/bin/env python3
                    import json, sys
                    repo = sys.argv[sys.argv.index('--repo') + 1]
                    issue = {
                      'number': 1, 'title': f'Issue in {repo}', 'state': 'OPEN',
                      'labels': [], 'assignees': [], 'createdAt': '2026-01-01T00:00:00Z',
                      'updatedAt': '2026-01-02T00:00:00Z', 'closedAt': None,
                      'url': f'https://github.com/{repo}/issues/1', 'milestone': None,
                      'body': ''
                    }
                    print(json.dumps([issue]))
                    """
                ),
                encoding="utf-8",
            )
            gh.chmod(0o755)
            env = {**os.environ, "HOME": str(home), "PATH": f"{bin_dir}:{os.environ['PATH']}"}

            for repo in ("zyx-corporation/kazane", "zyx-corporation/ZYX-HomePage"):
                subprocess.run(
                    [str(ROOT / "scripts" / "kazane-agent"), "sync-github-issues", "--repo", repo],
                    env=env, check=True, capture_output=True, text=True,
                )

            con = sqlite3.connect(db)
            rows = con.execute("SELECT id, source_ref FROM work_items ORDER BY id").fetchall()
            con.close()
            self.assertEqual(
                rows,
                [
                    ("WI-GH-zyx-corporation-kazane-1", "https://github.com/zyx-corporation/kazane/issues/1"),
                    ("WI-GH-zyx-corporation-zyx-homepage-1", "https://github.com/zyx-corporation/ZYX-HomePage/issues/1"),
                ],
            )


if __name__ == "__main__":
    unittest.main()
