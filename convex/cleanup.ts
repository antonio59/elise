/**
 * One-shot cleanup: deletes all documents from legacy tables that are no
 * longer defined in schema.ts.  Safe to run multiple times (idempotent).
 *
 * Run from the Convex dashboard → Functions → cleanup.purgeUnusedTables
 */
import { internalMutation } from "./_generated/server";

// Tables that exist in the DB but are no longer used.
// "sessions" is intentionally excluded — it may contain live auth sessions.
const LEGACY_TABLES = [
  "follows",
  "likes",
  "notifications",
  "rateLimits",
  "readingStreaks",
  "reviews",
  "shares",
  "stickers",
  "userPreferences",
] as const;

export const purgeUnusedTables = internalMutation({
  args: {},
  handler: async (ctx) => {
    const summary: Record<string, number> = {};

    for (const table of LEGACY_TABLES) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const docs = await (ctx.db as any).query(table).collect();
      for (const doc of docs) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (ctx.db as any).delete(doc._id);
      }
      summary[table] = docs.length;
    }

    return summary; // e.g. { follows: 0, likes: 3, reviews: 12, ... }
  },
});
