# ADR 0001: Record architecture decisions

- Status: Accepted
- Date: 2026-06-26

## Context

Kazane is expected to evolve quickly through AI-assisted design and implementation. Without durable decision records, design intent can drift silently.

## Decision

Use Architecture Decision Records under `docs/adr/` for significant technical, product, licensing, and governance decisions.

## Consequences

This adds documentation overhead, but preserves decision provenance and helps AI agents understand why the system is shaped as it is.

## RDE check

- Preserved: decision provenance and reviewability.
- Transformed: informal design discussion becomes durable repository history.
- Supplemented: AI-readable architectural memory.
- Unresolved: exact ADR review process.
- Deviation risk: ADRs may become ritual rather than real decision tools.
- Next update: add ADR template when implementation begins.
