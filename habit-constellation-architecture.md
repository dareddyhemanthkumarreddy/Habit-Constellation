# Habit Constellation — System Architecture

**Track:** Wellness (CSGirlies Hackathon) · **Bonus:** Best Use of AI, Most Viral
**Deployment target:** Render (single Web Service + managed Postgres)
**Builder:** Antigravity AI agent, working from this spec

---

## 1. Concept Summary

Habit Constellation turns habit tracking into a living night sky. Every habit a
user completes lights up a star. Over days and weeks, stars connect into a
personal constellation that visibly grows — no punishing streak-breaks, no
guilt UI. An AI layer periodically looks at the pattern of stars and returns a
short, warm, non-clinical insight ("your constellation dims on weekends —
want to add a lighter Saturday habit?").

The 3D constellation view is the centerpiece of the whole product — it is
what carries the demo video, not a supporting graphic bolted onto a form.

---

## 2. Visual Identity (Design System)

Avoid the generic AI-app look (black background + one neon accent, or cream +
serif + terracotta). This is a **night sky**, not a dashboard — the palette
and motion should feel closer to a planetarium than SaaS software.

### Color tokens
| Token | Hex | Use |
|---|---|---|
| Void Indigo | `#0B0B1E` | base background |
| Deep Nebula | `#1A1440` | secondary surface / cards |
| Nebula Violet | `#6B4FA0` | primary accent, buttons |
| Aurora Teal | `#3FD9C7` | secondary accent, active states |
| Stardust Gold | `#F4C95D` | star glow, completed habit |
| Comet Pink | `#FF6F9C` | streak highlight, CTA hover |
| Mist White | `#E8E6F5` | primary text |

Background is never flat black — use a soft radial gradient from Void Indigo
to Deep Nebula so the canvas has depth even before any stars render.

### Typography
- **Display (headlines):** Clash Display — geometric, a little unexpected,
  used sparingly (hero line, page titles only)
- **Body:** Satoshi or Inter — clean, high legibility for UI copy
- **Utility/data (stats, dates, streak counters):** Space Mono — reinforces
  the "star chart" feel for anything numeric

### Layout concept
No big-number hero, no stat-card grid. The hero *is* the interactive 3D
canvas — an ambient star field on the landing page that gently drifts, then
resolves into the user's own constellation once they're on the dashboard.

### Signature element
**The Living Constellation** — a React Three Fiber canvas where each habit
check-in is a star that fades in with a soft glow-pulse, and connecting lines
draw themselves with an animated stroke whenever two habits are completed on
the same day. This single element should get 80% of the animation budget;
everything else (buttons, forms, nav) stays quiet and disciplined by
comparison.

### Motion principles
- One orchestrated moment (constellation growth) beats many small effects
- Micro-interactions (button hover, card tap) use Framer Motion, kept subtle
- Respect `prefers-reduced-motion` — fall back to a static SVG star map
- Page transitions: soft fade + slight upward drift, never a hard cut

---

## 3. Tech Stack

### Frontend
| Layer | Choice | Why |
|---|---|---|
| Framework | React + Vite | fast dev/build, easy Render static-friendly build |
| Styling | Tailwind CSS (custom theme extending tokens above) | fast, consistent, easy for AI agent to generate |
| 3D | React Three Fiber + drei (Three.js) | the constellation canvas |
| Motion | Framer Motion | page transitions, micro-interactions |
| Routing | React Router | multi-page app |
| State | Zustand | lightweight, avoids Redux boilerplate |
| API calls | Axios | simple fetch wrapper |
| Forms | React Hook Form | login/signup, habit forms |

### Backend
| Layer | Choice | Why |
|---|---|---|
| Runtime | Node.js + Express | simple, fast to build, Render-friendly |
| Auth | JWT + bcrypt | simple email/password, no external auth provider needed |
| Database | PostgreSQL (Render managed DB, free tier) | relational, easy habit/checkin modeling |
| ORM | Prisma | fast schema iteration, good for AI-agent-generated code |
| AI | Anthropic API (Claude) | pattern insight generation |

### Deployment
- **One Render Web Service** running Express, which serves the built React
  `client/dist` as static files AND exposes `/api/*` routes — this avoids
  needing two separate Render services or configuring CORS between them.
- **One Render PostgreSQL** instance (free tier), connected via `DATABASE_URL`.
- Environment variables: `DATABASE_URL`, `JWT_SECRET`, `ANTHROPIC_API_KEY`.

This single-service approach is the easiest possible Render setup: one
repo, one build command, one deploy.

---

## 4. Folder Structure

```
habit-constellation/
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── constellation/
│   │   │   │   ├── StarField.jsx        # ambient background stars (landing)
│   │   │   │   ├── ConstellationCanvas.jsx  # main R3F canvas, dashboard
│   │   │   │   ├── Star.jsx             # single star mesh + glow
│   │   │   │   └── ConnectionLine.jsx   # animated line between stars
│   │   │   ├── habits/
│   │   │   │   ├── HabitCard.jsx
│   │   │   │   ├── HabitForm.jsx        # create custom habit
│   │   │   │   └── PresetPicker.jsx
│   │   │   ├── insights/
│   │   │   │   └── InsightCard.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── PageTransition.jsx
│   │   │   └── ui/                      # buttons, inputs, modals (shared)
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Habits.jsx
│   │   │   ├── Insights.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── store/
│   │   │   └── habitStore.js            # Zustand store
│   │   ├── services/
│   │   │   └── api.js                   # Axios instance + endpoints
│   │   ├── styles/
│   │   │   └── theme.css                # design tokens as CSS variables
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                        # Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── habits.routes.js
│   │   │   ├── checkins.routes.js
│   │   │   └── insights.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── habits.controller.js
│   │   │   ├── checkins.controller.js
│   │   │   └── insights.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js       # JWT verification
│   │   ├── services/
│   │   │   └── ai.service.js            # Claude API calls for insights
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── index.js                     # Express app entry, serves client/dist
│   └── package.json
│
├── render.yaml                    # Render deploy blueprint
└── README.md
```

---

## 5. Frontend Pages — Detail

### Landing (`/`)
Public marketing page. Full-viewport ambient `StarField` drifting slowly
behind a headline and a single CTA ("Start your sky"). No stat cards, no
feature grid clutter — let the star field do the selling. Scroll reveals 2–3
short lines explaining the concept, each fading in.

### Login / Signup (`/login`, `/signup`)
Minimal centered card over a dimmed star field (reuses `StarField` at low
opacity so the brand feels continuous). Email + password only.

### Dashboard (`/dashboard`) — the centerpiece
- **Main view:** `ConstellationCanvas` fills most of the viewport. Each
  active habit maps to a star; today's completions pulse gold; connecting
  lines animate in as habits are checked off.
- **Habit check-off tray:** a slim, collapsible panel (bottom or side) with
  today's habits as tappable cards — checking one off triggers the star's
  glow-in animation on the canvas in real time.
- **Quick insight teaser:** small card surfacing the latest AI insight with
  a link to the full Insights page.

### Habits (`/habits`)
Manage habits: preset picker (categorized: Body, Mind, Connection, Rest) plus
a "Create custom habit" form (name, icon, optional target frequency). List
of active habits with edit/archive actions. Archiving never deletes stars
already earned — the constellation history is permanent.

### Insights (`/insights`)
- Auto-generated **weekly summary card** at the top (generated automatically
  when the user visits after a new week has started)
- **"Get my insight now"** button for on-demand generation
- History list of past insights, newest first

### Profile (`/profile`)
Basic account info, logout, and a "download my constellation" share-image
button (feeds the Most Viral bonus track).

---

## 6. UI/UX Principles

- No red "broken streak" states — a missed day simply leaves a star dim, not
  destroyed. This is a deliberate wellness-track UX choice worth calling out
  in your Devpost write-up.
- Every primary action (check off habit, generate insight) gets a visible,
  satisfying animation payoff within 300ms.
- Mobile-first responsive: the constellation canvas resizes and simplifies
  (fewer simultaneous particle effects) below 480px width, and always
  respects `prefers-reduced-motion`.
- Keyboard focus states are visible everywhere (accessibility floor, also
  reads well to judges).

---

## 7. Backend Features & Working

### Auth
- `POST /api/auth/register` — create user, hash password (bcrypt), return JWT
- `POST /api/auth/login` — verify credentials, return JWT
- `auth.middleware.js` — verifies JWT on all protected routes below

### Habits
- `GET /api/habits` — list user's active + archived habits
- `POST /api/habits` — create habit (preset reference or custom)
- `PATCH /api/habits/:id` — edit or archive
- `DELETE /api/habits/:id` — hard delete (rarely used; archive preferred)

### Check-ins
- `POST /api/checkins` — mark a habit complete for today (idempotent per
  habit/day)
- `GET /api/checkins?range=30d` — returns check-in history used to render
  the constellation (dates + habit IDs → frontend maps to star positions)

### Insights
- `POST /api/insights/generate` — pulls last 2–4 weeks of check-in data,
  sends a summarized pattern (not raw rows) to Claude via `ai.service.js`
  with a prompt asking for a short, warm, non-clinical observation + one
  gentle suggestion
- `GET /api/insights/latest` — returns most recent insight; frontend also
  calls `generate` automatically once per new week on dashboard load

### AI Service Working (`ai.service.js`)
1. Aggregate check-ins into a simple summary object (completion rate per
   habit per day-of-week — never send raw personal text)
2. Send summary + a fixed system prompt to Claude asking for: one pattern
   observation, one specific gentle suggestion, tone = encouraging friend,
   not clinician
3. Store the returned text in the `insights` table, tagged with week start
   date

---

## 8. Database Schema (Prisma)

```prisma
model User {
  id            String     @id @default(uuid())
  email         String     @unique
  passwordHash  String
  createdAt     DateTime   @default(now())
  habits        Habit[]
  checkins      Checkin[]
  insights      Insight[]
}

model Habit {
  id            String     @id @default(uuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id])
  name          String
  icon          String
  category      String?
  isCustom      Boolean    @default(false)
  isArchived    Boolean    @default(false)
  createdAt     DateTime   @default(now())
  checkins      Checkin[]
}

model Checkin {
  id            String     @id @default(uuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id])
  habitId       String
  habit         Habit      @relation(fields: [habitId], references: [id])
  date          DateTime   @db.Date
  createdAt     DateTime   @default(now())

  @@unique([habitId, date])
}

model Insight {
  id            String     @id @default(uuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id])
  weekStart     DateTime   @db.Date
  content       String
  createdAt     DateTime   @default(now())
}
```

---

## 9. Deployment Plan (Render)

1. Push repo to GitHub (public, for the required submission)
2. Create a **Render PostgreSQL** instance (free tier) → copy `DATABASE_URL`
3. Create a **Render Web Service** pointing at the repo:
   - Build command: `cd client && npm install && npm run build && cd ../server && npm install && npx prisma generate`
   - Start command: `cd server && npx prisma migrate deploy && node src/index.js`
   - Express `index.js` serves `client/dist` as static files and mounts
     `/api` routes — one URL for the whole app
4. Set environment variables in Render dashboard: `DATABASE_URL`,
   `JWT_SECRET`, `ANTHROPIC_API_KEY`
5. Deploy — Render auto-builds on push to main

This is intentionally a **single service** so there's nothing extra to wire
up (no cross-service CORS, no separate static host) — one deploy, one URL.

---

## 10. Hackathon Judging Alignment

- **Originality:** constellation-as-data metaphor, not another journal/list
- **Impact:** no-guilt streak design, genuinely usable daily
- **UX:** signature 3D moment carries the demo video
- **Best Use of AI:** AI does real pattern analysis → specific suggestion,
  not decorative chat
- **Most Viral:** built-in shareable constellation snapshot image
