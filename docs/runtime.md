# Runtime and UI Strategy

## Decision

Kazane is **Tauri first** from the prototype stage.

The previous direction of **Web UI first, desktop unification later** is withdrawn.

Kazane should still use web technologies for UI where useful, but they should be developed inside the Tauri application model from the beginning. The runtime shell, local permissions, file access model, packaging assumptions, and cross-platform constraints are part of the prototype learning.

## Target environments

Initial targets:

- macOS
- Linux

Also in view:

- iOS

Windows is not excluded, but it is not an initial target.

## Why Tauri first

Tauri aligns with Kazane's product assumptions:

- local-first operation;
- Rust-compatible system layer;
- structured local data;
- integration with local files, CLI tools, and future MCP processes;
- smaller desktop footprint than a bundled Chromium runtime;
- one product direction across macOS, Linux, and later iOS exploration.

## Prototype policy

Prototype First remains required, but prototypes should be Tauri-based where practical.

Allowed prototype forms:

- Tauri app with fake data;
- Tauri app with local JSON/YAML/Markdown files;
- Tauri app with mocked agent runtime;
- static UI embedded in Tauri;
- CLI-only proof only when UI is irrelevant.

Browser-only prototypes should be treated as exceptional throwaway sketches, not as the main product path.

## UI architecture

The UI may use web technologies, but the product boundary is the Tauri application.

Expected early shape:

- Tauri app shell;
- web-based front-end inside Tauri;
- Rust command layer;
- local structured storage;
- export/import support;
- CLI and future MCP access for agent workflows.

## Local-first default

Kazane handles organizational context. The initial runtime should assume local or private-network operation.

Cloud mode should be treated as an explicit deployment choice with sign-in, access control, audit logs, private data masking, rate limits, backup and restore, and clear data boundaries.

## AI agent integration

Early integration paths:

- Tauri command layer;
- CLI commands;
- file-based work queues;
- local JSON/YAML/Markdown data;
- local database later;
- MCP server later;
- GitHub connector later;
- Gmail/Calendar/Drive connectors later for AI番頭 workflows.

## iOS consideration

iOS is in scope as a future target, but not as the first implementation target.

Design implications:

- avoid desktop-only assumptions in core models;
- separate core data model from desktop-specific shell behavior;
- avoid treating local filesystem access as the only possible persistence model;
- keep mobile constraints visible when designing Work Item, Context Card, Handoff, and review flows.

## Non-goals for the first prototype

- full mobile feature parity;
- cloud-first SaaS;
- browser-only product architecture;
- Windows packaging;
- enterprise deployment management.
