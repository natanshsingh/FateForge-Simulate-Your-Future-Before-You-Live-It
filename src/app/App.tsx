import { useEffect, useRef, useState } from "react";
import { calculateScores } from "../lib/ml/loadModels";
import { runSimulation } from "../features/simulator/simulationEngine";
import { loadGameState, saveGameState } from "../lib/storage";
import {
  calculateXp,
  calculateLevel,
  getRank,
  getAchievements,
} from "../lib/gameEngine";

import HeroPanel from "../components/HeroPanel";
import StatsDashboard from "../components/StatsDashboard";
import MissionInput from "../components/MissionInput";
import WhatIfSimulator from "../components/WhatIfSimulator";
import FutureTimeline from "../components/FutureTimeline";
import CompareMode from "../components/CompareMode";
import WeeklyReport from "../components/WeeklyReport";
import AIGuide from "../components/AIGuide";
import EmberBackground from "../components/EmberBackground";
import CharacterForge, { type Character } from "../components/CharacterForge";
import RealityCheckPanel from "../components/RealityCheckPanel";
import AdvisorQuickActions from "../components/AdvisorQuickActions";
import BurnoutBossPanel from "../components/BurnoutBossPanel";

export type InputState = {
  study_hours: number;
  sleep_hours: number;
  screen_time: number;
  workout: number;
  mood: number;
  deep_work: number;
  streak: number;
};

type Toast = {
  id: number;
  message: string;
  type: "gold" | "purple" | "crimson" | "ember";
};

type SavedGameState = {
  screen: "forge" | "main";
  character: Character | null;
  scenario: string;
  input: InputState;
  compareA: InputState;
  compareB: InputState;
};

type OracleResult = {
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
  realityCheck?: string;
  threat?: "Low" | "Moderate" | "Severe" | "Critical";
};

type AdvisorResult = {
  title: string;
  verdict: string;
  primaryMandate: string;
  warCouncilAdvice: string;
  bottleneck: string;
  nextMoves: string[];
  danger: string;
  metricToTrack: string;
};

const DEFAULT_INPUT: InputState = {
  study_hours: 3,
  sleep_hours: 7,
  screen_time: 4,
  workout: 1,
  mood: 7,
  deep_work: 2,
  streak: 5,
};

const DEFAULT_COMPARE_A: InputState = {
  study_hours: 3,
  sleep_hours: 7,
  screen_time: 4,
  workout: 1,
  mood: 7,
  deep_work: 2,
  streak: 5,
};

