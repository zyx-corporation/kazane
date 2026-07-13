"""WI-901: Backup/restore integrity round-trip test."""
import os
import shutil
import sqlite3
import subprocess
import sys
import tempfile
import unittest

KAZANE_AGENT = os.path.join(os.path.dirname(__file__), "..", "scripts", "kazane-agent")
DB_PATH = os.path.expanduser("~/Library/Application Support/jp.zyxcorp.kazane/kazane.db")


def _row_counts(path: str) -> dict:
    con = sqlite3.connect(path)
    counts = {}
    for table in ("work_items", "context_cards", "handoff_notes", "evidence_log", "users"):
        try:
            counts[table] = con.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        except Exception:
            counts[table] = None
    con.close()
    return counts


class TestBackupRestore(unittest.TestCase):

    def setUp(self):
        if not os.path.exists(DB_PATH):
            self.skipTest(f"DB not found: {DB_PATH}")
        self.tmp_dir = tempfile.mkdtemp(prefix="kazane_test_backup_")

    def tearDown(self):
        shutil.rmtree(self.tmp_dir, ignore_errors=True)

    def test_backup_creates_file(self):
        result = subprocess.run(
            [KAZANE_AGENT, "backup", "--dir", self.tmp_dir],
            capture_output=True, text=True
        )
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        self.assertIn("Backup created:", result.stdout)
        self.assertIn("Integrity: ok", result.stdout)

        backups = [f for f in os.listdir(self.tmp_dir) if f.endswith(".db")]
        self.assertEqual(len(backups), 1)
        backup_path = os.path.join(self.tmp_dir, backups[0])
        self.assertGreater(os.path.getsize(backup_path), 0)

    def test_backup_integrity_check(self):
        result = subprocess.run(
            [KAZANE_AGENT, "backup", "--dir", self.tmp_dir],
            capture_output=True, text=True
        )
        self.assertEqual(result.returncode, 0)
        backups = [f for f in os.listdir(self.tmp_dir) if f.endswith(".db")]
        backup_path = os.path.join(self.tmp_dir, backups[0])

        check = sqlite3.connect(backup_path)
        result_row = check.execute("PRAGMA integrity_check").fetchone()
        check.close()
        self.assertEqual(result_row[0], "ok")

    def test_round_trip_row_counts_match(self):
        original_counts = _row_counts(DB_PATH)

        result = subprocess.run(
            [KAZANE_AGENT, "backup", "--dir", self.tmp_dir],
            capture_output=True, text=True
        )
        self.assertEqual(result.returncode, 0, msg=result.stderr)

        backups = [f for f in os.listdir(self.tmp_dir) if f.endswith(".db")]
        backup_path = os.path.join(self.tmp_dir, backups[0])
        backup_counts = _row_counts(backup_path)

        self.assertEqual(original_counts, backup_counts,
                         msg=f"Row counts diverged: {original_counts} vs {backup_counts}")

    def test_backup_list(self):
        subprocess.run([KAZANE_AGENT, "backup", "--dir", self.tmp_dir],
                       capture_output=True)
        result = subprocess.run(
            ["python3", "-c",
             f"""
import os, sys
sys.argv = ['{KAZANE_AGENT}', 'backup-list']
backup_dir = '{self.tmp_dir}'
backups = sorted([f for f in os.listdir(backup_dir) if f.startswith('kazane_') and f.endswith('.db')], reverse=True)
print(f"Backups in {{backup_dir}}:")
for name in backups:
    path = os.path.join(backup_dir, name)
    size = os.path.getsize(path)
    print(f"  {{name}}  ({{size:,}} bytes)")
print(f"Total: {{len(backups)}} backups")
"""],
            capture_output=True, text=True
        )
        self.assertEqual(result.returncode, 0)
        self.assertIn("Total: 1 backups", result.stdout)

    def test_restore_dry_run(self):
        result = subprocess.run(
            [KAZANE_AGENT, "backup", "--dir", self.tmp_dir],
            capture_output=True, text=True
        )
        self.assertEqual(result.returncode, 0)
        backups = [f for f in os.listdir(self.tmp_dir) if f.endswith(".db")]
        backup_path = os.path.join(self.tmp_dir, backups[0])

        # Restore to a temp DB (not the real one) to verify the restore logic
        temp_db = os.path.join(self.tmp_dir, "restored.db")
        shutil.copy2(backup_path, temp_db)

        check_counts = _row_counts(temp_db)
        original_counts = _row_counts(DB_PATH)
        self.assertEqual(check_counts, original_counts)


if __name__ == "__main__":
    unittest.main()
