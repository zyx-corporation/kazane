import type { EnrichedWorkItem } from '../types';
import type { Translations } from '../i18n';

const COLS = [
  { key: 'inbox' as const, name: 'Inbox', color: '#6a7078' },
  { key: 'ai' as const, name: 'AI Working', color: '#5b8def' },
  { key: 'human' as const, name: 'Needs Human', color: '#d9a93f' },
  { key: 'gate' as const, name: 'Expert / Gate', color: '#a07fe0' },
  { key: 'done' as const, name: 'Done / Logged', color: '#5fb87a' },
];

interface WorkBoardProps {
  items: EnrichedWorkItem[];
  t: Translations;
  onOpenItem: (id: string) => void;
}

export function WorkBoard({ items, t, onOpenItem }: WorkBoardProps) {
  return (
    <section style={s.page}>
      <div style={{ flexShrink: 0 }}>
        <h1 style={s.h1}>Work Board</h1>
        <p style={s.sub}>{t.subBoard}</p>
        <div style={s.legend}>
          <LegendDot dot="#3fb6a8" round label={t.legendAI} />
          <LegendDot dot="#5b8def" round label={t.legendHuman} />
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#7e8590' }}>
            <span style={{ width: 14, height: 9, borderRadius: 3, background: '#241f16', border: '1px solid #3a3220' }} />
            {t.legendGate}
          </span>
        </div>
      </div>

      <div style={s.board}>
        {COLS.map(col => {
          const colItems = items.filter(i => i.col === col.key);
          return (
            <div key={col.key} style={s.col}>
              <div style={s.colHeader}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: col.color }} />
                <span style={s.colName}>{col.name}</span>
                <span style={s.colCount}>{colItems.length}</span>
              </div>
              <div style={{ flex: 1, background: '#15181e', border: '1px solid #232730', borderRadius: 11, padding: 9, display: 'flex', flexDirection: 'column', gap: 9, minHeight: 120 }}>
                {colItems.map(it => <WorkCard key={it.id} item={it} onOpen={() => onOpenItem(it.id)} />)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WorkCard({ item, onOpen }: { item: EnrichedWorkItem; onOpen: () => void }) {
  return (
    <div onClick={onOpen} style={{ ...s.card, borderLeft: `3px solid ${item.dc}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: '#aeb4bf' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.dc }} />{item.domain}
        </span>
        <span style={{ fontSize: 9.5, color: item.riskColor, border: `1px solid ${item.riskColor}`, padding: '2px 6px', borderRadius: 5 }}>{item.riskLabel}</span>
      </div>
      <div style={s.cardTitle}>{item.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 10.5, color: '#8b919c', fontFamily: "'JetBrains Mono', monospace" }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.actorColor }} />
        {item.assignee} <span style={{ color: '#4f555f' }}>·</span> {item.contextId}
      </div>
      <div style={s.nextAction}>→ {item.nextAction}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={s.gateChip}>⚑ {item.gate}</span>
        {item.rde && <span style={s.rdeChip}>RDE要</span>}
      </div>
      <div style={s.tagRow}>
        {['文脈', '引継', '証跡', '監査'].map(t => <span key={t} style={s.tag}>{t}</span>)}
      </div>
    </div>
  );
}

function LegendDot({ dot, round, label }: { dot: string; round?: boolean; label: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#7e8590' }}>
      <span style={{ width: 9, height: 9, borderRadius: round ? '50%' : 3, background: dot }} />{label}
    </span>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '26px 28px 12px', height: '100%', display: 'flex', flexDirection: 'column' },
  h1: { margin: 0, fontSize: 22, fontWeight: 700, color: '#e6e8ec' },
  sub: { margin: '6px 0 0', color: '#8b919c', fontSize: 13 },
  legend: { display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 },
  board: { flex: 1, marginTop: 18, display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 18, alignItems: 'flex-start' },
  col: { width: 268, flexShrink: 0, display: 'flex', flexDirection: 'column' },
  colHeader: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px 10px' },
  colName: { fontSize: 12.5, fontWeight: 600, color: '#d3d8df' },
  colCount: { fontSize: 11, color: '#6a7078', fontFamily: "'JetBrains Mono', monospace" },
  card: { background: '#1b1e25', border: '1px solid #2a2f3a', borderRadius: 9, padding: '11px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 },
  cardTitle: { fontSize: 12.5, fontWeight: 500, color: '#e6e8ec', lineHeight: 1.4 },
  nextAction: { fontSize: 10.5, color: '#9aa1ad', background: '#171a20', border: '1px solid #262a33', borderRadius: 6, padding: '5px 8px' },
  gateChip: { fontSize: 9.5, color: '#c9b27a', background: '#241f16', border: '1px solid #3a3220', padding: '3px 7px', borderRadius: 5 },
  rdeChip: { fontSize: 9.5, color: '#b6a6ee', background: '#1d1a29', border: '1px solid #322c47', padding: '3px 7px', borderRadius: 5 },
  tagRow: { display: 'flex', gap: 4, paddingTop: 2, borderTop: '1px solid #23272f' },
  tag: { fontSize: 9, color: '#6a7078', background: '#16191f', padding: '2px 6px', borderRadius: 4 },
};
