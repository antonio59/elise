import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get current year's reading goal
export const getCurrentGoal = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    const currentYear = new Date().getFullYear();
    return await ctx.db
      .query("readingGoals")
      .withIndex("by_user_year", (q) => q.eq("userId", userId).eq("year", currentYear))
      .first();
  },
});

// Get all reading goals
export const getAllGoals = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("readingGoals").order("desc").collect();
  },
});

// Get reading goal progress for current year
export const getGoalProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).getTime();
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59).getTime();

    // Get current year's goal
    const goal = await ctx.db
      .query("readingGoals")
      .withIndex("by_user_year", (q) => q.eq("userId", userId).eq("year", currentYear))
      .first();

    // Get read books for this user
    const readBooks = await ctx.db
      .query("books")
      .withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "read"))
      .collect();
    const booksThisYear = readBooks.filter(
      (b) =>
        b.finishedAt &&
        b.finishedAt >= startOfYear &&
        b.finishedAt <= endOfYear,
    );

    const pagesThisYear = booksThisYear.reduce(
      (sum, b) => sum + (b.pageCount || 0),
      0,
    );

    return {
      goal,
      booksRead: booksThisYear.length,
      pagesRead: pagesThisYear,
      year: currentYear,
      bookProgress: goal?.targetBooks
        ? Math.min(
            100,
            Math.round((booksThisYear.length / goal.targetBooks) * 100),
          )
        : 0,
      pageProgress: goal?.targetPages
        ? Math.min(100, Math.round((pagesThisYear / goal.targetPages) * 100))
        : 0,
    };
  },
});

// Set reading goal for a year (requires auth)
export const setGoal = mutation({
  args: {
    year: v.number(),
    targetBooks: v.number(),
    targetPages: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if goal already exists for this year
    const existingGoals = await ctx.db.query("readingGoals").collect();
    const existing = existingGoals.find((g) => g.year === args.year);

    if (existing) {
      if (existing.userId !== userId) throw new Error("Not authorized");
      // Update existing goal
      await ctx.db.patch(existing._id, {
        targetBooks: args.targetBooks,
        targetPages: args.targetPages,
      });
      return existing._id;
    }

    // Create new goal
    return await ctx.db.insert("readingGoals", {
      userId,
      year: args.year,
      targetBooks: args.targetBooks,
      targetPages: args.targetPages,
      createdAt: Date.now(),
    });
  },
});

// Delete a reading goal (requires auth and ownership)
export const deleteGoal = mutation({
  args: { id: v.id("readingGoals") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const goal = await ctx.db.get(args.id);
    if (!goal) throw new Error("Goal not found");
    if (goal.userId !== userId) throw new Error("Not authorized");

    await ctx.db.delete(args.id);
  },
});
