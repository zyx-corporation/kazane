export type WorkItemStatus =
  | "open"
  | "in_progress"
  | "needs_human"
  | "done"
  | "cancelled";

export type ActorKind = "human" | "agent";

export interface WorkItem {
  id: string;
  title: string;
  status: WorkItemStatus;
  actor: ActorKind;
  actor_name: string;
  context_id: string | null;
  created_at: string;
  updated_at: string;
  summary: string;
}

export interface ContextCard {
  id: string;
  title: string;
  kind: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface HandoffNote {
  id: string;
  work_item_id: string;
  from_actor: string;
  to_actor: string;
  summary: string;
  evidence_ids: string[];
  created_at: string;
}

export interface EvidenceEntry {
  id: string;
  work_item_id: string;
  source_kind: "file" | "url" | "command" | "issue" | "note";
  source_ref: string;
  summary: string;
  created_at: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  status: "active" | "idle" | "error" | "offline";
  model: string;
  work_area: string;
  current_work_item_id: string | null;
}

export interface OpsAlert {
  id: string;
  kind:
    | "done_without_handoff"
    | "handoff_without_evidence"
    | "stale_work"
    | "missing_context"
    | "agent_failure";
  work_item_id: string | null;
  message: string;
  severity: "info" | "warning" | "critical";
  created_at: string;
}
