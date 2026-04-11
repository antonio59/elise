export type BookStatus = "reading" | "read" | "wishlist";

export interface Book {
  _id: string;
  title: string;
  author: string;
  coverUrl?: string;
  coverStorageId?: string;
  status: BookStatus;
  genre?: string;
  pageCount?: number;
  pagesRead?: number;
  rating?: number;
  review?: string;
  moodTags?: string[];
  isFavorite?: boolean;
  dateAdded?: string;
  dateRead?: string;
  giftFrom?: string;
  isbn?: string;
  description?: string;
}

export interface Writing {
  _id: string;
  title: string;
  content: string;
  type: "poetry" | "story" | "journal";
  status: "draft" | "published";
  wordCount?: number;
  createdAt: number;
  updatedAt?: number;
}

export interface Artwork {
  _id: string;
  title: string;
  description?: string;
  imageStorageId: string;
  seriesId?: string;
  createdAt: number;
}

export interface ArtSeries {
  _id: string;
  name: string;
  description?: string;
  artworkIds: string[];
}

export interface BookSuggestion {
  _id: string;
  title: string;
  author: string;
  suggestedBy: string;
  suggestedByEmail?: string;
  message?: string;
  status: "pending" | "approved" | "declined";
  createdAt: number;
}

export interface Reaction {
  emoji: string;
  count: number;
}

export interface ReadingGoal {
  _id: string;
  year: number;
  bookGoal: number;
  pageGoal?: number;
}

export interface ReadingStreak {
  _id: string;
  currentDate: string;
  streak: number;
  bestStreak: number;
}

export interface SiteSettings {
  _id: string;
  siteName: string;
  heroText?: string;
  footerText?: string;
}

export interface UserProfile {
  _id: string;
  userId: string;
  name: string;
  email?: string;
  username?: string;
  avatarUrl?: string;
  avatarStorageId?: string;
  bio?: string;
  favoriteGenres?: string[];
  role: "admin" | "viewer";
  favoriteBook?: string;
  rereads?: number;
  favoriteQuote?: string;
  funFact?: string;
  currentlyReading?: string;
  hasSeenOnboarding?: boolean;
}
