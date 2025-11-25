import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    rating: v.optional(v.number()),
    status: v.union(v.literal("reading"), v.literal("read"), v.literal("wishlist")),
    genre: v.optional(v.string()),
    pagesTotal: v.optional(v.number()),
    pagesRead: v.optional(v.number()),
    isFavorite: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("books", {
      userId: session.userId,
      title: args.title,
      author: args.author,
      coverUrl: args.coverUrl,
      rating: args.status === "read" ? args.rating : undefined,
      status: args.status,
      genre: args.genre,
      pagesTotal: args.pagesTotal,
      pagesRead: args.pagesRead,
      isFavorite: args.isFavorite ?? false,
      finishedAt: args.status === "read" ? Date.now() : undefined,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    bookId: v.id("books"),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    rating: v.optional(v.number()),
    status: v.optional(v.union(v.literal("reading"), v.literal("read"), v.literal("wishlist"))),
    genre: v.optional(v.string()),
    pagesTotal: v.optional(v.number()),
    pagesRead: v.optional(v.number()),
    isFavorite: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const book = await ctx.db.get(args.bookId);
    if (!book) throw new Error("Book not found");

    const user = await ctx.db.get(session.userId);
    if (book.userId !== session.userId && user?.role !== "parent") {
      throw new Error("Not authorized");
    }

    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.author !== undefined) updates.author = args.author;
    if (args.coverUrl !== undefined) updates.coverUrl = args.coverUrl;
    if (args.rating !== undefined) updates.rating = args.rating;
    if (args.status !== undefined) {
      updates.status = args.status;
      if (args.status === "read" && book.status !== "read") {
        updates.finishedAt = Date.now();
      }
    }
    if (args.genre !== undefined) updates.genre = args.genre;
    if (args.pagesTotal !== undefined) updates.pagesTotal = args.pagesTotal;
    if (args.pagesRead !== undefined) updates.pagesRead = args.pagesRead;
    if (args.isFavorite !== undefined) updates.isFavorite = args.isFavorite;

    await ctx.db.patch(args.bookId, updates);
    return await ctx.db.get(args.bookId);
  },
});

export const remove = mutation({
  args: {
    token: v.string(),
    bookId: v.id("books"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const book = await ctx.db.get(args.bookId);
    if (!book) throw new Error("Book not found");

    const user = await ctx.db.get(session.userId);
    if (book.userId !== session.userId && user?.role !== "parent") {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.bookId);
  },
});

export const getById = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.bookId);
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getMyBooks = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return [];

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) return [];

    return await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .order("desc")
      .collect();
  },
});

export const getAllBooks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("books").order("desc").collect();
  },
});

export const toggleFavorite = mutation({
  args: {
    token: v.string(),
    bookId: v.id("books"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const book = await ctx.db.get(args.bookId);
    if (!book || book.userId !== session.userId) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.bookId, { isFavorite: !book.isFavorite });
    return await ctx.db.get(args.bookId);
  },
});
