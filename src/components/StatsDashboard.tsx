import TiltCard from "./TiltCard";

type StatsProps = {
  consistency: number;
  burnout: number;
  growth: number;
};

type BarProps = {
  label: string;
  sublabel: string;
  value: number;
  color: string;
  glow: string;
  valueColor: string;
  icon: string;
  warning?: string | null;
};

function FantasyBar({ label, sublabel, value, color, glow, valueColor, icon, warning }: BarProps) {
  return (
    <div className="fantasy-stat">
      <div className="fantasy-stat-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <div>
              <div className="fantasy-stat-label">{label}</div>
              <div className="fantasy-stat-sub">{sublabel}</div>
            </div>
          </div>
        </div>
        <div className="fantasy-stat-value" style={{ color: valueColor, textShadow: `0 0 14px ${glow}` }}>
          {value}
          <span style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "Inter", fontWeight: 400, marginLeft: 1 }}>/100</span>
        </div>
      </div>

      <div className="fantasy-bar-track">
        <div
          className="fantasy-bar-fill"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}70, ${color})`,
            boxShadow: `0 0 12px ${glow}, 0 0 4px ${glow}`,
          }}
        />
      </div>

      {warning && (
        <div style={{
          marginTop: 8,
          padding: "7px 14px",
          background: "rgba(139,26,26,0.12)",
          border: "1px solid rgba(196,30,58,0.3)",
          borderLeft: "2px solid var(--crimson-lit)",
          fontFamily: "'Cinzel', serif",
          fontSize: 10.5,
          color: "var(--crimson-lit)",
          letterSpacing: "0.5px",
        }}>⚠ {warning}</div>
      )}
    </div>
  );
}

function CircularCorruption({ value }: { value: number }) {
  const radius = 46;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  const color  = value >= 70 ? "#C41E3A" : value >= 50 ? "#E8622A" : "#8B6914";
  const glow   = value >= 70 ? "rgba(196,30,58,0.6)" : value >= 50 ? "rgba(232,98,42,0.5)" : "rgba(139,105,20,0.4)";
  const label  = value >= 70 ? "Critical" : value >= 50 ? "Elevated" : "Contained";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="10"
          />
          <circle cx="55" cy="55" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="butt"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 55 55)"
            style={{
              filter: `drop-shadow(0 0 6px ${glow})`,
              transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
          <circle cx="55" cy="55" r={radius - 16}
            fill="rgba(0,0,0,0.4)"
            stroke="rgba(212,175,55,0.1)"
            strokeWidth="1"
          />
        </svg>
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{ fontSize: 22, fontFamily: "'Cinzel', serif", fontWeight: 700, color, textShadow: `0 0 10px ${glow}` }}>
            {value}
          </span>
          <span style={{ fontSize: 9, fontFamily: "'Cinzel', serif", letterSpacing: "1.5px", color: "var(--text-muted)", textTransform: "uppercase" }}>
            {label}
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div className="fantasy-stat-label" style={{ marginBottom: 4 }}>💀 Corruption</div>
        <div className="fantasy-stat-sub" style={{ marginBottom: 12 }}>Fatigue & Burnout Gauge</div>
        <div style={{
          padding: "8px 12px",
          background: value >= 70 ? "rgba(139,26,26,0.12)" : "rgba(0,0,0,0.2)",
          border: `1px solid ${value >= 70 ? "rgba(196,30,58,0.3)" : "rgba(58,48,40,0.5)"}`,
          borderLeft: `2px solid ${color}`,
          fontFamily: "'IM Fell English', serif",
          fontSize: 13,
          color: value >= 70 ? "var(--crimson-lit)" : "var(--text-muted)",
          fontStyle: "italic",
        }}>
          {value >= 70
            ? "The darkness grows within. Seek rest before the corruption consumes all."
            : value >= 50
            ? "Fatigue lingers. Heed your body's warnings."
            : "The spirit holds firm. Corruption remains at bay."}
        </div>
      </div>
    </div>
  );
}

export default function StatsDashboard({ consistency, burnout, growth }: StatsProps) {
  return (
    <TiltCard>
      <div className="shimmer-sweep" />
      <div className="rune-label">Vital Measures</div>
      <div className="section-title"><span className="icon">📜</span>The Three Pillars</div>

      <FantasyBar
        label="Discipline"
        sublabel="Armor of Consistency"
        value={consistency}
        color="#D4AF37"
        glow="rgba(212,175,55,0.55)"
        valueColor="var(--gold)"
        icon="🛡️"
      />

      <CircularCorruption value={burnout} />

      <FantasyBar
        label="Ascension"
        sublabel="Growth & XP Progression"
        value={growth}
        color="#9B59B6"
        glow="rgba(155,89,182,0.55)"
        valueColor="#C39BD3"
        icon="✨"
      />
    </TiltCard>
  );
}
