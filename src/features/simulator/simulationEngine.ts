import { calculateScores } from "../../lib/ml/loadModels";
import type { SimulationOutput } from "../../types/simulation";

export type SimulatorInput = {
  scenario: string;
  study_hours: number;
  sleep_hours: number;
  screen_time: number;
  workout: number;
  mood: number;
  deep_work: number;
  streak: number;
};

type ScenarioCategory =
  | "study"
  | "fitness"
  | "career"
  | "business"
  | "productivity"
  | "recovery"
  | "general";

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function detectScenarioCategory(scenario: string): ScenarioCategory {
  const text = scenario.toLowerCase();

  if (
    text.includes("startup") ||
    text.includes("business") ||
    text.includes("ads") ||
    text.includes("sales") ||
    text.includes("hire") ||
    text.includes("product") ||
    text.includes("revenue") ||
    text.includes("customer")
  ) {
    return "business";
  }

  if (
    text.includes("study") ||
    text.includes("exam") ||
    text.includes("learn") ||
    text.includes("coding") ||
    text.includes("revision") ||
    text.includes("college")
  ) {
    return "study";
  }

  if (
    text.includes("gym") ||
    text.includes("fitness") ||
    text.includes("workout") ||
    text.includes("exercise") ||
    text.includes("muscle") ||
    text.includes("run")
  ) {
    return "fitness";
  }

  if (
    text.includes("job") ||
    text.includes("career") ||
    text.includes("freelance") ||
    text.includes("internship") ||
    text.includes("mba")
  ) {
    return "career";
  }

  if (
    text.includes("recovery") ||
    text.includes("rest") ||
    text.includes("heal") ||
    text.includes("sleep more") ||
    text.includes("reset") ||
    text.includes("burnout")
  ) {
    return "recovery";
  }

  if (
    text.includes("focus") ||
    text.includes("routine") ||
    text.includes("discipline") ||
    text.includes("productivity") ||
    text.includes("screen time") ||
    text.includes("deep work")
  ) {
    return "productivity";
  }

  return "general";
}

function getRiskLabel(
  burnout: number,
  consistency: number,
  sleepHours: number,
  screenTime: number
): "Low" | "Medium" | "High" {
  if (
    burnout >= 70 ||
    sleepHours < 6 ||
    (burnout >= 55 && consistency < 45) ||
    screenTime >= 8
  ) {
    return "High";
  }

  if (burnout <= 30 && consistency >= 60 && sleepHours >= 7 && screenTime <= 4) {
    return "Low";
  }

  return "Medium";
}

function getConfidence(
  consistency: number,
  growth: number,
  burnout: number,
  streak: number
) {
  const raw =
    52 +
    consistency * 0.22 +
    growth * 0.24 +
    streak * 1.8 -
    burnout * 0.18;

  return clamp(Math.round(raw), 55, 96);
}

function getMomentumScore(
  consistency: number,
  growth: number,
  burnout: number,
  mood: number,
  streak: number
) {
  return clamp(
    Math.round(
      consistency * 0.35 +
        growth * 0.4 +
        mood * 2 +
        streak * 1.5 -
        burnout * 0.3
    )
  );
}

function getOutcomeTier(momentum: number): "collapse" | "fragile" | "stable" | "surging" {
  if (momentum < 35) return "collapse";
  if (momentum < 55) return "fragile";
  if (momentum < 75) return "stable";
  return "surging";
}

