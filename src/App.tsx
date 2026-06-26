import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { FlowDashboard } from "./screens/FlowDashboard";
import { WorkBoard } from "./screens/WorkBoard";
import { ContextCards } from "./screens/ContextCards";
import { AgentOrganization } from "./screens/AgentOrganization";
import { HandoffEvidence } from "./screens/HandoffEvidence";
import { OpsHealth } from "./screens/OpsHealth";

export type Screen =
  | "flow"
  | "work"
  | "context"
  | "agents"
  | "handoff"
  | "health";

function App() {
  const [screen, setScreen] = useState<Screen>("flow");

  return (
    <div style={styles.root}>
      <Sidebar current={screen} onNavigate={setScreen} />
      <main style={styles.main}>
        {screen === "flow" && <FlowDashboard />}
        {screen === "work" && <WorkBoard />}
        {screen === "context" && <ContextCards />}
        {screen === "agents" && <AgentOrganization />}
        {screen === "handoff" && <HandoffEvidence />}
        {screen === "health" && <OpsHealth />}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: "#0b0e17",
    fontFamily:
      "'Inter', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', system-ui, sans-serif",
  },
  main: {
    flex: 1,
    overflowY: "auto",
    minHeight: "100vh",
  },
};

export default App;
