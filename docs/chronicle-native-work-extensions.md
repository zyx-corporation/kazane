# Chronicle Native Work Extensions

This document records proposed additions to Kazane / Chronicle Work OS based on a comparison with recent AI-native development workflows, especially workflows where an AI model expands product intent into a PRD and an agentic IDE executes small implementation tasks.

The additions below are not intended to turn Kazane into a narrow AI IDE. They are intended to strengthen Kazane as a Chronicle Work OS: an environment where human and AI work is managed with context, evidence, handoff, review, responsibility boundaries, and traceable meaning.

## Positioning

AI-native development workflows are useful because they make the interaction between a human intent, a product requirement, an agent task, and a concrete output feel immediate. Kazane should adopt the useful interaction patterns without adopting the underlying reduction that work is complete when an artifact is generated.

Kazane's stronger position is Chronicle-native work:

```text
Human intent
  -> Chronicle context
  -> Living requirement
  -> AI task request
  -> Micro change
  -> Review and evidence
  -> RDE audit
  -> Chronicle update
  -> Reusable knowledge
```

The implementation target is therefore not only faster generation. The target is auditable continuity from intention to artifact to future reuse.

## 1. Living PRD

### Purpose

Add a Living PRD layer between an initial Intent and downstream implementation or execution. A PRD is not treated as a frozen handoff document. It is treated as a living Chronicle object that records what is currently believed, what remains uncertain, and why each requirement exists.

### Core model

A Living PRD should contain at least:

- `intent`: the originating user, business, design, or operational intent;
- `target_users`: who the work is for;
- `problem_statement`: what pressure or opportunity caused the work;
- `requirements`: functional and non-functional requirements;
- `assumptions`: claims not yet verified;
- `open_questions`: unresolved questions that may change the work;
- `risks`: product, operational, ethical, privacy, security, and maintenance risks;
- `evidence_links`: sources, discussions, issues, files, or observations supporting the requirement;
- `decision_links`: accepted or rejected decisions that shaped the PRD;
- `rde_notes`: semantic drift, preservation, transformation, supplementation, unresolved items, and deviation risks.

### Workflow

```text
Intent
  -> Living PRD v1
  -> AI review
  -> Human review
  -> Living PRD v2
  -> Work Item / Issue / Implementation
  -> Chronicle update
```

### Design rule

The Living PRD is not the source of authority by itself. It is a negotiated state of the current understanding. Authority remains with accountable human judgment, evidence, review chain, and Chronicle provenance.

## 2. AI Activity Timeline

### Purpose

Make AI work legible while it is happening. Instead of a generic `Thinking...` state, Kazane should expose the current activity stage of the AI or agent workflow.

### Example states

- `Reading Chronicle...`
- `Searching related context...`
- `Comparing prior decisions...`
- `Drafting Living PRD...`
- `Generating task plan...`
- `Preparing micro change...`
- `Running tests...`
- `Collecting evidence...`
- `Running RDE audit...`
- `Preparing handoff note...`
- `Waiting for human approval...`

### Minimal fields

Each activity entry should include:

- `activity_type`;
- `actor`;
- `target_object`;
- `started_at`;
- `ended_at` when complete;
- `status` such as `running`, `blocked`, `completed`, or `needs_human`;
- optional `confidence`;
- optional `evidence_links`;
- optional `handoff_summary`.

### Design rule

The timeline must not pretend to expose private chain-of-thought. It should expose work state, evidence state, and decision state. Kazane should show what the agent is doing, what it used, what it changed, and where it needs a human, not hidden reasoning traces.

## 3. Micro Change Workflow

### Purpose

Make small, reviewable changes the default unit of AI-assisted work. This prevents large opaque edits, supports rollback, and aligns with TDD, Test First, T-RDE, Git evidence, and ProofDeltaX.

### Workflow

```text
Micro intent
  -> Proposed micro change
  -> Evidence and test expectation
  -> Apply change
  -> Review
  -> Chronicle record
  -> Next micro change
```

### Required metadata

A Micro Change should include:

- `change_intent`: what this small change is trying to accomplish;
- `scope`: files, objects, workflows, or documents affected;
- `expected_delta`: what meaning or behavior should change;
- `non_goals`: what must not be changed;
- `test_or_check`: how to verify the change;
- `rollback_hint`: how to revert or neutralize the change;
- `rde_delta_summary`: preserved, transformed, supplemented, unresolved, and risk elements.

