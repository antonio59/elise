import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get current authenticated user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    return await ctx.db.get(userId);
  },
});

// Get user profile
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

// Create user profile (called after signup)
export const createProfile = mutation({
  args: {
    name: v.string(),
    username: v.optional(v.string()),
    isParent: v.boolean(),
    theme: v.optional(
      v.union(v.literal("light"), v.literal("dark"), v.literal("kawaii")),
    ),
    yearlyBookGoal: v.optional(v.number()),
    notifications: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if profile already exists
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("userProfiles", {
      userId,
      ...args,
    });
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    theme: v.optional(
      v.union(v.literal("light"), v.literal("dark"), v.literal("kawaii")),
    ),
    yearlyBookGoal: v.optional(v.number()),
    notifications: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    const filteredUpdates = Object.fromEntries(
      Object.entries(args).filter(([, value]) => value !== undefined),
    );
    await ctx.db.patch(profile._id, filteredUpdates);
  },
});

// Get reading stats for current user
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const books = await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const artworks = await ctx.db
      .query("artworks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const booksRead = books.filter((b) => b.status === "read").length;
    const booksReading = books.filter((b) => b.status === "reading").length;
    const booksWishlist = books.filter((b) => b.status === "wishlist").length;
    const totalPages = books.reduce((sum, b) => sum + (b.pageCount || 0), 0);
    const favorites = books.filter((b) => b.isFavorite).length;
    const totalArtworks = artworks.length;
    const publishedArtworks = artworks.filter((a) => a.isPublished).length;

    return {
      booksRead,
      booksReading,
      booksWishlist,
      totalBooks: books.length,
      totalPages,
      favorites,
      totalArtworks,
      publishedArtworks,
    };
  },
});
