import { useState } from 'react';
import type { EnrichedWorkItem, DrawerTab, BoardCol, WorkItem } from '../types';
import { trustColor, isAiActor, DOMAIN_COLORS, AI_ACTORS } from '../types';
import type { Translations } from '../i18n';

const COL_LIST: { key: BoardCol; name: string; color: string }[] = [
  { key: 'inbox', name: 'Inbox', color: '#6a7078' },
  { key: 'ai', name: 'AI Working', color: '#5b8def' },
  { key: 'human', name: 'Needs Human', color: '#d9a93f' },
  { key: 'gate', name: 'Expert / Gate', color: '#a07fe0' },
  { key: 'done', name: 'Done / Logged', color: '#5fb87a' },
];

const TABS: { key: DrawerTab; tKey: keyof Translations }[] = [
  { key: 'context', tKey: 'tabContext' },
  { key: 'handoff', tKey: 'tabHandoff' },
  { key: 'evidence', tKey: 'tabEvidence' },
  { key: 'rde', tKey: 'tabRde' },
  { key: 'gate', tKey: 'tabGate' },
];

const DOMAINS = Object.keys(DOMAIN_COLORS);

interface WorkItemDrawerProps {
  item: EnrichedWorkItem;
  tab: DrawerTab;
  t: Translations;
  onClose: () => void;
  onSetTab: (t: DrawerTab) => void;
  onMoveItem: (id: string, col: BoardCol) => void;
  onBounce: (id: string) => void;
  onRunRde: (id: string) => void;
  onAiRun: (id: string) => void;
  onEditItem: (id: string, patch: { title: string; domain: string; assignee: string; risk: WorkItem['risk']; nextAction: string }) => void;
  onDeleteItem: (id: string) => void;
  onGoCtx: () => void;
  onGoCtxById: (id: string) => void;
  onGoHand: () => void;
  onGoRde: () => void;
  onGoGate: () => void;
}

