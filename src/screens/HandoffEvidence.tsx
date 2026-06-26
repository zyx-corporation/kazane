import { mockHandoffNotes, mockEvidenceEntries, mockWorkItems } from "../types/mock-data";

export function HandoffEvidence() {
  const workMap = Object.fromEntries(mockWorkItems.map((w) => [w.id, w.title]));

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Handoff & Evidence <span style={styles.headingJa}>引継ぎ・証拠</span></h1>
      <p style={styles.sub}>Written handoff notes and evidence entries that link work outputs to sources.</p>

      <div style={styles.twoCol}>
        <section>
          <h2 style={styles.sectionTitle}>Handoff Notes</h2>
          {mockHandoffNotes.map((hn) => (
            <div key={hn.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardId}>{hn.id}</span>
                <span style={styles.date}>{hn.created_at.slice(0, 10)}</span>
              </div>
              <div style={styles.workRef}>{workMap[hn.work_item_id] ?? hn.work_item_id}</div>
              <div style={styles.transfer}>
                <span style={styles.actor}>{hn.from_actor}</span>
                <span style={styles.arrow}>→</span>
                <span style={styles.actor}>{hn.to_actor}</span>
              </div>
              <p style={styles.summary}>{hn.summary}</p>
              {hn.evidence_ids.length > 0 && (
                <div style={styles.evidenceRefs}>
                  {hn.evidence_ids.map((eid) => (
                    <span key={eid} style={styles.evidenceRef}>{eid}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {mockHandoffNotes.length === 0 && <p style={styles.empty}>No handoff notes.</p>}
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Evidence Entries</h2>
          {mockEvidenceEntries.map((ev) => (
            <div key={ev.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardId}>{ev.id}</span>
                <span style={{ ...styles.kindBadge }}>{ev.source_kind}</span>
              </div>
              <div style={styles.workRef}>{workMap[ev.work_item_id] ?? ev.work_item_id}</div>
              <div style={styles.sourceRef}>{ev.source_ref}</div>
              <p style={styles.summary}>{ev.summary}</p>
              <div style={styles.date}>{ev.created_at.slice(0, 10)}</div>
            </div>
          ))}
          {mockEvidenceEntries.length === 0 && <p style={styles.empty}>No evidence entries.</p>}
        </section>
      </div>

      <div style={styles.conceptBox}>
        <h3 style={styles.conceptTitle}>Design Principle</h3>
        <p style={styles.conceptText}>
          Written handoff over ephemeral chat — important work moves through durable notes, work items, evidence, and audit trails rather than untraceable conversation.
          Evidence-linked summaries over detached summaries — summaries are useful only when users can trace them back to source evidence.
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "32px 36px", color: "#c8d0e8", maxWidth: 1000 },
  heading: { fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#e8e8e8" },
  headingJa: { fontSize: 14, fontWeight: 400, color: "#4a5268", marginLeft: 8 },
  sub: { fontSize: 13, color: "#4a5268", margin: "0 0 28px" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: "#7b8aad", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: 1 },
  card: { background: "#13182a", border: "1px solid #1e2130", borderRadius: 8, padding: "16px 18px", marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardId: { fontSize: 10, color: "#2e3450" },
  date: { fontSize: 10, color: "#2e3450" },
  workRef: { fontSize: 12, color: "#7b8aad", fontStyle: "italic" },
  transfer: { display: "flex", alignItems: "center", gap: 8 },
  actor: { fontSize: 12, color: "#c8d0e8", background: "#1a1f2e", padding: "2px 10px", borderRadius: 4 },
  arrow: { color: "#4a5268" },
  summary: { fontSize: 12, color: "#6b7a9a", lineHeight: 1.6, margin: 0 },
  evidenceRefs: { display: "flex", gap: 6, flexWrap: "wrap" },
  evidenceRef: { fontSize: 10, color: "#4f7ef8", background: "#1a2540", padding: "2px 8px", borderRadius: 4 },
  kindBadge: { fontSize: 10, color: "#7b8aad", background: "#1a1f2e", padding: "2px 8px", borderRadius: 4 },
  sourceRef: { fontSize: 11, color: "#4f7ef8", fontFamily: "monospace" },
  empty: { fontSize: 13, color: "#3d4560" },
  conceptBox: { background: "#13182a", border: "1px solid #1e2130", borderRadius: 8, padding: "20px 24px" },
  conceptTitle: { fontSize: 12, fontWeight: 600, color: "#7b8aad", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 1 },
  conceptText: { fontSize: 12, color: "#6b7a9a", lineHeight: 1.7, margin: 0 },
};
