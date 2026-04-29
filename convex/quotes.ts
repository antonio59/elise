import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { quoteFields } from "./lib/validators";

export const create = mutation({
  args: quoteFields,
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    if (!args.text.trim()) throw new Error("Quote text is required");

    return await ctx.db.insert("quotes", {
      userId,
      bookId: args.bookId,
      bookTitle: args.bookTitle,
      text: args.text.trim(),
      page: args.page,
      chapter: args.chapter,
      isPublic: args.isPublic,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("quotes") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const quote = await ctx.db.get(args.id);
    if (!quote || quote.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

export const getMyQuotes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("quotes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getPublicQuotes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("quotes")
      .withIndex("by_public_created", (q) => q.eq("isPublic", true))
      .order("desc")
      .take(50);
  },
});
