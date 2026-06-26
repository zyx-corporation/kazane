import { mockContextCards } from "../types/mock-data";

const kindLabel: Record<string, string> = {
  design_strategy: "Design Strategy",
  project_context: "Project Context",
  business_context: "Business Context",
  technical_context: "Technical Context",
  agent_manual: "Agent Manual",
  risk_context: "Risk Context",
};

export function ContextCards() {
  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Context Cards <span style={styles.headingJa}>コンテキスト</span></h1>
      <p style={styles.sub}>Shared organizational memory. Work Items reference Context Cards to preserve why work exists.</p>

      <div style={styles.grid}>
        {mockContextCards.map((ctx) => (
          <div key={ctx.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.kindBadge}>{kindLabel[ctx.kind] ?? ctx.kind}</span>
              <span style={styles.cardId}>{ctx.id}</span>
            </div>
            <h2 style={styles.cardTitle}>{ctx.title}</h2>
            <p style={styles.cardBody}>{ctx.body}</p>
            <div style={styles.cardFooter}>
              <span style={styles.date}>Created {ctx.created_at.slice(0, 10)}</span>
              <span style={styles.date}>Updated {ctx.updated_at.slice(0, 10)}</span>
            </div>
          </div>
        ))}
        <div style={styles.addCard}>
          <span style={styles.addIcon}>+</span>
          <span style={styles.addLabel}>Add Context Card</span>
        </div>
      </div>

      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>Context Card kinds</h3>
        <div style={styles.kindList}>
          {["design_strategy", "project_context", "business_context", "technical_context", "agent_manual", "risk_context", "customer_context", "brand_voice", "handoff_context", "rde_context"].map((k) => (
            <span key={k} style={styles.kindChip}>{kindLabel[k] ?? k}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "32px 36px", color: "#c8d0e8", maxWidth: 1000 },
  heading: { fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#e8e8e8" },
  headingJa: { fontSize: 14, fontWeight: 400, color: "#4a5268", marginLeft: 8 },
  sub: { fontSize: 13, color: "#4a5268", margin: "0 0 28px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 32 },
  card: { background: "#13182a", border: "1px solid #1e2130", borderRadius: 8, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 },
  cardHeader: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  kindBadge: { fontSize: 10, color: "#7b8aad", background: "#1a1f2e", padding: "2px 8px", borderRadius: 4, fontWeight: 600 },
  cardId: { fontSize: 10, color: "#2e3450" },
  cardTitle: { fontSize: 14, fontWeight: 600, color: "#e8e8e8", margin: 0 },
  cardBody: { fontSize: 12, color: "#6b7a9a", lineHeight: 1.6, margin: 0, flex: 1 },
  cardFooter: { display: "flex", gap: 12, marginTop: 4 },
  date: { fontSize: 10, color: "#2e3450" },
  addCard: {
    background: "transparent", border: "1px dashed #1e2130", borderRadius: 8, padding: "18px 20px",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 8, cursor: "pointer", minHeight: 140,
  },
  addIcon: { fontSize: 24, color: "#2e3450" },
  addLabel: { fontSize: 12, color: "#2e3450" },
  infoBox: { background: "#13182a", border: "1px solid #1e2130", borderRadius: 8, padding: "20px 24px" },
  infoTitle: { fontSize: 12, fontWeight: 600, color: "#7b8aad", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 },
  kindList: { display: "flex", flexWrap: "wrap", gap: 8 },
  kindChip: { fontSize: 11, color: "#6b7a9a", background: "#1a1f2e", padding: "4px 10px", borderRadius: 4 },
};
