export type Screen = 'dashboard' | 'board' | 'context' | 'handoff' | 'gate' | 'rde';
export type BoardCol = 'inbox' | 'ai' | 'human' | 'gate' | 'done';
export type Lang = 'ja' | 'en' | 'zh';
export type DrawerTab = 'context' | 'handoff' | 'evidence' | 'rde' | 'gate' | 'timeline';
export type Risk = '高' | '中' | '低';
export type TrustLevel = '高' | '中' | '低';

export interface EvidenceEntry {
  type: string;
  label: string;
  trust: TrustLevel;
  store?: string;
}

export interface HandoffData {
  did: string;
  judged?: string;
  couldnt?: string;
  uncertain: string;
  bounce: string;
  next: string;
  updCtx?: string;
  ev?: string[];
  ask?: string;
}

export interface ContextData {
  question: string;
  purpose: string;
  context?: string;
  constraint: string;
  past?: string;
  unresolved: string;
}

export interface RdeAudit {
  kept: string;
  transformed: string;
  unresolved: string;
}

export interface WorkItem {
  id: string;
  title: string;
  domain: string;
  assignee: string;
  col: BoardCol;
  status: string;
  risk: Risk;
  contextId: string;
  nextAction: string;
  gate: string;
  rde: boolean;
  morning: boolean;
  bounced: boolean;
  ctx: ContextData;
  ho: HandoffData;
  ev: EvidenceEntry[];
  rdeAudit?: RdeAudit;
  gatePerm: string;
  gateStops: string;
  // v0.2: agent queue
  agentPickedUpAt?: string;
  agentEscalated?: boolean;
  escalationReason?: string;
}

export interface EnrichedWorkItem extends WorkItem {
  dc: string;
  colColor: string;
  riskColor: string;
  riskLabel: string;
  actorColor: string;
}

export interface ContextCard {
  id: string;
  title: string;
  question: string;
  purpose: string;
  context: string;
  constraint: string;
  past: string;
  relatedWI: string[];
  relatedEv: string[];
  unresolved: string[];
  nextPolicy: string;
}

export interface HandoffNote {
  id: string;
  wi: string;
  assignee: string;
  domain: string;
  did: string;
  judged: string;
  couldnt: string;
  uncertain: string;
  bounce: string;
  next: string;
  updCtx: string;
  ev: string[];
  gate: string;
  ask: string;
  // v0.2: agent-submitted fields
  escalated?: boolean;
  escalationReason?: string;
}

export type EventType = 'created' | 'moved' | 'edited' | 'ai_run' | 'ai_done' | 'ai_stopped' | 'agent_assigned' | 'agent_handoff' | 'agent_escalated' | 'rde_run' | 'bounced' | 'deleted';

export interface WorkEvent {
  id: string;
  wiId: string;
  eventType: EventType;
  fromCol?: string;
  toCol?: string;
  actor: string;
  note?: string;
  createdAt: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  model: string;
  trustLevel: TrustLevel;
  capabilities: string[];
  gatePerm: string;
  gateStops: string;
}

export interface GateRule {
  domain: string;
  perm: string[];
  stops: string[];
}

export interface RdeEvidence {
  type: string;
  label: string;
  trust: TrustLevel;
  store: string;
}

export interface EvidenceLogEntry {
  id: string;
  type: string;
  label: string;
  trust: TrustLevel;
  store: string;
  wiId: string;
  hoId: string;
  ctxId: string;
  note: string;
  createdAt: string;
}

export const DOMAIN_COLORS: Record<string, string> = {
  '開発': '#5b8def',
  '営業': '#3fb6a8',
  '顧客対応': '#9b8cf0',
  '経理': '#d9a93f',
  '執筆': '#d98ba0',
  '調査': '#4fb0c9',
  '会議': '#7c8cf0',
  'AI番頭': '#5fb89f',
  '診断士連携': '#a07fe0',
};

export const GATE_DOMAIN_COLORS: Record<string, string> = {
  '顧客対応': '#9b8cf0',
  '営業': '#3fb6a8',
  '経理・総務': '#d9a93f',
  '執筆・広報': '#d98ba0',
  '開発': '#5b8def',
  'AI番頭': '#5fb89f',
};

export const COL_COLORS: Record<BoardCol, string> = {
  inbox: '#6a7078',
  ai: '#5b8def',
  human: '#d9a93f',
  gate: '#a07fe0',
  done: '#5fb87a',
};

export const COL_NAMES: Record<BoardCol, string> = {
  inbox: 'Inbox',
  ai: 'AI Working',
  human: 'Needs Human',
  gate: 'Expert / Gate',
  done: 'Done / Logged',
};

export const RISK_COLORS: Record<Risk, string> = {
  '高': '#d96b6b',
  '中': '#d9a93f',
  '低': '#6a7078',
};

export const AI_ACTORS = ['AI番頭', 'AI Assistant', 'Claude Code', 'Codex', 'ローカルLLM'];

export function trustColor(t: TrustLevel): string {
  return t === '高' ? '#5fb89f' : t === '中' ? '#d9a93f' : '#6a7078';
}

export function isAiActor(assignee: string): boolean {
  return AI_ACTORS.includes(assignee);
}

export function enrichItem(it: WorkItem): EnrichedWorkItem {
  return {
    ...it,
    dc: DOMAIN_COLORS[it.domain] ?? '#6a7078',
    colColor: COL_COLORS[it.col],
    riskColor: RISK_COLORS[it.risk],
    riskLabel: 'リスク ' + it.risk,
    actorColor: isAiActor(it.assignee) ? '#3fb6a8' : '#5b8def',
  };
}
