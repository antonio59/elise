# Elise

A vibrant, public-facing digital bookshelf and art gallery.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.local` and fill in your Supabase credentials.
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Structure

- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable UI components.
- `/lib`: Utility functions and types (Supabase client, etc.).
- `/public`: Static assets.

## Features

- **Bookshelf**: Track reading status (Reading, Read, Wishlist).
- **Gallery**: Upload and share artwork.
- **Reviews**: Write and publish book reviews.
- **Dashboard**: View stats and achievements.
