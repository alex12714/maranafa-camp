import { NextRequest, NextResponse } from "next/server"
import { isBot, isFilled, isValidEmail, normalizePhone } from "@/lib/validation"
import { logSubmission, clientMeta } from "@/lib/submission-log"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tblCggwAgNZHLO0WS" // Регистрация на события
const ENDPOINT = "event-register"

/**
 * Shared endpoint for one-off events (Маранафа Point, Маранафа Friends, …).
 * The client sends a short, stable key; the value written to Airtable's
 * "Событие" single-select lives here so a page can never invent a new choice.
 * Adding an event means one line here plus the matching Airtable choice.
 */
const EVENTS: Record<string, string> = {
  "point-sep-2026": "Маранафа Point — 12 сентября 2026",
  "point-dec-2026": "Маранафа Point — 12 декабря 2026",
  "friends-nov-2026": "Маранафа Friends — ноябрь 2026",
  // Pre-registration only. The full camp application (/camp/register) is bound
  // to a specific camp record in "Люди в лагере" and stays 2026 until the 2027
  // camp exists there — sending early interest here keeps the two apart.
  "narnia-2027": "Лагерь «Возвращение Нарнии» — 28 июня – 4 июля 2027",
}

const MAX_PEOPLE = 20

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

    const eventName = EVENTS[String(body.event)]
    if (!eventName) {
      // Only reachable through client/server drift. The raw body stays in the
      // submission log, so the lead is recoverable even though we reject here.
      await logSubmission({
        endpoint: ENDPOINT,
        outcome: "rejected",
        reason: `unknown-event:${body.event}`,
        ...meta,
        data: body,
      })
      return NextResponse.json({ error: "Unknown event" }, { status: 400 })
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

    // A nonsense head count is a typo, not a reason to lose the registration.
    const parsedPeople = Number.parseInt(String(body.people), 10)
    const people =
      Number.isFinite(parsedPeople) && parsedPeople >= 1
        ? Math.min(parsedPeople, MAX_PEOPLE)
        : 1

    const fields: Record<string, unknown> = {
      "Имя": String(body.name).trim(),
      "Телефон": phone,
      "Электронная почта": String(body.email).trim(),
      "Событие": eventName,
      "Количество человек": people,
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
        event: eventName,
        people,
      },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Event registration error:", err)
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
