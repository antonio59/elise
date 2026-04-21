import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    type: v.union(v.literal("writing"), v.literal("art"), v.literal("book"), v.literal("other")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    if (!args.title.trim()) throw new Error("Title is required");

    return await ctx.db.insert("ideas", {
      userId,
      title: args.title.trim(),
      content: args.content.trim(),
      type: args.type,
      tags: args.tags?.map((t) => t.trim()).filter(Boolean),
      isArchived: false,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("ideas"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    type: v.optional(v.union(v.literal("writing"), v.literal("art"), v.literal("book"), v.literal("other"))),
    tags: v.optional(v.array(v.string())),
    isArchived: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const idea = await ctx.db.get(args.id);
    if (!idea || idea.userId !== userId) throw new Error("Not found");

    const updates: Partial<typeof idea> = {};
    if (args.title !== undefined) updates.title = args.title.trim();
    if (args.content !== undefined) updates.content = args.content.trim();
    if (args.type !== undefined) updates.type = args.type;
    if (args.tags !== undefined) updates.tags = args.tags.map((t) => t.trim()).filter(Boolean);
    if (args.isArchived !== undefined) updates.isArchived = args.isArchived;

    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("ideas") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const idea = await ctx.db.get(args.id);
    if (!idea || idea.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

export const getMyIdeas = query({
  args: { includeArchived: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    if (args.includeArchived) {
      return await ctx.db
        .query("ideas")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("ideas")
      .withIndex("by_user_archived", (q) => q.eq("userId", userId).eq("isArchived", false))
      .order("desc")
      .collect();
  },
});
