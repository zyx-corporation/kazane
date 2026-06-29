import type { EnrichedWorkItem, Screen } from '../types';
import type { Translations } from '../i18n';
import { DOMAIN_COLORS } from '../types';

interface FlowDashboardProps {
  items: EnrichedWorkItem[];
  t: Translations;
  onOpenItem: (id: string) => void;
  onNav: (s: Screen) => void;
}

const STALE_DAYS = 7;
function countStale(items: EnrichedWorkItem[]): number {
  const cutoff = Date.now() - STALE_DAYS * 86_400_000;
  return items.filter(i => {
    if (i.col === 'done') return false;
    const ref = i.updatedAt;
    return ref ? new Date(ref).getTime() < cutoff : false;
  }).length;
}

function nowLabel(): string {
  const d = new Date();
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') + ' · ' +
    d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function FlowDashboard({ items, t, onOpenItem, onNav }: FlowDashboardProps) {
  const morningItems = items.filter(i => i.morning);
  const bouncedItems = items.filter(i => i.bounced);
  const queueItems = items.filter(i => i.col === 'human' || i.col === 'gate');
  const domainCounts = Object.entries(DOMAIN_COLORS).map(([name, dc]) => ({
    name, dc, count: items.filter(i => i.domain === name).length,
  }));

  const staleCount = countStale(items);
  const sumCards = [
    { label: t.cInProgress, value: items.filter(i => i.col === 'ai' || i.col === 'inbox').length, sub: t.sInProgress, color: '#5b8def', onClick: () => onNav('board') },
    { label: t.cHuman, value: items.filter(i => i.col === 'human').length, sub: t.sHuman, color: '#d9a93f', onClick: () => onNav('board') },
    { label: t.cRde, value: items.filter(i => i.rde).length, sub: t.sRde, color: '#b6a6ee', onClick: () => onNav('rde') },
    { label: t.cGate, value: items.filter(i => i.col === 'gate').length, sub: t.sGate, color: '#a07fe0', onClick: () => onNav('gate') },
    { label: '停滞', value: staleCount, sub: `${STALE_DAYS}日以上更新なし`, color: staleCount > 0 ? '#a89464' : '#4a5268', onClick: () => onNav('board') },
  ];

  return (
    <section style={s.page}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={s.h1}>Flow Dashboard</h1>
          <p style={s.sub}>{t.subDash}</p>
        </div>
        <div style={s.mono}>{nowLabel()}</div>
      </div>

      {/* Summary bar */}
      <div style={s.summaryBar}>
        <span style={s.greenDot} />
        <span style={{ fontSize: 13, color: '#c8d0cb' }}>{t.dashSummary}</span>
      </div>

      {/* Stat cards */}
      <div style={s.statGrid}>
        {sumCards.map((c, i) => (
          <button key={i} onClick={c.onClick} style={s.statCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: '#9aa1ad' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />{c.label}
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: c.color, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{c.value}</div>
            <div style={{ fontSize: 10.5, color: '#6a7078' }}>{c.sub}</div>
          </button>
        ))}
      </div>

      {/* Main panels */}
      <div style={s.panels}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Morning items */}
          <div>
            <SectionHead dot="#5b8def" title={t.hdMorning} />
            <div style={s.stack}>
              {morningItems.map(it => (
                <div key={it.id} onClick={() => onOpenItem(it.id)} style={s.itemRow}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: it.dc, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, color: '#e0e3e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</div>
                    <div style={{ fontSize: 10.5, color: '#7e8590', fontFamily: "'JetBrains Mono', monospace" }}>{it.domain} · {it.assignee}</div>
                  </div>
                  <span style={{ fontSize: 10, color: it.colColor, border: `1px solid ${it.colColor}`, padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>{it.status}</span>
                </div>
              ))}
              {morningItems.length === 0 && <Empty />}
            </div>
          </div>

          {/* Bounced items */}
          <div>
            <SectionHead dot="#d9a93f" title={t.hdBounced} note={t.bouncedNote} />
            <div style={s.stack}>
              {bouncedItems.map(it => (
                <div key={it.id} onClick={() => onOpenItem(it.id)} style={{ ...s.itemRow, border: '1px solid #34301f', background: '#1d1b14' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: it.dc, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, color: '#e0e3e8' }}>{it.title}</div>
                    <div style={{ fontSize: 10.5, color: '#a89464', fontFamily: "'JetBrains Mono', monospace" }}>{it.domain} · {it.gate}</div>
                  </div>
                  <span style={{ fontSize: 10, color: '#d9a93f', flexShrink: 0 }}>{t.returnedTag}</span>
                </div>
              ))}
              {bouncedItems.length === 0 && <Empty />}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Queue */}
          <div>
            <SectionHead dot="#a07fe0" title={t.hdQueue} />
            <div style={s.stack}>
              {queueItems.map(it => (
                <div key={it.id} onClick={() => onOpenItem(it.id)} style={{ padding: '10px 12px', border: '1px solid #262a33', borderLeft: `3px solid ${it.colColor}`, borderRadius: 8, background: '#1a1d24', cursor: 'pointer' }}>
                  <div style={{ fontSize: 12, color: '#e0e3e8' }}>{it.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: '#7e8590', fontFamily: "'JetBrains Mono', monospace" }}>{it.domain}</span>
                    <span style={{ fontSize: 10, color: it.colColor }}>{it.status}</span>
                  </div>
                </div>
              ))}
              {queueItems.length === 0 && <Empty />}
            </div>
          </div>

          {/* Domain queue */}
          <div>
            <SectionHead dot="#3fb6a8" title={t.hdDomainQueue} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {domainCounts.filter(d => d.count > 0).map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 11px', border: '1px solid #262a33', borderRadius: 20, background: '#1a1d24' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.dc }} />
                  <span style={{ fontSize: 11.5, color: '#c8cdd5' }}>{d.name}</span>
                  <span style={{ fontSize: 11, color: '#7e8590', fontFamily: "'JetBrains Mono', monospace" }}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ dot, title, note }: { dot: string; title: string; note?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#c8cdd5' }}>{title}</h3>
      {note && <span style={{ fontSize: 10, color: '#6a7078' }}>{note}</span>}
    </div>
  );
}

function Empty() {
  return <div style={{ fontSize: 12, color: '#4a5268', padding: '8px 0' }}>—</div>;
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '26px 28px 40px', maxWidth: 1100 },
  h1: { margin: 0, fontSize: 22, fontWeight: 700, color: '#e6e8ec' },
  sub: { margin: '6px 0 0', color: '#8b919c', fontSize: 13 },
  mono: { fontSize: 11, color: '#6a7078', fontFamily: "'JetBrains Mono', monospace" },
  summaryBar: { marginTop: 18, padding: '14px 16px', background: '#171f1c', border: '1px solid #25382f', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 },
  greenDot: { width: 8, height: 8, borderRadius: '50%', background: '#5fb89f', flexShrink: 0 },
  statGrid: { marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 },
  statCard: { textAlign: 'left', border: '1px solid #262a33', background: '#1a1d24', borderRadius: 11, padding: '15px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6 },
  panels: { marginTop: 22, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 },
  stack: { display: 'flex', flexDirection: 'column', gap: 8 },
  itemRow: { display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', border: '1px solid #262a33', borderRadius: 9, background: '#1a1d24', cursor: 'pointer' },
};
