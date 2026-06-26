# ADR 0008: Web-first UI and cross-platform GUI later

- Status: Superseded by ADR 0012
- Date: 2026-06-26

## Context

Initial UI was previously planned as browser-first, with desktop unification later.

## Original decision

Start with a web UI. Plan for a future shared desktop GUI across macOS/Linux.

## Current status

This decision is superseded by [ADR 0012: Tauri-first runtime including iOS horizon](0012-tauri-first-runtime-including-ios-horizon.md).

The project now starts with Tauri from the prototype stage.

## RDE check

- Preserved: shared GUI direction and web-technology reuse.
- Transformed: GUI shell is no longer deferred.
- Supplemented: iOS horizon.
- Unresolved: final frontend framework.
- Deviation risk: early Tauri setup may slow throwaway prototypes.
- Next update: define Tauri scaffold and prototype boundaries.
