import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import {
  CAMP_PRICE_EUR,
  PAPER_CONTRACT_FEE_EUR,
  ONLINE_SURCHARGE_RATE,
} from "@/lib/camp-payment"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const stripeLocales: Record<string, Stripe.Checkout.SessionCreateParams.Locale> = {
  ru: "ru",
  lv: "lv",
  en: "en",
}

const productNames: Record<string, { camp: string; paper: string; fee: string }> = {
  ru: {
    camp: "Лагерь «Небо Зовёт» 2026 — участие",
    paper: "Бумажный договор",
    fee: "Комиссия за онлайн-оплату (5%)",
  },
  lv: {
    camp: "Nometne “Debesis Sauc” 2026 — dalība",
    paper: "Papīra līgums",
    fee: "Tiešsaistes maksājuma komisija (5%)",
  },
  en: {
    camp: "Camp “Sky Is Calling” 2026 — participation",
    paper: "Paper contract",
    fee: "Online payment processing fee (5%)",
  },
  uk: {
    camp: "Табір «Небо Кличе» 2026 — участь",
    paper: "Паперовий договір",
    fee: "Комісія за онлайн-оплату (5%)",
  },
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY env var is not set")
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    const body = await req.json()
    const childName = String(body.childName || "").slice(0, 120)
    const email = String(body.email || "").slice(0, 200)
    const language = String(body.language || "ru")
    const paperContract = !!body.paperContract

    const names = productNames[language] || productNames.ru
    const baseEur = CAMP_PRICE_EUR + (paperContract ? PAPER_CONTRACT_FEE_EUR : 0)
    const surchargeCents = Math.round(baseEur * ONLINE_SURCHARGE_RATE * 100)

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: childName ? `${names.camp}: ${childName}` : names.camp,
          },
          unit_amount: CAMP_PRICE_EUR * 100,
        },
        quantity: 1,
      },
    ]

    if (paperContract) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: names.paper },
          unit_amount: PAPER_CONTRACT_FEE_EUR * 100,
        },
        quantity: 1,
      })
    }

    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: { name: names.fee },
        unit_amount: surchargeCents,
      },
      quantity: 1,
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: email || undefined,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/camp/payment-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/camp`,
      metadata: {
        type: "camp-2026",
        childName,
        language,
        paperContract: paperContract ? "yes" : "no",
      },
      locale: stripeLocales[language] || "auto",
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Camp payment checkout error:", err)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
