import TiltCard from "./TiltCard";

type AdvisorResult = {
  title: string;
  verdict: string;
  primaryMandate: string;
  warCouncilAdvice: string;
  bottleneck: string;
  nextMoves: string[];
  danger: string;
  metricToTrack: string;
} | null;

export default function AIGuide({ advisor }: { advisor: AdvisorResult }) {
  return (
    <TiltCard className="full-width" intensity={2}>
      <div className="shimmer-sweep" />
      <div className="rune-label">War Council</div>
      <div className="section-title">
        <span className="icon">🕯️</span>The Ancient Advisor
      </div>

      <div
        style={{
          display: "grid",
          gap: 14,
          border: "1px solid rgba(212,175,55,0.16)",
          background: "rgba(0,0,0,0.18)",
          borderRadius: 14,
          padding: 20,
        }}
      >
        <div>
          <div className="prophecy-tag" style={{ color: "var(--gold)" }}>
            {advisor?.title ?? "Seraphon — The Ancient Advisor"}
          </div>
          <div className="prophecy-text">
            {advisor?.verdict ?? "The advisor is consulting the realm..."}
          </div>
        </div>

        <div>
          <div className="prophecy-tag">Primary Mandate</div>
          <div className="prophecy-text">
            {advisor?.primaryMandate ?? "Awaiting instruction."}
          </div>
        </div>

        <div>
          <div className="prophecy-tag">War Council Advice</div>
          <div className="prophecy-text">
            {advisor?.warCouncilAdvice ?? "No counsel yet."}
          </div>
        </div>

        <div>
          <div className="prophecy-tag">Biggest Bottleneck</div>
          <div className="prophecy-text">
            {advisor?.bottleneck ?? "Unknown"}
          </div>
        </div>

        <div>
          <div className="prophecy-tag">3 Next Moves</div>
          <div className="prophecy-text">
            {advisor?.nextMoves?.map((move, i) => (
              <div key={i}>• {move}</div>
            )) ?? "No moves yet."}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div className="prophecy-tag" style={{ color: "var(--crimson-lit)" }}>
              Danger
            </div>
            <div className="prophecy-text">
              {advisor?.danger ?? "Unknown"}
            </div>
          </div>

          <div>
            <div className="prophecy-tag" style={{ color: "var(--gold)" }}>
              Metric To Track
            </div>
            <div className="prophecy-text">
              {advisor?.metricToTrack ?? "No metric selected"}
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}