const DEFAULT_COMPARE_B: InputState = {
  study_hours: 1,
  sleep_hours: 6,
  screen_time: 7,
  workout: 0,
  mood: 5,
  deep_work: 1,
  streak: 2,
};

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type}`}
          onClick={() => onDismiss(t.id)}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const saved = loadGameState<SavedGameState>();

  const [screen, setScreen] = useState<"forge" | "main">("forge");
  const [character, setCharacter] = useState<Character | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const [scenario, setScenario] = useState(
    saved?.scenario ??
      "What if I focus on business for 90 days but keep sleeping properly?"
  );

  const [input, setInput] = useState<InputState>(saved?.input ?? DEFAULT_INPUT);
  const [compareA, setCompareA] = useState<InputState>(
    saved?.compareA ?? DEFAULT_COMPARE_A
  );
  const [compareB, setCompareB] = useState<InputState>(
    saved?.compareB ?? DEFAULT_COMPARE_B
  );

  const [oracleResult, setOracleResult] = useState<OracleResult | null>(null);
  const [advisorResult, setAdvisorResult] = useState<AdvisorResult | null>(null);

  const baseScores = calculateScores(input);
  const fallbackResult: OracleResult = {
    bestCase: "",
    likelyCase: "",
    worstCase: "",
    confidence: 0,
    risk: "Low",
    nextStep: "",
    timeline: { day7: "", day30: "", day90: "" },
    threat: "Low", // Ensure threat is of the correct type
  };
  const result: OracleResult = oracleResult ?? fallbackResult;
  const activeScores = result.scores ?? baseScores;

  const scoreA = calculateScores(compareA);
  const scoreB = calculateScores(compareB);

  const xp = calculateXp(
    input,
    activeScores.consistency,
    activeScores.burnout,
    activeScores.growth
  );
  const level = calculateLevel(xp);
  const rank = getRank(character?.heroClass, level);
  const achievements = getAchievements(
    input,
    activeScores.consistency,
    activeScores.burnout,
    activeScores.growth
  );

  const prevScores = useRef(activeScores);

  function addToast(message: string, type: Toast["type"]) {
    const id = nextId.current++;
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  useEffect(() => {
    saveGameState({
      screen,
      character,
      scenario,
      input,
      compareA,
      compareB,
    });
  }, [screen, character, scenario, input, compareA, compareB]);

  useEffect(() => {
    const prev = prevScores.current;
    const threshold = 3;

    if (activeScores.consistency > prev.consistency + threshold) {
      addToast("Discipline Rising ⚔️", "gold");
    }
    if (activeScores.consistency < prev.consistency - threshold) {
      addToast("Discipline Wavering…", "ember");
    }
    if (activeScores.growth > prev.growth + threshold) {
      addToast("XP Gained ✨", "purple");
    }
    if (activeScores.burnout > prev.burnout + threshold) {
      addToast("Warning: Fatigue ⚠️", "crimson");
    }
    if (activeScores.burnout < prev.burnout - threshold) {
      addToast("Corruption Fading ✦", "gold");
    }

    prevScores.current = activeScores;
  }, [activeScores]);

  useEffect(() => {
    let active = true;

    async function fetchOracle() {
      if (active) setOracleResult(null);

      try {
        const res = await fetch("http://localhost:3001/api/whatif", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenario,
            player: input,
          }),
        });

        if (!res.ok) throw new Error("Oracle request failed");

        const data = (await res.json()) as OracleResult;
        console.log("oracle data", data);

        if (active) setOracleResult(data);
      } catch (err) {
        console.error("oracle error:", err);
        if (active) setOracleResult(null);
      }
    }

    fetchOracle();

    return () => {
      active = false;
    };
  }, [scenario, input]);

  useEffect(() => {
    console.log("oracleResult updated", oracleResult);
  }, [oracleResult]);

  useEffect(() => {
    let active = true;

    async function fetchAdvisor() {
      try {
        const res = await fetch("http://localhost:3001/api/advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenario,
            player: input,
          }),
        });

        if (!res.ok) throw new Error("Advisor request failed");

        const data = (await res.json()) as AdvisorResult;
        if (active) setAdvisorResult(data);
      } catch (err) {
        console.error("advisor error:", err);
        if (active) setAdvisorResult(null);
      }
    }

    fetchAdvisor();

    return () => {
      active = false;
    };
  }, [scenario, input]);

  const weeklySummary =
    activeScores.burnout >= 70
      ? "Your campaign is under strain. Fatigue is rising faster than recovery."
      : activeScores.consistency >= 75 && activeScores.growth >= 70
      ? "Your discipline is compounding into real momentum."
      : activeScores.consistency < 50
      ? "Your rhythm is unstable. Small missed habits are breaking momentum."
      : "Your path is forming, but it still needs consistency to hold.";

  const weeklyAdvice =
    activeScores.burnout >= 70
      ? "Pull back for 48 hours. Recover sleep, lower overload, then resume with structure."
      : activeScores.growth >= 80
      ? "Hold this routine steady for one more week before increasing difficulty."
      : input.screen_time >= 6
      ? "Cut distraction first. The fastest growth unlock is reclaiming focus time."
      : "Protect your streak and deepen one strong habit instead of chasing too many.";

  const momentum =
    activeScores.consistency * 0.35 +
    activeScores.growth * 0.45 -
    activeScores.burnout * 0.25;

  const futurePoints = [
    {
      day: "Day 7",
      value: Math.max(5, Math.min(100, Math.round(momentum + 8))),
    },
    {
      day: "Day 30",
      value: Math.max(10, Math.min(100, Math.round(momentum + 15))),
    },
    {
      day: "Day 90",
      value: Math.max(15, Math.min(100, Math.round(momentum + 24))),
    },
  ];

  if (screen === "forge") {
    return (
      <>
        <EmberBackground />
        <CharacterForge
          onComplete={(char) => {
            setCharacter(char);
            setScreen("main");
          }}
        />
      </>
    );
  }

  return (
    <>
      <EmberBackground />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="app app-enter">
        <HeroPanel
          consistency={activeScores.consistency}
          burnout={activeScores.burnout}
          growth={activeScores.growth}
          streak={input.streak}
          character={character}
          xp={xp}
          level={level}
          rank={rank}
          achievements={achievements}
        />

        <div className="page-grid">
          <StatsDashboard
            consistency={activeScores.consistency}
            burnout={activeScores.burnout}
            growth={activeScores.growth}
          />

          <MissionInput input={input} setInput={setInput} />

          <AdvisorQuickActions onSelect={(prompt) => setScenario(prompt)} />

          <WhatIfSimulator
            scenario={scenario}
            setScenario={setScenario}
            result={result}
          />

          <RealityCheckPanel
            confidence={result.confidence}
            risk={result.risk}
            realityCheck={result.realityCheck ?? "Unverified"}
            threat={result.threat ?? "Moderate"}
          />

          <FutureTimeline futurePoints={futurePoints} timeline={result.timeline} />

          <CompareMode
            compareA={compareA}
            setCompareA={setCompareA}
            compareB={compareB}
            setCompareB={setCompareB}
            scoreA={scoreA}
            scoreB={scoreB}
          />

          <WeeklyReport
            consistency={activeScores.consistency}
            burnout={activeScores.burnout}
            growth={activeScores.growth}
            summary={weeklySummary}
            advice={weeklyAdvice}
          />

          <BurnoutBossPanel
            burnout={activeScores.burnout}
            consistency={activeScores.consistency}
            nextStep={result.nextStep}
          />

          <AIGuide advisor={advisorResult} />
        </div>
      </div>
    </>
  );
}