import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    personality: v.optional(v.string()),
    appearance: v.optional(v.string()),
    role: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    if (!args.name.trim()) throw new Error("Name is required");

    return await ctx.db.insert("characters", {
      userId,
      name: args.name.trim(),
      description: args.description.trim(),
      personality: args.personality?.trim(),
      appearance: args.appearance?.trim(),
      role: args.role?.trim(),
      notes: args.notes?.trim(),
      writingIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("characters"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    personality: v.optional(v.string()),
    appearance: v.optional(v.string()),
    role: v.optional(v.string()),
    notes: v.optional(v.string()),
    writingIds: v.optional(v.array(v.id("writings"))),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const char = await ctx.db.get(args.id);
    if (!char || char.userId !== userId) throw new Error("Not found");

    const updates: Partial<typeof char> = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name.trim();
    if (args.description !== undefined) updates.description = args.description.trim();
    if (args.personality !== undefined) updates.personality = args.personality?.trim();
    if (args.appearance !== undefined) updates.appearance = args.appearance?.trim();
    if (args.role !== undefined) updates.role = args.role?.trim();
    if (args.notes !== undefined) updates.notes = args.notes?.trim();
    if (args.writingIds !== undefined) updates.writingIds = args.writingIds;

    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("characters") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const char = await ctx.db.get(args.id);
    if (!char || char.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

export const getMyCharacters = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
