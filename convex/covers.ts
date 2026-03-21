import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Download and store a single book cover permanently in Convex storage
export const storeFromUrl = action({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const book = await ctx.runQuery(api.books.getById, { id: args.bookId });
    if (!book) throw new Error("Book not found");
    if (book.coverStorageId) return "Already stored";
    if (!book.coverUrl) return "No cover URL";

    const url = book.coverUrl.replace(/&amp;/g, "&");
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch cover: ${response.status}`);

    const blob = await response.blob();
    const storageId = await ctx.storage.store(blob);

    await ctx.runMutation(api.books.updateCoverStorage, {
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

// Batch store covers for all books that have URLs but no storage
export const storeAll = action({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.runQuery(api.covers.getAll);
    let stored = 0;
    let skipped = 0;
    for (const book of books) {
      if (book.coverStorageId || !book.coverUrl) {
        skipped++;
        continue;
      }
      try {
        const url = book.coverUrl.replace(/&amp;/g, "&");
        const response = await fetch(url);
        if (!response.ok) { skipped++; continue; }
        const blob = await response.blob();
        const storageId = await ctx.storage.store(blob);
        await ctx.runMutation(api.covers.updateCoverStorage, {
          bookId: book._id,
          coverStorageId: storageId,
        });
        stored++;
      } catch {
        skipped++;
      }
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
