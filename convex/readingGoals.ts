import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get current year's reading goal
export const getCurrentGoal = query({
  args: {},
  handler: async (ctx) => {
    const currentYear = new Date().getFullYear();
    const goals = await ctx.db.query("readingGoals").collect();
    return goals.find((g) => g.year === currentYear) ?? null;
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
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).getTime();
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59).getTime();

    // Get current year's goal
    const goals = await ctx.db.query("readingGoals").collect();
    const goal = goals.find((g) => g.year === currentYear);

    // Get books finished this year
    const allBooks = await ctx.db.query("books").collect();
    const booksThisYear = allBooks.filter(
      (b) =>
        b.status === "read" &&
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
      bookProgress: goal
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

// Delete a reading goal (requires auth)
export const deleteGoal = mutation({
  args: { id: v.id("readingGoals") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.delete(args.id);
  },
});
