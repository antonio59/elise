import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    storageId: v.id("_storage"),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      throw new Error("Failed to get image URL");
    }

    return await ctx.db.insert("stickers", {
      name: args.name,
      imageUrl,
      storageId: args.storageId,
      category: args.category,
      createdAt: Date.now(),
    });
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("stickers").order("desc").collect();
  },
});

export const remove = mutation({
  args: {
    token: v.string(),
    stickerId: v.id("stickers"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Not authenticated");
    }

    const sticker = await ctx.db.get(args.stickerId);
    if (sticker?.storageId) {
      await ctx.storage.delete(sticker.storageId);
    }
    
    await ctx.db.delete(args.stickerId);
  },
});
