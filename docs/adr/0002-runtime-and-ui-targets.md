# ADR 0002: Runtime and UI targets

- Status: Superseded by ADR 0012
- Date: 2026-06-26

## Context

Kazane originally considered a browser-first prototype with desktop packaging later.

## Original decision

Target macOS and Linux first. Start with a web UI. Keep a path open for a shared desktop GUI later.

## Current status

This decision is superseded by [ADR 0012: Tauri-first runtime including iOS horizon](0012-tauri-first-runtime-including-ios-horizon.md).

Kazane is now Tauri-first from the prototype stage.

## RDE check

- Preserved: macOS/Linux focus and web-technology reuse.
- Transformed: browser-first prototype becomes Tauri-first prototype.
- Supplemented: iOS horizon and runtime-shell learning.
- Unresolved: exact Tauri frontend stack and iOS support depth.
- Deviation risk: Tauri-first may increase initial setup cost.
- Next update: define v0.0/v0.1 Tauri scaffold.
