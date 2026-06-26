# Roadmap

## Release overview

| Version | Release name | Stage | Main purpose |
|---|---|---|---|
| v0.0 | kiri / 霧 | Tauri concept prototype | Confirm six-screen concept and product direction inside Tauri |
| v0.1 | shirushi / 記し | Internal Tauri MVP | Record work origins, context, and initial Work Items |
| v0.2 | nagare / 流れ | AI flow alpha | Agents pick up assigned business work and return Handoff Notes |
| v0.3 | tsuzuri / 綴り | Provenance alpha | Weave work, decisions, evidence, and context updates into traceable history |
| v0.4 | michi / 道 | Development workflow proof | Validate GitHub/CLI/MCP-oriented development workflows |
| v0.5 | ayumi / 歩み | Internal business beta | Manage development, sales, documents, operations, customer-like work, and Kazane itself |
| v0.6 | akashi / 証し | Audit beta | Apply Evidence Log and RDE Audit across workflows |
| v0.7 | musubi / 結び | AI番頭 integration | Connect mail, calendar, documents, meetings, and customer context |
| v0.8 | hibiki / 響き | External beta | Validate human–AI organizational workflows with partners and small businesses |
| v0.9 | utsuwa / 器 | Product candidate | Prepare onboarding, permissions, deployment, and product materials |
| v1.0 | kanade / 奏で | First public release | Provide Kazane as a Tauri-based AI-era work operating system |

## Runtime direction

Kazane is Tauri-first from the prototype stage.

Initial targets:

- macOS
- Linux

Future target in view:

- iOS

The previous Web UI first direction has been withdrawn. Web technologies may still be used inside Tauri, but the product boundary is the Tauri application.

## v0.0 kiri / 霧

Tauri-based concept and six-screen prototype.

Deliverables:

- README draft;
- design principles;
- architecture overview;
- roadmap;
- licensing policy draft;
- initial ADRs;
- Tauri scaffold;
- six-screen prototype inside Tauri.

Exit criteria:

- product scope is not limited to development;
- public positioning is clear;
- initial document structure exists;
- Tauri runs on at least one macOS machine;
- Linux build path is identified;
- iOS constraints are noted but not implemented.

## v0.1 shirushi / 記し

Internal Tauri MVP for recording work origin.

Features:

- Work Item CRUD;
- Context Card CRUD;
- Work Item to Context linkage;
- human/agent actor field;
- manual status transitions;
- local storage;
- Markdown/JSON export;
- Tauri command layer for local operations.

Exit criteria:

- at least 10 Kazane/ZYX internal Work Items recorded;
- at least one top-level Kazane Design Strategy Context exists;
- work origin is readable later;
- macOS and Linux runtime assumptions are tested or documented.

## v0.2 nagare / 流れ

AI agents begin to pick up assigned business work.

Features:

- agent-assigned Work Item pickup;
- CLI or file-based queue;
- Tauri command bridge for local agent workflow;
- Handoff Note submission;
- Needs Human status;
- simple scheduled scans;
- agent manual fields;
- minimal permission flags.

Exit criteria:

- at least one AI agent can pick up an assigned Work Item;
- agent can return a Handoff Note;
- agent can stop and escalate with a reason;
- Kazane is used to support Kazane work.

## v0.3 tsuzuri / 綴り

Work, conversations, decisions, and outputs become traceable history.

Features:

- Handoff System;
- Evidence Log;
- Context update proposals;
- Work timeline;
- Agent Profile minimum model;
- basic RDE Audit template.

Exit criteria:

- a major Kazane design decision can be traced from Context to Work Item, Handoff, Evidence, and Context update;
- users can answer why a decision was made from Kazane data.

## v0.4 michi / 道

Development workflow proof.

Features:

- GitHub Issue/PR linkage;
- CLI/MCP prototype;
- Tech Lead / QA / Reviewer / RDE agent roles;
- test result evidence;
- development-oriented escalation.

Exit criteria:

- Kazane can manage its own development flow through GitHub-linked evidence;
- development use case is demonstrable without claiming Kazane is development-only.

## v0.5 ayumi / 歩み

Internal business beta.

Features:

- business workflow templates;
- content/document workflow;
- operations workflow;
- customer/support-like workflow;
- internal standup dashboard;
- stale work detection.

Exit criteria:

- ZYX can manage multiple non-development workflows in Kazane;
- Kazane itself is dogfooded across product, docs, and operations.

## v0.6 akashi / 証し

Audit beta.

Features:

- formal Evidence Log;
- RDE Audit flow;
- review chain support;
- audit-required flags;
- deviation-risk records.

Exit criteria:

- AI-generated or AI-assisted work can be audited for semantic drift;
- work can be reviewed against original design strategy.

## v0.7 musubi / 結び

AI番頭 integration.

Features:

- mail workflow concept;
- calendar workflow concept;
- document workflow concept;
- meeting-note import concept;
- customer Context Card;
- diagnosis/support template.

Exit criteria:

- AI番頭 demo flow can be shown using Kazane concepts;
- customer context and work handoff can be linked.

## v0.8 hibiki / 響き

External beta.

Features:

- partner feedback workflow;
- small-business onboarding template;
- diagnostic workflow template;
- simplified non-engineer UI labels;
- privacy and trust explanation.

Exit criteria:

- one partner or trial user can understand the workflow;
- external feedback is captured as Context, not only feature requests.

## v0.9 utsuwa / 器

Product candidate.

Features:

- user/role model;
- deployment guide;
- trust and privacy guide;
- backup/restore;
- onboarding;
- product website copy;
- pricing draft;
- support boundary.

Exit criteria:

- external pilot is feasible;
- product claims and limits are documented;
- operational expectations are explicit.

## v1.0 kanade / 奏で

First public release.

Promise:

- manage human–AI work flows;
- preserve context and provenance;
- support handoffs, escalation, evidence, and review;
- support macOS/Linux through Tauri;
- maintain iOS as a visible future target;
- local-first deployment path.

Non-promise:

- complete autonomous management;
- replacement for legal/accounting/medical experts;
- enterprise-grade workflow suite;
- fully hosted SaaS by default;
- objective guarantee of audit correctness;
- full iOS feature parity at v1.0.
