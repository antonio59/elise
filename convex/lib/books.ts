import type { QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";
import { requireAuth } from "./crud";

export async function withCoverUrls(
  ctx: QueryCtx,
  books: Doc<"books">[],
): Promise<(Doc<"books"> & { coverImageUrl: string | null })[]> {
  return Promise.all(
    books.map(async (b) => ({
      ...b,
      coverImageUrl: b.coverStorageId
        ? await ctx.storage.getUrl(b.coverStorageId)
        : null,
    })),
  );
}

export async function getUserBooks(
  ctx: QueryCtx,
  userId: Id<"users">,
): Promise<Doc<"books">[]> {
  return ctx.db
    .query("books")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

export async function getAllBooks(ctx: QueryCtx): Promise<Doc<"books">[]> {
  return ctx.db.query("books").collect();
}

export async function getReadBooksForUser(
  ctx: QueryCtx,
  userId: Id<"users">,
): Promise<Doc<"books">[]> {
  return ctx.db
    .query("books")
    .withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "read"))
    .collect();
}

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

export async function requireBookOwner(
  ctx: QueryCtx,
  bookId: Id<"books">,
): Promise<Doc<"books">> {
  const userId = await requireAuth(ctx);
  const book = await ctx.db.get(bookId);
  if (!book) throw new Error("Book not found");
  if (book.userId !== userId) throw new Error("Not authorized");
  return book;
}
