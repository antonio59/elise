import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get all books for the authenticated user
export const getMyBooks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Get books by status
export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("reading"),
      v.literal("read"),
      v.literal("wishlist"),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("books")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", userId).eq("status", args.status),
      )
      .order("desc")
      .collect();
  },
});

// Get all read books (for public display)
export const getReadBooks = query({
  args: {},
  handler: async (ctx) => {
    const allBooks = await ctx.db.query("books").collect();
    return allBooks.filter((b) => b.status === "read");
  },
});

// Get favorites
export const getFavorites = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("books")
      .withIndex("by_user_favorite", (q) =>
        q.eq("userId", userId).eq("isFavorite", true),
      )
      .collect();
  },
});

// Add a book
export const add = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    isbn: v.optional(v.string()),
    genre: v.optional(v.string()),
    series: v.optional(v.string()),
    pageCount: v.optional(v.number()),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("reading"),
      v.literal("read"),
      v.literal("wishlist"),
    ),
    rating: v.optional(v.number()),
    review: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
    giftedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();
    return await ctx.db.insert("books", {
      ...args,
      userId,
      isFavorite: args.isFavorite ?? false,
      startedAt: args.status === "reading" ? now : undefined,
      finishedAt: args.status === "read" ? now : undefined,
      createdAt: now,
    });
  },
});

// Update a book
export const update = mutation({
  args: {
    id: v.id("books"),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    genre: v.optional(v.string()),
    series: v.optional(v.string()),
    pageCount: v.optional(v.number()),
    pagesRead: v.optional(v.number()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("reading"), v.literal("read"), v.literal("wishlist")),
    ),
    rating: v.optional(v.number()),
    review: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
    giftedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const book = await ctx.db.get(args.id);
    if (!book || book.userId !== userId) throw new Error("Book not found");

    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );

    // Set finishedAt when marking as read
    if (args.status === "read" && book.status !== "read") {
      (filteredUpdates as Record<string, unknown>).finishedAt = Date.now();
    }

    await ctx.db.patch(id, filteredUpdates);
  },
});

// Remove a book
export const remove = mutation({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const book = await ctx.db.get(args.id);
    if (!book || book.userId !== userId) throw new Error("Book not found");

    await ctx.db.delete(args.id);
  },
});

// Toggle favorite
export const toggleFavorite = mutation({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const book = await ctx.db.get(args.id);
    if (!book || book.userId !== userId) throw new Error("Book not found");

    await ctx.db.patch(args.id, { isFavorite: !book.isFavorite });
  },
});
