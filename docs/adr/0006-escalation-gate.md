# ADR 0006: Escalation Gate

- Status: Accepted
- Date: 2026-06-26

## Context

AI agents can perform work, but final responsibility remains with humans and organizations. Boundaries must be explicit.

## Decision

Introduce Escalation Gates to define when AI must stop, request review, or return work to humans.

## Consequences

This supports trust. It may slow workflows when responsibility boundaries are reached, which is intentional.

## RDE check

- Preserved: AI as work actor and human as final decision holder.
- Transformed: stopping becomes a normal workflow state.
- Supplemented: explicit responsibility boundaries.
- Unresolved: exact gate taxonomy.
- Deviation risk: too many gates may block useful work.
- Next update: define gate rules by work type.
