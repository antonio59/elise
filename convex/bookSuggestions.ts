import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { requireAdmin } from "./lib/crud";
import { checkRateLimit } from "./lib/rateLimit";
import { findUserBookByTitleAuthor, findPendingSuggestion } from "./lib/books";

// Get all suggestions (for admin)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bookSuggestions").order("desc").collect();
  },
});

// Get pending suggestions (for admin)
export const getPending = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("bookSuggestions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .collect();
  },
});

import type { Id } from "./_generated/dataModel";

async function getSingleUserId(ctx: {
  db: {
    query: (table: "userProfiles") => {
      first: () => Promise<{ userId: Id<"users"> } | null>;
    };
  };
}): Promise<Id<"users"> | null> {
  const profile = await ctx.db.query("userProfiles").first();
  return profile?.userId ?? null;
}

// Check if a book already exists (for duplicate detection)
export const checkDuplicate = query({
  args: {
    title: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getSingleUserId(ctx);

    if (userId) {
      const existingBook = await findUserBookByTitleAuthor(
        ctx,
        userId,
        args.title,
        args.author,
      );

      if (existingBook) {
        return {
          exists: true,
          location:
            existingBook.status === "read"
              ? "already read"
              : existingBook.status === "reading"
                ? "currently reading"
                : "already on wishlist",
          book: existingBook,
        };
      }
    }

    const existingSuggestion = await findPendingSuggestion(
      ctx,
      args.title,
      args.author,
    );

    if (existingSuggestion) {
      return {
        exists: true,
        location: "already suggested",
        suggestion: existingSuggestion,
      };
    }

    return { exists: false };
  },
});

// Submit a book suggestion (public - no auth required)
export const submit = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    suggestedBy: v.string(),
    suggestedByEmail: v.optional(v.string()),
    reason: v.optional(v.string()),
    genre: v.optional(v.string()),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    const allowed = await checkRateLimit(
      ctx,
      `suggest_${args.visitorId}`,
      "submitSuggestion",
      3,
      60 * 60 * 1000,
    );
    if (!allowed) {
      throw new Error("Too many suggestions. Please try again later.");
    }

    const userId = await getSingleUserId(ctx);

    if (userId) {
      const existingBook = await findUserBookByTitleAuthor(
        ctx,
        userId,
        args.title,
        args.author,
      );

      if (existingBook) {
        const location =
          existingBook.status === "read"
            ? "I've already read this book!"
            : existingBook.status === "reading"
              ? "I'm currently reading this book!"
              : "This book is already on my wishlist!";
        throw new Error(location);
      }
    }

    const existingSuggestion = await findPendingSuggestion(
      ctx,
      args.title,
      args.author,
    );

    if (existingSuggestion) {
      throw new Error("This book has already been suggested!");
    }

    const suggestionId = await ctx.db.insert("bookSuggestions", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });

    // Send email notification (fire-and-forget)
    try {
      const { internal } = await import("./_generated/api");
      await ctx.scheduler.runAfter(
        0,
        // @ts-expect-error emails may not be in generated internal api types
        internal.emails.sendSuggestionNotification,
        {
          title: args.title,
          author: args.author,
          suggestedBy: args.suggestedBy,
          suggestedByEmail: args.suggestedByEmail,
          reason: args.reason,
          genre: args.genre,
          coverUrl: args.coverUrl,
        },
      );
    } catch (e) {
      console.warn("Email notification failed:", e);
    }

    return suggestionId;
  },
});

// Approve a suggestion (admin only)
export const approve = mutation({
  args: { id: v.id("bookSuggestions") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, {
      status: "approved",
      reviewedAt: Date.now(),
    });
  },
});

// Reject a suggestion (admin only)
export const reject = mutation({
  args: { id: v.id("bookSuggestions") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, {
      status: "rejected",
      reviewedAt: Date.now(),
    });
  },
});

// Delete a suggestion (admin only)
export const remove = mutation({
  args: { id: v.id("bookSuggestions") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

// Add approved suggestion to books (admin only)
export const addToBooks = mutation({
  args: { id: v.id("bookSuggestions") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const suggestion = await ctx.db.get(args.id);
    if (!suggestion) throw new Error("Suggestion not found");

    // Add to wishlist for current admin
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.insert("books", {
      userId,
      title: suggestion.title,
      author: suggestion.author,
      coverUrl: suggestion.coverUrl,
      genre: suggestion.genre,
      status: "wishlist",
      isFavorite: false,
      giftedBy: suggestion.suggestedBy,
      createdAt: Date.now(),
    });

    // Mark as approved
    await ctx.db.patch(args.id, {
      status: "approved",
      reviewedAt: Date.now(),
    });
  },
});
