export type SimulationOutput = {
  bestCase: string;
  likelyCase: string;
  worstCase: string;
  nextStep: string;

  confidence: number;
  risk: "Low" | "Medium" | "High";

  timeline: {
    day7: string;
    day30: string;
    day90: string;
  };

  category?: string;
  momentum?: number;

  scores?: {
    consistency: number;
    burnout: number;
    growth: number;
  };

  // ✅ ADD THESE TWO
  realityCheck?: string;
  threat?: string;
};