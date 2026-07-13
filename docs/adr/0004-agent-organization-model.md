# ADR 0004: Agent organization model

- Status: Accepted
- Date: 2026-06-26
- Updated: 2026-07-13 (v0.9 role model)

## Context

Kazane needs to manage multiple AI agents and human participants with different roles
and responsibilities. The system must distinguish between human principals who bear
accountability and AI agents who execute tasks under human oversight.

## Decision

### Human user roles

Four human-side roles are defined in the `users` table (migration v13):

| Role | Label | Description |
|------|-------|-------------|
| `owner` | オーナー | ZYX Corp principals. Full system access including role management and privileged operation approval. |
| `operator` | オペレーター | Staff who manage work items, context, and handoffs day-to-day. |
| `reviewer` | レビュアー | External experts or auditors who can read and approve handoffs but not modify work items. |
| `agent` | エージェント | Represents an AI agent identity in the human-readable user list; enforced through MCP/CLI tools. |

### Permission matrix

| Operation | owner | operator | reviewer | agent |
|-----------|:-----:|:--------:|:--------:|:-----:|
| WI読み取り | ✓ | ✓ | ✓ | ✓ |
| WI作成 | ✓ | ✓ | | ✓ |
| WI編集 | ✓ | ✓ | | ✓ |
| WI削除 | ✓ | | | |
| Handoff提出 | ✓ | ✓ | | ✓ |
| Handoffレビュー | ✓ | ✓ | ✓ | |
| Evidence追加 | ✓ | ✓ | | ✓ |
| ロール管理 | ✓ | | | |
| 特権操作承認 | ✓ | | | |

### AI agent profiles

AI agents are represented in the `agent_profiles` table (separate from `users`).
Each profile carries: `trust_level`, `capabilities_json`, `gate_perm`, `gate_stops`.

Default profiles: AGT-01 (AI番頭), AGT-02 (AI Assistant), AGT-03 (Claude Code),
AGT-04 (Codex), AGT-05 (ローカルLLM), AGT-DEV-TL/QA/RDE/RVW.

### Responsibility boundary

AI agents are work actors, not responsibility subjects. An agent completing a task
and submitting a handoff does not constitute human approval. The human owner or
reviewer must inspect and confirm before privileged actions are executed.

## Consequences

- Structured roles enable WI-903 (permission enforcement via kazaned/privd) to
  query the `users` table for role-based allow/deny decisions.
- Role fixtures are seeded via `kazane-import-dev` (idempotent).
- The `agent` role in `users` is informational; runtime enforcement uses
  `agent_profiles`.

## RDE check

- Preserved: AI agents as work actors, not accountability holders.
- Transformed: informal trust relationships become explicit role data.
- Supplemented: human role matrix enables auditable permission decisions.
- Resolved: Agent Profile v0.1 schema (AGT-DEV-* roles defined in WI-403/ADR-0015).
- Deviation risk: role model complexity may suggest false completeness of access control. WI-903 must implement actual enforcement before claiming security.
- Next update: WI-903 enforces role permissions through kazaned/privd.
