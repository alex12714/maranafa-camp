import { NextRequest, NextResponse } from "next/server"
import { isBot, isFilled, isValidEmail, normalizePhone } from "@/lib/validation"
import { logSubmission, clientMeta } from "@/lib/submission-log"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tblxICVDAWKnpfB2y"
const ENDPOINT = "rosetto-register"

// Must match the "План" single-select choices in Airtable.
const PLANS = ["Solo", "Family", "Family+", "Не определился"] as const

export async function POST(req: NextRequest) {
  let meta = { ip: "", ua: "" }
  let body: any
  try {
    if (!AIRTABLE_TOKEN) {
      console.error("AIRTABLE_API_KEY env var is not set")
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    body = await req.json()
    meta = clientMeta(req)

    // Bot honeypot — pretend it worked so bots don't retry with variations.
    if (isBot(body)) {
      await logSubmission({ endpoint: ENDPOINT, outcome: "bot", ...meta, data: body })
      return NextResponse.json({ success: true })
    }

    if (!isFilled(body.name)) {
      await logSubmission({
        endpoint: ENDPOINT,
        outcome: "rejected",
        reason: "missing:name",
        ...meta,
        data: body,
      })
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }
    if (!isValidEmail(body.email)) {
      await logSubmission({
        endpoint: ENDPOINT,
        outcome: "rejected",
        reason: "invalid-email",
        ...meta,
        data: body,
      })
      return NextResponse.json(
        { error: "A valid e-mail address is required" },
        { status: 400 }
      )
    }
    const phone = normalizePhone(body.phone)
    if (!phone) {
      await logSubmission({
        endpoint: ENDPOINT,
        outcome: "rejected",
        reason: "invalid-phone",
        ...meta,
        data: body,
      })
      return NextResponse.json(
        {
          error:
            "Enter a single valid phone number starting with + and the country code",
        },
        { status: 400 }
      )
    }

    // An unknown plan is a client-side drift, not a reason to lose the lead.
    const plan = PLANS.includes(body.plan) ? body.plan : "Не определился"

    const fields: Record<string, unknown> = {
      "Имя": String(body.name).trim(),
      "Телефон": phone,
      "Электронная почта": String(body.email).trim(),
      "План": plan,
      "Дата регистрации": new Date().toISOString().split("T")[0],
    }
    if (isFilled(body.comment)) fields["Комментарий"] = String(body.comment).trim()
    if (isFilled(body.language)) fields["Язык"] = String(body.language).trim().slice(0, 5)

    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records: [{ fields }] }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error("Airtable error:", res.status, error)
      await logSubmission({
        endpoint: ENDPOINT,
        outcome: "error",
        reason: `airtable-${res.status}`,
        ...meta,
        data: body,
      })
      return NextResponse.json({ error: "Failed to save registration" }, { status: 500 })
    }

    await logSubmission({
      endpoint: ENDPOINT,
      outcome: "saved",
      ...meta,
      data: {
        name: String(body.name).trim(),
        phone,
        email: String(body.email).trim(),
        plan,
      },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Rosetto registration error:", err)
    await logSubmission({
      endpoint: ENDPOINT,
      outcome: "error",
      reason: String(err),
      ...meta,
      data: body,
    })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
