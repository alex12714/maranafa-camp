import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { buildWebsitePayment, reportWebsitePayment } from "@/lib/website-payment"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") ?? ""

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err instanceof Error ? err.message : err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    // Only rental checkouts (they carry `days`); merch and camp sessions in the
    // same Stripe account have a `type` of their own.
    const type = session.metadata?.type
    if ((type && type !== "rental") || !session.metadata?.days) return NextResponse.json({ received: true })

    try {
      await reportWebsitePayment(buildWebsitePayment("rental", event, session))
    } catch (err) {
      // Non-2xx makes Stripe retry the event (with backoff, for up to 3 days).
      console.error(
        `Rental webhook: reporting payment ${session.id} (event ${event.id}) to the Maranafa API failed:`,
        err instanceof Error ? err.message : err
      )
      return NextResponse.json({ error: "Failed to record payment" }, { status: 502 })
    }
  }

  return NextResponse.json({ received: true })
}
