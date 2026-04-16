import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function safeJsonParse(text) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

function fallbackWhatIf(scenario = "") {
  return {
    bestCase: "A more balanced version of this path could create real momentum.",
    likelyCase: "Without a live AI response, this reading is limited.",
    worstCase: "If this plan is extreme or vague, it may break under real-life pressure.",
    confidence: 35,
    risk: "Medium",
    nextStep: "Use a working API key to unlock a real strategic reading.",
    timeline: {
      day7: "Initial pattern begins to form.",
      day30: "Compounding depends on consistency and recovery.",
      day90: "Long-term results depend on sustainability.",
    },
    category: scenario.toLowerCase().includes("business") ? "business" : "general",
    momentum: 42,
    scores: {
      consistency: 52,
      burnout: 48,
      growth: 55,
    },
    realityCheck: "Unverified",
    threat: "Moderate",
  };
}

function fallbackAdvisor() {
  return {
    title: "Seraphon — The Ancient Advisor",
    verdict: "Your system needs sharper prioritization.",
    primaryMandate: "Protect energy and focus on one high-leverage move.",
    warCouncilAdvice:
      "Stop scattering effort. Pick one growth lever and execute on it for 7 days.",
    bottleneck: "Too many priorities, not enough focused execution.",
    nextMoves: [
      "Define one concrete outcome for the next 7 days.",
      "Cut one distraction that reduces execution quality.",
      "Track one metric that proves real progress.",
    ],
    danger: "Fake productivity and scattered effort.",
    metricToTrack: "Weekly meaningful output",
  };
}

app.post("/api/whatif", async (req, res) => {
  try {
    const { scenario, player } = req.body;

    const prompt = `
You are a brutally realistic life simulation engine.

PLAYER STATE:
${JSON.stringify(player, null, 2)}

SCENARIO:
${scenario}

You must evaluate this like actual life, not motivational content.

Instructions:
- Penalize unrealistic plans HARD.
- Reward sustainable, compounding plans.
- Use tradeoffs: sleep, burnout, focus, distraction, mood, recovery, business execution, and long-term consequences.
- Confidence, momentum, and scores MUST vary based on the scenario and player state.
- Balanced plans should often beat extreme plans.
- If the plan is unrealistic, say so clearly.
- Do not repeat the same numbers or phrasing across different scenarios.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use code fences.

Return ONLY valid JSON in this exact shape:
{
  "bestCase": "string",
  "likelyCase": "string",
  "worstCase": "string",
  "confidence": 0,
  "risk": "Low",
  "nextStep": "string",
  "timeline": {
    "day7": "string",
    "day30": "string",
    "day90": "string"
  },
  "category": "string",
  "momentum": 0,
  "scores": {
    "consistency": 0,
    "burnout": 0,
    "growth": 0
  },
  "realityCheck": "string",
  "threat": "Moderate"
}

Rules:
- risk must be exactly one of: "Low", "Medium", "High"
- confidence must be an integer 0-100
- momentum must be an integer 0-100
- all scores must be integers 0-100
- category must be one of: "study", "business", "productivity", "recovery", "fitness", "career", "general"
- realityCheck should be a short verdict like "Sustainable", "Unstable", "Delusional", "Promising", "High Risk"
- threat must be exactly one of: "Low", "Moderate", "Severe", "Critical"
`;
 
    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      input: prompt,
    });

    const parsed = safeJsonParse(response.output_text);
    res.json(parsed);
  } catch (error) {
    console.error("whatif error:", error);
    res.status(500).json({ error: String(error) });
  }
});

app.post("/api/advisor", async (req, res) => {
  try {
    const { scenario, player } = req.body;

    const prompt = `
You are Seraphon, an elite ancient advisor for life, business, and execution.

PLAYER STATE:
${JSON.stringify(player, null, 2)}

CONTEXT:
${scenario || "No explicit scenario provided."}

Your job:
- identify the biggest bottleneck
- give one high-leverage mandate
- provide useful business advice if relevant
- explain what to stop doing
- give 3 practical next moves
- recommend 1 metric to track
- be sharp, strategic, and useful
- no vague self-help language
- no fluff

Return ONLY valid JSON in this exact shape:
{
  "title": "string",
  "verdict": "string",
  "primaryMandate": "string",
  "warCouncilAdvice": "string",
  "bottleneck": "string",
  "nextMoves": ["string", "string", "string"],
  "danger": "string",
  "metricToTrack": "string"
}
`;

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: prompt,
    });

    const parsed = safeJsonParse(response.output_text);
    res.json(parsed);
  } catch (error) {
    console.error("advisor error:", error);
    res.status(200).json(fallbackAdvisor());
  }
});

app.listen(3001, () => {
  console.log("AI server running on http://localhost:3001");
});