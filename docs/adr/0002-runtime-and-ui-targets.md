# ADR 0002: Runtime and UI targets

- Status: Accepted
- Date: 2026-06-26

## Context

Kazane starts as a prototype for macOS and Linux users. The first interface should be easy to build and later reuse.

## Decision

Target macOS and Linux first. Start with a web UI. Keep the path open for a shared desktop GUI later.

## Consequences

This keeps the first implementation small. It postpones final desktop packaging decisions.

## RDE check

- Preserved: macOS/Linux focus.
- Transformed: GUI work begins through web UI.
- Supplemented: later shared desktop GUI path.
- Unresolved: concrete GUI shell.
- Deviation risk: early UI choices may constrain later packaging.
- Next update: revisit during v0.1 implementation planning.
