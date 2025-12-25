# Elise

A manga-inspired digital bookshelf and art gallery for tracking books, sharing artwork, and writing reviews.

## Quick Start

```bash
bun install
cp .env.example .env.local
# Add: NEXT_PUBLIC_CONVEX_URL=https://rare-blackbird-695.convex.cloud
bun run dev
```

## Features

- **Bookshelf** - Track reading status, progress, and ratings
- **Gallery** - Upload and share manga-style artwork
- **Reviews** - Rich text with emojis, stickers, and GIFs
- **Social** - Follow users, like content, notifications
- **Dashboard** - Stats, achievements, reading streaks
- **Parental Controls** - Content moderation for parents

## Tech Stack

- Next.js 14 + React 18
- Convex (backend)
- Tailwind CSS
- TipTap (rich text)

## Environments

| Branch       | Environment | Convex Backend                  |
| ------------ | ----------- | ------------------------------- |
| `main`       | Staging     | rare-blackbird-695.convex.cloud |
| `production` | Production  | agile-shrimp-456.convex.cloud   |

## Scripts

```bash
bun run dev        # Start dev server
bun run build      # Build for production
bun run precheck   # Typecheck + lint + build
```

## Deployment

Netlify auto-deploys on push. Set `CONVEX_DEPLOY_KEY` in Netlify env vars.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.
