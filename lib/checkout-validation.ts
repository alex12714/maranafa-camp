/** A whole number ≥ 1 (rejects 0, negatives, fractions, strings, NaN). */
export function isPositiveInt(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 1
}

/** A non-empty cart where every line has an integer quantity ≥ 1. */
export function hasValidQuantities(items: unknown): boolean {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every((i) => i !== null && typeof i === "object" && isPositiveInt((i as { quantity?: unknown }).quantity))
  )
}
