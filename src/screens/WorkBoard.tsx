import { mockWorkItems, mockContextCards } from "../types/mock-data";
import type { WorkItemStatus } from "../types";

const columns: { status: WorkItemStatus; label: string; color: string }[] = [
  { status: "open", label: "Open", color: "#4a90d9" },
  { status: "in_progress", label: "In Progress", color: "#f5a623" },
  { status: "needs_human", label: "Needs Human", color: "#e05252" },
  { status: "done", label: "Done", color: "#5cb85c" },
];

export function WorkBoard() {
  const contextMap = Object.fromEntries(mockContextCards.map((c) => [c.id, c.title]));

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Work Board <span style={styles.headingJa}>作業ボード</span></h1>
      <p style={styles.sub}>Work Items for humans and AI agents across all business functions.</p>

      <div style={styles.board}>
        {columns.map((col) => {
          const items = mockWorkItems.filter((w) => w.status === col.status);
          return (
            <div key={col.status} style={styles.column}>
              <div style={styles.columnHeader}>
                <span style={{ ...styles.columnDot, background: col.color }} />
                <span style={styles.columnLabel}>{col.label}</span>
                <span style={styles.columnCount}>{items.length}</span>
              </div>
              {items.map((wi) => (
                <div key={wi.id} style={styles.card}>
                  <div style={styles.cardTitle}>{wi.title}</div>
                  <div style={styles.cardMeta}>
                    <span style={styles.actorTag}>{wi.actor_name}</span>
                    {wi.context_id && (
                      <span style={styles.contextTag}>
                        {contextMap[wi.context_id] ?? wi.context_id}
                      </span>
                    )}
                  </div>
                  <div style={styles.cardSummary}>{wi.summary}</div>
                  <div style={styles.cardDate}>{wi.updated_at.slice(0, 10)}</div>
                </div>
              ))}
              {items.length === 0 && <div style={styles.empty}>—</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "32px 36px", color: "#c8d0e8", height: "100vh", overflowY: "auto" },
  heading: { fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#e8e8e8" },
  headingJa: { fontSize: 14, fontWeight: 400, color: "#4a5268", marginLeft: 8 },
  sub: { fontSize: 13, color: "#4a5268", margin: "0 0 28px" },
  board: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, alignItems: "start" },
  column: { background: "#13182a", border: "1px solid #1e2130", borderRadius: 8, padding: "16px 14px", minHeight: 120 },
  columnHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14 },
  columnDot: { width: 8, height: 8, borderRadius: "50%" },
  columnLabel: { fontSize: 12, fontWeight: 600, color: "#7b8aad", flex: 1 },
  columnCount: { fontSize: 11, color: "#3d4560", background: "#1a1f2e", padding: "1px 6px", borderRadius: 4 },
  card: { background: "#0f1117", border: "1px solid #1e2130", borderRadius: 6, padding: "12px", marginBottom: 10 },
  cardTitle: { fontSize: 12, fontWeight: 600, color: "#c8d0e8", marginBottom: 8, lineHeight: 1.4 },
  cardMeta: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 },
  actorTag: { fontSize: 10, color: "#7b8aad", background: "#1a1f2e", padding: "1px 6px", borderRadius: 3 },
  contextTag: { fontSize: 10, color: "#4a5268", background: "#1a1f2e", padding: "1px 6px", borderRadius: 3, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  cardSummary: { fontSize: 11, color: "#4a5268", lineHeight: 1.5, marginBottom: 8 },
  cardDate: { fontSize: 10, color: "#2e3450" },
  empty: { fontSize: 12, color: "#2e3450", textAlign: "center", padding: "20px 0" },
};
