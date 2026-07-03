// Camp 2026 payment constants, shared between the register page and the
// /api/camp-pay checkout route.
export const CAMP_PRICE_EUR = 275
export const PAPER_CONTRACT_FEE_EUR = 10
export const ONLINE_SURCHARGE_RATE = 0.05
export const CAMP_START_DATE = "2026-08-03"

export function campTotalEur(paperContract: boolean): number {
  return CAMP_PRICE_EUR + (paperContract ? PAPER_CONTRACT_FEE_EUR : 0)
}

// Total for online card payment, incl. 5% processing surcharge (in EUR,
// rounded to cents the same way the Stripe line items are built).
export function campOnlineTotalEur(paperContract: boolean): number {
  const base = campTotalEur(paperContract)
  const surchargeCents = Math.round(base * ONLINE_SURCHARGE_RATE * 100)
  return base + surchargeCents / 100
}

export function daysUntilCampStart(): number {
  const now = new Date()
  const start = new Date(`${CAMP_START_DATE}T00:00:00`)
  const diff = start.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
