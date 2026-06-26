# Runtime and UI Strategy

## Target environments

Kazane targets macOS and Linux. Windows is not excluded, but it is not an initial target.

## Initial UI

The initial UI should be web-based. This supports rapid prototyping, local operation, and future deployment flexibility.

Recommended early shape:

- local web server;
- browser UI;
- structured local storage;
- export/import support;
- CLI access for agent workflows.

## Future GUI

Future desktop GUI should be shared between macOS and Linux where possible.

Potential direction:

- Tauri or similar cross-platform desktop shell;
- Rust or Go backend;
- web UI reused inside desktop shell;
- local-first data store;
- optional cloud sync later.

## Local-first default

Kazane handles sensitive organizational context. The initial runtime should assume local or private-network operation.

Cloud mode should be treated as an explicit deployment choice with sign-in, access control, audit logs, private data masking, rate limits, backup and restore, and clear data boundaries.

## AI agent integration

Early integration paths:

- CLI commands;
- file-based work queues;
- local JSON/YAML/Markdown data;
- MCP server later;
- GitHub connector later;
- Gmail/Calendar/Drive connectors later for AI番頭 workflows.
