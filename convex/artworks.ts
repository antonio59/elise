import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { sanitizeOptionalUrl, sanitizePlainText } from "./utils";
import { Id } from "./_generated/dataModel";

type Session = { _id: Id<"sessions">; userId: Id<"users">; expiresAt: number };

async function requireSession(ctx: any, token: string): Promise<Session> {
  const session = (await ctx.db
    .query("sessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first()) as Session | null;

  if (!session || session.expiresAt < Date.now()) {
    throw new Error("Not authenticated");
  }

  return session;
}

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
    dateDrawn: v.optional(v.string()),
    thoughts: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.token);
    const imageUrl = sanitizeOptionalUrl(args.imageUrl) || args.imageUrl;

    return await ctx.db.insert("artworks", {
      userId: session.userId,
      title: args.title ? sanitizePlainText(args.title, 180) : undefined,
      style: args.style ? sanitizePlainText(args.style, 120) : undefined,
      imageUrl: imageUrl,
      storageId: args.storageId,
      published: args.published,
      dateDrawn: args.dateDrawn ? sanitizePlainText(args.dateDrawn, 40) : undefined,
      thoughts: args.thoughts ? sanitizePlainText(args.thoughts, 2000) : undefined,
      seriesId: args.seriesId,
      createdAt: Date.now(),
    });
  },
});

export const createWithUpload = mutation({
  args: {
    token: v.string(),
    title: v.optional(v.string()),
    style: v.optional(v.string()),
    storageId: v.id("_storage"),
    published: v.boolean(),
    dateDrawn: v.optional(v.string()),
    thoughts: v.optional(v.string()),
    seriesId: v.optional(v.id("artSeries")),
  },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.token);

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      throw new Error("Failed to get image URL");
    }

    return await ctx.db.insert("artworks", {
      userId: session.userId,
      title: sanitizePlainText(args.title, 180),
      style: sanitizePlainText(args.style, 120),
      imageUrl: imageUrl,
      storageId: args.storageId,
      published: args.published,
      dateDrawn: sanitizePlainText(args.dateDrawn, 40),
      thoughts: sanitizePlainText(args.thoughts, 2000),
      seriesId: args.seriesId,
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
    const session = await requireSession(ctx, args.token);

    const artwork = await ctx.db.get(args.artworkId);
    if (!artwork) throw new Error("Artwork not found");

    const user = await ctx.db.get(session.userId);
    if (artwork.userId !== session.userId && user?.role !== "parent") {
      throw new Error("Not authorized");
    }

    const updates: any = {};
    if (args.title !== undefined) updates.title = sanitizePlainText(args.title, 180);
    if (args.style !== undefined) updates.style = sanitizePlainText(args.style, 120);
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
    const session = await requireSession(ctx, args.token);

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
  args: { artworkId: v.id("artworks"), token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const artwork = await ctx.db.get(args.artworkId);
    if (!artwork) return null;

    if (!artwork.published) {
      if (!args.token) return null;
      const session = await ctx.db
        .query("sessions")
        .withIndex("by_token", (q) => q.eq("token", args.token!))
        .first();
      if (!session || session.expiresAt < Date.now()) return null;
      if (session.userId !== artwork.userId) {
        const viewer = await ctx.db.get(session.userId);
        if (viewer?.role !== "parent") return null;
      }
    }

    const user = await ctx.db.get(artwork.userId);
    return {
      ...artwork,
      user: user
        ? {
            _id: user._id,
            username: user.username,
            avatarUrl: user.avatarUrl,
          }
        : null,
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
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.token);
    const viewer = await ctx.db.get(session.userId);

    if (viewer?.role === "parent") {
      return await ctx.db.query("artworks").order("desc").collect();
    }

    return await ctx.db
      .query("artworks")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .order("desc")
      .collect();
  },
});

export const createSeries = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.token);

    return await ctx.db.insert("artSeries", {
      userId: session.userId,
      title: sanitizePlainText(args.title, 180) || args.title,
      description: sanitizePlainText(args.description, 800),
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
