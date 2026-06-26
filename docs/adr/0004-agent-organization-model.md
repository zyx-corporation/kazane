# ADR 0004: Agent organization model

- Status: Proposed
- Date: 2026-06-26

## Context

Kazane needs to manage multiple AI agents with different roles and responsibilities.

## Decision

Represent agent teams, roles, manuals, work areas, permissions, review chains, and status expectations as project data.

## Consequences

This enables structured AI operations. It also adds complexity and requires careful responsibility framing.

## RDE check

- Preserved: AI agents as work actors, not responsibility subjects.
- Transformed: informal prompts become organization data.
- Supplemented: review chains and model routing.
- Unresolved: minimal v0.1 Agent Profile schema.
- Deviation risk: AI employee metaphor may become too strong.
- Next update: define Agent Profile v0.1.
