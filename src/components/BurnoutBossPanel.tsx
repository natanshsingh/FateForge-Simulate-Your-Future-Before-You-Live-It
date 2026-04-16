import TiltCard from "./TiltCard";

export default function BurnoutBossPanel({
  burnout,
  consistency,
  nextStep,
}: {
  burnout: number;
  consistency: number;
  nextStep: string;
}) {
  const threat =
    burnout >= 85 ? "Critical" :
    burnout >= 70 ? "Severe" :
    burnout >= 50 ? "Moderate" :
    "Low";

  const bossName =
    burnout >= 85 ? "The Ashen Tyrant" :
    burnout >= 70 ? "The Burnout Boss" :
    burnout >= 50 ? "The Fatigue Warden" :
    "Dormant";

  return (
    <TiltCard className="full-width" intensity={2}>
      <div className="rune-label">Boss Battle</div>
      <div className="section-title">
        <span className="icon">🔥</span>Burnout Boss
      </div>

      <div className="prophecy-meta">
        <div className="prophecy-chip">
          <span className="prophecy-chip-label">Boss</span>
          <span className="prophecy-chip-value">{bossName}</span>
        </div>
        <div className="prophecy-chip">
          <span className="prophecy-chip-label">Threat Level</span>
          <span className="prophecy-chip-value">{threat}</span>
        </div>
        <div className="prophecy-chip">
          <span className="prophecy-chip-label">Burnout</span>
          <span className="prophecy-chip-value">{burnout}</span>
        </div>
        <div className="prophecy-chip">
          <span className="prophecy-chip-label">Discipline</span>
          <span className="prophecy-chip-value">{consistency}</span>
        </div>
      </div>

      <div className="prophecy-card" style={{ marginTop: 16 }}>
        <div className="prophecy-tag">How to beat it</div>
        <div className="prophecy-text">{nextStep}</div>
      </div>
    </TiltCard>
  );
}