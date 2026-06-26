# ADR 0003: Context Card as primary work context

- Status: Accepted
- Date: 2026-06-26

## Context

Kazane must not become a generic task board. Work Items need durable context describing why the work exists and what value it should create.

## Decision

Make Context Card a primary model rather than an optional note attached to tasks.

## Consequences

This improves provenance and AI output quality. It also requires more disciplined workflow design.

## RDE check

- Preserved: context sovereignty.
- Transformed: task background becomes first-class state.
- Supplemented: design strategy can be attached to work.
- Unresolved: exact context granularity.
- Deviation risk: users may treat Context Cards as bureaucratic overhead.
- Next update: define minimal Context Card schema.
