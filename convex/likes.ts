import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const toggle = mutation({
  args: {
    visitorId: v.string(),
    contentId: v.string(),
    contentType: v.union(v.literal("artwork"), v.literal("review"), v.literal("book")),
    reactionType: v.optional(v.union(v.literal("like"), v.literal("love"))),
  },
  handler: async (ctx, args) => {
    const reaction = args.reactionType || "like";
    
    // Check if visitor already reacted
    const existing = await ctx.db
      .query("likes")
      .withIndex("by_visitor_content", (q) =>
        q.eq("visitorId", args.visitorId).eq("contentId", args.contentId)
      )
      .first();

    if (existing) {
      // If same reaction type, remove it (toggle off)
      if (existing.reactionType === reaction) {
        await ctx.db.delete(existing._id);
        return { reacted: false, type: null };
      }
      // If different reaction type, update it
      await ctx.db.patch(existing._id, { reactionType: reaction });
      return { reacted: true, type: reaction };
    }

    // Create new reaction
    await ctx.db.insert("likes", {
      visitorId: args.visitorId,
      contentId: args.contentId,
      contentType: args.contentType,
      reactionType: reaction,
      createdAt: Date.now(),
    });

    return { reacted: true, type: reaction };
  },
});

export const getReactionStatus = query({
  args: {
    visitorId: v.optional(v.string()),
    contentId: v.string(),
  },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_content", (q) => q.eq("contentId", args.contentId))
      .collect();

    const likeCount = likes.filter(l => l.reactionType === "like" || !l.reactionType).length;
    const loveCount = likes.filter(l => l.reactionType === "love").length;
    
    let userReaction: string | null = null;
    if (args.visitorId) {
      const userLike = likes.find(l => l.visitorId === args.visitorId);
      userReaction = userLike?.reactionType || (userLike ? "like" : null);
    }

    return { 
      likeCount, 
      loveCount, 
      totalCount: likes.length,
      userReaction 
    };
  },
});

export const getAllStats = query({
  args: {},
  handler: async (ctx) => {
    const likes = await ctx.db.query("likes").collect();
    const shares = await ctx.db.query("shares").collect();
    
    const totalLikes = likes.filter(l => l.reactionType === "like" || !l.reactionType).length;
    const totalLoves = likes.filter(l => l.reactionType === "love").length;
    const totalShares = shares.length;

    return {
      totalLikes,
      totalLoves,
      totalShares,
      totalEngagement: totalLikes + totalLoves + totalShares,
    };
  },
});

// Legacy support
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
    return { count: likes.length, liked: false };
  },
});
