// Registration forms on maranafa.camp are OnFire forms (business "Maranafa"
// on app.onfire.so), embedded with an iframe. OnFire automations push every
// response into api.maranafa.camp; the site itself stores nothing.
//
// One entry per registration. A form's public URL is
// https://forms.onfire.so/<slug>; set it here once the form is published in
// OnFire. Until then the page shows "registration opens soon" with a contact
// link instead of a form (components/onfire-form.tsx).
//
// Each entry can be overridden with a NEXT_PUBLIC_ONFIRE_FORM_* variable.
// Those are inlined at BUILD time (the Dockerfile build stage does not read
// ../.env), so the constants below are what production uses unless the
// variable is passed to `next build`.
//
// Safe to import from client components.

export const ONFIRE_FORMS_ORIGIN = "https://forms.onfire.so"

export type OnFireFormKey =
  | "camp"
  | "narnia-2027"
  | "friends-nov-2026"
  | "rosetto"
  | "dawn-treader"
  | "conference"

/**
 * Form URLs (or bare slugs). An empty string means "not published yet".
 *
 * `process.env.NEXT_PUBLIC_…` must be written out literally for Next.js to
 * inline it, hence one line per key.
 */
const CONFIGURED: Record<OnFireFormKey, string | undefined> = {
  // TODO(onfire-forms): camp application (replaces the camp-register route → AirTable "Люди в лагере").
  camp: process.env.NEXT_PUBLIC_ONFIRE_FORM_CAMP || "",
  // TODO(onfire-forms): camp 2027 pre-registration (replaces the event-register route, key "narnia-2027").
  "narnia-2027": process.env.NEXT_PUBLIC_ONFIRE_FORM_NARNIA_2027 || "",
  // Past event (November 2026); its OnFire form already exists.
  "friends-nov-2026":
    process.env.NEXT_PUBLIC_ONFIRE_FORM_FRIENDS_NOV_2026 || "https://forms.onfire.so/maranafa-friends-acw",
  // TODO(onfire-forms): Rosetto pre-registration (replaces the rosetto-register route).
  rosetto: process.env.NEXT_PUBLIC_ONFIRE_FORM_ROSETTO || "",
  // TODO(onfire-forms): Dawn Treader yacht trip (replaces the dawn-treader-register route).
  "dawn-treader": process.env.NEXT_PUBLIC_ONFIRE_FORM_DAWN_TREADER || "",
  // TODO(onfire-forms): conference. The conference-register route had no caller; the
  // conference page registers through api.maranafa.camp (portal), not AirTable,
  // so this entry is not used by any page yet.
  conference: process.env.NEXT_PUBLIC_ONFIRE_FORM_CONFERENCE || "",
}

/**
 * Normalises a configured value to a forms.onfire.so URL without query or
 * hash. Accepts a full URL or a bare slug. Anything that is not an https URL
 * on forms.onfire.so is rejected (null), so a typo can never embed a foreign page.
 */
export function normalizeFormUrl(value: string | null | undefined): string | null {
  const raw = (value ?? "").trim()
  if (!raw) return null
  if (/^[a-z0-9][a-z0-9-]*$/i.test(raw)) return `${ONFIRE_FORMS_ORIGIN}/${raw}`
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return null
  }
  if (url.origin !== ONFIRE_FORMS_ORIGIN) return null
  const slug = url.pathname.replace(/^\/+|\/+$/g, "")
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) return null
  return `${ONFIRE_FORMS_ORIGIN}/${slug}`
}

/** The form's public URL, or null when it is not configured (yet). */
export function getOnFireFormUrl(
  key: OnFireFormKey,
  config: Partial<Record<OnFireFormKey, string | undefined>> = CONFIGURED
): string | null {
  return normalizeFormUrl(config[key])
}

/**
 * A link to the form in the given language. `embed: true` gives the iframe
 * src: `?embed=1` hides the OnFire page chrome. `?lang=` picks the form's
 * content language (OnFire falls back to the visitor's browser languages,
 * then the form's default, when the form has no such translation).
 */
export function buildFormHref(
  formUrl: string,
  language?: string | null,
  { embed = false }: { embed?: boolean } = {}
): string {
  const url = new URL(formUrl)
  if (embed) url.searchParams.set("embed", "1")
  const lang = (language ?? "").trim().toLowerCase()
  if (/^[a-z]{2}$/.test(lang)) url.searchParams.set("lang", lang)
  return url.toString()
}
