import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get all books (site-wide, not user-specific)
export const getMyBooks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("books").order("desc").collect();
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
    const allBooks = await ctx.db.query("books").order("desc").collect();
    return allBooks.filter((b) => b.status === args.status);
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
    const allBooks = await ctx.db.query("books").collect();
    return allBooks.filter((b) => b.isFavorite);
  },
});

// Add a book (requires auth)
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
      userId, // Track who added it, but don't filter by it
      isFavorite: args.isFavorite ?? false,
      startedAt: args.status === "reading" ? now : undefined,
      finishedAt: args.status === "read" ? now : undefined,
      createdAt: now,
    });
  },
});

// Update a book (requires auth)
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
    if (!book) throw new Error("Book not found");

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

// Remove a book (requires auth)
export const remove = mutation({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const book = await ctx.db.get(args.id);
    if (!book) throw new Error("Book not found");

    await ctx.db.delete(args.id);
  },
});

// Toggle favorite (requires auth)
export const toggleFavorite = mutation({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const book = await ctx.db.get(args.id);
    if (!book) throw new Error("Book not found");

    await ctx.db.patch(args.id, { isFavorite: !book.isFavorite });
  },
});
