import { query } from "./_generated/server";
import { v } from "convex/values";

export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    return {
      _id: user._id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt,
    };
  },
});

export const getStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const [books, artworks, reviews, followers, following] = await Promise.all([
      ctx.db
        .query("books")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect(),
      ctx.db
        .query("artworks")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect(),
      ctx.db
        .query("reviews")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect(),
      ctx.db
        .query("follows")
        .withIndex("by_following", (q) => q.eq("followingId", args.userId))
        .collect(),
      ctx.db
        .query("follows")
        .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
        .collect(),
    ]);

    const booksRead = books.filter((b) => b.status === "read").length;
    const booksReading = books.filter((b) => b.status === "reading").length;
    const totalPages = books.reduce((sum, b) => sum + (b.pagesRead ?? 0), 0);
    const favorites = books.filter((b) => b.isFavorite).length;

    const genreStats: Record<string, number> = {};
    books.forEach((b) => {
      if (b.genre) {
        genreStats[b.genre] = (genreStats[b.genre] || 0) + 1;
      }
    });

    return {
      books: books.length,
      booksRead,
      booksReading,
      artworks: artworks.length,
      artworksPublished: artworks.filter((a) => a.published).length,
      reviews: reviews.length,
      reviewsPublished: reviews.filter((r) => r.published).length,
      followers: followers.length,
      following: following.length,
      totalPages,
      favorites,
      genreStats,
    };
  },
});

export const getMyStats = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return null;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) return null;

    const userId = session.userId;

    const [books, artworks, reviews] = await Promise.all([
      ctx.db
        .query("books")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("artworks")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("reviews")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
    ]);

    const booksRead = books.filter((b) => b.status === "read").length;
    const booksReading = books.filter((b) => b.status === "reading").length;
    const totalPages = books.reduce((sum, b) => sum + (b.pagesRead ?? 0), 0);
    const favorites = books.filter((b) => b.isFavorite).length;

    const genreStats: Record<string, number> = {};
    books.forEach((b) => {
      if (b.genre) {
        genreStats[b.genre] = (genreStats[b.genre] || 0) + 1;
      }
    });

    // Calculate reading streak
    const finishedDates = books
      .filter((b) => b.finishedAt)
      .map((b) => new Date(b.finishedAt!).toDateString());
    const uniqueDates = [...new Set(finishedDates)];
    
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      if (uniqueDates.includes(checkDate.toDateString())) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      books: books.length,
      booksRead,
      booksReading,
      artworks: artworks.length,
      reviews: reviews.length,
      totalPages,
      favorites,
      genreStats,
      streak,
    };
  },
});
