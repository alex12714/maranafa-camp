import { NextResponse } from "next/server"
import { clientMeta, logSubmission } from "@/lib/submission-log"

const MAX_FIELD = 200

function str(v: unknown): string | null {
  if (typeof v !== "string" && typeof v !== "number") return null
  const s = String(v).trim().slice(0, MAX_FIELD)
  return s || null
}

/**
 * The only fields kept from a stale submission: enough to recontact the
 * person, nothing else (no medical, personal-code or free-text fields).
 * The log line itself carries the timestamp.
 */
export function recontactFields(body: unknown): { name: string | null; phone: string | null; email: string | null; event: string | null } | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null
  const b = body as Record<string, unknown>
  const childName = [str(b.surname), str(b.firstName)].filter(Boolean).join(" ") || null
  const fields = {
    // Event forms send `name`; the camp form sends the parent's and child's names.
    name: str(b.name) ?? str(b.parentName) ?? childName,
    phone: str(b.phone),
    email: str(b.email),
    event: str(b.event) ?? str(b.plan),
  }
  return fields.name || fields.phone || fields.email ? fields : null
}

/**
 * Handler for a retired registration endpoint. Registrations now go through
 * embedded OnFire forms (components/onfire-form.tsx), and nothing on the site
 * writes to AirTable any more, so these routes answer 410 Gone.
 *
 * A page opened before the switch can still post here. Its contact fields
 * (never the whole body, never the console) go to the durable submission log,
 * so the person can be followed up by hand instead of being lost.
 */
export function registrationGone(endpoint: string) {
  return async function POST(req: Request): Promise<NextResponse> {
    let body: unknown = null
    try {
      body = await req.json()
    } catch {
      // Not JSON (or empty): nothing to keep.
    }
    const data = recontactFields(body)
    if (data) {
      await logSubmission({ endpoint, outcome: "rejected", reason: "gone:moved-to-onfire", ...clientMeta(req), data })
    }
    return NextResponse.json(
      { error: "This registration form has moved. Please reload the page.", code: "gone" },
      { status: 410 }
    )
  }
}
