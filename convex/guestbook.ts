import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const submit = mutation({
  args: {
    name: v.string(),
    message: v.string(),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.name.trim() || !args.message.trim()) {
      throw new Error("Name and message are required");
    }
    if (args.message.trim().length > 500) {
      throw new Error("Message must be under 500 characters");
    }

    return await ctx.db.insert("guestbookEntries", {
      name: args.name.trim(),
      message: args.message.trim(),
      visitorId: args.visitorId,
      isApproved: true, // Auto-approve for now; can add moderation later
      createdAt: Date.now(),
    });
  },
});

export const getEntries = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("guestbookEntries")
      .withIndex("by_approved", (q) => q.eq("isApproved", true))
      .order("desc")
      .take(100);
  },
});

export const remove = mutation({
  args: { id: v.id("guestbookEntries") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!profile || profile.role !== "admin") throw new Error("Unauthorized");
    await ctx.db.delete(args.id);
  },
});
