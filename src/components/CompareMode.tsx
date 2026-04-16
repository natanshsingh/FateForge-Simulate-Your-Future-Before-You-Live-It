import type { Dispatch, SetStateAction } from "react";
import TiltCard from "./TiltCard";

type InputState = {
  study_hours: number;
  sleep_hours: number;
  screen_time: number;
  workout: number;
  mood: number;
  deep_work: number;
  streak: number;
};

type ScoreSet = { consistency: number; burnout: number; growth: number };

type CompareModeProps = {
  compareA: InputState;
  setCompareA: Dispatch<SetStateAction<InputState>>;
  compareB: InputState;
  setCompareB: Dispatch<SetStateAction<InputState>>;
  scoreA: ScoreSet;
  scoreB: ScoreSet;
};

type FieldConfig = {
  key: keyof InputState;
  label: string;
  icon: string;
  min: number;
  max: number;
  step: number;
};

const FIELDS: FieldConfig[] = [
  { key: "study_hours", label: "Study", icon: "📖", min: 0, max: 12, step: 0.5 },
  { key: "sleep_hours", label: "Sleep", icon: "🌙", min: 0, max: 12, step: 0.5 },
  { key: "screen_time", label: "Screen", icon: "🔮", min: 0, max: 16, step: 0.5 },
  { key: "workout", label: "Training", icon: "⚔️", min: 0, max: 1, step: 1 },
  { key: "mood", label: "Morale", icon: "🔱", min: 1, max: 10, step: 1 },
  { key: "deep_work", label: "Focus", icon: "🗡️", min: 0, max: 8, step: 0.5 },
  { key: "streak", label: "Streak", icon: "🔥", min: 0, max: 365, step: 1 },
];

function calculatePathPower(score: ScoreSet, input: InputState) {
  const balanceBonus =
    input.sleep_hours >= 7 &&
    input.screen_time <= 4 &&
    input.deep_work >= 2 &&
    input.mood >= 6
      ? 12
      : 0;

  const overstrainPenalty =
    (input.sleep_hours < 6 ? 18 : 0) +
    (input.screen_time > 6 ? 12 : 0) +
    (score.burnout > 70 ? 20 : score.burnout > 55 ? 10 : 0);

  const sustainability =
    score.consistency * 0.42 +
    score.growth * 0.44 -
    score.burnout * 0.46 +
    input.streak * 0.15 +
    input.mood * 1.8 +
    balanceBonus -
    overstrainPenalty;

  return Math.round(sustainability);
}

function getVerdict(score: ScoreSet, input: InputState) {
  if (score.burnout >= 75 || input.sleep_hours < 6) {
    return {
      label: "Unstable",
      text: "Fast gains, but the system is too fragile to sustain.",
      color: "var(--crimson-lit)",
    };
  }

  if (score.consistency >= 75 && score.growth >= 70 && score.burnout <= 40) {
    return {
      label: "Elite",
      text: "Strong growth with enough balance to keep compounding.",
      color: "var(--gold)",
    };
  }

  if (score.consistency >= 60 && score.burnout <= 55) {
    return {
      label: "Viable",
      text: "A believable path with decent momentum and survivability.",
      color: "#C39BD3",
    };
  }

  return {
    label: "Fragile",
    text: "There is potential here, but the structure is not reliable yet.",
    color: "var(--silver)",
  };
}

function getWinnerReason(score: ScoreSet, input: InputState) {
  if (score.burnout <= 35 && input.sleep_hours >= 7) {
    return "Wins on sustainability and recovery.";
  }
  if (score.growth >= 75 && score.consistency >= 70) {
    return "Wins on compounding discipline and growth.";
  }
  if (input.screen_time <= 4 && input.deep_work >= 3) {
    return "Wins on focus quality and lower distraction.";
  }
  return "Wins on overall long-term trajectory.";
}

