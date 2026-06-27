import { useState } from 'react';
import type { HandoffNote } from '../types';
import { DOMAIN_COLORS, AI_ACTORS } from '../types';
import type { Translations } from '../i18n';

interface HandoffNotesProps {
  handoffs: HandoffNote[];
  hoSel: string;
  t: Translations;
  onSelectHo: (id: string) => void;
  onGoCtx: () => void;
  onGoRde: () => void;
}

export function HandoffNotes({ handoffs, hoSel, t, onSelectHo, onGoCtx, onGoRde }: HandoffNotesProps) {
  const [query, setQuery] = useState('');
  const filtered = query.trim()
    ? handoffs.filter(h => h.wi.toLowerCase().includes(query.toLowerCase()) || h.assignee.toLowerCase().includes(query.toLowerCase()) || h.domain.toLowerCase().includes(query.toLowerCase()) || h.id.toLowerCase().includes(query.toLowerCase()))
    : handoffs;
  const sel = handoffs.find(h => h.id === hoSel) ?? handoffs[0];
  const selDc = sel ? (DOMAIN_COLORS[sel.domain] ?? '#6a7078') : '#6a7078';
  const selActorColor = sel && AI_ACTORS.includes(sel.assignee) ? '#3fb6a8' : '#5b8def';

  return (
    <section style={s.page}>
      <h1 style={s.h1}>Handoff Notes</h1>
      <p style={s.sub}>{t.subHand}</p>

      <div style={s.layout}>
        {/* Left list */}
        <div style={s.list}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="検索…"
            style={{ background: '#14161b', border: '1px solid #2d323d', borderRadius: 7, color: '#e6e8ec', fontSize: 11.5, padding: '6px 10px', fontFamily: 'inherit', outline: 'none', marginBottom: 4 }}
          />
          {filtered.map(h => {
            const active = h.id === hoSel;
            const dc = DOMAIN_COLORS[h.domain] ?? '#6a7078';
            const isAI = AI_ACTORS.includes(h.assignee);
            return (
              <button key={h.id} onClick={() => onSelectHo(h.id)} style={{
                ...s.listItem,
                border: `1px solid ${active ? '#3a4656' : '#262a33'}`,
                background: active ? '#1f2330' : '#1a1d24',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 10, color: '#7e8590', fontFamily: "'JetBrains Mono', monospace" }}>{h.id}</span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: isAI ? '#3fb6a8' : '#5b8def' }} />
                  <span style={{ fontSize: 11, color: '#aeb4bf' }}>{h.assignee}</span>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#e6e8ec', lineHeight: 1.4 }}>{h.wi}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: dc }} />
                  <span style={{ fontSize: 10.5, color: '#8b919c' }}>{h.domain}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Right detail */}
        {sel && (
          <div style={s.detail}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <span style={{ fontSize: 10, color: '#7e8590', fontFamily: "'JetBrains Mono', monospace" }}>{sel.id}</span>
                <h2 style={s.detailTitle}>{sel.wi}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#aeb4bf' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: selActorColor }} />{sel.assignee}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#aeb4bf' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: selDc }} />{sel.domain}
                  </span>
                </div>
              </div>
              <span style={s.gateChip}>⚑ {sel.gate}</span>
            </div>

            <div style={s.stack}>
              <Box bg="#16191f" border="#262a33" label={t.flDid} value={sel.did} />
              <div style={s.twoCol}>
                <Box bg="#161d18" border="#25382b" label={t.flJudged} labelColor="#5fb89f" value={sel.judged} valueColor="#cfe0d6" />
                <Box bg="#1d1b14" border="#34301f" label={t.flCouldnt} labelColor="#d9a93f" value={sel.couldnt} valueColor="#e3d2a6" />
              </div>
              <Box bg="#1d1b14" border="#34301f" label={t.flUncertain} labelColor="#d9a93f" value={sel.uncertain} valueColor="#e3d2a6" />
              <Box bg="#1f1417" border="#3a2329" label={t.flBounceBoundary} labelColor="#d98ba0" value={sel.bounce} valueColor="#e7bccb" />
              <Box bg="#141b27" border="#24344a" label={t.flNext} labelColor="#5b8def" value={sel.next} valueColor="#c7d8f3" />
              <div style={s.twoCol}>
                <div style={{ background: '#16191f', border: '1px solid #262a33', borderRadius: 9, padding: '13px 14px' }}>
                  <div style={s.fieldLabel}>{t.flUpdCtx}</div>
                  <span style={{ fontSize: 11, color: '#9cc0f5' }}>{sel.updCtx}</span>
                </div>
                <div style={{ background: '#16191f', border: '1px solid #262a33', borderRadius: 9, padding: '13px 14px' }}>
                  <div style={s.fieldLabel}>{t.flRefEv}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {sel.ev.map(e => <span key={e} style={{ fontSize: 10, color: '#9fb6c2', background: '#161e22', border: '1px solid #243339', padding: '2px 7px', borderRadius: 5 }}>{e}</span>)}
                  </div>
                </div>
              </div>
              <Box bg="#191620" border="#2c2540" label={t.flAsk} labelColor="#b6a6ee" value={sel.ask} valueColor="#d6cdf0" />
            </div>

            <div style={{ paddingTop: 14, borderTop: '1px solid #262a33', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button style={s.bounceBtn}>{t.btnReturnHuman}</button>
              <button style={s.reassignBtn}>{t.btnReassign}</button>
              <button onClick={onGoCtx} style={s.secondaryBtn}>{t.btnUpdCtx}</button>
              <button onClick={onGoRde} style={s.rdeBtn}>{t.sendToRde}</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Box({ bg, border, label, labelColor = '#6a7078', value, valueColor = '#dfe3e8' }: { bg: string; border: string; label: string; labelColor?: string; value: string; valueColor?: string }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 9, padding: '13px 14px' }}>
      <div style={{ fontSize: 10, color: labelColor, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 13, color: valueColor, lineHeight: 1.6 }}>{value}</div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '26px 28px 40px' },
  h1: { margin: 0, fontSize: 22, fontWeight: 700, color: '#e6e8ec' },
  sub: { margin: '6px 0 0', color: '#8b919c', fontSize: 13 },
  layout: { marginTop: 18, display: 'grid', gridTemplateColumns: '290px 1fr', gap: 18, alignItems: 'start' },
  list: { display: 'flex', flexDirection: 'column', gap: 9 },
  listItem: { textAlign: 'left', borderRadius: 10, padding: '13px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6 },
  detail: { border: '1px solid #262a33', background: '#1a1d24', borderRadius: 12, padding: 22, display: 'flex', flexDirection: 'column', gap: 13 },
  detailTitle: { margin: '3px 0 6px', fontSize: 17, fontWeight: 700, color: '#e6e8ec' },
  gateChip: { fontSize: 10.5, color: '#c9b27a', background: '#241f16', border: '1px solid #3a3220', padding: '5px 10px', borderRadius: 6, whiteSpace: 'nowrap' as const },
  stack: { display: 'flex', flexDirection: 'column', gap: 13 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 },
  fieldLabel: { fontSize: 10, color: '#6a7078', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 7 },
  bounceBtn: { border: '1px solid #3a2329', background: '#1f1417', color: '#e7bccb', padding: '7px 12px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit' },
  reassignBtn: { border: '1px solid #25382b', background: '#161d18', color: '#9fd9c0', padding: '7px 12px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit' },
  secondaryBtn: { border: '1px solid #2d323d', background: '#1b1e25', color: '#c8cdd5', padding: '7px 12px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit' },
  rdeBtn: { border: '1px solid #322c47', background: '#1d1a29', color: '#b6a6ee', padding: '7px 12px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit' },
};
