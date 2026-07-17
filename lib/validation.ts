// Shared input validation for the public registration endpoints.
// These endpoints are unauthenticated, so all validation happens server-side.

/** True when a value is a non-empty string after trimming. */
export function isFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0
}

/** Practical e-mail check: exactly one "@", non-empty local part, dotted domain. */
export function isValidEmail(value: unknown): boolean {
  if (typeof value !== "string") return false
  const email = value.trim()
  if (email.length === 0 || email.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

/**
 * Normalises a phone number to E.164 form (e.g. "+37120172714").
 *
 * Accepts a SINGLE international number that starts with "+" followed by a
 * country code. Spaces, dashes, parentheses, dots and stray unicode direction
 * marks are stripped. Returns null for anything else — empty values, local
 * numbers without a "+", or two numbers glued together (a second "+", comma,
 * slash or letters survive the strip and fail the pattern).
 */
export function normalizePhone(value: unknown): string | null {
  if (typeof value !== "string") return null
  // Strip spaces, ()-. and unicode LTR/RTL direction marks that some keyboards inject.
  const compact = value.replace(/[\s()\-.\u200e\u200f\u202a-\u202e]/g, "")
  // E.164: "+", country code (1-9), then 7-14 more digits (8-15 digits total).
  if (!/^\+[1-9]\d{7,14}$/.test(compact)) return null
  return compact
}

/**
 * Honeypot check. The public forms carry a hidden "website" field that real
 * users never see or fill. Bots that auto-fill every input trip it.
 */
export function isBot(body: unknown): boolean {
  if (!body || typeof body !== "object") return false
  const hp = (body as Record<string, unknown>).website
  return typeof hp === "string" && hp.trim().length > 0
}
