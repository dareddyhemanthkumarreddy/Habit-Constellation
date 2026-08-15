# Habit Constellation 🌌

[![Hackathon: CSGirlies](https://img.shields.io/badge/Hackathon-CSGirlies-blue?logo=rocket)]
[![Track: Wellness](https://img.shields.io/badge/Track-Wellness-green)]
[![Bonus: AI](https://img.shields.io/badge/Bonus-Best%20Use%20of%20AI-yellow)]
[![Tech: React+R3F](https://img.shields.io/badge/Tech-React%2C%20R3F-lightgrey)]
[![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey)]

Live demo: (https://habit-constellation.onrender.com/)  
Hero demo GIF: (add `demo.gif`)

One-line: Transform daily habits into a living, interactive 3D night sky — complete a habit, light a star, reveal patterns with AI.

---

## Why Habit Constellation?
Habit Constellation turns habit tracking into a delightful visual experience so users stay engaged and motivated. Rather than lists or charts alone, users explore a responsive 3D constellation where each completed habit becomes a glowing star; patterns, streaks, and insights emerge as constellations over time.

Key differentiators:
- 3D, tactile-first visualization using React Three Fiber (web-native 3D).
- AI-powered pattern suggestions (Anthropic Claude integration) for non-sensitive, aggregate habit insights.
- Accessible SVG fallback & respects prefers-reduced-motion.
- Designed for hackathon demos — fast to show, easy to explain.

---

## Key Features
- Interactive 3D Constellation viewport (zoom, rotate, hover tooltips).
- Glowing emissive stars for completed habits; animated beams connect related completions.
- Habit timeline and streak visualizations.
- Lightweight offline-first client with simple CRUD for habits.
- AI "Insight" summaries (frequency, clusters, suggested micro-goals) — privacy-first.
- Responsive UI with Tailwind + Framer Motion polish.
- Fallback SVG map for reduced-motion and mobile.

---

## Tech Stack
- Frontend: React + Vite, React Three Fiber (R3F), @react-three/drei, Tailwind CSS, Framer Motion, Zustand (state).
- Backend: Node.js, Express
- DB: PostgreSQL via Prisma ORM
- AI: Anthropic Claude (server-side, aggregate data only)
- Optional hosting: Render (render.yaml included) or Vercel / Railway / Supabase

Core files to highlight
- client/src/components/constellation/ConstellationCanvas.jsx — 3D scene entry
- client/src/components/constellation/Star.jsx — emissive star mesh
- client/src/components/constellation/ConnectionLine.jsx — connecting beams
- client/src/components/constellation/StaticStarMap.jsx — SVG fallback for reduced-motion
- server/src/services/ai.service.js — AI aggregate insights

---

## Accessibility & Performance
- Respects prefers-reduced-motion: uses StaticStarMap SVG fallback and turns off heavy animations.
- Progressive enhancement: 3D scene is visual-only; all controls remain keyboard accessible.
- Performance: LOD (level-of-detail) meshes, frustum culling via R3F, limited particle counts for older devices.

---

## Quick Start (Local Development)

Prerequisites
- Node.js v18+ (or latest LTS)
- PostgreSQL (local or cloud). Docker recommended for local DB.

1) Clone
```bash
git clone https://github.com/dareddyhemanthkumarreddy/Habit-Constellation.git
cd Habit-Constellation
```

2) Environment
- Copy env example:
```bash
cp .env.example .env
```
- Fill `.env`:
  - DATABASE_URL (postgres)
  - ANTHROPIC_API_KEY (optional — leave blank for fallback insights)
  - PORT (optional; default 5000)

3) Start DB (Docker recommended)
- Using docker-compose (if included):
```bash
docker-compose up -d
```

4) Install & setup backend
```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
```

5) Install frontend
```bash
cd ../client
npm install
```

6) Run in dev mode
- Backend (port 5000):
```bash
cd server
npm run dev
```
- Frontend (port 3000):
```bash
cd client
npm run dev
```
Open: http://localhost:3000

7) Production build (single service)
- Build client:
```bash
cd client
npm run build
```
- Serve via Express:
```bash
cd ../server
npm start
```

---

## Environment Variables
Add these (example)
- DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/habit_constellation
- ANTHROPIC_API_KEY=sk-xxxx (optional)
- NEXTAUTH_URL= (if using auth)
- PORT=5000

Never commit secrets. Use GitHub Secrets / Render Dashboard / Vercel Environment Variables to store keys.

---

## Deployment
- Single-service: Render Blueprint (render.yaml included) — set `ANTHROPIC_API_KEY` in Render.
- Alternative: Host frontend on Vercel and backend on Render/Heroku/Railway, connect to managed Postgres.
- For fastest hackathon demo: Deploy server + DB on Render using the blueprint and point to the deployed URL.

---

## Architecture Overview
1. Client (React + R3F) — renders constellation, handles interactions.
2. Server (Express + Prisma) — REST API, auth (optional), and AI orchestration.
3. Database (Postgres) — habits, completions, user metadata.
4. AI service — server-side aggregated prompts to Anthropic; no raw PII sent.

Flow: client → API endpoints (CRUD) → DB → server aggregates → AI service returns insight summary → client displays.

---


## Contributing
1. Open an issue for feature requests or bugs.
2. Create a branch: `feature/short-description`.
3. Run tests (if present) and open a PR with a clear description and demo GIF.
4. Keep changes small and modular; update docs where needed.

Code style
- Frontend: ESLint + Prettier (follow existing config)
- Commit messages: present-tense, short scope (e.g., "feat(ui): add star hover tooltip")

---

## Troubleshooting
- DB connection errors: ensure DATABASE_URL is correct and Postgres is reachable.
- AI failing: check ANTHROPIC_API_KEY and server logs for API errors.
- Slow 3D: enable reduced-motion or resize canvas with fewer particles.

---

## License & Credits
MIT License — see LICENSE.md

Built with ❤️ using React, React Three Fiber, Prisma, PostgreSQL, and Claude (Anthropic).

---

