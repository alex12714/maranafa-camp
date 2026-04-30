import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { items, shipping, customerEmail } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }
    if (!["collect", "post"].includes(shipping)) {
      return NextResponse.json({ error: "Invalid shipping option" }, { status: 400 })
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: {
      id: string; name: string; price: number; quantity: number
    }) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          metadata: { airtableId: item.id },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    if (shipping === "post") {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Доставка почтой" },
          unit_amount: 500,
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail || undefined,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/merch/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/merch`,
      metadata: {
        type: "merch",
        shipping,
        items: JSON.stringify(items.map((i: any) => ({ id: i.id, name: i.name, qty: i.quantity }))),
      },
      locale: "ru",
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Merch checkout error:", err)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
