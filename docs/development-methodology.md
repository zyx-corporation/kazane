# Development Methodology

Kazane development follows a prototype-first, test-first, and reviewable workflow.

This document defines how Kazane should be built, not only what Kazane should become.

## Core stance

Kazane is an AI-era work operating system. Its own development process must therefore preserve context, decisions, evidence, review, and responsibility boundaries.

The development method combines:

- Prototype First;
- TDD / Test First;
- T-RDE;
- Agile-inspired iteration;
- Kanban linked to GitHub Issues;
- written handoff and ADRs for meaningful decisions.

## Prototype First

Kazane should begin important product work with prototypes before committing to durable implementation.

A prototype may be:

- static HTML;
- clickable mock;
- local-only proof of concept;
- schema draft;
- CLI stub;
- fake-data workflow;
- UI-only screen;
- scripted agent flow.

Prototype First is not an excuse to skip design. It is a way to expose design assumptions early.

A prototype should answer:

1. Who is this for?
2. Which workflow does it make visible?
3. What context is preserved?
4. What handoff or evidence is produced?
5. What must remain human-reviewed?
6. What should be thrown away after learning?

Prototype code may be discarded. Prototype learning must be preserved.

## TDD and Test First

When implementation begins, tests should be written before or alongside behavior.

Test First applies especially to:

- data model validation;
- Work Item state transitions;
- Context Card linking;
- Handoff Note requirements;
- Evidence Log integrity;
- Escalation Gate rules;
- Agent permission checks;
- import/export compatibility;
- CLI and API contracts.

For UI-heavy prototype stages, snapshot tests or interaction tests may come after the first clickable prototype, but the transition from prototype to implementation should define tests before hardening.

## T-RDE

T-RDE means Test-based Resonant Deviation Evaluator.

In Kazane development, T-RDE checks whether an implementation preserves or distorts the original design intent.

T-RDE is not only a quality score. It asks:

- What was preserved from the original context?
- What was transformed?
- What was supplemented?
- What remains unresolved?
- What deviation risk was introduced?
- What should be updated next?

T-RDE should be used for:

- feature completion review;
- PR review for design-impacting changes;
- major documentation changes;
- changes to agent permissions;
- changes to Context Card, Handoff, Evidence, or RDE models;
- release readiness checks.

## Agile adaptation

Kazane uses Agile ideas pragmatically, not ceremonially.

Applicable practices:

- small increments;
- visible work board;
- frequent review;
- short feedback loops;
- explicit backlog;
- retrospectives where useful;
- definition of done;
- issue-linked work.

Kazane does not require strict Scrum ceremonies. Kanban-style flow is preferred for early development because work will include design, docs, prototypes, agent workflows, and research.

## Definition of Done

A Kazane Work Item is done only when the appropriate subset is complete:

- implementation or document update is complete;
- tests or validation are recorded;
- Handoff Note exists when work moved between actor types;
- Evidence is linked when claims or decisions depend on sources;
- Context Card is updated when design meaning changed;
- ADR exists for architecture, license, governance, or responsibility-boundary changes;
- T-RDE check is included for design-impacting changes.

## Human responsibility

AI agents may draft, implement, test, review, and summarize. Human maintainers remain responsible for final product direction, public claims, license policy, governance, and high-risk decisions.
