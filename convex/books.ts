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
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    coverStorageId: v.optional(v.id("_storage")),
    rating: v.optional(v.number()),
    review: v.optional(v.string()),
    status: v.union(
      v.literal("reading"),
      v.literal("read"),
      v.literal("wishlist"),
    ),
    genre: v.optional(v.string()),
    series: v.optional(v.string()),
    published: v.optional(v.boolean()),
    pagesTotal: v.optional(v.number()),
    pagesRead: v.optional(v.number()),
    isFavorite: v.optional(v.boolean()),
    giftedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.token);

    const title = sanitizePlainText(args.title, 200) || args.title.trim();
    const author = sanitizePlainText(args.author, 120) || args.author.trim();
    const genre = sanitizePlainText(args.genre, 80);
    const series = sanitizePlainText(args.series, 120);
    const review = sanitizePlainText(args.review, 1200);
    const giftedBy = sanitizePlainText(args.giftedBy, 100);

    let coverUrl =
      sanitizeOptionalUrl(args.coverUrl) ||
      sanitizePlainText(args.coverUrl, 500);
    const pagesTotal =
      args.pagesTotal !== undefined ? Math.max(0, args.pagesTotal) : undefined;
    let pagesRead =
      args.pagesRead !== undefined ? Math.max(0, args.pagesRead) : undefined;
    if (pagesTotal !== undefined && pagesRead !== undefined) {
      pagesRead = Math.min(pagesRead, pagesTotal);
    }
    if (args.coverStorageId) {
      coverUrl = (await ctx.storage.getUrl(args.coverStorageId)) || undefined;
    }

    return await ctx.db.insert("books", {
      userId: session.userId,
      title: title!,
      author: author!,
      coverUrl: coverUrl,
      coverStorageId: args.coverStorageId,
      rating: args.rating,
      review,
      status: args.status,
      genre,
      series,
      published: args.published ?? false,
      pagesTotal,
      pagesRead,
      isFavorite: args.isFavorite ?? false,
      finishedAt: args.status === "read" ? Date.now() : undefined,
      giftedBy,
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
    status: v.optional(
      v.union(v.literal("reading"), v.literal("read"), v.literal("wishlist")),
    ),
    genre: v.optional(v.string()),
    series: v.optional(v.string()),
    published: v.optional(v.boolean()),
    pagesTotal: v.optional(v.number()),
    pagesRead: v.optional(v.number()),
    isFavorite: v.optional(v.boolean()),
    giftedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.token);

    const book = await ctx.db.get(args.bookId);
    if (!book) throw new Error("Book not found");

    const user = await ctx.db.get(session.userId);
    if (book.userId !== session.userId && user?.role !== "parent") {
      throw new Error("Not authorized");
    }

    const updates: any = {};
    if (args.title !== undefined)
      updates.title = sanitizePlainText(args.title, 200);
    if (args.author !== undefined)
      updates.author = sanitizePlainText(args.author, 120);
    if (args.coverUrl !== undefined)
      updates.coverUrl =
        sanitizeOptionalUrl(args.coverUrl) ||
        sanitizePlainText(args.coverUrl, 500);
    if (args.rating !== undefined) updates.rating = args.rating;
    if (args.status !== undefined) {
      updates.status = args.status;
      if (args.status === "read" && book.status !== "read") {
        updates.finishedAt = Date.now();
      }
    }
    if (args.genre !== undefined)
      updates.genre = sanitizePlainText(args.genre, 80);
    if (args.series !== undefined)
      updates.series = sanitizePlainText(args.series, 120);
    if (args.published !== undefined) updates.published = args.published;
    if (args.pagesTotal !== undefined)
      updates.pagesTotal = Math.max(0, args.pagesTotal);
    if (args.pagesRead !== undefined) {
      const safeRead = Math.max(0, args.pagesRead);
      const total = updates.pagesTotal ?? book.pagesTotal;
      updates.pagesRead = total ? Math.min(safeRead, total) : safeRead;
    }
    if (args.isFavorite !== undefined) updates.isFavorite = args.isFavorite;
    if (args.giftedBy !== undefined)
      updates.giftedBy = sanitizePlainText(args.giftedBy, 100);

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
    const session = await requireSession(ctx, args.token);

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
  args: { bookId: v.id("books"), token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.bookId);
    if (!book) return null;

    if (book.published) return book;

    if (!args.token) return null;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token!))
      .first();

    if (!session || session.expiresAt < Date.now()) return null;

    if (session.userId === book.userId) return book;

    const user = await ctx.db.get(session.userId);
    if (user?.role === "parent") return book;

    return null;
  },
});

export const getByUser = query({
  args: { userId: v.id("users"), publishedOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const books = await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    if (args.publishedOnly) {
      return books.filter((b) => b.published);
    }

    return books;
  },
});

export const getMyBooks = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return [];
    const token = args.token;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
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
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.token);
    const user = await ctx.db.get(session.userId);

    if (user?.role === "parent") {
      return await ctx.db.query("books").order("desc").collect();
    }

    return await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .order("desc")
      .collect();
  },
});

export const getPublicBooks = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const books = await ctx.db
      .query("books")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .take(args.limit ?? 30);

    return Promise.all(
      books.map(async (book) => {
        const user = await ctx.db.get(book.userId);
        return {
          _id: book._id,
          title: book.title,
          author: book.author,
          coverUrl: book.coverUrl,
          rating: book.rating,
          review: book.review,
          genre: book.genre,
          series: book.series,
          status: book.status,
          pagesTotal: book.pagesTotal,
          pagesRead: book.pagesRead,
          createdAt: book.createdAt,
          user: user
            ? {
                _id: user._id,
                username: user.username,
                avatarUrl: user.avatarUrl,
              }
            : null,
        };
      }),
    );
  },
});

export const getGifters = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.token);

    const books = await ctx.db.query("books").collect();
    const gifters = new Set<string>();

    for (const book of books) {
      if (book.giftedBy) {
        gifters.add(book.giftedBy);
      }
    }

    return Array.from(gifters).sort();
  },
});

export const getByGifter = query({
  args: { token: v.string(), gifter: v.string() },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.token);

    const books = await ctx.db
      .query("books")
      .withIndex("by_gifted_by", (q) => q.eq("giftedBy", args.gifter))
      .order("desc")
      .collect();

    return books;
  },
});

export const toggleFavorite = mutation({
  args: {
    token: v.string(),
    bookId: v.id("books"),
  },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.token);

    const book = await ctx.db.get(args.bookId);
    if (!book || book.userId !== session.userId) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.bookId, { isFavorite: !book.isFavorite });
    return await ctx.db.get(args.bookId);
  },
});
