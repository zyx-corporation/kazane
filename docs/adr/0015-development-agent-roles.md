# ADR 0015: Development agent role definitions

- Status: Accepted
- Date: 2026-06-29

## Context

v0.4 michi requires Kazane to prove it can manage its own development flow. This means defining which AI agents perform which roles in the development workflow, with clear permission boundaries and escalation conditions.

ADR-0004 established the Agent Organization Model and AgentProfile schema. WI-403 implements the first concrete role set for the development domain.

## Decision

Define four development-specific agent roles as AgentProfile entries:

| Role | ID | Trust | Primary capabilities |
|------|----|-------|---------------------|
| Tech Lead | AGT-DEV-TL | 高 | Architecture, ADR drafting, implementation, PR creation |
| QA | AGT-DEV-QA | 高 | tsc/cargo check, test planning, evidence collection |
| Reviewer | AGT-DEV-RVW | 高 | Code review, security impact, RDE audit support |
| RDE Auditor | AGT-DEV-RDE | 高 | Retained/Transformed/Unresolved/Deviation analysis |

### Permission boundaries

All four roles share the same stop condition: **本番反映はTomoyukiが判断** (production deployment requires human decision). Specific stops per role:

- **Tech Lead**: no confirmed ADR changes, no breaking API changes
- **QA**: test environments only; no applying fixes to production
- **Reviewer**: no merge approval (human only); no production deployment
- **RDE Auditor**: no final audit sign-off (human only)

## Consequences

Development workflow agents are now first-class citizens in Kazane's Gate and EscalationGate screens. Agent Profiles appear in the Escalation Gate panel alongside ZYX general-purpose agents.

The four roles cover the full development cycle: Tech Lead initiates, QA validates, Reviewer audits, RDE Auditor checks value preservation. Human (Tomoyuki) retains final approval for production decisions.

## RDE check

- Preserved: human-final-decision invariant; ADR-0004 trust model.
- Transformed: general Claude Code profile extended into four specialized roles.
- Supplemented: gate_perm / gate_stops for each role provides explicit permission boundaries.
- Unresolved: reviewer approval flow implementation; inter-role handoff protocol.
- Deviation risk: roles may become ceremonial if not used in actual workflow.
- Next update: after v0.4 exit criteria are met, evaluate role coverage gaps.
