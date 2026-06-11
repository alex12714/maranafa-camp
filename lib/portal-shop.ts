/**
 * Shop (services & merchandise) API helpers for the conference portal.
 *
 * Mirrors the maranafa-api contracts:
 *   GET  /products                              -> ShopProduct[] (active only for non-staff)
 *   POST /me/orders {items:[{product_id,qty}]}  -> ShopOrder (status "pending")
 *   POST /me/orders/{id}/checkout?provider=...  -> {checkout_url} (hosted payment page)
 *   GET  /me/orders                             -> ShopOrder[] (own, newest first)
 *
 * Decimal money fields (`price`, `unit_price`, `total`) serialize as strings.
 * Checkout return URLs are built SERVER-side from SHOP_FRONTEND_BASE_URL:
 *   {base}/shop/success?order={id} and {base}/shop/cancel?order={id}
 * — the portal serves redirect shims on those paths that forward to
 * /portal/services/success and /portal/services/cancel.
 */

import { apiFetch } from "@/lib/portal-api"

// ---------------------------------------------------------------------------
// Types (mirror app/schemas/operations.py + app/schemas/orders.py)
// ---------------------------------------------------------------------------

/** One file from the polymorphic attachments table (AttachmentDTO). */
export interface ShopAttachment {
  url: string | null
  filename: string | null
  thumbnails: Record<string, unknown> | null
}

/** A shop product (ProductDTO). `price === null` means "not sellable". */
export interface ShopProduct {
  id: string
  name: string | null
  /** Available stock; null = not stock-tracked (services etc.). */
  quantity: number | null
  /** Decimal as string, e.g. "15.00"; null = price not set. */
  price: string | null
  link: string | null
  description: string | null
  type: string | null
  active: boolean
  event_id: string | null
  photo: ShopAttachment[]
}

/** An order line with its price snapshot (OrderItemDTO). */
export interface ShopOrderItem {
  id: string
  product_id: string | null
  qty: number
  /** Decimal as string. */
  unit_price: string
}

/** Lifecycle values of `ShopOrder.status` (OrderStatus enum). */
export type ShopOrderStatus =
  | "pending"
  | "paid"
  | "cancelled"
  | "failed"
  | "refunded"

/** A full order with embedded items (OrderDTO). */
export interface ShopOrder {
  id: string
  person_id: string | null
  event_id: string | null
  status: string
  /** Decimal as string. */
  total: string
  currency: string
  provider: string | null
  provider_ref: string | null
  created_at: string | null
  paid_at: string | null
  items: ShopOrderItem[]
}

/** Hosted-payment providers accepted by the checkout endpoint. */
export type PaymentProvider = "stripe" | "paysera"

/** Max qty per order line accepted by the backend schema. */
export const MAX_ORDER_QTY = 1000

// ---------------------------------------------------------------------------
// Calls
// ---------------------------------------------------------------------------

/** GET /products — active products for the shop (any logged-in role). */
export async function fetchProducts(): Promise<ShopProduct[]> {
  const res = await apiFetch("/products")
  if (!res.ok) throw new Error(`Failed to load products: HTTP ${res.status}`)
  return (await res.json()) as ShopProduct[]
}

/** POST /me/orders — create a pending single-product order. */
export async function createOrder(
  productId: string,
  qty: number,
): Promise<ShopOrder> {
  const res = await apiFetch("/me/orders", {
    method: "POST",
    body: JSON.stringify({ items: [{ product_id: productId, qty }] }),
  })
  if (!res.ok) throw new Error(`Failed to create order: HTTP ${res.status}`)
  return (await res.json()) as ShopOrder
}

/**
 * POST /me/orders/{id}/checkout?provider=stripe|paysera — start a hosted
 * payment for an own pending order. Returns the provider URL to redirect
 * the browser to; the order is settled later by the provider's webhook.
 */
export async function checkoutOrder(
  orderId: string,
  provider: PaymentProvider,
): Promise<string> {
  const res = await apiFetch(
    `/me/orders/${encodeURIComponent(orderId)}/checkout?provider=${provider}`,
    { method: "POST" },
  )
  if (!res.ok) throw new Error(`Checkout failed: HTTP ${res.status}`)
  const data = (await res.json()) as { checkout_url: string }
  return data.checkout_url
}

/** GET /me/orders — the current user's orders, newest first. */
export async function fetchMyOrders(): Promise<ShopOrder[]> {
  const res = await apiFetch("/me/orders")
  if (!res.ok) throw new Error(`Failed to load orders: HTTP ${res.status}`)
  return (await res.json()) as ShopOrder[]
}

/** "15.00" + "EUR" -> "15.00 €" (falls back to the currency code). */
export function formatPrice(price: string, currency = "EUR"): string {
  const symbol = currency === "EUR" ? "€" : currency
  const value = Number.parseFloat(price)
  const text = Number.isFinite(value) ? value.toFixed(2) : price
  return `${text} ${symbol}`
}
