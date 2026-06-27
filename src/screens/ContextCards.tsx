import type { ContextCard } from '../types';
import type { Translations } from '../i18n';

interface ContextCardsProps {
  contexts: ContextCard[];
  ctxSel: string;
  t: Translations;
  onSelectCtx: (id: string) => void;
  onPromoteUnresolved: (text: string, domain: string, contextId: string) => void;
  onGoBoard: () => void;
  onGoRde: () => void;
}

export function ContextCards({ contexts, ctxSel, t, onSelectCtx, onPromoteUnresolved, onGoBoard, onGoRde }: ContextCardsProps) {
  const sel = contexts.find(c => c.id === ctxSel) ?? contexts[0];

  return (
    <section style={s.page}>
      <h1 style={s.h1}>Context Cards</h1>
      <p style={s.sub}>{t.subCtx}</p>

      <div style={s.layout}>
        {/* Left list */}
        <div style={s.list}>
          {contexts.map(c => {
            const active = c.id === ctxSel;
            return (
              <button key={c.id} onClick={() => onSelectCtx(c.id)} style={{
                ...s.listItem,
                border: `1px solid ${active ? '#3a4656' : '#262a33'}`,
                background: active ? '#1f2330' : '#1a1d24',
              }}>
                <span style={s.mono}>{c.id}</span>
                <span style={s.listTitle}>{c.title}</span>
                <span style={s.listQ}>{c.question}</span>
                <span style={s.unresolvedBadge}>{t.unresolvedShort} {c.unresolved.length}</span>
              </button>
            );
          })}
        </div>

        {/* Right detail */}
        {sel && (
          <div style={s.detail}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <span style={s.mono}>{sel.id}</span>
                <h2 style={s.detailTitle}>{sel.title}</h2>
              </div>
              <button onClick={onGoRde} style={s.rdeBtn}>{t.sendToRde}</button>
            </div>

            <div style={s.fieldGrid}>
              <FieldBox label={t.flQuestion} value={sel.question} />
              <FieldBox label={t.flPurpose} value={sel.purpose} />
              <FieldBox label={t.flContext} value={sel.context} />
              <FieldBox label={t.flConstraint} value={sel.constraint} valueColor="#e0c98f" />
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldBox label={t.flPast} value={sel.past} />
              </div>
            </div>

            <div style={s.relGrid}>
              <div style={s.relBox}>
                <div style={s.relLabel}>{t.relatedWI}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {sel.relatedWI.map(w => <span key={w} style={s.wiChip}>{w}</span>)}
                </div>
              </div>
              <div style={s.relBox}>
                <div style={s.relLabel}>{t.relatedEv}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {sel.relatedEv.map(e => <span key={e} style={s.evChip}>{e}</span>)}
                </div>
              </div>
            </div>

            <div style={s.unresolvedBox}>
              <div style={s.unresolvedHd}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d9a93f' }} />
                {t.unresolvedHd}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {sel.unresolved.map(u => (
                  <button key={u} onClick={() => onPromoteUnresolved(u, '調査', sel.id)} style={s.unresolvedChip}>
                    {u} <span style={{ color: '#7e6e44' }}>＋WI</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={s.footer}>
              <div style={s.nextPolicy}><span style={{ color: '#6a7078' }}>{t.nextPolicy}</span> {sel.nextPolicy}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={onGoBoard} style={s.secondaryBtn}>{t.btnConnectWI}</button>
                <button style={s.primaryBtn}>{t.btnCreateCtx}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FieldBox({ label, value, valueColor = '#dfe3e8' }: { label: string; value: string; valueColor?: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: '#6a7078', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 13, color: valueColor, lineHeight: 1.6 }}>{value}</div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '26px 28px 40px' },
  h1: { margin: 0, fontSize: 22, fontWeight: 700, color: '#e6e8ec' },
  sub: { margin: '6px 0 0', color: '#8b919c', fontSize: 13 },
  layout: { marginTop: 18, display: 'grid', gridTemplateColumns: '300px 1fr', gap: 18, alignItems: 'start' },
  list: { display: 'flex', flexDirection: 'column', gap: 9 },
  listItem: { textAlign: 'left', borderRadius: 10, padding: '13px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6 },
  listTitle: { fontSize: 13.5, fontWeight: 600, color: '#e6e8ec' },
  listQ: { fontSize: 10.5, color: '#8b919c', lineHeight: 1.5 },
  mono: { fontSize: 10, color: '#7e8590', fontFamily: "'JetBrains Mono', monospace" },
  unresolvedBadge: { fontSize: 10, color: '#a07fe0' },
  detail: { border: '1px solid #262a33', background: '#1a1d24', borderRadius: 12, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 },
  detailTitle: { margin: '3px 0 0', fontSize: 18, fontWeight: 700, color: '#e6e8ec' },
  rdeBtn: { border: '1px solid #322c47', background: '#1d1a29', color: '#b6a6ee', padding: '7px 12px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' },
  fieldGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 22px' },
  relGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  relBox: { background: '#16191f', border: '1px solid #262a33', borderRadius: 9, padding: 13 },
  relLabel: { fontSize: 11, color: '#9aa1ad', marginBottom: 8 },
  wiChip: { fontSize: 10.5, color: '#9cc0f5', background: '#161d2b', border: '1px solid #243349', padding: '3px 8px', borderRadius: 5, fontFamily: "'JetBrains Mono', monospace" },
  evChip: { fontSize: 10.5, color: '#9fb6c2', background: '#161e22', border: '1px solid #243339', padding: '3px 8px', borderRadius: 5 },
  unresolvedBox: { background: '#1d1b14', border: '1px solid #34301f', borderRadius: 9, padding: 13 },
  unresolvedHd: { fontSize: 11, color: '#d9a93f', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 7 },
  unresolvedChip: { fontSize: 11, color: '#e0c98f', background: '#241f16', border: '1px solid #3a3220', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' },
  footer: { paddingTop: 14, borderTop: '1px solid #262a33', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  nextPolicy: { fontSize: 11, color: '#8b919c' },
  secondaryBtn: { border: '1px solid #2d323d', background: '#1b1e25', color: '#c8cdd5', padding: '7px 12px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit' },
  primaryBtn: { border: 'none', background: '#3b6fd4', color: '#fff', padding: '7px 13px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit' },
};
