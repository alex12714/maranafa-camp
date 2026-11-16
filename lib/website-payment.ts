// Paid Stripe checkouts from the shop pages (merch, equipment rental) are
// reported to the Maranafa API, which records them in Postgres. This replaces
// the old write to the AirTable budget table.
//
//   POST ${MARANAFA_API_URL}/integrations/website/payment
//   Authorization: Bearer ${WEBSITE_WEBHOOK_SECRET}
//   Idempotency-Key: <stripe_event_id>
//
// Server-only.
import type Stripe from "stripe"

export type PaymentKind = "merch" | "rental"

export type WebsitePaymentItem = {
  /** The AirTable inventory record id the shop item was listed under. */
  inventory_id: string
  name: string
  quantity: number
}

/** The JSON body sent to the Maranafa API. */
export type WebsitePayment = {
  kind: PaymentKind
  source: "maranafa.camp"
  /** Stripe Checkout Session id (cs_…); unique per payment. */
  payment_id: string
  payment_intent_id: string | null
  /** Stripe event id (evt_…); also sent as Idempotency-Key. */
  stripe_event_id: string
  /** Total paid in major units (euros), e.g. 25.5. */
  amount_total: number
  /** Total paid in minor units (cents), e.g. 2550. */
  amount_total_minor: number
  /** ISO 4217, lower case, e.g. "eur". */
  currency: string
  /** Human-readable line, as it used to appear in AirTable "Наименование". */
  description: string
  items: WebsitePaymentItem[]
  /** Merch only: "collect" (pick up) or "post" (mailed, +€5). */
  shipping: "collect" | "post" | null
  /** Rental only: number of rental days. */
  rental_days: number | null
  buyer_name: string | null
  buyer_email: string | null
  buyer_phone: string | null
  /** When Stripe recorded the completed checkout (ISO 8601, UTC). */
  paid_at: string
  /** paid_at's calendar date (YYYY-MM-DD, UTC), the old AirTable "Дата". */
  date: string
}

function parseItems(raw: string | undefined): WebsitePaymentItem[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]")
    if (!Array.isArray(parsed)) return []
    return parsed.map((i) => ({
      inventory_id: String(i?.id ?? ""),
      name: String(i?.name ?? ""),
      quantity: Number.isFinite(Number(i?.qty)) ? Number(i.qty) : 1,
    }))
  } catch {
    return []
  }
}

/** Builds the API body from a completed Checkout Session. */
export function buildWebsitePayment(
  kind: PaymentKind,
  event: Stripe.Event,
  session: Stripe.Checkout.Session
): WebsitePayment {
  const items = parseItems(session.metadata?.items)
  const itemNames = items.map((i) => `${i.name} x${i.quantity}`).join(", ")
  const minor = session.amount_total ?? 0
  const paidAt = new Date(event.created * 1000).toISOString()

  let shipping: WebsitePayment["shipping"] = null
  let rentalDays: number | null = null
  let description: string
  if (kind === "merch") {
    shipping = session.metadata?.shipping === "post" ? "post" : "collect"
    const label = shipping === "post" ? "Доставка почтой (+€5)" : "Самовывоз"
    description = `Продажа мерча (${label}): ${itemNames}`
  } else {
    const days = Number.parseInt(session.metadata?.days ?? "", 10)
    rentalDays = Number.isFinite(days) ? days : null
    description = `Аренда оборудования (${rentalDays ?? "?"} дн.): ${itemNames}`
  }

  const paymentIntent = session.payment_intent
  return {
    kind,
    source: "maranafa.camp",
    payment_id: session.id,
    payment_intent_id: typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id ?? null,
    stripe_event_id: event.id,
    amount_total: minor / 100,
    amount_total_minor: minor,
    currency: (session.currency ?? "eur").toLowerCase(),
    description,
    items,
    shipping,
    rental_days: rentalDays,
    buyer_name: session.customer_details?.name ?? null,
    buyer_email: session.customer_email ?? session.customer_details?.email ?? null,
    buyer_phone: session.customer_details?.phone ?? null,
    paid_at: paidAt,
    date: paidAt.slice(0, 10),
  }
}

export class PaymentReportError extends Error {}

/**
 * POSTs the payment to the Maranafa API. Throws PaymentReportError when the
 * API is not configured or does not answer 2xx, so the webhook can answer
 * 5xx and Stripe retries. Errors carry no personal data.
 */
export async function reportWebsitePayment(payment: WebsitePayment): Promise<void> {
  const base = (process.env.MARANAFA_API_URL || "").replace(/\/+$/, "")
  const secret = process.env.WEBSITE_WEBHOOK_SECRET
  if (!base) throw new PaymentReportError("MARANAFA_API_URL is not set")
  if (!secret) throw new PaymentReportError("WEBSITE_WEBHOOK_SECRET is not set")

  let res: Response
  try {
    res = await fetch(`${base}/integrations/website/payment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
        "Idempotency-Key": payment.stripe_event_id,
      },
      body: JSON.stringify(payment),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    })
  } catch (err) {
    throw new PaymentReportError(`request failed: ${err instanceof Error ? err.message : String(err)}`)
  }
  if (!res.ok) {
    throw new PaymentReportError(`HTTP ${res.status}`)
  }
}
