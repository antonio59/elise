import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

const importRow = v.object({
  title: v.string(),
  author: v.string(),
  status: v.union(
    v.literal("read"),
    v.literal("reading"),
    v.literal("wishlist"),
  ),
  isbn: v.optional(v.string()),
  series: v.optional(v.string()),
  coverUrl: v.optional(v.string()),
  genre: v.optional(v.string()),
  rating: v.optional(v.number()),
  review: v.optional(v.string()),
  pageCount: v.optional(v.number()),
  finishedAt: v.optional(v.number()),
  createdAt: v.optional(v.number()),
});

/**
 * Import books from a Goodreads library CSV export.
 * Dedupes against existing books (case-insensitive title+author) so the
 * import is safe to re-run. Signed-in owner only.
 */
export const importBooks = mutation({
  args: { books: v.array(importRow) },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const seen = new Set(
      existing.map(
        (b) => `${b.title.toLowerCase().trim()}|${b.author.toLowerCase().trim()}`,
      ),
    );

    const now = Date.now();
    let imported = 0;
    let skipped = 0;

    for (const book of args.books) {
      const key = `${book.title.toLowerCase().trim()}|${book.author.toLowerCase().trim()}`;
      if (seen.has(key)) {
        skipped++;
        continue;
      }
      seen.add(key);

      await ctx.db.insert("books", {
        userId,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        coverUrl: book.coverUrl,
        genre: book.genre || "Other",
        series: book.series,
        rating: book.rating,
        review: book.review,
        pageCount: book.pageCount,
        status: book.status,
        isFavorite: book.rating === 5,
        startedAt: book.status === "reading" ? now : undefined,
        finishedAt: book.status === "read" ? (book.finishedAt ?? now) : undefined,
        createdAt: book.createdAt ?? now,
      });
      imported++;
    }

    return { imported, skipped, total: args.books.length };
  },
});
