import { mutation, query } from "../_generated/server";
import { auth } from "../auth";
import { computeStreak } from "./crud";

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function defineStreakModule(tableName: "readingStreaks" | "writingStreaks") {
  const checkIn = mutation({
    args: {},
    handler: async (ctx) => {
      const userId = await auth.getUserId(ctx);
      if (!userId) throw new Error("Not authenticated");

      const today = todayString();

      const existing = await ctx.db
        .query(tableName)
        .withIndex("by_user_date", (q) =>
          q.eq("userId", userId).eq("date", today),
        )
        .first();

      if (existing) return { alreadyCheckedIn: true };

      await ctx.db.insert(tableName, {
        userId,
        date: today,
        createdAt: Date.now(),
      });

      return { alreadyCheckedIn: false };
    },
  });

  const getStreak = query({
    args: {},
    handler: async (ctx) => {
      const userId = await auth.getUserId(ctx);
      if (!userId) return null;

      const checkIns = await ctx.db
        .query(tableName)
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

      const dates = new Set(checkIns.map((c) => c.date));
      return computeStreak(dates);
    },
  });

  return { checkIn, getStreak };
}
