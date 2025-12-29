import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Convex Auth tables (users, sessions, accounts, etc.)
  ...authTables,

  // User profiles (extends auth user)
  userProfiles: defineTable({
    userId: v.any(), // Allow any userId format for backward compatibility
    name: v.string(),
    username: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    isParent: v.boolean(),
    theme: v.optional(
      v.union(v.literal("light"), v.literal("dark"), v.literal("kawaii")),
    ),
    yearlyBookGoal: v.optional(v.number()),
    notifications: v.optional(v.boolean()),
  }).index("by_userId", ["userId"]),

  // Books
  books: defineTable({
    userId: v.any(), // Allow any userId format for backward compatibility
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
    startedAt: v.optional(v.number()),
    finishedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_user_favorite", ["userId", "isFavorite"]),

  // Artworks
  artworks: defineTable({
    userId: v.any(), // Allow any userId format for backward compatibility
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
    userId: v.any(), // Allow any userId format for backward compatibility
    title: v.string(),
    description: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    isComplete: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

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
    userId: v.any(), // Allow any userId format for backward compatibility
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
    heroImageUrl: v.optional(v.string()),
    heroImageStorageId: v.optional(v.id("_storage")),
    updatedAt: v.number(),
  }),
});
