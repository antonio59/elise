/* eslint-disable @typescript-eslint/no-explicit-any */
import { action } from "./_generated/server";
import { v } from "convex/values";

// Search Google Books API
export const search = action({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const keyParam = apiKey ? `&key=${apiKey}` : "";

    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(args.query)}&maxResults=8&orderBy=relevance${keyParam}`
    );
    const data = await res.json();

    if (data.error) {
      console.error("Google Books API error:", data.error);
      return [];
    }

    return (data.items ?? []).map((item: Record<string, any>) => ({
      id: item.id as string,
      title: (item.volumeInfo?.title as string) || "Unknown Title",
      authors: (item.volumeInfo?.authors as string[]) ?? [],
      coverUrl: (
        item.volumeInfo?.imageLinks?.thumbnail ??
        item.volumeInfo?.imageLinks?.smallThumbnail ??
        ""
      ).replace("http://", "https://"),
      pageCount: (item.volumeInfo?.pageCount as number) ?? 0,
      description: (item.volumeInfo?.description as string) ?? "",
      categories: (item.volumeInfo?.categories as string[]) ?? [],
    }));
  },
});
