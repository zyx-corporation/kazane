import Database from '@tauri-apps/plugin-sql';
import type { WorkItem, ContextCard, HandoffNote, WorkEvent, EvidenceLogEntry, TrustLevel, GateRule, AgentProfile, GitHubLink, DeviationRisk, CardType, WorkItemSource } from '../types';

let _db: Database | null = null;

async function db(): Promise<Database> {
  if (!_db) {
    _db = await Database.load('sqlite:kazane.db');
  }
  return _db;
}

// ---------- WorkItem ----------

export async function dbListItems(): Promise<WorkItem[]> {
  const d = await db();
  const rows = await d.select<Record<string, unknown>[]>('SELECT * FROM work_items ORDER BY created_at');
  return rows.map(rowToItem);
}

export async function dbUpsertItem(item: WorkItem): Promise<void> {
  const d = await db();
  await d.execute(
    `INSERT INTO work_items
       (id, title, domain, assignee, col, status, risk, context_id, next_action,
        gate, rde, morning, bounced, gate_perm, gate_stops,
        ctx_json, ho_json, ev_json, rde_audit_json,
        agent_picked_up_at, agent_escalated, escalation_reason,
        github_links_json,
        audit_required, reviewer, deviation_risk, drift_note,
        source, source_ref,
        updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
       title=$2, domain=$3, assignee=$4, col=$5, status=$6, risk=$7,
       context_id=$8, next_action=$9, gate=$10, rde=$11, morning=$12, bounced=$13,
       gate_perm=$14, gate_stops=$15, ctx_json=$16, ho_json=$17, ev_json=$18,
       rde_audit_json=$19,
       agent_picked_up_at=$20, agent_escalated=$21, escalation_reason=$22,
       github_links_json=$23,
       audit_required=$24, reviewer=$25, deviation_risk=$26, drift_note=$27,
       source=$28, source_ref=$29,
       updated_at=datetime('now')`,
    [
      item.id, item.title, item.domain, item.assignee, item.col, item.status,
      item.risk, item.contextId, item.nextAction, item.gate,
      item.rde ? 1 : 0, item.morning ? 1 : 0, item.bounced ? 1 : 0,
      item.gatePerm, item.gateStops,
      JSON.stringify(item.ctx), JSON.stringify(item.ho), JSON.stringify(item.ev),
      item.rdeAudit ? JSON.stringify(item.rdeAudit) : null,
      item.agentPickedUpAt ?? null,
      item.agentEscalated ? 1 : 0,
      item.escalationReason ?? '',
      JSON.stringify(item.githubLinks ?? []),
      item.auditRequired ? 1 : 0,
      item.reviewer ?? '',
      item.deviationRisk ?? 'low',
      item.driftNote ?? '',
      item.source ?? 'manual',
      item.sourceRef ?? '',
    ],
  );
}

export async function dbDeleteItem(id: string): Promise<void> {
  const d = await db();
  await d.execute('DELETE FROM work_items WHERE id=$1', [id]);
}

// ---------- ContextCard ----------

export async function dbListContextCards(): Promise<ContextCard[]> {
  const d = await db();
  const rows = await d.select<Record<string, unknown>[]>('SELECT * FROM context_cards ORDER BY created_at');
  return rows.map(rowToCtx);
}

export async function dbUpsertContextCard(card: ContextCard): Promise<void> {
  const d = await db();
  await d.execute(
    `INSERT INTO context_cards
       (id, title, question, purpose, context, constraint_text, past,
        related_wi_json, related_ev_json, unresolved_json, next_policy,
        card_type, customer_company, customer_contact, customer_email,
        customer_phone, customer_relationship, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
       title=$2, question=$3, purpose=$4, context=$5, constraint_text=$6, past=$7,
       related_wi_json=$8, related_ev_json=$9, unresolved_json=$10, next_policy=$11,
       card_type=$12, customer_company=$13, customer_contact=$14, customer_email=$15,
       customer_phone=$16, customer_relationship=$17,
       updated_at=datetime('now')`,
    [
      card.id, card.title, card.question, card.purpose, card.context,
      card.constraint, card.past,
      JSON.stringify(card.relatedWI), JSON.stringify(card.relatedEv),
      JSON.stringify(card.unresolved), card.nextPolicy,
      card.cardType ?? 'general',
      card.customerCompany ?? '',
      card.customerContact ?? '',
      card.customerEmail ?? '',
      card.customerPhone ?? '',
      card.customerRelationship ?? '',
    ],
  );
}

