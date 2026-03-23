import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Seed books for a specific user
export const seedBooks = mutation({
  args: {
    userId: v.string(),
    books: v.array(
      v.object({
        title: v.string(),
        author: v.string(),
        coverUrl: v.optional(v.string()),
        genre: v.optional(v.string()),
        pageCount: v.optional(v.number()),
        status: v.optional(
          v.union(
            v.literal("reading"),
            v.literal("read"),
            v.literal("wishlist"),
          ),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const callerId = await auth.getUserId(ctx);
    if (!callerId) throw new Error("Not authenticated");
    let count = 0;
    for (const book of args.books) {
      const existing = await ctx.db
        .query("books")
        .filter((q) =>
          q.and(
            q.eq(q.field("title"), book.title),
            q.eq(q.field("author"), book.author),
          ),
        )
        .first();
      if (existing) continue;

      await ctx.db.insert("books", {
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        genre: book.genre || "Other",
        pageCount: book.pageCount,
        status: book.status || "read",
        userId: args.userId,
        isFavorite: false,
        createdAt: Date.now(),
      });
      count++;
    }
    return `Added ${count} book(s)`;
  },
});
