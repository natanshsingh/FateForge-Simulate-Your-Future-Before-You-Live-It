import TiltCard from "./TiltCard";

type WeeklyReportProps = {
  consistency: number;
  burnout: number;
  growth: number;
  summary: string;
  advice: string;
};

type Badge = { icon: string; label: string; cls: string; condition: boolean };

export default function WeeklyReport({ consistency, burnout, growth, summary, advice }: WeeklyReportProps) {
  const focus = burnout >= 70
    ? "⚕ Rest & Recover — the corruption grows"
    : consistency >= 70
    ? "🛡️ Maintain the Oath — you are building momentum"
    : "⚔️ Sharpen the Discipline — consistency must rise";

  const badges: Badge[] = [
    { icon: "⚔️",  label: "Iron Discipline",   cls: "badge-gold",      condition: consistency >= 80 },
    { icon: "🔥",  label: "Flame of Focus",    cls: "badge-ember",     condition: consistency >= 70 },
    { icon: "✨",  label: "Arcane Momentum",   cls: "badge-parchment", condition: growth >= 75 },
    { icon: "💀",  label: "Recovery Needed",   cls: "badge-crimson",   condition: burnout >= 70 },
    { icon: "🗡️",  label: "Streak Keeper",     cls: "badge-silver",    condition: consistency >= 60 && burnout < 60 },
    { icon: "🛡️",  label: "Vow of Resolve",    cls: "badge-gold",      condition: consistency >= 60 && growth >= 60 },
  ].filter((b) => b.condition);

  const activeBadges = badges.length > 0 ? badges : [
    { icon: "🌱", label: "Squire in Training", cls: "badge-parchment", condition: true },
  ];

  return (
    <TiltCard className="full-width" intensity={3}>
      <div className="shimmer-sweep" />
      <div className="rune-label">Royal Dispatch</div>
      <div className="section-title"><span className="icon">📜</span>The Weekly Quest Log</div>

      <div className="quest-badges">
        {activeBadges.map((b) => (
          <div key={b.label} className={`fantasy-badge ${b.cls}`}>
            <span>{b.icon}</span><span>{b.label}</span>
          </div>
        ))}
      </div>

      <div className="rune-divider"><span className="rune-divider-icon">◆</span></div>

      <div className="log-entries">
        <div className="log-entry">
          <div className="log-entry-icon">📡</div>
          <div>
            <div className="log-entry-head">Kingdom Report</div>
            <div className="log-entry-body">{summary}</div>
          </div>
        </div>

        <div className="log-entry">
          <div className="log-entry-icon">🏰</div>
          <div>
            <div className="log-entry-head">War Council Advice</div>
            <div className="log-entry-body">{advice}</div>
          </div>
        </div>

        <div className="log-entry" style={{
          borderLeftColor: burnout >= 70 ? "var(--crimson-lit)" : "var(--gold)",
          background: burnout >= 70
            ? "linear-gradient(135deg, rgba(139,26,26,0.08), rgba(10,6,2,0.4))"
            : "linear-gradient(135deg, rgba(212,175,55,0.05), rgba(10,6,2,0.4))",
        }}>
          <div className="log-entry-icon">⚜️</div>
          <div>
            <div className="log-entry-head">Primary Mandate</div>
            <div className="log-entry-body" style={{
              color: burnout >= 70 ? "var(--crimson-lit)" : "var(--gold)",
              fontWeight: 600,
              textShadow: burnout >= 70 ? "0 0 8px rgba(196,30,58,0.3)" : "0 0 8px rgba(212,175,55,0.25)",
            }}>{focus}</div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
