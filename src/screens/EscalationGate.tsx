import type { GateRule, EnrichedWorkItem, AgentProfile } from '../types';
import { GATE_DOMAIN_COLORS, trustColor } from '../types';
import type { Translations } from '../i18n';

interface EscalationGateProps {
  gateRules: GateRule[];
  agentProfiles: AgentProfile[];
  gateDomain: string;
  t: Translations;
  items: EnrichedWorkItem[];
  onSetGateDomain: (d: string) => void;
}

export function EscalationGate({ gateRules, agentProfiles, gateDomain, t, items, onSetGateDomain }: EscalationGateProps) {
  const domainCounts: Record<string, number> = {};
  for (const it of items) { domainCounts[it.domain] = (domainCounts[it.domain] ?? 0) + 1; }
  const chips = [{ key: 'all', label: t.chipAll }, ...gateRules.map(r => ({ key: r.domain, label: r.domain }))];
  const filtered = gateDomain === 'all' ? gateRules : gateRules.filter(r => r.domain === gateDomain);

  return (
    <section style={s.page}>
      <h1 style={s.h1}>Escalation Gate</h1>
      <p style={s.sub}>{t.subGateScr}</p>

      <div style={s.chips}>
        {chips.map(c => {
          const active = gateDomain === c.key;
          const col = GATE_DOMAIN_COLORS[c.key] ?? '#5b8def';
          return (
            <button key={c.key} onClick={() => onSetGateDomain(c.key)} style={{
              fontSize: 11.5, color: active ? '#fff' : '#9aa1ad',
              background: active ? col : '#1a1d24',
              border: `1px solid ${active ? col : '#262a33'}`,
              padding: '6px 13px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {c.label}
              {c.key !== 'all' && domainCounts[c.key] != null && (
                <span style={{ fontSize: 10, background: active ? 'rgba(0,0,0,0.25)' : '#232730', color: active ? '#fff' : '#6a7078', borderRadius: 20, padding: '1px 6px', fontFamily: "'JetBrains Mono', monospace" }}>{domainCounts[c.key]}</span>
              )}
            </button>
          );
        })}
      </div>

      <div style={s.layout}>
        <div style={s.ruleGrid}>
          {filtered.map(r => {
            const dc = GATE_DOMAIN_COLORS[r.domain] ?? '#5b8def';
            return (
              <div key={r.domain} style={{ ...s.ruleCard, borderTop: `3px solid ${dc}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 13 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: dc }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#e6e8ec' }}>{r.domain}</span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={s.permLabel}>{t.permLabel}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {r.perm.map(p => (
                      <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#cfe0d6' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#5fb89f', flexShrink: 0 }} />{p}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={s.stopLabel}>{t.stopLabel}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {r.stops.map(stop => (
                      <span key={stop} style={s.stopChip}>{stop}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={s.sidebar}>
          <Panel title={t.riskClassifier}>
            <RiskRow label={t.riskLow} color="#9fd9c0" code="auto" />
            <RiskRow label={t.riskMed} color="#e0c98f" code="review" />
            <RiskRow label={t.riskHigh} color="#e7bccb" code="expert" />
          </Panel>

          <Panel title={t.approvalFlow}>
            <ApprovalStep n={1} bg="#141b27" border="#24344a" color="#5b8def" label={t.af1} />
            <ApprovalStep n={2} bg="#1d1b14" border="#34301f" color="#d9a93f" label={t.af2} />
            <ApprovalStep n={3} bg="#191620" border="#2c2540" color="#b6a6ee" label={t.af3} />
            <ApprovalStep n={4} bg="#161d18" border="#25382b" color="#5fb89f" label={t.af4} />
          </Panel>

          <Panel title={t.stopTemplates}>
            {[t.st1, t.st2, t.st3, t.st4].map((st, i) => (
              <div key={i} style={s.stopTemplate}>{st}</div>
            ))}
          </Panel>

          <Panel title={t.agentProfilesHd}>
            {agentProfiles.map(ap => (
              <div key={ap.id} style={{ border: '1px solid #262a33', background: '#16191f', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#dfe3e8' }}>{ap.name}</span>
                  <span style={{ fontSize: 10, color: trustColor(ap.trustLevel), fontFamily: "'JetBrains Mono', monospace" }}>{t.agentTrust} {ap.trustLevel}</span>
                </div>
                <div style={{ fontSize: 9.5, color: '#6a7078', fontFamily: "'JetBrains Mono', monospace", marginBottom: 5 }}>{ap.model}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {ap.capabilities.slice(0, 3).map(c => (
                    <span key={c} style={{ fontSize: 9.5, color: '#7dd4cc', background: '#131f22', border: '1px solid #1d3840', padding: '1px 6px', borderRadius: 4 }}>{c}</span>
                  ))}
                  {ap.capabilities.length > 3 && <span style={{ fontSize: 9.5, color: '#6a7078' }}>+{ap.capabilities.length - 3}</span>}
                </div>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </section>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #262a33', background: '#1a1d24', borderRadius: 11, padding: 15 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#d3d8df', marginBottom: 11 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  );
}

function RiskRow({ label, color, code }: { label: string; color: string; code: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 11.5, color }}>{label}</span>
      <span style={{ fontSize: 10, color: '#6a7078', fontFamily: "'JetBrains Mono', monospace" }}>{code}</span>
    </div>
  );
}

function ApprovalStep({ n, bg, border, color, label }: { n: number; bg: string; border: string; color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 11.5, color: '#c8cdd5' }}>
      <span style={{ width: 20, height: 20, borderRadius: 6, background: bg, border: `1px solid ${border}`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>{n}</span>
      {label}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '26px 28px 40px' },
  h1: { margin: 0, fontSize: 22, fontWeight: 700, color: '#e6e8ec' },
  sub: { margin: '6px 0 0', color: '#8b919c', fontSize: 13 },
  chips: { marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' },
  layout: { marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 290px', gap: 18, alignItems: 'start' },
  ruleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  ruleCard: { border: '1px solid #262a33', background: '#1a1d24', borderRadius: 11, padding: 16 },
  permLabel: { fontSize: 10, color: '#5fb89f', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginBottom: 7 },
  stopLabel: { fontSize: 10, color: '#d98ba0', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginBottom: 7 },
  stopChip: { fontSize: 11, color: '#e7bccb', background: '#1f1417', border: '1px solid #3a2329', padding: '3px 9px', borderRadius: 6 },
  sidebar: { display: 'flex', flexDirection: 'column', gap: 14 },
  stopTemplate: { fontSize: 11, color: '#9aa1ad', background: '#16191f', border: '1px solid #262a33', borderRadius: 6, padding: '6px 9px' },
};
