# ADR 0008: Web-first UI and cross-platform GUI later

- Status: Accepted
- Date: 2026-06-26

## Context

Initial UI should move quickly. Future macOS/Linux GUI should avoid divergent codebases.

## Decision

Start with a web UI. Plan for a future shared desktop GUI across macOS/Linux, likely by packaging the web UI with a cross-platform shell.

## Consequences

This accelerates prototype work. Native desktop integration decisions are deferred.

## RDE check

- Preserved: shared GUI direction.
- Transformed: desktop app is deferred behind web UI.
- Supplemented: reuse path for future GUI.
- Unresolved: desktop shell and update mechanism.
- Deviation risk: web UI may become detached from local-first needs.
- Next update: revisit during v0.2 or v0.3.
