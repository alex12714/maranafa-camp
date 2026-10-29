import { NextRequest, NextResponse } from "next/server"
import { isBot, isFilled, isValidEmail, normalizePhone } from "@/lib/validation"
import { logSubmission, clientMeta } from "@/lib/submission-log"
import { ONFIRE_API, getEventBySlug, getPublicForm, type OnFireForm } from "@/lib/onfire-events"

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
  "friends-nov-2026": "Маранафа Friends — ноябрь 2026",
  // Pre-registration only. The full camp application (/camp/register) is bound
  // to a specific camp record in "Люди в лагере" and stays 2026 until the 2027
  // camp exists there — sending early interest here keeps the two apart.
  "narnia-2027": "Лагерь «Возвращение Нарнии» — 28 июня – 4 июля 2027",
}

/**
 * Events whose registrations live in OnFire (the source of truth): form key →
 * OnFire event slug. OnFire is called first; Airtable is written afterwards as
 * a best-effort copy. Events not listed here keep the Airtable-only path.
 */
const ONFIRE_SLUGS: Record<string, string> = {
  "friends-nov-2026": "maranafa-friends-nov-2026",
}

/** OnFire refusals the person can act on. Anything else falls back to Airtable. */
const ONFIRE_USER_ERRORS = new Set(["already_registered", "event_full", "event_ended", "form_invalid"])

const MAX_PEOPLE = 20

// Simple per-IP limit (one container, so process memory is enough).
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 10
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  if (!ip) return false
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k)
  }
  return recent.length > RATE_MAX
}

type Registrant = {
  name: string
  email: string
  phone: string
  people: number
  comment: string
  language: string
}

/**
 * Map the site's fields onto the event's OnFire registration form, by field
 * type first and label second (labels may be in any of the site's languages).
 */
function mapFormData(form: OnFireForm, r: Registrant): Record<string, string> {
  const data: Record<string, string> = {}
  const used = new Set<string>()
  const put = (id: string, key: string, value: string) => {
    if (used.has(key) || !value) return
    used.add(key)
    data[id] = value
  }
  for (const f of form.fields) {
    const label = (f.label || "").toLowerCase()
    if (f.type === "email") put(f.id, "email", r.email)
    else if (f.type === "phone") put(f.id, "phone", r.phone)
    else if (f.type === "text" || f.type === "paragraph") {
      if (/человек|людей|осіб|сколько|скільки|количеств|кол-во|people|persons|guests|skait|cilvēk/.test(label))
        put(f.id, "people", String(r.people))
      else if (/коммент|комент|comment|komentār|вопрос|питан|пожелан|примеч|note/.test(label))
        put(f.id, "comment", r.comment)
      else if (/имя|ім.я|фамил|прізвищ|name|vārd/.test(label)) put(f.id, "name", r.name)
      else if (f.type === "paragraph") put(f.id, "comment", r.comment)
      else put(f.id, "name", r.name)
    }
  }
  return data
}

type OnFireResult =
  | { kind: "saved"; registrationId?: string }
  | { kind: "rejected"; code: string }
  | { kind: "unavailable"; reason: string }

async function registerInOnFire(slug: string, r: Registrant): Promise<OnFireResult> {
  // Fresh read: the attached form decides whether p_form_data is required.
  const event = await getEventBySlug(slug, true)
  let formData: Record<string, string> | undefined
  if (event?.registration_form_id) {
    const form = await getPublicForm(event.registration_form_id)
    if (!form) return { kind: "unavailable", reason: "form-unreadable" }
    formData = mapFormData(form, r)
  }

  try {
    const res = await fetch(`${ONFIRE_API}/rpc/register_for_event_with_form`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        p_event_slug: slug,
        p_email: r.email,
        p_name: r.name,
        p_phone: r.phone,
        p_extra: { people: r.people, comment: r.comment || null, language: r.language || null },
        p_source: "maranafa.camp",
        ...(formData ? { p_form_data: formData } : {}),
      }),
    })
    const text = await res.text()
    let json: any = null
    try {
      json = text ? JSON.parse(text) : null
    } catch {
      // Non-JSON (e.g. an edge challenge page) is treated as unavailable below.
    }
    if (res.ok && json) {
      const id = json.registration_id || json.id
      return { kind: "saved", registrationId: typeof id === "string" ? id : undefined }
    }
    const code = typeof json?.message === "string" ? json.message.trim() : ""
    if (ONFIRE_USER_ERRORS.has(code)) return { kind: "rejected", code }
    if (code === "form_required") return { kind: "rejected", code: "form_invalid" }
    // event_not_found (not public yet), missing RPC, 5xx: keep the lead via Airtable.
    return { kind: "unavailable", reason: `http-${res.status}:${code || json?.code || "no-json"}` }
  } catch (err) {
    return { kind: "unavailable", reason: err instanceof Error ? err.message : String(err) }
  }
}

