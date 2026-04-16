import { TextGeneration } from "@runanywhere/web-llamacpp";
import { initRunAnywhere } from "./init";

type ExplainInput = {
  scenario: string;
  consistency: number;
  burnout: number;
  growth: number;
};

export async function generateAIExplanation(input: ExplainInput) {
  await initRunAnywhere();

  const prompt = `
You are the AI explanation layer for Life Simulator OS.

User scenario:
${input.scenario}

Scores:
- Consistency: ${input.consistency}
- Burnout: ${input.burnout}
- Growth: ${input.growth}

Write exactly these sections:
Best Case:
Most Likely:
Worst Case:
Next Step:

Keep it short, practical, and clear.
`;

  const result = await TextGeneration.generate(prompt, {
    maxTokens: 180,
    temperature: 0.7,
  });

  return result.text;
}