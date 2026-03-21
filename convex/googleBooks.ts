/* eslint-disable @typescript-eslint/no-explicit-any */
import { query } from "./_generated/server";
import { v } from "convex/values";

// Search Google Books API (server-side, keeps API key private)
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const keyParam = apiKey ? `&key=${apiKey}` : "";

    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(args.query)}&maxResults=8&orderBy=relevance${keyParam}`
      );
      const data = await res.json();

      if (data.error) {
        console.error("Google Books API error:", data.error);
        return [];
      }

      return (data.items || []).map((item: any) => ({
        id: item.id,
        title: item.volumeInfo?.title || "Unknown Title",
        authors: item.volumeInfo?.authors || [],
        coverUrl:
          item.volumeInfo?.imageLinks?.thumbnail?.replace("http://", "https://") ||
          item.volumeInfo?.imageLinks?.smallThumbnail?.replace("http://", "https://") ||
          "",
        pageCount: item.volumeInfo?.pageCount || 0,
        description: item.volumeInfo?.description || "",
        categories: item.volumeInfo?.categories || [],
      }));
    } catch (err) {
      console.error("Google Books search failed:", err);
      return [];
    }
  },
});
