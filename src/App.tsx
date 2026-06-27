import { useState, useRef, useEffect, useCallback } from 'react';
import type { Screen, BoardCol, Lang, DrawerTab, WorkItem, EnrichedWorkItem } from './types';
import { enrichItem, COL_NAMES, isAiActor } from './types';
import { getT } from './i18n';
import { seedItems, seedContexts, seedHandoffs, gateRulesData, rdeEvidenceData } from './data/seed';
import { dbListItems, dbUpsertItem, dbDeleteItem } from './db';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { WorkItemDrawer } from './components/WorkItemDrawer';
import { NewWorkItemModal } from './components/NewWorkItemModal';
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

// running in Tauri native app?
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

function nextId(items: WorkItem[]): string {
  const nums = items.map(i => parseInt(i.id.replace('WI-', ''), 10)).filter(n => !isNaN(n));
  return 'WI-' + String((Math.max(0, ...nums) + 1)).padStart(3, '0');
}

function colStatus(col: BoardCol): string {
  return COL_NAMES[col];
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [items, setItems] = useState<WorkItem[]>(loadItemsFromStorage() ?? seedItems);
  const [dbReady, setDbReady] = useState(false);
  const [selId, setSelId] = useState<string | null>(null);
  const [tab, setTab] = useState<DrawerTab>('context');
  const [ctxSel, setCtxSel] = useState('CTX-018');
  const [hoSel, setHoSel] = useState('HO-31');
  const [gateDomain, setGateDomain] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', domain: '顧客対応', assignee: 'AI番頭' });
  const [toast, setToast] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>(() => loadLangFromStorage());
  const [langOpen, setLangOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = getT(lang);
  const enriched: EnrichedWorkItem[] = items.map(enrichItem);
  const selItem = enriched.find(i => i.id === selId) ?? null;

  // Load from SQLite on mount (Tauri only); seed DB if empty
  useEffect(() => {
    if (!IS_TAURI) return;
    let cancelled = false;
    dbListItems().then(rows => {
      if (cancelled) return;
      if (rows.length > 0) {
        setItems(rows);
      } else {
        // Seed DB with initial data
        Promise.all(seedItems.map(si => dbUpsertItem(si))).then(() => {
          if (!cancelled) setItems(seedItems);
        });
      }
      setDbReady(true);
    }).catch(() => {
      if (!cancelled) setDbReady(false);
    });
    return () => { cancelled = true; };
  }, []);

  // Persist single item to DB (Tauri) or full list to localStorage
  const persist = useCallback((updated: WorkItem[], changed?: WorkItem) => {
    persistLocal(updated);
    if (IS_TAURI && dbReady && changed) {
      dbUpsertItem(changed).catch(() => {});
    }
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
    let changed: WorkItem | undefined;
    const updated = items.map(i => {
      if (i.id !== id) return i;
      changed = { ...i, col, status: colStatus(col), bounced: col === 'human' ? true : i.bounced, nextAction: col === 'done' ? '完了・記録済' : i.nextAction };
      return changed;
    });
    setItems(updated);
    persist(updated, changed);
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
    setItems(updated);
    persist(updated, changed);
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
    setItems(aiUpdated);
    persist(aiUpdated, aiChanged);
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
      if (targetCol === 'done') flash(t.toastAiDone.replace('{id}', id));
      else flash(t.toastAiStopped.replace('{id}', id).replace('{status}', colStatus(targetCol)));
    }, 1400);
  }

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
    setItems(updated);
    persist(updated, it);
    setModalOpen(false);
    flash(t.toastAdded.replace('{id}', id));
  }

  function submitForm() {
    if (!form.title.trim()) { flash(t.toastNeedTitle); return; }
    addItem({ title: form.title.trim(), domain: form.domain, assignee: form.assignee });
  }

  function promoteUnresolved(text: string, domain: string, contextId: string) {
    addItem({ title: text + '（未解決点から）', domain: domain || '調査', assignee: 'AI Assistant', contextId });
    setScreen('board');
  }

  function changeLang(l: Lang) {
    setLang(l); setLangOpen(false);
    try { localStorage.setItem('kazane_lang', l); } catch (_) {}
  }

  async function resetDemo() {
    if (IS_TAURI && dbReady) {
      try {
        const current = await dbListItems();
        await Promise.all(current.map(i => dbDeleteItem(i.id)));
        await Promise.all(seedItems.map(si => dbUpsertItem(si)));
      } catch (_) {}
    }
    try { localStorage.setItem('kazane_items', JSON.stringify(seedItems)); } catch (_) {}
    setItems(seedItems); setSelId(null); setModalOpen(false);
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
            {/* Language switcher */}
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
            <button style={s.headerBtn}>{t.btnActivityLog}</button>
            <button onClick={resetDemo} style={s.headerBtn}>{t.btnReset}</button>
            <button onClick={() => { setModalOpen(true); setForm({ title: '', domain: '顧客対応', assignee: 'AI番頭' }); }} style={s.newItemBtn}>{t.btnNewItem}</button>
          </div>
        </header>

        {/* Screen content */}
        <div style={s.content} onClick={() => langOpen && setLangOpen(false)}>
          {screen === 'dashboard' && <FlowDashboard items={enriched} t={t} onOpenItem={openItem} onNav={nav} />}
          {screen === 'board' && <WorkBoard items={enriched} t={t} onOpenItem={openItem} />}
          {screen === 'context' && (
            <ContextCards contexts={seedContexts} ctxSel={ctxSel} t={t}
              onSelectCtx={setCtxSel}
              onPromoteUnresolved={promoteUnresolved}
              onGoBoard={() => nav('board')}
              onGoRde={() => nav('rde')}
            />
          )}
          {screen === 'handoff' && (
            <HandoffNotes handoffs={seedHandoffs} hoSel={hoSel} t={t}
              onSelectHo={setHoSel}
              onGoCtx={() => nav('context')}
              onGoRde={() => nav('rde')}
            />
          )}
          {screen === 'gate' && (
            <EscalationGate gateRules={gateRulesData} gateDomain={gateDomain} t={t} onSetGateDomain={setGateDomain} />
          )}
          {screen === 'rde' && (
            <RdeEvidenceAudit rdeEvidence={rdeEvidenceData} t={t}
              onPromoteRde={() => promoteUnresolved('業務領域別テンプレート', '調査', 'CTX-002')}
              onGoCtx={() => nav('context')}
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
          onGoCtx={() => { nav('context'); }}
          onGoHand={() => { nav('handoff'); }}
          onGoRde={() => { nav('rde'); }}
          onGoGate={() => { nav('gate'); }}
        />
      )}

      {/* New Work Item Modal */}
      {modalOpen && (
        <NewWorkItemModal
          form={form} t={t}
          onClose={() => setModalOpen(false)}
          onSetField={(k, v) => setForm(f => ({ ...f, [k]: v }))}
          onSubmit={submitForm}
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
