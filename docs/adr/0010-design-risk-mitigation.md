# ADR 0010: Mitigate Kazane design risks through staged scope and responsibility boundaries

- Status: Proposed
- Date: 2026-06-29

## Context

Kazane is positioned as a Chronicle Work OS for human-AI organizations. It is intentionally broader than software development and is expected to support development, sales, documents, research, meetings, operations, customer support, accounting notes, and AI assistant workflows over time.

This breadth is strategically important, but it also creates design risks:

- Kazane may appear to be a generic workflow suite before it has a durable core.
- Kazane may be misunderstood as an autonomous AI company or a replacement for human responsibility.
- Kazane may collapse the distinction between Chronicle Stack as a provenance substrate and Kazane as an application-level work OS.
- Abstract architecture may advance faster than dogfooded operational proof.
- Agent automation may be prioritized over context sovereignty, handoff quality, evidence, review chains, and responsible escalation.
- Early UI and workflow design may become too broad for small organizations to understand, adopt, and trust.

The current README already states that Kazane is not a fully autonomous AI company, not a replacement for human responsibility, and not initially a large enterprise workflow suite. It also states that the first implementation is intentionally small, local-first, and dogfooded inside ZYX.

This ADR turns those positioning statements into an explicit risk mitigation decision.

## Decision

Kazane will mitigate its design risks by adopting a staged, small-organization-first product boundary and by keeping responsibility, provenance, and reviewability ahead of automation.

### 1. Keep Kazane as an application layer over Chronicle foundations

Kazane must not absorb Chronicle Stack conceptually or technically.

- Chronicle Stack remains the provenance, context, artifact, decision, evidence, boundary, and RDE record substrate.
- Chronicle Chat may serve as a conversation capture and meaning-event interface.
- Kazane remains the work operating system that manages Work Items, Context Cards, Handoff Notes, Evidence Logs, Review Chains, Escalation Gates, and responsibility boundaries.

Kazane may depend on Chronicle-compatible concepts and exports, but it should not claim to be the entire Chronicle substrate.

### 2. Narrow v0.x product proof to dogfooded small-organization workflows

Kazane's long-term scope can remain broad, but v0.x releases must prove depth before breadth.

The initial proof area is ZYX-internal work, especially:

- Kazane's own product and documentation workflow;
- AI-assisted development workflow;
- AI-assisted writing and research workflow;
- AI番頭 preparation workflow;
- small-business partner feedback and diagnostic workflow.

Kazane must not attempt to become a full enterprise workflow suite during v0.x.

### 3. Treat AI agents as work actors, not responsibility-bearing subjects

AI agents may pick up assigned work, produce drafts, inspect evidence, propose updates, summarize context, and return Handoff Notes.

They must not become responsibility-bearing organizational subjects.

Kazane must preserve a clear distinction between:

- actor: who or what performed an operation;
- reviewer: who reviewed it;
- accountable human: who accepted responsibility;
- evidence: what supports the work;
- boundary: what the AI was not allowed to decide or use.

### 4. Prefer escalation gates over blind completion

Kazane must make stopping a first-class success path.

An AI agent should return `Needs Human` or an equivalent escalation state when:

- evidence is missing or contradictory;
- required context is unavailable or blocked by boundary rules;
- the task crosses legal, financial, medical, security, employment, privacy, or customer-impact boundaries;
- the proposed output changes the original intent or meaning materially;
- the agent cannot explain why the work is safe to continue.

Escalation is not a failure. Silent completion across responsibility boundaries is the failure mode.

### 5. Require evidence-linked handoff before durable work acceptance

Kazane must not treat AI-generated output as durable work merely because it exists.

Durable acceptance should require, at minimum:

- a Handoff Note;
- linked Context Cards;
- linked Evidence Logs or source references;
- explicit status transition;
- human review where required;
- RDE audit or deviation-risk note when meaning may have changed.

### 6. Separate roadmap ambition from release promises

Kazane may document broad future ambitions, but release promises must remain narrow and testable.

Each release should define:

- what workflows are supported;
- what workflows are explicitly not supported;
- what AI agents may do;
- where AI must stop;
- what evidence and review are required;
- what context is local, private, exported, or shared;
- what claims remain provisional.

### 7. Make user trust and non-engineer comprehension part of the product boundary

Kazane is small-organization-first. Early design must be understandable by non-engineer operators.

The product should explain work, context, evidence, handoff, review, and responsibility in operational language before exposing abstract architecture terms.

Terms such as RDE, Chronicle, provenance, or context sovereignty may remain available for advanced users, but the ordinary UI must show what the user needs to decide next.

## Consequences

This decision slows down broad feature expansion, but reduces the risk of building an impressive abstraction that cannot be trusted or adopted.

It also prevents Kazane from being marketed as an autonomous organization simulator. Kazane should be understood as a responsibility-aware human-AI work OS, not an AI replacement for management, expertise, or accountability.

The separation between Chronicle Stack, Chronicle Chat, and Kazane keeps the architecture legible:

- Chronicle Stack records and reconstructs provenance.
- Chronicle Chat captures conversational meaning events.
- Kazane organizes work, handoff, evidence, review, escalation, and responsibility.

The cost is additional boundary documentation and more disciplined release scoping. The benefit is a stronger product identity and lower semantic drift.

## Implementation guidance

Near-term implementation should prioritize:

- a unified Work Item, Context Card, Handoff Note, Evidence Log, Review Chain, and Escalation Gate model;
- explicit `Needs Human` and boundary-blocked states;
- local-first storage and export paths;
- dogfooding dashboards for Kazane's own development and documentation work;
- release notes that distinguish supported workflows from future ambitions;
- RDE templates for detecting when generated work changed the original intent.

Kazane should not prioritize broad integrations until its core loop is demonstrably useful:

1. record why work exists;
2. assign or perform work;
3. capture context and evidence;
4. hand off clearly;
5. review and escalate responsibly;
6. preserve the decision and meaning change for future reconstruction.

## RDE check

- Preserved: Kazane's broad Chronicle Work OS ambition, context sovereignty, responsible escalation, written handoff, evidence-linked review, and local-first orientation.
- Transformed: broad product scope is converted into staged release discipline and dogfooded small-organization proof.
- Supplemented: explicit separation among Chronicle Stack, Chronicle Chat, and Kazane; explicit actor/reviewer/accountable-human distinction; explicit stopping criteria for AI agents.
- Unresolved: exact schema for Work Item, Context Card, Handoff Note, Evidence Log, Review Chain, and Escalation Gate; exact UI wording for non-engineer users.
- Deviation risk: this ADR may over-constrain product exploration if treated as a ban on future breadth rather than a staged risk mitigation policy.
- Next update: add a product-scope checklist to the roadmap or release template so each v0.x milestone states supported workflows, non-promises, evidence requirements, and escalation rules.
