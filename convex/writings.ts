import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get all published writings (for public page)
export const getPublished = query({
  args: { 
    limit: v.optional(v.number()),
    type: v.optional(v.union(v.literal("poetry"), v.literal("story"), v.literal("journal"))),
  },
  handler: async (ctx, args) => {
    const writings = await ctx.db
      .query("writings")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("desc")
      .collect();
    const published = args.type
      ? writings.filter((w) => w.type === args.type)
      : writings;
    return args.limit ? published.slice(0, args.limit) : published;
  },
});

// Get all writings for the current user
export const getMyWritings = query({
  args: {
    type: v.optional(v.union(v.literal("poetry"), v.literal("story"), v.literal("journal"))),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    const type = args.type;
    if (type) {
      return await ctx.db
        .query("writings")
        .withIndex("by_user_type", (q) =>
          q.eq("userId", userId).eq("type", type),
        )
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("writings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Get single writing
export const getById = query({
  args: { id: v.id("writings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get writing stats for current user
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const userWritings = await ctx.db
      .query("writings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const poems = userWritings.filter((w) => w.type === "poetry");
    const stories = userWritings.filter((w) => w.type === "story");
    const journals = userWritings.filter((w) => w.type === "journal");
    const favorites = userWritings.filter((w) => w.isFavorite);
    const published = userWritings.filter((w) => w.isPublished);
    const totalWords = userWritings.reduce((sum, w) => sum + w.wordCount, 0);

    return {
      total: userWritings.length,
      poems: poems.length,
      stories: stories.length,
      journals: journals.length,
      favorites: favorites.length,
      published: published.length,
      totalWords,
    };
  },
});

// Create writing
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    type: v.union(v.literal("poetry"), v.literal("story"), v.literal("journal")),
    genre: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isPublished: v.boolean(),
    coverUrl: v.optional(v.string()),
    coverStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const wordCount = args.content.trim().split(/\s+/).filter(Boolean).length;

    return await ctx.db.insert("writings", {
      ...args,
      userId,
      wordCount,
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Update writing
export const update = mutation({
  args: {
    id: v.id("writings"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    type: v.optional(v.union(v.literal("poetry"), v.literal("story"), v.literal("journal"))),
    genre: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isPublished: v.optional(v.boolean()),
    isFavorite: v.optional(v.boolean()),
    coverUrl: v.optional(v.string()),
    coverStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const writing = await ctx.db.get(args.id);
    if (!writing) throw new Error("Writing not found");

    const { id, ...updates } = args;
    const patch: Record<string, unknown> = { updatedAt: Date.now() };

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        patch[key] = value;
      }
    }

    // Recalculate word count if content changed
    if (args.content) {
      patch.wordCount = args.content.trim().split(/\s+/).filter(Boolean).length;
    }

    await ctx.db.patch(id, patch);
  },
});

// Delete writing
export const remove = mutation({
  args: { id: v.id("writings") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const writing = await ctx.db.get(args.id);
    if (!writing) throw new Error("Writing not found");

    if (writing.coverStorageId) {
      await ctx.storage.delete(writing.coverStorageId);
    }

    await ctx.db.delete(args.id);
  },
});

// Toggle favorite
export const toggleFavorite = mutation({
  args: { id: v.id("writings") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const writing = await ctx.db.get(args.id);
    if (!writing) throw new Error("Writing not found");

    await ctx.db.patch(args.id, { 
      isFavorite: !writing.isFavorite,
      updatedAt: Date.now(),
    });
  },
});
