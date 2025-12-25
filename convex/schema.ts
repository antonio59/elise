import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal("child"), v.literal("parent")),
    username: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  books: defineTable({
    userId: v.id("users"),
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    coverStorageId: v.optional(v.id("_storage")),
    rating: v.optional(v.number()),
    review: v.optional(v.string()),
    status: v.union(v.literal("reading"), v.literal("read"), v.literal("wishlist")),
    genre: v.optional(v.string()),
    series: v.optional(v.string()),
    published: v.optional(v.boolean()),
    pagesTotal: v.optional(v.number()),
    pagesRead: v.optional(v.number()),
    isFavorite: v.boolean(),
    finishedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_user_favorite", ["userId", "isFavorite"])
    .index("by_published", ["published"]),

  artSeries: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  artworks: defineTable({
    userId: v.id("users"),
    title: v.optional(v.string()),
    style: v.optional(v.string()),
    imageUrl: v.string(),
    storageId: v.optional(v.id("_storage")),
    published: v.boolean(),
    seriesId: v.optional(v.id("artSeries")),
    seriesOrder: v.optional(v.number()),
    dateDrawn: v.optional(v.string()),
    thoughts: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_published", ["published"])
    .index("by_series", ["seriesId"]),

  siteSettings: defineTable({
    heroTitle: v.optional(v.string()),
    heroSubtitle: v.optional(v.string()),
    heroDescription: v.optional(v.string()),
    heroImageUrl: v.optional(v.string()),
    heroImageStorageId: v.optional(v.id("_storage")),
    siteName: v.optional(v.string()),
    updatedAt: v.number(),
  }),

  reviews: defineTable({
    userId: v.id("users"),
    bookTitle: v.string(),
    author: v.string(),
    rating: v.number(),
    ratingType: v.optional(v.string()),
    moodColor: v.string(),
    content: v.string(),
    richContent: v.optional(v.string()),
    stickers: v.optional(v.array(v.object({
      id: v.string(),
      emoji: v.string(),
      x: v.number(),
      y: v.number(),
      isCustom: v.optional(v.boolean()),
      imageUrl: v.optional(v.string()),
    }))),
    gifs: v.optional(v.array(v.object({
      id: v.string(),
      url: v.string(),
      width: v.number(),
      height: v.number(),
    }))),
    imageUrl: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    published: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_published", ["published"])
    .index("by_book", ["bookTitle"]),

  userPreferences: defineTable({
    userId: v.id("users"),
    preferredRatingType: v.optional(v.string()),
    customStickers: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      imageUrl: v.string(),
      artworkId: v.optional(v.id("artworks")),
    }))),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  likes: defineTable({
    visitorId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    contentId: v.string(),
    contentType: v.union(v.literal("artwork"), v.literal("review"), v.literal("book")),
    reactionType: v.optional(v.union(v.literal("like"), v.literal("love"))),
    createdAt: v.number(),
  })
    .index("by_content", ["contentId"])
    .index("by_user_content", ["userId", "contentId"])
    .index("by_visitor_content", ["visitorId", "contentId"]),

  shares: defineTable({
    contentId: v.string(),
    contentType: v.union(v.literal("artwork"), v.literal("review"), v.literal("book")),
    platform: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_content", ["contentId"]),

  stickers: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    storageId: v.optional(v.id("_storage")),
    category: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_category", ["category"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_pair", ["followerId", "followingId"]),

  readingStreaks: defineTable({
    userId: v.id("users"),
    date: v.string(),
    pagesRead: v.number(),
    booksFinished: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("like"), v.literal("follow"), v.literal("achievement"), v.literal("goal")),
    message: v.string(),
    fromUserId: v.optional(v.id("users")),
    contentId: v.optional(v.string()),
    contentType: v.optional(v.string()),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_unread", ["userId", "read"]),

  readingGoals: defineTable({
    userId: v.id("users"),
    year: v.number(),
    targetBooks: v.number(),
    targetPages: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_year", ["userId", "year"]),

  rateLimits: defineTable({
    identifier: v.string(),
    action: v.string(),
    count: v.number(),
    windowExpiresAt: v.number(),
  }).index("by_identifier_action", ["identifier", "action"]),
});
