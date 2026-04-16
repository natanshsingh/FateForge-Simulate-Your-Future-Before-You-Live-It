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

type MissionInputProps = {
  input: InputState;
  setInput: Dispatch<SetStateAction<InputState>>;
};

type FieldConfig = {
  key: keyof InputState;
  label: string;
  icon: string;
  min: number;
  max: number;
  step: number;
  questName: string;
};

const FIELDS: FieldConfig[] = [
  { key: "study_hours",  label: "Study Hours",  icon: "📖", min: 0,  max: 12,  step: 0.5, questName: "Tome of Knowledge" },
  { key: "sleep_hours",  label: "Sleep Hours",  icon: "🌙", min: 0,  max: 12,  step: 0.5, questName: "Rest at the Inn" },
  { key: "screen_time",  label: "Screen Time",  icon: "🔮", min: 0,  max: 16,  step: 0.5, questName: "Mirror of Distraction" },
  { key: "workout",      label: "Training",     icon: "⚔️",  min: 0,  max: 1,   step: 1,   questName: "Combat Drill" },
  { key: "mood",         label: "Morale",       icon: "🔱",  min: 1,  max: 10,  step: 1,   questName: "Spirit of the Warrior" },
  { key: "deep_work",    label: "Deep Work",    icon: "🗡️",  min: 0,  max: 8,   step: 0.5, questName: "Forge of Focus" },
  { key: "streak",       label: "Streak Days",  icon: "🔥",  min: 0,  max: 365, step: 1,   questName: "Unbroken Oath" },
];

export default function MissionInput({ input, setInput }: MissionInputProps) {
  function update(key: keyof InputState, delta: number, min: number, max: number, step: number) {
    setInput((prev) => {
      const raw = Math.round((prev[key] + delta) / step) * step;
      return { ...prev, [key]: Math.max(min, Math.min(max, parseFloat(raw.toFixed(2)))) };
    });
  }

  return (
    <TiltCard>
      <div className="shimmer-sweep" />
      <div className="rune-label">Quest Board</div>
      <div className="section-title"><span className="icon">📋</span>Daily Quests</div>

      <div style={{
        fontFamily: "'IM Fell English', serif",
        fontSize: 13,
        color: "var(--parchment-dim)",
        fontStyle: "italic",
        marginBottom: 20,
        padding: "10px 16px",
        background: "rgba(0,0,0,0.25)",
        borderLeft: "2px solid var(--gold-dim)",
        lineHeight: 1.6,
      }}>
        Set your daily disciplines, knight. Each stat shapes your destiny.
      </div>

      <div className="quest-input-grid">
        {FIELDS.map(({ key, label, icon, min, max, step, questName }) => (
          <div key={key} className="quest-field">
            <div className="quest-field-label">{icon} {label}</div>
            <div className="quest-field-subname">{questName}</div>
            <div className="quest-field-controls">
              <button className="quest-btn" onClick={() => update(key, -step, min, max, step)}>−</button>
              <div className="quest-value">{input[key]}</div>
              <button className="quest-btn" onClick={() => update(key, +step, min, max, step)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </TiltCard>
  );
}
