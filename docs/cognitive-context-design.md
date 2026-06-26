# Cognitive Context Design

Kazane is not only an AI-agent operations system. It is a context-memory substrate for extending human cognition across time, work, agents, and organizational boundaries.

This document records the cognitive design implications from the discussion around AI-agent executive layers, RDE, UIB, Chronicle Stack, and Sayane.

## Core thesis

AI-agent operations should not be framed only as reducing the number of human decisions.

The deeper problem is that humans lose continuity across meaning, history, value, and uncertainty.

Kazane should therefore support:

- decision routing;
- context preservation;
- meaning trace;
- value continuity;
- unknown-unknown review;
- reinterpretation and audit over time.

## Five-layer model of human cognitive limits

### Layer 1: Processing capacity

This is the layer most AI-agent workflow videos discuss.

It includes:

- working memory;
- attention limits;
- decision fatigue;
- time constraints;
- executive function load.

Agent organization and executive layers help here by reducing direct decision pressure on the human operator.

Kazane support:

- Agent Organization;
- Work Board;
- Executive Agent layer;
- Escalation Gate;
- queueing and prioritization;
- operational health checks.

### Layer 2: Meaning-space limits

Humans do not process work only as information volume. They move through meaning spaces.

One hundred decisions in the same context may be manageable. Ten decisions across development, sales, legal, accounting, family, politics, and research may be exhausting because each requires a context switch.

The bottleneck is not only decision count. It is meaning-space jump cost.

Kazane support:

- Context Card;
- Context Engine;
- Information Temperature Model;
- Work Item to Context linkage;
- context-switch markers;
- meaning-space tags.

### Layer 3: Provenance retention limits

Humans remember what was decided more easily than why it was decided.

After days or weeks, the original fear, constraint, evidence, tension, and rejected alternatives are often lost.

This is not only a memory problem. It is a provenance-retention problem.

Kazane support:

- Decision Provenance;
- Handoff Note;
- Evidence Log;
- Context Update;
- ADR;
- Meaning Trace;
- Chronicle.

### Layer 4: Value-continuity limits

Judgment is not only selection among options. It is preservation of a value system under pressure.

Important decisions ask:

- who should be protected;
- what may be sacrificed;
- whether present or future should be prioritized;
- which principle outranks another principle;
- which compromise is tolerable.

The hardest part is not deciding quickly. It is keeping values coherent across many decisions and over time.

Kazane support:

- Design Principles;
- Value Continuity Record;
- RDE / T-RDE;
- decision-level review;
- explicit trade-off records;
- principle references in Work Items and PRs.

### Layer 5: Ontological limits

Humans and AI systems both have limits in knowing what they do not know.

The dangerous state is not low confidence. It is misplaced confidence.

Unknown Unknowns include:

- a case that looks familiar but has a different premise;
- a local change that alters product philosophy;
- a summary that changes responsibility;
- a safe-looking operation that leaks context;
- a new risk not covered by existing gates.

Kazane support:

- Unknown Unknown Review;
- UIB-oriented review;
- Gate Evolution;
- anomaly flags;
- similarity-but-not-same detection;
- RDE deviation-risk escalation.

## Design additions for Kazane

### 1. Information Temperature Model

Kazane should classify information by update frequency and meaning stability, not only by static/dynamic categories.

Suggested categories:

| Category | Meaning | Examples |
|---|---|---|
| Cold | stable principles | values, design principles, governance assumptions |
| Cool | slow-changing context | project direction, customer context, agent manuals |
| Warm | active working context | Work Items, current sprint/board state, active decisions |
| Hot | volatile execution state | runtime logs, temporary notes, heartbeats, queue state |
| Trace | audit/provenance state | Evidence Log, Audit Event, Decision Provenance, RDE results |

The key is that Trace is not just old Hot data. It is intentionally preserved provenance.

### 2. Meaning Jump Cost

Work Items should be able to record when they require movement across meaning spaces.

Examples:

- development to legal;
- research to sales;
- family context to business decision;
- accounting to product strategy;
- security to UX.

This helps explain why some small tasks are cognitively expensive.

Possible fields:

```yaml
meaning_jump:
  from_context: product_strategy
  to_context: legal_risk
  jump_cost: high
  reason: "The task changes public claims and therefore affects responsibility."
```

### 3. Decision Level Model

Kazane should expand Level 1 / 2 / 3 decision routing beyond reversibility.

Suggested axes:

- reversibility;
- privilege/security impact;
- meaning-change impact;
- responsibility impact;
- uncertainty class.

Example levels:

| Level | Meaning | Default handler |
|---|---|---|
| L1 | reversible local work | field agent |
| L2 | design or context-affecting work | lead/executive agent + review |
| L3 | strategic, security, legal, public, irreversible, or high-responsibility work | human approval |
| L4 | meta-level change to gates, principles, governance, or value model | human + RDE/T-RDE + ADR |

Kazane should not treat a technically reversible change as low risk if it changes meaning or responsibility.

### 4. Decision Provenance

A decision is incomplete without provenance.

Decision Provenance should record:

- decision summary;
- why this decision was made;
- rejected alternatives;
- trade-offs;
- evidence used;
- assumptions;
- confidence and uncertainty class;
- relevant Design Principles;
- expected future review trigger;
- previous related decision;
- meaning change from previous state.

### 5. Meaning Trace

Meaning Trace records how a Work Item, Context Card, or design decision changed meaning over time.

This is the operational form of RDE.

Suggested RDE/T-RDE fields:

- preserved;
- transformed;
- supplemented;
- unresolved;
- deviation risk;
- next update;
- linked evidence;
- linked context update;
- linked decision provenance.

### 6. Value Continuity Record

Kazane should record which value or design principle a decision preserves.

This matters because work often fails not by being incorrect, but by becoming value-incoherent.

Possible fields:

```yaml
value_continuity:
  principles:
    - context_sovereignty_over_automation
    - responsible_escalation_over_blind_completion
  tradeoff: "Slower implementation accepted to preserve privilege boundary."
  value_risk: "Prototype may become too complex before v0.0."
```

### 7. Unknown Unknown Review

Kazane should support explicit recording of cases where the current classification may be inadequate.

Possible triggers:

- agent says the task does not fit known categories;
- reviewer detects a new kind of risk;
- a decision surprised the team;
- a failed task reveals an unknown assumption;
- RDE detects unexplained meaning drift;
- a human approver feels unease without a clear rule.

Possible outputs:

- new Escalation Gate proposal;
- new ADR;
- Context Card update;
- policy update proposal;
- new issue;
- T-RDE review requirement.

### 8. Gate Evolution

Escalation Gates must be allowed to evolve.

However, AI agents must not directly change gate policy. They may propose changes.

Gate updates should require:

- reason;
- example case;
- affected Work Item types;
- policy diff;
- expected false positives and false negatives;
- human approval;
- ADR for durable changes.

## Relationship to RDE

RDE reframes the bottleneck.

The bottleneck is not the number of decisions a human can make. The deeper bottleneck is whether the system can audit meaning change.

In RDE terms, Kazane should capture:

```text
Task
↓
Decision
↓
Meaning
↓
History
↓
Resonance
↓
Audit
```

## Relationship to UIB

UIB reframes intelligence.

Intelligence is not decision speed or decision volume. It is the ability to update the model when encountering the unknown.

Kazane should therefore track:

- uncertainty class;
- unknown-unknown signals;
- model update after failure;
- gate evolution;
- decision reinterpretation;
- context revision.

## Relationship to Chronicle Stack and Sayane

AI-agent organization answers: who does the work and who decides?

Chronicle Stack answers: how is meaning preserved over time?

Sayane answers: how is joint human-AI thought audited?

Kazane should connect these layers operationally:

```text
Agent Organization
↓
Work Flow
↓
Decision Provenance
↓
Context Chronicle
↓
RDE / T-RDE
↓
Reinterpretation
```

## Summary

Kazane should not merely reduce human decision load.

Kazane should extend human cognition by preserving the context, history, value continuity, and uncertainty signals that individual humans cannot reliably hold over time.

In short:

> Kazane is a context-memory substrate for distributed cognition.