// ---------- HandoffNote ----------

export async function dbListHandoffs(): Promise<HandoffNote[]> {
  const d = await db();
  const rows = await d.select<Record<string, unknown>[]>('SELECT * FROM handoff_notes ORDER BY created_at DESC');
  return rows.map(rowToHandoff);
}

export async function dbUpsertHandoff(ho: HandoffNote): Promise<void> {
  const d = await db();
  await d.execute(
    `INSERT INTO handoff_notes
       (id, wi, assignee, domain, did, judged, couldnt, uncertain, bounce, next,
        upd_ctx, ev_json, gate, ask, escalated, escalation_reason)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
     ON CONFLICT(id) DO UPDATE SET
       wi=$2, assignee=$3, domain=$4, did=$5, judged=$6, couldnt=$7, uncertain=$8,
       bounce=$9, next=$10, upd_ctx=$11, ev_json=$12, gate=$13, ask=$14,
       escalated=$15, escalation_reason=$16`,
    [
      ho.id, ho.wi, ho.assignee, ho.domain, ho.did, ho.judged, ho.couldnt,
      ho.uncertain, ho.bounce, ho.next, ho.updCtx,
      JSON.stringify(ho.ev), ho.gate, ho.ask,
      ho.escalated ? 1 : 0, ho.escalationReason ?? '',
    ],
  );
}

// ---------- Events ----------

