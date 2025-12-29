import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// One-time migration: Claim all books and artworks to the current user
// This is useful after migrating from old auth to Convex Auth
export const claimOrphanedData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get all books and update their userId
    const allBooks = await ctx.db.query("books").collect();
    let booksUpdated = 0;
    for (const book of allBooks) {
      if (book.userId !== userId) {
        await ctx.db.patch(book._id, { userId });
        booksUpdated++;
      }
    }

    // Get all artworks and update their userId
    const allArtworks = await ctx.db.query("artworks").collect();
    let artworksUpdated = 0;
    for (const artwork of allArtworks) {
      if (artwork.userId !== userId) {
        await ctx.db.patch(artwork._id, { userId });
        artworksUpdated++;
      }
    }

    // Get all art series and update their userId
    const allSeries = await ctx.db.query("artSeries").collect();
    let seriesUpdated = 0;
    for (const series of allSeries) {
      if (series.userId !== userId) {
        await ctx.db.patch(series._id, { userId });
        seriesUpdated++;
      }
    }

    return {
      booksUpdated,
      artworksUpdated,
      seriesUpdated,
      newUserId: userId,
    };
  },
});

// Check for orphaned data (data with userId that doesn't match current user)
export const checkOrphanedData = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);

    const allBooks = await ctx.db.query("books").collect();
    const allArtworks = await ctx.db.query("artworks").collect();
    const allSeries = await ctx.db.query("artSeries").collect();

    const orphanedBooks = allBooks.filter((b) => b.userId !== userId);
    const orphanedArtworks = allArtworks.filter((a) => a.userId !== userId);
    const orphanedSeries = allSeries.filter((s) => s.userId !== userId);

    return {
      currentUserId: userId,
      totalBooks: allBooks.length,
      totalArtworks: allArtworks.length,
      totalSeries: allSeries.length,
      orphanedBooks: orphanedBooks.length,
      orphanedArtworks: orphanedArtworks.length,
      orphanedSeries: orphanedSeries.length,
      orphanedBookIds: orphanedBooks.map((b) => ({
        id: b._id,
        title: b.title,
        oldUserId: b.userId,
      })),
    };
  },
});
