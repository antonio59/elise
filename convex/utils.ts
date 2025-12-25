import sanitizeHtml from "sanitize-html"

export function sanitizePlainText(value: string | null | undefined, maxLength = 500) {
  if (!value) return undefined
  const trimmed = value.trim().slice(0, maxLength)
  const clean = sanitizeHtml(trimmed, { allowedTags: [], allowedAttributes: {} })
  return clean.length ? clean : undefined
}

export function sanitizeRichText(value: string | null | undefined, maxLength = 5000) {
  if (!value) return undefined
  const trimmed = value.trim().slice(0, maxLength)
  const clean = sanitizeHtml(trimmed, {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "ul", "ol", "li", "a", "span"],
    allowedAttributes: { a: ["href", "title", "target", "rel"], span: ["style"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
    parser: { lowerCaseTags: true },
  })
  return clean.slice(0, maxLength) || undefined
}

export function sanitizeOptionalUrl(value: string | null | undefined) {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!/^https?:\/\//i.test(trimmed)) return undefined
  return sanitizeHtml(trimmed, { allowedTags: [], allowedAttributes: {} })
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase()
