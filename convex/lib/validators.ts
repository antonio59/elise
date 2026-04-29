import { v } from "convex/values";

export const artworkFields = {
  title: v.string(),
  description: v.optional(v.string()),
  imageUrl: v.string(),
  storageId: v.optional(v.id("_storage")),
  style: v.optional(v.string()),
  medium: v.optional(v.string()),
  seriesId: v.optional(v.id("artSeries")),
  tags: v.optional(v.array(v.string())),
  isPublished: v.boolean(),
};

export const photoFields = {
  title: v.string(),
  description: v.optional(v.string()),
  imageUrl: v.string(),
  storageId: v.optional(v.id("_storage")),
  location: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  albumId: v.optional(v.id("photoAlbums")),
  isPublished: v.boolean(),
};

export const writingBaseFields = {
  title: v.string(),
  content: v.string(),
  type: v.union(v.literal("poetry"), v.literal("story"), v.literal("journal")),
  genre: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
};

export const quoteFields = {
  bookId: v.optional(v.id("books")),
  bookTitle: v.optional(v.string()),
  text: v.string(),
  page: v.optional(v.number()),
  chapter: v.optional(v.string()),
  isPublic: v.boolean(),
};

export const reactionFields = {
  targetType: v.union(
    v.literal("book"),
    v.literal("writing"),
    v.literal("artwork"),
    v.literal("photo"),
  ),
  targetId: v.string(),
  emoji: v.string(),
  visitorId: v.string(),
};

export const themeValidator = v.optional(
  v.union(
    v.literal("editorial"),
    v.literal("sakura"),
    v.literal("lavender"),
    v.literal("midnight"),
    v.literal("sunset"),
    v.literal("botanical"),
    v.literal("berry"),
    v.literal("light"),
    v.literal("dark"),
    v.literal("kawaii"),
  ),
);

export const bookSuggestionFields = {
  title: v.string(),
  author: v.string(),
  coverUrl: v.optional(v.string()),
  suggestedBy: v.string(),
  suggestedByEmail: v.optional(v.string()),
  reason: v.optional(v.string()),
  genre: v.optional(v.string()),
};

export const bookSwipeFields = {
  googleBookId: v.string(),
  title: v.string(),
  author: v.string(),
  coverUrl: v.optional(v.string()),
  genre: v.optional(v.string()),
  pageCount: v.optional(v.number()),
  description: v.optional(v.string()),
};

export const bookBaseFields = {
  coverUrl: v.optional(v.string()),
  isbn: v.optional(v.string()),
  genre: v.optional(v.string()),
  series: v.optional(v.string()),
  pageCount: v.optional(v.number()),
};

export const userProfileOptionalFields = {
  username: v.optional(v.string()),
  avatarUrl: v.optional(v.string()),
  avatarStorageId: v.optional(v.id("_storage")),
  bio: v.optional(v.string()),
  favoriteGenres: v.optional(v.array(v.string())),
  readingGoal: v.optional(v.string()),
};

export const userProfileExtendedFields = {
  theme: themeValidator,
  yearlyBookGoal: v.optional(v.number()),
  notifications: v.optional(v.boolean()),
  favoriteBook: v.optional(v.string()),
  rereads: v.optional(v.array(v.string())),
  favoriteQuote: v.optional(v.string()),
  funFact: v.optional(v.string()),
  currentlyReading: v.optional(v.string()),
};

export const seriesAlbumFields = {
  title: v.string(),
  description: v.optional(v.string()),
  coverImageUrl: v.optional(v.string()),
};

export const bookDetailFields = {
  description: v.optional(v.string()),
  rating: v.optional(v.number()),
  review: v.optional(v.string()),
  isFavorite: v.optional(v.boolean()),
  giftedBy: v.optional(v.string()),
  moodTags: v.optional(v.array(v.string())),
};

export const bookStatusField = {
  status: v.union(v.literal("reading"), v.literal("read"), v.literal("wishlist")),
};

export const siteSettingFields = {
  siteName: v.optional(v.string()),
  heroTitle: v.optional(v.string()),
  heroSubtitle: v.optional(v.string()),
  heroDescription: v.optional(v.string()),
  footerTagline: v.optional(v.string()),
  footerNote: v.optional(v.string()),
};
