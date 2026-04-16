import TiltCard from "./TiltCard";

const prompts = [
  "How do I get my first users in the next 30 days?",
  "What is my biggest bottleneck right now?",
  "What should I stop doing if I want traction?",
  "What one metric should I track this week?",
];

export default function AdvisorQuickActions({
  onSelect,
}: {
  onSelect: (prompt: string) => void;
}) {
  return (
    <TiltCard className="full-width" intensity={1}>
      <div className="rune-label">Business Mode</div>

      <div className="section-title">
        <span className="icon">📜</span>Quick Strategic Prompts
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
          marginTop: 12,
        }}
      >
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            style={{
              width: "100%",
              minHeight: 56,
              padding: "12px 14px",
              border: "1px solid rgba(212,175,55,0.28)",
              background: "rgba(212,175,55,0.06)",
              color: "var(--gold)",
              borderRadius: 12,
              textAlign: "left",
              fontFamily: "'Cinzel', serif",
              fontSize: 12,
              lineHeight: 1.45,
              cursor: "pointer",
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </TiltCard>
  );
}