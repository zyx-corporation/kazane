import type { RdeEvidence } from '../types';
import { trustColor } from '../types';
import type { Translations } from '../i18n';

interface RdeEvidenceAuditProps {
  rdeEvidence: RdeEvidence[];
  t: Translations;
  onPromoteRde: () => void;
  onGoCtx: () => void;
}

export function RdeEvidenceAudit({ rdeEvidence, t, onPromoteRde, onGoCtx }: RdeEvidenceAuditProps) {
  const rdeRows = [
    { label: t.rdeKept, value: 'AIと人間の協働、Handoff、Gate、Evidence、RDEの基本構造は維持。', bg: '#161d18', border: '#25382b', labelColor: '#5fb89f', valueColor: '#cfe0d6' },
    { label: t.rdeTransformed, value: '開発運用OSから、業務フロー全般の知的協働OSへ拡張。', bg: '#141b27', border: '#24344a', labelColor: '#5b8def', valueColor: '#c7d8f3' },
    { label: t.rdeAdded, value: '営業・顧客対応・経理・執筆・会議・診断士連携・AI番頭運用を追加。', bg: '#161d1f', border: '#24383b', labelColor: '#3fb6a8', valueColor: '#bfdcd9' },
    { label: t.rdeUnresolved, value: '業務領域別テンプレート、権限設計、証跡保存期間、導入粒度。', bg: '#1d1b14', border: '#34301f', labelColor: '#d9a93f', valueColor: '#e3d2a6' },
    { label: t.rdeDeviation, value: '対象を広げすぎてMVPが膨らむリスク。', bg: '#1f1417', border: '#3a2329', labelColor: '#d98ba0', valueColor: '#e7bccb' },
    { label: t.rdeNextPolicy, value: '定義は広く、実装は狭く。ZYX社内業務でdogfoodingする。', bg: '#191620', border: '#2c2540', labelColor: '#b6a6ee', valueColor: '#d6cdf0' },
  ];

  return (
    <section style={s.page}>
      <h1 style={s.h1}>RDE / Evidence Audit</h1>
      <p style={s.sub}>{t.subRdeScr}</p>

      <div style={s.layout}>
        {/* RDE panel */}
        <div style={s.rdePanel}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#b6a6ee' }} />
              <h2 style={s.rdeTitle}>RDE Audit — Kazane定義修正</h2>
            </div>
            <span style={s.mono}>RDE-014 · CTX-002</span>
          </div>

          <div style={s.rdeRows}>
            {rdeRows.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 14, alignItems: 'start', padding: '12px 14px', background: row.bg, border: `1px solid ${row.border}`, borderRadius: 9 }}>
                <div style={{ fontSize: 11.5, color: row.labelColor, fontWeight: 600 }}>{row.label}</div>
                <div style={{ fontSize: 13, color: row.valueColor, lineHeight: 1.6 }}>{row.value}</div>
              </div>
            ))}
          </div>

          <div style={{ paddingTop: 14, borderTop: '1px solid #2c2540', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button style={s.primaryBtn}>{t.btnRunRdeAudit}</button>
            <button onClick={onPromoteRde} style={s.warnBtn}>{t.btnPromoteUnresolved}</button>
            <button onClick={onGoCtx} style={s.secondaryBtn}>{t.btnUpdCtxCard}</button>
            <button style={s.secondaryBtn}>{t.btnExportReport}</button>
          </div>
        </div>

        {/* Evidence log */}
        <div style={s.evPanel}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#d3d8df' }}>Evidence Log</div>
            <button style={s.addEvBtn}>{t.btnAddEv}</button>
          </div>
          <div style={{ fontSize: 10, color: '#6a7078', marginBottom: 9 }}>{t.evidenceSub}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rdeEvidence.map((e, i) => (
              <div key={i} style={s.evRow}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={s.evType}>{e.type}</span>
                  <span style={{ fontSize: 9.5, color: trustColor(e.trust) }}>{t.trust} {e.trust}</span>
                </div>
                <div style={{ fontSize: 12, color: '#dfe3e8', marginTop: 7 }}>{e.label}</div>
                <div style={{ fontSize: 10, color: '#6a7078', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{e.store}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '26px 28px 40px' },
  h1: { margin: 0, fontSize: 22, fontWeight: 700, color: '#e6e8ec' },
  sub: { margin: '6px 0 0', color: '#8b919c', fontSize: 13 },
  layout: { marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18, alignItems: 'start' },
  rdePanel: { border: '1px solid #2c2540', background: '#181620', borderRadius: 12, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 },
  rdeTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: '#e6e8ec' },
  mono: { fontSize: 10, color: '#7e8590', fontFamily: "'JetBrains Mono', monospace" },
  rdeRows: { display: 'flex', flexDirection: 'column', gap: 11 },
  evPanel: { border: '1px solid #262a33', background: '#1a1d24', borderRadius: 12, padding: 18 },
  evRow: { border: '1px solid #262a33', background: '#16191f', borderRadius: 9, padding: '11px 12px' },
  evType: { fontSize: 9.5, color: '#9fb6c2', background: '#161e22', border: '1px solid #243339', padding: '2px 7px', borderRadius: 5 },
  addEvBtn: { border: '1px solid #2d323d', background: '#1b1e25', color: '#9aa1ad', padding: '5px 10px', borderRadius: 6, fontSize: 10.5, cursor: 'pointer', fontFamily: 'inherit' },
  primaryBtn: { border: 'none', background: '#5848a0', color: '#fff', padding: '7px 13px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit' },
  warnBtn: { border: '1px solid #34301f', background: '#1d1b14', color: '#e0c98f', padding: '7px 12px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit' },
  secondaryBtn: { border: '1px solid #2d323d', background: '#1b1e25', color: '#c8cdd5', padding: '7px 12px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit' },
};
