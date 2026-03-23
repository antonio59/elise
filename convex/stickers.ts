import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const MAX_PER_VISITOR = 2; // max stickers per visitor per book

/** Leave a sticker on a book. Rate-limited to 2 per visitor per book. */
export const add = mutation({
  args: {
    targetId: v.string(),
    sticker: v.string(),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stickers")
      .withIndex("by_visitor_target", (q) =>
        q.eq("visitorId", args.visitorId).eq("targetId", args.targetId),
      )
      .collect();

    if (existing.length >= MAX_PER_VISITOR) {
      throw new Error("You've already left stickers on this book!");
    }

    await ctx.db.insert("stickers", {
      targetType: "book",
      targetId: args.targetId,
      sticker: args.sticker,
      visitorId: args.visitorId,
      createdAt: Date.now(),
    });
  },
});

/** Get aggregated sticker counts for a book. */
export const getForBook = query({
  args: { bookId: v.string() },
  handler: async (ctx, args) => {
    const stickers = await ctx.db
      .query("stickers")
      .withIndex("by_target", (q) =>
        q.eq("targetType", "book").eq("targetId", args.bookId),
      )
      .collect();

    const counts: Record<string, number> = {};
    for (const s of stickers) {
      counts[s.sticker] = (counts[s.sticker] ?? 0) + 1;
    }

    return { total: stickers.length, counts };
  },
});

/** Get the stickers a specific visitor has left on a book. */
export const getVisitorStickers = query({
  args: { bookId: v.string(), visitorId: v.string() },
  handler: async (ctx, args) => {
    const stickers = await ctx.db
      .query("stickers")
      .withIndex("by_visitor_target", (q) =>
        q.eq("visitorId", args.visitorId).eq("targetId", args.bookId),
      )
      .collect();
    return stickers.map((s) => s.sticker);
  },
});
