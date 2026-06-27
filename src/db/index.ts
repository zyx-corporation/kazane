import Database from '@tauri-apps/plugin-sql';
import type { WorkItem, ContextCard } from '../types';

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
        ctx_json, ho_json, ev_json, rde_audit_json, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
       title=$2, domain=$3, assignee=$4, col=$5, status=$6, risk=$7,
       context_id=$8, next_action=$9, gate=$10, rde=$11, morning=$12, bounced=$13,
       gate_perm=$14, gate_stops=$15, ctx_json=$16, ho_json=$17, ev_json=$18,
       rde_audit_json=$19, updated_at=datetime('now')`,
    [
      item.id, item.title, item.domain, item.assignee, item.col, item.status,
      item.risk, item.contextId, item.nextAction, item.gate,
      item.rde ? 1 : 0, item.morning ? 1 : 0, item.bounced ? 1 : 0,
      item.gatePerm, item.gateStops,
      JSON.stringify(item.ctx), JSON.stringify(item.ho), JSON.stringify(item.ev),
      item.rdeAudit ? JSON.stringify(item.rdeAudit) : null,
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
        related_wi_json, related_ev_json, unresolved_json, next_policy, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
       title=$2, question=$3, purpose=$4, context=$5, constraint_text=$6, past=$7,
       related_wi_json=$8, related_ev_json=$9, unresolved_json=$10, next_policy=$11,
       updated_at=datetime('now')`,
    [
      card.id, card.title, card.question, card.purpose, card.context,
      card.constraint, card.past,
      JSON.stringify(card.relatedWI), JSON.stringify(card.relatedEv),
      JSON.stringify(card.unresolved), card.nextPolicy,
    ],
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
  };
}
