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
import type { MutationCtx } from "./_generated/server";
import { googleCoverCandidates, upgradeGoogleCoverUrl } from "./lib/coverUrl";

async function reassignUserIds(
  ctx: MutationCtx,
  tables: readonly string[],
  targetUserId: Id<"users">,
): Promise<number> {
  let totalUpdated = 0;
  for (const table of tables) {
    const docs = await ctx.db.query(table as "books").collect();
    for (const doc of docs) {
      if (
        (doc as { userId?: unknown }).userId !== undefined &&
        (doc as { userId?: unknown }).userId !== targetUserId
      ) {
        await ctx.db.patch(doc._id, { userId: targetUserId } as Record<string, unknown>);
        totalUpdated++;
      }
    }
  }
  return totalUpdated;
}

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

// One-time migration: sharpen stored Google Books cover URLs (fife on API URL).
// Run via: npx convex run migrations:upgradeCoverUrls
export const upgradeCoverUrls = internalMutation({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.db.query("books").collect();
    let upgraded = 0;
    for (const book of books) {
      if (!book.coverUrl) continue;
      try {
        // Prefer upgrading the original API URL shape — more stable than
        // publisher CDN frontcover paths as a stored reference.
        const next = upgradeGoogleCoverUrl(book.coverUrl, 800);
        if (next && next !== book.coverUrl) {
          await ctx.db.patch(book._id, { coverUrl: next });
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

    const totalUpdated = await reassignUserIds(ctx, tables, userId);
    return { totalUpdated, newUserId: userId };
  },
});

// Internal fix: migrate all user-scoped data to match the userId in userProfiles.
// Run via: npx convex run migrations:fixUserIdMismatch
export const fixUserIdMismatch = internalMutation({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db.query("userProfiles").first();
    if (!profile) throw new Error("No userProfiles found");
    const targetUserId = profile.userId;

    const tables = [
      "books",
      "artworks",
      "writings",
      "userProfiles",
      "readingGoals",
      "readingStreaks",
      "bookSwipes",
      "writingStreaks",
      "quotes",
      "ideas",
      "characters",
    ] as const;

    const totalUpdated = await reassignUserIds(ctx, tables, targetUserId);
    return { totalUpdated, targetUserId };
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

/** Reject tiny Google thumbnails (~128px). Real covers are usually >> 20KB. */
const MIN_IMAGE_BYTES = 20_000;

/**
 * One-time migration: re-download covers at high resolution (fife=w800)
 * and replace low-res thumbnails in Convex storage.
 *
 * Prefer `covers:refreshAllHighRes` for a full force-refresh.
 * Run via: npx convex run migrations:redownloadCoversHighRes
 */
export const redownloadCoversHighRes = internalAction({
  args: {},
  handler: async (ctx): Promise<string> => {
    const books = await ctx.runQuery(internal.migrations.getAllBooks);

    const eligible = books.filter(
      (b: { coverUrl?: string; coverStorageId?: string }) => {
        if (!b.coverUrl || !b.coverStorageId) return false;
        try {
          const u = new URL(b.coverUrl.replace(/&amp;/g, "&"));
          return (
            u.hostname === "books.google.com" ||
            u.hostname.endsWith(".books.google.com")
          );
        } catch {
          return false;
        }
      },
    );

    console.log(
      `[redownloadCoversHighRes] ${eligible.length} books eligible out of ${books.length} total`,
    );

    let upgraded = 0;
    let skipped = 0;
    let failed = 0;

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
            const candidates = googleCoverCandidates(book.coverUrl ?? "");
            let blob: Blob | null = null;
            for (const url of candidates) {
              try {
                const res = await fetch(url);
                if (!res.ok) continue;
                const candidate = await res.blob();
                if (
                  candidate.type.startsWith("image/") &&
                  candidate.size >= MIN_IMAGE_BYTES
                ) {
                  blob = candidate;
                  break;
                }
              } catch {
                continue;
              }
            }

            if (!blob) {
              console.warn(
                `[redownloadCoversHighRes] No high-res image for "${book.title}" — skipping`,
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
