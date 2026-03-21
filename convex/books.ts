import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { api } from "./_generated/api";

// Get all books (for authenticated user)
export const getMyBooks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
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
    return allBooks.filter((b) => b.status === "read" || b.status === "reading");
  },
});

// Get wishlist books (for public display)
export const getWishlist = query({
  args: {},
  handler: async (ctx) => {
    const allBooks = await ctx.db.query("books").order("desc").collect();
    return allBooks.filter((b) => b.status === "wishlist");
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

// Check if a book already exists
export const checkDuplicate = query({
  args: {
    title: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedTitle = args.title.toLowerCase().trim();
    const normalizedAuthor = args.author.toLowerCase().trim();

    const allBooks = await ctx.db.query("books").collect();
    const existingBook = allBooks.find(
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

    const allBooks = await ctx.db.query("books").collect();
    const existingBook = allBooks.find(
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

// Seed books for a specific user (admin use)
export const seedBooks = mutation({
  args: {
    userId: v.any(),
    books: v.array(
      v.object({
        title: v.string(),
        author: v.string(),
        coverUrl: v.optional(v.string()),
        genre: v.optional(v.string()),
        pageCount: v.optional(v.number()),
        status: v.optional(
          v.union(
            v.literal("reading"),
            v.literal("read"),
            v.literal("wishlist"),
          ),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    let count = 0;
    for (const book of args.books) {
      // Check for duplicates
      const normalizedTitle = book.title.toLowerCase().trim();
      const normalizedAuthor = book.author.toLowerCase().trim();
      const allBooks = await ctx.db.query("books").collect();
      const existing = allBooks.find(
        (b) =>
          b.title.toLowerCase().trim() === normalizedTitle &&
          b.author.toLowerCase().trim() === normalizedAuthor,
      );
      if (existing) continue;

      await ctx.db.insert("books", {
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        genre: book.genre || "Other",
        pageCount: book.pageCount,
        status: book.status || "read",
        userId: args.userId,
        isFavorite: false,
        createdAt: Date.now(),
      });
      count++;
    }
    return `Added ${count} book(s)`;
  },
});

// Download and store a book cover permanently in Convex storage
export const storeCoverFromUrl = action({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const book = await ctx.runQuery(api.books.getById, { id: args.bookId });
    if (!book) throw new Error("Book not found");
    if (book.coverStorageId) return "Already stored";
    if (!book.coverUrl) return "No cover URL";

    // Fix HTML entities
    const url = book.coverUrl.replace(/&amp;/g, "&");

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch cover: ${response.status}`);

    const blob = await response.blob();
    const storageId = await ctx.storage.store(blob);

    await ctx.runMutation(api.books.updateCoverStorage, {
      bookId: args.bookId,
      coverStorageId: storageId,
    });

    return `Cover stored: ${storageId}`;
  },
});

// Update book with cover storage ID
export const updateCoverStorage = mutation({
  args: {
    bookId: v.id("books"),
    coverStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookId, { coverStorageId: args.coverStorageId });
  },
});

// Get book by ID (for actions to call)
export const getById = query({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Batch store covers for all books that have URLs but no storage
export const storeAllCovers = action({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.runQuery(api.books.getAllForCovers);
    let stored = 0;
    let skipped = 0;
    for (const book of books) {
      if (book.coverStorageId || !book.coverUrl) {
        skipped++;
        continue;
      }
      try {
        const url = book.coverUrl.replace(/&amp;/g, "&");
        const response = await fetch(url);
        if (!response.ok) { skipped++; continue; }
        const blob = await response.blob();
        const storageId = await ctx.storage.store(blob);
        await ctx.runMutation(api.books.updateCoverStorage, {
          bookId: book._id,
          coverStorageId: storageId,
        });
        stored++;
      } catch {
        skipped++;
      }
    }
    return `Stored ${stored} covers, skipped ${skipped}`;
  },
});

// Get all books with cover URLs (for batch operations)
export const getAllForCovers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("books").collect();
  },
});
