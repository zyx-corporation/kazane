# ADR 0014: Chronicle-aware harness routing

- Status: Proposed
- Date: 2026-07-09

## Context

Recent AI coding systems, including Devin Fusion, show that the competitive axis for AI-assisted software development is moving from model capability alone to harness design.

A harness is the operational layer around an LLM: prompt structure, tool descriptions, task decomposition, model routing, feedback, test execution, review loops, and escalation. In coding work, this layer can decide which model performs which part of the work, when to switch models, how to verify output, and when to ask for human judgment.

Devin Fusion demonstrates a useful pattern: keep a higher-capability main agent responsible for planning, ambiguity handling, and final judgment while delegating mechanical or verifiable work to lower-cost sidekick agents. This can reduce cost without necessarily reducing performance for tasks such as test execution, mechanical refactoring, search, or simple code transformation.

However, this pattern also exposes a critical risk. Some work can be delegated safely because it is mechanical or verifiable. Other work is itself judgment: UX intent, design philosophy, long-term maintainability, ambiguous requirements, business intent, and team-specific context. Delegating those parts can silently lose meaning.

For Kazane, this distinction is central. Kazane is not merely a coding assistant or an execution router. Kazane must preserve intent, decision provenance, context, and meaning change. Therefore, Kazane and Koguchi Service need a Chronicle-aware harness model rather than a simple cost-optimizing model router.

## Decision

Adopt **Chronicle-aware harness routing** as a Kazane/Koguchi architectural principle.

Kazane may use multiple models, agents, tools, and execution workers. Koguchi Service may route work across them. However, routing must be based not only on cost, latency, or benchmark score, but also on intent criticality, uncertainty, reviewability, reversibility, and Chronicle linkage.

The system must distinguish between:

1. **Judgment-bearing work**: work where the output changes product intent, user experience, architectural direction, security posture, business meaning, policy, or long-term maintainability.
2. **Mechanical work**: work that follows an already accepted decision and can be verified through tests, diffs, schemas, static checks, or explicit acceptance criteria.
3. **Exploratory work**: work that gathers information, proposes alternatives, or creates drafts without committing to a decision.
4. **Verification work**: work that tests, reviews, compares, or audits generated artifacts.

Routing rules must preserve this distinction.

- Judgment-bearing work must remain with a high-trust model, an explicitly authorized agent role, or a human reviewer.
- Mechanical work may be delegated to lower-cost models, local models, deterministic tools, or sidekick agents.
- Exploratory work may be delegated, but its status must remain non-authoritative until reviewed.
- Verification work should be separated from generation when feasible, and may use independent models or deterministic checks.

Every delegated work item should be linked to its source Intent, Decision, Constraints, Acceptance Criteria, and Chronicle entry when those objects exist.

## Consequences

### Cost optimization is subordinate to meaning preservation

Koguchi may reduce cost by delegating suitable work to cheaper models or local agents, but cost reduction must not be treated as success if the generated output loses intent, weakens constraints, or hides a meaning change.

### Routing decisions become auditable events

When Koguchi delegates work, switches models, escalates to a higher-trust agent, or asks for human review, that decision should be recorded as an audit event. At minimum, the event should include the source work item, routing reason, target agent/model/tool, expected verification method, and resulting artifact link.

### Sidekick outputs are not automatically authoritative

A sidekick agent may produce code, documents, diffs, tests, notes, or analysis, but its output becomes authoritative only after passing the required review path for the work type.

### Tests are necessary but not sufficient

Passing tests can verify expected behavior, but it does not prove that design intent, user meaning, or Chronicle continuity were preserved. Kazane must keep test-based validation separate from RDE review.

### Human review should focus on judgment, not mechanical inspection

The system should offload mechanical checks to tools and agents where safe. Human review should focus on intent preservation, architectural direction, risk acceptance, and irreversible decisions.

### Koguchi Service becomes a meaning-aware coordination boundary

Koguchi should not be implemented as a simple model router. It is a semantic coordination layer that connects Intent Graph, Chronicle, task decomposition, agent execution, verification, and RDE review.

## Design requirements

### Work classification

Kazane must classify work items by at least:

- intent criticality;
- uncertainty level;
- reversibility;
- verification method;
- required authority;
- Chronicle linkage;
- data sensitivity;
- expected artifact type.

Initial implementation may use explicit metadata and conservative defaults rather than automatic classification.

### Routing policy

Koguchi must support routing policies that can express:

- when a task may be delegated to a lower-cost model;
- when a task requires a high-trust model;
- when a task requires human approval;
- when local-only execution is required;
- when output must be treated as draft or evidence only;
- when RDE review must be attached before completion.

### RDE delta capture

For generated artifacts, Kazane should capture a lightweight RDE delta:

- preserved intent;
- transformed intent;
- supplemented assumptions or structures;
- unresolved issues;
- deviation risks;
- next review/update action.

This may begin as Markdown or JSON attached to the work item and later evolve into a structured schema.

### Verification separation

Generation and verification should be separated where practical. A model or agent that generated a change should not be the only verifier of that change if the work item is high-impact or judgment-bearing.

### Escalation path

If a delegated agent detects ambiguity, missing context, conflicting constraints, or possible intent drift, it must be able to escalate back to the main agent or human reviewer rather than completing the task as if it were mechanical.

## Initial policy sketch

- Mechanical refactoring with tests: may delegate to sidekick/local/cheaper model; require test evidence and diff summary.
- Documentation formatting: may delegate; require human or main-agent review if meaning changes.
- Architecture decision text: do not delegate final wording to low-trust sidekick without RDE review.
- Security or privilege boundary change: require high-trust model plus human review.
- UX flow or product intent change: require Chronicle linkage and explicit review.
- Data-sensitive task: prefer local execution or approved provider boundary.
- Exploratory comparison: may delegate, but mark output as non-authoritative evidence.

## Alternatives considered

### Alternative 1: Single best model for all work

This is simple and reduces routing complexity, but it is costly and does not exploit the fact that many tasks are mechanical or verifiable.

Rejected.

### Alternative 2: Cost-first model routing

This can reduce cost and latency, but it risks optimizing away meaning preservation. It may treat successful output as equivalent to intent-preserving output.

Rejected.

### Alternative 3: Static task-type routing

This is easier to implement than dynamic routing, but it cannot handle cases where a task starts mechanical and becomes judgment-bearing, or starts ambiguous and becomes verifiable.

Partially accepted for early implementation only.

### Alternative 4: Chronicle-aware harness routing

This treats routing as part of Kazane's responsibility to preserve intent, decision provenance, and meaning change. It allows cost optimization while keeping reviewability and responsibility boundaries explicit.

Accepted.

## RDE check

- Preserved: Kazane's commitment to intent, Chronicle, reviewability, and human responsibility.
- Preserved: Koguchi Service as an execution and coordination boundary rather than a hidden privileged path.
- Transformed: model routing is reframed from cost optimization to meaning-aware work delegation.
- Transformed: AI coding-agent patterns become a general Kazane/Koguchi harness principle.
- Supplemented: explicit distinctions among judgment-bearing, mechanical, exploratory, and verification work.
- Supplemented: sidekick output authority rules, routing audit events, and RDE delta capture.
- Unresolved: concrete routing schema, confidence signals, provider abstraction, storage format for RDE deltas, and policy enforcement mechanism.
- Deviation risk: over-classification may slow the system and harm usability.
- Deviation risk: sidekick output may be treated as authoritative by convenience pressure.
- Deviation risk: cost metrics may dominate meaning-preservation metrics if not made visible.
- Next update: define minimal Work Item routing metadata and Koguchi routing policy format for Phase A.
