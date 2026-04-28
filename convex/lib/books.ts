import type { QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

export async function findUserBookByTitleAuthor(
  ctx: QueryCtx,
  userId: Id<"users">,
  title: string,
  author: string,
): Promise<Doc<"books"> | undefined> {
  const normalizedTitle = title.toLowerCase().trim();
  const normalizedAuthor = author.toLowerCase().trim();

  const userBooks = await ctx.db
    .query("books")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  return userBooks.find(
    (b) =>
      b.title.toLowerCase().trim() === normalizedTitle &&
      b.author.toLowerCase().trim() === normalizedAuthor,
  );
}

export async function findPendingSuggestion(
  ctx: QueryCtx,
  title: string,
  author: string,
): Promise<Doc<"bookSuggestions"> | undefined> {
  const normalizedTitle = title.toLowerCase().trim();
  const normalizedAuthor = author.toLowerCase().trim();

  const pendingSuggestions = await ctx.db
    .query("bookSuggestions")
    .withIndex("by_status", (q) => q.eq("status", "pending"))
    .collect();

  return pendingSuggestions.find(
    (s) =>
      s.title.toLowerCase().trim() === normalizedTitle &&
      s.author.toLowerCase().trim() === normalizedAuthor,
  );
}
