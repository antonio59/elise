import { query, internalMutation, action } from "./_generated/server";
import type { ActionCtx } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  googleCoverCandidates,
  isGoogleUnavailableSize,
} from "./lib/coverUrl";
import { readImageDimensions } from "./lib/imageDimensions";

/** Reject tiny Google thumbnails (~128px). Real covers are usually >> 20KB. */
const MIN_IMAGE_BYTES = 8_000;
/** Real covers should be wider than Google’s ~128px thumbs. */
const MIN_IMAGE_WIDTH = 200;

/** Try each URL in order; return the first real cover image (not a placeholder). */
async function fetchFirstValidImage(urls: string[]): Promise<Blob | null> {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const blob = await res.blob();
      if (!blob.type.startsWith("image/")) continue;
      if (blob.size < MIN_IMAGE_BYTES) continue;

      const bytes = new Uint8Array(await blob.arrayBuffer());
      const dims = readImageDimensions(bytes);
      if (!dims) continue;
      if (dims.width < MIN_IMAGE_WIDTH) continue;
      // Google upscales the gray “image not available” PNG to exactly 800×1043
      if (isGoogleUnavailableSize(dims.width, dims.height)) continue;

      // Re-wrap so Convex storage gets a fresh blob with the right type
      return new Blob([bytes], { type: blob.type || "image/jpeg" });
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Re-search Google Books API by title + author and return cover URLs for the
 * top results. Used when the stored coverUrl has expired or never worked.
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
      `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=5&orderBy=relevance${keyParam}`,
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
      // Only keep volumes that actually advertise an image — otherwise the
      // publisher frontcover endpoint returns the gray placeholder.
      if (!best) continue;
      urls.push(...googleCoverCandidates(best));
      if (item.id) {
        urls.push(
          `https://books.google.com/books/publisher/content/images/frontcover/${item.id}?fife=w800-h1200&source=gbs_api`,
        );
      }
    }
    return [...new Set(urls)];
  } catch {
    return [];
  }
}

