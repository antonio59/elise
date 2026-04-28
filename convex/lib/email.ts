export function getEmailConfig(env: Record<string, string | undefined> | undefined, context: string): { apiKey: string; allowedEmails: string[] } | null {
  const apiKey = env?.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`RESEND_API_KEY not set — skipping ${context}`);
    return null;
  }

  const allowedEmails = (env?.ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (allowedEmails.length === 0) {
    console.warn(`ALLOWED_EMAILS not set — skipping ${context}`);
    return null;
  }

  return { apiKey, allowedEmails };
}
