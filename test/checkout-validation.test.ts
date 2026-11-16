// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const create = vi.hoisted(() => vi.fn(async () => ({ url: "https://checkout.stripe.test/s" })))
vi.mock("stripe", () => ({
  default: class {
    checkout = { sessions: { create } }
  },
}))

import { POST as merchCheckout } from "@/app/api/merch/checkout/route"
import { POST as rentalCheckout } from "@/app/api/rental/checkout/route"
import { hasValidQuantities, isPositiveInt } from "@/lib/checkout-validation"

const req = (body: unknown) =>
  new NextRequest("http://localhost/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })

beforeEach(() => create.mockClear())

describe("isPositiveInt / hasValidQuantities", () => {
  it("accepts whole numbers ≥ 1 only", () => {
    expect([1, 2, 30].every(isPositiveInt)).toBe(true)
    for (const v of [0, -1, 1.5, "2", NaN, Infinity, null, undefined]) expect(isPositiveInt(v)).toBe(false)
  })

  it("requires a non-empty cart of valid quantities", () => {
    expect(hasValidQuantities([{ quantity: 1 }, { quantity: 3 }])).toBe(true)
    expect(hasValidQuantities([])).toBe(false)
    expect(hasValidQuantities([{ quantity: 1 }, { quantity: 0 }])).toBe(false)
    expect(hasValidQuantities([{ quantity: 1.5 }])).toBe(false)
    expect(hasValidQuantities([{}])).toBe(false)
    expect(hasValidQuantities([null])).toBe(false)
  })
})

describe("merch checkout", () => {
  const item = { id: "recA", name: "Футболка", price: 15 }

  it.each([0, -2, 1.5, "2"])("rejects quantity %s before creating a Stripe session", async (quantity) => {
    const res = await merchCheckout(req({ items: [{ ...item, quantity }], shipping: "collect" }))
    expect(res.status).toBe(400)
    expect(create).not.toHaveBeenCalled()
  })

  it("creates a session for a valid cart", async () => {
    const res = await merchCheckout(req({ items: [{ ...item, quantity: 2 }], shipping: "collect" }))
    expect(res.status).toBe(200)
    expect(create).toHaveBeenCalledTimes(1)
  })
})

describe("rental checkout", () => {
  const item = { id: "recT", name: "Палатка", pricePerDay: 5 }

  it.each([0, -1, 2.5, "3", null])("rejects days = %s", async (days) => {
    const res = await rentalCheckout(req({ items: [{ ...item, quantity: 1 }], days }))
    expect(res.status).toBe(400)
    expect(create).not.toHaveBeenCalled()
  })

  it.each([0, 1.5, -1])("rejects quantity %s", async (quantity) => {
    const res = await rentalCheckout(req({ items: [{ ...item, quantity }], days: 2 }))
    expect(res.status).toBe(400)
    expect(create).not.toHaveBeenCalled()
  })

  it("creates a session tagged as a rental for a valid order", async () => {
    const res = await rentalCheckout(req({ items: [{ ...item, quantity: 1 }], days: 3 }))
    expect(res.status).toBe(200)
    const args = (create.mock.calls[0] as unknown as [{ metadata: Record<string, string> }])[0]
    expect(args.metadata).toMatchObject({ type: "rental", days: "3" })
  })
})
