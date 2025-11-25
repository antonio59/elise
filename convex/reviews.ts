import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    token: v.string(),
    bookTitle: v.string(),
    author: v.string(),
    rating: v.number(),
    moodColor: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("reviews", {
      userId: session.userId,
      bookTitle: args.bookTitle,
      author: args.author,
      rating: args.rating,
      moodColor: args.moodColor,
      content: args.content,
      imageUrl: args.imageUrl,
      storageId: args.storageId,
      published: args.published,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    reviewId: v.id("reviews"),
    rating: v.optional(v.number()),
    moodColor: v.optional(v.string()),
    content: v.optional(v.string()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const review = await ctx.db.get(args.reviewId);
    if (!review) throw new Error("Review not found");

    const user = await ctx.db.get(session.userId);
    if (review.userId !== session.userId && user?.role !== "parent") {
      throw new Error("Not authorized");
    }

    const updates: any = {};
    if (args.rating !== undefined) updates.rating = args.rating;
    if (args.moodColor !== undefined) updates.moodColor = args.moodColor;
    if (args.content !== undefined) updates.content = args.content;
    if (args.published !== undefined) updates.published = args.published;

    await ctx.db.patch(args.reviewId, updates);
    return await ctx.db.get(args.reviewId);
  },
});

export const remove = mutation({
  args: {
    token: v.string(),
    reviewId: v.id("reviews"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const review = await ctx.db.get(args.reviewId);
    if (!review) throw new Error("Review not found");

    const user = await ctx.db.get(session.userId);
    if (review.userId !== session.userId && user?.role !== "parent") {
      throw new Error("Not authorized");
    }

    if (review.storageId) {
      await ctx.storage.delete(review.storageId);
    }

    await ctx.db.delete(args.reviewId);
  },
});

export const getById = query({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.reviewId);
    if (!review) return null;

    const user = await ctx.db.get(review.userId);
    return {
      ...review,
      user: user ? {
        _id: user._id,
        username: user.username,
        avatarUrl: user.avatarUrl,
      } : null,
    };
  },
});

export const getPublished = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .take(args.limit ?? 50);

    return Promise.all(
      reviews.map(async (review) => {
        const user = await ctx.db.get(review.userId);
        return {
          ...review,
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
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    if (args.publishedOnly) {
      return reviews.filter((r) => r.published);
    }
    return reviews;
  },
});

export const getMyReviews = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return [];

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) return [];

    return await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .order("desc")
      .collect();
  },
});

export const getAllReviews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("reviews").order("desc").collect();
  },
});

export const getByBookTitle = query({
  args: { bookTitle: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_book", (q) => q.eq("bookTitle", args.bookTitle))
      .filter((q) => q.eq(q.field("published"), true))
      .order("desc")
      .collect();
  },
});
