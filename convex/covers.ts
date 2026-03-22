import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Download and store a single book cover permanently in Convex storage
export const storeFromUrl = action({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const book = await ctx.runQuery(api.covers.getById, { id: args.bookId });
    if (!book) throw new Error("Book not found");
    if (book.coverStorageId) return "Already stored";

    // Try Open Library by title first (reliable — returns 404 for missing covers)
    if (book.title) {
      const olUrl = `https://covers.openlibrary.org/b/title/${encodeURIComponent(book.title)}-M.jpg?default=false`;
      try {
        const resp = await fetch(olUrl);
        if (resp.ok) {
          const blob = await resp.blob();
          // Skip tiny or placeholder images
          if (blob.size > 2000) {
            const storageId = await ctx.storage.store(blob);
            await ctx.runMutation(api.covers.updateCoverStorage, {
              bookId: args.bookId,
              coverStorageId: storageId,
            });
            return `Cover stored from Open Library: ${storageId}`;
          }
        }
      } catch { /* Open Library failed, try Google Books */ }
    }

    // Fallback: try Google Books URL (may return placeholder)
    if (book.coverUrl) {
      const url = book.coverUrl.replace(/&amp;/g, "&");
      try {
        const response = await fetch(url);
        if (response.ok) {
          const blob = await response.blob();
          // Skip Google Books placeholder (575x750, ~9KB grayscale PNG)
          if (blob.size > 15000) {
            const storageId = await ctx.storage.store(blob);
            await ctx.runMutation(api.covers.updateCoverStorage, {
              bookId: args.bookId,
              coverStorageId: storageId,
            });
            return `Cover stored from Google Books: ${storageId}`;
          }
        }
      } catch { /* failed */ }
    }

    return "No usable cover found";
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

// Batch store covers for all books that have URLs but no storage
export const storeAll = action({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.runQuery(api.covers.getAll);
    let stored = 0;
    let skipped = 0;
    for (const book of books) {
      if (book.coverStorageId) { skipped++; continue; }

      let stored_ = false;

      // Try Open Library by title
      if (book.title) {
        const olUrl = `https://covers.openlibrary.org/b/title/${encodeURIComponent(book.title)}-M.jpg?default=false`;
        try {
          const resp = await fetch(olUrl);
          if (resp.ok) {
            const blob = await resp.blob();
            if (blob.size > 2000) {
              const storageId = await ctx.storage.store(blob);
              await ctx.runMutation(api.covers.updateCoverStorage, {
                bookId: book._id,
                coverStorageId: storageId,
              });
              stored++;
              stored_ = true;
            }
          }
        } catch { /* try next */ }
      }

      // Fallback: Google Books (skip if likely placeholder — <15KB)
      if (!stored_ && book.coverUrl) {
        try {
          const url = book.coverUrl.replace(/&amp;/g, "&");
          const resp = await fetch(url);
          if (resp.ok) {
            const blob = await resp.blob();
            if (blob.size > 15000) {
              const storageId = await ctx.storage.store(blob);
              await ctx.runMutation(api.covers.updateCoverStorage, {
                bookId: book._id,
                coverStorageId: storageId,
              });
              stored++;
              stored_ = true;
            }
          }
        } catch { /* skip */ }
      }

      if (!stored_) skipped++;
    }
    return `Stored ${stored} covers, skipped ${skipped}`;
  },
});

// Get all books with cover URLs (for batch operations)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("books").collect();
  },
});
