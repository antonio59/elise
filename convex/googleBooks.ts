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

    return (data.items ?? []).map((item: Record<string, any>) => {
      const imageLinks = item.volumeInfo?.imageLinks ?? {};
      const rawCoverUrl = (
        imageLinks.extraLarge ??
        imageLinks.large ??
        imageLinks.medium ??
        imageLinks.thumbnail ??
        imageLinks.smallThumbnail ??
        ""
      ).replace("http://", "https://");
      // Force zoom=3 on all Google Books URLs for sharper stored covers.
      let coverUrl = rawCoverUrl;
      try {
        if (rawCoverUrl && rawCoverUrl.includes("books.google.com")) {
          const u = new URL(rawCoverUrl);
          u.searchParams.set("zoom", "3");
          coverUrl = u.toString();
        }
      } catch { /* leave as-is */ }

      const identifiers: Array<{ type: string; identifier: string }> =
        item.volumeInfo?.industryIdentifiers ?? [];
      const isbn =
        identifiers.find((id) => id.type === "ISBN_13")?.identifier ??
        identifiers.find((id) => id.type === "ISBN_10")?.identifier;

      return {
        id: item.id as string,
        title: (item.volumeInfo?.title as string) || "Unknown Title",
        authors: (item.volumeInfo?.authors as string[]) ?? [],
        coverUrl,
        isbn,
        pageCount: (item.volumeInfo?.pageCount as number) ?? 0,
        description: (item.volumeInfo?.description as string) ?? "",
        categories: (item.volumeInfo?.categories as string[]) ?? [],
      };
    });
  },
});
