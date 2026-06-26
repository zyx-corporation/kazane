import { mockAgentProfiles, mockWorkItems } from "../types/mock-data";

const statusColor: Record<string, string> = {
  active: "#5cb85c",
  idle: "#f5a623",
  error: "#e05252",
  offline: "#3d4560",
};

export function AgentOrganization() {
  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Agent Organization <span style={styles.headingJa}>エージェント組織</span></h1>
      <p style={styles.sub}>AI agents as first-class work actors. Each agent has a role, manual, model policy, and review chain.</p>

      <div style={styles.grid}>
        {mockAgentProfiles.map((agent) => {
          const currentWork = agent.current_work_item_id
            ? mockWorkItems.find((w) => w.id === agent.current_work_item_id)
            : null;
          return (
            <div key={agent.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.avatar}>
                  {agent.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div style={styles.agentInfo}>
                  <div style={styles.agentName}>{agent.name}</div>
                  <div style={styles.agentRole}>{agent.role}</div>
                </div>
                <div style={{ ...styles.statusDot, background: statusColor[agent.status] }} title={agent.status} />
              </div>

              <div style={styles.fields}>
                <Field label="Model" value={agent.model} />
                <Field label="Work Area" value={agent.work_area} />
                <Field label="Status" value={agent.status} />
              </div>

              {currentWork && (
                <div style={styles.currentWork}>
                  <span style={styles.currentLabel}>Current Work</span>
                  <span style={styles.currentTitle}>{currentWork.title}</span>
                </div>
              )}

              {!currentWork && (
                <div style={styles.idle}>No active work item</div>
              )}
            </div>
          );
        })}

        <div style={styles.addCard}>
          <span style={styles.addIcon}>+</span>
          <span style={styles.addLabel}>Add Agent Profile</span>
        </div>
      </div>

      <div style={styles.conceptBox}>
        <h3 style={styles.conceptTitle}>Agent Profile fields (planned for v0.1)</h3>
        <div style={styles.fieldList}>
          {["Name", "Role", "Manual / Instructions", "Model policy", "Work area / desk", "Tool permissions", "Review chain", "Escalation rules", "Health expectations"].map((f) => (
            <span key={f} style={styles.fieldChip}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
      <span style={{ fontSize: 10, color: "#4a5268", width: 72, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 11, color: "#7b8aad" }}>{value}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "32px 36px", color: "#c8d0e8", maxWidth: 1000 },
  heading: { fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#e8e8e8" },
  headingJa: { fontSize: 14, fontWeight: 400, color: "#4a5268", marginLeft: 8 },
  sub: { fontSize: 13, color: "#4a5268", margin: "0 0 28px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 32 },
  card: { background: "#13182a", border: "1px solid #1e2130", borderRadius: 8, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 },
  cardTop: { display: "flex", alignItems: "center", gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: "50%", background: "#1a2540", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#7b8aad", flexShrink: 0 },
  agentInfo: { flex: 1 },
  agentName: { fontSize: 14, fontWeight: 600, color: "#e8e8e8" },
  agentRole: { fontSize: 11, color: "#4a5268" },
  statusDot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  fields: { borderTop: "1px solid #1e2130", paddingTop: 12 },
  currentWork: { background: "#0f1117", borderRadius: 6, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 },
  currentLabel: { fontSize: 10, color: "#4a5268", textTransform: "uppercase", letterSpacing: 0.5 },
  currentTitle: { fontSize: 12, color: "#c8d0e8" },
  idle: { fontSize: 11, color: "#2e3450", textAlign: "center", padding: "8px 0" },
  addCard: {
    background: "transparent", border: "1px dashed #1e2130", borderRadius: 8, padding: "18px 20px",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 8, cursor: "pointer", minHeight: 160,
  },
  addIcon: { fontSize: 24, color: "#2e3450" },
  addLabel: { fontSize: 12, color: "#2e3450" },
  conceptBox: { background: "#13182a", border: "1px solid #1e2130", borderRadius: 8, padding: "20px 24px" },
  conceptTitle: { fontSize: 12, fontWeight: 600, color: "#7b8aad", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 },
  fieldList: { display: "flex", flexWrap: "wrap", gap: 8 },
  fieldChip: { fontSize: 11, color: "#6b7a9a", background: "#1a1f2e", padding: "4px 10px", borderRadius: 4 },
};