function getTimeline(
  category: ScenarioCategory,
  momentum: number,
  growth: number,
  consistency: number,
  burnout: number
) {
  const tier = getOutcomeTier(momentum);

  if (category === "study") {
    return {
      day7:
        tier === "collapse"
          ? "Your study plan feels heavy early, and fatigue starts breaking focus."
          : tier === "fragile"
          ? "You begin the routine, but consistency still feels unstable."
          : "Your study rhythm starts settling into a reliable pattern.",
      day30:
        tier === "surging"
          ? "Retention, output, and confidence improve noticeably."
          : tier === "stable"
          ? "You build visible academic momentum with steady gains."
          : "Progress appears, but inconsistency limits compounding.",
      day90:
        growth >= 78 && burnout < 45
          ? "This path can produce a major academic leap with strong long-term carryover."
          : "Long-term gains remain possible, but only if discipline stays protected.",
    };
  }

  if (category === "fitness") {
    return {
      day7:
        tier === "collapse"
          ? "You start aggressively, but recovery cracks appear almost immediately."
          : "Your body begins adapting to the new training rhythm.",
      day30:
        tier === "surging"
          ? "Strength, confidence, and energy become noticeably better."
          : tier === "stable"
          ? "You see gradual but believable physical improvement."
          : "Some progress appears, but inconsistency slows visible results.",
      day90:
        burnout < 45
          ? "A real transformation becomes realistic if recovery stays strong."
          : "Results are possible, but burnout may quietly flatten progress.",
    };
  }

  if (category === "career") {
    return {
      day7:
        tier === "collapse"
          ? "You feel busy, but not enough meaningful execution happens."
          : "Your direction becomes clearer and your effort starts aligning.",
      day30:
        consistency >= 60
          ? "Execution starts creating visible momentum and skill positioning."
          : "You remain interested, but hesitation reduces impact.",
      day90:
        tier === "surging"
          ? "This path can compound into serious opportunity and leverage."
          : "The upside exists, but your execution quality must improve to unlock it.",
    };
  }

  if (category === "business") {
    return {
      day7:
        burnout >= 65
          ? "Excitement is high, but energy strain appears faster than expected."
          : "Early signals appear as you test whether effort is creating real traction.",
      day30:
        tier === "surging"
          ? "The system starts showing traction, learning loops, and clearer strategic direction."
          : tier === "stable"
          ? "You gain useful clarity, but execution discipline still decides outcomes."
          : "You risk confusing motion with traction unless priorities tighten.",
      day90:
        consistency >= 65 && burnout < 55
          ? "This can compound into meaningful business momentum if you stay focused on the highest-leverage actions."
          : "The idea still has upside, but scattered execution or burnout may choke growth.",
    };
  }

  if (category === "productivity") {
    return {
      day7:
        burnout >= 65
          ? "You notice how overloaded your system really is."
          : "You begin identifying time leaks and reclaiming control.",
      day30:
        consistency >= 60
          ? "Your routine becomes smoother, cleaner, and more intentional."
          : "You improve slightly, but old distraction patterns still interfere.",
      day90:
        growth >= 70 && burnout < 50
          ? "This can evolve into a true high-performance operating system."
          : "Sustainable improvement is possible, but your foundations need tightening.",
    };
  }

  if (category === "recovery") {
    return {
      day7: "Your nervous system begins settling as pressure reduces.",
      day30:
        burnout < 50
          ? "Energy and clarity start returning in a believable way."
          : "Recovery begins, but full restoration still needs patience.",
      day90:
        consistency >= 55
          ? "You rebuild from a stronger foundation with lower relapse risk."
          : "Recovery is possible, but lasting change still depends on routine protection.",
    };
  }

  return {
    day7: "Small changes begin shaping your trajectory.",
    day30: "Your direction becomes more visible as patterns repeat.",
    day90: "Long-term outcomes start compounding from your consistency and recovery.",
  };
}

