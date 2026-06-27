import { useState, useRef, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { Screen, BoardCol, Lang, DrawerTab, WorkItem, ContextCard, EnrichedWorkItem, HandoffNote, EventType } from './types';
import { enrichItem, COL_NAMES, isAiActor } from './types';
import { getT } from './i18n';
import { seedItems, seedContexts, seedHandoffs, gateRulesData, rdeEvidenceData } from './data/seed';
import { dbListItems, dbUpsertItem, dbDeleteItem, dbListContextCards, dbUpsertContextCard, dbListHandoffs, dbUpsertHandoff, dbAddEvent, dbListEvents } from './db';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { WorkItemDrawer } from './components/WorkItemDrawer';
import { NewWorkItemModal } from './components/NewWorkItemModal';
import { NewContextCardModal } from './components/NewContextCardModal';
import { FlowDashboard } from './screens/FlowDashboard';
import { WorkBoard } from './screens/WorkBoard';
import { ContextCards } from './screens/ContextCards';
import { HandoffNotes } from './screens/HandoffNotes';
import { EscalationGate } from './screens/EscalationGate';
import { RdeEvidenceAudit } from './screens/RdeEvidenceAudit';

const SCREEN_LABELS: Record<Screen, string> = {
  dashboard: 'Flow Dashboard',
  board: 'Work Board',
  context: 'Context Cards',
  handoff: 'Handoff Notes',
  gate: 'Escalation Gate',
  rde: 'RDE / Evidence Audit',
};

const IS_TAURI = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

function loadLangFromStorage(): Lang {
  try {
    const l = localStorage.getItem('kazane_lang') as Lang;
    if (l === 'ja' || l === 'en' || l === 'zh') return l;
  } catch (_) {}
  return 'ja';
}

function loadItemsFromStorage(): WorkItem[] | null {
  try {
    const raw = localStorage.getItem('kazane_items');
    if (raw) {
      const items = JSON.parse(raw) as WorkItem[];
      if (Array.isArray(items) && items.length) return items;
    }
  } catch (_) {}
  return null;
}

function persistLocal(items: WorkItem[]) {
  try { localStorage.setItem('kazane_items', JSON.stringify(items)); } catch (_) {}
}

function makeEventId(): string {
  return 'EV-' + Date.now().toString(36).toUpperCase();
}

function nextId(items: WorkItem[]): string {
  const nums = items.map(i => parseInt(i.id.replace('WI-', ''), 10)).filter(n => !isNaN(n));
  return 'WI-' + String((Math.max(0, ...nums) + 1)).padStart(3, '0');
}

function nextCtxId(ctxs: ContextCard[]): string {
  const nums = ctxs.map(c => parseInt(c.id.replace('CTX-', ''), 10)).filter(n => !isNaN(n));
  return 'CTX-' + String((Math.max(0, ...nums) + 1)).padStart(3, '0');
}

function colStatus(col: BoardCol): string {
  return COL_NAMES[col];
}

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [items, setItems] = useState<WorkItem[]>(loadItemsFromStorage() ?? seedItems);
  const [contexts, setContexts] = useState<ContextCard[]>(seedContexts);
  const [handoffs, setHandoffs] = useState(seedHandoffs);
  const [dbReady, setDbReady] = useState(false);
  const [selId, setSelId] = useState<string | null>(null);
  const [tab, setTab] = useState<DrawerTab>('context');
  const [ctxSel, setCtxSel] = useState('CTX-018');
  const [hoSel, setHoSel] = useState('HO-31');
  const [gateDomain, setGateDomain] = useState('all');
  const [wiModalOpen, setWiModalOpen] = useState(false);
  const [ctxModalOpen, setCtxModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', domain: '顧客対応', assignee: 'AI番頭' });
  const [toast, setToast] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>(() => loadLangFromStorage());
  const [langOpen, setLangOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Global keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      if (e.key === 'Escape') {
        if (selId) { setSelId(null); return; }
        if (wiModalOpen) { setWiModalOpen(false); return; }
        if (ctxModalOpen) { setCtxModalOpen(false); return; }
        if (langOpen) { setLangOpen(false); return; }
      }
      if (!isInput && e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        setWiModalOpen(true);
        setForm({ title: '', domain: '顧客対応', assignee: 'AI番頭' });
      }
      if (!isInput && e.key === 'b' && !e.metaKey && !e.ctrlKey) nav('board');
      if (!isInput && e.key === 'd' && !e.metaKey && !e.ctrlKey) nav('dashboard');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selId, wiModalOpen, ctxModalOpen, langOpen]);

  const t = getT(lang);
  const enriched: EnrichedWorkItem[] = items.map(enrichItem);
  const selItem = enriched.find(i => i.id === selId) ?? null;

  // Load from SQLite on mount (Tauri only)
  useEffect(() => {
    if (!IS_TAURI) return;
    let cancelled = false;
    Promise.all([dbListItems(), dbListContextCards(), dbListHandoffs()]).then(([rows, ctxRows, hoRows]) => {
      if (cancelled) return;
      if (rows.length > 0) {
        setItems(rows);
      } else {
        Promise.all(seedItems.map(si => dbUpsertItem(si)));
      }
      if (ctxRows.length > 0) {
        setContexts(ctxRows);
      } else {
        Promise.all(seedContexts.map(c => dbUpsertContextCard(c)));
      }
      if (hoRows.length > 0) {
        setHandoffs(hoRows);
      } else {
        Promise.all(seedHandoffs.map(ho => dbUpsertHandoff(ho)));
      }
      setDbReady(true);
    }).catch(() => { if (!cancelled) setDbReady(false); });
    return () => { cancelled = true; };
  }, []);

  const persist = useCallback((updated: WorkItem[], changed?: WorkItem) => {
    persistLocal(updated);
    if (IS_TAURI && dbReady && changed) dbUpsertItem(changed).catch(() => {});
  }, [dbReady]);

  const logEv = useCallback((wiId: string, eventType: EventType, opts?: { fromCol?: string; toCol?: string; actor?: string; note?: string }) => {
    if (!IS_TAURI || !dbReady) return;
    dbAddEvent({
      id: makeEventId(),
      wiId,
      eventType,
      fromCol: opts?.fromCol,
      toCol: opts?.toCol,
      actor: opts?.actor ?? 'system',
      note: opts?.note,
      createdAt: new Date().toISOString(),
    }).catch(() => {});
  }, [dbReady]);

  function flash(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  function nav(s: Screen) { setScreen(s); setSelId(null); }

  function openItem(id: string) { setSelId(id); setTab('context'); }

  function closeDrawer() { setSelId(null); }

  function moveItem(id: string, col: BoardCol) {
    const prev = items.find(i => i.id === id);
    let changed: WorkItem | undefined;
    const updated = items.map(i => {
      if (i.id !== id) return i;
      changed = { ...i, col, status: colStatus(col), bounced: col === 'human' ? true : i.bounced, nextAction: col === 'done' ? '完了・記録済' : i.nextAction };
      return changed;
    });
    setItems(updated); persist(updated, changed);
    logEv(id, 'moved', { fromCol: prev?.col, toCol: col, actor: 'human', note: colStatus(col) });
    flash(t.toastMoved.replace('{id}', id).replace('{status}', colStatus(col)));
  }

  function bounce(id: string) { moveItem(id, 'human'); }

  function runRde(id: string) {
    let changed: WorkItem | undefined;
    const updated = items.map(i => {
      if (i.id !== id) return i;
      changed = { ...i, rde: true, rdeAudit: i.rdeAudit ?? { kept: '仕事の主旨を維持。', transformed: '実施内容を要約・構造化。', unresolved: '監査者の確認待ち項目。' } };
      return changed;
    });
    setItems(updated); persist(updated, changed);
    setScreen('rde'); setSelId(null);
    flash(t.toastRde.replace('{id}', id));
  }

  function aiRun(id: string) {
    const it = items.find(i => i.id === id);
    if (!it) return;
    let aiChanged: WorkItem | undefined;
    const aiUpdated = items.map(i => {
      if (i.id !== id) return i;
      aiChanged = { ...i, col: 'ai' as BoardCol, status: colStatus('ai') };
      return aiChanged;
    });
    setItems(aiUpdated); persist(aiUpdated, aiChanged);
    flash(t.toastMoved.replace('{id}', id).replace('{status}', colStatus('ai')));
    if (aiTimer.current) clearTimeout(aiTimer.current);
    aiTimer.current = setTimeout(() => {
      const highRisk = ['顧客対応', '営業', '経理', '診断士連携'].includes(it.domain);
      const targetCol: BoardCol = it.risk === '高' ? 'gate' : highRisk ? 'human' : 'done';
      const autoHo = { ...it.ho, did: t.hoAutoDid, uncertain: t.hoAutoUncertain, next: t.hoAutoNext };
      setItems(prev => {
        let doneChanged: WorkItem | undefined;
        const updated2 = prev.map(i => {
          if (i.id !== id) return i;
          doneChanged = { ...i, col: targetCol, status: colStatus(targetCol), bounced: targetCol === 'human', ho: autoHo, nextAction: targetCol === 'done' ? '完了・記録済' : i.nextAction };
          return doneChanged;
        });
        persist(updated2, doneChanged);
        return updated2;
      });
      // Auto-generate HandoffNote
      const hoNum = String(Date.now()).slice(-3);
      const newHo = {
        id: `HO-${hoNum}`,
        wi: `${id} ${it.title}`,
        assignee: it.assignee,
        domain: it.domain,
        did: t.hoAutoDid,
        judged: targetCol === 'done' ? '責任範囲内で完了と判断。' : '',
        couldnt: targetCol !== 'done' ? '責任境界を超えるため停止。' : '',
        uncertain: t.hoAutoUncertain,
        bounce: targetCol !== 'done' ? colStatus(targetCol) + ' へ移動。' : '',
        next: t.hoAutoNext,
        updCtx: it.contextId !== '—' ? it.contextId + ' を更新予定。' : '',
        ev: it.ev.map(e => e.label),
        gate: targetCol === 'gate' ? it.gate : '',
        ask: targetCol !== 'done' ? '人間が判断・承認をお願いします。' : '',
      };
      setHandoffs(prev => [newHo, ...prev]);
      setHoSel(newHo.id);
      if (IS_TAURI && dbReady) dbUpsertHandoff(newHo).catch(() => {});
      if (targetCol === 'done') flash(t.toastAiDone.replace('{id}', id));
      else flash(t.toastAiStopped.replace('{id}', id).replace('{status}', colStatus(targetCol)));
    }, 1400);
  }

  function editItem(id: string, patch: { title: string; domain: string; assignee: string; risk: WorkItem['risk']; nextAction: string }) {
    let changed: WorkItem | undefined;
    const updated = items.map(i => {
      if (i.id !== id) return i;
      changed = { ...i, ...patch };
      return changed;
    });
    setItems(updated); persist(updated, changed);
    logEv(id, 'edited', { actor: 'human', note: patch.title });
    flash(t.toastEdited.replace('{id}', id));
  }

  function deleteItem(id: string) {
    const updated = items.filter(i => i.id !== id);
    setItems(updated); persistLocal(updated);
    if (IS_TAURI && dbReady) dbDeleteItem(id).catch(() => {});
    setSelId(null);
    flash(t.toastDeleted.replace('{id}', id));
  }

  function assignToAgent(id: string) {
    const it = items.find(i => i.id === id);
    if (!it) return;
    const now = new Date().toISOString();
    let changed: WorkItem | undefined;
    const updated = items.map(i => {
      if (i.id !== id) return i;
      changed = { ...i, col: 'ai' as BoardCol, status: COL_NAMES['ai'], agentPickedUpAt: now, agentEscalated: false, escalationReason: '' };
      return changed;
    });
    setItems(updated); persist(updated, changed);
    if (IS_TAURI) {
      invoke('write_agent_task', { id, payload: JSON.stringify({ ...it, agentPickedUpAt: now }) }).catch(() => {});
    }
    logEv(id, 'agent_assigned', { fromCol: it.col, toCol: 'ai', actor: it.assignee });
    flash(t.toastAgentAssigned.replace('{id}', id));
  }

  const importAgentHandoff = useCallback((ho: HandoffNote) => {
    setHandoffs(prev => [ho, ...prev]);
    setHoSel(ho.id);
    if (IS_TAURI && dbReady) dbUpsertHandoff(ho).catch(() => {});
    const wiId = ho.wi.split(' ')[0];
    const escalated = ho.escalated ?? false;
    const targetCol: BoardCol = escalated ? 'gate' : 'done';
    setItems(prev => {
      let changed: WorkItem | undefined;
      const updated = prev.map(i => {
        if (i.id !== wiId) return i;
        changed = {
          ...i, col: targetCol, status: COL_NAMES[targetCol],
          agentEscalated: escalated,
          escalationReason: ho.escalationReason ?? '',
          bounced: escalated ? true : i.bounced,
          ho: { ...i.ho, did: ho.did, judged: ho.judged, couldnt: ho.couldnt, uncertain: ho.uncertain, bounce: ho.bounce, next: ho.next },
          nextAction: targetCol === 'done' ? '完了・記録済' : i.nextAction,
        };
        return changed;
      });
      persistLocal(updated);
      if (IS_TAURI && dbReady && changed) dbUpsertItem(changed).catch(() => {});
      return updated;
    });
    const evType = escalated ? 'agent_escalated' : 'agent_handoff';
    logEv(wiId, evType as EventType, { toCol: targetCol, actor: ho.assignee, note: ho.did.slice(0, 80) });
    if (escalated) flash(t.toastAgentEscalated.replace('{id}', wiId));
    else flash(t.toastAgentHandoffReceived.replace('{id}', wiId));
  }, [dbReady, logEv, t]);

  // Poll for agent handoffs every 10s (Tauri only)
  useEffect(() => {
    if (!IS_TAURI) return;
    const interval = setInterval(async () => {
      try {
        const ids = await invoke<string[]>('poll_agent_handoffs');
        for (const wiId of ids) {
          const json = await invoke<string>('read_agent_handoff', { id: wiId });
          importAgentHandoff(JSON.parse(json) as HandoffNote);
        }
      } catch (_) {}
    }, 10_000);
    return () => clearInterval(interval);
  }, [importAgentHandoff]);

  function addItem(partial: Partial<WorkItem> & { title: string; domain: string; assignee: string }) {
    const id = nextId(items);
    const isAI = isAiActor(partial.assignee);
    const it: WorkItem = {
      id, col: 'inbox', status: colStatus('inbox'), risk: '中',
      contextId: '—', nextAction: 'AIが着手予定',
      gate: isAI ? 'AI権限内で着手可' : '人間レビュー待ち',
      rde: false, morning: false, bounced: false,
      ctx: { question: 'この仕事はなぜ生まれたか（未記入）。', purpose: '目的を記入。', constraint: '制約・責任境界を記入。', unresolved: '未解決点を記入。' },
      ho: { did: '未着手。', uncertain: '—', bounce: '—', next: '担当が着手し、Handoffを残す。' },
      ev: [], gatePerm: '整理・下調べ・草案', gateStops: '外部送信／契約／金銭／専門家判断',
      ...partial,
    };
    const updated = [it, ...items];
    setItems(updated); persist(updated, it);
    logEv(id, 'created', { toCol: it.col, actor: it.assignee, note: it.title });
    setWiModalOpen(false);
    flash(t.toastAdded.replace('{id}', id));
  }

  function submitForm() {
    if (!form.title.trim()) { flash(t.toastNeedTitle); return; }
    addItem({ title: form.title.trim(), domain: form.domain, assignee: form.assignee });
  }

  function addContext(title: string, question: string) {
    const id = nextCtxId(contexts);
    const card: ContextCard = {
      id, title, question,
      purpose: '目的を記入。', context: '', constraint: '制約を記入。',
      past: '', relatedWI: [], relatedEv: [], unresolved: [], nextPolicy: '担当が随時更新。',
    };
    const updated = [card, ...contexts];
    setContexts(updated);
    if (IS_TAURI && dbReady) dbUpsertContextCard(card).catch(() => {});
    setCtxModalOpen(false);
    setCtxSel(id);
    setScreen('context');
    flash(`${id} Context Card を追加しました`);
  }

  function promoteUnresolved(text: string, domain: string, contextId: string) {
    addItem({ title: text + '（未解決点から）', domain: domain || '調査', assignee: 'AI Assistant', contextId });
    setScreen('board');
  }

  function goCtxById(id: string) {
    setCtxSel(id);
    setScreen('context');
    setSelId(null);
  }

  function exportItems() {
    const ts = new Date().toISOString().slice(0, 10);
    downloadJson({ exportedAt: new Date().toISOString(), workItems: items, contextCards: contexts }, `kazane-export-${ts}.json`);
    flash(t.toastExported);
  }

  function changeLang(l: Lang) {
    setLang(l); setLangOpen(false);
    try { localStorage.setItem('kazane_lang', l); } catch (_) {}
  }

  async function resetDemo() {
    if (IS_TAURI && dbReady) {
      try {
        const [current, currentCtx] = await Promise.all([dbListItems(), dbListContextCards()]);
        await Promise.all([
          ...current.map(i => dbDeleteItem(i.id)),
          ...currentCtx.map(() => Promise.resolve()),
        ]);
        await Promise.all([
          ...seedItems.map(si => dbUpsertItem(si)),
          ...seedContexts.map(c => dbUpsertContextCard(c)),
          ...seedHandoffs.map(ho => dbUpsertHandoff(ho)),
        ]);
      } catch (_) {}
    }
    try { localStorage.setItem('kazane_items', JSON.stringify(seedItems)); } catch (_) {}
    setItems(seedItems); setContexts(seedContexts); setHandoffs(seedHandoffs);
    setSelId(null); setWiModalOpen(false); setCtxModalOpen(false);
    flash(t.btnReset);
  }

  const langLabel = lang === 'ja' ? '日本語' : lang === 'zh' ? '简体中文' : 'English';
  const langOpts: { code: Lang; label: string }[] = [
    { code: 'ja', label: '日本語' },
    { code: 'en', label: 'English' },
    { code: 'zh', label: '简体中文（暫定）' },
  ];

  return (
    <div style={s.root}>
      <Sidebar current={screen} lang={lang} t={t} onNav={nav} />

      <main style={s.main}>
        {/* Header */}
        <header style={s.header}>
          <div style={s.breadcrumb}>
            <span>ZYX Workspace</span><span>/</span>
            <span style={{ color: '#9aa1ad' }}>{SCREEN_LABELS[screen]}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setLangOpen(!langOpen)} style={s.langBtn}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9aa1ad" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3v18" />
                </svg>
                {langLabel}
                <span style={{ color: '#6a7078', fontSize: 9 }}>▾</span>
              </button>
              {langOpen && (
                <div style={s.langDropdown}>
                  {langOpts.map(o => (
                    <button key={o.code} onClick={() => changeLang(o.code)} style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      border: 'none', background: lang === o.code ? '#232a39' : 'transparent',
                      color: lang === o.code ? '#e6e8ec' : '#9aa1ad',
                      padding: '8px 11px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                    }}>{o.label}</button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={exportItems} style={s.headerBtn}>{t.btnExportReport}</button>
            <button onClick={resetDemo} style={s.headerBtn}>{t.btnReset}</button>
            <button onClick={() => { setWiModalOpen(true); setForm({ title: '', domain: '顧客対応', assignee: 'AI番頭' }); }} style={s.newItemBtn}>{t.btnNewItem}</button>
          </div>
        </header>

        {/* Screen content */}
        <div style={s.content} onClick={() => langOpen && setLangOpen(false)}>
          {screen === 'dashboard' && <FlowDashboard items={enriched} t={t} onOpenItem={openItem} onNav={nav} />}
          {screen === 'board' && <WorkBoard items={enriched} t={t} onOpenItem={openItem} onMoveItem={moveItem} />}
          {screen === 'context' && (
            <ContextCards contexts={contexts} ctxSel={ctxSel} t={t}
              onSelectCtx={setCtxSel}
              onPromoteUnresolved={promoteUnresolved}
              onGoBoard={() => nav('board')}
              onGoRde={() => nav('rde')}
              onAddCtx={() => setCtxModalOpen(true)}
            />
          )}
          {screen === 'handoff' && (
            <HandoffNotes handoffs={handoffs} hoSel={hoSel} t={t}
              onSelectHo={setHoSel}
              onGoCtx={() => nav('context')}
              onGoRde={() => nav('rde')}
            />
          )}
          {screen === 'gate' && (
            <EscalationGate gateRules={gateRulesData} gateDomain={gateDomain} t={t} items={enriched} onSetGateDomain={setGateDomain} />
          )}
          {screen === 'rde' && (
            <RdeEvidenceAudit rdeEvidence={rdeEvidenceData} t={t}
              onPromoteRde={() => promoteUnresolved('業務領域別テンプレート', '調査', 'CTX-002')}
              onGoCtx={() => nav('context')}
              onExport={exportItems}
            />
          )}
        </div>
      </main>

      {/* Work Item Drawer */}
      {selItem && (
        <WorkItemDrawer
          item={selItem} tab={tab} t={t}
          onClose={closeDrawer}
          onSetTab={setTab}
          onMoveItem={moveItem}
          onBounce={bounce}
          onRunRde={runRde}
          onAiRun={aiRun}
          onAssignToAgent={assignToAgent}
          onEditItem={editItem}
          onDeleteItem={deleteItem}
          onLoadEvents={id => IS_TAURI && dbReady ? dbListEvents(id) : Promise.resolve([])}
          onGoCtx={() => { nav('context'); }}
          onGoCtxById={goCtxById}
          onGoHand={() => { nav('handoff'); }}
          onGoRde={() => { nav('rde'); }}
          onGoGate={() => { nav('gate'); }}
        />
      )}

      {/* New Work Item Modal */}
      {wiModalOpen && (
        <NewWorkItemModal
          form={form} t={t}
          onClose={() => setWiModalOpen(false)}
          onSetField={(k, v) => setForm(f => ({ ...f, [k]: v }))}
          onSubmit={submitForm}
        />
      )}

      {/* New Context Card Modal */}
      {ctxModalOpen && (
        <NewContextCardModal
          t={t}
          onClose={() => setCtxModalOpen(false)}
          onSubmit={addContext}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} />}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: { display: 'flex', height: '100vh', overflow: 'hidden', background: '#14161b', color: '#e6e8ec', fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif", fontSize: 13, lineHeight: 1.5 },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  header: { height: 54, flexShrink: 0, borderBottom: '1px solid #262a33', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', background: '#15181e' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: 9, fontSize: 11, color: '#6a7078', fontFamily: "'JetBrains Mono', monospace" },
  langBtn: { display: 'flex', alignItems: 'center', gap: 7, border: '1px solid #2d323d', background: '#1b1e25', color: '#c8cdd5', padding: '7px 12px', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },
  langDropdown: { position: 'absolute', top: 39, right: 0, background: '#1b1e25', border: '1px solid #2d323d', borderRadius: 9, padding: 5, minWidth: 132, zIndex: 80, boxShadow: '0 8px 24px rgba(0,0,0,0.45)' },
  headerBtn: { border: '1px solid #2d323d', background: '#1b1e25', color: '#9aa1ad', padding: '7px 11px', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },
  newItemBtn: { border: 'none', background: '#3b6fd4', color: '#fff', padding: '7px 14px', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 },
  content: { flex: 1, overflowY: 'auto', overflowX: 'hidden' },
};
