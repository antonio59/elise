# Elise - Setup Guide

## Prerequisites

- Node.js 18+
- A Convex account (free at https://convex.dev)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Convex

Run the Convex CLI to initialize your project:

```bash
npx convex dev
```

This will:
- Prompt you to log in to Convex (or create an account)
- Create a new Convex project
- Generate the `convex/_generated` folder with TypeScript types
- Start the Convex development server

The CLI will output your deployment URL. Copy it.

### 3. Configure Environment

Update `.env.local` with your Convex URL:

```
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 4. Run the Development Server

In a new terminal (keep Convex running):

```bash
npm run dev:frontend
```

Or run both together:

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Database Schema

Convex automatically creates tables based on the schema in `convex/schema.ts`:

- **users** - User accounts with email/password auth and roles (child/parent)
- **sessions** - Authentication sessions with tokens
- **books** - Book collection with status, rating, genre, pages tracking
- **artworks** - Artwork uploads with series support
- **artSeries** - Artwork series/chapters grouping
- **reviews** - Book reviews with mood colors and ratings
- **likes** - Likes on artworks and reviews
- **follows** - User follow relationships
- **readingStreaks** - Daily reading activity tracking

## Authentication

The app uses custom email/password authentication:

- **Register**: Choose "Reader" (child) or "Parent" account type
- **Login**: Email and password
- **Sessions**: 30-day token-based sessions stored in localStorage

### Account Types

1. **Reader (child)**: 
   - Add books, upload artwork, write reviews
   - View dashboard with stats and achievements
   - Public profile with follow support

2. **Parent**:
   - All reader features
   - Access to "Manage" section
   - Can view/hide/delete any content
   - Content moderation controls

## File Storage

Convex provides built-in file storage for:
- Artwork images
- Review illustrations
- User avatars

Files are uploaded using `ctx.storage.generateUploadUrl()` and stored with Convex.

## Deployment

### Deploy Convex Backend

```bash
npx convex deploy
```

### Deploy Frontend (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable: `NEXT_PUBLIC_CONVEX_URL`
4. Deploy

## Development Tips

- Convex functions hot-reload automatically
- Use the Convex dashboard to inspect data: https://dashboard.convex.dev
- Schema changes require running `npx convex dev` to regenerate types
