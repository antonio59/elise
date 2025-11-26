import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return null;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) return null;

    const prefs = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .first();

    return prefs || { preferredRatingType: "stars", customStickers: [] };
  },
});

export const setRatingType = mutation({
  args: {
    token: v.string(),
    ratingType: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { preferredRatingType: args.ratingType });
    } else {
      await ctx.db.insert("userPreferences", {
        userId: session.userId,
        preferredRatingType: args.ratingType,
        customStickers: [],
        createdAt: Date.now(),
      });
    }
  },
});

export const addCustomSticker = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    imageUrl: v.string(),
    artworkId: v.optional(v.id("artworks")),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .first();

    const newSticker = {
      id: crypto.randomUUID(),
      name: args.name,
      imageUrl: args.imageUrl,
      artworkId: args.artworkId,
    };

    if (existing) {
      const stickers = existing.customStickers || [];
      await ctx.db.patch(existing._id, {
        customStickers: [...stickers, newSticker],
      });
    } else {
      await ctx.db.insert("userPreferences", {
        userId: session.userId,
        customStickers: [newSticker],
        createdAt: Date.now(),
      });
    }

    return newSticker;
  },
});

export const removeCustomSticker = mutation({
  args: {
    token: v.string(),
    stickerId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .first();

    if (existing && existing.customStickers) {
      const stickers = existing.customStickers.filter((s) => s.id !== args.stickerId);
      await ctx.db.patch(existing._id, { customStickers: stickers });
    }
  },
});
