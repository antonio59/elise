import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    token: v.string(),
    title: v.optional(v.string()),
    style: v.optional(v.string()),
    imageUrl: v.string(),
    storageId: v.optional(v.id("_storage")),
    published: v.boolean(),
    seriesId: v.optional(v.id("artSeries")),
    seriesOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("artworks", {
      userId: session.userId,
      title: args.title,
      style: args.style,
      imageUrl: args.imageUrl,
      storageId: args.storageId,
      published: args.published,
      seriesId: args.seriesId,
      seriesOrder: args.seriesOrder,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    artworkId: v.id("artworks"),
    title: v.optional(v.string()),
    style: v.optional(v.string()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const artwork = await ctx.db.get(args.artworkId);
    if (!artwork) throw new Error("Artwork not found");

    const user = await ctx.db.get(session.userId);
    if (artwork.userId !== session.userId && user?.role !== "parent") {
      throw new Error("Not authorized");
    }

    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.style !== undefined) updates.style = args.style;
    if (args.published !== undefined) updates.published = args.published;

    await ctx.db.patch(args.artworkId, updates);
    return await ctx.db.get(args.artworkId);
  },
});

export const remove = mutation({
  args: {
    token: v.string(),
    artworkId: v.id("artworks"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const artwork = await ctx.db.get(args.artworkId);
    if (!artwork) throw new Error("Artwork not found");

    const user = await ctx.db.get(session.userId);
    if (artwork.userId !== session.userId && user?.role !== "parent") {
      throw new Error("Not authorized");
    }

    if (artwork.storageId) {
      await ctx.storage.delete(artwork.storageId);
    }

    await ctx.db.delete(args.artworkId);
  },
});

export const getById = query({
  args: { artworkId: v.id("artworks") },
  handler: async (ctx, args) => {
    const artwork = await ctx.db.get(args.artworkId);
    if (!artwork) return null;

    const user = await ctx.db.get(artwork.userId);
    return {
      ...artwork,
      user: user ? {
        _id: user._id,
        username: user.username,
        avatarUrl: user.avatarUrl,
      } : null,
    };
  },
});

export const getPublished = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const artworks = await ctx.db
      .query("artworks")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .take(args.limit ?? 50);

    return Promise.all(
      artworks.map(async (artwork) => {
        const user = await ctx.db.get(artwork.userId);
        return {
          ...artwork,
          user: user ? {
            _id: user._id,
            username: user.username,
            avatarUrl: user.avatarUrl,
          } : null,
        };
      })
    );
  },
});

export const getByUser = query({
  args: { userId: v.id("users"), publishedOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("artworks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    const artworks = await query.order("desc").collect();

    if (args.publishedOnly) {
      return artworks.filter((a) => a.published);
    }
    return artworks;
  },
});

export const getMyArtworks = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const token = args.token;
    if (!token) return [];

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!session || session.expiresAt < Date.now()) return [];

    return await ctx.db
      .query("artworks")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .order("desc")
      .collect();
  },
});

export const getAllArtworks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("artworks").order("desc").collect();
  },
});

export const createSeries = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("artSeries", {
      userId: session.userId,
      title: args.title,
      description: args.description,
      createdAt: Date.now(),
    });
  },
});

export const getMySeries = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const token = args.token;
    if (!token) return [];

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!session || session.expiresAt < Date.now()) return [];

    return await ctx.db
      .query("artSeries")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .order("desc")
      .collect();
  },
});