function PathPanel({
  label,
  herald,
  input,
  setInput,
  score,
  isWinner,
  accentColor,
  borderColor,
}: {
  label: string;
  herald: string;
  input: InputState;
  setInput: Dispatch<SetStateAction<InputState>>;
  score: ScoreSet;
  isWinner: boolean;
  accentColor: string;
  borderColor: string;
}) {
  const power = calculatePathPower(score, input);
  const verdict = getVerdict(score, input);

  function update(key: keyof InputState, delta: number, min: number, max: number, step: number) {
    setInput((prev) => {
      const raw = Math.round((prev[key] + delta) / step) * step;
      return { ...prev, [key]: Math.max(min, Math.min(max, parseFloat(raw.toFixed(2)))) };
    });
  }

  return (
    <div
      className={`path-panel ${isWinner ? "chosen" : ""}`}
      style={{
        borderColor,
        background: isWinner
          ? `linear-gradient(160deg, ${accentColor}0c, rgba(0,0,0,0.35))`
          : "linear-gradient(160deg, rgba(18,10,4,0.95), rgba(12,8,4,0.98))",
      }}
    >
      <div className="corner tl" style={{ borderColor: accentColor, opacity: 0.5 }} />
      <div className="corner tr" style={{ borderColor: accentColor, opacity: 0.5 }} />
      <div className="corner bl" style={{ borderColor: accentColor, opacity: 0.5 }} />
      <div className="corner br" style={{ borderColor: accentColor, opacity: 0.5 }} />

      <div className="path-label" style={{ color: accentColor, textShadow: `0 0 10px ${accentColor}55` }}>
        {isWinner ? "👑 " : "⚔ "} {label}
        {isWinner && (
          <span
            style={{
              marginLeft: 10,
              fontSize: 9,
              fontFamily: "'Cinzel', serif",
              padding: "2px 8px",
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}44`,
              letterSpacing: 2,
              verticalAlign: "middle",
            }}
          >
            VICTORIOUS
          </span>
        )}
      </div>

      <div
        style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: 12,
          color: "var(--parchment-dim)",
          fontStyle: "italic",
          marginBottom: 16,
        }}
      >
        {herald}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FIELDS.map(({ key, label: lbl, icon, min, max, step }) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, width: 20 }}>{icon}</span>
            <span
              style={{
                flex: 1,
                fontSize: 11,
                color: "var(--text-muted)",
                fontFamily: "'Cinzel', serif",
                letterSpacing: "0.5px",
              }}
            >
              {lbl}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                className="quest-btn"
                style={{ width: 24, height: 24, fontSize: 15 }}
                onClick={() => update(key, -step, min, max, step)}
              >
                −
              </button>
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 14,
                  fontWeight: 700,
                  minWidth: 30,
                  textAlign: "center",
                  color: accentColor,
                  textShadow: `0 0 8px ${accentColor}55`,
                }}
              >
                {input[key]}
              </span>
              <button
                className="quest-btn"
                style={{ width: 24, height: 24, fontSize: 15 }}
                onClick={() => update(key, +step, min, max, step)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${accentColor}20` }}>
        <div className="path-score-row">
          <span className="path-score-key">Discipline</span>
          <span className="path-score-val" style={{ color: "var(--gold)" }}>
            {score.consistency}
          </span>
        </div>
        <div className="path-score-row">
          <span className="path-score-key">Corruption</span>
          <span
            className="path-score-val"
            style={{ color: score.burnout >= 70 ? "var(--crimson-lit)" : "var(--ember)" }}
          >
            {score.burnout}
          </span>
        </div>
        <div className="path-score-row">
          <span className="path-score-key">Ascension</span>
          <span className="path-score-val" style={{ color: "#C39BD3" }}>
            {score.growth}
          </span>
        </div>
        <div className="path-score-row">
          <span className="path-score-key">Verdict</span>
          <span className="path-score-val" style={{ color: verdict.color }}>
            {verdict.label}
          </span>
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            color: "var(--parchment-dim)",
            lineHeight: 1.5,
            fontStyle: "italic",
          }}
        >
          {verdict.text}
        </div>

        <div className="path-score-row" style={{ marginTop: 10, borderBottom: "none" }}>
          <span className="path-score-key" style={{ color: "var(--parchment)", fontWeight: 700 }}>
            Fate Score
          </span>
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 26,
              fontWeight: 900,
              color: accentColor,
              textShadow: `0 0 14px ${accentColor}70`,
            }}
          >
            {power}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CompareMode({
  compareA,
  setCompareA,
  compareB,
  setCompareB,
  scoreA,
  scoreB,
}: CompareModeProps) {
  const powerA = calculatePathPower(scoreA, compareA);
  const powerB = calculatePathPower(scoreB, compareB);

  const aWins = powerA > powerB;
  const bWins = powerB > powerA;
  const isTie = powerA === powerB;

  return (
    <TiltCard className="full-width" intensity={2}>
      <div className="shimmer-sweep" />
      <div className="rune-label">The Duel of Paths</div>
      <div className="section-title">
        <span className="icon">⚔️</span>Two Life Paths — Choose Your Fate
      </div>

      <div
        style={{
          marginTop: -4,
          marginBottom: 18,
          fontSize: 12,
          color: "var(--parchment-dim)",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        {isTie
          ? "Both paths are evenly matched. The deciding factor will be consistency over time."
          : aWins
          ? getWinnerReason(scoreA, compareA)
          : getWinnerReason(scoreB, compareB)}
      </div>

      <div className="duel-wrap">
        <PathPanel
          label="The Noble Path"
          herald="A life of discipline and sacrifice"
          input={compareA}
          setInput={setCompareA}
          score={scoreA}
          isWinner={aWins}
          accentColor="#D4AF37"
          borderColor={aWins ? "rgba(212,175,55,0.45)" : "rgba(58,48,40,0.6)"}
        />

        <div className="duel-center">
          <div className="vs-line" />
          <div className="vs-emblem">{isTie ? "=" : "VS"}</div>
          <span style={{ fontSize: 22 }}>{isTie ? "⚖️" : "⚔️"}</span>
          <div className="vs-line" />
        </div>

        <PathPanel
          label="The Shadow Path"
          herald="A life of comfort and ease"
          input={compareB}
          setInput={setCompareB}
          score={scoreB}
          isWinner={bWins}
          accentColor="#9B59B6"
          borderColor={bWins ? "rgba(155,89,182,0.45)" : "rgba(58,48,40,0.6)"}
        />
      </div>
    </TiltCard>
  );
}