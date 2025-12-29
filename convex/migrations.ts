import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// View all users and their fields
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

// Remove legacy fields from old users (passwordHash, role, createdAt)
export const cleanupLegacyUserFields = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let cleaned = 0;

    for (const user of users) {
      const userAny = user as Record<string, unknown>;

      // Check if this user has legacy fields
      if (userAny.passwordHash || userAny.role || userAny.createdAt) {
        // We need to delete and recreate without legacy fields
        // since patch can't remove fields
        const newUser = {
          email: userAny.email as string | undefined,
          name: userAny.name as string | undefined,
        };

        await ctx.db.delete(user._id);
        await ctx.db.insert("users", newUser);
        cleaned++;
      }
    }

    return { cleaned, total: users.length };
  },
});

// Alternative: Just delete users with legacy fields (they'll need to re-register)
export const deleteLegacyUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let deleted = 0;

    for (const user of users) {
      const userAny = user as Record<string, unknown>;

      if (userAny.passwordHash || userAny.role) {
        await ctx.db.delete(user._id);
        deleted++;
      }
    }

    return { deleted, total: users.length };
  },
});
