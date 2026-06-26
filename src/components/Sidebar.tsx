import type { Screen } from "../App";

interface SidebarProps {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems: { id: Screen; label: string; ja: string; icon: string }[] = [
  { id: "flow", label: "Flow Dashboard", ja: "フロー", icon: "◎" },
  { id: "work", label: "Work Board", ja: "作業ボード", icon: "▤" },
  { id: "context", label: "Context Cards", ja: "コンテキスト", icon: "⬡" },
  { id: "agents", label: "Agent Org", ja: "エージェント", icon: "⬡" },
  { id: "handoff", label: "Handoff & Evidence", ja: "引継ぎ・証拠", icon: "↗" },
  { id: "health", label: "Ops Health", ja: "運用状態", icon: "♥" },
];

export function Sidebar({ current, onNavigate }: SidebarProps) {
  return (
    <aside style={styles.aside}>
      <div style={styles.brand}>
        <span style={styles.brandKanji}>風音</span>
        <span style={styles.brandLatin}>Kazane</span>
        <span style={styles.brandSub}>Chronicle Work OS</span>
      </div>
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.id}
            style={{
              ...styles.navItem,
              ...(current === item.id ? styles.navItemActive : {}),
            }}
            onClick={() => onNavigate(item.id)}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span style={styles.navText}>
              <span style={styles.navLabel}>{item.label}</span>
              <span style={styles.navJa}>{item.ja}</span>
            </span>
          </button>
        ))}
      </nav>
      <div style={styles.version}>v0.0 kiri / 霧</div>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  aside: {
    width: 220,
    minHeight: "100vh",
    background: "#0f1117",
    borderRight: "1px solid #1e2130",
    display: "flex",
    flexDirection: "column",
    padding: "0",
    flexShrink: 0,
  },
  brand: {
    padding: "24px 20px 20px",
    borderBottom: "1px solid #1e2130",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  brandKanji: {
    fontSize: 22,
    fontWeight: 700,
    color: "#e8e8e8",
    letterSpacing: 2,
  },
  brandLatin: {
    fontSize: 13,
    fontWeight: 600,
    color: "#7b8aad",
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: 10,
    color: "#4a5268",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  nav: {
    flex: 1,
    padding: "12px 0",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    borderRadius: 0,
    width: "100%",
    color: "#6b7a9a",
    transition: "background 0.1s, color 0.1s",
  },
  navItemActive: {
    background: "#1a1f2e",
    color: "#c8d0e8",
    borderLeft: "2px solid #4f7ef8",
  },
  navIcon: {
    fontSize: 14,
    width: 18,
    textAlign: "center",
  },
  navText: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: 500,
  },
  navJa: {
    fontSize: 10,
    color: "#3d4560",
  },
  version: {
    padding: "12px 20px",
    fontSize: 10,
    color: "#2e3450",
    borderTop: "1px solid #1a1f2e",
  },
};
