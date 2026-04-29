import { auth } from "../auth";

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
