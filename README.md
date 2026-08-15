# Habit Constellation 🌌

**Track:** Wellness (CSGirlies Hackathon) · **Bonus Tracks:** Best Use of AI, Most Viral  
**Tech Stack:** React + Vite, React Three Fiber (R3F) + drei, Tailwind CSS, Framer Motion, Zustand, Node.js + Express, Prisma ORM, PostgreSQL, Anthropic API (Claude).

---

## 🌟 Concept Summary

Habit Constellation turns daily habit tracking into a living night sky. Every completed habit lights up a star in a 3D interactive celestial viewport. Over days and weeks, stars connect into a personal constellation that visibly grows without punishing streak-breaks or guilt UI. An AI layer periodically analyzes star patterns and delivers warm, non-clinical pattern insights.

---

## 🎨 Visual Identity & Palette

| Color | Token Hex | Role |
|---|---|---|
| **Void Indigo** | `#0B0B1E` | Base cosmic background |
| **Deep Nebula** | `#1A1440` | Glassmorphic surface cards |
| **Nebula Violet** | `#6B4FA0` | Accent buttons & borders |
| **Aurora Teal** | `#3FD9C7` | Active state highlight |
| **Stardust Gold** | `#F4C95D` | Glowing completed habit star |
| **Comet Pink** | `#FF6F9C` | CTA hover & streak highlight |
| **Mist White** | `#E8E6F5` | Primary crisp text |

---

## 🚀 Quick Start — Running Locally

### Prerequisites
- Node.js (v18 or higher)
- Docker Desktop (for local Postgres database) OR a local/remote PostgreSQL instance

### 1. Database Setup

#### Option A: Docker (Recommended)
Launch the local PostgreSQL container with Docker Compose:
```bash
docker-compose up -d
```

#### Option B: Local PostgreSQL or Cloud Database (Supabase / Neon)
Ensure PostgreSQL is running locally on port 5432 or update `DATABASE_URL` in `.env`.

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your `ANTHROPIC_API_KEY` to `.env` if available (if left empty, a warm fallback insight generator takes over seamlessly).

### 3. Install Dependencies & Build Frontend
```bash
# Install frontend dependencies
cd client
npm install
npm run build

# Install backend dependencies
cd ../server
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Start Local Servers

#### Development Mode (Concurrent Frontend & Backend)
- **Backend (Port 5000):** `cd server && npm run dev`
- **Frontend (Port 3000):** `cd client && npm run dev`

Open your browser at [http://localhost:3000](http://localhost:3000).

#### Single Service Mode (Express serving built client static dist)
```bash
cd server
npm start
```
Open your browser at [http://localhost:5000](http://localhost:5000).

---

## ☁️ Render Single-Service Deployment

This repository is pre-configured with a Render Blueprint (`render.yaml`) for one-click deployment as a single Web Service:

1. Push your repository to GitHub.
2. Log into [Render Dashboard](https://dashboard.render.com/) and click **New > Blueprint**.
3. Select your GitHub repository.
4. Render will automatically provision:
   - Managed **Render PostgreSQL** database instance.
   - **Render Web Service** running the Express server.
5. In your Web Service settings, set the environment variable `ANTHROPIC_API_KEY` (if desired).
6. Click **Deploy**.

---

## 🧪 Architecture & Key Components

- `client/src/components/constellation/ConstellationCanvas.jsx`: Interactive 3D night sky built with React Three Fiber.
- `client/src/components/constellation/Star.jsx`: Emissive star mesh with pulse glow animations and HTML hover tooltips.
- `client/src/components/constellation/ConnectionLine.jsx`: 3D animated beam joining habits completed on identical dates.
- `client/src/components/constellation/StaticStarMap.jsx`: SVG fallback supporting `prefers-reduced-motion`.
- `server/src/services/ai.service.js`: Aggregates completion frequencies without sending personal PII, prompting Claude for warm pattern observations.
