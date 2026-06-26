import { mockWorkItems, mockAgentProfiles, mockAlerts } from "../types/mock-data";
import type { WorkItemStatus } from "../types";

const statusColor: Record<WorkItemStatus, string> = {
  open: "#4a90d9",
  in_progress: "#f5a623",
  needs_human: "#e05252",
  done: "#5cb85c",
  cancelled: "#6b7a9a",
};

const statusLabel: Record<WorkItemStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  needs_human: "Needs Human",
  done: "Done",
  cancelled: "Cancelled",
};

export function FlowDashboard() {
  const active = mockAgentProfiles.filter((a) => a.status === "active");
  const needsHuman = mockWorkItems.filter((w) => w.status === "needs_human");
  const inProgress = mockWorkItems.filter((w) => w.status === "in_progress");
  const done = mockWorkItems.filter((w) => w.status === "done");

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Flow Dashboard <span style={styles.headingJa}>フロー</span></h1>
      <p style={styles.sub}>Current state of work, AI activity, and human decisions.</p>

      <div style={styles.statsRow}>
        <StatCard label="In Progress" value={inProgress.length} color="#f5a623" />
        <StatCard label="Needs Human" value={needsHuman.length} color="#e05252" />
        <StatCard label="Done" value={done.length} color="#5cb85c" />
        <StatCard label="Active Agents" value={active.length} color="#4f7ef8" />
        <StatCard label="Alerts" value={mockAlerts.length} color={mockAlerts.length > 0 ? "#e05252" : "#5cb85c"} />
      </div>

      <div style={styles.sections}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Active Work</h2>
          {inProgress.map((wi) => (
            <div key={wi.id} style={styles.workRow}>
              <span style={{ ...styles.badge, background: statusColor[wi.status] }}>
                {statusLabel[wi.status]}
              </span>
              <span style={styles.workTitle}>{wi.title}</span>
              <span style={styles.actorTag}>{wi.actor_name}</span>
            </div>
          ))}
          {inProgress.length === 0 && <p style={styles.empty}>No active work.</p>}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Active Agents</h2>
          {active.map((a) => (
            <div key={a.id} style={styles.agentRow}>
              <span style={styles.agentDot} />
              <span style={styles.agentName}>{a.name}</span>
              <span style={styles.agentRole}>{a.role}</span>
              {a.current_work_item_id && (
                <span style={styles.agentWork}>→ {a.current_work_item_id}</span>
              )}
            </div>
          ))}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Alerts</h2>
          {mockAlerts.map((alert) => (
            <div key={alert.id} style={{ ...styles.alertRow, borderLeft: `3px solid ${alert.severity === "critical" ? "#e05252" : alert.severity === "warning" ? "#f5a623" : "#4a90d9"}` }}>
              <span style={styles.alertMsg}>{alert.message}</span>
            </div>
          ))}
          {mockAlerts.length === 0 && <p style={styles.empty}>No alerts.</p>}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={styles.statCard}>
      <span style={{ ...styles.statValue, color }}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "32px 36px", color: "#c8d0e8", maxWidth: 900 },
  heading: { fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#e8e8e8" },
  headingJa: { fontSize: 14, fontWeight: 400, color: "#4a5268", marginLeft: 8 },
  sub: { fontSize: 13, color: "#4a5268", margin: "0 0 28px" },
  statsRow: { display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" },
  statCard: {
    background: "#1a1f2e", border: "1px solid #1e2130", borderRadius: 8,
    padding: "16px 20px", minWidth: 120, display: "flex", flexDirection: "column", gap: 4,
  },
  statValue: { fontSize: 28, fontWeight: 700 },
  statLabel: { fontSize: 11, color: "#6b7a9a" },
  sections: { display: "flex", flexDirection: "column", gap: 24 },
  section: { background: "#13182a", border: "1px solid #1e2130", borderRadius: 8, padding: "20px 24px" },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: "#7b8aad", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: 1 },
  workRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  badge: { fontSize: 10, padding: "2px 8px", borderRadius: 4, color: "#fff", fontWeight: 600 },
  workTitle: { fontSize: 13, color: "#c8d0e8", flex: 1 },
  actorTag: { fontSize: 11, color: "#4a5268", background: "#1a1f2e", padding: "2px 8px", borderRadius: 4 },
  agentRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  agentDot: { width: 8, height: 8, borderRadius: "50%", background: "#5cb85c", flexShrink: 0 },
  agentName: { fontSize: 13, color: "#c8d0e8", fontWeight: 500 },
  agentRole: { fontSize: 11, color: "#4a5268", background: "#1a1f2e", padding: "2px 8px", borderRadius: 4 },
  agentWork: { fontSize: 11, color: "#4a5268" },
  alertRow: { padding: "10px 14px", marginBottom: 8, background: "#1a1f2e", borderRadius: 4 },
  alertMsg: { fontSize: 13, color: "#c8d0e8" },
  empty: { fontSize: 13, color: "#3d4560", margin: 0 },
};
