/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Toggle a reaction (add if not exists, remove if exists)
export const toggle = mutation({
  args: {
    targetType: v.union(v.literal("book"), v.literal("writing"), v.literal("artwork")),
    targetId: v.string(),
    emoji: v.string(),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if reaction already exists
    const existing = await ctx.db
      .query("reactions")
      .withIndex("by_visitor", (q) =>
        q.eq("visitorId", args.visitorId).eq("targetType", args.targetType).eq("targetId", args.targetId)
      )
      .filter((q) => q.eq(q.field("emoji"), args.emoji))
      .first();

    if (existing) {
      // Remove existing reaction
      await ctx.db.delete(existing._id);
      return { action: "removed" };
    } else {
      // Add new reaction
      await ctx.db.insert("reactions", {
        targetType: args.targetType,
        targetId: args.targetId,
        emoji: args.emoji,
        visitorId: args.visitorId,
        createdAt: Date.now(),
      });
      return { action: "added" };
    }
  },
});

// Get all reactions for a target, grouped by emoji with counts
export const getReactions = query({
  args: {
    targetType: v.union(v.literal("book"), v.literal("writing"), v.literal("artwork")),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_target", (q) =>
        q.eq("targetType", args.targetType).eq("targetId", args.targetId)
      )
      .collect();

    // Group by emoji and count
    const counts: Record<string, number> = {};
    for (const reaction of reactions) {
      counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
    }

    // Convert to array format
    const result = Object.entries(counts).map(([emoji, count]) => ({
      emoji,
      count,
    }));

    // Sort by count descending
    result.sort((a, b) => b.count - a.count);

    return result;
  },
});

// Get reactions for a specific visitor on a target
export const getUserReactions = query({
  args: {
    targetType: v.union(v.literal("book"), v.literal("writing"), v.literal("artwork")),
    targetId: v.string(),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_visitor", (q) =>
        q.eq("visitorId", args.visitorId).eq("targetType", args.targetType).eq("targetId", args.targetId)
      )
      .collect();

    return reactions.map((r) => r.emoji);
  },
});

// Get dashboard stats for reactions
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const allReactions = await ctx.db.query("reactions").collect();

    // Total reactions count
    const totalReactions = allReactions.length;

    // Top emojis
    const emojiCounts: Record<string, number> = {};
    for (const reaction of allReactions) {
      emojiCounts[reaction.emoji] = (emojiCounts[reaction.emoji] || 0) + 1;
    }

    const topEmojis = Object.entries(emojiCounts)
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Most reacted items
    const itemCounts: Record<string, { targetType: string; targetId: string; count: number }> = {};
    for (const reaction of allReactions) {
      const key = `${reaction.targetType}:${reaction.targetId}`;
      if (!itemCounts[key]) {
        itemCounts[key] = {
          targetType: reaction.targetType,
          targetId: reaction.targetId,
          count: 0,
        };
      }
      itemCounts[key].count++;
    }

    const mostReactedItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Fetch titles for most reacted items
    const itemsWithDetails = await Promise.all(
      mostReactedItems.map(async (item) => {
        let title = "Unknown";
        try {
          if (item.targetType === "book") {
            const book = await ctx.db.get(item.targetId as any);
            title = book?.title || "Unknown Book";
          } else if (item.targetType === "writing") {
            const writing = await ctx.db.get(item.targetId as any);
            title = writing?.title || "Unknown Writing";
          } else if (item.targetType === "artwork") {
            const artwork = await ctx.db.get(item.targetId as any);
            title = artwork?.title || "Unknown Artwork";
          }
        } catch {
          // If we can't fetch the item, use "Unknown"
        }
        return {
          ...item,
          title,
        };
      })
    );

    return {
      totalReactions,
      topEmojis,
      mostReactedItems: itemsWithDetails,
    };
  },
});
