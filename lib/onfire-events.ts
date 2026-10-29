// Server-side reader for the events the Maranafa business publishes in OnFire.
//
// OnFire is the source of truth for event details and registration; the
// hardcoded list in components/home/sections/events-data.ts is the fallback
// used whenever OnFire cannot be reached (build time, outage, missing RPC).
// Every function here returns null instead of throwing, so a page always
// renders.
//
// Server-to-server calls to api2.onfire.so are challenged by Cloudflare Bot
// Fight Mode, so docker-compose.yml pins the hostname to the origin
// (extra_hosts). TLS is still verified against the real certificate.
//
// Do not import this file from a client component.
import type { EventItem } from "@/components/home/sections/events-data"

export const ONFIRE_API = process.env.ONFIRE_API_URL || "https://api2.onfire.so"
export const MARANAFA_BUSINESS_ID =
  process.env.ONFIRE_BUSINESS_ID || "067ef803-3fce-41dc-86df-23dc1e09957f"
export const EVENT_TIMEZONE = "Europe/Riga"
const PUBLIC_EVENT_URL = "https://events.onfire.so/event/"
const REVALIDATE_SECONDS = 300
const TIMEOUT_MS = 4000

export type OnFireEvent = {
  id: number
  slug: string | null
  title: string | null
  description: string | null
  detailed_description?: string | null
  cover_image: string | null
  start_date: string | null
  end_date: string | null
  location_name: string | null
  location_address: string | null
  attendee_count?: number | null
  attendee_limit?: number | null
  registration_form_id?: string | null
  status?: string | null
}

export type OnFireFormField = {
  id: string
  type: string
  label: string | null
  required: boolean | null
  position?: number | null
}

export type OnFireForm = { id: string; title: string | null; fields: OnFireFormField[] }

