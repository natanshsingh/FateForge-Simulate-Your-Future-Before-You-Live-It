import type { Character } from "./CharacterForge";

type HeroPanelProps = {
  consistency: number;
  burnout: number;
  growth: number;
  streak: number;
  xp: number;
  level: number;
  rank: string;
  achievements?: string[];
  character?: Character | null;
};

const AURA_COLORS: Record<string, { color: string; glow: string }> = {
  ember: { color: "#E8622A", glow: "rgba(232,98,42,0.55)" },
  arcane: { color: "#9B59B6", glow: "rgba(155,89,182,0.55)" },
  shadow: { color: "#6A5A9A", glow: "rgba(106,90,154,0.5)" },
  holy: { color: "#D4AF37", glow: "rgba(212,175,55,0.55)" },
  frost: { color: "#5DADE2", glow: "rgba(93,173,226,0.5)" },
  wild: { color: "#27AE60", glow: "rgba(39,174,96,0.5)" },
};

const CLASS_ICONS: Record<string, string> = {
  knight: "⚔️",
  mage: "🔮",
  assassin: "🗡️",
  paladin: "✨",
};

const CLASS_COLORS: Record<string, string> = {
  knight: "#D4AF37",
  mage: "#9B59B6",
  assassin: "#27AE60",
  paladin: "#F0C040",
};

function getStatusBadge(consistency: number, burnout: number, growth: number) {
  if (burnout >= 75) return { label: "Overburdened", cls: "badge-crimson" };
  if (consistency >= 82 && burnout <= 30) return { label: "Battle Ready", cls: "badge-gold" };
  if (growth >= 80) return { label: "Ascendant", cls: "badge-ember" };
  if (consistency >= 65) return { label: "Steadfast", cls: "badge-silver" };
  if (burnout <= 25) return { label: "Recovered", cls: "badge-gold" };
  return { label: "In Training", cls: "badge-parchment" };
}

function getXpIntoLevel(xp: number) {
  return xp % 120;
}

function getXpNeededForNextLevel() {
  return 120;
}

function getHeroTitle(character?: Character | null, rank?: string) {
  if (!character) return "Forge your future before you live it.";
  return `${character.title} • ${rank}`;
}

function HeroCrest({
  color,
  glow,
  burnout,
}: {
  color: string;
  glow: string;
  burnout: number;
}) {
  const danger = burnout >= 70;
  const activeColor = danger ? "#C41E3A" : color;
  const activeGlow = danger ? "rgba(196,30,58,0.6)" : glow;

  return (
    <div className="hero-crest">
      <div className="crest-ring-outer" style={{ borderColor: `${activeColor}30` }} />
      <div className="crest-ring-mid" style={{ borderColor: `${activeColor}20` }} />
      <div
        className="crest-inner"
        style={{
          borderColor: `${activeColor}80`,
          boxShadow: `0 0 25px ${activeGlow}, 0 0 60px ${activeColor}20, inset 0 0 35px rgba(0,0,0,0.85)`,
          background: `radial-gradient(circle at 38% 32%, ${activeColor}18, #0c0703)`,
          transition: "all 1s ease",
        }}
      >
        <svg className="crest-svg" viewBox="0 0 60 72" fill="none">
          <path
            d="M30 3 L57 15 L57 40 Q57 62 30 70 Q3 62 3 40 L3 15 Z"
            stroke={activeColor}
            strokeWidth="1.2"
            fill={`${activeColor}14`}
            style={{ transition: "all 1s ease", filter: `drop-shadow(0 0 4px ${activeGlow})` }}
          />
          <path
            d="M30 9 L51 19 L51 40 Q51 58 30 65 Q9 58 9 40 L9 19 Z"
            stroke={`${activeColor}40`}
            strokeWidth="0.8"
            fill="none"
          />
          <line x1="30" y1="20" x2="30" y2="56" stroke={activeColor} strokeWidth="1.2" />
          <line x1="20" y1="34" x2="40" y2="34" stroke={activeColor} strokeWidth="1.2" />
          <circle cx="30" cy="34" r="3" fill={`${activeColor}55`} stroke={activeColor} strokeWidth="0.8" />
          <circle cx="30" cy="22" r="1.5" fill={activeColor} opacity="0.7" />
          <circle cx="30" cy="48" r="1.5" fill={activeColor} opacity="0.7" />
          <circle cx="22" cy="34" r="1.5" fill={activeColor} opacity="0.7" />
          <circle cx="38" cy="34" r="1.5" fill={activeColor} opacity="0.7" />
          {danger && <path d="M30 16 L33 28 L30 32 L27 28 Z" fill="#C41E3A" opacity="0.7" />}
        </svg>
      </div>
    </div>
  );
}

