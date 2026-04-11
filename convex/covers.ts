import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

// Placeholder images Google Books returns when no cover exists are tiny (< 5 KB).
const MIN_IMAGE_BYTES = 5_000;

/** Build Google Books cover URLs at decreasing zoom levels (3 = highest res). */
function googleZoomUrls(coverUrl: string): string[] {
  try {
    const base = coverUrl.replace(/&amp;/g, "&");
    const u = new URL(base);
    return [5, 3, 2, 1].map((zoom) => {
      u.searchParams.set("zoom", String(zoom));
      return u.toString();
    });
  } catch {
    return [coverUrl.replace(/&amp;/g, "&")];
  }
}

/** Try each URL in order; return the first real image blob (skips placeholders). */
async function fetchFirstValidImage(urls: string[]): Promise<Blob | null> {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const blob = await res.blob();
      if (!blob.type.startsWith("image/")) continue;
      if (blob.size < MIN_IMAGE_BYTES) continue;
      return blob;
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Re-search Google Books API by title + author and return cover URLs for the
 * top results (zoom 3 → 2 → 1 for each). Used when the stored coverUrl has
 * expired or never worked.
 */
async function freshGoogleCoverUrls(
  title: string,
  author: string,
): Promise<string[]> {
  try {
    const apiKey = (
      globalThis as unknown as {
        process?: { env: Record<string, string | undefined> };
      }
    ).process?.env?.GOOGLE_BOOKS_API_KEY;
    const keyParam = apiKey ? `&key=${apiKey}` : "";
    const q = encodeURIComponent(`${title} ${author}`);
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=3&orderBy=relevance${keyParam}`,
    );
    if (!res.ok) return [];
    const data = await res.json();
    const urls: string[] = [];
    for (const item of data.items ?? []) {
      const links = item.volumeInfo?.imageLinks ?? {};
      const best = (
        links.extraLarge ??
        links.large ??
        links.medium ??
        links.thumbnail ??
        links.smallThumbnail
      )?.replace("http://", "https://");
      if (best) urls.push(...googleZoomUrls(best));
    }
    return urls;
  } catch {
    return [];
  }
}

/**
 * Build the full ordered candidate list for a book:
 *   1. Stored Google Books URL at zoom 3/2/1 (may still work for new books)
 *   2. Fresh Google Books search by title+author (recovers expired URLs)
 *   3. Open Library via ISBN
 */
async function buildCandidateUrls(book: {
  title: string;
  author: string;
  coverUrl?: string;
  isbn?: string;
}): Promise<string[]> {
  const candidates: string[] = [];

  if (book.coverUrl) {
    candidates.push(...googleZoomUrls(book.coverUrl));
  }

  // Always add a fresh Google Books search — it's the only reliable source
  // when the stored URL has expired.
  const fresh = await freshGoogleCoverUrls(book.title, book.author);
  candidates.push(...fresh);

  if (book.isbn) {
    candidates.push(`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`);
  }

  return candidates;
}

// Download and store a single book cover permanently in Convex storage
export const storeFromUrl = action({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const book = await ctx.runQuery(api.covers.getById, { id: args.bookId });
    if (!book) throw new Error("Book not found");
    if (book.coverStorageId) return "Already stored";

    const candidates = await buildCandidateUrls(book);
    if (candidates.length === 0) return "No cover sources";

    const blob = await fetchFirstValidImage(candidates);
    if (!blob) return "No valid cover found";

    const storageId = await ctx.storage.store(blob);
    await ctx.runMutation(api.covers.updateCoverStorage, {
      bookId: args.bookId,
      coverStorageId: storageId,
    });

    return `Cover stored: ${storageId}`;
  },
});

// Update book with cover storage ID
export const updateCoverStorage = mutation({
  args: {
    bookId: v.id("books"),
    coverStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookId, { coverStorageId: args.coverStorageId });
  },
});

// Get book by ID
export const getById = query({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Batch store covers for all books that don't have permanent storage yet.
// Safe to call repeatedly — skips books that already have coverStorageId.
export const storeAll = action({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.runQuery(api.covers.getAll);
    let stored = 0;
    let skipped = 0;
    const pending = books.filter(
      (b: { coverStorageId?: string }) => !b.coverStorageId,
    );
    skipped += books.length - pending.length;

    const BATCH = 5;
    for (let i = 0; i < pending.length; i += BATCH) {
      const batch = pending.slice(i, i + BATCH);
      const results = await Promise.allSettled(
        batch.map(
          async (book: {
            _id: string;
            title: string;
            author: string;
            coverUrl?: string;
            isbn?: string;
            coverStorageId?: string;
          }) => {
            const candidates = await buildCandidateUrls(book);
            if (candidates.length === 0) return "skip";
            const blob = await fetchFirstValidImage(candidates);
            if (!blob) return "skip";
            const storageId = await ctx.storage.store(blob);
            await ctx.runMutation(api.covers.updateCoverStorage, {
              bookId: book._id as Id<"books">,
              coverStorageId: storageId,
            });
            return "stored";
          },
        ),
      );
      for (const r of results) {
        if (r.status === "fulfilled" && r.value === "stored") stored++;
        else skipped++;
      }
    }
    return `Stored ${stored} covers, skipped ${skipped}`;
  },
});

// Get all books (for batch operations)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("books").collect();
  },
});
