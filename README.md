# Elise Reads

A personal book tracking, art gallery, and writing site for Elise. Built with a warm editorial aesthetic that grows with her.

🌐 **Live:** [elisereads.com](https://elisereads.com)

---

## Features

### 📚 Books
- **Google Books Search** (via Convex proxy) — search and auto-fill book details
- **Smart Genre Detection** — maps Google Books categories to manga/fantasy/romance/mystery/etc.
- **Custom Rating Labels** — "not it" → "meh" → "solid read" → "obsessed" → "all-time fav"
- **Mood Tags** — 16 BookTok vibes (dark academia, cottagecore, found family, etc.)
- **Cover Fallback** — Google Books zoom=2 → zoom=1 → Open Library → title card gradient
- **Flip Card Reviews** — desktop: tap to flip; mobile: review shown directly
- **5-Star Shelf** — horizontal scroll of top-rated books on homepage
- **Currently Reading** — dedicated strip showing books in progress
- **Wishlist** — public-facing so people can see and gift books
- **Book Suggestions** — visitors can suggest books for Elise

### ✍️ Writing
- Rich text editor with draft/publish workflow
- Category filters (Poetry / Story / Journal)
- Emoji & GIF support via Giphy (proxied through Convex)
- Date stamps on published pieces

### 🎨 Art Gallery
- Upload and publish artwork
- Public gallery with lightbox viewer
- Drag-and-drop reorder

### 💬 Reactions
- Emoji reactions (❤️ 📚 ✨ 🔥 😭 💀 🤯 👀) on reviews, writings, and art
- Anonymous — uses sessionStorage visitor ID
- Dashboard stats showing total reactions, top emojis, and most-reacted items

### 👤 About & Avatar
- Customizable profile (bio, avatar, favorite genres, reading goal, fun facts)
- **DiceBear Avatar Creator** — 13 styles (pixel art, robots, doodles, emoji faces, etc.)
- Public-facing bio page

### 🏠 Dashboard
- Animated stats grid (books read, pages, written, artworks, favourites)
- Currently reading strip with progress
- Hero editor (customise homepage title + tagline)
- Quick actions
- Reactions overview

### ⚙️ Settings
- 7 theme options (Editorial, Sakura, Lavender, Midnight, Sunset, Botanical, Berry)
- Yearly reading goal with progress tracking
- Footer customisation (tagline + note)

### 📬 Email
- Resend integration for book suggestion notifications
- API key stays server-side (Convex action)

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS 4
- **Backend:** Convex (real-time database + serverless functions)
- **Auth:** Convex Auth (Password provider, email allowlist)
- **Animations:** Framer Motion
- **Hosting:** Netlify (frontend) + Convex Cloud (backend)
- **Email:** Resend

## Getting Started

```bash
npm install
npx convex dev        # Start Convex backend
npm run dev           # Start Vite dev server (in another terminal)
```

### Environment Variables

**Convex** (`npx convex env set KEY VALUE`):
- `AUTH_SECRET`, `JWKS`, `JWT_PRIVATE_KEY` — auth
- `GIPHY_API_KEY` — GIF search
- `GOOGLE_BOOKS_API_KEY` — cover art search
- `RESEND_API_KEY` — email notifications
- `ALLOWED_EMAILS` — comma-separated email allowlist

**Local** (`.env.local`):
```
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

## Deployment

### Convex
```bash
npx convex dev        # Regenerate _generated types
npx convex deploy     # Push to production
```

### Frontend
Netlify auto-deploys on push to `main`.

## Important Gotchas

- `convex/_generated/` **must be committed** — it's how Convex types work
- Never use `as any` on action function references — breaks deploy
- Platform packages go in `optionalDependencies` only
- Always `npx convex dev` after pulling to regenerate types

## License

Private project for Elise.
