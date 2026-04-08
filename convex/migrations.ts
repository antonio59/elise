import { mutation, internalMutation } from "./_generated/server";
import { auth } from "./auth";

// One-time cleanup: delete authAccounts records with empty userId ("")
// that prevent schema validation from being enabled.
// Run via: npx convex run migrations:cleanupBadAuthRecords
export const cleanupBadAuthRecords = internalMutation({
  args: {},
  handler: async (ctx) => {
    const accounts = await ctx.db.query("authAccounts").collect();
    let deleted = 0;
    for (const account of accounts) {
      if (!account.userId || account.userId === "") {
        await ctx.db.delete(account._id);
        deleted++;
      }
    }
    return { deleted, total: accounts.length };
  },
});

// One-time migration: update all books, artworks, writings, userProfiles,
// readingGoals, and readingStreaks to use the current auth userId.
// This fixes the mismatch when books were created with a prior auth system.
export const migrateUserIds = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const tables = [
      "books",
      "artworks",
      "writings",
      "userProfiles",
      "readingGoals",
      "readingStreaks",
    ] as const;

    let totalUpdated = 0;

    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        if ((doc as { userId?: unknown }).userId !== undefined && (doc as { userId?: unknown }).userId !== userId) {
          await ctx.db.patch(doc._id, { userId } as Record<string, unknown>);
          totalUpdated++;
        }
      }
    }

    return { totalUpdated, newUserId: userId };
  },
});