### Design rule

Kazane should discourage broad instructions such as `fix everything` unless they are decomposed into reviewable Micro Changes first.

## 4. Chronicle Diff

### Purpose

Add a semantic diff layer over Chronicle objects. Git diff shows textual changes. Chronicle Diff should show meaning-level changes across Intent, Living PRD, Work Item, Evidence Log, Handoff Note, Design, Prompt, Code, Document, or Knowledge objects.

### Diff dimensions

Chronicle Diff should classify changes into:

- `preserved`: meaning retained from the prior state;
- `transformed`: meaning changed or reframed;
- `supplemented`: meaning added to cover gaps;
- `weakened`: original claim, value, or constraint became weaker;
- `strengthened`: original claim became stronger and may require evidence;
- `omitted`: prior element disappeared;
- `contradicted`: new state conflicts with earlier evidence or decision;
- `unresolved`: open question remains;
- `risk`: deviation or operational risk introduced.

### Example view

```text
Compared with previous PRD version:

Preserved
- Local-first boundary remains unchanged.
- Human escalation remains mandatory for responsibility-bearing decisions.

Transformed
- Agent work visibility changed from a log-only concept to an Activity Timeline UI.

Supplemented
- Micro Change metadata now includes rollback hints and expected semantic delta.

Risk
- Confidence display may be mistaken for truth unless evidence links and human verification are shown together.
```

### Design rule

Chronicle Diff is not a quality score. It is a difference audit. It asks how meaning changed, not whether the new version is simply better.

## 5. Intent Graph

### Purpose

Add a graph view that connects why work began to what it produced. Git has commit graphs. Kazane should have Intent Graphs.

### Graph shape

```text
Idea / Pressure / Need
  -> Intent
  -> Context Card
  -> Living PRD
  -> Work Item
  -> AI Task Request
  -> Handoff Note
  -> Evidence Log
  -> Review
  -> Micro Change
  -> Commit / File / Document / Artifact
  -> Release / Publication / Knowledge Update
```

### Node types

Initial node types:

- `Intent`;
- `ContextCard`;
- `LivingPRD`;
- `WorkItem`;
- `AITaskRequest`;
- `HandoffNote`;
- `EvidenceLog`;
- `Review`;
- `RDEAudit`;
- `MicroChange`;
- `Artifact`;
- `Decision`;
- `KnowledgeUpdate`.

### Edge types

Initial edge types:

- `originates_from`;
- `refines`;
- `depends_on`;
- `implements`;
- `reviews`;
- `cites_evidence`;
- `changes_meaning_of`;
- `blocks`;
- `supersedes`;
- `publishes`;
- `updates_context`.

### Design rule

The Intent Graph should help a user answer:

- Why did this work exist?
- Who or what changed it?
- What evidence supported it?
- Which decision accepted or rejected it?
- What artifact resulted?
- What knowledge changed afterward?

## 6. AI Task Request

### Purpose

Treat natural-language requests as structured work requests, not raw prompts. A user should be able to say `review this design`, `split this into issues`, `draft the PRD`, `run an RDE audit`, or `prepare a handoff`, and Kazane should convert that into an Intent-linked task object.

### Minimal fields

An AI Task Request should include:

- `request_text`;
- `normalized_intent`;
- `requester`;
- `assigned_agent_or_role`;
- `context_links`;
- `permission_scope`;
- `expected_output`;
- `requires_human_approval`;
- `evidence_requirement`;
- `handoff_requirement`.

### Design rule

Prompt text is not the durable object. The durable object is the task request plus context, permission, expected output, evidence, and handoff.

## 7. Self-Healing Workflow

### Purpose

Allow Kazane to notice broken work states and propose repair without silently mutating important records.

### Workflow

```text
Detect anomaly
  -> Analyze likely causes
  -> Collect evidence
  -> Propose repair
  -> Human approval when needed
  -> Apply micro change
  -> Chronicle record
```

### Initial anomaly types

- missing evidence;
- stale Work Item;
- broken Context link;
- Handoff Note without recipient;
- AI Task Request without permission scope;
- Living PRD with unresolved critical assumptions;
- RDE audit missing for audit-required work;
- failed test or build evidence;
- contradiction between current document and prior accepted decision.

