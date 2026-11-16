// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest"
import Stripe from "stripe"
import { NextRequest } from "next/server"

// The routes create their Stripe client at import time.
vi.hoisted(() => {
  process.env.STRIPE_SECRET_KEY = "sk_test_dummy"
})

import { POST as merchPOST } from "@/app/api/merch/webhook/route"
import { POST as rentalPOST } from "@/app/api/rental/webhook/route"

const MERCH_SECRET = "whsec_merch_test"
const RENTAL_SECRET = "whsec_rental_test"
const stripe = new Stripe("sk_test_dummy")

// Fake buyer data; asserted to stay out of the logs.
const BUYER = { name: "Test Buyer", email: "buyer@example.test", phone: "+37100000000" }

function sessionEvent(metadata: Record<string, string>, overrides: Record<string, unknown> = {}) {
  return {
    id: "evt_test_1",
    object: "event",
    type: "checkout.session.completed",
    created: 1763290000, // 2025-11-16T10:46:40Z
    data: {
      object: {
        id: "cs_test_1",
        object: "checkout.session",
        amount_total: 2550,
        currency: "eur",
        customer_email: BUYER.email,
        customer_details: { name: BUYER.name, email: BUYER.email, phone: BUYER.phone },
        payment_intent: "pi_test_1",
        metadata,
        ...overrides,
      },
    },
  }
}

function signedRequest(event: unknown, secret: string, sigOverride?: string) {
  const payload = JSON.stringify(event)
  const signature = sigOverride ?? stripe.webhooks.generateTestHeaderString({ payload, secret })
  return new NextRequest("http://localhost/api/webhook", {
    method: "POST",
    headers: { "stripe-signature": signature, "content-type": "application/json" },
    body: payload,
  })
}

const MERCH_ITEMS = JSON.stringify([
  { id: "recA", name: "Футболка", qty: 2 },
  { id: "recB", name: "Кружка", qty: 1 },
])

let fetchMock: ReturnType<typeof vi.fn>
let errorSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  vi.stubEnv("STRIPE_MERCH_WEBHOOK_SECRET", MERCH_SECRET)
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", RENTAL_SECRET)
  vi.stubEnv("MARANAFA_API_URL", "https://api.example.test/")
  vi.stubEnv("WEBSITE_WEBHOOK_SECRET", "website-secret")
  fetchMock = vi.fn(async () => new Response("{}", { status: 201 }))
  vi.stubGlobal("fetch", fetchMock)
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
})

function loggedText() {
  return errorSpy.mock.calls.map((c) => c.map(String).join(" ")).join("\n")
}

