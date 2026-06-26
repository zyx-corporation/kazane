# ADR 0011: Issue-linked Kanban workflow

- Status: Accepted
- Date: 2026-06-26

## Context

Kazane should use Agile ideas without becoming ceremony-heavy. Work must stay visible and reviewable. Since Kazane is hosted in GitHub, GitHub Issues should be the durable public work record.

## Decision

Use a Kanban-style workflow linked to GitHub Issues.

Kazane Work Items should correspond to Issues or issue-like records. The board is an operational view, while Issues remain the durable work record.

## Consequences

This supports Agile-style flow, AI assignment, written handoff, PR linkage, and reviewability. It also gives Kazane a direct dogfooding path: Kazane's own board can be backed by GitHub Issues.

## RDE check

- Preserved: Agile visibility and iterative flow.
- Transformed: Kanban is tied to Issue provenance rather than being only UI state.
- Supplemented: link between Work Board and GitHub Issues.
- Unresolved: exact label taxonomy and project-board automation.
- Deviation risk: GitHub-specific assumptions may leak too deeply into generic Kazane concepts.
- Next update: define v0.1 issue labels and Work Item schema.
