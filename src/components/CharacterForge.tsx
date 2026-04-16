import { useState, type ReactNode } from "react";

export type Character = {
  name: string;
  heroClass: string;
  weapon: string;
  armor: string;
  aura: string;
  kingdom: string;
  title: string;
};

type Props = { onComplete: (c: Character) => void };

const CLASSES = [
  { id: "knight",   name: "Knight",   icon: "⚔️",  desc: "Master of steel",           color: "#D4AF37", stats: { str: 85, arc: 25, end: 75, agi: 55, lck: 40 } },
  { id: "mage",     name: "Mage",     icon: "🔮",  desc: "Wielder of arcane forces",   color: "#9B59B6", stats: { str: 30, arc: 90, end: 45, agi: 60, lck: 70 } },
  { id: "assassin", name: "Assassin", icon: "🗡️", desc: "Swift and shadowborn",       color: "#27AE60", stats: { str: 55, arc: 50, end: 50, agi: 90, lck: 75 } },
  { id: "paladin",  name: "Paladin",  icon: "✨",  desc: "Champion of light",          color: "#F0C040", stats: { str: 65, arc: 60, end: 70, agi: 50, lck: 80 } },
];

const WEAPONS = [
  { id: "longsword",  name: "Longsword",    icon: "🗡️" },
  { id: "staff",      name: "Arcane Staff", icon: "🔮" },
  { id: "daggers",    name: "Twin Daggers", icon: "⚡" },
  { id: "greatsword", name: "Greatsword",   icon: "⚔️" },
  { id: "bow",        name: "Elven Bow",    icon: "🏹" },
  { id: "spear",      name: "Dragon Spear", icon: "🔱" },
];

const ARMORS = [
  { id: "plate",       name: "Iron Plate",   icon: "🛡️" },
  { id: "robes",       name: "Arcane Robes", icon: "🌙" },
  { id: "leather",     name: "Dark Leather", icon: "🌑" },
  { id: "holy",        name: "Holy Armor",   icon: "☀️" },
  { id: "dragonscale", name: "Dragon Scale", icon: "🐉" },
  { id: "shadow",      name: "Shadow Cloak", icon: "👁️" },
];

const AURAS = [
  { id: "holy",   name: "Holy",   icon: "☀️", color: "#D4AF37" },
  { id: "ember",  name: "Ember",  icon: "🔥", color: "#E8622A" },
  { id: "arcane", name: "Arcane", icon: "✨", color: "#9B59B6" },
  { id: "shadow", name: "Shadow", icon: "🌑", color: "#5A4A9A" },
  { id: "frost",  name: "Frost",  icon: "❄️", color: "#5DADE2" },
  { id: "wild",   name: "Wild",   icon: "🌿", color: "#27AE60" },
];

const KINGDOMS = [
  { id: "iron",   name: "Iron Crown",     icon: "👑" },
  { id: "ember",  name: "Ember Vale",     icon: "🔥" },
  { id: "shadow", name: "Shadow Reach",   icon: "🌑" },
  { id: "dawn",   name: "Dawn's Bastion", icon: "☀️" },
  { id: "storm",  name: "Storm Peak",     icon: "⚡" },
  { id: "abyss",  name: "Abyss Depths",   icon: "🌊" },
];

const TITLES = [
  "The Unyielding", "The Relentless", "Oathkeeper",
  "The Forsaken",   "Ironheart",      "The Chosen",
  "Doomslayer",     "The Eternal",    "Voidborn", "The Swift",
];

type Tab = "weapon" | "armor" | "kingdom" | "title";

/* ─── Mini stat bar ─── */
function MiniBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8.5, letterSpacing: "2px", color: "var(--text-muted)", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 4, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.04)", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${value}%`,
          background: `linear-gradient(90deg, ${color}60, ${color})`,
          boxShadow: `0 0 8px ${color}77`,
          transition: "width 0.9s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>
    </div>
  );
}

