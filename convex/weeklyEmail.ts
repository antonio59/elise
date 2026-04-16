import { internalQuery, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function msAgo(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

export const getWeeklyStats = internalQuery({
  args: {},
  handler: async (ctx) => {
    const since = msAgo(7);

    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_createdAt", (q) => q.gte("createdAt", since))
      .collect();

    const stickers = await ctx.db
      .query("stickers")
      .withIndex("by_createdAt", (q) => q.gte("createdAt", since))
      .collect();

    const suggestions = await ctx.db
      .query("bookSuggestions")
      .withIndex("by_created", (q) => q.gte("createdAt", since))
      .collect();

    const books = await ctx.db
      .query("books")
      .withIndex("by_createdAt", (q) => q.gte("createdAt", since))
      .collect();

    const artworks = await ctx.db
      .query("artworks")
      .withIndex("by_createdAt", (q) => q.gte("createdAt", since))
      .collect();

    const writings = await ctx.db
      .query("writings")
      .withIndex("by_createdAt", (q) => q.gte("createdAt", since))
      .collect();

    const checkIns = await ctx.db
      .query("readingStreaks")
      .withIndex("by_createdAt", (q) => q.gte("createdAt", since))
      .collect();

    const totalBooks = await ctx.db.query("books").collect();
    const totalArtworks = await ctx.db.query("artworks").collect();
    const totalWritings = await ctx.db.query("writings").collect();
    const totalReactions = await ctx.db.query("reactions").collect();

    const reactionBreakdown: Record<string, number> = {};
    for (const r of reactions) {
      reactionBreakdown[r.emoji] = (reactionBreakdown[r.emoji] || 0) + 1;
    }

    return {
      newReactions: reactions.length,
      newStickers: stickers.length,
      newSuggestions: suggestions.length,
      newBooks: books.length,
      newArtworks: artworks.length,
      newWritings: writings.length,
      weeklyCheckIns: checkIns.length,
      totalBooksRead: totalBooks.filter((b) => b.status === "read").length,
      totalArtworks: totalArtworks.length,
      totalWritings: totalWritings.length,
      totalReactions: totalReactions.length,
      reactionBreakdown,
      topSuggestions: suggestions
        .slice(0, 3)
        .map((s) => ({ title: s.title, author: s.author })),
    };
  },
});

export const sendWeeklySummary = internalAction({
  args: {},
  handler: async (ctx) => {
    const stats = await ctx.runQuery(internal.weeklyEmail.getWeeklyStats, {});

    const env = (
      globalThis as unknown as {
        process?: { env: Record<string, string | undefined> };
      }
    ).process?.env;

    const apiKey = env?.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — skipping weekly summary email");
      return;
    }

    const allowedEmails = (env?.ALLOWED_EMAILS || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (allowedEmails.length === 0) {
      console.warn("ALLOWED_EMAILS not set — skipping weekly summary email");
      return;
    }

    const resend = new Resend(apiKey);

    const reactionHtml = Object.entries(stats.reactionBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(
        ([emoji, count]) =>
          `<span style="display:inline-block;padding:4px 10px;background:#fef3e2;color:#c4856c;border-radius:100px;font-size:13px;font-weight:600;margin:2px;">${escapeHtml(emoji)} ${count}</span>`,
      )
      .join(" ") ||
      '<span style="color:#94a3b8;font-size:13px;">No reactions this week</span>';

    const suggestionsHtml = stats.topSuggestions.length
      ? stats.topSuggestions
          .map(
            (s) =>
              `<li style="margin-bottom:6px;color:#475569;font-size:14px;"><strong>${escapeHtml(s.title)}</strong> by ${escapeHtml(s.author)}</li>`,
          )
          .join("")
      : "<li style=\"color:#94a3b8;font-size:14px;\">No new suggestions this week</li>";

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#faf8f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#c4856c,#7c5cbf);padding:32px 24px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:24px;font-weight:700;">📬 Your Weekly Summary</h1>
      <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">Here's what happened on Elise Reads this week</p>
    </div>
    <div style="padding:24px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
        <div style="background:#faf8f5;padding:16px;border-radius:12px;text-align:center;">
          <p style="margin:0;font-size:24px;font-weight:700;color:#c4856c;">${stats.newReactions}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Reactions</p>
        </div>
        <div style="background:#faf8f5;padding:16px;border-radius:12px;text-align:center;">
          <p style="margin:0;font-size:24px;font-weight:700;color:#c4856c;">${stats.newStickers}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Stickers</p>
        </div>
        <div style="background:#faf8f5;padding:16px;border-radius:12px;text-align:center;">
          <p style="margin:0;font-size:24px;font-weight:700;color:#c4856c;">${stats.newSuggestions}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Suggestions</p>
        </div>
        <div style="background:#faf8f5;padding:16px;border-radius:12px;text-align:center;">
          <p style="margin:0;font-size:24px;font-weight:700;color:#c4856c;">${stats.weeklyCheckIns}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Check-ins</p>
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;font-weight:600;">New this week</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <span style="padding:6px 12px;background:#f1f5f9;border-radius:8px;font-size:13px;color:#475569;"><strong>${stats.newBooks}</strong> books</span>
          <span style="padding:6px 12px;background:#f1f5f9;border-radius:8px;font-size:13px;color:#475569;"><strong>${stats.newArtworks}</strong> artworks</span>
          <span style="padding:6px 12px;background:#f1f5f9;border-radius:8px;font-size:13px;color:#475569;"><strong>${stats.newWritings}</strong> writings</span>
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;font-weight:600;">Top reactions</p>
        <div style="display:flex;flex-wrap:wrap;gap:4px;">${reactionHtml}</div>
      </div>

      <div style="margin-bottom:24px;">
        <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;font-weight:600;">Recent suggestions</p>
        <ul style="margin:0;padding:0 0 0 18px;list-style:disc;">${suggestionsHtml}</ul>
      </div>

      <div style="background:linear-gradient(135deg,#faf8f5,#f3e8ff);padding:16px;border-radius:12px;margin-bottom:24px;">
        <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;font-weight:600;">All-time totals</p>
        <div style="display:flex;justify-content:space-between;font-size:14px;color:#475569;margin-bottom:6px;">
          <span>Books read</span><strong>${stats.totalBooksRead}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:14px;color:#475569;margin-bottom:6px;">
          <span>Artworks</span><strong>${stats.totalArtworks}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:14px;color:#475569;margin-bottom:6px;">
          <span>Writings</span><strong>${stats.totalWritings}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:14px;color:#475569;">
          <span>Total reactions</span><strong>${stats.totalReactions}</strong>
        </div>
      </div>

      <a href="https://elisereads.com/dashboard" style="display:block;text-align:center;padding:14px;background:linear-gradient(135deg,#c4856c,#7c5cbf);color:white;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">
        Open Dashboard →
      </a>
    </div>
    <div style="padding:16px 24px;text-align:center;border-top:1px solid #f1f5f9;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">From Elise Reads ✨</p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: "Elise Reads <onboarding@resend.dev>",
      to: allowedEmails,
      subject: "📬 Your weekly Elise Reads summary",
      html,
    });
  },
});
