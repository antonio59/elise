# Elise Reads

A personal book tracking, art gallery, and writing site built with React + Convex.

## Run & Operate

- `npm run dev:frontend` — start the Vite dev server (port 5000)
- `npm run dev:backend` — start the Convex dev backend (requires Convex login)
- `npm run dev` — start both frontend and backend concurrently
- `npm run build` — TypeScript check + Vite production build
- `npm test` — run Vitest unit tests

Required env vars:
- `VITE_CONVEX_URL` — Convex deployment URL (e.g. `https://xxx.convex.cloud`)

## Stack

- **Frontend:** React 19, React Router 7, Vite 8, Tailwind CSS 4, Framer Motion
- **Backend:** Convex (serverless functions, real-time DB, auth)
- **Auth:** `@convex-dev/auth` with Convex Auth Provider
- **Email:** Resend
- **Language:** TypeScript
- **Package manager:** npm

## Where things live

- `src/` — React frontend (pages, components, hooks, contexts)
- `src/App.tsx` — routing setup
- `src/main.tsx` — app entry point
- `src/lib/convex.ts` — Convex client setup
- `convex/` — Convex backend functions (books, photos, auth, crons, etc.)
- `convex/schema.ts` — database schema (source of truth)
- `convex/auth.config.ts` — auth configuration
- `public/` — static assets
- `scripts/seed.py` — Python seed script

## Architecture decisions

- Convex handles both the real-time database and serverless API — no separate REST backend needed
- Frontend-only workflow in dev; Convex backend runs separately (`convex dev`)
- Static SPA deployment — all routing is client-side via React Router
- Auth is handled entirely through Convex Auth (no separate auth service)

## Product

- Book tracking with reading status, ratings, and notes
- Art/photo gallery
- Writing/blog section
- Google Books API integration (via Convex proxy)
- Giphy integration for fun features
- Admin dashboard for content management

## User preferences

_Populate as you build_

## Gotchas

- `VITE_CONVEX_URL` must be set for the frontend to connect to Convex
- Convex backend must be running separately for real data; frontend works with placeholder URL but shows no data
- Vite runs on port 5000 in this Replit environment (changed from upstream default of 5173)

## Pointers

- [Convex docs](https://docs.convex.dev)
- [React Router v7 docs](https://reactrouter.com)
