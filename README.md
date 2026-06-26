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

Kazane targets:

- macOS
- Linux

The first UI is web-based. Future GUI direction should allow a shared macOS/Linux desktop experience, likely through a cross-platform shell such as Tauri or another Rust/WebView-based architecture.

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

Kazane is at conceptual/prototype stage.

The intended release path starts with:

- `v0.0 kiri / 霧`: concept and six-screen prototype
- `v0.1 shirushi / 記し`: internal MVP for recording work origins and context
- `v0.2 nagare / 流れ`: AI agents pick up assigned business work and return handoffs
- `v0.3 tsuzuri / 綴り`: work, conversations, decisions, and outputs are woven into traceable history

See [docs/roadmap.md](docs/roadmap.md).

## Repository and branch policy

The repository is public. The `main` branch is treated as protected and must not be written to directly. Changes should be prepared on feature branches and merged through pull requests after review.

See [docs/adr/0009-protected-main-branch.md](docs/adr/0009-protected-main-branch.md).

## License

Kazane uses AGPL-3.0-or-later for the public repository, with a provisional future commercial licensing option under consideration.

See [LICENSE](LICENSE), [NOTICE](NOTICE), [LICENSE-POLICY.md](LICENSE-POLICY.md), and [docs/adr/0007-license-strategy-provisional.md](docs/adr/0007-license-strategy-provisional.md).

## Public positioning

Suggested short description:

> Kazane is a Chronicle Work OS for human–AI organizations. It connects work, context, handoff, evidence, review, and responsibility boundaries so AI agents can help move business forward without losing meaning or provenance.
