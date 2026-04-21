import type { MutationCtx } from "../_generated/server";

const DEFAULT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function checkRateLimit(
  ctx: MutationCtx,
  identifier: string,
  action: string,
  maxRequests: number,
  windowMs: number = DEFAULT_WINDOW_MS,
): Promise<boolean> {
  const now = Date.now();
  const windowStart = now - (now % windowMs);

  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_identifier_action", (q) =>
      q.eq("identifier", identifier).eq("action", action),
    )
    .first();

  if (existing) {
    // Handle old documents that used windowExpiresAt instead of windowStart
    const existingWindowStart = existing.windowStart ?? 0;
    if (existingWindowStart < windowStart) {
      // New window
      await ctx.db.patch(existing._id, { windowStart, count: 1 });
      return true;
    }
    if (existing.count >= maxRequests) {
      return false;
    }
    await ctx.db.patch(existing._id, { count: existing.count + 1 });
    return true;
  }

  await ctx.db.insert("rateLimits", {
    identifier,
    action,
    windowStart,
    count: 1,
  });
  return true;
}
