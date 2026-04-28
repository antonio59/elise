import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import {
  requireAuth,
  requireOwnership,
  cleanupStorage,
  checkLikeRateLimit,
  filterUndefinedUpdates,
} from "./lib/crud";

// Get all published artworks (for public gallery)
export const getPublished = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const artworks = await ctx.db
      .query("artworks")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("desc")
      .take(args.limit ?? 1000);
    return artworks;
  },
});

// Get all artworks for authenticated user
export const getMyArtworks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("artworks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Get artworks by series
export const getBySeries = query({
  args: { seriesId: v.id("artSeries") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("artworks")
      .withIndex("by_series", (q) => q.eq("seriesId", args.seriesId))
      .order("desc")
      .collect();
  },
});

// Get single artwork
export const getById = query({
  args: { id: v.id("artworks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create artwork (requires auth)
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.string(),
    storageId: v.optional(v.id("_storage")),
    style: v.optional(v.string()),
    medium: v.optional(v.string()),
    seriesId: v.optional(v.id("artSeries")),
    tags: v.optional(v.array(v.string())),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    return await ctx.db.insert("artworks", {
      ...args,
      userId,
      likes: 0,
      createdAt: Date.now(),
    });
  },
});

// Update artwork (requires auth)
export const update = mutation({
  args: {
    id: v.id("artworks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    style: v.optional(v.string()),
    medium: v.optional(v.string()),
    seriesId: v.optional(v.id("artSeries")),
    tags: v.optional(v.array(v.string())),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireOwnership(ctx, "artworks", args.id);

    const { id, ...updates } = args;
    await ctx.db.patch(id, filterUndefinedUpdates(updates));
  },
});

// Delete artwork (requires auth)
export const remove = mutation({
  args: { id: v.id("artworks") },
  handler: async (ctx, args) => {
    const artwork = await requireOwnership(ctx, "artworks", args.id);
    await cleanupStorage(ctx, artwork.storageId);
    await ctx.db.delete(args.id);
  },
});

// Like artwork (public - no auth required)
export const like = mutation({
  args: { id: v.id("artworks"), visitorId: v.string() },
  handler: async (ctx, args) => {
    await checkLikeRateLimit(ctx, args.visitorId, "likeArtwork");

    const artwork = await ctx.db.get(args.id);
    if (!artwork) throw new Error("Artwork not found");

    await ctx.db.patch(args.id, { likes: (artwork.likes ?? 0) + 1 });
  },
});

// Get art series (site-wide)
export const getMySeries = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("artSeries").order("desc").collect();
  },
});

// Create art series (requires auth)
export const createSeries = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    return await ctx.db.insert("artSeries", {
      ...args,
      userId,
      isComplete: false,
      createdAt: Date.now(),
    });
  },
});
