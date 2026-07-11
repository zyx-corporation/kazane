import type { Screen, Lang } from '../types';
import type { Translations } from '../i18n';

interface NavItem {
  key: Screen;
  label: string;
  dot: string;
}

const NAV: NavItem[] = [
  { key: 'dashboard', label: 'Flow Dashboard', dot: '#5b8def' },
  { key: 'board', label: 'Work Board', dot: '#3fb6a8' },
  { key: 'context', label: 'Context Cards', dot: '#9b8cf0' },
  { key: 'handoff', label: 'Handoff Notes', dot: '#5fb89f' },
  { key: 'gate', label: 'Escalation Gate', dot: '#d9a93f' },
  { key: 'rde', label: 'RDE / Evidence Audit', dot: '#b6a6ee' },
];

interface SidebarProps {
  current: Screen;
  lang: Lang;
  t: Translations;
  onNav: (s: Screen) => void;
  onOnboarding: () => void;
}

export function Sidebar({ current, t, onNav, onOnboarding }: SidebarProps) {
  return (
    <aside style={s.sidebar}>
      <div style={s.brand}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="3.5" fill="#5b8def" />
            <circle cx="15" cy="15" r="8" stroke="#5b8def" strokeOpacity="0.55" strokeWidth="1.4" />
            <circle cx="15" cy="15" r="13" stroke="#5b8def" strokeOpacity="0.25" strokeWidth="1.2" />
          </svg>
          <div>
            <div style={s.brandName}>風音 <span style={s.brandSub}>Kazane</span></div>
            <div style={s.brandTag}>Chronicle Work OS</div>
          </div>
        </div>
        <div style={s.tagline}>{t.tagline1}<br />{t.tagline2}</div>
      </div>

      <nav style={s.nav}>
        {NAV.map(n => {
          const active = current === n.key;
          return (
            <button key={n.key} onClick={() => onNav(n.key)} style={{
              ...s.navBtn,
              background: active ? '#232a39' : 'transparent',
              color: active ? '#e6e8ec' : '#9aa1ad',
            }}>
              <span style={{ ...s.navBar, background: active ? n.dot : 'transparent' }} />
              <span style={{ ...s.navDot, background: n.dot, opacity: active ? 1 : 0.5 }} />
              {n.label}
            </button>
          );
        })}
      </nav>

      <div style={s.divider} />
      <nav style={s.nav}>
        {['Start Guide', 'Integrations'].map(label => (
          <button key={label} onClick={label === 'Start Guide' ? onOnboarding : undefined} style={{ ...s.navBtn, color: label === 'Start Guide' ? '#79bca4' : '#7e8590', fontSize: 12 }}>
            <span style={{ ...s.navBar, background: 'transparent' }} />
            <span style={{ width: 7, height: 7, borderRadius: 2, background: '#3a3f4a', flexShrink: 0 }} />
            {label}
          </button>
        ))}
      </nav>

      <div style={{ flex: 1 }} />
      <div style={s.desc}>{t.sidebarDesc}</div>
    </aside>
  );
}

const s: Record<string, React.CSSProperties> = {
  sidebar: { width: 250, flexShrink: 0, background: '#16191f', borderRight: '1px solid #262a33', display: 'flex', flexDirection: 'column', height: '100vh' },
  brand: { padding: '20px 18px 16px' },
  brandName: { fontSize: 16, fontWeight: 700, letterSpacing: '0.04em', lineHeight: 1.1, color: '#e6e8ec' },
  brandSub: { fontSize: 12, color: '#9aa1ad', fontWeight: 500 },
  brandTag: { fontSize: 10, color: '#6a7078', letterSpacing: '0.14em', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginTop: 2 },
  tagline: { marginTop: 13, fontSize: 11, color: '#7e8590', lineHeight: 1.6 },
  nav: { display: 'flex', flexDirection: 'column', gap: 3, padding: '6px 12px' },
  navBtn: { display: 'flex', alignItems: 'center', gap: 11, width: '100%', textAlign: 'left', border: 'none', padding: '9px 12px 9px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', position: 'relative', transition: 'background 0.15s' },
  navBar: { position: 'absolute', left: 0, width: 3, height: 16, borderRadius: 2 },
  navDot: { width: 7, height: 7, borderRadius: 2, flexShrink: 0 },
  divider: { margin: '8px 12px', height: 1, background: '#262a33' },
  desc: { margin: '14px 14px 16px', padding: 12, background: '#13161c', border: '1px solid #232730', borderRadius: 9, fontSize: 10.5, color: '#7e8590', lineHeight: 1.65 },
};
