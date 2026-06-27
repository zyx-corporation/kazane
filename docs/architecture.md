# Architecture Overview

## Scope

Kazane is a human–AI work operating system. It is not limited to development. It manages workflows across business functions wherever AI agents can assist.

This file provides the short conceptual overview. The expanded multi-plane structure is defined in [architecture-v2.md](architecture-v2.md). Security details are defined in [security-architecture.md](security-architecture.md). Cognitive-context design is defined in [cognitive-context-design.md](cognitive-context-design.md).

## Initial platform assumptions

Kazane is Tauri-first from the prototype stage.

Runtime targets:

- macOS
- Linux

Future target in view:

- iOS

The product may use web technologies inside Tauri, but the runtime boundary is the Tauri application, not a browser-only Web UI.

## Conceptual architecture

```text
Human Operators
      │
      ▼
Tauri GUI / Remote GUI ─ Access / Auth
      │
      ▼
Local Orchestrator ───── Privilege Manager
      │                       │
      ▼                       ▼
Work Board ─ Context ─ Evidence ─ Audit
      │             │             │
      │             ▼             ▼
      │       Meaning Trace ─ RDE / T-RDE
      │             │
      ▼             ▼
Local / Remote Agent Runtime
      │
      ▼
Connectors / Models / Tools
```

## Core modules

### Flow Dashboard

Shows the current state of work, AI activity, human decisions, blocked items, audit needs, and operations health.

### Work Board

A shared board for humans and AI agents. It manages Work Items, not only software issues.

Work Items may represent development issues, customer email, sales follow-up, document draft, meeting preparation, research tasks, accounting notes, legal prechecks, content review, AI番頭 workflow, or operations maintenance.

### Context Engine

Stores shared organizational memory and work context.

Context types include project context, customer context, design strategy, business context, technical context, brand/voice context, operations context, risk/legal context, agent manuals, handoff context, RDE context, meaning trace, decision provenance, value continuity, and unknown-unknown review.

### Local Orchestrator

Owns work state, dispatch, leases, context linkage, handoff intake, evidence intake, and escalation.

### Privilege Manager

Owns typed privileged operations, policy checks, secret access, approval flow, and audit events.

### Agent Organization

Defines AI agents as first-class work actors. An agent includes manual, model policy, desk/context scope, tools, permissions, review chain, escalation rules, and health expectations.

Agent Organization may include an Executive Layer to reduce human decision concentration, but this layer does not replace human responsibility. It should remain auditable through Decision Provenance, RDE/T-RDE, and Meta-Executive review.

### Handoff System

Records durable handoff notes between agents and humans.

### Escalation Gate

Defines when AI must stop and return work to a human or higher review layer.

Escalation should be driven not only by reversibility, but also by privilege/security impact, meaning-change impact, responsibility impact, and uncertainty class. Gates may evolve through reviewed proposals when Unknown Unknowns are detected.

### Evidence Log

Links work outputs to sources, documents, issues, emails, files, commands, and decisions.

### Meaning Trace and Decision Provenance

Records why a decision was made, what alternatives were rejected, what changed from the previous context, which values were prioritized, and which Evidence, Context Updates, and T-RDE results are linked.

### RDE Audit

Inspects semantic change: preserved elements, transformed elements, supplemented elements, unresolved elements, deviation risks, and next update policy.

### Ops Health

Detects operational drift such as Done without Handoff, Handoff without Evidence, stale Work Items, missing Context updates, failed scheduled agent runs, repeated agent failures, permission drift, broken evidence references, and unexplained meaning drift.

## Data-first principle

The UI is a projection of structured state. AI agents should not depend on visual UI. They should access stable structured data through files, APIs, CLI, or MCP.
