import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const toggle = mutation({
  args: {
    token: v.optional(v.string()),
    contentId: v.string(),
    contentType: v.union(v.literal("artwork"), v.literal("review")),
  },
  handler: async (ctx, args) => {
    let userId = undefined;

    if (args.token) {
      const session = await ctx.db
        .query("sessions")
        .withIndex("by_token", (q) => q.eq("token", args.token))
        .first();

      if (session && session.expiresAt >= Date.now()) {
        userId = session.userId;
      }
    }

    if (userId) {
      const existing = await ctx.db
        .query("likes")
        .withIndex("by_user_content", (q) =>
          q.eq("userId", userId).eq("contentId", args.contentId)
        )
        .first();

      if (existing) {
        await ctx.db.delete(existing._id);
        return { liked: false };
      }
    }

    await ctx.db.insert("likes", {
      userId,
      contentId: args.contentId,
      contentType: args.contentType,
      createdAt: Date.now(),
    });

    return { liked: true };
  },
});

export const getCount = query({
  args: { contentId: v.string() },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_content", (q) => q.eq("contentId", args.contentId))
      .collect();

    return likes.length;
  },
});

export const getLikeStatus = query({
  args: {
    token: v.optional(v.string()),
    contentId: v.string(),
  },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_content", (q) => q.eq("contentId", args.contentId))
      .collect();

    const count = likes.length;
    let liked = false;

    if (args.token) {
      const session = await ctx.db
        .query("sessions")
        .withIndex("by_token", (q) => q.eq("token", args.token))
        .first();

      if (session && session.expiresAt >= Date.now()) {
        liked = likes.some((like) => like.userId === session.userId);
      }
    }

    return { count, liked };
  },
});
