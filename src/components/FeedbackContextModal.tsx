import { useState } from 'react';
import type { Lang } from '../types';

export interface FeedbackContextResult {
  source: string;
  participant: string;
  background: string;
  feedback: string;
  consent: boolean;
}

export function FeedbackContextModal({ lang, onClose, onSubmit }: { lang: Lang; onClose: () => void; onSubmit: (result: FeedbackContextResult) => void }) {
  const ja = lang === 'ja';
  const zh = lang === 'zh';
  const text = ja ? {
    title: 'フィードバックをContextとして記録', desc: '要望だけでなく、その人の背景・目的・制約を残します。', source: '取得元', participant: '試用者・組織（匿名可）', background: '利用背景・達成したいこと', feedback: '観察・困りごと・提案', consent: '製品改善のためKazane内に記録する同意を確認した', save: 'Context Cardを作成', cancel: 'キャンセル',
  } : zh ? {
    title: '将反馈记录为 Context', desc: '不仅记录需求，也保留背景、目的和约束。', source: '来源', participant: '试用者 / 组织（可匿名）', background: '使用背景和目标', feedback: '观察、困难或建议', consent: '已确认同意将内容记录在 Kazane 中用于产品改进', save: '创建 Context Card', cancel: '取消',
  } : {
    title: 'Capture feedback as Context', desc: 'Preserve the person’s background, goal, and constraints—not only a feature request.', source: 'Source', participant: 'Trial user / organization (may be anonymous)', background: 'Usage background and desired outcome', feedback: 'Observation, difficulty, or proposal', consent: 'Consent to record this in Kazane for product improvement was confirmed', save: 'Create Context Card', cancel: 'Cancel',
  };
  const [form, setForm] = useState<FeedbackContextResult>({ source: 'Interview', participant: '', background: '', feedback: '', consent: false });
  const valid = form.background.trim() && form.feedback.trim() && form.consent;
  return <div style={s.overlay} role="dialog" aria-modal="true" aria-label={text.title}>
    <div style={s.backdrop} onClick={onClose} />
    <div style={s.modal}>
      <div style={s.eyebrow}>FEEDBACK CONTEXT</div><h2 style={s.title}>{text.title}</h2><p style={s.desc}>{text.desc}</p>
      <label style={s.label}>{text.source}<select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} style={s.input}><option>Interview</option><option>Trial session</option><option>Email</option><option>Meeting</option><option>Support</option></select></label>
      <label style={s.label}>{text.participant}<input value={form.participant} onChange={e => setForm({ ...form, participant: e.target.value })} style={s.input} /></label>
      <label style={s.label}>{text.background}<textarea value={form.background} onChange={e => setForm({ ...form, background: e.target.value })} rows={3} style={s.textarea} /></label>
      <label style={s.label}>{text.feedback}<textarea value={form.feedback} onChange={e => setForm({ ...form, feedback: e.target.value })} rows={4} style={s.textarea} /></label>
      <label style={s.consent}><input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} />{text.consent}</label>
      <div style={s.footer}><button onClick={onClose} style={s.secondary}>{text.cancel}</button><button disabled={!valid} onClick={() => onSubmit(form)} style={{ ...s.primary, opacity: valid ? 1 : .45 }}>{text.save}</button></div>
    </div>
  </div>;
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, zIndex: 150, display: 'grid', placeItems: 'center' }, backdrop: { position: 'absolute', inset: 0, background: 'rgba(7,9,12,.76)', backdropFilter: 'blur(5px)' },
  modal: { position: 'relative', width: 600, maxWidth: '92vw', maxHeight: '88vh', overflowY: 'auto', background: '#1a1e22', border: '1px solid #314047', borderRadius: 16, padding: '30px 34px', boxShadow: '0 28px 80px rgba(0,0,0,.6)' },
  eyebrow: { color: '#4fb0c9', font: "500 10px 'JetBrains Mono',monospace", letterSpacing: '.15em' }, title: { color: '#eef1f3', fontSize: 22, margin: '7px 0' }, desc: { color: '#929ba1', fontSize: 12.5, lineHeight: 1.7, margin: '0 0 22px' },
  label: { color: '#aab2b7', fontSize: 11.5, display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 15 }, input: { background: '#11161a', border: '1px solid #303940', color: '#edf0f2', borderRadius: 8, padding: '10px 11px', font: '12.5px inherit' },
  textarea: { background: '#11161a', border: '1px solid #303940', color: '#edf0f2', borderRadius: 8, padding: '10px 11px', font: '12.5px inherit', lineHeight: 1.6, resize: 'vertical' }, consent: { display: 'flex', alignItems: 'flex-start', gap: 9, color: '#9eb5aa', fontSize: 11.5, lineHeight: 1.5 },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: 9, marginTop: 24 }, secondary: { border: '1px solid #303940', background: '#171b1e', color: '#929ba1', borderRadius: 8, padding: '9px 15px', cursor: 'pointer' }, primary: { border: 0, background: '#4fb0c9', color: '#101719', borderRadius: 8, padding: '9px 17px', fontWeight: 700, cursor: 'pointer' },
};
