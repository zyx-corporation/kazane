# ADR 0014: Remote GUI and external authentication

- Status: Proposed
- Date: 2026-06-26

## Context

Kazane needs a local Tauri GUI and may also need remote access for monitoring, review, approvals, and distributed operations.

Remote GUI access must not become a direct path into local storage or privileged operations. It must be mediated by authentication, scoped authorization, relay/API boundaries, and audit records.

## Decision

Provide two GUI access modes:

1. Local GUI: Tauri application for owner/operator workflows.
2. Remote GUI: browser-accessible interface behind Access Gateway and Auth Broker.

Remote GUI access should use external authentication such as OIDC/OAuth2, WebAuthn/passkey, MFA, and short-lived scoped sessions.

Remote GUI must communicate through the orchestrator via a relay or scoped API path. It must not bypass `kazaned` or `kazane-privd`.

## Consequences

This allows remote monitoring and approval without turning Kazane into a cloud-first product.

Remote operations become explicit, scoped, and auditable. The tradeoff is extra architecture around gateway, relay, identity, and authorization.

## RDE check

- Preserved: local-first operation and human review.
- Transformed: GUI becomes multi-surface: local full-control and remote scoped access.
- Supplemented: external authentication, relay, scoped sessions, and remote approval flows.
- Unresolved: IdP choice, session model, relay topology, and offline behavior.
- Deviation risk: remote GUI may drift into cloud-first architecture.
- Next update: define remote GUI read-only and approval-only roles.
