import { RunAnywhere, SDKEnvironment } from "@runanywhere/web";
import { TextGeneration } from "@runanywhere/web-llamacpp";

let initialized = false;
let modelLoaded = false;

export async function initRunAnywhere() {
  if (!initialized) {
    await RunAnywhere.initialize({
      environment: SDKEnvironment.Production, // or another valid SDKEnvironment value
      debug: true,
    });
    initialized = true;
  }

  if (!modelLoaded) {
    await TextGeneration.loadModel(
      "/models/qwen2.5-0.5b-instruct-q4_0.gguf",
      "life-os-llm"
    );
    modelLoaded = true;
  }
}