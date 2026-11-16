import { NextResponse } from "next/server"
import { clientMeta, logSubmission } from "@/lib/submission-log"

/**
 * Handler for a retired registration endpoint. Registrations now go through
 * embedded OnFire forms (components/onfire-form.tsx), and nothing on the site
 * writes to AirTable any more, so these routes answer 410 Gone.
 *
 * A page opened before the switch can still post here. Its body goes to the
 * durable submission log (never to the console), so the lead can be followed
 * up by hand instead of being lost.
 */
export function registrationGone(endpoint: string) {
  return async function POST(req: Request): Promise<NextResponse> {
    let data: unknown = null
    try {
      data = await req.json()
    } catch {
      // Not JSON (or empty): nothing to keep.
    }
    if (data !== null) {
      await logSubmission({ endpoint, outcome: "rejected", reason: "gone:moved-to-onfire", ...clientMeta(req), data })
    }
    return NextResponse.json(
      { error: "This registration form has moved. Please reload the page.", code: "gone" },
      { status: 410 }
    )
  }
}
