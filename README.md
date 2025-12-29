# Elise Reads

A manga/anime-inspired book tracking and art sharing site for Elise.

## Features

- **Book Tracking** - Track books you're reading, have read, or want to read
- **Art Gallery** - Upload and share your artwork with visitors
- **Public Gallery** - Visitors can browse published artwork and suggest books
- **Anime/Manga Design** - Sakura pink, violet, and teal color scheme with manga-inspired layouts

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4
- **Backend**: Convex (real-time database + serverless functions)
- **Auth**: Convex Auth (Password provider)
- **Animations**: Framer Motion
- **Hosting**: Netlify

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js 20+)
- [Convex CLI](https://docs.convex.dev/quickstart)

### Installation

```bash
# Install dependencies
bun install

# Start development server (Vite + Convex)
bun run dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
VITE_CONVEX_URL=your_convex_deployment_url
```

## Project Structure

```
elise/
├── convex/              # Convex backend
│   ├── schema.ts        # Database schema
│   ├── auth.ts          # Authentication setup
│   ├── books.ts         # Book CRUD operations
│   ├── artworks.ts      # Artwork CRUD operations
│   └── users.ts         # User profiles
├── src/
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts (Auth)
│   ├── pages/           # Page components
│   ├── styles/          # CSS tokens and styles
│   └── App.tsx          # Main app with routing
└── netlify.toml         # Netlify configuration
```

## Deployment

### Branch Strategy

| Branch       | Environment | Convex Project     |
| ------------ | ----------- | ------------------ |
| `main`       | Staging     | rare-blackbird-695 |
| `production` | Production  | agile-shrimp-456   |

### Deploy Process

1. Push to `main` for staging deployment
2. Merge `main` to `production` for production deployment
3. Netlify automatically builds and deploys on push
4. Deploy Convex schema: `bunx convex deploy`

## Scripts

```bash
bun run dev      # Start dev server + Convex
bun run build    # Build for production
bun run preview  # Preview production build
bun run lint     # Run ESLint
```

## License

Private project for Elise.
