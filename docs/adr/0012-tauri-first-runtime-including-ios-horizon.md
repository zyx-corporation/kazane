# ADR 0012: Tauri-first runtime including iOS horizon

- Status: Accepted
- Date: 2026-06-26

## Context

Kazane must preserve local context, support macOS and Linux from the start, and leave room for iOS later.

The previous plan was to begin with a browser-based Web UI and later package or unify desktop GUI work. That direction underestimates runtime-shell decisions that are central to Kazane: local storage, file access, command permissions, agent execution, and packaging.

## Decision

Adopt Tauri as the initial GUI/runtime framework from the prototype stage.

The policy is:

- no browser-first product path;
- prototypes should be Tauri-based where practical;
- web technologies may be used inside Tauri;
- macOS and Linux are the first runtime targets;
- iOS is a future target to keep visible in architecture decisions;
- core data models must not depend on desktop-only assumptions.

## Consequences

Tauri becomes part of prototype learning, not only a later packaging layer.

This increases early setup cost but reduces later migration risk. It also makes local-first behavior, permissions, command boundaries, and cross-platform packaging visible earlier.

## RDE check

- Preserved: Prototype First, local-first, macOS/Linux target, and web-technology reuse.
- Transformed: Web UI first becomes Tauri first.
- Supplemented: iOS horizon and runtime-shell design from v0.0.
- Unresolved: frontend framework, local store, iOS feature depth, and Tauri mobile maturity risks.
- Deviation risk: Tauri-specific assumptions may leak into core Kazane concepts.
- Next update: define v0.0 Tauri scaffold and v0.1 runtime tests.