### Design rule

Self-healing is not self-authorization. Repairs that affect meaning, responsibility, external communication, security, or customer-facing output require escalation.

## 8. Chronicle Progress

### Purpose

Show progress as understanding and audit readiness, not only task completion percentage.

### Example dimensions

- `intent_clarity`;
- `context_coverage`;
- `requirement_stability`;
- `evidence_coverage`;
- `review_readiness`;
- `implementation_readiness`;
- `audit_readiness`;
- `handoff_readiness`.

### Design rule

Chronicle Progress must not become a false precision score. Prefer coarse levels such as `missing`, `weak`, `usable`, `strong`, and `verified` unless there is a grounded measurement.

## 9. AI Confidence View

### Purpose

Show confidence as an evidence-aware operational signal, not as a claim of truth.

### Suggested components

- model self-estimated confidence, if available;
- evidence count and quality;
- contradiction count;
- freshness of sources;
- human verification state;
- Chronicle coverage;
- unresolved assumption count.

### Design rule

Confidence must be displayed near evidence and verification state. A high-confidence unsupported claim should be visibly weaker than a moderate-confidence claim with strong evidence and human review.

## 10. Chronicle Replay

### Purpose

Allow users to replay the history of a work item or decision from origin to current state.

### Replay sequence

```text
Originating context
  -> Initial intent
  -> AI task request
  -> Draft / proposal
  -> Review
  -> Rejection or acceptance
  -> Micro changes
  -> Evidence
  -> RDE audit
  -> Final artifact
  -> Knowledge update
```

### Design rule

Replay should support understanding and accountability. It should not be a decorative animation. The user must be able to inspect evidence, decisions, handoffs, and changes at each step.

## Release placement proposal

The features can be staged without overloading the early prototype.

| Feature | Suggested release | Reason |
|---|---:|---|
| AI Activity Timeline | v0.2 | Needed when agents begin to pick up assigned work |
| AI Task Request | v0.2 | Natural entry point for agent-assigned work |
| Living PRD | v0.3 | Needed when work, decisions, and outputs become traceable history |
| Micro Change Workflow | v0.4 | Best aligned with development workflow proof, GitHub linkage, tests, and T-RDE |
| Intent Graph | v0.4-v0.5 | Useful once Context, Work Items, GitHub, and artifacts are linkable |
| Chronicle Diff | v0.6 | Requires enough Chronicle history and RDE structure to be meaningful |
| AI Confidence View | v0.6 | Should mature together with Evidence Log and RDE Audit |
| Chronicle Progress | v0.6-v0.8 | Requires stable progress dimensions and partner feedback |
| Self-Healing Workflow | v0.7-v0.8 | Safer after permission, evidence, and escalation patterns exist |
| Chronicle Replay | v0.8-v1.0 | Product-level differentiator once enough provenance exists |

## RDE notes for this addition

### Preserved elements

- Kazane remains broader than a development tool.
- Context sovereignty remains more important than blind automation.
- Evidence, Handoff, Escalation, and RDE remain central.
- Human responsibility is not replaced by agent execution.

### Transformed elements

- PRD moves from an external planning document to a first-class Chronicle object.
- Progress moves from task completion to understanding, evidence, review, and audit readiness.
- Diff moves from file-level change to semantic change.

### Supplemented elements

- Adds UX affordances for observing AI work while it is happening.
- Adds Micro Change as a default work unit.
- Adds Intent Graph and Chronicle Replay as provenance-native views.

### Unresolved elements

- Exact schema and storage model for Living PRD, Chronicle Diff, and Intent Graph.
- Whether Intent Graph should be implemented first as a read-only derived graph or as a directly editable model.
- How to prevent confidence and progress indicators from becoming misleading authority signals.

### Deviation risks

- Kazane could drift toward an AI IDE if implementation workflows dominate the UI.
- Confidence views could be mistaken for truth.
- Self-healing could become unsafe if approval boundaries are weak.
- Living PRD could become bureaucratic unless it remains lightweight and evidence-linked.

### Next update policy

Before implementing these features, create small ADRs or issue epics for:

1. Living PRD schema;
2. AI Activity Timeline event model;
3. Micro Change metadata and T-RDE integration;
4. Chronicle Diff semantic categories;
5. Intent Graph node and edge taxonomy.
