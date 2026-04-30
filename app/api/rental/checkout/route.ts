import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { items, days, customerEmail } = await req.json()

    if (!items?.length || !days || days < 1) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: {
      id: string
      name: string
      pricePerDay: number
      quantity: number
    }) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: `${item.name} (${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"})`,
          metadata: { airtableId: item.id },
        },
        unit_amount: Math.round(item.pricePerDay * 100),
      },
      quantity: item.quantity * days,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail || undefined,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/rental/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/rental`,
      metadata: {
        days: String(days),
        items: JSON.stringify(items.map((i: any) => ({ id: i.id, name: i.name, qty: i.quantity }))),
      },
      locale: "ru",
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Stripe checkout error:", err)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
