import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import {
  userProfileOptionalFields,
  userProfileExtendedFields,
} from "./lib/validators";
import { requireProfile } from "./lib/crud";
export { isAdmin } from "./lib/admin";

// Get current authenticated user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) {
      // User ID exists but no user record - return minimal info
      return {
        _id: userId,
        email: "",
        name: "User",
      };
    }

    // Return a normalized user object
    return {
      _id: user._id,
      email: (user as { email?: string }).email || "",
      name: (user as { name?: string }).name || "User",
    };
  },
});

// Get user profile
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

// Create user profile (called after signup)
export const createProfile = mutation({
  args: {
    name: v.string(),
    ...userProfileOptionalFields,
    isParent: v.boolean(),
    ...userProfileExtendedFields,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    // Check if profile already exists
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) return existing._id;

    // Auto-assign admin role to the first user
    const existingProfiles = await ctx.db.query("userProfiles").collect();
    const role = existingProfiles.length === 0 ? "admin" : "viewer";

    return await ctx.db.insert("userProfiles", {
      userId,
      name: args.name,
      username: args.username,
      isParent: args.isParent,
      theme: args.theme as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      yearlyBookGoal: args.yearlyBookGoal,
      notifications: args.notifications,
      role,
    });
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    ...userProfileOptionalFields,
    ...userProfileExtendedFields,
  },
  handler: async (ctx, args) => {
    const profile = await requireProfile(ctx);

    const filteredUpdates = Object.fromEntries(
      Object.entries(args).filter(([, value]) => value !== undefined),
    );
    await ctx.db.patch(profile._id, filteredUpdates);
  },
});

// Mark onboarding as seen
export const setOnboardingSeen = mutation({
  args: {},
  handler: async (ctx) => {
    const profile = await requireProfile(ctx);

    await ctx.db.patch(profile._id, { hasSeenOnboarding: true });
  },
});

// Get site-wide reading stats (single user)
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db.query("userProfiles").first();
    const userId = profile?.userId;

    if (!userId) {
      return {
        booksRead: 0,
        booksReading: 0,
        booksWishlist: 0,
        totalBooks: 0,
        totalPages: 0,
        favorites: 0,
        totalArtworks: 0,
        publishedArtworks: 0,
      };
    }

    const [readBooks, readingBooks, wishlistBooks, favoriteBooks, allArtworks, allPhotos] = await Promise.all([
      ctx.db
        .query("books")
        .withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "read"))
        .collect(),
      ctx.db
        .query("books")
        .withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "reading"))
        .collect(),
      ctx.db
        .query("books")
        .withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "wishlist"))
        .collect(),
      ctx.db
        .query("books")
        .withIndex("by_user_favorite", (q) => q.eq("userId", userId).eq("isFavorite", true))
        .collect(),
      ctx.db.query("artworks").collect(),
      ctx.db.query("photos").collect(),
    ]);

    const totalBooks = readBooks.length + readingBooks.length + wishlistBooks.length;
    const totalPages = [...readBooks, ...readingBooks, ...wishlistBooks].reduce(
      (sum, b) => sum + (b.pageCount || 0),
      0,
    );

    return {
      booksRead: readBooks.length,
      booksReading: readingBooks.length,
      booksWishlist: wishlistBooks.length,
      totalBooks,
      totalPages,
      favorites: favoriteBooks.length,
      totalArtworks: allArtworks.length,
      publishedArtworks: allArtworks.filter((a) => a.isPublished).length,
      totalPhotos: allPhotos.length,
      publishedPhotos: allPhotos.filter((p) => p.isPublished).length,
    };
  },
});

// Generate upload URL for avatar
export const generateAvatarUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

// Get public profile (for About page — no auth required)
export const getPublicProfile = query({
  handler: async (ctx) => {
    // Get the first user profile (since this is a single-user site)
    const profile = await ctx.db.query("userProfiles").first();
    if (!profile) return null;

    const avatarUrl = profile.avatarStorageId
      ? await ctx.storage.getUrl(profile.avatarStorageId)
      : profile.avatarUrl ?? null;

    // Get currently reading book
    const currentlyReading = await ctx.db
      .query("books")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", profile.userId).eq("status", "reading"),
      )
      .first();

    return {
      name: profile.name,
      username: profile.username,
      avatarUrl,
      bio: profile.bio,
      favoriteGenres: profile.favoriteGenres,
      readingGoal: profile.readingGoal,
      yearlyBookGoal: profile.yearlyBookGoal,
      favoriteBook: profile.favoriteBook,
      rereads: profile.rereads,
      favoriteQuote: profile.favoriteQuote,
      funFact: profile.funFact,
      currentlyReading: currentlyReading
        ? {
            title: currentlyReading.title,
            author: currentlyReading.author,
            coverUrl: currentlyReading.coverUrl,
            coverStorageId: currentlyReading.coverStorageId,
            pagesRead: currentlyReading.pagesRead,
            pageCount: currentlyReading.pageCount,
          }
        : null,
    };
  },
});