/** Open Library search by title+author → large cover IDs. */
async function openLibraryCoverUrls(
  title: string,
  author: string,
): Promise<string[]> {
  try {
    const q = encodeURIComponent(`title:${title} author:${author}`);
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${q}&limit=3&fields=cover_i,isbn`,
    );
    if (!res.ok) return [];
    const data = await res.json();
    const urls: string[] = [];
    for (const doc of data.docs ?? []) {
      if (doc.cover_i) {
        urls.push(`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`);
      }
      const isbn = Array.isArray(doc.isbn) ? doc.isbn[0] : undefined;
      if (isbn) {
        urls.push(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);
      }
    }
    return [...new Set(urls)];
  } catch {
    return [];
  }
}

/**
 * Build the full ordered candidate list for a book:
 *   1. Stored Google Books URL (publisher high-res, no fife-upscaled placeholder)
 *   2. Fresh Google Books search by title+author (volumes with imageLinks only)
 *   3. Open Library via ISBN / title search
 */
async function buildCandidateUrls(book: {
  title: string;
  author: string;
  coverUrl?: string;
  isbn?: string;
}): Promise<string[]> {
  const candidates: string[] = [];

  if (book.coverUrl) {
    candidates.push(...googleCoverCandidates(book.coverUrl));
  }

  const fresh = await freshGoogleCoverUrls(book.title, book.author);
  candidates.push(...fresh);

  if (book.isbn) {
    candidates.push(
      `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`,
    );
  }

  const ol = await openLibraryCoverUrls(book.title, book.author);
  candidates.push(...ol);

  return [...new Set(candidates)];
}

type CoverBook = {
  _id: Id<"books">;
  title: string;
  author: string;
  coverUrl?: string;
  isbn?: string;
  coverStorageId?: Id<"_storage">;
};

async function storeCoverForBook(
  ctx: ActionCtx,
  book: CoverBook,
  options?: { replaceExisting?: boolean },
): Promise<"stored" | "skip"> {
  if (book.coverStorageId && !options?.replaceExisting) return "skip";

  const candidates = await buildCandidateUrls(book);
  if (candidates.length === 0) return "skip";
  const blob = await fetchFirstValidImage(candidates);
  if (!blob) return "skip";

  const storageId = await ctx.storage.store(blob);
  const oldStorageId = options?.replaceExisting
    ? book.coverStorageId
    : undefined;

  await ctx.runMutation(internal.covers.replaceCoverStorage, {
    bookId: book._id,
    coverStorageId: storageId,
    oldStorageId,
  });
  return "stored";
}

/** Download and store a single book cover permanently in Convex storage. */
export const storeFromUrl = action({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const book = await ctx.runQuery(api.covers.getById, { id: args.bookId });
    if (!book) throw new Error("Book not found");
    if (book.coverStorageId) return "Already stored";

    const result = await storeCoverForBook(ctx, book);
    return result === "stored" ? "Cover stored" : "No valid cover found";
  },
});

/** Update book with cover storage ID (internal only - called from actions). */
export const updateCoverStorage = internalMutation({
  args: {
    bookId: v.id("books"),
    coverStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookId, { coverStorageId: args.coverStorageId });
  },
});

/**
 * Set a new cover storage id and optionally delete the previous blob.
 * Used by refresh so we never clear a cover before a successful re-fetch.
 */
export const replaceCoverStorage = internalMutation({
  args: {
    bookId: v.id("books"),
    coverStorageId: v.id("_storage"),
    oldStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookId, { coverStorageId: args.coverStorageId });
    if (args.oldStorageId && args.oldStorageId !== args.coverStorageId) {
      try {
        await ctx.storage.delete(args.oldStorageId);
      } catch {
        // Old object may already be gone
      }
    }
  },
});

/** Clear stored cover so it can be re-fetched (deletes the blob). */
export const clearCoverStorage = internalMutation({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.bookId);
    if (book?.coverStorageId) {
      try {
        await ctx.storage.delete(book.coverStorageId);
      } catch {
        // ignore
      }
    }
    await ctx.db.patch(args.bookId, { coverStorageId: undefined });
  },
});

/** Get book by ID. */
export const getById = query({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/** Batch store covers for all books that don't have permanent storage yet. */
export const storeAll = action({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.runQuery(api.covers.getAll);
    let stored = 0;
    let skipped = 0;
    const pending = books.filter((b: CoverBook) => !b.coverStorageId);
    skipped += books.length - pending.length;

    const BATCH = 5;
    for (let i = 0; i < pending.length; i += BATCH) {
      const batch = pending.slice(i, i + BATCH);
      const results = await Promise.allSettled(
        batch.map((book: CoverBook) => storeCoverForBook(ctx, book)),
      );
      for (const r of results) {
        if (r.status === "fulfilled" && r.value === "stored") stored++;
        else skipped++;
      }
    }
    return `Stored ${stored} covers, skipped ${skipped}`;
  },
});

/**
 * Force re-download every cover at high resolution.
 * Never clears the old cover until a new valid image is stored.
 * Run: `pnpm exec convex run covers:refreshAllHighRes --prod`
 */
export const refreshAllHighRes = action({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.runQuery(api.covers.getAll);
    let upgraded = 0;
    let skipped = 0;

    const BATCH = 3;
    for (let i = 0; i < books.length; i += BATCH) {
      const batch = books.slice(i, i + BATCH);
      const results = await Promise.allSettled(
        batch.map((book: CoverBook) =>
          storeCoverForBook(ctx, book, { replaceExisting: true }),
        ),
      );
      for (const r of results) {
        if (r.status === "fulfilled" && r.value === "stored") upgraded++;
        else skipped++;
      }
    }
    return `Upgraded ${upgraded} covers, skipped ${skipped}`;
  },
});

/**
 * Re-fetch covers that look like Google’s “image not available” placeholder
 * or tiny thumbs still in storage. Clears only after a valid replacement.
 * Run: `pnpm exec convex run covers:repairBadCovers --prod`
 */
export const repairBadCovers = action({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.runQuery(api.covers.getAll);
    let repaired = 0;
    let skipped = 0;
    let cleared = 0;

    for (const book of books as CoverBook[]) {
      if (!book.coverStorageId) {
        const r = await storeCoverForBook(ctx, book);
        if (r === "stored") repaired++;
        else skipped++;
        continue;
      }

      const url = await ctx.storage.getUrl(book.coverStorageId);
      if (!url) {
        const r = await storeCoverForBook(ctx, book, { replaceExisting: true });
        if (r === "stored") repaired++;
        else skipped++;
        continue;
      }

      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const dims = readImageDimensions(bytes);
        const bad =
          !dims ||
          dims.width < MIN_IMAGE_WIDTH ||
          isGoogleUnavailableSize(dims.width, dims.height);

        if (!bad) {
          skipped++;
          continue;
        }

        const r = await storeCoverForBook(ctx, book, { replaceExisting: true });
        if (r === "stored") {
          repaired++;
        } else {
          // Couldn't find a better cover — remove the misleading placeholder
          // so the client can fall back to Google/Open Library URLs.
          await ctx.runMutation(internal.covers.clearCoverStorage, {
            bookId: book._id,
          });
          cleared++;
        }
      } catch {
        skipped++;
      }
    }

    return `Repaired ${repaired}, cleared placeholders ${cleared}, left alone ${skipped}`;
  },
});

/** Get all books (for batch operations). */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("books").collect();
  },
});
