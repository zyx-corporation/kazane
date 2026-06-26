# Architecture Overview

## Scope

Kazane is a human–AI work operating system. It is not limited to development. It manages workflows across business functions wherever AI agents can assist.

## Initial platform assumptions

Runtime targets:

- macOS
- Linux

Initial UI:

- web UI

Future GUI:

- shared macOS/Linux GUI, likely using a cross-platform desktop shell.

## Conceptual architecture

```text
Human Operators
      │
      ▼
Flow Dashboard ───── Ops Health
      │
      ▼
Work Board ──────── Handoff System
      │                  │
      ▼                  ▼
Context Engine ─── Evidence Log
      │                  │
      ▼                  ▼
Agent Organization ─ Review / RDE Audit
      │
      ▼
Agent Runtime / CLI / MCP / Local Tools
```

## Core modules

### Flow Dashboard

Shows the current state of work, AI activity, human decisions, blocked items, audit needs, and operations health.

### Work Board

A shared board for humans and AI agents. It manages Work Items, not only software issues.

Work Items may represent development issues, customer email, sales follow-up, document draft, meeting preparation, research tasks, accounting notes, legal prechecks, content review, AI番頭 workflow, or operations maintenance.

### Context Engine

Stores shared organizational memory and work context.

Context types include project context, customer context, design strategy, business context, technical context, brand/voice context, operations context, risk/legal context, agent manuals, handoff context, and RDE context.

### Agent Organization

Defines AI agents as first-class work actors. An agent includes manual, model policy, desk/context scope, tools, permissions, review chain, escalation rules, and health expectations.

### Handoff System

Records durable handoff notes between agents and humans.

### Escalation Gate

Defines when AI must stop and return work to a human or higher review layer.

### Evidence Log

Links work outputs to sources, documents, issues, emails, files, commands, and decisions.

### RDE Audit

Inspects semantic change: preserved elements, transformed elements, supplemented elements, unresolved elements, deviation risks, and next update policy.

### Ops Health

Detects operational drift such as Done without Handoff, Handoff without Evidence, stale Work Items, missing Context updates, failed scheduled agent runs, repeated agent failures, permission drift, and broken evidence references.

## Data-first principle

The UI is a projection of structured state. AI agents should not depend on visual UI. They should access stable structured data through files, APIs, CLI, or MCP.
