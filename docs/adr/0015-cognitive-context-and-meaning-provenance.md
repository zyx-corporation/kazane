# ADR 0015: Cognitive context and meaning provenance

- Status: Proposed
- Date: 2026-06-26

## Context

AI-agent workflow design often frames the bottleneck as human decision capacity. That view is useful but shallow.

Human cognition has multiple limits:

1. processing capacity;
2. meaning-space switching;
3. provenance retention;
4. value continuity;
5. recognition of unknown unknowns.

Kazane aims to be more than an AI-agent task or organization manager. It should become a context-memory substrate that preserves meaning, history, value continuity, and uncertainty signals across human-AI work.

## Decision

Adopt the Cognitive Context Design model as a core design layer for Kazane.

Kazane should explicitly support:

- Information Temperature Model;
- Meaning Jump Cost;
- Decision Level Model;
- Decision Provenance;
- Meaning Trace;
- Value Continuity Record;
- Unknown Unknown Review;
- Gate Evolution.

These concepts should influence v0.1 schema design, Work Item lifecycle, Context Card model, Escalation Gate design, Evidence Log, Audit Event, and RDE/T-RDE review.

## Consequences

Kazane's scope expands from AI-agent workflow management to distributed cognition support.

This makes Kazane more aligned with Chronicle Stack and Sayane, but it also increases conceptual weight. Implementation must remain phased so v0.0 and v0.1 are not overburdened.

## RDE check

- Preserved: context sovereignty, RDE/T-RDE, human responsibility, and AI-agent organization.
- Transformed: decision-load management becomes meaning-continuity management.
- Supplemented: cognitive-layer model, decision provenance, meaning trace, value continuity, unknown-unknown review, and gate evolution.
- Unresolved: exact schemas, UI representation, and how much of this enters v0.1.
- Deviation risk: Kazane may become too abstract unless linked to concrete Work Item and Context Card fields.
- Next update: add schema issues or update Issue #6 to include cognitive context fields.

## UIB check

The model improves Kazane's ability to handle uncertainty by making unknown-unknown signals explicit and allowing escalation gates to evolve through reviewed updates.
