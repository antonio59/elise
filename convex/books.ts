import { query, mutation, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import type { Doc } from "./_generated/dataModel";

async function withCoverUrls(ctx: QueryCtx, books: Doc<"books">[]) {
  return Promise.all(
    books.map(async (b) => ({
      ...b,
      coverImageUrl: b.coverStorageId
        ? await ctx.storage.getUrl(b.coverStorageId)
        : null,
    })),
  );
}

// Get all books (for authenticated user — single-user site, return all books)
export const getMyBooks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    const books = await ctx.db
      .query("books")
      .order("desc")
      .collect();
    return withCoverUrls(ctx, books);
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
    const allBooks = await ctx.db.query("books").order("desc").collect();
    return withCoverUrls(ctx, allBooks.filter((b) => b.status === args.status));
  },
});

// Get all read books (for public display)
export const getReadBooks = query({
  args: {},
  handler: async (ctx) => {
    const allBooks = await ctx.db.query("books").collect();
    return withCoverUrls(ctx, allBooks.filter((b) => b.status === "read" || b.status === "reading"));
  },
});

// Get wishlist books (for public display)
export const getWishlist = query({
  args: {},
  handler: async (ctx) => {
    const allBooks = await ctx.db.query("books").order("desc").collect();
    return withCoverUrls(ctx, allBooks.filter((b) => b.status === "wishlist"));
  },
});

// Get favorites
export const getFavorites = query({
  args: {},
  handler: async (ctx) => {
    const allBooks = await ctx.db.query("books").collect();
    return withCoverUrls(ctx, allBooks.filter((b) => b.isFavorite));
  },
});

// Check if a book already exists
export const checkDuplicate = query({
  args: {
    title: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedTitle = args.title.toLowerCase().trim();
    const normalizedAuthor = args.author.toLowerCase().trim();

    const userId = await auth.getUserId(ctx);
    if (!userId) return { exists: false };

    const userBooks = await ctx.db
      .query("books")
      .collect();
    const existingBook = userBooks.find(
      (b) =>
        b.title.toLowerCase().trim() === normalizedTitle &&
        b.author.toLowerCase().trim() === normalizedAuthor,
    );

    if (existingBook) {
      return {
        exists: true,
        status: existingBook.status,
        book: existingBook,
      };
    }

    return { exists: false };
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
    moodTags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check for duplicates
    const normalizedTitle = args.title.toLowerCase().trim();
    const normalizedAuthor = args.author.toLowerCase().trim();

    const userBooks = await ctx.db
      .query("books")
      .collect();
    const existingBook = userBooks.find(
      (b) =>
        b.title.toLowerCase().trim() === normalizedTitle &&
        b.author.toLowerCase().trim() === normalizedAuthor,
    );

    if (existingBook) {
      // If trying to add to same status, it's a true duplicate
      if (existingBook.status === args.status) {
        const statusMessage =
          existingBook.status === "read"
            ? "You've already read this book!"
            : existingBook.status === "reading"
              ? "You're already reading this book!"
              : "This book is already on your wishlist!";
        throw new Error(statusMessage);
      }
      // Otherwise, throw a special error that frontend can catch to offer status change
      throw new Error(`DUPLICATE:${existingBook._id}:${existingBook.status}`);
    }

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
    moodTags: v.optional(v.array(v.string())),
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

