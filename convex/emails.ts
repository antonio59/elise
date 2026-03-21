import { action } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

// Send notification email when a book is suggested
export const sendSuggestionNotification = action({
  args: {
    title: v.string(),
    author: v.string(),
    suggestedBy: v.string(),
    suggestedByEmail: v.optional(v.string()),
    reason: v.optional(v.string()),
    genre: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
  },
  handler: async (_, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — skipping email notification");
      return;
    }

    const resend = new Resend(apiKey);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 480px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #c4856c, #7c5cbf); padding: 32px 24px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">📚 New Book Suggestion!</h1>
    </div>

    <!-- Content -->
    <div style="padding: 24px;">

      <!-- Book Info -->
      <div style="display: flex; gap: 16px; margin-bottom: 20px; padding: 16px; background: #faf8f5; border-radius: 12px;">
        ${args.coverUrl ? `<img src="${args.coverUrl}" alt="${args.title}" style="width: 60px; height: 90px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" />` : ""}
        <div>
          <h2 style="margin: 0 0 4px 0; font-size: 18px; color: #1e293b;">${args.title}</h2>
          <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">by ${args.author}</p>
          ${args.genre ? `<span style="display: inline-block; padding: 2px 10px; background: #fef3e2; color: #c4856c; border-radius: 100px; font-size: 12px; font-weight: 600;">${args.genre}</span>` : ""}
        </div>
      </div>

      <!-- Who Suggested -->
      <div style="margin-bottom: 16px;">
        <p style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; font-weight: 600;">Suggested by</p>
        <p style="margin: 0; font-size: 16px; color: #1e293b; font-weight: 600;">${args.suggestedBy}</p>
        ${args.suggestedByEmail ? `<p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">${args.suggestedByEmail}</p>` : ""}
      </div>

      ${args.reason ? `
      <!-- Why -->
      <div style="margin-bottom: 20px;">
        <p style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; font-weight: 600;">Why this book?</p>
        <p style="margin: 0; font-size: 14px; color: #475569; font-style: italic; line-height: 1.5;">"${args.reason}"</p>
      </div>
      ` : ""}

      <!-- CTA -->
      <a href="https://elisereads.com/dashboard/suggestions" style="display: block; text-align: center; padding: 14px; background: linear-gradient(135deg, #c4856c, #7c5cbf); color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
        View in Dashboard →
      </a>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 24px; text-align: center; border-top: 1px solid #f1f5f9;">
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">From Elise Reads ✨</p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: "Elise Reads <onboarding@resend.dev>",
      to: "elise@elisereads.com",
      subject: `📚 Someone suggested "${args.title}" by ${args.author}!`,
      html,
    });
  },
});