export default function HeroPanel({
  consistency,
  burnout,
  growth,
  streak,
  xp,
  level,
  rank,
  achievements = [],
  character,
}: HeroPanelProps) {
  const statusBadge = getStatusBadge(consistency, burnout, growth);
  const aura = AURA_COLORS[character?.aura || "holy"];
  const heroName = character?.name || "Hero's Chronicle";
  const heroClass = character?.heroClass || "knight";
  const classColor = CLASS_COLORS[heroClass] || "#D4AF37";
  const xpIntoLevel = getXpIntoLevel(xp);
  const xpNeeded = getXpNeededForNextLevel();
  const xpPercent = Math.max(0, Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)));
  const shownAchievements = achievements.slice(0, 3);

  return (
    <div className="hero-panel">
      <div className="hero-inner">
        <HeroCrest color={aura.color} glow={aura.glow} burnout={burnout} />

        <div className="hero-info">
          <div className="hero-eyebrow">Life Simulator OS</div>
          <div className="hero-title gold-shimmer-text">{heroName}</div>

          {character ? (
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
              <span
                className="fantasy-badge badge-gold"
                style={{
                  color: classColor,
                  borderColor: `${classColor}44`,
                  background: `${classColor}12`,
                }}
              >
                {CLASS_ICONS[heroClass]} {heroClass.charAt(0).toUpperCase() + heroClass.slice(1)}
              </span>

              <span
                style={{
                  fontFamily: "'IM Fell English', serif",
                  fontSize: 13,
                  color: "var(--parchment-dim)",
                  fontStyle: "italic",
                }}
              >
                {getHeroTitle(character, rank)}
              </span>

              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 10,
                  color: "var(--text-muted)",
                  letterSpacing: "1px",
                }}
              >
                · {character.kingdom.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          ) : (
            <div className="hero-subtitle">Forge your future before you live it.</div>
          )}

          <div className="hero-stats-row">
            <div className="hero-stat-block">
              <span className="hero-stat-val">LV {level}</span>
              <span className="hero-stat-key">Level</span>
            </div>

            <div className="hero-stat-sep" />

            <div className="hero-stat-block">
              <span className="hero-stat-val">{xp}</span>
              <span className="hero-stat-key">Total XP</span>
            </div>

            <div className="hero-stat-sep" />

            <div className="hero-stat-block">
              <span className="hero-stat-val">{streak}</span>
              <span className="hero-stat-key">Streak</span>
            </div>

            <div className="hero-stat-sep" />

            <span className={`fantasy-badge ${statusBadge.cls}`}>◆ {statusBadge.label}</span>
          </div>

          {shownAchievements.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
              {shownAchievements.map((achievement) => (
                <span key={achievement} className="fantasy-badge badge-silver">
                  ✦ {achievement}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="hero-right">
          <div className="rank-tablet">
            <div className="rank-eyebrow">Current Rank</div>
            <div
              className="rank-name"
              style={{ color: classColor, textShadow: `0 0 12px ${classColor}55` }}
            >
              {rank}
            </div>
          </div>

          <div className="rank-tablet" style={{ borderColor: "rgba(58,48,40,0.6)", marginTop: 6 }}>
            <div className="rank-eyebrow">State</div>
            <div className="rank-name" style={{ fontSize: 12, color: "var(--silver)" }}>
              {burnout >= 70
                ? "High danger"
                : consistency >= 75 && burnout <= 35
                ? "Compounding"
                : growth >= 70
                ? "Rising fast"
                : "Still forming"}
            </div>
          </div>

          <div className="xp-bar-wrap">
            <div className="xp-bar-labels">
              <span>Next Level</span>
              <span>
                {xpIntoLevel} / {xpNeeded}
              </span>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}