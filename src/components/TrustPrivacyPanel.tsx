import type { Lang } from '../types';

export function TrustPrivacyPanel({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const title = lang === 'ja' ? 'Kazaneの信頼とプライバシー' : lang === 'zh' ? 'Kazane 的信任与隐私' : 'Trust & Privacy in Kazane';
  const items = lang === 'ja' ? [
    ['データはこの端末に保存', 'Work Item、Context、Handoff、EvidenceはローカルSQLiteに保存されます。'],
    ['AIは責任を引き受けない', 'AIは整理・草案・調査を行いますが、送信・契約・金銭・専門判断では停止します。'],
    ['停止は正常な動作', 'Gateで止まることは失敗ではなく、人に判断を返した記録です。'],
    ['操作には担当IDと証跡', '外部Agentの書き込みはkazaned/privdを通り、許可・拒否が監査記録に残ります。'],
    ['非公開推論は保存しない', '表示・Replayするのは記録されたContext、Event、Handoff、Evidenceだけです。'],
  ] : lang === 'zh' ? [
    ['数据保存在本机', '工作、上下文、交接和证据保存在本地 SQLite。'], ['AI 不承担责任', 'AI 可整理和起草，但在发送、合同、付款及专业判断前停止。'], ['停止是正常流程', 'Gate 停止表示将判断交还给人，并非失败。'], ['操作有身份和审计', '外部 Agent 写入经过控制与权限进程，并记录允许或拒绝。'], ['不保存私有推理', 'Replay 只显示已记录的 Context、Event、Handoff 和 Evidence。'],
  ] : [
    ['Data stays on this device', 'Work, Context, Handoffs, and Evidence are stored in local SQLite.'], ['AI does not own responsibility', 'AI may organize and draft, but stops before sending, contracts, money, or expert judgment.'], ['Stopping is normal', 'A Gate stop returns judgment to a human and is not a failure.'], ['Writes have identity and audit', 'External Agent writes pass through control and privilege processes with allow/deny records.'], ['Private reasoning is not stored', 'Replay shows only recorded Context, Events, Handoffs, and Evidence.'],
  ];
  return <div style={s.overlay} role="dialog" aria-modal="true" aria-label={title}><div style={s.backdrop} onClick={onClose} /><div style={s.panel}><button onClick={onClose} style={s.close}>×</button><div style={s.eyebrow}>TRUST BOUNDARY</div><h2 style={s.title}>{title}</h2><div style={s.list}>{items.map(([head, body], i) => <div key={head} style={s.item}><span style={s.num}>0{i + 1}</span><div><div style={s.head}>{head}</div><div style={s.body}>{body}</div></div></div>)}</div></div></div>;
}
const s: Record<string, React.CSSProperties> = { overlay: { position: 'fixed', inset: 0, zIndex: 150 }, backdrop: { position: 'absolute', inset: 0, background: 'rgba(7,8,10,.7)', backdropFilter: 'blur(5px)' }, panel: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 480, maxWidth: '92vw', background: 'linear-gradient(165deg,#19201d,#15181e)', borderLeft: '1px solid #33423b', padding: '38px 34px', boxShadow: '-24px 0 70px rgba(0,0,0,.45)' }, close: { position: 'absolute', right: 20, top: 18, border: 0, background: 'transparent', color: '#7d8781', fontSize: 22, cursor: 'pointer' }, eyebrow: { color: '#5fb89f', font: "500 10px 'JetBrains Mono',monospace", letterSpacing: '.15em' }, title: { color: '#eef1ef', fontSize: 23, margin: '8px 0 26px' }, list: { display: 'flex', flexDirection: 'column', gap: 12 }, item: { display: 'grid', gridTemplateColumns: '34px 1fr', gap: 10, padding: '15px 0', borderBottom: '1px solid #29312d' }, num: { color: '#4d6c60', font: "10px 'JetBrains Mono',monospace" }, head: { color: '#dce3df', fontSize: 13.5, fontWeight: 600, marginBottom: 5 }, body: { color: '#8f9b94', fontSize: 11.5, lineHeight: 1.7 } };