function generateCaseTexts(
  category: ScenarioCategory,
  consistency: number,
  burnout: number,
  growth: number,
  momentum: number
) {
  const tier = getOutcomeTier(momentum);

  if (category === "study") {
    return {
      bestCase:
        tier === "surging"
          ? "You enter a compounding study loop: stronger focus, deeper retention, and visible academic growth."
          : "You build a dependable study system and improve steadily.",
      likelyCase:
        consistency >= 60
          ? "You make real progress over the next few weeks if you protect the routine."
          : "You improve in bursts, but inconsistency keeps slowing your climb.",
      worstCase:
        burnout >= 65
          ? "You force intensity too early, mental fatigue rises, and the routine collapses."
          : "You begin well but lose momentum when friction builds.",
      nextStep:
        burnout >= 65
          ? "Restore sleep and lower the pressure before increasing study volume."
          : consistency < 60
          ? "Cut the target slightly and protect a 7-day streak first."
          : "Hold this rhythm for one week before scaling difficulty.",
    };
  }

  if (category === "fitness") {
    return {
      bestCase:
        "You create a sustainable training loop that improves energy, confidence, and physical momentum.",
      likelyCase:
        consistency >= 60
          ? "You improve gradually if recovery and repetition stay intact."
          : "You see some results, but missed sessions slow the transformation.",
      worstCase:
        burnout >= 65
          ? "You overtrain, under-recover, and lose adherence."
          : "You rely on motivation instead of structure and fade out.",
      nextStep:
        burnout >= 65
          ? "Reduce intensity and make recovery non-negotiable."
          : "Keep the workouts repeatable enough to survive low-motivation days.",
    };
  }

  if (category === "career") {
    return {
      bestCase:
        "You convert effort into leverage by repeatedly executing on one direction instead of scattering energy.",
      likelyCase:
        consistency >= 60
          ? "You create real momentum as focused execution compounds."
          : "You gain clarity, but hesitation and switching reduce payoff.",
      worstCase:
        burnout >= 65
          ? "You chase too many priorities and your execution quality fractures."
          : "You stay interested in growth but never sustain enough action to break through.",
      nextStep:
        consistency < 60
          ? "Choose one track and commit to a focused 14-day sprint."
          : "Review outputs weekly and double down only on what compounds.",
    };
  }

  if (category === "business") {
    return {
      bestCase:
        "You stop guessing, focus on the highest-leverage actions, and begin building real traction instead of noise.",
      likelyCase:
        burnout < 60 && consistency >= 60
          ? "You learn quickly, tighten execution, and improve strategic clarity over time."
          : "You move forward, but weak prioritization or energy leaks limit compounding.",
      worstCase:
        burnout >= 65
          ? "You confuse intensity with progress, make reactive decisions, and drain execution quality."
          : "You spread effort across too many ideas and fail to create meaningful traction.",
      nextStep:
        burnout >= 65
          ? "Reduce decision noise. Sleep, simplify priorities, and focus on one core growth lever."
          : "Track one metric, one bottleneck, and one next move for the next 7 days.",
    };
  }

  if (category === "productivity") {
    return {
      bestCase:
        "You build a repeatable operating system with better focus, more energy, and higher output.",
      likelyCase:
        consistency >= 60
          ? "You become more intentional and reduce wasted effort each week."
          : "You improve slightly, but distraction patterns still weaken your output.",
      worstCase:
        burnout >= 65
          ? "You try to optimize everything at once and create friction instead of momentum."
          : "You fall back into reactive habits after a short burst of motivation.",
      nextStep:
        consistency < 60
          ? "Remove one major distraction before adding more systems."
          : "Stabilize your routine before layering extra optimization.",
    };
  }

  if (category === "recovery") {
    return {
      bestCase:
        "You recover intelligently, lower your burnout, and rebuild from a stronger base instead of forcing more output.",
      likelyCase:
        "You regain clarity and energy if you stay patient and consistent with recovery.",
      worstCase:
        "You mistake temporary rest for full recovery and return to overload too soon.",
      nextStep:
        "Protect sleep, lower pressure, and rebuild capacity before chasing intensity again.",
    };
  }

  return {
    bestCase:
      "You build enough consistency for this choice to become a real source of momentum.",
    likelyCase:
      consistency >= 60
        ? "You make useful progress if you stay disciplined over time."
        : "You move forward, but results stay fragile without routine stability.",
    worstCase:
      burnout >= 65
        ? "You push too hard, lose balance, and break the system."
        : "You start well, but fail to sustain momentum long enough for results to compound.",
    nextStep:
      consistency < 60
        ? "Lower difficulty slightly and protect consistency first."
        : "Keep the routine stable before increasing pressure.",
  };
}

export function runSimulation(input: SimulatorInput): SimulationOutput & {
  timeline: {
    day7: string;
    day30: string;
    day90: string;
  };
  scores: {
    consistency: number;
    burnout: number;
    growth: number;
  };
  category: ScenarioCategory;
  momentum: number;
} {
  const scores = calculateScores({
    study_hours: input.study_hours,
    sleep_hours: input.sleep_hours,
    screen_time: input.screen_time,
    workout: input.workout,
    mood: input.mood,
    deep_work: input.deep_work,
    streak: input.streak,
  });

  const category = detectScenarioCategory(input.scenario);
  const momentum = getMomentumScore(
    scores.consistency,
    scores.growth,
    scores.burnout,
    input.mood,
    input.streak
  );

  const risk = getRiskLabel(
    scores.burnout,
    scores.consistency,
    input.sleep_hours,
    input.screen_time
  );

  const confidence = getConfidence(
    scores.consistency,
    scores.growth,
    scores.burnout,
    input.streak
  );

  const timeline = getTimeline(
    category,
    momentum,
    scores.growth,
    scores.consistency,
    scores.burnout
  );

  const caseTexts = generateCaseTexts(
    category,
    scores.consistency,
    scores.burnout,
    scores.growth,
    momentum
  );

  
  return {
    bestCase: caseTexts.bestCase,
    likelyCase: caseTexts.likelyCase,
    worstCase: caseTexts.worstCase,
    nextStep: caseTexts.nextStep,
    confidence,
    risk,
    timeline,
    scores,
    category,
    momentum,
  };
}