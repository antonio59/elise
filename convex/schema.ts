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
    rating: v.optional(v.number()),
    status: v.union(v.literal("reading"), v.literal("read"), v.literal("wishlist")),
    genre: v.optional(v.string()),
    pagesTotal: v.optional(v.number()),
    pagesRead: v.optional(v.number()),
    isFavorite: v.boolean(),
    finishedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_user_favorite", ["userId", "isFavorite"]),

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
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_published", ["published"])
    .index("by_series", ["seriesId"]),

  reviews: defineTable({
    userId: v.id("users"),
    bookTitle: v.string(),
    author: v.string(),
    rating: v.number(),
    moodColor: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    published: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_published", ["published"])
    .index("by_book", ["bookTitle"]),

  likes: defineTable({
    userId: v.optional(v.id("users")),
    contentId: v.string(),
    contentType: v.union(v.literal("artwork"), v.literal("review")),
    createdAt: v.number(),
  })
    .index("by_content", ["contentId"])
    .index("by_user_content", ["userId", "contentId"]),

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
});
