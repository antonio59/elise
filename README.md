# Elise Reads

A personal book tracking, art gallery, and writing site for Elise. Built with a warm editorial aesthetic that grows with her.

## Features

### 📚 Books
- **Google Books Search** — search and auto-fill book details (title, author, cover, genre, pages)
- **Smart Genre Detection** — maps Google Books categories to manga/fantasy/romance/mystery/etc.
- **Custom Rating Labels** — "not it" → "meh" → "solid read" → "obsessed" → "all-time fav"
- **Mood Tags** — 16 BookTok vibes (dark academia, cottagecore, found family, etc.)
- **Flip Card Reviews** — tap to reveal full review with rating
- **Wishlist** — public-facing so people can see and gift books

### 🎨 Art Gallery
- Upload and publish artwork
- Public gallery with lightbox viewer
- Suggestion system for visitors

### ✍️ Writing
- Rich text editor for creative writing
- Draft/publish workflow
- Emoji & GIF support via Giphy (proxied through Convex)

### 👤 About
- Customizable profile (bio, avatar, favorite genres, reading goal)
- Currently reading display
- Public-facing bio page

### ⚙️ Settings
- 7 theme options (Editorial, Sakura, Lavender, Midnight, Sunset, Botanical, Berry)
- Yearly reading goal with progress tracking
- Notification preferences

### 🔐 Security
- Email allowlist (only approved users can sign up)
- Admin/viewer role system
- Giphy API key proxied through Convex (never exposed to client)

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 7, Tailwind CSS 4
- **Backend**: Convex (real-time database + serverless functions)
- **Auth**: Convex Auth (Password provider)
- **Animations**: Framer Motion
- **Hosting**: Netlify (free tier)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Convex CLI](https://docs.convex.dev/quickstart)

### Installation

```bash
# Install dependencies
npm install

# Start Convex dev server
npx convex dev

# In another terminal, start Vite dev server
npm run dev
```

### Environment Variables

**Convex** (set via `npx convex env set KEY VALUE`):
- `AUTH_SECRET` — auth encryption key
- `JWKS` — JSON Web Key Set
- `JWT_PRIVATE_KEY` — JWT signing key
- `SITE_URL` — your site URL (e.g. https://elisereads.com)
- `GIPHY_API_KEY` — Giphy API key for GIF search

**Local** (`.env.local`):
```
VITE_CONVEX_URL=your_convex_deployment_url
```

## Project Structure

```
elise/
├── convex/                    # Convex backend
│   ├── schema.ts              # Database schema
│   ├── auth.ts                # Authentication setup
│   ├── auth.config.ts         # Auth config (keep providers: [])
│   ├── books.ts               # Book CRUD + search
│   ├── artworks.ts            # Artwork CRUD
│   ├── users.ts               # User profiles + stats
│   ├── writings.ts            # Writing CRUD
│   ├── giphy.ts               # Giphy proxy (API key stays server-side)
│   └── http.ts                # HTTP routes
├── src/
│   ├── components/            # Reusable components
│   │   ├── GoogleBookSearch.tsx
│   │   ├── GiphyPicker.tsx
│   │   ├── CoverUpload.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ...
│   ├── contexts/              # React contexts (Auth)
│   ├── pages/                 # Page components
│   │   ├── PublicHome.tsx     # Public homepage
│   │   ├── Dashboard.tsx      # Owner dashboard
│   │   ├── MyBooks.tsx        # Book management
│   │   ├── Reviews.tsx        # Review cards + editing
│   │   ├── About.tsx          # Public bio page
│   │   └── ...
│   ├── styles/                # CSS tokens, themes
│   └── App.tsx                # Main app with routing
├── .github/workflows/         # CI + Convex deploy
└── netlify.toml               # Netlify configuration
```

## Routes

### Public
| Path | Page |
|------|------|
| `/` | Homepage (books, art, writing preview, wishlist) |
| `/gallery` | Public art gallery |
| `/wishlist` | Books to gift |
| `/about` | Elise's bio |
| `/login` | Sign in |
| `/signup` | Create account (email-allowlisted) |

### Dashboard (owner only)
| Path | Page |
|------|------|
| `/dashboard` | Overview + stats |
| `/books` | Manage books (add, edit, rate, review) |
| `/reviews` | Flip card reviews with inline editing |
| `/art` | Manage artwork |
| `/writing` | Manage writings |
| `/suggestions` | Visitor book suggestions |
| `/settings` | Profile, theme, goals |

## Deployment

### Deploy Convex
```bash
npx convex deploy
```

**Note:** `npx convex deploy` deploys to production by default. There is no `--prod` flag.

### Deploy Frontend
Netlify auto-deploys on push to `main`.

### Important Gotchas
- **Never use `npx convex dev` for production data** — it pushes to a separate dev database
- **`auth.config.ts` must keep `providers: []`** — the CLI rejects any provider object
- **Never commit `.npmrc`** — add to `.gitignore`
- **Never set `omit=optional` in `.npmrc`** — breaks platform optional dependencies
- **`process.env.CONVEX_SITE_URL` does not resolve at deploy time** — hardcode the fallback

## Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## License

Private project for Elise.
