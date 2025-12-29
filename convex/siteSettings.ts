import { query } from "./_generated/server";

// Get site settings (for backward compatibility with old frontend)
export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").first();
    return (
      settings ?? {
        siteName: "Elise Reads",
        heroTitle: "Welcome to My Reading World",
        heroSubtitle: "Books & Art",
        heroDescription:
          "A place to track my reading adventures and share my artwork",
      }
    );
  },
});
