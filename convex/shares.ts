import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const track = mutation({
  args: {
    contentId: v.string(),
    contentType: v.union(v.literal("artwork"), v.literal("review"), v.literal("book")),
    platform: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("shares", {
      contentId: args.contentId,
      contentType: args.contentType,
      platform: args.platform,
      createdAt: Date.now(),
    });
  },
});

export const getCount = query({
  args: { contentId: v.string() },
  handler: async (ctx, args) => {
    const shares = await ctx.db
      .query("shares")
      .withIndex("by_content", (q) => q.eq("contentId", args.contentId))
      .collect();
    return shares.length;
  },
});
