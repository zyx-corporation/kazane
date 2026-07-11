# ADR 0013: Control plane and privilege boundary

- Status: Accepted (Phase A in progress)
- Date: 2026-06-26

## Context

Kazane must run AI agents locally and remotely while preserving human responsibility, local context, and security boundaries.

If orchestration, agent execution, and privileged operations are collapsed into one process, the system becomes difficult to reason about. AI agents may gain broad access to files, secrets, connectors, or command execution.

## Decision

Separate the Kazane runtime into at least three roles:

1. `kazaned` — local orchestrator and control plane;
2. `kazane-privd` — privilege manager;
3. `kazane-agentd-local` / `kazane-agentd-remote` — agent runtimes.

The orchestrator owns Work Item state, Context linkage, dispatch, leases, Handoff intake, Evidence intake, escalation, and audit event creation.

The privilege manager owns typed privileged operations and secret access. Agent runtimes must not directly access secrets or unrestricted local resources.

## Consequences

This introduces more processes and clearer IPC boundaries. It increases early implementation complexity but prevents agent execution from becoming a hidden privileged path.

The initial implementation may mock some boundaries, but the architecture must preserve the separation.

## RDE check

- Preserved: human responsibility, escalation, local-first control, and evidence.
- Transformed: Kazane becomes a multi-process controlled runtime rather than a single app.
- Supplemented: explicit privilege boundary and typed privileged operations.
- Unresolved: IPC mechanism, policy engine, command profiles, and process supervision.
- Deviation risk: mock boundaries may become permanent if not tested.
- Next update: define Phase A IPC and privileged operation schema.

## Phase A IPC decision (2026-07-11)

Phase A uses local Unix domain sockets for process notifications and typed JSON
messages. Durable state remains in SQLite and the task file queue; socket
delivery is an acceleration path and must never be the only copy of a task.

The first separated runtime is `kazane-agentd`:

- `scripts/kazane-agentd` runs independently from the Tauri application;
- the socket is stored at `{AppData}/kazane-agentd.sock` with mode `0600`;
- Tauri and `kazane-mcp` publish `task_assigned` notifications;
- `kazane-agent watch` subscribes to push notifications and falls back to file
  polling when the daemon is unavailable;
- unknown message types are rejected by default.

This establishes the execution-plane boundary and IPC mechanism. Phase A is
not complete until state-changing MCP operations are delegated to a separate
`kazaned` control-plane process and privileged operations have typed profiles
owned by `kazane-privd`.
