import type {
  WorkItem,
  ContextCard,
  HandoffNote,
  EvidenceEntry,
  AgentProfile,
  OpsAlert,
} from "./index";

export const mockContextCards: ContextCard[] = [
  {
    id: "ctx-001",
    title: "Kazane Design Strategy",
    kind: "design_strategy",
    body: "Kazane is a Chronicle Work OS for human–AI organizations. It manages workflows that AI agents can execute while preserving context, evidence, handoff, review, and human responsibility boundaries.",
    created_at: "2026-06-20T09:00:00Z",
    updated_at: "2026-06-26T10:00:00Z",
  },
  {
    id: "ctx-002",
    title: "v0.0 kiri Prototype Scope",
    kind: "project_context",
    body: "The v0.0 prototype confirms the six-screen concept and product direction inside Tauri. Deliverables: README, design principles, architecture overview, roadmap, licensing policy, initial ADRs, Tauri scaffold, six-screen prototype.",
    created_at: "2026-06-24T09:00:00Z",
    updated_at: "2026-06-26T10:00:00Z",
  },
  {
    id: "ctx-003",
    title: "ZYX Internal Operations Context",
    kind: "business_context",
    body: "ZYX Corporation is dogfooding Kazane for product, docs, and operations workflows. Primary contact: tomyuk@zyxcorp.jp.",
    created_at: "2026-06-20T10:00:00Z",
    updated_at: "2026-06-20T10:00:00Z",
  },
];

export const mockWorkItems: WorkItem[] = [
  {
    id: "wi-001",
    title: "Build v0.0 Tauri scaffold and six-screen prototype",
    status: "in_progress",
    actor: "agent",
    actor_name: "Claude Code",
    context_id: "ctx-002",
    created_at: "2026-06-26T08:00:00Z",
    updated_at: "2026-06-26T10:00:00Z",
    summary:
      "Scaffold Tauri app with React frontend. Implement six-screen concept: Flow Dashboard, Work Board, Context Cards, Agent Organization, Handoff & Evidence, Ops Health.",
  },
  {
    id: "wi-002",
    title: "Write README draft",
    status: "done",
    actor: "human",
    actor_name: "tomyuk",
    context_id: "ctx-001",
    created_at: "2026-06-20T09:00:00Z",
    updated_at: "2026-06-24T12:00:00Z",
    summary: "Initial README in English and Japanese.",
  },
  {
    id: "wi-003",
    title: "Draft initial ADRs",
    status: "done",
    actor: "human",
    actor_name: "tomyuk",
    context_id: "ctx-001",
    created_at: "2026-06-20T10:00:00Z",
    updated_at: "2026-06-26T09:00:00Z",
    summary:
      "ADR 0001–0014 covering runtime, context model, agent model, handoff, escalation, licensing, UI strategy, branch management, methodology, Tauri-first, control plane, remote GUI.",
  },
  {
    id: "wi-004",
    title: "Define six-screen navigation concept",
    status: "done",
    actor: "human",
    actor_name: "tomyuk",
    context_id: "ctx-002",
    created_at: "2026-06-26T07:00:00Z",
    updated_at: "2026-06-26T08:00:00Z",
    summary:
      "Flow Dashboard, Work Board, Context Cards, Agent Organization, Handoff & Evidence, Ops Health.",
  },
  {
    id: "wi-005",
    title: "Publish v0.0 branch and initial commit",
    status: "open",
    actor: "agent",
    actor_name: "Claude Code",
    context_id: "ctx-002",
    created_at: "2026-06-26T10:00:00Z",
    updated_at: "2026-06-26T10:00:00Z",
    summary: "Push Tauri scaffold to claude/v0-prototype-roadmap-orhkys branch.",
  },
];

export const mockAgentProfiles: AgentProfile[] = [
  {
    id: "agent-001",
    name: "Claude Code",
    role: "Developer",
    status: "active",
    model: "claude-sonnet-4-6",
    work_area: "Development",
    current_work_item_id: "wi-001",
  },
  {
    id: "agent-002",
    name: "Tech Lead Agent",
    role: "Tech Lead",
    status: "idle",
    model: "claude-opus-4-8",
    work_area: "Architecture Review",
    current_work_item_id: null,
  },
  {
    id: "agent-003",
    name: "QA Agent",
    role: "QA",
    status: "idle",
    model: "claude-haiku-4-5-20251001",
    work_area: "Testing",
    current_work_item_id: null,
  },
];

export const mockHandoffNotes: HandoffNote[] = [
  {
    id: "hn-001",
    work_item_id: "wi-002",
    from_actor: "tomyuk",
    to_actor: "Claude Code",
    summary:
      "README draft complete. English and Japanese versions exist. Ready for review and integration into Tauri app.",
    evidence_ids: ["ev-001"],
    created_at: "2026-06-24T12:00:00Z",
  },
  {
    id: "hn-002",
    work_item_id: "wi-003",
    from_actor: "tomyuk",
    to_actor: "Tech Lead Agent",
    summary:
      "ADRs 0001–0014 drafted. Tauri-first direction confirmed. Need RDE review pass before v0.0 exit.",
    evidence_ids: ["ev-002"],
    created_at: "2026-06-26T09:00:00Z",
  },
];

export const mockEvidenceEntries: EvidenceEntry[] = [
  {
    id: "ev-001",
    work_item_id: "wi-002",
    source_kind: "file",
    source_ref: "README.md",
    summary: "English README with product definition, quick start, and links.",
    created_at: "2026-06-24T12:00:00Z",
  },
  {
    id: "ev-002",
    work_item_id: "wi-003",
    source_kind: "file",
    source_ref: "docs/adr/0012-tauri-first-runtime-including-ios-horizon.md",
    summary: "ADR confirming Tauri-first direction. Status: Accepted.",
    created_at: "2026-06-26T09:00:00Z",
  },
];

export const mockAlerts: OpsAlert[] = [
  {
    id: "alert-001",
    kind: "done_without_handoff",
    work_item_id: "wi-004",
    message: "wi-004: Completed without a Handoff Note.",
    severity: "warning",
    created_at: "2026-06-26T08:30:00Z",
  },
];