export function WorkItemDrawer({ item, tab, t, onClose, onSetTab, onMoveItem, onBounce, onRunRde, onAiRun, onEditItem, onDeleteItem, onGoCtx, onGoCtxById, onGoHand, onGoRde, onGoGate }: WorkItemDrawerProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: item.title, domain: item.domain, assignee: item.assignee, risk: item.risk, nextAction: item.nextAction });

  const canAiRun = isAiActor(item.assignee) && (item.col === 'inbox' || item.col === 'ai');
  const hasRde = !!(item.rde && item.rdeAudit);
  const hasCtx = item.contextId && item.contextId !== '—';
  const ev = (item.ev || []).map(e => ({ ...e, trustColor: trustColor(e.trust) }));

  function saveEdit() {
    onEditItem(item.id, draft);
    setEditing(false);
  }

  function cancelEdit() {
    setDraft({ title: item.title, domain: item.domain, assignee: item.assignee, risk: item.risk, nextAction: item.nextAction });
    setEditing(false);
  }

  function handleDelete() {
    if (window.confirm(`${item.id} を削除しますか？`)) {
      onDeleteItem(item.id);
    }
  }

  return (
    <div style={s.overlay}>
      <div onClick={onClose} style={s.backdrop} />
      <div style={s.drawer}>
        {/* Header */}
        <div style={s.drawerHeader}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={s.mono}>{item.id}</span>
              {hasCtx ? (
                <button onClick={() => onGoCtxById(item.contextId)} style={s.ctxIdBtn}>
                  {item.contextId} →
                </button>
              ) : (
                <span style={{ ...s.mono, color: '#4a5268' }}>·</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {!editing && (
                <button onClick={() => { setDraft({ title: item.title, domain: item.domain, assignee: item.assignee, risk: item.risk, nextAction: item.nextAction }); setEditing(true); }} style={s.iconBtn} title={t.btnEdit}>✏</button>
              )}
              <button onClick={handleDelete} style={{ ...s.iconBtn, color: '#d96b6b' }} title={t.btnDelete}>🗑</button>
              <button onClick={onClose} style={s.closeBtn}>×</button>
            </div>
          </div>

          {editing ? (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                value={draft.title}
                onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                style={s.editInput}
                onKeyDown={e => e.key === 'Enter' && saveEdit()}
                autoFocus
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={draft.domain} onChange={e => setDraft(d => ({ ...d, domain: e.target.value }))} style={s.editSelect}>
                  {DOMAINS.map(dm => <option key={dm} value={dm}>{dm}</option>)}
                </select>
                <select value={draft.assignee} onChange={e => setDraft(d => ({ ...d, assignee: e.target.value }))} style={s.editSelect}>
                  {[...AI_ACTORS, 'Tomoyuki Kano', '山田 太郎', '中山 誠'].map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <select value={draft.risk} onChange={e => setDraft(d => ({ ...d, risk: e.target.value as typeof item.risk }))} style={{ ...s.editSelect, flex: '0 0 72px' }}>
                  {(['低', '中', '高'] as const).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <input
                value={draft.nextAction}
                onChange={e => setDraft(d => ({ ...d, nextAction: e.target.value }))}
                style={{ ...s.editInput, fontSize: 12 }}
                placeholder="Next action"
              />
              <div style={{ display: 'flex', gap: 7 }}>
                <button onClick={saveEdit} style={s.saveBtn}>{t.btnSave}</button>
                <button onClick={cancelEdit} style={s.cancelEditBtn}>{t.btnCancel}</button>
              </div>
            </div>
          ) : (
            <>
              <h2 style={s.drawerTitle}>{item.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#aeb4bf' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.dc }} />{item.domain}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#aeb4bf' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.actorColor }} />{item.assignee}
                </span>
                <span style={{ fontSize: 10, color: item.colColor, border: `1px solid ${item.colColor}`, padding: '2px 9px', borderRadius: 20 }}>{item.status}</span>
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div style={s.tabBar}>
          {TABS.map(({ key, tKey }) => {
            const active = tab === key;
            return (
              <button key={key} onClick={() => onSetTab(key)} style={{
                border: 'none', background: active ? '#232a39' : 'transparent',
                color: active ? '#e6e8ec' : '#8b919c',
                padding: '6px 12px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}>{t[tKey] as string}</button>
            );
          })}
        </div>

        {/* Tab content */}
        <div style={s.tabContent}>
          {tab === 'context' && (
            <div style={s.stack}>
              <Field label={t.flQuestion} value={item.ctx.question} />
              <Field label={t.flPurpose} value={item.ctx.purpose} />
              {item.ctx.context && <Field label={t.flContext} value={item.ctx.context} />}
              <Box bg="#1d1b14" border="#34301f" label={t.flConstraint} labelColor="#d9a93f" value={item.ctx.constraint} valueColor="#e3d2a6" />
              <Field label={t.flUnresolved} value={item.ctx.unresolved} />
              {hasCtx
                ? <button onClick={() => onGoCtxById(item.contextId)} style={s.linkBtn}>{t.goCtxCard}</button>
                : <button onClick={onGoCtx} style={s.linkBtn}>{t.openCtxFull}</button>
              }
            </div>
          )}
          {tab === 'handoff' && (
            <div style={s.stack}>
              <Box bg="#16191f" border="#262a33" label={t.flDid} value={item.ho.did} />
              <Box bg="#1d1b14" border="#34301f" label={t.flUncertain} labelColor="#d9a93f" value={item.ho.uncertain} valueColor="#e3d2a6" />
              <Box bg="#1f1417" border="#3a2329" label={t.flBounce} labelColor="#d98ba0" value={item.ho.bounce} valueColor="#e7bccb" />
              <Box bg="#141b27" border="#24344a" label={t.flNext} labelColor="#5b8def" value={item.ho.next} valueColor="#c7d8f3" />
              <button onClick={onGoHand} style={s.linkBtn}>{t.openHoFull}</button>
            </div>
          )}
          {tab === 'evidence' && (
            <div style={s.stack}>
              <div style={{ fontSize: 10.5, color: '#6a7078', marginBottom: 2 }}>{t.evRefHd}</div>
              {ev.length === 0 && <div style={{ fontSize: 12, color: '#4a5268' }}>—</div>}
              {ev.map((e, i) => (
                <div key={i} style={{ border: '1px solid #262a33', background: '#16191f', borderRadius: 9, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#dfe3e8' }}>{e.label}</div>
                    <div style={{ fontSize: 9.5, color: '#6a7078', fontFamily: "'JetBrains Mono', monospace", marginTop: 3 }}>{e.type}</div>
                  </div>
                  <span style={{ fontSize: 9.5, color: e.trustColor, whiteSpace: 'nowrap' }}>{t.trust} {e.trust}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'rde' && (
            <div style={s.stack}>
              {hasRde ? (
                <>
                  <Box bg="#161d18" border="#25382b" label={t.rdeKept} labelColor="#5fb89f" value={item.rdeAudit!.kept} valueColor="#cfe0d6" />
                  <Box bg="#141b27" border="#24344a" label={t.rdeTransformed} labelColor="#5b8def" value={item.rdeAudit!.transformed} valueColor="#c7d8f3" />
                  <Box bg="#1d1b14" border="#34301f" label={t.rdeUnresolved} labelColor="#d9a93f" value={item.rdeAudit!.unresolved} valueColor="#e3d2a6" />
                  <button onClick={onGoRde} style={{ ...s.linkBtn, border: '1px solid #322c47', background: '#1d1a29', color: '#b6a6ee' }}>{t.openRdeFull}</button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: '#6a7078' }}>
                  <div style={{ fontSize: 12.5, marginBottom: 14 }}>{t.noRdeMsg}</div>
                  <button onClick={onGoRde} style={{ border: '1px solid #322c47', background: '#1d1a29', color: '#b6a6ee', padding: '8px 14px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit' }}>{t.sendToRde}</button>
                </div>
              )}
            </div>
          )}
          {tab === 'gate' && (
            <div style={s.stack}>
              <div style={{ background: '#1d1b14', border: '1px solid #34301f', borderRadius: 9, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>⚑</span>
                <div>
                  <div style={{ fontSize: 11, color: '#d9a93f', marginBottom: 2 }}>{t.itemGateHd}</div>
                  <div style={{ fontSize: 12.5, color: '#e3d2a6' }}>{item.gate}</div>
                </div>
              </div>
              <Box bg="#161d18" border="#25382b" label={t.permLabel} labelColor="#5fb89f" value={item.gatePerm} valueColor="#cfe0d6" mono />
              <Box bg="#1f1417" border="#3a2329" label={t.stopLabel} labelColor="#d98ba0" value={item.gateStops} valueColor="#e7bccb" mono />
              <button onClick={onGoGate} style={s.linkBtn}>{t.openGateFull}</button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={s.footer}>
          {canAiRun && (
            <button onClick={() => onAiRun(item.id)} style={s.aiRunBtn}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#5fb89f' }} />
              {t.btnAiRun}
            </button>
          )}
          <div style={s.monoSm}>{t.moveHd}</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {COL_LIST.map(c => {
              const active = item.col === c.key;
              return (
                <button key={c.key} onClick={() => onMoveItem(item.id, c.key)} style={{
                  flex: 1, minWidth: 62,
                  border: `1px solid ${active ? c.color : '#262a33'}`,
                  background: active ? c.color : '#16191f',
                  color: active ? '#0e1014' : '#9aa1ad',
                  padding: '6px 4px', borderRadius: 7, fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                }}>{c.name}</button>
              );
            })}
          </div>
        </div>
        <div style={s.footerActions}>
          <button onClick={() => onBounce(item.id)} style={s.bounceBtn}>{t.btnReturnHuman}</button>
          <button onClick={() => onRunRde(item.id)} style={s.rdeBtn}>{t.btnRunRdeAudit}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: '#6a7078', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 12.5, color: '#dfe3e8', lineHeight: 1.6 }}>{value}</div>
    </div>
  );
}

function Box({ bg, border, label, labelColor = '#6a7078', value, valueColor = '#dfe3e8', mono }: { bg: string; border: string; label: string; labelColor?: string; value: string; valueColor?: string; mono?: boolean }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 9, padding: '13px 14px' }}>
      <div style={{ fontSize: 10, color: labelColor, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 12.5, color: valueColor, lineHeight: 1.6, fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit' }}>{value}</div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 },
  backdrop: { position: 'absolute', inset: 0, background: 'rgba(8,9,12,0.55)', pointerEvents: 'auto' },
  drawer: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 430, background: '#181b21', borderLeft: '1px solid #2d323d', pointerEvents: 'auto', display: 'flex', flexDirection: 'column', animation: 'drawerIn 0.2s ease' },
  drawerHeader: { padding: '18px 20px', borderBottom: '1px solid #262a33', flexShrink: 0 },
  drawerTitle: { margin: '8px 0 10px', fontSize: 15.5, fontWeight: 700, lineHeight: 1.4, color: '#e6e8ec' },
  mono: { fontSize: 10, color: '#7e8590', fontFamily: "'JetBrains Mono', monospace" },
  monoSm: { fontSize: 10, color: '#6a7078', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 7 },
  closeBtn: { border: 'none', background: 'transparent', color: '#7e8590', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: 0 },
  iconBtn: { border: 'none', background: 'transparent', color: '#7e8590', fontSize: 13, cursor: 'pointer', lineHeight: 1, padding: '2px 4px' },
  ctxIdBtn: { border: 'none', background: 'transparent', color: '#7c9fd4', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', padding: 0, textDecoration: 'underline' },
  tabBar: { display: 'flex', gap: 4, padding: '10px 14px', borderBottom: '1px solid #262a33', overflowX: 'auto', flexShrink: 0 },
  tabContent: { flex: 1, overflowY: 'auto', padding: '18px 20px' },
  stack: { display: 'flex', flexDirection: 'column', gap: 13 },
  linkBtn: { border: '1px solid #2d323d', background: '#1b1e25', color: '#9cc0f5', padding: 8, borderRadius: 7, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const },
  footer: { padding: '12px 20px 0', borderTop: '1px solid #262a33', flexShrink: 0 },
  aiRunBtn: { width: '100%', border: '1px solid #25382b', background: '#161d18', color: '#9fd9c0', padding: 9, borderRadius: 8, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 },
  footerActions: { padding: '12px 20px 14px', display: 'flex', gap: 8, flexShrink: 0 },
  bounceBtn: { flex: 1, border: '1px solid #3a2329', background: '#1f1417', color: '#e7bccb', padding: 9, borderRadius: 8, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit' },
  rdeBtn: { flex: 1, border: 'none', background: '#5848a0', color: '#fff', padding: 9, borderRadius: 8, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit' },
  editInput: { width: '100%', background: '#1b1e25', border: '1px solid #3a4556', borderRadius: 7, color: '#e6e8ec', fontSize: 14, fontWeight: 600, padding: '7px 10px', fontFamily: 'inherit', boxSizing: 'border-box' as const },
  editSelect: { flex: 1, background: '#1b1e25', border: '1px solid #2d323d', borderRadius: 7, color: '#c8cdd5', fontSize: 12, padding: '6px 8px', fontFamily: 'inherit' },
  saveBtn: { flex: 1, border: 'none', background: '#3b6fd4', color: '#fff', padding: '7px 12px', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },
  cancelEditBtn: { flex: 1, border: '1px solid #2d323d', background: '#1b1e25', color: '#9aa1ad', padding: '7px 12px', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },
};
