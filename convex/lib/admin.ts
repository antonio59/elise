import { internalQuery } from "../_generated/server";
import { auth } from "../auth";

/**
 * Callable from actions to check the current user is an admin.
 * Actions can't read ctx.db directly, so they run this via
 * `ctx.runQuery(internal.lib.admin.isCurrentUserAdmin)`.
 */
export const isCurrentUserAdmin = internalQuery({
  args: {},
  handler: async (ctx) => isAdmin(ctx),
});

export async function isAdmin(ctx: { db: unknown }): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = await auth.getUserId(ctx as any);
  if (!userId) return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = await (ctx as any).db
    .query("userProfiles")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .withIndex("by_userId", (q: any) => q.eq(q.field("userId"), userId))
    .first();
  return profile?.role === "admin";
}
