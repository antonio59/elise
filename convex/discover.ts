/* eslint-disable @typescript-eslint/no-explicit-any */
import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get user's reading profile for recommendations
export const getReadingProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const books = await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const readBooks = books.filter((b) => b.status === "read");
    const favoriteBooks = books.filter((b) => b.isFavorite);

    // Count genre frequency
    const genreCounts: Record<string, number> = {};
    for (const book of readBooks) {
      const genre = book.genre || "Other";
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      // Favorites count double
      if (book.isFavorite) {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      }
    }

    // Count mood tag frequency
    const moodCounts: Record<string, number> = {};
    for (const book of readBooks) {
      for (const mood of book.moodTags ?? []) {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        if (book.isFavorite) {
          moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        }
      }
    }

    // Get top authors
    const authorCounts: Record<string, number> = {};
    for (const book of readBooks) {
      authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
    }

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre]) => genre);

    const topMoods = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([mood]) => mood);

    const topAuthors = Object.entries(authorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([author]) => author);

    // Get highly rated book titles for "similar to" searches
    const highlyRated = readBooks
      .filter((b) => (b.rating ?? 0) >= 4)
      .slice(0, 5)
      .map((b) => b.title);

    return {
      totalRead: readBooks.length,
      totalFavorites: favoriteBooks.length,
      topGenres,
      topMoods,
      topAuthors,
      highlyRated,
    };
  },
});

// Get all swiped book IDs for the user (to avoid re-showing)
export const getSwipedIds = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const swipes = await ctx.db
      .query("bookSwipes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return swipes.map((s) => s.googleBookId);
  },
});

// Get user's existing book titles (to exclude from recommendations)
export const getExistingBookKeys = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const books = await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return books.map((b) => `${b.title.toLowerCase().trim()}::${b.author.toLowerCase().trim()}`);
  },
});

// Fetch recommendation candidates from Google Books
export const fetchRecommendations = action({
  args: {
    searchQuery: v.string(),
    startIndex: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const keyParam = apiKey ? `&key=${apiKey}` : "";
    const startIndex = args.startIndex ?? 0;

    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(args.searchQuery)}&maxResults=20&startIndex=${startIndex}&orderBy=relevance&langRestrict=en${keyParam}`
    );
    const data = await res.json();

    if (data.error) {
      return [];
    }

    return (data.items ?? []).map((item: Record<string, any>) => {
      const imageLinks = item.volumeInfo?.imageLinks ?? {};
      const rawCoverUrl = (
        imageLinks.extraLarge ??
        imageLinks.large ??
        imageLinks.medium ??
        imageLinks.thumbnail ??
        imageLinks.smallThumbnail ??
        ""
      ).replace("http://", "https://");

      let coverUrl = rawCoverUrl;
      try {
        if (rawCoverUrl) {
          const u = new URL(rawCoverUrl);
          if (u.hostname === "books.google.com" || u.hostname.endsWith(".books.google.com")) {
            u.searchParams.set("zoom", "3");
            coverUrl = u.toString();
          }
        }
      } catch { /* leave as-is */ }

      return {
        googleBookId: item.id as string,
        title: (item.volumeInfo?.title as string) || "Unknown Title",
        author: ((item.volumeInfo?.authors as string[]) ?? []).join(", ") || "Unknown Author",
        coverUrl,
        pageCount: (item.volumeInfo?.pageCount as number) ?? 0,
        description: (item.volumeInfo?.description as string) ?? "",
        categories: (item.volumeInfo?.categories as string[]) ?? [],
      };
    });
  },
});

// Record a swipe decision
export const recordSwipe = mutation({
  args: {
    googleBookId: v.string(),
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    genre: v.optional(v.string()),
    pageCount: v.optional(v.number()),
    description: v.optional(v.string()),
    action: v.union(v.literal("liked"), v.literal("passed")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already swiped
    const existing = await ctx.db
      .query("bookSwipes")
      .withIndex("by_user_googleBookId", (q) =>
        q.eq("userId", userId).eq("googleBookId", args.googleBookId)
      )
      .first();

    if (existing) return existing._id;

    const swipeId = await ctx.db.insert("bookSwipes", {
      userId,
      googleBookId: args.googleBookId,
      title: args.title,
      author: args.author,
      coverUrl: args.coverUrl,
      genre: args.genre,
      pageCount: args.pageCount,
      description: args.description,
      action: args.action,
      addedToWishlist: false,
      createdAt: Date.now(),
    });

    // If liked, auto-add to wishlist
    if (args.action === "liked") {
      // Check if book already exists
      const userBooks = await ctx.db
        .query("books")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

      const normalizedTitle = args.title.toLowerCase().trim();
      const normalizedAuthor = args.author.toLowerCase().trim();
      const alreadyExists = userBooks.some(
        (b) =>
          b.title.toLowerCase().trim() === normalizedTitle &&
          b.author.toLowerCase().trim() === normalizedAuthor
      );

      if (!alreadyExists) {
        await ctx.db.insert("books", {
          userId,
          title: args.title,
          author: args.author,
          coverUrl: args.coverUrl,
          genre: args.genre,
          pageCount: args.pageCount,
          description: args.description,
          status: "wishlist",
          isFavorite: false,
          createdAt: Date.now(),
        });

        await ctx.db.patch(swipeId, { addedToWishlist: true });
      }
    }

    return swipeId;
  },
});

// Get swipe stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return { liked: 0, passed: 0, addedToWishlist: 0 };

    const swipes = await ctx.db
      .query("bookSwipes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return {
      liked: swipes.filter((s) => s.action === "liked").length,
      passed: swipes.filter((s) => s.action === "passed").length,
      addedToWishlist: swipes.filter((s) => s.addedToWishlist).length,
    };
  },
});

// Get recently liked books
export const getRecentLikes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const liked = await ctx.db
      .query("bookSwipes")
      .withIndex("by_user_action", (q) =>
        q.eq("userId", userId).eq("action", "liked")
      )
      .order("desc")
      .take(10);

    return liked;
  },
});
