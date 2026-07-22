# Kazane / 風音 — Chronicle Work OS

[日本語版 README](README_ja.md)

**Kazane / 風音** is an early-stage Chronicle Work OS for managing work performed by humans and AI agents with context, handoff, evidence, review, and responsibility boundaries.

> 仕事の気配を聴き、判断の来歴を綴る。

Kazane is not limited to software development. Development is the first dogfooding field, but the product scope is broader: Kazane is intended to manage every business workflow that AI agents can execute, assist, research, draft, review, or monitor.

## What Kazane is

Kazane is a work operating system for human–AI collaboration. It helps small teams and organizations manage:

- work items across development, sales, customer support, documents, research, meetings, accounting notes, operations, and AI assistant workflows;
- context cards that preserve why work exists and what value it should create;
- AI agent roles, manuals, permissions, desks, model routing, and review chains;
- handoff notes between AI agents and humans;
- escalation gates where AI must stop and return decisions to humans;
- evidence logs that connect outputs to sources, files, conversations, issues, and decisions;
- RDE audits that inspect how meaning changed from the original intent;
- operations health checks that detect silent failures, stale tasks, missing evidence, and broken handoffs.

## What Kazane is not

Kazane is not a fully autonomous AI company, a replacement for human responsibility, or a generic chatbot wrapper. AI agents may act as work actors, but they are not responsibility-bearing legal or organizational subjects.

Kazane is also not initially a large enterprise workflow suite. The first implementation is intentionally small, local-first, and dogfooded inside ZYX.

## Initial operating environments

Kazane is Tauri-first from the prototype stage.

Initial targets:

- macOS
- Linux

Also in view:

- iOS

The previous direction of "Web UI first, desktop unification later" has been withdrawn. Even prototypes should be built as Tauri-based applications where practical, using web technologies inside Tauri while treating the Tauri runtime, local app shell, permissions, and cross-platform packaging as part of the initial product learning.

## Development methodology

Kazane is developed through Prototype First, TDD/Test First, T-RDE, and an Agile-inspired Kanban workflow linked to GitHub Issues.

- Prototype First is used to test workflow and UI assumptions before durable implementation.
- TDD / Test First is used when behavior and data models become durable.
- T-RDE, Test-based Resonant Deviation Evaluator, checks whether changes preserve the intended meaning of the original context.
- Kanban is used as the operational flow, while GitHub Issues remain the durable work record.

See [docs/development-methodology.md](docs/development-methodology.md), [docs/testing-strategy.md](docs/testing-strategy.md), [docs/t-rde-policy.md](docs/t-rde-policy.md), and [docs/issue-kanban-workflow.md](docs/issue-kanban-workflow.md).

## Chronicle-native work extensions

Kazane adopts useful interaction patterns from AI-native development workflows without reducing itself to an AI IDE. Proposed extensions such as Living PRD, AI Activity Timeline, Micro Change Workflow, Chronicle Diff, and Intent Graph are described in [docs/chronicle-native-work-extensions.md](docs/chronicle-native-work-extensions.md).

## Design principles

1. Prefer context sovereignty over automation.
2. Prefer responsible escalation over blind completion.
3. Prefer written handoff over ephemeral chat.
4. Prefer evidence-linked summaries over detached summaries.
5. Prefer structured data readable by humans and AI over UI-only state.
6. Prefer local-first operation over cloud convenience when sensitive context is involved.
7. Prefer small-organization depth over generic enterprise breadth.
8. Prefer review chains over single-agent authority.
9. Prefer operational health checks over agent self-reporting.
10. Prefer reversible decisions where possible.

See [docs/design-principles.md](docs/design-principles.md).

## Current status

Kazane is in `v0.9 utsuwa / 器` Product Candidate development. The local macOS app has
SQLite-backed Work Items, Context Cards, Handoff Notes, Evidence and RDE views,
GitHub Issue synchronization, an agent CLI, an MCP server, agent routing,
concurrency locks, and a local push notification broker.

The v0.8 external-beta workflow includes partner onboarding, Feedback Context
capture, a Trust & Privacy explanation, and Chronicle Replay. Phase A local process
separation is implemented for `kazaned`, `kazane-privd`, and `kazane-agentd`.
The remaining v0.8 exit check requires an actual partner or trial user to validate
that the workflow and one provenance chain are understandable. v0.9 adds local
backup/restore, user roles, enforced authorization, first-run data guidance, and
diagnostics. Signed/notarized distribution and the clean-machine release rehearsal
are not complete, so there is no public v0.9 candidate release yet.

See [docs/roadmap.md](docs/roadmap.md).

For local build and installation, see
[docs/local-deployment.md](docs/local-deployment.md).
For a blank-state first workflow, see [docs/start-guide.md](docs/start-guide.md).
For external feedback and trust boundaries, see
[docs/feedback-context.md](docs/feedback-context.md) and
[docs/trust-and-privacy.md](docs/trust-and-privacy.md). Replay behavior is defined in
[docs/chronicle-replay.md](docs/chronicle-replay.md).
The remaining human validation is run with
[docs/external-beta-trial.md](docs/external-beta-trial.md).

## Repository and branch policy

The repository is public. The `main` branch is treated as protected and is not used as a direct working branch. Changes should be prepared on feature branches and merged through pull requests after review.

See [docs/adr/0009-branch-management.md](docs/adr/0009-branch-management.md).

## License

Kazane uses AGPL-3.0-or-later for the public repository, with a provisional future commercial licensing option under consideration.

See [LICENSE](LICENSE), [NOTICE.md](NOTICE.md), [LICENSE-POLICY.md](LICENSE-POLICY.md), and [docs/adr/0007-license-strategy-provisional.md](docs/adr/0007-license-strategy-provisional.md).

## Public positioning

Suggested short description:

> Kazane is a Chronicle Work OS for human–AI organizations. It connects work, context, handoff, evidence, review, and responsibility boundaries so AI agents can help move business forward without losing meaning or provenance.
