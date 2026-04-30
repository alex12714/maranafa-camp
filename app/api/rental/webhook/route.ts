import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const BUDGET_TABLE = "tblH9ok3BTthHa3hZ"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const amountTotal = (session.amount_total ?? 0) / 100
    const days = session.metadata?.days ?? "?"
    const itemsMeta = session.metadata?.items
    let itemNames = ""
    try {
      const parsed = JSON.parse(itemsMeta ?? "[]")
      itemNames = parsed.map((i: any) => `${i.name} x${i.qty}`).join(", ")
    } catch {}

    const today = new Date().toISOString().split("T")[0]

    await fetch(`https://api.airtable.com/v0/${BASE_ID}/${BUDGET_TABLE}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Наименование: `Аренда оборудования (${days} дн.): ${itemNames}`,
              "Сумма Прихода": amountTotal,
              "Прогнозируемые или актуальные": "Актуальные",
              Дата: today,
              Заметки: `Stripe: ${session.id} | Email: ${session.customer_email ?? "—"}`,
            },
          },
        ],
        typecast: true,
      }),
    })
  }

  return NextResponse.json({ received: true })
}
