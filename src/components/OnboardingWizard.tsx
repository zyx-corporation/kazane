import { useState } from 'react';
import type { Lang } from '../types';

export interface OnboardingResult {
  organization: string;
  project: string;
  domain: string;
  challenge: string;
  boundary: string;
}

interface Props {
  lang: Lang;
  onClose: () => void;
  onComplete: (result: OnboardingResult) => void;
}

const DOMAINS = ['顧客対応', '営業', '執筆', '経理', '開発', 'AI番頭'];

const COPY = {
  ja: {
    eyebrow: 'START GUIDE', title: '最初の仕事の流れを整える',
    desc: 'デモデータは追加しません。回答から、あなたのContext Cardと最初のWork Itemだけを作成します。',
    org: '組織・チーム名', project: '案件・テーマ名', orgPh: '例：ZYX', projectPh: '例：顧客対応の見直し',
    domain: '最初に整えたい業務', challenge: 'いま何が滞っていますか', challengePh: '例：問い合わせの背景確認に時間がかかる',
    boundary: 'AIが止まり、人が判断すべき条件', boundaryPh: '例：送信、価格提示、契約条件は人が判断する',
    back: '戻る', next: '次へ', create: 'Contextと最初の仕事を作成', close: '閉じる',
  },
  en: {
    eyebrow: 'START GUIDE', title: 'Shape your first work flow',
    desc: 'No demo data is added. Your answers create only one Context Card and your first Work Item.',
    org: 'Organization / team', project: 'Project / theme', orgPh: 'e.g. ZYX', projectPh: 'e.g. Customer response review',
    domain: 'First workflow to improve', challenge: 'What is currently stuck?', challengePh: 'e.g. Understanding inquiry context takes too long',
    boundary: 'Where AI must stop for human judgment', boundaryPh: 'e.g. A human approves sending, pricing, and contract terms',
    back: 'Back', next: 'Next', create: 'Create Context and first work', close: 'Close',
  },
  zh: {
    eyebrow: 'START GUIDE', title: '整理第一个工作流程',
    desc: '不会添加演示数据。根据回答，只创建一个 Context Card 和第一个 Work Item。',
    org: '组织 / 团队', project: '项目 / 主题', orgPh: '例：ZYX', projectPh: '例：客户响应改善',
    domain: '首先要改善的业务', challenge: '目前哪里停滞？', challengePh: '例：确认咨询背景耗时过长',
    boundary: 'AI 必须停止并交由人判断的条件', boundaryPh: '例：发送、报价和合同条款由人判断',
    back: '返回', next: '下一步', create: '创建 Context 和第一个工作', close: '关闭',
  },
};

