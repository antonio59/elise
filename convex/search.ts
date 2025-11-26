import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchAll = query({
  args: { query: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const searchQuery = args.query.toLowerCase();
    const limit = args.limit ?? 10;

    const allUsers = await ctx.db.query("users").collect();
    const users = allUsers
      .filter((u) => 
        u.username?.toLowerCase().includes(searchQuery) ||
        u.email.toLowerCase().includes(searchQuery)
      )
      .slice(0, limit)
      .map((u) => ({
        _id: u._id,
        type: "user" as const,
        title: u.username || u.email.split("@")[0],
        subtitle: u.bio || "",
        imageUrl: u.avatarUrl,
      }));

    const allReviews = await ctx.db
      .query("reviews")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
    const reviews = allReviews
      .filter((r) =>
        r.bookTitle.toLowerCase().includes(searchQuery) ||
        r.author.toLowerCase().includes(searchQuery) ||
        r.content.toLowerCase().includes(searchQuery)
      )
      .slice(0, limit)
      .map((r) => ({
        _id: r._id,
        type: "review" as const,
        title: r.bookTitle,
        subtitle: `by ${r.author}`,
        imageUrl: r.imageUrl,
      }));

    const allArtworks = await ctx.db
      .query("artworks")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
    const artworks = allArtworks
      .filter((a) =>
        a.title?.toLowerCase().includes(searchQuery) ||
        a.style?.toLowerCase().includes(searchQuery)
      )
      .slice(0, limit)
      .map((a) => ({
        _id: a._id,
        type: "artwork" as const,
        title: a.title || "Untitled",
        subtitle: a.style || "",
        imageUrl: a.imageUrl,
      }));

    return { users, reviews, artworks };
  },
});

export const getRecommendations = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return { byGenre: [], popular: [] };

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) return { byGenre: [], popular: [] };

    const myBooks = await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .collect();

    const genreCounts: Record<string, number> = {};
    myBooks.forEach((b) => {
      if (b.genre) {
        genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
      }
    });

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    const allReviews = await ctx.db
      .query("reviews")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .take(100);

    const myBookTitles = new Set(myBooks.map((b) => b.title.toLowerCase()));
    
    const reviewsNotInShelf = allReviews.filter(
      (r) => !myBookTitles.has(r.bookTitle.toLowerCase())
    );

    const reviewCounts: Record<string, { count: number; rating: number; review: typeof allReviews[0] }> = {};
    reviewsNotInShelf.forEach((r) => {
      const key = r.bookTitle.toLowerCase();
      if (!reviewCounts[key]) {
        reviewCounts[key] = { count: 0, rating: 0, review: r };
      }
      reviewCounts[key].count++;
      reviewCounts[key].rating += r.rating;
    });

    const popular = Object.values(reviewCounts)
      .map((r) => ({
        ...r.review,
        avgRating: r.rating / r.count,
        reviewCount: r.count,
      }))
      .sort((a, b) => b.reviewCount - a.reviewCount || b.avgRating - a.avgRating)
      .slice(0, 6);

    return {
      topGenres,
      popular: popular.map((r) => ({
        bookTitle: r.bookTitle,
        author: r.author,
        avgRating: r.avgRating,
        reviewCount: r.reviewCount,
        imageUrl: r.imageUrl,
      })),
    };
  },
});
