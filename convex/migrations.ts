import {
  mutation,
  internalMutation,
  internalAction,
  internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
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
      if (!uid || uid === "" || !validUserIds.has(uid as never)) {
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
        if (
          (doc as { userId?: unknown }).userId !== undefined &&
          (doc as { userId?: unknown }).userId !== userId
        ) {
          await ctx.db.patch(doc._id, { userId } as Record<string, unknown>);
          totalUpdated++;
        }
      }
    }

    return { totalUpdated, newUserId: userId };
  },
});

// Helper mutation: swap a book's coverStorageId and delete the old storage object.
export const swapCoverStorage = internalMutation({
  args: {
    bookId: v.id("books"),
    newStorageId: v.id("_storage"),
    oldStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookId, {
      coverStorageId: args.newStorageId,
    });
    if (args.oldStorageId) {
      try {
        await ctx.storage.delete(args.oldStorageId);
      } catch {
        // Old storage object may already be gone — not fatal.
      }
    }
  },
});

// Placeholder images Google Books returns when no cover exists are tiny (< 5 KB).
const MIN_IMAGE_BYTES = 5_000;

/**
 * One-time migration: re-download all covers at high resolution (zoom=3)
 * and replace the low-res thumbnails currently in Convex storage.
 *
 * Run via:
 *   npx convex run migrations:redownloadCoversHighRes
 *
 * Safe to run repeatedly — only processes books that have both a Google Books
 * coverUrl and an existing coverStorageId (i.e., books whose stored image
 * needs upgrading).
 */
export const redownloadCoversHighRes = internalAction({
  args: {},
  handler: async (ctx): Promise<string> => {
    const books = await ctx.runQuery(internal.migrations.getAllBooks);

    const eligible = books.filter(
      (b: { coverUrl?: string; coverStorageId?: string }) =>
        b.coverUrl?.includes("books.google.com") && b.coverStorageId,
    );

    console.log(
      `[redownloadCoversHighRes] ${eligible.length} books eligible out of ${books.length} total`,
    );

    let upgraded = 0;
    let skipped = 0;
    let failed = 0;

    // Process in small batches to stay within Convex action limits.
    const BATCH = 3;
    for (let i = 0; i < eligible.length; i += BATCH) {
      const batch = eligible.slice(i, i + BATCH);
      const results = await Promise.allSettled(
        batch.map(
          async (book: {
            _id: Id<"books">;
            title: string;
            coverUrl?: string;
            coverStorageId?: Id<"_storage">;
          }) => {
            // Ensure zoom=3 on the URL
            const raw = (book.coverUrl ?? "").replace(/&amp;/g, "&");
            const u = new URL(raw);
            u.searchParams.set("zoom", "3");
            u.searchParams.delete("edge"); // cleaner images without curl
            const highResUrl = u.toString();

            const res = await fetch(highResUrl);
            if (!res.ok) {
              console.warn(
                `[redownloadCoversHighRes] HTTP ${res.status} for "${book.title}" — skipping`,
              );
              return "skip";
            }

            const blob = await res.blob();
            if (
              !blob.type.startsWith("image/") ||
              blob.size < MIN_IMAGE_BYTES
            ) {
              console.warn(
                `[redownloadCoversHighRes] Invalid/placeholder image for "${book.title}" (${blob.size} bytes) — skipping`,
              );
              return "skip";
            }

            const newStorageId = await ctx.storage.store(blob);

            await ctx.runMutation(internal.migrations.swapCoverStorage, {
              bookId: book._id,
              newStorageId,
              oldStorageId: book.coverStorageId,
            });

            console.log(
              `[redownloadCoversHighRes] ✓ "${book.title}" upgraded (${blob.size} bytes)`,
            );
            return "upgraded";
          },
        ),
      );

      for (const r of results) {
        if (r.status === "fulfilled" && r.value === "upgraded") upgraded++;
        else if (r.status === "fulfilled" && r.value === "skip") skipped++;
        else {
          failed++;
          if (r.status === "rejected") {
            console.error(
              `[redownloadCoversHighRes] Error:`,
              (r as PromiseRejectedResult).reason,
            );
          }
        }
      }
    }

    const summary = `Upgraded ${upgraded}, skipped ${skipped}, failed ${failed} out of ${eligible.length} eligible`;
    console.log(`[redownloadCoversHighRes] Done — ${summary}`);
    return summary;
  },
});

// Internal query: get all books (used by redownloadCoversHighRes action).
export const getAllBooks = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("books").collect();
  },
});
