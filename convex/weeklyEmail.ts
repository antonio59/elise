import { internalQuery, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";
import { getEmailConfig, escapeHtml } from "./lib/email";
import { getSiteOwnerId } from "./lib/books";

function msAgo(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

export const getWeeklyStats = internalQuery({
  args: {},
  handler: async (ctx) => {
    const since = msAgo(7);
    const ownerId = await getSiteOwnerId(ctx);

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

    // Owner-side content is scoped to the site owner; visitor-side
    // signals (reactions, stickers, suggestions) stay global.
    const ownerBooks = ownerId
      ? await ctx.db
          .query("books")
          .withIndex("by_user", (q) => q.eq("userId", ownerId))
          .collect()
      : [];
    const books = ownerBooks.filter((b) => b.createdAt >= since);
    const finishedThisWeek = ownerBooks.filter(
      (b) => b.status === "read" && b.finishedAt && b.finishedAt >= since,
    );

    const ownerArtworks = ownerId
      ? await ctx.db
          .query("artworks")
          .withIndex("by_user", (q) => q.eq("userId", ownerId))
          .collect()
      : [];
    const artworks = ownerArtworks.filter((a) => a.createdAt >= since);

    const ownerWritings = ownerId
      ? await ctx.db
          .query("writings")
          .withIndex("by_user", (q) => q.eq("userId", ownerId))
          .collect()
      : [];
    const writings = ownerWritings.filter((w) => w.createdAt >= since);

    const checkIns = ownerId
      ? await ctx.db
          .query("readingStreaks")
          .withIndex("by_user", (q) => q.eq("userId", ownerId))
          .collect()
      : [];

    const weeklyCheckIns = checkIns.filter((c) => c.createdAt >= since);

    const totalReactions = await ctx.db.query("reactions").collect();

    const reactionBreakdown: Record<string, number> = {};
    for (const r of reactions) {
      reactionBreakdown[r.emoji] = (reactionBreakdown[r.emoji] || 0) + 1;
    }

    // Features the owner has never touched — nudge them to explore.
    const unusedFeatures: string[] = [];
    if (ownerId) {
      const [quotes, ideas, characters, photos, goals, swipes] =
        await Promise.all([
          ctx.db.query("quotes").withIndex("by_user", (q) => q.eq("userId", ownerId)).collect(),
          ctx.db.query("ideas").withIndex("by_user", (q) => q.eq("userId", ownerId)).collect(),
          ctx.db.query("characters").withIndex("by_user", (q) => q.eq("userId", ownerId)).collect(),
          ctx.db.query("photos").withIndex("by_user", (q) => q.eq("userId", ownerId)).collect(),
          ctx.db.query("readingGoals").withIndex("by_user", (q) => q.eq("userId", ownerId)).collect(),
          ctx.db.query("bookSwipes").withIndex("by_user", (q) => q.eq("userId", ownerId)).collect(),
        ]);
      const featureCounts: [string, number][] = [
        ["Art gallery", ownerArtworks.length],
        ["Writing", ownerWritings.length],
        ["Quotes", quotes.length],
        ["Ideas vault", ideas.length],
        ["Characters", characters.length],
        ["Photo albums", photos.length],
        ["Reading goal", goals.length],
        ["Book discovery", swipes.length],
      ];
      for (const [label, count] of featureCounts) {
        if (count === 0) unusedFeatures.push(label);
      }
    }

    return {
      newReactions: reactions.length,
      newStickers: stickers.length,
      newSuggestions: suggestions.length,
      newBooks: books.length,
      newArtworks: artworks.length,
      newWritings: writings.length,
      weeklyCheckIns: weeklyCheckIns.length,
      totalBooksRead: ownerBooks.filter((b) => b.status === "read").length,
      totalArtworks: ownerArtworks.length,
      totalWritings: ownerWritings.length,
      totalReactions: totalReactions.length,
      reactionBreakdown,
      newBookTitles: books.slice(0, 5).map((b) => b.title),
      finishedThisWeek: finishedThisWeek.map((b) => ({
        title: b.title,
        author: b.author,
        rating: b.rating,
        review: b.review,
      })),
      unusedFeatures,
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

    const emailConfig = getEmailConfig(env, "weekly summary email");
    if (!emailConfig) return;
    const { apiKey, allowedEmails } = emailConfig;

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

    const newBooksHtml = stats.newBookTitles.length
      ? stats.newBookTitles
          .map(
            (t) =>
              `<span style="padding:6px 12px;background:#f1f5f9;border-radius:8px;font-size:13px;color:#475569;">${escapeHtml(t)}</span>`,
          )
          .join(" ")
      : "";

    const stars = (n?: number) =>
      n ? "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n)) : "";
    const finishedHtml = stats.finishedThisWeek.length
      ? stats.finishedThisWeek
          .map(
            (b) =>
              `<div style="margin-bottom:10px;"><strong style="color:#334155;font-size:14px;">${escapeHtml(b.title)}</strong>` +
              `<span style="color:#94a3b8;font-size:13px;"> by ${escapeHtml(b.author)}</span>` +
              (b.rating
                ? `<span style="color:#d97706;font-size:13px;margin-left:6px;">${stars(b.rating)}</span>`
                : "") +
              (b.review
                ? `<p style="margin:4px 0 0;color:#64748b;font-size:13px;font-style:italic;">“${escapeHtml(b.review.slice(0, 140))}${b.review.length > 140 ? "…" : ""}”</p>`
                : "") +
              `</div>`,
          )
          .join("")
      : "";

    const unusedHtml = stats.unusedFeatures.length
      ? stats.unusedFeatures
          .map(
            (f) =>
              `<span style="display:inline-block;padding:6px 12px;background:#f3e8ff;color:#7c5cbf;border-radius:100px;font-size:13px;font-weight:600;margin:2px;">${escapeHtml(f)}</span>`,
          )
          .join(" ")
      : "";

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
        ${newBooksHtml ? `<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;">${newBooksHtml}</div>` : ""}
      </div>

      ${finishedHtml ? `<div style="margin-bottom:20px;">
        <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;font-weight:600;">Finished this week</p>
        ${finishedHtml}
      </div>` : ""}

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

      ${unusedHtml ? `<div style="margin-bottom:24px;">
        <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;font-weight:600;">Try something new</p>
        <p style="margin:0 0 10px;color:#64748b;font-size:13px;">You haven't used these features yet:</p>
        <div style="display:flex;flex-wrap:wrap;gap:4px;">${unusedHtml}</div>
      </div>` : ""}

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
      from: "Elise Reads <noreply@elisereads.com>",
      to: allowedEmails,
      subject: "📬 Your weekly Elise Reads summary",
      html,
    });
  },
});