async function writeAirtable(eventName: string, r: Registrant): Promise<{ ok: boolean; reason?: string }> {
  if (!AIRTABLE_TOKEN) return { ok: false, reason: "airtable-token-missing" }
  const fields: Record<string, unknown> = {
    "Имя": r.name,
    "Телефон": r.phone,
    "Электронная почта": r.email,
    "Событие": eventName,
    "Количество человек": r.people,
    "Дата регистрации": new Date().toISOString().split("T")[0],
  }
  if (r.comment) fields["Комментарий"] = r.comment
  if (r.language) fields["Язык"] = r.language
  try {
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ records: [{ fields }] }),
    })
    if (!res.ok) {
      console.error("Airtable error:", res.status, await res.text())
      return { ok: false, reason: `airtable-${res.status}` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, reason: `airtable:${String(err)}` }
  }
}

export async function POST(req: NextRequest) {
  let meta = { ip: "", ua: "" }
  let body: any
  try {
    body = await req.json()
    meta = clientMeta(req)

    // Bot honeypot — pretend it worked so bots don't retry with variations.
    if (isBot(body)) {
      await logSubmission({ endpoint: ENDPOINT, outcome: "bot", ...meta, data: body })
      return NextResponse.json({ success: true })
    }

    if (rateLimited(meta.ip)) {
      await logSubmission({ endpoint: ENDPOINT, outcome: "rejected", reason: "rate-limit", ...meta, data: body })
      return NextResponse.json({ error: "Too many attempts", code: "rate_limited" }, { status: 429 })
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
    const onfireSlug = ONFIRE_SLUGS[String(body.event)]

    if (!onfireSlug && !AIRTABLE_TOKEN) {
      console.error("AIRTABLE_API_KEY env var is not set")
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    if (!isFilled(body.name)) {
      await logSubmission({ endpoint: ENDPOINT, outcome: "rejected", reason: "missing:name", ...meta, data: body })
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }
    if (!isValidEmail(body.email)) {
      await logSubmission({ endpoint: ENDPOINT, outcome: "rejected", reason: "invalid-email", ...meta, data: body })
      return NextResponse.json({ error: "A valid e-mail address is required" }, { status: 400 })
    }
    const phone = normalizePhone(body.phone)
    if (!phone) {
      await logSubmission({ endpoint: ENDPOINT, outcome: "rejected", reason: "invalid-phone", ...meta, data: body })
      return NextResponse.json(
        { error: "Enter a single valid phone number starting with + and the country code" },
        { status: 400 }
      )
    }

    // A nonsense head count is a typo, not a reason to lose the registration.
    const parsedPeople = Number.parseInt(String(body.people), 10)
    const people =
      Number.isFinite(parsedPeople) && parsedPeople >= 1 ? Math.min(parsedPeople, MAX_PEOPLE) : 1

    const r: Registrant = {
      name: String(body.name).trim().slice(0, 200),
      email: String(body.email).trim(),
      phone,
      people,
      comment: isFilled(body.comment) ? String(body.comment).trim().slice(0, 2000) : "",
      language: isFilled(body.language) ? String(body.language).trim().slice(0, 5) : "",
    }
    const logged = { name: r.name, phone, email: r.email, event: eventName, people }

    // 1. OnFire first (source of truth) for events that live there.
    let savedInOnFire = false
    if (onfireSlug) {
      const result = await registerInOnFire(onfireSlug, r)
      if (result.kind === "rejected") {
        await logSubmission({
          endpoint: `${ENDPOINT}:onfire`,
          outcome: "rejected",
          reason: result.code,
          ...meta,
          data: logged,
        })
        const status = result.code === "form_invalid" ? 422 : 409
        return NextResponse.json({ error: result.code, code: result.code }, { status })
      }
      if (result.kind === "saved") {
        savedInOnFire = true
        await logSubmission({
          endpoint: `${ENDPOINT}:onfire`,
          outcome: "saved",
          recordId: result.registrationId,
          ...meta,
          data: logged,
        })
      } else {
        console.error("OnFire registration unavailable:", result.reason)
        await logSubmission({
          endpoint: `${ENDPOINT}:onfire`,
          outcome: "error",
          reason: result.reason,
          ...meta,
          data: { ...logged, comment: r.comment, language: r.language },
        })
      }
    }

    // 2. Airtable: best-effort copy when OnFire has it, the only store otherwise.
    const airtable = await writeAirtable(eventName, r)
    await logSubmission({
      endpoint: onfireSlug ? `${ENDPOINT}:airtable` : ENDPOINT,
      outcome: airtable.ok ? "saved" : "error",
      reason: airtable.reason,
      ...meta,
      data: airtable.ok ? logged : body,
    })
    if (!airtable.ok && !savedInOnFire) {
      return NextResponse.json({ error: "Failed to save registration" }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Event registration error:", err)
    await logSubmission({ endpoint: ENDPOINT, outcome: "error", reason: String(err), ...meta, data: body })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
