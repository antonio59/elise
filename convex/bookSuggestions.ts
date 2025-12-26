import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { sanitizePlainText, sanitizeOptionalUrl } from "./utils";
import { Id } from "./_generated/dataModel";

type Session = { _id: Id<"sessions">; userId: Id<"users">; expiresAt: number };

async function requireSession(ctx: any, token: string): Promise<Session> {
  const session = (await ctx.db
    .query("sessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first()) as Session | null;

  if (!session || session.expiresAt < Date.now()) {
    throw new Error("Not authenticated");
  }

  return session;
}

// Rate limiting helper
async function checkRateLimit(
  ctx: any,
  identifier: string,
  action: string,
  maxRequests: number,
  windowMs: number,
): Promise<boolean> {
  const now = Date.now();

  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_identifier_action", (q: any) =>
      q.eq("identifier", identifier).eq("action", action),
    )
    .first();

  if (!existing) {
    // First request, create rate limit entry
    await ctx.db.insert("rateLimits", {
      identifier,
      action,
      count: 1,
      windowExpiresAt: now + windowMs,
    });
    return true;
  }

  if (now > existing.windowExpiresAt) {
    // Window expired, reset
    await ctx.db.patch(existing._id, {
      count: 1,
      windowExpiresAt: now + windowMs,
    });
    return true;
  }

  if (existing.count >= maxRequests) {
    // Rate limit exceeded
    return false;
  }

  // Increment count
  await ctx.db.patch(existing._id, {
    count: existing.count + 1,
  });
  return true;
}

// Submit a book suggestion (public - no auth required)
export const submit = mutation({
  args: {
    suggestedBy: v.string(),
    suggestedByEmail: v.optional(v.string()),
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    genre: v.optional(v.string()),
    reason: v.optional(v.string()),
    clientId: v.string(), // For rate limiting anonymous users
  },
  handler: async (ctx, args) => {
    // Rate limit: 5 suggestions per hour per client
    const allowed = await checkRateLimit(
      ctx,
      args.clientId,
      "book_suggestion",
      5,
      60 * 60 * 1000, // 1 hour
    );

    if (!allowed) {
      throw new Error("Too many suggestions. Please try again later.");
    }

    const suggestedBy = sanitizePlainText(args.suggestedBy, 100);
    const title = sanitizePlainText(args.title, 200);
    const author = sanitizePlainText(args.author, 150);
    const genre = sanitizePlainText(args.genre, 80);
    const reason = sanitizePlainText(args.reason, 500);
    const coverUrl = sanitizeOptionalUrl(args.coverUrl);

    if (!suggestedBy || !title || !author) {
      throw new Error("Name, title, and author are required");
    }

    return await ctx.db.insert("bookSuggestions", {
      suggestedBy,
      suggestedByEmail: args.suggestedByEmail,
      title,
      author,
      coverUrl,
      genre,
      reason,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

// Get all pending suggestions (admin only)
export const getPending = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.token);

    return await ctx.db
      .query("bookSuggestions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .collect();
  },
});

// Get all suggestions (admin only)
export const getAll = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.token);

    return await ctx.db.query("bookSuggestions").order("desc").collect();
  },
});

// Approve a suggestion and optionally add to books
export const approve = mutation({
  args: {
    token: v.string(),
    suggestionId: v.id("bookSuggestions"),
    addToWishlist: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.token);

    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    // Update suggestion status
    await ctx.db.patch(args.suggestionId, {
      status: "approved",
      reviewedAt: Date.now(),
    });

    // Optionally add to wishlist
    if (args.addToWishlist) {
      await ctx.db.insert("books", {
        userId: session.userId,
        title: suggestion.title,
        author: suggestion.author,
        coverUrl: suggestion.coverUrl,
        genre: suggestion.genre,
        status: "wishlist",
        published: true,
        isFavorite: false,
        giftedBy: suggestion.suggestedBy,
        createdAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Reject a suggestion
export const reject = mutation({
  args: {
    token: v.string(),
    suggestionId: v.id("bookSuggestions"),
  },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.token);

    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    await ctx.db.patch(args.suggestionId, {
      status: "rejected",
      reviewedAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete a suggestion
export const remove = mutation({
  args: {
    token: v.string(),
    suggestionId: v.id("bookSuggestions"),
  },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.token);

    await ctx.db.delete(args.suggestionId);
    return { success: true };
  },
});

// Get count of pending suggestions
export const getPendingCount = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.token);

    const pending = await ctx.db
      .query("bookSuggestions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    return pending.length;
  },
});
