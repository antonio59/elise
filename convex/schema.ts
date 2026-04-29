import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import {
  artworkFields,
  photoFields,
  writingBaseFields,
  quoteFields,
  reactionFields,
  bookSuggestionFields,
  bookSwipeFields,
  bookBaseFields,
  userProfileOptionalFields,
  userProfileExtendedFields,
  seriesAlbumFields,
  bookDetailFields,
  bookStatusField,
  siteSettingFields,
} from "./lib/validators";

export default defineSchema(
  {
    // Convex Auth tables (users, sessions, accounts, etc.)
    ...authTables,

    // User profiles (extends auth user)
    userProfiles: defineTable({
      userId: v.id("users"),
      name: v.string(),
      ...userProfileOptionalFields,
      isParent: v.boolean(),
      role: v.optional(v.union(v.literal("admin"), v.literal("viewer"))),
      ...userProfileExtendedFields,
    hasSeenOnboarding: v.optional(v.boolean()),
    }).index("by_userId", ["userId"]),

    // Books
    books: defineTable({
      userId: v.id("users"),
      title: v.string(),
      author: v.string(),
      coverStorageId: v.optional(v.id("_storage")),
      ...bookBaseFields,
      pagesRead: v.optional(v.number()),
      pagesTotal: v.optional(v.number()), // Legacy field from old schema
      published: v.optional(v.boolean()), // Legacy field from old schema
      ...bookDetailFields,
      ...bookStatusField,
      isFavorite: v.boolean(),
      giftedBy: v.optional(v.string()),
      moodTags: v.optional(v.array(v.string())),
      startedAt: v.optional(v.number()),
      finishedAt: v.optional(v.number()),
      boughtBy: v.optional(v.string()),
      boughtAt: v.optional(v.number()),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_status", ["userId", "status"])
      .index("by_user_favorite", ["userId", "isFavorite"])
      .index("by_createdAt", ["createdAt"]),

    // Artworks
    artworks: defineTable({
      userId: v.id("users"),
      ...artworkFields,
      likes: v.optional(v.number()),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_published", ["isPublished"])
      .index("by_series", ["seriesId"])
      .index("by_createdAt", ["createdAt"]),

    // Art Series
    artSeries: defineTable({
      userId: v.id("users"),
      ...seriesAlbumFields,
      isComplete: v.boolean(),
      createdAt: v.number(),
    }).index("by_user", ["userId"]),

    // Writings (poems, stories, journal entries)
    writings: defineTable({
      userId: v.id("users"),
      ...writingBaseFields,
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
      .index("by_published", ["isPublished"])
      .index("by_published_type", ["isPublished", "type"])
      .index("by_createdAt", ["createdAt"]),

    // Book suggestions from visitors
    bookSuggestions: defineTable({
      ...bookSuggestionFields,
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
      ...siteSettingFields,
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
      .index("by_user_date", ["userId", "date"])
      .index("by_createdAt", ["createdAt"]),

    // Stickers left by visitors on books
    stickers: defineTable({
      targetType: v.literal("book"),
      targetId: v.string(),
      sticker: v.string(),
      visitorId: v.string(),
      createdAt: v.number(),
    })
      .index("by_target", ["targetType", "targetId"])
      .index("by_visitor_target", ["visitorId", "targetId"])
      .index("by_createdAt", ["createdAt"]),

    // Book discovery swipe decisions (Tinder-style recommendations)
    bookSwipes: defineTable({
      userId: v.id("users"),
      ...bookSwipeFields,
      action: v.union(v.literal("liked"), v.literal("passed")),
      addedToWishlist: v.boolean(),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_action", ["userId", "action"])
      .index("by_user_googleBookId", ["userId", "googleBookId"]),

    // Rate limits for public mutations
    rateLimits: defineTable({
      identifier: v.string(),
      action: v.string(),
      windowStart: v.optional(v.number()),
      windowExpiresAt: v.optional(v.number()), // legacy field — can remove after data migration
      count: v.number(),
    })
      .index("by_identifier_action", ["identifier", "action"])
      .index("by_window", ["windowStart"]),

    // Reactions (emoji reactions on books, writings, artworks, photos)
    reactions: defineTable({
      ...reactionFields,
      createdAt: v.number(),
    })
      .index("by_target", ["targetType", "targetId"])
      .index("by_target_emoji", ["targetType", "targetId", "emoji"])
      .index("by_visitor", ["visitorId", "targetType", "targetId"])
      .index("by_createdAt", ["createdAt"]),

    // Writing streaks (daily writing check-ins)
    writingStreaks: defineTable({
      userId: v.id("users"),
      date: v.string(), // "YYYY-MM-DD"
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_date", ["userId", "date"]),

    // Quotes (favorite book quotes)
    quotes: defineTable({
      userId: v.id("users"),
      ...quoteFields,
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_public_created", ["isPublic", "createdAt"])
      .index("by_book", ["bookId"])
      .index("by_createdAt", ["createdAt"]),

    // Ideas vault (creative sparks)
    ideas: defineTable({
      userId: v.id("users"),
      title: v.string(),
      content: v.string(),
      type: v.union(v.literal("writing"), v.literal("art"), v.literal("book"), v.literal("other")),
      tags: v.optional(v.array(v.string())),
      isArchived: v.boolean(),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_archived", ["userId", "isArchived"])
      .index("by_createdAt", ["createdAt"]),

    // Characters (story bible)
    characters: defineTable({
      userId: v.id("users"),
      name: v.string(),
      description: v.string(),
      personality: v.optional(v.string()),
      appearance: v.optional(v.string()),
      role: v.optional(v.string()),
      relationships: v.optional(v.array(v.object({ name: v.string(), relation: v.string() }))),
      notes: v.optional(v.string()),
      writingIds: v.optional(v.array(v.id("writings"))),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_name", ["userId", "name"])
      .index("by_createdAt", ["createdAt"]),

    // Photos (photography gallery)
    photos: defineTable({
      userId: v.id("users"),
      ...photoFields,
      likes: v.optional(v.number()),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_published", ["isPublished"])
      .index("by_album", ["albumId"])
      .index("by_createdAt", ["createdAt"]),

    // Photo Albums (boards / collections)
    photoAlbums: defineTable({
      userId: v.id("users"),
      ...seriesAlbumFields,
      createdAt: v.number(),
    }).index("by_user", ["userId"]),

    // Feature announcements (tracks which feature emails have been sent)
    featureAnnouncements: defineTable({
      featureName: v.string(),
      sentAt: v.number(),
      sentTo: v.optional(v.string()),
    }).index("by_feature", ["featureName"]),
  },
);