export async function dbAddEvent(ev: WorkEvent): Promise<void> {
  const d = await db();
  await d.execute(
    `INSERT OR IGNORE INTO events (id, wi_id, event_type, from_col, to_col, actor, note, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [ev.id, ev.wiId, ev.eventType, ev.fromCol ?? '', ev.toCol ?? '', ev.actor, ev.note ?? '', ev.createdAt],
  );
}

export async function dbListEvents(wiId: string): Promise<WorkEvent[]> {
  const d = await db();
  const rows = await d.select<Record<string, unknown>[]>(
    'SELECT * FROM events WHERE wi_id=$1 ORDER BY created_at ASC',
    [wiId],
  );
  return rows.map(r => ({
    id: r.id as string,
    wiId: r.wi_id as string,
    eventType: r.event_type as WorkEvent['eventType'],
    fromCol: r.from_col as string | undefined || undefined,
    toCol: r.to_col as string | undefined || undefined,
    actor: r.actor as string,
    note: r.note as string | undefined || undefined,
    createdAt: r.created_at as string,
  }));
}

// ---------- Evidence Log ----------

export async function dbListEvidenceLog(): Promise<EvidenceLogEntry[]> {
  const d = await db();
  const rows = await d.select<Record<string, unknown>[]>('SELECT * FROM evidence_log ORDER BY created_at DESC');
  return rows.map(r => ({
    id: r.id as string,
    type: r.type as string,
    label: r.label as string,
    trust: r.trust as TrustLevel,
    store: r.store as string,
    wiId: r.wi_id as string,
    hoId: r.ho_id as string,
    ctxId: r.ctx_id as string,
    note: r.note as string,
    createdAt: r.created_at as string,
  }));
}

export async function dbAddEvidenceEntry(ev: EvidenceLogEntry): Promise<void> {
  const d = await db();
  await d.execute(
    `INSERT OR IGNORE INTO evidence_log (id, type, label, trust, store, wi_id, ho_id, ctx_id, note, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [ev.id, ev.type, ev.label, ev.trust, ev.store, ev.wiId, ev.hoId, ev.ctxId, ev.note, ev.createdAt],
  );
}

// ---------- Gate Rules ----------

export async function dbListGateRules(): Promise<GateRule[]> {
  const d = await db();
  const rows = await d.select<Record<string, unknown>[]>('SELECT * FROM gate_rules ORDER BY domain');
  return rows.map(r => ({
    domain: r.domain as string,
    perm: JSON.parse(r.perm_json as string),
    stops: JSON.parse(r.stops_json as string),
  }));
}

export async function dbUpsertGateRule(rule: GateRule): Promise<void> {
  const d = await db();
  await d.execute(
    `INSERT INTO gate_rules (domain, perm_json, stops_json)
     VALUES ($1,$2,$3)
     ON CONFLICT(domain) DO UPDATE SET perm_json=$2, stops_json=$3`,
    [rule.domain, JSON.stringify(rule.perm), JSON.stringify(rule.stops)],
  );
}

// ---------- Agent Profiles ----------

export async function dbListAgentProfiles(): Promise<AgentProfile[]> {
  const d = await db();
  const rows = await d.select<Record<string, unknown>[]>('SELECT * FROM agent_profiles ORDER BY name');
  return rows.map(r => ({
    id: r.id as string,
    name: r.name as string,
    model: r.model as string,
    trustLevel: r.trust_level as AgentProfile['trustLevel'],
    capabilities: JSON.parse(r.capabilities_json as string),
    gatePerm: r.gate_perm as string,
    gateStops: r.gate_stops as string,
  }));
}

export async function dbUpsertAgentProfile(profile: AgentProfile): Promise<void> {
  const d = await db();
  await d.execute(
    `INSERT INTO agent_profiles (id, name, model, trust_level, capabilities_json, gate_perm, gate_stops)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT(id) DO UPDATE SET
       name=$2, model=$3, trust_level=$4, capabilities_json=$5, gate_perm=$6, gate_stops=$7`,
    [profile.id, profile.name, profile.model, profile.trustLevel,
     JSON.stringify(profile.capabilities), profile.gatePerm, profile.gateStops],
  );
}

// ---------- helpers ----------

function rowToItem(r: Record<string, unknown>): WorkItem {
  return {
    id: r.id as string,
    title: r.title as string,
    domain: r.domain as string,
    assignee: r.assignee as string,
    col: r.col as WorkItem['col'],
    status: r.status as string,
    risk: r.risk as WorkItem['risk'],
    contextId: r.context_id as string,
    nextAction: r.next_action as string,
    gate: r.gate as string,
    rde: Boolean(r.rde),
    morning: Boolean(r.morning),
    bounced: Boolean(r.bounced),
    gatePerm: r.gate_perm as string,
    gateStops: r.gate_stops as string,
    ctx: JSON.parse(r.ctx_json as string),
    ho: JSON.parse(r.ho_json as string),
    ev: JSON.parse(r.ev_json as string),
    rdeAudit: r.rde_audit_json ? JSON.parse(r.rde_audit_json as string) : undefined,
    agentPickedUpAt: r.agent_picked_up_at as string | undefined || undefined,
    agentEscalated: Boolean(r.agent_escalated),
    escalationReason: r.escalation_reason as string | undefined || undefined,
    githubLinks: r.github_links_json ? (JSON.parse(r.github_links_json as string) as GitHubLink[]) : [],
    updatedAt: r.updated_at as string | undefined || undefined,
    auditRequired: Boolean(r.audit_required),
    reviewer: r.reviewer as string | undefined || undefined,
    deviationRisk: (r.deviation_risk as DeviationRisk | undefined) ?? 'low',
    driftNote: r.drift_note as string | undefined || undefined,
    source: (r.source as WorkItemSource | undefined) ?? 'manual',
    sourceRef: r.source_ref as string | undefined || undefined,
  };
}

function rowToHandoff(r: Record<string, unknown>): HandoffNote {
  return {
    id: r.id as string,
    wi: r.wi as string,
    assignee: r.assignee as string,
    domain: r.domain as string,
    did: r.did as string,
    judged: r.judged as string,
    couldnt: r.couldnt as string,
    uncertain: r.uncertain as string,
    bounce: r.bounce as string,
    next: r.next as string,
    updCtx: r.upd_ctx as string,
    ev: JSON.parse(r.ev_json as string),
    gate: r.gate as string,
    ask: r.ask as string,
    escalated: Boolean(r.escalated),
    escalationReason: r.escalation_reason as string | undefined || undefined,
  };
}

function rowToCtx(r: Record<string, unknown>): ContextCard {
  return {
    id: r.id as string,
    title: r.title as string,
    question: r.question as string,
    purpose: r.purpose as string,
    context: r.context as string,
    constraint: r.constraint_text as string,
    past: r.past as string,
    relatedWI: JSON.parse(r.related_wi_json as string),
    relatedEv: JSON.parse(r.related_ev_json as string),
    unresolved: JSON.parse(r.unresolved_json as string),
    nextPolicy: r.next_policy as string,
    cardType: (r.card_type as CardType | undefined) ?? 'general',
    customerCompany: r.customer_company as string | undefined || undefined,
    customerContact: r.customer_contact as string | undefined || undefined,
    customerEmail: r.customer_email as string | undefined || undefined,
    customerPhone: r.customer_phone as string | undefined || undefined,
    customerRelationship: r.customer_relationship as string | undefined || undefined,
  };
}
