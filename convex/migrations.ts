import { mutation, internalMutation } from "./_generated/server";
import { auth } from "./auth";

// Diagnostic: inspect authAccounts userId values
// Run via: npx convex run migrations:inspectAuthAccounts
export const inspectAuthAccounts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const accounts = await ctx.db.query("authAccounts").collect();
    return accounts.map((a) => ({
      id: a._id,
      provider: a.provider,
      userId: a.userId,
      userIdType: typeof a.userId,
    }));
  },
});

// One-time cleanup: delete authAccounts records with invalid userId
// that prevent schema validation from being enabled.
// Run via: npx convex run migrations:cleanupBadAuthRecords
export const cleanupBadAuthRecords = internalMutation({
  args: {},
  handler: async (ctx) => {
    const accounts = await ctx.db.query("authAccounts").collect();
    // Also check valid users exist
    const users = await ctx.db.query("users").collect();
    const validUserIds = new Set(users.map((u) => u._id));

    let deleted = 0;
    for (const account of accounts) {
      const uid = account.userId as string;
      if (!uid || uid === "" || !validUserIds.has(uid as any)) {
        await ctx.db.delete(account._id);
        deleted++;
      }
    }
    return { deleted, total: accounts.length, validUsers: users.length };
  },
});

// One-time migration: upgrade all Google Books cover URLs to zoom=3 for high-res.
// Run via: npx convex run migrations:upgradeCoverUrls
export const upgradeCoverUrls = internalMutation({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.db.query("books").collect();
    let upgraded = 0;
    for (const book of books) {
      if (!book.coverUrl) continue;
      try {
        const raw = book.coverUrl.replace(/&amp;/g, "&");
        const u = new URL(raw);
        if (
          (u.hostname === "books.google.com" ||
            u.hostname.endsWith(".books.google.com")) &&
          u.searchParams.get("zoom") !== "3"
        ) {
          u.searchParams.set("zoom", "3");
          // Also remove edge=curl for cleaner images
          u.searchParams.delete("edge");
          await ctx.db.patch(book._id, { coverUrl: u.toString() });
          upgraded++;
        }
      } catch {
        // not a valid URL, skip
      }
    }
    return { upgraded, total: books.length };
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
