import json
import os
import socket
import subprocess
import tempfile
import time
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class AgentdPushTest(unittest.TestCase):
    def test_subscriber_receives_task_assignment(self) -> None:
        # macOS limits AF_UNIX paths to 104 bytes; keep the temporary HOME short.
        with tempfile.TemporaryDirectory(prefix="kz-", dir="/tmp") as tmp:
            env = {**os.environ, "HOME": tmp}
            base = Path(tmp) / "Library" / "Application Support" / "jp.zyxcorp.kazane"
            socket_path = base / "kazane-agentd.sock"
            process = subprocess.Popen(
                [str(ROOT / "scripts" / "kazane-agentd"), "serve"],
                env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )
            try:
                for _ in range(50):
                    if socket_path.exists():
                        break
                    time.sleep(0.05)
                self.assertTrue(socket_path.exists(), "agentd socket was not created")

                subscriber = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
                subscriber.settimeout(2)
                subscriber.connect(str(socket_path))
                subscriber.sendall(b'{"type":"subscribe"}\n')
                subscriber_stream = subscriber.makefile("r", encoding="utf-8")
                ready = json.loads(subscriber_stream.readline())
                self.assertEqual(ready["type"], "ready")

                notifier = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
                notifier.connect(str(socket_path))
                notifier.sendall(b'{"type":"notify","event":{"type":"task_assigned","id":"WI-TEST"}}\n')
                event = json.loads(subscriber_stream.readline())
                self.assertEqual(event, {"type": "task_assigned", "id": "WI-TEST"})
                notifier.close()
                subscriber_stream.close()
                subscriber.close()
            finally:
                process.terminate()
                process.wait(timeout=3)


if __name__ == "__main__":
    unittest.main()
