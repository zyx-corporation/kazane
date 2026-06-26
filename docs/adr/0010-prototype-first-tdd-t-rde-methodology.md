# ADR 0010: Prototype First, TDD, Test First, and T-RDE methodology

- Status: Accepted
- Date: 2026-06-26

## Context

Kazane is both a product and the work system used to build itself. AI-assisted work can produce fast outputs, but fast outputs can hide broken assumptions, weak tests, and semantic drift.

## Decision

Adopt the following development methodology:

- Prototype First for uncertain workflow and UI discovery;
- TDD / Test First for durable implementation;
- T-RDE for design-impacting changes;
- written handoff and evidence for agent-assisted work;
- human review for responsibility-boundary changes.

## Consequences

This keeps early work exploratory while preventing prototypes from silently becoming untested product code. It also gives AI agents a clear standard for what done means.

## RDE check

- Preserved: Kazane's emphasis on context, evidence, and review.
- Transformed: development process becomes part of product doctrine.
- Supplemented: TDD/Test First and T-RDE are explicit.
- Unresolved: concrete test framework and implementation stack.
- Deviation risk: method may become ceremonial if not enforced in PRs.
- Next update: add v0.1 schema tests once implementation starts.
