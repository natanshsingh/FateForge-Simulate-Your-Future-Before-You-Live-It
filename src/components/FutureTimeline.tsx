import TiltCard from "./TiltCard";

type TimelineProps = {
  futurePoints: { day: string; value: number }[];
  timeline: { day7: string; day30: string; day90: string };
};

const PILLARS = [
  { fill: "linear-gradient(180deg, #D4AF37 0%, #8B6914 100%)", glow: "rgba(212,175,55,0.45)", gemColor: "#D4AF37", dayName: "Dawn's Trial" },
  { fill: "linear-gradient(180deg, #9B59B6 0%, #6C3483 100%)", glow: "rgba(155,89,182,0.45)", gemColor: "#9B59B6", dayName: "Month of Reckoning" },
  { fill: "linear-gradient(180deg, #C41E3A 0%, #7B0E1A 100%)", glow: "rgba(196,30,58,0.45)", gemColor: "#C41E3A", dayName: "The 90-Day Siege" },
];

export default function FutureTimeline({ futurePoints, timeline }: TimelineProps) {
  const descriptions = [timeline.day7, timeline.day30, timeline.day90];
  const maxValue = Math.max(...futurePoints.map((p) => p.value), 1);

  return (
    <TiltCard className="full-width" intensity={2}>
      <div className="shimmer-sweep" />
      <div className="rune-label">Kingdom Campaign Map</div>
      <div className="section-title"><span className="icon">🗺️</span>The Path of Destiny</div>

      <div style={{
        fontFamily: "'IM Fell English', serif",
        fontSize: 13,
        color: "var(--parchment-dim)",
        fontStyle: "italic",
        textAlign: "center",
        marginBottom: 8,
        lineHeight: 1.6,
      }}>
        Three milestones stand before you, knight. Each pillar marks a turn in fate.
      </div>

      <div className="journey-path">
        {futurePoints.map((point, i) => {
          const heightPct  = (point.value / maxValue) * 100;
          const pillar     = PILLARS[i];
          const barHeight  = Math.max(28, heightPct * 1.42);

          return (
            <div key={point.day} className="journey-node">
              <div className="journey-bar-wrap">
                <div
                  className="journey-bar"
                  style={{
                    height: `${barHeight}px`,
                    background: pillar.fill,
                    boxShadow: `0 0 22px ${pillar.glow}, 0 -4px 12px ${pillar.glow}`,
                    width: "58%",
                  }}
                >
                  <div className="journey-gem" style={{
                    borderColor: pillar.gemColor,
                    boxShadow: `0 0 12px ${pillar.glow}, 0 0 24px ${pillar.glow}`,
                  }} />
                </div>
              </div>
              <div className="journey-day" style={{ color: pillar.gemColor }}>{point.day}</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9.5, color: "var(--text-dim)", letterSpacing: "1px", textAlign: "center" }}>
                {pillar.dayName}
              </div>
              <div className="journey-pct" style={{ color: pillar.gemColor, fontFamily: "'Cinzel', serif", fontWeight: 700 }}>
                {point.value}%
              </div>
              <div className="journey-desc">{descriptions[i]}</div>
            </div>
          );
        })}
      </div>
    </TiltCard>
  );
}
