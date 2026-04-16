# Life Simulator OS

A React-based web application that simulates future life outcomes based on daily habits and "What-If" scenarios. It uses static ML predictions and an on-device LLM (via RunAnywhere) to generate quantitative scores and qualitative simulations.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **AI/ML**: @runanywhere/web-llamacpp (Qwen 2.5 model, runs in-browser)
- **Package Manager**: npm

## Project Structure

```
src/
  app/          - Main App.tsx component
  features/     - Simulation engine logic
  lib/          - ML scoring and RunAnywhere LLM integration
  styles/       - Global CSS
  types/        - TypeScript types
  main.tsx      - Entry point
ml_predictions.json - Static ML prediction data
```

## Development

- Run: `npm run dev` (served at port 5000)
- Build: `npm run build`

## Configuration

- Vite is configured to listen on `0.0.0.0:5000` with `allowedHosts: true` for Replit proxy compatibility.
- Deployment: Static site, built with `npm run build`, served from `dist/`.
