import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

/** Record that Elise wrote today. Safe to call multiple times — deduplicates. */
export const checkIn = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const today = todayString();

    const existing = await ctx.db
      .query("writingStreaks")
      .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", today))
      .first();

    if (existing) return { alreadyCheckedIn: true };

    await ctx.db.insert("writingStreaks", {
      userId,
      date: today,
      createdAt: Date.now(),
    });

    return { alreadyCheckedIn: false };
  },
});

/** Return current writing streak, best streak, and whether already checked in today. */
export const getStreak = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const checkIns = await ctx.db
      .query("writingStreaks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const dates = new Set(checkIns.map((c) => c.date));
    const today = todayString();
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().split("T")[0];

    const checkedInToday = dates.has(today);

    let currentStreak = 0;
    const startFrom = checkedInToday ? today : dates.has(yesterday) ? yesterday : null;
    if (startFrom) {
      let cursor = new Date(startFrom);
      while (dates.has(cursor.toISOString().split("T")[0])) {
        currentStreak++;
        cursor = new Date(cursor.getTime() - 86_400_000);
      }
    }

    const sortedDates = [...dates].sort();
    let bestStreak = 0;
    let run = 0;
    let prev: string | null = null;
    for (const d of sortedDates) {
      if (prev === null) {
        run = 1;
      } else {
        const diff = Math.round(
          (new Date(d).getTime() - new Date(prev).getTime()) / 86_400_000,
        );
        run = diff === 1 ? run + 1 : 1;
      }
      if (run > bestStreak) bestStreak = run;
      prev = d;
    }

    return { currentStreak, bestStreak, checkedInToday, totalDays: dates.size };
  },
});
