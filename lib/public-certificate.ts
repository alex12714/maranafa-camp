/**
 * The public certificate check: `GET /public/certificates/{token}`.
 *
 * DELIBERATELY NOT `apiFetch`. Everything in `lib/portal-api.ts` assumes a
 * signed-in portal visitor: it attaches a Bearer token, and on a 401 it clears
 * the session and sends the browser to /portal/login. The person scanning a QR
 * code off a printed sheet has no account here and must never be asked for one,
 * so this module talks to the endpoint with a bare `fetch` and no credentials.
 *
 * THE ANSWER IS THE SERVER'S, NOT OURS. `status` is read straight through and
 * never re-derived from `revoked_at` — the API is the single place that decides
 * what a certificate currently is, and a second opinion computed in a browser
 * is exactly the copy that eventually disagrees with it. See
 * `app/routers/learning_certificates.py` in maranafa-api for the contract.
 *
 * Every failure is mapped to a named outcome rather than thrown, because each
 * one is a different sentence to a stranger holding a sheet of paper: "we have
 * no record of this code" is not "we could not reach the register", and neither
 * is "you have checked a lot of codes just now".
 */

import { PORTAL_API_BASE } from "@/lib/portal-api"

/**
 * The payload of `PublicCertificateVerificationDTO`.
 *
 * All three snapshots are null together on a certificate whose personal
 * details were erased: the record that the training happened outlives the
 * name. `status` is typed as a plain string on purpose — the API today answers
 * "valid" or "revoked", and a payload carrying some third word must not be
 * silently narrowed into one of the two we know.
 */
export interface PublicCertificate {
  status: string
  certificate_number: string
  recipient_name: string | null
  role_name: string | null
  program_title: string | null
  issued_at: string | null
  revoked_at: string | null
}

/** What one verification attempt came back as. */
export type VerificationOutcome =
  /** The register knows this token. `certificate.status` says what it is. */
  | { kind: "found"; certificate: PublicCertificate }
  /** No certificate matches. Says nothing about why — see the note below. */
  | { kind: "not_found" }
  /** 429: this IP has checked too many codes in the last five minutes. */
  | { kind: "rate_limited" }
  /** Network, CORS, or a 5xx. The register could not be asked at all. */
  | { kind: "unavailable" }

/**
 * Verify one token. Never throws; every path ends in a `VerificationOutcome`.
 *
 * A MALFORMED TOKEN IS "not found", NOT AN ERROR. The route bounds the token to
 * 16–128 characters, so a scan that dropped half the code comes back 422 rather
 * than 404. To the person holding the sheet those are the same fact — nothing
 * here matches what you scanned — and showing them a server error for a partial
 * scan would send them chasing a fault that is on the camera, not the register.
 */
export async function verifyCertificate(
  token: string,
  signal?: AbortSignal,
): Promise<VerificationOutcome> {
  let response: Response
  try {
    response = await fetch(
      `${PORTAL_API_BASE}/public/certificates/${encodeURIComponent(token)}`,
      { signal, headers: { Accept: "application/json" } },
    )
  } catch {
    // Offline, DNS, CORS, an aborted request — we never reached the register.
    return { kind: "unavailable" }
  }

  if (response.status === 404 || response.status === 422 || response.status === 400) {
    return { kind: "not_found" }
  }
  if (response.status === 429) {
    return { kind: "rate_limited" }
  }
  if (!response.ok) {
    return { kind: "unavailable" }
  }

  try {
    const certificate = (await response.json()) as PublicCertificate
    // A 200 without a serial is not a certificate; treat it as an outage
    // rather than rendering an empty card that looks like an answer.
    if (typeof certificate?.certificate_number !== "string") {
      return { kind: "unavailable" }
    }
    return { kind: "found", certificate }
  } catch {
    return { kind: "unavailable" }
  }
}
