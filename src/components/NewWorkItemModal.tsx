import { DOMAIN_COLORS, AI_ACTORS } from '../types';
import type { Translations } from '../i18n';

interface FormState {
  title: string;
  domain: string;
  assignee: string;
}

interface NewWorkItemModalProps {
  form: FormState;
  t: Translations;
  onClose: () => void;
  onSetField: (k: keyof FormState, v: string) => void;
  onSubmit: () => void;
}

const ACTOR_OPTS = ['AI番頭', 'AI Assistant', 'Claude Code', 'Codex', 'tomyuk', 'Sayane', '専門家確認'];

export function NewWorkItemModal({ form, t, onClose, onSetField, onSubmit }: NewWorkItemModalProps) {
  return (
    <div style={s.overlay}>
      <div onClick={onClose} style={s.backdrop} />
      <div style={s.modal}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h2 style={s.title}>{t.modalTitle}</h2>
          <button onClick={onClose} style={s.closeBtn}>×</button>
        </div>
        <p style={s.desc}>{t.modalDesc}</p>

        <div style={{ marginBottom: 14 }}>
          <div style={s.label}>{t.fTitle}</div>
          <input
            value={form.title}
            onChange={e => onSetField('title', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSubmit()}
            placeholder={t.titlePh}
            style={s.input}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={s.label}>{t.fDomain}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Object.entries(DOMAIN_COLORS).map(([d, dc]) => {
              const active = form.domain === d;
              return (
                <button key={d} onClick={() => onSetField('domain', d)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  border: `1px solid ${active ? dc : '#262a33'}`,
                  background: active ? '#232a39' : '#16191f',
                  color: active ? '#e6e8ec' : '#9aa1ad',
                  padding: '6px 11px', borderRadius: 20, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: dc }} />
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={s.label}>{t.fAssignee}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {ACTOR_OPTS.map(a => {
              const active = form.assignee === a;
              const isAI = AI_ACTORS.includes(a);
              const dotColor = isAI ? '#3fb6a8' : '#5b8def';
              return (
                <button key={a} onClick={() => onSetField('assignee', a)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  border: `1px solid ${active ? '#3a4656' : '#262a33'}`,
                  background: active ? '#232a39' : '#16191f',
                  color: active ? '#e6e8ec' : '#9aa1ad',
                  padding: '6px 11px', borderRadius: 8, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor }} />
                  {a}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={s.cancelBtn}>{t.btnCancel}</button>
          <button onClick={onSubmit} style={s.submitBtn}>{t.btnAddInbox}</button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  backdrop: { position: 'absolute', inset: 0, background: 'rgba(8,9,12,0.6)' },
  modal: { position: 'relative', width: 480, maxWidth: '92vw', background: '#181b21', border: '1px solid #2d323d', borderRadius: 14, padding: 22, animation: 'drawerIn 0.18s ease' },
  title: { margin: 0, fontSize: 16, fontWeight: 700, color: '#e6e8ec' },
  closeBtn: { border: 'none', background: 'transparent', color: '#7e8590', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: 0 },
  desc: { margin: '0 0 16px', fontSize: 11.5, color: '#7e8590' },
  label: { fontSize: 10, color: '#6a7078', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 6 },
  input: { width: '100%', border: '1px solid #2d323d', background: '#16191f', color: '#e6e8ec', padding: '10px 12px', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none' },
  cancelBtn: { border: '1px solid #2d323d', background: '#1b1e25', color: '#c8cdd5', padding: '9px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },
  submitBtn: { border: 'none', background: '#3b6fd4', color: '#fff', padding: '9px 18px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 },
};
