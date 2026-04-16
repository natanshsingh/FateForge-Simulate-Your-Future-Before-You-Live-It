import TiltCard from "./TiltCard";

type SimResult = {
  bestCase: string;
  likelyCase: string;
  worstCase: string;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  nextStep: string;
  timeline: { day7: string; day30: string; day90: string };
  category?: string;
  momentum?: number;
  scores?: {
    consistency: number;
    burnout: number;
    growth: number;
  };
};

type WhatIfProps = {
  scenario: string;
  setScenario: (v: string) => void;
  result: SimResult;
};

const RISK_COLOR: Record<"Low" | "Medium" | "High", string> = {
  Low: "var(--gold)",
  Medium: "var(--ember)",
  High: "var(--crimson-lit)",
};

const RISK_LABEL: Record<"Low" | "Medium" | "High", string> = {
  Low: "Favourable Omens",
  Medium: "Uncertain Winds",
  High: "Dark Prophecy",
};

function getMomentumLabel(momentum = 0) {
  if (momentum >= 80) return { label: "Surging", color: "var(--gold)" };
  if (momentum >= 60) return { label: "Strong", color: "#C39BD3" };
  if (momentum >= 40) return { label: "Fragile", color: "var(--ember)" };
  return { label: "Collapsing", color: "var(--crimson-lit)" };
}

function prettyCategory(category?: string) {
  if (!category) return "General";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function getScoreColor(value: number, kind: "good" | "bad") {
  if (kind === "good") {
    if (value >= 75) return "var(--gold)";
    if (value >= 50) return "#C39BD3";
    return "var(--silver)";
  }

  if (value >= 75) return "var(--crimson-lit)";
  if (value >= 50) return "var(--ember)";
  return "var(--silver)";
}

export default function WhatIfSimulator({
  scenario,
  setScenario,
  result,
}: WhatIfProps) {
  const momentum = getMomentumLabel(result.momentum ?? 0);

  return (
    <TiltCard className="full-width" intensity={3}>
      <div className="shimmer-sweep" />
      <div className="rune-label">Oracle Chamber</div>

      <div className="section-title">
        <span className="icon">🔮</span>Prophecy Simulator
      </div>

      <div className="prophecy-input-wrap">
        <span className="prophecy-rune">✦ Speak thy fate ✦</span>
        <input
          className="prophecy-input"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder="Whisper your what-if into the oracle..."
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <span className="fantasy-badge badge-silver">
          ◆ Path Type: {prettyCategory(result.category)}
        </span>

        <span
          className="fantasy-badge"
          style={{
            color: momentum.color,
            borderColor: `${momentum.color}44`,
            background: `${momentum.color}12`,
          }}
        >
          ✦ Momentum: {momentum.label}
        </span>

        <span
          className="fantasy-badge"
          style={{
            color: RISK_COLOR[result.risk],
            borderColor: `${RISK_COLOR[result.risk]}44`,
            background: `${RISK_COLOR[result.risk]}12`,
          }}
        >
          ☠ {RISK_LABEL[result.risk]}
        </span>
      </div>

      {result.scores && (
        <div className="prophecy-meta" style={{ marginBottom: 18 }}>
          <div className="prophecy-chip">
            <span className="prophecy-chip-label">Projected Discipline</span>
            <span
              className="prophecy-chip-value"
              style={{ color: getScoreColor(result.scores.consistency, "good") }}
            >
              {result.scores.consistency}
            </span>
          </div>

          <div className="prophecy-chip">
            <span className="prophecy-chip-label">Projected Burnout</span>
            <span
              className="prophecy-chip-value"
              style={{ color: getScoreColor(result.scores.burnout, "bad") }}
            >
              {result.scores.burnout}
            </span>
          </div>

          <div className="prophecy-chip">
            <span className="prophecy-chip-label">Projected Growth</span>
            <span
              className="prophecy-chip-value"
              style={{ color: getScoreColor(result.scores.growth, "good") }}
            >
              {result.scores.growth}
            </span>
          </div>
        </div>
      )}

      <div className="prophecy-grid">
        <div
          className="prophecy-card"
          style={{
            borderColor: "rgba(212,175,55,0.32)",
            background:
              "linear-gradient(160deg, rgba(212,175,55,0.05), rgba(0,0,0,0.3))",
          }}
        >
          <div className="prophecy-tag" style={{ color: "var(--gold)" }}>
            ✦ Blessed Fate
          </div>
          <div className="prophecy-text">{result.bestCase}</div>
        </div>

        <div
          className="prophecy-card"
          style={{
            borderColor: "rgba(168,160,144,0.28)",
            background:
              "linear-gradient(160deg, rgba(168,160,144,0.04), rgba(0,0,0,0.3))",
          }}
        >
          <div className="prophecy-tag" style={{ color: "var(--silver)" }}>
            ⚖ Most Likely Path
          </div>
          <div className="prophecy-text">{result.likelyCase}</div>
        </div>

        <div
          className="prophecy-card"
          style={{
            borderColor: "rgba(139,26,26,0.45)",
            background:
              "linear-gradient(160deg, rgba(139,26,26,0.07), rgba(0,0,0,0.3))",
          }}
        >
          <div className="prophecy-tag" style={{ color: "var(--crimson-lit)" }}>
            ☠ Cursed Outcome
          </div>
          <div className="prophecy-text">{result.worstCase}</div>
        </div>
      </div>

      <div className="prophecy-meta">
        <div className="prophecy-chip">
          <span className="prophecy-chip-label">Oracle Confidence</span>
          <span
            className="prophecy-chip-value"
            style={{
              color: "var(--gold)",
              textShadow: "0 0 10px rgba(212,175,55,0.4)",
            }}
          >
            {result.confidence}%
          </span>
        </div>

        <div className="prophecy-chip">
          <span className="prophecy-chip-label">Momentum Score</span>
          <span
            className="prophecy-chip-value"
            style={{ color: momentum.color }}
          >
            {result.momentum ?? 0}
          </span>
        </div>

        <div className="prophecy-chip" style={{ flex: 2 }}>
          <span className="prophecy-chip-label">✦ Next Action</span>
          <span
            style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: 14,
              color: "var(--parchment)",
              lineHeight: 1.55,
              fontStyle: "italic",
            }}
          >
            {result.nextStep}
          </span>
        </div>
      </div>

      <div className="prophecy-grid" style={{ marginTop: 18 }}>
        <div className="prophecy-card">
          <div className="prophecy-tag" style={{ color: "var(--gold)" }}>
            Day 7
          </div>
          <div className="prophecy-text">
            {result.timeline?.day7 ?? "No reading yet."}
          </div>
        </div>

        <div className="prophecy-card">
          <div className="prophecy-tag" style={{ color: "var(--silver)" }}>
            Day 30
          </div>
          <div className="prophecy-text">
            {result.timeline?.day30 ?? "No reading yet."}
          </div>
        </div>

        <div className="prophecy-card">
          <div className="prophecy-tag" style={{ color: "var(--ember)" }}>
            Day 90
          </div>
          <div className="prophecy-text">
            {result.timeline?.day90 ?? "No reading yet."}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}