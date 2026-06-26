import { mockAlerts, mockWorkItems, mockAgentProfiles } from "../types/mock-data";

const alertKindLabel: Record<string, string> = {
  done_without_handoff: "Done without Handoff",
  handoff_without_evidence: "Handoff without Evidence",
  stale_work: "Stale Work",
  missing_context: "Missing Context",
  agent_failure: "Agent Failure",
};

const driftChecks = [
  { label: "Done without Handoff", pass: false, count: 1 },
  { label: "Handoff without Evidence", pass: true, count: 0 },
  { label: "Stale Work Items (>7d)", pass: true, count: 0 },
  { label: "Missing Context links", pass: true, count: 0 },
  { label: "Agent failures (24h)", pass: true, count: 0 },
  { label: "Broken evidence references", pass: true, count: 0 },
];

export function OpsHealth() {
  const agentHealth = mockAgentProfiles.map((a) => ({
    ...a,
    healthy: a.status !== "error" && a.status !== "offline",
  }));

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Ops Health <span style={styles.headingJa}>運用状態</span></h1>
      <p style={styles.sub}>Detect operational drift: silent failures, stale work, missing evidence, and broken context links.</p>

      <div style={styles.twoCol}>
        <section>
          <h2 style={styles.sectionTitle}>Drift Checks</h2>
          {driftChecks.map((check) => (
            <div key={check.label} style={styles.checkRow}>
              <span style={{ ...styles.checkIcon, color: check.pass ? "#5cb85c" : "#e05252" }}>
                {check.pass ? "✓" : "✗"}
              </span>
              <span style={styles.checkLabel}>{check.label}</span>
              {check.count > 0 && (
                <span style={styles.checkCount}>{check.count}</span>
              )}
            </div>
          ))}
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Agent Health</h2>
          {agentHealth.map((a) => (
            <div key={a.id} style={styles.agentRow}>
              <span style={{ ...styles.agentDot, background: a.status === "active" ? "#5cb85c" : a.status === "idle" ? "#f5a623" : "#e05252" }} />
              <span style={styles.agentName}>{a.name}</span>
              <span style={styles.agentStatus}>{a.status}</span>
            </div>
          ))}
        </section>
      </div>

      <section style={styles.alertSection}>
        <h2 style={styles.sectionTitle}>Active Alerts</h2>
        {mockAlerts.map((alert) => (
          <div key={alert.id} style={{
            ...styles.alertCard,
            borderLeft: `3px solid ${alert.severity === "critical" ? "#e05252" : alert.severity === "warning" ? "#f5a623" : "#4a90d9"}`,
          }}>
            <div style={styles.alertHeader}>
              <span style={styles.alertKind}>{alertKindLabel[alert.kind] ?? alert.kind}</span>
              <span style={styles.alertSeverity}>{alert.severity}</span>
              <span style={styles.alertDate}>{alert.created_at.slice(0, 10)}</span>
            </div>
            <div style={styles.alertMsg}>{alert.message}</div>
          </div>
        ))}
        {mockAlerts.length === 0 && <p style={styles.empty}>No active alerts.</p>}
      </section>

      <div style={styles.workStats}>
        <h2 style={styles.sectionTitle}>Work Item Summary</h2>
        <div style={styles.statsRow}>
          {(["open", "in_progress", "needs_human", "done", "cancelled"] as const).map((status) => {
            const count = mockWorkItems.filter((w) => w.status === status).length;
            return (
              <div key={status} style={styles.statBox}>
                <span style={styles.statNum}>{count}</span>
                <span style={styles.statLabel}>{status.replace("_", " ")}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "32px 36px", color: "#c8d0e8", maxWidth: 900 },
  heading: { fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#e8e8e8" },
  headingJa: { fontSize: 14, fontWeight: 400, color: "#4a5268", marginLeft: 8 },
  sub: { fontSize: 13, color: "#4a5268", margin: "0 0 28px" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: "#7b8aad", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: 1 },
  checkRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1a1f2e" },
  checkIcon: { fontSize: 14, width: 18, textAlign: "center", fontWeight: 700 },
  checkLabel: { fontSize: 13, color: "#c8d0e8", flex: 1 },
  checkCount: { fontSize: 11, color: "#e05252", background: "#2e1a1a", padding: "1px 8px", borderRadius: 4 },
  agentRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1a1f2e" },
  agentDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  agentName: { fontSize: 13, color: "#c8d0e8", flex: 1 },
  agentStatus: { fontSize: 11, color: "#4a5268" },
  alertSection: { background: "#13182a", border: "1px solid #1e2130", borderRadius: 8, padding: "20px 24px", marginBottom: 24 },
  alertCard: { background: "#0f1117", borderRadius: 4, padding: "12px 14px", marginBottom: 10 },
  alertHeader: { display: "flex", gap: 10, marginBottom: 6, alignItems: "center" },
  alertKind: { fontSize: 12, fontWeight: 600, color: "#c8d0e8", flex: 1 },
  alertSeverity: { fontSize: 10, color: "#7b8aad", background: "#1a1f2e", padding: "2px 8px", borderRadius: 4 },
  alertDate: { fontSize: 10, color: "#2e3450" },
  alertMsg: { fontSize: 12, color: "#6b7a9a" },
  empty: { fontSize: 13, color: "#3d4560", margin: 0 },
  workStats: { background: "#13182a", border: "1px solid #1e2130", borderRadius: 8, padding: "20px 24px" },
  statsRow: { display: "flex", gap: 16, flexWrap: "wrap" },
  statBox: { display: "flex", flexDirection: "column", gap: 4, background: "#0f1117", borderRadius: 6, padding: "12px 16px", minWidth: 80 },
  statNum: { fontSize: 24, fontWeight: 700, color: "#c8d0e8" },
  statLabel: { fontSize: 10, color: "#4a5268", textTransform: "capitalize" },
};
