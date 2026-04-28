import type { QueryCtx, MutationCtx } from "../_generated/server";
import { auth } from "../auth";
import { checkRateLimit } from "./rateLimit";
import type { Id } from "../_generated/dataModel";

export async function requireAuth(
  ctx: QueryCtx | MutationCtx,
): Promise<Id<"users">> {
  const userId = await auth.getUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export async function requireOwnership(
  ctx: MutationCtx,
  tableName: "artworks" | "photos" | "photoAlbums",
  id: Id<typeof tableName>,
): Promise<{ userId: Id<"users">; storageId?: Id<"_storage"> }> {
  const item = await ctx.db.get(id);
  if (!item) throw new Error(`${tableName.slice(0, -1)} not found`);
  const userId = await requireAuth(ctx);
  if (item.userId !== userId) throw new Error("Not authorized");
  return item as { userId: Id<"users">; storageId?: Id<"_storage"> };
}

export async function cleanupStorage(
  ctx: MutationCtx,
  storageId: Id<"_storage"> | undefined,
): Promise<void> {
  if (storageId) {
    await ctx.storage.delete(storageId);
  }
}

export async function checkLikeRateLimit(
  ctx: MutationCtx,
  visitorId: string,
  rateLimitKey: string,
): Promise<void> {
  const allowed = await checkRateLimit(
    ctx,
    `like_${visitorId}`,
    rateLimitKey,
    10,
    60 * 60 * 1000,
  );
  if (!allowed) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }
}

export function filterUndefinedUpdates(
  updates: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(updates).filter(([, value]) => value !== undefined),
  );
}

export async function computeStreak(dates: Set<string>): Promise<{
  currentStreak: number;
  bestStreak: number;
  checkedInToday: boolean;
  totalDays: number;
}> {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split("T")[0];

  const checkedInToday = dates.has(today);

  // Current streak: consecutive days ending today (or yesterday if not yet checked in)
  let currentStreak = 0;
  const startFrom = checkedInToday
    ? today
    : dates.has(yesterday)
      ? yesterday
      : null;
  if (startFrom) {
    let cursor = new Date(startFrom);
    while (dates.has(cursor.toISOString().split("T")[0])) {
      currentStreak++;
      cursor = new Date(cursor.getTime() - 86_400_000);
    }
  }

  // Best streak: longest consecutive run in all history
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
}
