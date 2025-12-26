import sanitizeHtml from "sanitize-html";

export function sanitizePlainText(
  value: string | null | undefined,
  maxLength = 500,
) {
  if (!value) return undefined;
  const trimmed = value.trim().slice(0, maxLength);
  const clean = sanitizeHtml(trimmed, {
    allowedTags: [],
    allowedAttributes: {},
  });
  return clean.length ? clean : undefined;
}

export function sanitizeRichText(
  value: string | null | undefined,
  maxLength = 5000,
) {
  if (!value) return undefined;
  const trimmed = value.trim().slice(0, maxLength);
  const clean = sanitizeHtml(trimmed, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "ul",
      "ol",
      "li",
      "a",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      span: ["style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
    parser: { lowerCaseTags: true },
  });
  return clean.slice(0, maxLength) || undefined;
}

export function sanitizeOptionalUrl(value: string | null | undefined) {
  if (!value) return undefined;
  const trimmed = value.trim();
  // Validate it's a proper URL
  if (!/^https?:\/\//i.test(trimmed)) return undefined;
  try {
    // Use URL constructor to validate and normalize
    const url = new URL(trimmed);
    // Only allow http/https protocols
    if (!["http:", "https:"].includes(url.protocol)) return undefined;
    // Return the validated URL string (don't use sanitizeHtml as it corrupts query params)
    return url.toString();
  } catch {
    return undefined;
  }
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
