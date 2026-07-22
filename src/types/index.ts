export type Screen = 'dashboard' | 'board' | 'context' | 'handoff' | 'gate' | 'rde';
export type BoardCol = 'inbox' | 'ai' | 'human' | 'gate' | 'done';
export type Lang = 'ja' | 'en' | 'zh';
export type DrawerTab = 'context' | 'handoff' | 'evidence' | 'rde' | 'gate' | 'timeline';
export type Risk = '高' | '中' | '低';
export type TrustLevel = '高' | '中' | '低';
export type DeviationRisk = 'low' | 'medium' | 'high';
export type UserRole = 'owner' | 'operator' | 'reviewer' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enabled: boolean;
  createdAt: string;
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  owner:    'オーナー',
  operator: 'オペレーター',
  reviewer: 'レビュアー',
  agent:    'エージェント',
};

export const USER_ROLE_MATRIX: Record<UserRole, string[]> = {
  owner:    ['WI読み取り', 'WI作成', 'WI編集', 'WI削除', 'Handoff提出', 'Handoffレビュー', 'Evidence追加', 'ロール管理', '特権操作承認'],
  operator: ['WI読み取り', 'WI作成', 'WI編集', 'Handoff提出', 'Handoffレビュー', 'Evidence追加'],
  reviewer: ['WI読み取り', 'Handoffレビュー'],
  agent:    ['WI読み取り', 'WI作成', 'WI編集', 'Handoff提出', 'Evidence追加'],
};

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

export interface GitHubLink {
  url: string;
  type: 'issue' | 'pr';
  owner: string;
  repo: string;
  number: number;
  title?: string;
  state?: string;
  fetchedAt?: string;
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
  // v0.4: GitHub linkage
  githubLinks?: GitHubLink[];
  // v0.5: staleness
  updatedAt?: string;
  // v0.6: audit chain
  auditRequired?: boolean;
  reviewer?: string;
  deviationRisk?: DeviationRisk;
  driftNote?: string;
  // v0.7: source tracking
  source?: WorkItemSource;
  sourceRef?: string;
  // v0.8: project label
  project?: string;
}

export interface EnrichedWorkItem extends WorkItem {
  dc: string;
  colColor: string;
  riskColor: string;
  riskLabel: string;
  actorColor: string;
}

export type CardType = 'general' | 'customer' | 'feedback';
export type WorkItemSource = 'manual' | 'gmail' | 'calendar' | 'github';

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
  // v0.7: customer context
  cardType?: CardType;
  customerCompany?: string;
  customerContact?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerRelationship?: string;
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
  // v0.8: agent routing
  nextAgent?: string;
  agentId?: string;
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

export interface DomainTemplate {
  ctx: ContextData;
  ho: HandoffData;
  gate: string;
  gatePerm: string;
  gateStops: string;
}

export const DOMAIN_TEMPLATES: Record<string, DomainTemplate> = {
  '顧客対応': {
    ctx: { question: 'この問い合わせの背景と期待値は何か。', purpose: '顧客の課題を解決し、信頼を維持する。', constraint: '約束・価格・謝罪はTomoyukiが判断。', unresolved: '顧客の期待値と現状のギャップ。' },
    ho: { did: '未着手。', uncertain: '回答内容の最終承認。', bounce: '—', next: '担当が内容を確認し、返信案を作成する。' },
    gate: 'AI権限内で返信案作成可',
    gatePerm: '問い合わせ整理・返信案作成・過去履歴参照',
    gateStops: '送信／価格提示／契約条件／謝罪・責任表明',
  },
  '営業': {
    ctx: { question: 'この商談の目的と相手の課題は何か。', purpose: '提案価値を明確にし、前進させる。', constraint: '見積・契約条件・確約はTomoyukiが判断。', unresolved: '相手のニーズの深さと意思決定タイムライン。' },
    ho: { did: '未着手。', uncertain: '提案内容の最終確認。', bounce: '—', next: '担当が商談メモを整理し、提案案を作成する。' },
    gate: 'AI権限内で提案案作成可',
    gatePerm: '提案案・比較表・商談メモ整理',
    gateStops: '見積／契約条件／外部提示／導入時期確約',
  },
  '執筆': {
    ctx: { question: 'この文書の読者は誰で、何を伝えるべきか。', purpose: '正確で信頼性の高いコンテンツを届ける。', constraint: '公開前にTomoyukiが確認。未確認情報を断定しない。', unresolved: '情報の正確性確認。公開先・対象読者の最終確認。' },
    ho: { did: '未着手。', uncertain: '内容の正確性・公開判断。', bounce: '—', next: '担当が草稿を作成し、RDE監査を実施する。' },
    gate: 'AI権限内で草稿・構成作成可',
    gatePerm: '草稿・校正・構成・RDE監査',
    gateStops: '公開／強い主張／第三者批判／未確認情報の断定',
  },
  '経理': {
    ctx: { question: 'この経理作業の目的と対象期間は何か。', purpose: '正確な記録と申告を支援する。', constraint: '税務判断・支払・申告はTomoyukiまたは専門家が判断。', unresolved: '税務・法的判断が必要な項目の有無。' },
    ho: { did: '未着手。', uncertain: '税務・法的判断が必要な箇所。', bounce: '—', next: '担当が資料を整理し、専門家確認が必要な点を抽出する。' },
    gate: 'AI権限内で資料整理・下調べ可',
    gatePerm: '資料整理・日付金額抽出・下調べ',
    gateStops: '税務判断／申告／支払／法的判断／専門家判断領域',
  },
  '開発': {
    ctx: { question: 'この開発タスクで解決する技術的課題は何か。', purpose: '品質を保ちながら実装を前進させる。', constraint: '本番反映・破壊的変更はTomoyukiが判断。', unresolved: 'アーキテクチャ影響範囲。テスト戦略。' },
    ho: { did: '未着手。', uncertain: '設計判断と影響範囲の評価。', bounce: '—', next: '担当が調査・実装し、PR下書きを作成する。' },
    gate: 'AI権限内で調査・実装・PR下書き可',
    gatePerm: '調査・実装・テスト・PR下書き・エビデンス記録',
    gateStops: '本番反映／破壊的変更／公開API変更／ADR確定／PRマージ',
  },
  'AI番頭': {
    ctx: { question: 'AI番頭が担当するこの業務の境界と目的は何か。', purpose: 'AI番頭が適切な範囲で業務を支援する。', constraint: '顧客約束・金銭・契約はTomoyukiが判断。', unresolved: 'AI番頭の権限範囲の明確化。' },
    ho: { did: '未着手。', uncertain: 'AI番頭が処理した内容の品質確認。', bounce: '—', next: 'AI番頭が着手し、Handoffを残す。' },
    gate: 'AI権限内で記憶整理・提案・業務整理可',
    gatePerm: '記憶整理・提案・返信案・業務整理',
    gateStops: '顧客約束／金銭／契約／医療・法律・税務判断',
  },
};

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
