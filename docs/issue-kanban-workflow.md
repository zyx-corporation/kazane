# Issue and Kanban Workflow

Kazane development uses GitHub Issues as the durable public work record and a Kanban-style board as the operational view.

The board is not separate from Issues. The board should reflect Issues, not replace them.

## Purpose

The purpose of this workflow is to make work visible while preserving context, decision history, and reviewability.

Kazane should dogfood this model: Kazane's own Work Board should be able to link to GitHub Issues and Pull Requests.

## Work unit mapping

| Kazane concept | GitHub concept | Notes |
|---|---|---|
| Work Item | Issue | Public durable record for work |
| Work state | Issue label / project status | Board state should reflect issue state |
| Context Card | Linked doc / issue section | May later become first-class Kazane object |
| Handoff Note | Issue comment / PR comment / Kazane note | Durable handoff is required for meaningful transitions |
| Evidence Log | Linked commits, PRs, docs, files | Evidence should remain reachable |
| RDE Audit | PR section / issue comment | Required for design-impacting changes |
| ADR | `docs/adr/*` | Required for architectural decisions |

## Initial board columns

Initial Kanban columns:

1. Inbox
2. Ready
3. AI Working
4. Human Working
5. Needs Human
6. Review / T-RDE
7. Done
8. Blocked

## Issue labels

Recommended labels:

- `type:prototype`
- `type:design`
- `type:docs`
- `type:implementation`
- `type:test`
- `type:adr`
- `type:rde`
- `area:work-board`
- `area:context-engine`
- `area:agent-org`
- `area:handoff`
- `area:evidence`
- `area:runtime`
- `area:ui`
- `status:needs-human`
- `status:blocked`
- `risk:high`

## Issue template expectations

A meaningful issue should include:

- user or operator need;
- linked Context Card or design context;
- value line;
- proposed prototype or implementation path;
- expected tests or validation;
- escalation needs;
- RDE check if design-impacting.

## Pull Request expectations

A PR should link related Issues and ADRs.

A PR should include:

- summary;
- scope;
- validation;
- evidence;
- design or context impact;
- T-RDE check when applicable.

## Agile adaptation

Kazane uses Agile as a practical flow discipline:

- keep work small;
- make blocked work visible;
- review frequently;
- prefer real feedback over long speculation;
- avoid over-planning before prototype learning;
- keep decisions written.

Kazane does not require strict Scrum. Kanban is preferred for early work because the project mixes product design, prototypes, documentation, research, and implementation.

## Board and agent use

AI agents may pick up work only when:

- the Work Item is assigned to that agent or its team;
- the issue/context provides enough information;
- the agent has permission for the required action;
- no Escalation Gate blocks the action.

If an AI agent cannot proceed, it should move the item to Needs Human or Blocked and write a Handoff Note.

## Done policy

Done is not merely code merged or document written.

Done should mean:

- linked Issue is resolved or clearly deferred;
- PR is merged or documentation committed;
- validation is recorded;
- evidence is linked;
- context is updated when meaning changed;
- T-RDE is completed where applicable.
