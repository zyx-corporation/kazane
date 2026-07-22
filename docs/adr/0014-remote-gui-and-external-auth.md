# ADR 0014: Remote GUI and external authentication

- Status: Accepted (runtime deferred past v0.9)
- Date: 2026-06-26
- Updated: 2026-07-14 (WI-909 — boundary confirmed, runtime not in v0.9 scope)

## Context

Kazane needs a local Tauri GUI and may also need remote access for monitoring, review,
and handoff approvals. Remote access must not become a direct path into local storage or
privileged operations. v0.9 scopes this ADR as a design gate only: define the boundary,
threat model, and prerequisites before any runtime implementation is approved.

## Decision

### Remote GUI is deferred beyond v0.9

Production Remote GUI runtime is **not** a v0.9 exit criterion. This ADR defines the
boundary that must be respected when it is implemented.

### Access model

Two access tiers are defined for remote clients:

| Role | Permitted operations | Denied operations |
|------|---------------------|-------------------|
| `remote-readonly` | Read WIs, Context Cards, Evidence, Handoffs, Events | All mutations, all privileged ops |
| `remote-approver` | Above + approve/reject Handoff Notes, add review Evidence | Create/edit WIs, delete, role management |

These are **relay-mediated** roles, not entries in the `users` table. They are scoped
to a session JWT issued by the owner and cannot escalate to `operator` or `owner`.

### Relay topology

```
Remote browser
    │  HTTPS + short-lived JWT (max 1 hour, WI-scope claim)
    ▼
kazaned relay endpoint  (localhost:RELAY_PORT, not internet-exposed)
    │  Unix socket RPC
    ▼
kazaned  (control plane, enforces role from JWT claim)
    │  SQLite read / restricted write
    ▼
kazane.db
```

The relay endpoint is bound to localhost only. External access requires the owner to
configure a reverse proxy or tunnel (e.g., Tailscale, Cloudflare Tunnel) — Kazane
does not provision or manage external network exposure.

### Session scope

- JWTs are signed with a local HMAC secret generated at first run.
- Claims: `sub` (user-id), `role` (`remote-readonly` | `remote-approver`),
  `scope` (optional list of WI IDs or `*`), `exp` (max +3600s), `iat`.
- Owner issues tokens via `kazane-agent token --role remote-approver --ttl 3600`.
- Tokens are single-use or time-bounded; the relay validates on every request.

### Audit

Every remote request is written to `privileged_operation_requests` regardless of
allow/deny outcome, with the JWT `sub` as `agent_id` and the relay-resolved role.

### Threat model

| Threat | Mitigation |
|--------|-----------|
| Stolen JWT | Short TTL (≤1 hour), scope-limited to specific WIs |
| Relay bypass | kazaned accepts only Unix socket connections from localhost |
| Privilege escalation | Relay roles are a strict subset of `reviewer`; no path to `operator`/`owner` |
| Data exfiltration | Remote roles cannot read private notes or audit-required fields without explicit scope |
| Offline abuse | JWT validation requires kazaned to be running; no offline token acceptance |

### Implementation prerequisites

Before any remote GUI runtime is built, the following must exist:

1. JWT issuance and validation in kazaned (not yet implemented).
2. Relay endpoint on localhost with role-enforcement middleware (not yet implemented).
3. ADR-0013 Phase B: process isolation between relay and kazaned (not yet implemented).
4. An accepted threat model review from the owner before any external exposure.

## Consequences

- Remote GUI timeline is explicitly deferred. No vague "may need later" — it requires
  the four prerequisites above.
- The boundary is clear: remote clients never touch the Unix socket directly; they go
  through the relay which enforces JWT roles.
- The relay-topology design allows Tailscale/tunnel without Kazane owning the network.
- Deviation risk: relay implementation may drift into building a full cloud service.
  Guard: relay must remain read-mostly; mutations require explicit owner approval per
  session.

## RDE check

- Preserved: local-first operation. kazaned remains the single authority.
- Transformed: remote access becomes explicit, scoped, and auditable.
- Supplemented: JWT sessions, relay topology, threat model.
- Resolved: IdP choice deferred (owner issues tokens locally), session model defined,
  relay topology defined, offline behavior defined (no offline acceptance).
- Deviation risk: relay becoming a cloud gateway. Mitigation: localhost-only binding;
  owner configures external exposure explicitly.
- Next update: when relay runtime is approved for implementation post-v0.9.
