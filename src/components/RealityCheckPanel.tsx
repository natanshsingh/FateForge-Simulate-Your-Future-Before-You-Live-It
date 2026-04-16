import TiltCard from "./TiltCard";

export default function RealityCheckPanel({
  confidence,
  risk,
  realityCheck,
  threat,
}: {
  confidence: number;
  risk: "Low" | "Medium" | "High";
  realityCheck: string;
  threat: string;
}) {
  const riskColor =
    risk === "High" ? "var(--crimson-lit)" :
    risk === "Medium" ? "var(--ember)" :
    "var(--gold)";

  return (
    <TiltCard className="full-width" intensity={2}>
      <div className="rune-label">Reality Check</div>
      <div className="section-title">
        <span className="icon">⚠️</span>Scenario Verdict
      </div>

      <div className="prophecy-meta">
        <div className="prophecy-chip">
          <span className="prophecy-chip-label">Reality Check</span>
          <span className="prophecy-chip-value">{realityCheck}</span>
        </div>
        <div className="prophecy-chip">
          <span className="prophecy-chip-label">Threat</span>
          <span className="prophecy-chip-value" style={{ color: riskColor }}>
            {threat}
          </span>
        </div>
        <div className="prophecy-chip">
          <span className="prophecy-chip-label">Confidence</span>
          <span className="prophecy-chip-value">{confidence}%</span>
        </div>
      </div>
    </TiltCard>
  );
}