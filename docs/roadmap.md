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

## Chronicle-native work extensions placement

Kazane should adopt useful interaction patterns from AI-native development workflows without narrowing the product into an AI IDE. The detailed proposal is maintained in [chronicle-native-work-extensions.md](chronicle-native-work-extensions.md).

| Feature | Suggested release | Reason |
|---|---:|---|
| AI Activity Timeline | v0.2 | Needed when agents begin to pick up assigned work |
| AI Task Request | v0.2 | Natural entry point for agent-assigned work |
| Living PRD | v0.3 | Needed when work, decisions, and outputs become traceable history |
| Micro Change Workflow | v0.4 | Best aligned with development workflow proof, GitHub linkage, tests, and T-RDE |
| Intent Graph | v0.4-v0.5 | Useful once Context, Work Items, GitHub, and artifacts are linkable |
| Chronicle Diff | v0.6 | Requires enough Chronicle history and RDE structure to be meaningful |
| AI Confidence View | v0.6 | Should mature together with Evidence Log and RDE Audit |
| Chronicle Progress | v0.6-v0.8 | Requires stable progress dimensions and partner feedback |
| Self-Healing Workflow | v0.7-v0.8 | Safer after permission, evidence, and escalation patterns exist |
| Chronicle Replay | v0.8-v1.0 | Product-level differentiator once enough provenance exists |

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
- minimal permission flags;
- AI Activity Timeline;
- AI Task Request.

Exit criteria:

- at least one AI agent can pick up an assigned Work Item;
- agent can return a Handoff Note;
- agent can stop and escalate with a reason;
- users can see what stage an AI agent is in without exposing private reasoning traces;
- Kazane is used to support Kazane work.

## v0.3 tsuzuri / 綴り

Work, conversations, decisions, and outputs become traceable history.

Features:

- Handoff System;
- Evidence Log;
- Context update proposals;
- Work timeline;
- Agent Profile minimum model;
- basic RDE Audit template;
- Living PRD.

Exit criteria:

- a major Kazane design decision can be traced from Context to Work Item, Handoff, Evidence, and Context update;
- users can answer why a decision was made from Kazane data;
- at least one Living PRD can be traced back to its originating Intent and forward to resulting Work Items.

## v0.4 michi / 道

Development workflow proof.

Features:

- GitHub Issue/PR linkage;
- CLI/MCP prototype;
- Tech Lead / QA / Reviewer / RDE agent roles;
- test result evidence;
- development-oriented escalation;
- Micro Change Workflow;
- initial Intent Graph view for development work.

Exit criteria:

- Kazane can manage its own development flow through GitHub-linked evidence;
- development use case is demonstrable without claiming Kazane is development-only;
- at least one implementation change is represented as Micro Changes linked to tests, review, and Chronicle records.

## v0.5 ayumi / 歩み

Internal business beta.

Features:

- business workflow templates;
- content/document workflow;
- operations workflow;
- customer/support-like workflow;
- internal standup dashboard;
- stale work detection;
- Intent Graph expansion beyond development workflows.

Exit criteria:

- ZYX can manage multiple non-development workflows in Kazane;
- Kazane itself is dogfooded across product, docs, and operations;
- Intent Graph can connect non-development work from origin to artifact or decision.

## v0.6 akashi / 証し

Audit beta.

Features:

- formal Evidence Log;
- RDE Audit flow;
- review chain support;
- audit-required flags;
- deviation-risk records;
- Chronicle Diff;
- AI Confidence View;
- Chronicle Progress draft dimensions.

Exit criteria:

- AI-generated or AI-assisted work can be audited for semantic drift;
- work can be reviewed against original design strategy;
- Chronicle Diff can explain meaning-level changes between two versions of a Chronicle object.

## v0.7 musubi / 結び

AI番頭 integration.

Features:

- mail workflow concept;
- calendar workflow concept;
- document workflow concept;
- meeting-note import concept;
- customer Context Card;
- diagnosis/support template;
- Self-Healing Workflow concept.

Exit criteria:

- AI番頭 demo flow can be shown using Kazane concepts;
- customer context and work handoff can be linked;
- at least one self-healing proposal can be generated without bypassing human approval boundaries.

## v0.8 hibiki / 響き

External beta.

Implementation is split into two tracks. The orchestration infrastructure is
completed before exposing the external-beta workflow to trial users.

Orchestration infrastructure:

- Kazane MCP server;
- agent-to-agent Handoff routing;
- concurrent pickup locks;
- local push notification broker (`kazane-agentd`);
- Phase A control-plane and privilege separation.

Features:

- partner feedback workflow;
- small-business onboarding template;
- diagnostic workflow template;
- simplified non-engineer UI labels;
- privacy and trust explanation;
- Chronicle Progress refinement;
- Chronicle Replay prototype.

Exit criteria:

- one partner or trial user can understand the workflow;
- external feedback is captured as Context, not only feature requests;
- users can replay the provenance of at least one work item or decision.

Current state (2026-07-11): MCP, routing, locking, local push notifications,
and Phase A process separation have passed local E2E verification. MCP writes
are routed through `kazaned`; `kazane-privd` applies default-deny authorization
and records every decision. Partner onboarding, feedback capture, and Chronicle
Replay remain after the infrastructure track.

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
- support boundary;
- Chronicle Replay hardening.

## v1.0 kanade / 奏で

First public release.

Features:

- stable Tauri-based local application boundary;
- documented human-AI work model;
- durable Work Item, Context Card, Handoff, Evidence, and RDE concepts;
- mature enough Chronicle-native work flow for public onboarding;
- clear responsibility, privacy, and support boundaries.
