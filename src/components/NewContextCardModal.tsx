import { useState } from 'react';
import type { Translations } from '../i18n';
import type { CardType } from '../types';

interface NewContextCardModalProps {
  t: Translations;
  onClose: () => void;
  onSubmit: (title: string, question: string, cardType: CardType, customerCompany: string) => void;
}

export function NewContextCardModal({ t, onClose, onSubmit }: NewContextCardModalProps) {
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [cardType, setCardType] = useState<CardType>('general');
  const [company, setCompany] = useState('');

  function submit() {
    if (!title.trim()) return;
    onSubmit(title.trim(), question.trim() || '（未記入）', cardType, company.trim());
  }

  return (
    <div style={s.overlay}>
      <div onClick={onClose} style={s.backdrop} />
      <div style={s.modal}>
        <div style={s.header}>
          <h2 style={s.title}>{t.newCtxModalTitle}</h2>
          <button onClick={onClose} style={s.closeBtn}>×</button>
        </div>

        <div style={s.body}>
          <label style={s.label}>カードタイプ</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {(['general', 'customer'] as CardType[]).map(ct => (
              <button
                key={ct}
                onClick={() => setCardType(ct)}
                style={{
                  ...s.typeBtn,
                  background: cardType === ct ? '#1d2230' : '#14161b',
                  border: `1px solid ${cardType === ct ? (ct === 'customer' ? '#7e5fb8' : '#3a4656') : '#2d323d'}`,
                  color: cardType === ct ? (ct === 'customer' ? '#c5a8f0' : '#9cc0f5') : '#7e8590',
                }}
              >
                {ct === 'general' ? '汎用' : '顧客'}
              </button>
            ))}
          </div>

          {cardType === 'customer' && (
            <>
              <label style={s.label}>会社名 / 顧客名</label>
              <input
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="株式会社〇〇"
                style={{ ...s.input, marginBottom: 14 }}
              />
            </>
          )}

          <label style={s.label}>{t.fCtxTitle}</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={t.ctxTitlePh}
            style={s.input}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && submit()}
          />

          <label style={{ ...s.label, marginTop: 14 }}>{t.fCtxQuestion}</label>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder={t.ctxQuestionPh}
            style={s.textarea}
            rows={3}
          />
        </div>

        <div style={s.footer}>
          <button onClick={onClose} style={s.cancelBtn}>{t.btnCancel}</button>
          <button onClick={submit} disabled={!title.trim()} style={{ ...s.addBtn, opacity: title.trim() ? 1 : 0.5 }}>{t.btnAddCtx}</button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  backdrop: { position: 'absolute', inset: 0, background: 'rgba(8,9,12,0.65)' },
  modal: { position: 'relative', background: '#1a1d24', border: '1px solid #2d323d', borderRadius: 14, width: 460, maxWidth: '92vw', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', animation: 'fadeIn 0.15s ease' },
  header: { padding: '20px 22px 14px', borderBottom: '1px solid #262a33', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { margin: 0, fontSize: 16, fontWeight: 700, color: '#e6e8ec' },
  closeBtn: { border: 'none', background: 'transparent', color: '#7e8590', fontSize: 20, cursor: 'pointer' },
  body: { padding: '18px 22px', display: 'flex', flexDirection: 'column' },
  label: { fontSize: 11, color: '#7e8590', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginBottom: 7 },
  typeBtn: { padding: '6px 16px', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 },
  input: { background: '#14161b', border: '1px solid #2d323d', borderRadius: 8, color: '#e6e8ec', fontSize: 13.5, padding: '9px 12px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const, width: '100%' },
  textarea: { background: '#14161b', border: '1px solid #2d323d', borderRadius: 8, color: '#e6e8ec', fontSize: 13, padding: '9px 12px', fontFamily: 'inherit', outline: 'none', resize: 'vertical' as const, boxSizing: 'border-box' as const, width: '100%' },
  footer: { padding: '14px 22px 20px', borderTop: '1px solid #262a33', display: 'flex', gap: 9, justifyContent: 'flex-end' },
  cancelBtn: { border: '1px solid #2d323d', background: '#1b1e25', color: '#9aa1ad', padding: '8px 16px', borderRadius: 8, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit' },
  addBtn: { border: 'none', background: '#9b8cf0', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 },
};