/* ─── Forge crest (animated, floating) ─── */
function ForgeCrest({ color }: { color: string }) {
  return (
    <div className="fc-crest-wrap">
      <div className="fc-ring-outer" style={{ borderColor: `${color}30` }}>
        {["t","b","l","r"].map(p => (
          <div key={p} className={`fc-gem fc-gem-${p}`} style={{ background: color, boxShadow: `0 0 8px ${color}90` }} />
        ))}
      </div>
      <div className="fc-ring-mid" style={{ borderColor: `${color}20` }} />
      <div className="fc-ring-inner" style={{
        borderColor: `${color}70`,
        boxShadow: `0 0 28px ${color}50, 0 0 64px ${color}20, inset 0 0 40px rgba(0,0,0,0.85)`,
        background: `radial-gradient(circle at 38% 32%, ${color}1C, #0c0603)`,
        transition: "all 0.6s ease",
      }}>
        <svg width="62" height="76" viewBox="0 0 62 76" fill="none">
          <path d="M31 4L59 17L59 43Q59 66 31 74Q3 66 3 43L3 17Z"
            stroke={color} strokeWidth="1.4"
            fill={`${color}14`}
            style={{ filter: `drop-shadow(0 0 5px ${color}88)`, transition: "all 0.6s ease" }}
          />
          <path d="M31 11L53 22L53 43Q53 62 31 70Q9 62 9 43L9 22Z"
            stroke={`${color}38`} strokeWidth="0.9" fill="none" />
          <line x1="31" y1="22" x2="31" y2="60" stroke={color} strokeWidth="1.4"/>
          <line x1="20" y1="41" x2="42" y2="41" stroke={color} strokeWidth="1.4"/>
          <circle cx="31" cy="41" r="3.5" fill={`${color}55`} stroke={color} strokeWidth="1"/>
          {[22,60,20,42].map((v, i) => (
            <circle key={i} cx={i < 2 ? 31 : v} cy={i < 2 ? v : 41} r="1.8" fill={color} opacity="0.7" />
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ─── Small option button ─── */
function OptionBtn({ icon, name, selected, accent, onClick }: {
  icon: string; name: string; selected: boolean; accent: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        padding: "10px 6px",
        border: `1px solid ${selected ? `${accent}70` : "rgba(58,48,40,0.65)"}`,
        borderTop: `1.5px solid ${selected ? accent : "rgba(212,175,55,0.14)"}`,
        background: selected ? `${accent}14` : "rgba(10,6,3,0.7)",
        color: selected ? accent : "var(--text-muted)",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: selected ? `0 0 12px ${accent}28` : "none",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8.5, letterSpacing: "1px", textTransform: "uppercase", lineHeight: 1.2 }}>{name}</span>
    </button>
  );
}

/* ─── Forge section wrapper ─── */
function Ctrl({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="fc-ctrl-label">{label}</div>
      {children}
    </div>
  );
}

export default function CharacterForge({ onComplete }: Props) {
  const [forge, setForge] = useState<Character>({
    name: "", heroClass: "knight", weapon: "longsword",
    armor: "plate", aura: "holy", kingdom: "iron", title: "The Unyielding",
  });
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("weapon");
  const [nameError, setNameError] = useState(false);
  const [exiting, setExiting] = useState(false);

  const selClass   = CLASSES.find(c => c.id === forge.heroClass)!;
  const selAura    = AURAS.find(a => a.id === forge.aura)!;
  const selWeapon  = WEAPONS.find(w => w.id === forge.weapon)!;
  const selArmor   = ARMORS.find(a => a.id === forge.armor)!;
  const selKingdom = KINGDOMS.find(k => k.id === forge.kingdom)!;
  const auraColor  = selAura.color;
  const displayName = forge.name.trim() || "Your Hero";

  function set<K extends keyof Character>(key: K, val: Character[K]) {
    setForge(p => ({ ...p, [key]: val }));
    if (key === "name") setNameError(false);
  }

  function handleEnter() {
    if (!forge.name.trim()) { setNameError(true); return; }
    setExiting(true);
    setTimeout(() => onComplete(forge), 650);
  }

  const TABS: { id: Tab; label: string; items: typeof WEAPONS; selKey: keyof Character }[] = [
    { id: "weapon",  label: "⚔️ Weapon",  items: WEAPONS,   selKey: "weapon" },
    { id: "armor",   label: "🛡️ Armor",    items: ARMORS,    selKey: "armor" },
    { id: "kingdom", label: "🏰 Kingdom",  items: KINGDOMS,  selKey: "kingdom" },
    { id: "title",   label: "📜 Title",    items: TITLES.map(t => ({ id: t, name: t, icon: "◆" })), selKey: "title" },
  ];

  return (
    <div className={`fc-screen ${exiting ? "forge-screen-exit" : "forge-screen-enter"}`}>

      {/* ── TOPBAR ── */}
      <div className="fc-topbar">
        <span className="fc-topbar-ornament">◆</span>
        <span className="fc-topbar-brand">Life Simulator OS</span>
        <span className="fc-topbar-sep">—</span>
        <span className="fc-topbar-subtitle">Character Forge</span>
        <span className="fc-topbar-ornament">◆</span>
      </div>

      {/* ── MAIN 2-COL ── */}
      <div className="fc-main">

        {/* LEFT: Controls */}
        <div className="fc-left">

          <h1 className="fc-title gold-shimmer-text">Who Are You,<br/>Knight?</h1>
          <p className="fc-tagline">Forge your legend before your story is written.</p>

          {/* Name */}
          <input
            className={`fc-name-input ${nameError ? "forge-name-error" : ""}`}
            placeholder="Enter your hero's name..."
            value={forge.name}
            onChange={e => set("name", e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleEnter()}
            maxLength={32}
            autoFocus
          />
          {nameError && (
            <div style={{ marginTop: -10, marginBottom: 10, fontFamily: "'Cinzel', serif", fontSize: 9.5, color: "var(--crimson-lit)", letterSpacing: "1px" }}>
              ⚠ A hero must have a name.
            </div>
          )}

          {/* Class */}
          <Ctrl label="Choose Class">
            <div className="fc-class-grid">
              {CLASSES.map(cls => {
                const sel = forge.heroClass === cls.id;
                return (
                  <button
                    key={cls.id}
                    className="fc-class-btn"
                    style={{
                      borderColor: sel ? `${cls.color}70` : "rgba(58,48,40,0.65)",
                      borderTop: `2px solid ${sel ? cls.color : "rgba(212,175,55,0.12)"}`,
                      background: sel ? `${cls.color}14` : "rgba(10,6,3,0.7)",
                      boxShadow: sel ? `0 0 20px ${cls.color}28` : "none",
                    }}
                    onClick={() => set("heroClass", cls.id)}
                  >
                    <span className="fc-class-icon" style={{
                      background: sel ? `${cls.color}22` : "rgba(0,0,0,0.3)",
                      borderColor: sel ? `${cls.color}50` : "rgba(58,48,40,0.5)",
                    }}>{cls.icon}</span>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div className="fc-class-name" style={{ color: sel ? cls.color : "var(--parchment)" }}>{cls.name}</div>
                      <div className="fc-class-desc">{cls.desc}</div>
                    </div>
                    {sel && <span style={{ color: cls.color, fontSize: 10 }}>◆</span>}
                  </button>
                );
              })}
            </div>
          </Ctrl>

          {/* Aura */}
          <Ctrl label="Select Aura">
            <div className="fc-aura-row">
              {AURAS.map(a => {
                const sel = forge.aura === a.id;
                return (
                  <button
                    key={a.id}
                    className="fc-aura-btn"
                    title={a.name}
                    style={{
                      background: `radial-gradient(circle, ${a.color}AA, ${a.color}66)`,
                      borderColor: sel ? "rgba(255,255,255,0.75)" : "transparent",
                      boxShadow: sel ? `0 0 14px ${a.color}AA, 0 0 28px ${a.color}44` : `0 0 0px ${a.color}00`,
                      transform: sel ? "scale(1.2)" : "scale(1)",
                    }}
                    onClick={() => set("aura", a.id)}
                  >
                    <span style={{ fontSize: 16 }}>{a.icon}</span>
                  </button>
                );
              })}
            </div>
          </Ctrl>

          {/* CTA */}
          <button
            className="fc-enter-btn"
            style={{
              borderColor: forge.name.trim() ? `${auraColor}80` : "var(--gold-dim)",
              boxShadow: forge.name.trim() ? `0 0 28px ${auraColor}2A, 0 8px 30px rgba(0,0,0,0.5)` : "0 6px 24px rgba(0,0,0,0.4)",
            }}
            onClick={handleEnter}
          >
            <span>⚔️</span>
            <span>Enter the Realm</span>
            <span>⚔️</span>
          </button>

          {/* More options toggle */}
          <button className="fc-more-toggle" onClick={() => setExpanded(p => !p)}>
            {expanded ? "▲" : "▼"} &nbsp;
            {expanded ? "Hide options" : "Customize weapon, armor, kingdom & title"}
          </button>

        </div>

        {/* RIGHT: Visual */}
        <div className="fc-right">
          <div className="fc-visual" style={{ borderColor: `${auraColor}40` }}>
            <div className="fc-visual-accent-top" style={{
              background: `linear-gradient(90deg, transparent, ${auraColor}, transparent)`,
            }} />

            <ForgeCrest color={auraColor} />

            <div className="fc-preview-name">{displayName}</div>

            <div className="fc-preview-meta">
              <span className="fc-preview-class" style={{ color: selClass.color, borderColor: `${selClass.color}44`, background: `${selClass.color}14` }}>
                {selClass.icon} {selClass.name}
              </span>
              <span className="fc-preview-title">
                {forge.title}
              </span>
            </div>

            <div className="fc-preview-equip">
              {selWeapon.icon} {selWeapon.name}
              <span style={{ color: "var(--text-dim)", margin: "0 6px" }}>◆</span>
              {selArmor.icon} {selArmor.name}
            </div>

            <div className="fc-preview-kingdom">
              {selKingdom.icon} {selKingdom.name}
            </div>

            <div className="fc-stat-bars">
              {[
                { label: "Strength",  val: selClass.stats.str },
                { label: "Arcane",    val: selClass.stats.arc },
                { label: "Endurance", val: selClass.stats.end },
                { label: "Agility",   val: selClass.stats.agi },
                { label: "Fortune",   val: selClass.stats.lck },
              ].map(s => <MiniBar key={s.label} label={s.label} value={s.val} color={auraColor} />)}
            </div>

            <div className="fc-visual-accent-bottom" style={{
              background: `linear-gradient(90deg, transparent, ${auraColor}60, transparent)`,
            }} />
          </div>
        </div>

      </div>

      {/* ── EXPANDABLE OPTIONS ── */}
      <div className={`fc-expandable ${expanded ? "fc-expandable-open" : ""}`}>
        <div className="fc-tab-bar">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`fc-tab-btn ${activeTab === t.id ? "fc-tab-active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="fc-tab-content">
          {TABS.map(t => activeTab === t.id && (
            <div key={t.id} className="fc-option-grid">
              {t.items.map((item: { id: string; name: string; icon: string }) => (
                <OptionBtn
                  key={item.id}
                  icon={item.icon}
                  name={item.name}
                  selected={forge[t.selKey] === item.id}
                  accent={selClass.color}
                  onClick={() => set(t.selKey, item.id)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
