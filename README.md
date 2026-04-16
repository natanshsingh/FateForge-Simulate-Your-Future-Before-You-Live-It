# 🔮 FateForge  
### Simulate Your Future Before You Live It

FateForge is an AI-powered life simulation engine that helps users make better decisions by predicting the **realistic consequences** of their actions before they take them.

This is not a motivation tool.  
This is a **decision engine**.

---

# 🧠 Core Idea

Most people:
- Plan blindly  
- Overestimate effort  
- Ignore burnout  
- Chase unrealistic goals  

FateForge fixes that by:
👉 Simulating outcomes based on real-world constraints  
👉 Forcing trade-offs (sleep, focus, burnout, consistency)  
👉 Giving **strategic, execution-focused advice**

---

# 🚀 Key Features

## 🔍 1. What-If Simulation Engine
- Input habits (study, sleep, screen time, etc.)
- Describe a scenario  
- Get:
  - Best case
  - Likely case
  - Worst case

👉 Focus: **Reality, not motivation**

---

## 🏛 2. Ancient Advisor (Seraphon)
- AI strategic advisor
- Identifies:
  - Bottleneck
  - Key weakness
- Gives:
  - One high-leverage action
  - 3 practical next moves
  - What to STOP doing

👉 Focus: **Execution over inspiration**

---

## ⚖️ 3. Reality Check System
- Confidence score (0–100)
- Risk level (Low / Medium / High)
- Threat level (Low → Critical)
- Reality validation

👉 Prevents unrealistic planning

---

## 📈 4. Growth vs Burnout Engine
Tracks:
- Consistency
- Growth
- Burnout

👉 Rewards sustainable effort  
👉 Punishes over-optimization & burnout

---

## 🎮 5. Gamified Life System
- XP system
- Levels & ranks
- Achievements

👉 Turns life into a **strategy game**

---

## 🔮 6. Future Timeline
Visual projection for:
- Day 7
- Day 30
- Day 90

👉 Shows long-term consequences

---

## ⚔️ 7. Compare Mode
- Compare 2 lifestyles
- Instantly see which path is better

👉 Helps in decision-making

---

# ⚙️ How It Works (Step-by-Step)

1. User enters:
   - Habits (sleep, study, etc.)
   - Scenario (e.g. “What if I grind business for 90 days?”)

2. Frontend sends data to backend

3. Backend:
   - Builds structured prompt
   - Sends to AI model

4. AI evaluates:
   - Sustainability
   - Trade-offs
   - Long-term outcomes

5. Returns structured JSON:
   - Predictions
   - Scores
   - Advice

6. Frontend:
   - Visualizes results
   - Updates game system (XP, levels, etc.)

---

# 🧩 Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Custom RPG UI system

### Backend
- Node.js
- Express

### AI
- OpenAI API (LLM-based reasoning)

---

# 🛠 Setup Guide

## 1. Clone
```bash
git clone https://github.com/natanshsingh/FateForge-Simulate-Your-Future-Before-You-Live-It
cd FateForge-Simulate-Your-Future-Before-You-Live-It

# INSTALL
npm install

#Add API KEY
Create .env file:
OPENAI_API_KEY=your_api_key_here

#Run Backend
node server.js

# Run Frontend
npm run dev

### 🎯 Use Case Scenarios
📚 Student
“What if I study 6 hours daily but sleep only 5 hours?”
→ Sees burnout risk + lower long-term growth

💼 Builder
“What if I go all-in on a startup for 90 days?”
→ Gets realistic execution + risk breakdown

⚖️ Decision Maker
Compare:
Balanced life vs extreme grind
→ Understand which path wins



###Why This Project Matters
Most apps:
Track habits ❌
Give generic advice ❌


FateForge:
Simulates consequences ✅
Forces realism ✅
Guides execution ✅


👉 It shifts thinking from:
“What should I do?” → “What will actually happen?”





