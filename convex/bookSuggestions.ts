import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get all suggestions (for admin)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bookSuggestions").order("desc").collect();
  },
});

// Get pending suggestions (for admin)
export const getPending = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("bookSuggestions").order("desc").collect();
    return all.filter((s) => s.status === "pending");
  },
});

// Check if a book already exists (for duplicate detection)
export const checkDuplicate = query({
  args: {
    title: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedTitle = args.title.toLowerCase().trim();
    const normalizedAuthor = args.author.toLowerCase().trim();

    // Check in books table
    const allBooks = await ctx.db.query("books").collect();
    const existingBook = allBooks.find(
      (b) =>
        b.title.toLowerCase().trim() === normalizedTitle &&
        b.author.toLowerCase().trim() === normalizedAuthor,
    );

    if (existingBook) {
      return {
        exists: true,
        location:
          existingBook.status === "read"
            ? "already read"
            : existingBook.status === "reading"
              ? "currently reading"
              : "already on wishlist",
        book: existingBook,
      };
    }

    // Check in pending suggestions
    const allSuggestions = await ctx.db.query("bookSuggestions").collect();
    const existingSuggestion = allSuggestions.find(
      (s) =>
        s.status === "pending" &&
        s.title.toLowerCase().trim() === normalizedTitle &&
        s.author.toLowerCase().trim() === normalizedAuthor,
    );

    if (existingSuggestion) {
      return {
        exists: true,
        location: "already suggested",
        suggestion: existingSuggestion,
      };
    }

    return { exists: false };
  },
});

// Submit a book suggestion (public - no auth required)
export const submit = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    suggestedBy: v.string(),
    suggestedByEmail: v.optional(v.string()),
    reason: v.optional(v.string()),
    genre: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const normalizedTitle = args.title.toLowerCase().trim();
    const normalizedAuthor = args.author.toLowerCase().trim();

    // Check for duplicates in books
    const allBooks = await ctx.db.query("books").collect();
    const existingBook = allBooks.find(
      (b) =>
        b.title.toLowerCase().trim() === normalizedTitle &&
        b.author.toLowerCase().trim() === normalizedAuthor,
    );

    if (existingBook) {
      const location =
        existingBook.status === "read"
          ? "I've already read this book!"
          : existingBook.status === "reading"
            ? "I'm currently reading this book!"
            : "This book is already on my wishlist!";
      throw new Error(location);
    }

    // Check for duplicate pending suggestions
    const allSuggestions = await ctx.db.query("bookSuggestions").collect();
    const existingSuggestion = allSuggestions.find(
      (s) =>
        s.status === "pending" &&
        s.title.toLowerCase().trim() === normalizedTitle &&
        s.author.toLowerCase().trim() === normalizedAuthor,
    );

    if (existingSuggestion) {
      throw new Error("This book has already been suggested!");
    }

    return await ctx.db.insert("bookSuggestions", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

// Approve a suggestion (requires auth)
export const approve = mutation({
  args: { id: v.id("bookSuggestions") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.id, {
      status: "approved",
      reviewedAt: Date.now(),
    });
  },
});

// Reject a suggestion (requires auth)
export const reject = mutation({
  args: { id: v.id("bookSuggestions") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.id, {
      status: "rejected",
      reviewedAt: Date.now(),
    });
  },
});

// Delete a suggestion (requires auth)
export const remove = mutation({
  args: { id: v.id("bookSuggestions") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.delete(args.id);
  },
});

// Add approved suggestion to books (requires auth)
export const addToBooks = mutation({
  args: { id: v.id("bookSuggestions") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const suggestion = await ctx.db.get(args.id);
    if (!suggestion) throw new Error("Suggestion not found");

    // Add to wishlist
    await ctx.db.insert("books", {
      userId,
      title: suggestion.title,
      author: suggestion.author,
      coverUrl: suggestion.coverUrl,
      genre: suggestion.genre,
      status: "wishlist",
      isFavorite: false,
      giftedBy: suggestion.suggestedBy,
      createdAt: Date.now(),
    });

    // Mark as approved
    await ctx.db.patch(args.id, {
      status: "approved",
      reviewedAt: Date.now(),
    });
  },
});
