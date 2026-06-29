import { useState } from 'react';
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
  onAddCtx: () => void;
}

export function ContextCards({ contexts, ctxSel, t, onSelectCtx, onPromoteUnresolved, onGoBoard, onGoRde, onAddCtx }: ContextCardsProps) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'general' | 'customer'>('all');

  const filtered = contexts.filter(c => {
    const matchQuery = !query.trim() ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.question.toLowerCase().includes(query.toLowerCase()) ||
      c.id.toLowerCase().includes(query.toLowerCase()) ||
      (c.customerCompany ?? '').toLowerCase().includes(query.toLowerCase());
    const matchType = typeFilter === 'all' || (c.cardType ?? 'general') === typeFilter;
    return matchQuery && matchType;
  });

  const sel = contexts.find(c => c.id === ctxSel) ?? contexts[0];
  const isCustomer = sel?.cardType === 'customer';

  return (
    <section style={s.page}>
      <h1 style={s.h1}>Context Cards</h1>
      <p style={s.sub}>{t.subCtx}</p>

      <div style={s.layout}>
        {/* Left list */}
        <div style={s.list}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="検索…"
            style={{ background: '#14161b', border: '1px solid #2d323d', borderRadius: 7, color: '#e6e8ec', fontSize: 11.5, padding: '6px 10px', fontFamily: 'inherit', outline: 'none', marginBottom: 4 }}
          />
          <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
            {(['all', 'general', 'customer'] as const).map(f => (
              <button key={f} onClick={() => setTypeFilter(f)} style={{
                padding: '3px 10px', borderRadius: 6, fontSize: 10.5, cursor: 'pointer', fontFamily: 'inherit',
                background: typeFilter === f ? '#1f2330' : '#14161b',
                border: `1px solid ${typeFilter === f ? '#3a4656' : '#262a33'}`,
                color: typeFilter === f ? '#9cc0f5' : '#6a7078',
              }}>
                {f === 'all' ? '全て' : f === 'general' ? '汎用' : '顧客'}
              </button>
            ))}
          </div>
          {filtered.map(c => {
            const active = c.id === ctxSel;
            const isCust = c.cardType === 'customer';
            return (
              <button key={c.id} onClick={() => onSelectCtx(c.id)} style={{
                ...s.listItem,
                border: `1px solid ${active ? '#3a4656' : '#262a33'}`,
                background: active ? '#1f2330' : '#1a1d24',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={s.mono}>{c.id}</span>
                  {isCust && <span style={s.custBadge}>顧客</span>}
                </div>
                <span style={s.listTitle}>{c.title}</span>
                {isCust && c.customerCompany && (
                  <span style={{ fontSize: 10.5, color: '#c5a8f0' }}>{c.customerCompany}</span>
                )}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={s.mono}>{sel.id}</span>
                  {isCustomer && <span style={s.custBadgeLg}>顧客 Context</span>}
                </div>
                <h2 style={s.detailTitle}>{sel.title}</h2>
                {isCustomer && sel.customerCompany && (
                  <div style={{ fontSize: 12, color: '#c5a8f0', marginTop: 2 }}>{sel.customerCompany}</div>
                )}
              </div>
              <button onClick={onGoRde} style={s.rdeBtn}>{t.sendToRde}</button>
            </div>

            {/* 顧客情報セクション */}
            {isCustomer && (
              <div style={s.custInfoBox}>
                <div style={s.custInfoHd}>顧客情報</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 18px' }}>
                  {sel.customerContact && <InfoRow label="担当者" value={sel.customerContact} />}
                  {sel.customerEmail && <InfoRow label="メール" value={sel.customerEmail} isEmail />}
                  {sel.customerPhone && <InfoRow label="電話" value={sel.customerPhone} />}
                  {sel.customerRelationship && <InfoRow label="関係性" value={sel.customerRelationship} />}
                  {!sel.customerContact && !sel.customerEmail && !sel.customerPhone && !sel.customerRelationship && (
                    <span style={{ gridColumn: '1/-1', fontSize: 11, color: '#5a6070' }}>顧客詳細未登録</span>
                  )}
                </div>
              </div>
            )}

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
                  <button key={u} onClick={() => onPromoteUnresolved(u, isCustomer ? '顧客対応' : '調査', sel.id)} style={s.unresolvedChip}>
                    {u} <span style={{ color: '#7e6e44' }}>＋WI</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={s.footer}>
              <div style={s.nextPolicy}><span style={{ color: '#6a7078' }}>{t.nextPolicy}</span> {sel.nextPolicy}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={onGoBoard} style={s.secondaryBtn}>{t.btnConnectWI}</button>
                <button onClick={onAddCtx} style={s.primaryBtn}>{t.btnCreateCtx}</button>
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

function InfoRow({ label, value, isEmail }: { label: string; value: string; isEmail?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 9.5, color: '#6a7078', fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>{label}</div>
      {isEmail ? (
        <a href={`mailto:${value}`} style={{ fontSize: 12, color: '#9cc0f5', textDecoration: 'none' }}>{value}</a>
      ) : (
        <div style={{ fontSize: 12, color: '#dfe3e8' }}>{value}</div>
      )}
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
  custBadge: { fontSize: 9, color: '#c5a8f0', background: '#221830', border: '1px solid #4a2d6a', padding: '1px 6px', borderRadius: 4 },
  custBadgeLg: { fontSize: 10.5, color: '#c5a8f0', background: '#221830', border: '1px solid #4a2d6a', padding: '2px 8px', borderRadius: 5 },
  custInfoBox: { background: '#1e1826', border: '1px solid #3a2850', borderRadius: 9, padding: '12px 14px' },
  custInfoHd: { fontSize: 10, color: '#c5a8f0', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 9 },
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
