import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCurrentGoal = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return null;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) return null;

    const currentYear = new Date().getFullYear();
    const goal = await ctx.db
      .query("readingGoals")
      .withIndex("by_user_year", (q) => q.eq("userId", session.userId).eq("year", currentYear))
      .first();

    if (!goal) return null;

    const books = await ctx.db
      .query("books")
      .withIndex("by_user_status", (q) => q.eq("userId", session.userId).eq("status", "read"))
      .collect();

    const booksThisYear = books.filter((b) => {
      if (!b.finishedAt) return false;
      return new Date(b.finishedAt).getFullYear() === currentYear;
    });

    const totalPages = booksThisYear.reduce((sum, b) => sum + (b.pagesTotal || 0), 0);

    return {
      ...goal,
      booksRead: booksThisYear.length,
      pagesRead: totalPages,
      percentComplete: Math.min(100, Math.round((booksThisYear.length / goal.targetBooks) * 100)),
    };
  },
});

export const setGoal = mutation({
  args: {
    token: v.string(),
    targetBooks: v.number(),
    targetPages: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const currentYear = new Date().getFullYear();
    const existing = await ctx.db
      .query("readingGoals")
      .withIndex("by_user_year", (q) => q.eq("userId", session.userId).eq("year", currentYear))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        targetBooks: args.targetBooks,
        targetPages: args.targetPages,
      });
      return existing._id;
    }

    return await ctx.db.insert("readingGoals", {
      userId: session.userId,
      year: currentYear,
      targetBooks: args.targetBooks,
      targetPages: args.targetPages,
      createdAt: Date.now(),
    });
  },
});

export const getReadingCalendar = query({
  args: { token: v.optional(v.string()), year: v.optional(v.number()) },
  handler: async (ctx, args) => {
    if (!args.token) return [];

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) return [];

    const targetYear = args.year || new Date().getFullYear();
    
    const streaks = await ctx.db
      .query("readingStreaks")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .collect();

    return streaks.filter((s) => s.date.startsWith(String(targetYear)));
  },
});

export const logReading = mutation({
  args: {
    token: v.string(),
    pagesRead: v.number(),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const dateStr = args.date || new Date().toISOString().split("T")[0];
    
    const existing = await ctx.db
      .query("readingStreaks")
      .withIndex("by_user_date", (q) => q.eq("userId", session.userId).eq("date", dateStr))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        pagesRead: existing.pagesRead + args.pagesRead,
      });
    } else {
      await ctx.db.insert("readingStreaks", {
        userId: session.userId,
        date: dateStr,
        pagesRead: args.pagesRead,
        booksFinished: 0,
      });
    }
  },
});