export function OnboardingWizard({ lang, onClose, onComplete }: Props) {
  const c = COPY[lang];
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingResult>({ organization: '', project: '', domain: '顧客対応', challenge: '', boundary: '' });
  const canNext = step === 0 ? Boolean(form.organization.trim() && form.project.trim()) : step === 1 ? Boolean(form.challenge.trim()) : Boolean(form.boundary.trim());

  return (
    <div style={s.overlay} role="dialog" aria-modal="true" aria-label={c.title}>
      <div style={s.backdrop} onClick={onClose} />
      <div style={s.modal}>
        <div style={s.progress}>{[0, 1, 2].map(n => <span key={n} style={{ ...s.progressBar, background: n <= step ? '#5fb89f' : '#2a3038' }} />)}</div>
        <button style={s.close} onClick={onClose} aria-label={c.close}>×</button>
        <div style={s.eyebrow}>{c.eyebrow} · {step + 1}/3</div>
        <h2 style={s.title}>{c.title}</h2>
        <p style={s.desc}>{c.desc}</p>

        <div style={s.body}>
          {step === 0 && <>
            <Field label={c.org}><input autoFocus value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} placeholder={c.orgPh} style={s.input} /></Field>
            <Field label={c.project}><input value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} placeholder={c.projectPh} style={s.input} /></Field>
          </>}
          {step === 1 && <>
            <Field label={c.domain}><div style={s.chips}>{DOMAINS.map(domain => <button key={domain} onClick={() => setForm({ ...form, domain })} style={{ ...s.chip, ...(form.domain === domain ? s.chipActive : {}) }}>{domain}</button>)}</div></Field>
            <Field label={c.challenge}><textarea autoFocus value={form.challenge} onChange={e => setForm({ ...form, challenge: e.target.value })} placeholder={c.challengePh} rows={3} style={s.textarea} /></Field>
          </>}
          {step === 2 && <Field label={c.boundary}><textarea autoFocus value={form.boundary} onChange={e => setForm({ ...form, boundary: e.target.value })} placeholder={c.boundaryPh} rows={4} style={s.textarea} /></Field>}
        </div>

        <div style={s.footer}>
          <button onClick={() => step === 0 ? onClose() : setStep(step - 1)} style={s.secondary}>{step === 0 ? c.close : c.back}</button>
          <button disabled={!canNext} onClick={() => step < 2 ? setStep(step + 1) : onComplete(form)} style={{ ...s.primary, opacity: canNext ? 1 : 0.45 }}>{step < 2 ? c.next : c.create}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={s.field}><span style={s.label}>{label}</span>{children}</label>;
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, zIndex: 140, display: 'grid', placeItems: 'center' },
  backdrop: { position: 'absolute', inset: 0, background: 'rgba(8,10,12,.78)', backdropFilter: 'blur(6px)' },
  modal: { position: 'relative', width: 620, maxWidth: '92vw', minHeight: 500, padding: '34px 40px 30px', background: 'linear-gradient(145deg,#1b211f,#171a20 58%,#1b1820)', border: '1px solid #34403c', borderRadius: 18, boxShadow: '0 32px 90px rgba(0,0,0,.62)', animation: 'fadeIn .18s ease' },
  progress: { display: 'flex', gap: 6, marginBottom: 30 }, progressBar: { height: 3, flex: 1, borderRadius: 3 },
  close: { position: 'absolute', right: 20, top: 20, border: 0, background: 'transparent', color: '#758079', fontSize: 22, cursor: 'pointer' },
  eyebrow: { color: '#5fb89f', font: "500 10px 'JetBrains Mono',monospace", letterSpacing: '.16em' },
  title: { color: '#edf0ec', fontSize: 25, margin: '8px 0 9px', letterSpacing: '.01em' },
  desc: { color: '#939b96', fontSize: 12.5, lineHeight: 1.7, maxWidth: 500, margin: 0 },
  body: { marginTop: 28, display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 }, label: { color: '#aeb5b0', fontSize: 11.5, fontWeight: 500 },
  input: { width: '100%', boxSizing: 'border-box', background: '#111512', border: '1px solid #303a35', borderRadius: 9, color: '#edf0ec', padding: '12px 13px', font: '13px inherit', outline: 'none' },
  textarea: { width: '100%', boxSizing: 'border-box', resize: 'vertical', background: '#111512', border: '1px solid #303a35', borderRadius: 9, color: '#edf0ec', padding: '12px 13px', font: '13px inherit', lineHeight: 1.65, outline: 'none' },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 7 }, chip: { border: '1px solid #30363a', background: '#15191a', color: '#80888a', borderRadius: 20, padding: '7px 12px', cursor: 'pointer', font: '11.5px inherit' },
  chipActive: { borderColor: '#477f6d', background: '#182823', color: '#83d4b6' },
  footer: { position: 'absolute', left: 40, right: 40, bottom: 30, display: 'flex', justifyContent: 'space-between' },
  secondary: { border: '1px solid #30363a', background: '#171b1c', color: '#8f9892', borderRadius: 9, padding: '10px 17px', cursor: 'pointer', font: '12px inherit' },
  primary: { border: 0, background: '#5fb89f', color: '#0f1713', borderRadius: 9, padding: '10px 19px', cursor: 'pointer', font: '700 12px inherit' },
};
