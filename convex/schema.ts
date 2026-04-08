import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema(
  {
    // Convex Auth tables (users, sessions, accounts, etc.)
    ...authTables,

    // User profiles (extends auth user)
    userProfiles: defineTable({
      userId: v.id("users"),
      name: v.string(),
      username: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
      avatarStorageId: v.optional(v.id("_storage")),
      bio: v.optional(v.string()),
      favoriteGenres: v.optional(v.array(v.string())),
      readingGoal: v.optional(v.string()),
      isParent: v.boolean(),
      role: v.optional(v.union(v.literal("admin"), v.literal("viewer"))),
      theme: v.optional(
        v.union(
          v.literal("editorial"),
          v.literal("sakura"),
          v.literal("lavender"),
          v.literal("midnight"),
          v.literal("sunset"),
          v.literal("botanical"),
          v.literal("berry"),
          // Legacy values
          v.literal("light"),
          v.literal("dark"),
          v.literal("kawaii"),
        ),
      ),
      yearlyBookGoal: v.optional(v.number()),
      notifications: v.optional(v.boolean()),
      favoriteBook: v.optional(v.string()),
      rereads: v.optional(v.array(v.string())),
      favoriteQuote: v.optional(v.string()),
      funFact: v.optional(v.string()),
      currentlyReading: v.optional(v.string()),
    }).index("by_userId", ["userId"]),

    // Books
    books: defineTable({
      userId: v.id("users"),
      title: v.string(),
      author: v.string(),
      coverUrl: v.optional(v.string()),
      coverStorageId: v.optional(v.id("_storage")),
      isbn: v.optional(v.string()),
      genre: v.optional(v.string()),
      series: v.optional(v.string()),
      pageCount: v.optional(v.number()),
      pagesRead: v.optional(v.number()),
      pagesTotal: v.optional(v.number()), // Legacy field from old schema
      published: v.optional(v.boolean()), // Legacy field from old schema
      description: v.optional(v.string()),
      status: v.union(
        v.literal("reading"),
        v.literal("read"),
        v.literal("wishlist"),
      ),
      rating: v.optional(v.number()),
      review: v.optional(v.string()),
      isFavorite: v.boolean(),
      giftedBy: v.optional(v.string()),
      moodTags: v.optional(v.array(v.string())),
      startedAt: v.optional(v.number()),
      finishedAt: v.optional(v.number()),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_status", ["userId", "status"])
      .index("by_user_favorite", ["userId", "isFavorite"]),

    // Artworks
    artworks: defineTable({
      userId: v.id("users"),
      title: v.string(),
      description: v.optional(v.string()),
      imageUrl: v.string(),
      storageId: v.optional(v.id("_storage")),
      style: v.optional(v.string()),
      medium: v.optional(v.string()),
      seriesId: v.optional(v.id("artSeries")),
      tags: v.optional(v.array(v.string())),
      isPublished: v.boolean(),
      likes: v.optional(v.number()),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_published", ["isPublished"])
      .index("by_series", ["seriesId"]),

    // Art Series
    artSeries: defineTable({
      userId: v.id("users"),
      title: v.string(),
      description: v.optional(v.string()),
      coverImageUrl: v.optional(v.string()),
      isComplete: v.boolean(),
      createdAt: v.number(),
    }).index("by_user", ["userId"]),

    // Writings (poems, stories, journal entries)
    writings: defineTable({
      userId: v.id("users"),
      title: v.string(),
      content: v.string(),
      type: v.union(
        v.literal("poetry"),
        v.literal("story"),
        v.literal("journal"),
      ),
      genre: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      wordCount: v.number(),
      chapterCount: v.optional(v.number()),
      isFavorite: v.boolean(),
      isPublished: v.boolean(),
      coverUrl: v.optional(v.string()),
      coverStorageId: v.optional(v.id("_storage")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_type", ["userId", "type"])
      .index("by_published", ["isPublished"]),

    // Book suggestions from visitors
    bookSuggestions: defineTable({
      title: v.string(),
      author: v.string(),
      coverUrl: v.optional(v.string()),
      suggestedBy: v.string(),
      suggestedByEmail: v.optional(v.string()),
      reason: v.optional(v.string()),
      genre: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected"),
      ),
      createdAt: v.number(),
      reviewedAt: v.optional(v.number()),
    })
      .index("by_status", ["status"])
      .index("by_created", ["createdAt"]),

    // Reading goals
    readingGoals: defineTable({
      userId: v.id("users"),
      year: v.number(),
      targetBooks: v.number(),
      targetPages: v.optional(v.number()),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_year", ["userId", "year"]),

    // Site settings
    siteSettings: defineTable({
      siteName: v.optional(v.string()),
      heroTitle: v.optional(v.string()),
      heroSubtitle: v.optional(v.string()),
      heroDescription: v.optional(v.string()),
      footerTagline: v.optional(v.string()),
      footerNote: v.optional(v.string()),
      heroImageUrl: v.optional(v.string()),
      heroImageStorageId: v.optional(v.id("_storage")),
      updatedAt: v.number(),
    }),

    // Reading streaks (daily check-ins)
    readingStreaks: defineTable({
      userId: v.id("users"),
      date: v.string(), // "YYYY-MM-DD"
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_date", ["userId", "date"]),

    // Stickers left by visitors on books
    stickers: defineTable({
      targetType: v.literal("book"),
      targetId: v.string(),
      sticker: v.string(),
      visitorId: v.string(),
      createdAt: v.number(),
    })
      .index("by_target", ["targetType", "targetId"])
      .index("by_visitor_target", ["visitorId", "targetId"]),

    // Book discovery swipe decisions (Tinder-style recommendations)
    bookSwipes: defineTable({
      userId: v.id("users"),
      googleBookId: v.string(), // Google Books volume ID
      title: v.string(),
      author: v.string(),
      coverUrl: v.optional(v.string()),
      genre: v.optional(v.string()),
      pageCount: v.optional(v.number()),
      description: v.optional(v.string()),
      action: v.union(v.literal("liked"), v.literal("passed")),
      addedToWishlist: v.boolean(),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_action", ["userId", "action"])
      .index("by_user_googleBookId", ["userId", "googleBookId"]),

    // Reactions (emoji reactions on books, writings, artworks)
    reactions: defineTable({
      targetType: v.union(v.literal("book"), v.literal("writing"), v.literal("artwork")),
      targetId: v.string(), // ID of the book/writing/artwork
      emoji: v.string(), // the emoji used
      visitorId: v.string(), // anonymous visitor identifier (from sessionStorage)
      createdAt: v.number(),
    })
      .index("by_target", ["targetType", "targetId"])
      .index("by_target_emoji", ["targetType", "targetId", "emoji"])
      .index("by_visitor", ["visitorId", "targetType", "targetId"]),
  },
  // Temporarily disabled — re-enable after running cleanupBadAuthRecords migration
  { schemaValidation: false },
);
