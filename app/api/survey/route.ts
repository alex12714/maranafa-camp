import { NextRequest, NextResponse } from "next/server"
import { isBot, isFilled, isValidEmail, normalizePhone } from "@/lib/validation"
import { logSubmission, clientMeta } from "@/lib/submission-log"

const WEBHOOK_URL = "https://hook.eu1.make.com/2ka4hn8pew9kpzt84mfw1x656ugva3p3"
const ENDPOINT = "survey"

// Booth voucher code — 5 unambiguous chars (no 0/O/1/I). Generated here so the
// same value goes to the SMS and the AirTable record via the Make scenario.
function generateCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let s = ""
  for (let i = 0; i < 5; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)]
  return s
}

// Canonical (Russian) labels for the interest keys, so the webhook always
// receives readable, language-independent labels regardless of UI language.
const INTEREST_LABELS: Record<string, string> = {
  language: "Изучение языков",
  electronics: "Электроника",
  singing: "Пение",
  instrument: "Музыка — игра на инструменте",
  theater: "Театр",
  bible: "Изучение Библии",
  christianity: "Знакомство с христианством (курс «Альфа»)",
  business: "Начало своего дела",
  movies: "Киновечера",
  logoped: "Логопед",
  other: "Другое",
}

export async function POST(req: NextRequest) {
  let meta = { ip: "", ua: "" }
  let body: any
  try {
    body = await req.json()
    meta = clientMeta(req)

    // Bot honeypot — pretend success so bots don't retry with variations.
    if (isBot(body)) {
      await logSubmission({ endpoint: ENDPOINT, outcome: "bot", ...meta, data: body })
      return NextResponse.json({ status: "unique" })
    }

    if (!isFilled(body.name)) {
      await logSubmission({ endpoint: ENDPOINT, outcome: "rejected", reason: "missing:name", ...meta, data: body })
      return NextResponse.json({ error: "name" }, { status: 400 })
    }
    const phone = normalizePhone(body.phone)
    if (!phone) {
      await logSubmission({ endpoint: ENDPOINT, outcome: "rejected", reason: "invalid-phone", ...meta, data: body })
      return NextResponse.json({ error: "phone" }, { status: 400 })
    }
    const email = isFilled(body.email) ? String(body.email).trim() : ""
    if (email && !isValidEmail(email)) {
      await logSubmission({ endpoint: ENDPOINT, outcome: "rejected", reason: "invalid-email", ...meta, data: body })
      return NextResponse.json({ error: "email" }, { status: 400 })
    }
    if (!body.smsConsent || !body.gdprConsent) {
      await logSubmission({ endpoint: ENDPOINT, outcome: "rejected", reason: "no-consent", ...meta, data: body })
      return NextResponse.json({ error: "consent" }, { status: 400 })
    }

    // Age branch: under-18 gives a parent's name (their phone is the parent's);
    // over-18 optionally reports their children's age ranges.
    const over18 = body.over18 !== false
    const parentName = isFilled(body.parentName) ? String(body.parentName).trim() : ""
    if (!over18 && !parentName) {
      await logSubmission({ endpoint: ENDPOINT, outcome: "rejected", reason: "missing:parentName", ...meta, data: body })
      return NextResponse.json({ error: "parentName" }, { status: 400 })
    }
    const childrenAges: string[] =
      over18 && Array.isArray(body.childrenAges)
        ? body.childrenAges.filter((r: unknown): r is string => typeof r === "string")
        : []

    const interestKeys: string[] = Array.isArray(body.interests)
      ? body.interests.filter((k: unknown): k is string => typeof k === "string")
      : []
    const otherInterest = isFilled(body.otherInterest) ? String(body.otherInterest).trim() : ""
    const interestLabels = interestKeys.map((k) =>
      k === "other" ? otherInterest || INTEREST_LABELS.other : INTEREST_LABELS[k] || k
    )

    const payload = {
      name: String(body.name).trim(),
      phone,
      email,
      smsConsent: true,
      gdprConsent: true,
      interests: interestKeys,
      interestLabels,
      interestLabelsText: interestLabels.join(", "), // pre-joined for the Make record
      otherInterest,
      over18,
      ageLabel: over18 ? "18+" : "До 18",
      parentName,
      childrenAges,
      childrenAgesText: childrenAges.join(", "),
      code: generateCode(), // sent by SMS + stored in AirTable for the booth
      language: typeof body.language === "string" ? body.language : "ru",
      event: "2026-07-19",
      submittedAt: new Date().toISOString(),
    }

    let status: "unique" | "duplicate" = "unique"
    let webhookInfo = ""
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const text = await res.text()
      webhookInfo = `${res.status}:${text.slice(0, 200)}`
      if (!res.ok) {
        await logSubmission({ endpoint: ENDPOINT, outcome: "error", reason: `webhook-${res.status}`, ...meta, data: { payload, webhookInfo } })
        return NextResponse.json({ error: "webhook" }, { status: 502 })
      }
      // Make returns the plain text "Accepted" unless a "Webhook response"
      // module returns JSON. Parse when possible; default to "unique".
      let parsed: any = null
      try {
        parsed = JSON.parse(text)
      } catch {
        /* non-JSON body → treat as unique/success */
      }
      const raw = String(parsed?.status ?? parsed?.result ?? "").trim().toLowerCase()
      status = ["duplicate", "dup", "exists", "existing", "duplicated", "repeat"].includes(raw)
        ? "duplicate"
        : "unique"
    } catch (err) {
      await logSubmission({ endpoint: ENDPOINT, outcome: "error", reason: `webhook-fetch:${String(err)}`, ...meta, data: payload })
      return NextResponse.json({ error: "webhook" }, { status: 502 })
    }

    await logSubmission({ endpoint: ENDPOINT, outcome: "saved", ...meta, data: { ...payload, resolved: status, webhookInfo } })
    return NextResponse.json({ status })
  } catch (err) {
    console.error("Survey error:", err)
    await logSubmission({ endpoint: ENDPOINT, outcome: "error", reason: String(err), ...meta, data: body })
    return NextResponse.json({ error: "server" }, { status: 500 })
  }
}