/** POST an anonymous PostgREST RPC. Returns parsed JSON, or null on any failure. */
async function rpc<T>(fn: string, args: Record<string, unknown>, revalidate: number | false): Promise<T | null> {
  try {
    const res = await fetch(`${ONFIRE_API}/rpc/${fn}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      ...(revalidate === false ? { cache: "no-store" as const } : { next: { revalidate } }),
    })
    if (!res.ok) {
      console.error(`onfire ${fn}: HTTP ${res.status}`)
      return null
    }
    return (await res.json()) as T
  } catch (err) {
    console.error(`onfire ${fn} failed:`, err instanceof Error ? err.message : err)
    return null
  }
}

/** Public, upcoming events of the business. null = OnFire unavailable. */
export async function getBusinessEvents(): Promise<OnFireEvent[] | null> {
  const rows = await rpc<OnFireEvent[]>(
    "get_public_business_events",
    { p_business_id: MARANAFA_BUSINESS_ID },
    REVALIDATE_SECONDS
  )
  return Array.isArray(rows) ? rows : null
}

/** One public event by slug. null = not found or OnFire unavailable. */
export async function getEventBySlug(slug: string, fresh = false): Promise<OnFireEvent | null> {
  const rows = await rpc<OnFireEvent[]>(
    "get_public_event_by_slug",
    { p_slug: slug },
    fresh ? false : REVALIDATE_SECONDS
  )
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null
}

/** A published form with its fields. null = not found or OnFire unavailable. */
export async function getPublicForm(formId: string): Promise<OnFireForm | null> {
  const form = await rpc<OnFireForm | null>("get_public_form_by_id", { p_form_id: formId }, false)
  return form && Array.isArray(form.fields) ? form : null
}

// ---------------------------------------------------------------------------
// Formatting (Russian, the site's source language; TranslatedText keys are
// Russian, so identical strings keep their existing translations).

function parts(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const get = (opts: Intl.DateTimeFormatOptions, locale = "ru-RU") =>
    new Intl.DateTimeFormat(locale, { timeZone: EVENT_TIMEZONE, ...opts }).format(d)
  return {
    ymd: get({ year: "numeric", month: "2-digit", day: "2-digit" }, "en-CA"),
    day: get({ day: "numeric" }),
    // "13 ноября" — genitive month comes from the day+month pattern.
    dayMonth: get({ day: "numeric", month: "long" }),
    year: get({ year: "numeric" }),
    month: get({ month: "2-digit" }, "en-CA"),
    weekday: get({ weekday: "long" }),
    time: get({ hour: "2-digit", minute: "2-digit", hour12: false }),
  }
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** "13 – 15 ноября 2026", "28 июня – 4 июля 2027", "19 июля 2026". */
export function formatDateRange(start: string | null, end: string | null): string | null {
  const a = start ? parts(start) : null
  if (!a) return null
  const b = end ? parts(end) : null
  if (!b || b.ymd === a.ymd) return `${a.dayMonth} ${a.year}`
  if (a.year !== b.year) return `${a.dayMonth} ${a.year} – ${b.dayMonth} ${b.year}`
  if (a.month === b.month) return `${a.day} – ${b.dayMonth} ${b.year}`
  return `${a.dayMonth} – ${b.dayMonth} ${b.year}`
}

/** "Пятница – воскресенье" (or one weekday for a single-day event). */
export function formatWeekdays(start: string | null, end: string | null): string | null {
  const a = start ? parts(start) : null
  if (!a) return null
  const b = end ? parts(end) : null
  if (!b || b.ymd === a.ymd) return cap(a.weekday)
  return `${cap(a.weekday)} – ${b.weekday}`
}

/** "пятница 17:00 – воскресенье 16:00" for multi-day, "16:00 – 18:00" for one day. */
export function formatTimes(start: string | null, end: string | null): string | null {
  const a = start ? parts(start) : null
  if (!a) return null
  const b = end ? parts(end) : null
  if (!b) return a.time
  if (b.ymd === a.ymd) return `${a.time} – ${b.time}`
  return `${cap(a.weekday)} ${a.time} – ${b.weekday} ${b.time}`
}

export function formatPlace(e: Pick<OnFireEvent, "location_name" | "location_address">): string | null {
  const place = [e.location_name, e.location_address]
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .filter((s, i, all) => all.indexOf(s) === i)
  return place.length ? place.join(", ") : null
}

const isHttps = (u: string | null | undefined): u is string => !!u && /^https:\/\//i.test(u)

// ---------------------------------------------------------------------------
// Homepage merge: OnFire wins for an event whose slug matches a hardcoded
// card's details page (/<slug>); OnFire events with no card are appended and
// link to their OnFire public page. With OnFire unavailable the hardcoded
// list is returned unchanged.

export function mergeEvents(base: EventItem[], onfire: OnFireEvent[] | null): EventItem[] {
  if (!onfire || onfire.length === 0) return base
  const bySlug = new Map(onfire.filter((e) => e.slug).map((e) => [e.slug as string, e]))
  const used = new Set<string>()

  const merged = base.map((item) => {
    const slug = item.detailsPage?.replace(/^\//, "")
    const e = slug ? bySlug.get(slug) : undefined
    if (!e || !slug) return item
    used.add(slug)
    return overlay(item, e)
  })

  for (const e of onfire) {
    if (!e.slug || used.has(e.slug) || !e.start_date || !e.title) continue
    const url = PUBLIC_EVENT_URL + encodeURIComponent(e.slug)
    merged.push(
      overlay(
        {
          id: `onfire-${e.id}`,
          title: e.title,
          subtitle: "Маранафа",
          date: "",
          eventDate: "",
          image: "/images/events/friends-nov-2026.svg",
          alt: e.title,
          registrationUrl: url,
          detailsPage: null,
        },
        e
      )
    )
  }
  return merged
}

function overlay(item: EventItem, e: OnFireEvent): EventItem {
  const start = e.start_date ? parts(e.start_date) : null
  const end = e.end_date ? parts(e.end_date) : null
  const place = formatPlace(e)
  return {
    ...item,
    title: e.title?.trim() || item.title,
    alt: e.title?.trim() || item.alt,
    date: formatDateRange(e.start_date, e.end_date) || item.date,
    eventDate: start?.ymd || item.eventDate,
    endDate: end?.ymd || start?.ymd || item.endDate,
    details: place || item.details,
    image: isHttps(e.cover_image) ? e.cover_image : item.image,
  }
}

/** Page view model for one event, with the page's own constants as fallback. */
export type EventPageData = {
  title: string | null
  date: string
  weekdays: string
  times: string | null
  place: string
  cover: string | null
  description: string | null
}

export function toPageData(
  e: OnFireEvent | null,
  fallback: { date: string; weekdays: string; place: string }
): EventPageData {
  if (!e) return { ...fallback, title: null, times: null, cover: null, description: null }
  return {
    title: e.title?.trim() || null,
    date: formatDateRange(e.start_date, e.end_date) || fallback.date,
    weekdays: formatWeekdays(e.start_date, e.end_date) || fallback.weekdays,
    times: formatTimes(e.start_date, e.end_date),
    place: formatPlace(e) || fallback.place,
    cover: isHttps(e.cover_image) ? e.cover_image : null,
    description: (e.description || "").trim() || null,
  }
}