describe("merch webhook", () => {
  it("POSTs the payment to the Maranafa API with every value AirTable used to get", async () => {
    const res = await merchPOST(
      signedRequest(sessionEvent({ type: "merch", shipping: "post", items: MERCH_ITEMS }), MERCH_SECRET)
    )
    expect(res.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe("https://api.example.test/integrations/website/payment")
    expect(init.method).toBe("POST")
    const headers = init.headers as Record<string, string>
    expect(headers.Authorization).toBe("Bearer website-secret")
    expect(headers["Content-Type"]).toBe("application/json")
    expect(headers["Idempotency-Key"]).toBe("evt_test_1")
    expect(JSON.parse(String(init.body))).toEqual({
      kind: "merch",
      source: "maranafa.camp",
      payment_id: "cs_test_1",
      payment_intent_id: "pi_test_1",
      stripe_event_id: "evt_test_1",
      amount_total: 25.5,
      amount_total_minor: 2550,
      currency: "eur",
      description: "Продажа мерча (Доставка почтой (+€5)): Футболка x2, Кружка x1",
      items: [
        { inventory_id: "recA", name: "Футболка", quantity: 2 },
        { inventory_id: "recB", name: "Кружка", quantity: 1 },
      ],
      shipping: "post",
      rental_days: null,
      buyer_name: BUYER.name,
      buyer_email: BUYER.email,
      buyer_phone: BUYER.phone,
      paid_at: "2025-11-16T10:46:40.000Z",
      date: "2025-11-16",
    })
  })

  it("answers non-2xx (so Stripe retries) and logs without PII when the API fails", async () => {
    fetchMock.mockResolvedValueOnce(new Response("nope", { status: 503 }))
    const res = await merchPOST(signedRequest(sessionEvent({ type: "merch", items: MERCH_ITEMS }), MERCH_SECRET))
    expect(res.status).toBe(502)
    const log = loggedText()
    expect(log).toContain("HTTP 503")
    expect(log).toContain("cs_test_1")
    expect(log).not.toContain(BUYER.email)
    expect(log).not.toContain(BUYER.name)
    expect(log).not.toContain(BUYER.phone)
  })

  it("answers non-2xx when the API cannot be reached", async () => {
    fetchMock.mockRejectedValueOnce(new Error("ECONNREFUSED"))
    const res = await merchPOST(signedRequest(sessionEvent({ type: "merch", items: MERCH_ITEMS }), MERCH_SECRET))
    expect(res.status).toBe(502)
    expect(loggedText()).toContain("ECONNREFUSED")
  })

  it("answers non-2xx without calling anything when the API is not configured", async () => {
    vi.stubEnv("WEBSITE_WEBHOOK_SECRET", "")
    const res = await merchPOST(signedRequest(sessionEvent({ type: "merch", items: MERCH_ITEMS }), MERCH_SECRET))
    expect(res.status).toBe(502)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(loggedText()).toContain("WEBSITE_WEBHOOK_SECRET is not set")
  })

  it("ignores checkouts that are not merch", async () => {
    const res = await merchPOST(signedRequest(sessionEvent({ type: "camp-2026" }), MERCH_SECRET))
    expect(res.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("rejects a bad signature", async () => {
    const res = await merchPOST(signedRequest(sessionEvent({ type: "merch" }), MERCH_SECRET, "t=1,v1=bad"))
    expect(res.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("treats a missing shipping option as pick-up", async () => {
    await merchPOST(signedRequest(sessionEvent({ type: "merch", items: MERCH_ITEMS }), MERCH_SECRET))
    const body = JSON.parse(String((fetchMock.mock.calls[0] as [string, RequestInit])[1].body))
    expect(body.shipping).toBe("collect")
    expect(body.description).toBe("Продажа мерча (Самовывоз): Футболка x2, Кружка x1")
  })
})

describe("rental webhook", () => {
  const RENTAL_ITEMS = JSON.stringify([{ id: "recT", name: "Палатка", qty: 1 }])

  it("POSTs a rental payment", async () => {
    const res = await rentalPOST(
      signedRequest(
        sessionEvent({ type: "rental", days: "3", items: RENTAL_ITEMS }, { customer_email: null }),
        RENTAL_SECRET
      )
    )
    expect(res.status).toBe(200)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe("https://api.example.test/integrations/website/payment")
    const body = JSON.parse(String(init.body))
    expect(body).toMatchObject({
      kind: "rental",
      payment_id: "cs_test_1",
      amount_total: 25.5,
      currency: "eur",
      description: "Аренда оборудования (3 дн.): Палатка x1",
      items: [{ inventory_id: "recT", name: "Палатка", quantity: 1 }],
      shipping: null,
      rental_days: 3,
      // falls back to customer_details when customer_email is empty
      buyer_email: BUYER.email,
      date: "2025-11-16",
    })
  })

  it("still accepts rental sessions created before they carried a type", async () => {
    const res = await rentalPOST(signedRequest(sessionEvent({ days: "1", items: RENTAL_ITEMS }), RENTAL_SECRET))
    expect(res.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("skips merch and camp checkouts", async () => {
    for (const metadata of [{ type: "merch", items: MERCH_ITEMS }, { type: "camp-2026" }, {}]) {
      const res = await rentalPOST(signedRequest(sessionEvent(metadata as Record<string, string>), RENTAL_SECRET))
      expect(res.status).toBe(200)
    }
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("answers non-2xx when the API fails", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 500 }))
    const res = await rentalPOST(signedRequest(sessionEvent({ type: "rental", days: "2", items: RENTAL_ITEMS }), RENTAL_SECRET))
    expect(res.status).toBe(502)
    expect(loggedText()).not.toContain(BUYER.email)
  })

  it("ignores other event types", async () => {
    const event = { ...sessionEvent({ type: "rental", days: "2" }), type: "checkout.session.expired" }
    const res = await rentalPOST(signedRequest(event, RENTAL_SECRET))
    expect(res.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
