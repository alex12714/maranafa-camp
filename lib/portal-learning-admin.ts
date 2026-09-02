/**
 * Role-learning AUTHORING API helpers (director-only half of the feature).
 *
 * Mirrors maranafa-api app/routers/learning_admin.py + app/schemas/learning_admin.py:
 *   GET    /learning/admin/programs                      -> AdminProgram[]
 *   POST   /learning/admin/programs                      -> AdminProgram
 *   GET    /learning/admin/programs/{id}/versions        -> AdminVersion[]
 *   POST   /learning/admin/programs/{id}/versions        -> AdminVersion  (new draft)
 *   GET    /learning/admin/versions/{id}                 -> AdminVersion
 *   PATCH  /learning/admin/versions/{id}                 -> AdminVersion  (DRAFT only)
 *   DELETE /learning/admin/versions/{id}                 -> 204           (DRAFT only)
 *   POST   /learning/admin/versions/{id}/clone           -> AdminVersion  (new draft)
 *   POST   /learning/admin/versions/{id}/publish         -> AdminVersion
 *   POST   /learning/admin/versions/{id}/retire          -> AdminVersion
 *   GET    /learning/admin/versions/{id}/checklist       -> PublishChecklist
 *
 * THE COUNTERPART OF lib/portal-learning.ts, AND DELIBERATELY NOT MERGED WITH
 * IT. That module is what a learner's browser talks to; this one is what an
 * author's does. The API draws the same line — two routers, two schema modules
 * — because it is what keeps `is_correct`, which lives one join away from
 * everything here, out of any shape a learner can fetch. Keeping the clients
 * apart keeps the import graph honest about which pages are which.
 *
 * EVERY ROUTE HERE IS `require_director`, INCLUDING THE READS. A non-director
 * gets 403 on all eleven, so callers must render a refusal rather than an empty
 * editor; see `isForbidden`.
 *
 * A PUBLISHED VERSION IS IMMUTABLE. `updateVersion` and `deleteVersion` 409 the
 * moment a version leaves `draft`, by design — the way to change published
 * content is `cloneVersion`, which copies the whole subtree into a fresh draft.
 * The UI must offer that, not an Edit button that fails.
 */

import { apiFetch } from "@/lib/portal-api"

// ---------------------------------------------------------------------------
// Types (mirror app/schemas/learning_admin.py)
// ---------------------------------------------------------------------------

/** The permanent learning program for one role; `code` is the app-owned slug. */
export interface AdminProgram {
  id: string
  role_id: string
  code: string
  active: boolean
}

/**
 * The three states of a version, and the whole lifecycle between them.
 *
 * `draft` is the only writable one. `published` is frozen. `retired` is frozen
 * AND closed to new attempts — but never deleted, because it is still the
 * content behind somebody's certificate.
 */
export type VersionStatus = "draft" | "published" | "retired"

export interface AdminVersion {
  id: string
  program_id: string
  version_number: number
  /** One of `VersionStatus`; typed loosely so an unknown server state renders. */
  status: string
  title: string | null
  description: string | null
  /**
   * The languages this version is COMPLETE in, frozen at publish and empty on a
   * draft. Never "the languages somebody started translating" — a half-done
   * language is absent from this list rather than present with holes.
   */
  available_languages: string[]
  published_at: string | null
  retired_at: string | null
}

/** `block` refuses the publish; `warn` is reported and changes nothing. */
export type ChecklistSeverity = "block" | "warn"

/**
 * One thing wrong with a draft, and precisely where.
 *
 * The locators are all optional because the problems are not the same shape:
 * "this version has no required questions" is about the version, "question 7
 * has no remediation material" is about one question, and "lv is incomplete" is
 * about a language. Render whichever ones are present — they are how an author
 * knows which row to open.
 */
export interface ChecklistItem {
  code: string
  severity: string
  message: string
  module_code: string | null
  question_code: string | null
  lang: string | null
  subject_id: string | null
}

/**
 * The full answer to "may this draft publish, and what is missing?".
 *
 * Returned whole — blocks AND warnings AND the languages a publish would freeze
 * — so the author sees every problem at once instead of discovering them one
 * refused publish at a time.
 */
export interface PublishChecklist {
  version_id: string
  status: string
  publishable: boolean
  required_languages: string[]
  available_languages: string[]
  blocks: ChecklistItem[]
  warnings: ChecklistItem[]
}

/** GET /roles — id -> name, so a program can be shown as its role. */
export interface AdminRole {
  id: string
  name: string | null
  description: string | null
}

/**
 * GET /auth/me. Only the fields this feature reads.
 *
 * `is_director` is ORTHOGONAL to `role`: it is an AirTable 'Роли' assignment,
 * so a person whose auth role is `participant` can hold it and most `staff` do
 * not. It is the same predicate `require_director` applies server-side, which
 * is why the client may use it to choose a screen — but never as the security
 * boundary, which is the API's 403.
 */
export interface AdminAuthUser {
  id: string
  name: string | null
  role: string
  is_director: boolean
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/**
 * A refusal from the authoring API, carrying the distinction the server drew:
 *   403 — not a director. Every route, reads included.
 *   404 — no such program or version.
 *   409 — the STATE is the problem, and nothing the caller sends will change
 *         the answer: editing/deleting a published version, publishing a
 *         non-draft, retiring a draft. The fix is a different verb (clone).
 *   422 — publish refused; `checklist` carries every block and warning.
 *
 * `checklist` is populated only on the 422 from publish. It is the same shape
 * GET /checklist returns, handed back by the refused call so the UI never has
 * to re-fetch to find out what went wrong.
 */
export class LearningAdminError extends Error {
  readonly status: number
  readonly checklist: PublishChecklist | null

  constructor(
    status: number,
    message?: string,
    checklist: PublishChecklist | null = null,
  ) {
    super(message ?? `Learning admin API error: HTTP ${status}`)
    this.name = "LearningAdminError"
    this.status = status
    this.checklist = checklist
  }
}

/** True when this failure is the director gate rather than anything the author did. */
export function isForbidden(error: unknown): boolean {
  return error instanceof LearningAdminError && error.status === 403
}

/**
 * Parse the API's uniform `{error, message, details?}` envelope.
 *
 * The 422 from publish puts the whole checklist under
 * `details.checklist` (see the raiser in learning_admin.py), so a refused
 * publish and a plain GET of the checklist reach the UI as the same object.
 */
async function readError(res: Response): Promise<LearningAdminError> {
  let message: string | undefined
  let checklist: PublishChecklist | null = null

  try {
    const body = (await res.json()) as {
      message?: unknown
      details?: unknown
      detail?: unknown
    }
    if (typeof body.message === "string" && body.message) message = body.message
    // `detail` covers a raiser that bypassed the envelope handler.
    else if (typeof body.detail === "string") message = body.detail

    const details = body.details
    if (details && typeof details === "object" && "checklist" in details) {
      const candidate = (details as { checklist?: unknown }).checklist
      if (candidate && typeof candidate === "object") {
        checklist = candidate as PublishChecklist
      }
    }
  } catch {
    // Non-JSON body (proxy error page, empty 502) — the status is the message.
  }

  return new LearningAdminError(res.status, message, checklist)
}

// ---------------------------------------------------------------------------
// Calls — programs
// ---------------------------------------------------------------------------

const BASE = "/learning/admin"

/** GET /learning/admin/programs — every program, ordered by code. */
export async function fetchPrograms(): Promise<AdminProgram[]> {
  const res = await apiFetch(`${BASE}/programs`)
  if (!res.ok) throw await readError(res)
  return (await res.json()) as AdminProgram[]
}

/**
 * POST /learning/admin/programs — open the program for a role.
 *
 * 409 when that role already has an active program: one role, one answer to
 * "start my training". 422 when the role id is unknown.
 */
export async function createProgram(input: {
  role_id: string
  code: string
  active?: boolean
}): Promise<AdminProgram> {
  const res = await apiFetch(`${BASE}/programs`, {
    method: "POST",
    body: JSON.stringify({ active: true, ...input }),
  })
  if (!res.ok) throw await readError(res)
  return (await res.json()) as AdminProgram
}

// ---------------------------------------------------------------------------
// Calls — versions
// ---------------------------------------------------------------------------

/** GET .../programs/{id}/versions — every version, ordered by version_number. */
export async function fetchVersions(programId: string): Promise<AdminVersion[]> {
  const res = await apiFetch(
    `${BASE}/programs/${encodeURIComponent(programId)}/versions`,
  )
  if (!res.ok) throw await readError(res)
  return (await res.json()) as AdminVersion[]
}

/** POST .../programs/{id}/versions — open an empty draft. The server numbers it. */
export async function createVersion(
  programId: string,
  input: { title?: string | null; description?: string | null } = {},
): Promise<AdminVersion> {
  const res = await apiFetch(
    `${BASE}/programs/${encodeURIComponent(programId)}/versions`,
    { method: "POST", body: JSON.stringify(input) },
  )
  if (!res.ok) throw await readError(res)
  return (await res.json()) as AdminVersion
}

/** GET .../versions/{id}. */
export async function fetchVersion(versionId: string): Promise<AdminVersion> {
  const res = await apiFetch(`${BASE}/versions/${encodeURIComponent(versionId)}`)
  if (!res.ok) throw await readError(res)
  return (await res.json()) as AdminVersion
}

/**
 * PATCH .../versions/{id} — a DRAFT's own title and description.
 *
 * 409 on anything published or retired. That is not an error to retry: it is
 * the immutability guarantee, and the caller's next move is `cloneVersion`.
 */
export async function updateVersion(
  versionId: string,
  input: { title?: string | null; description?: string | null },
): Promise<AdminVersion> {
  const res = await apiFetch(
    `${BASE}/versions/${encodeURIComponent(versionId)}`,
    { method: "PATCH", body: JSON.stringify(input) },
  )
  if (!res.ok) throw await readError(res)
  return (await res.json()) as AdminVersion
}

/**
 * DELETE .../versions/{id} — throw away a DRAFT nobody has taken.
 *
 * 409 from `published` onward, and there is no undo behind it: a retired
 * version is still the content behind somebody's certificate. Retire instead.
 */
export async function deleteVersion(versionId: string): Promise<void> {
  const res = await apiFetch(
    `${BASE}/versions/${encodeURIComponent(versionId)}`,
    { method: "DELETE" },
  )
  if (!res.ok) throw await readError(res)
}

/**
 * POST .../versions/{id}/clone — copy the whole subtree into a new draft.
 *
 * THIS IS WHAT "EDITING A PUBLISHED VERSION" MEANS. Allowed from any status.
 * Module/question/option codes are preserved so the copy can be diffed against
 * its source; `available_languages` is not, because the clone has to earn it
 * again at its own publish.
 */
export async function cloneVersion(versionId: string): Promise<AdminVersion> {
  const res = await apiFetch(
    `${BASE}/versions/${encodeURIComponent(versionId)}/clone`,
    { method: "POST" },
  )
  if (!res.ok) throw await readError(res)
  return (await res.json()) as AdminVersion
}

/**
 * POST .../versions/{id}/publish — freeze the draft.
 *
 * Throws `LearningAdminError` with `status === 422` and a populated `checklist`
 * when the draft is not ready; publishing also retires whichever version of the
 * same program was published before, atomically.
 */
export async function publishVersion(versionId: string): Promise<AdminVersion> {
  const res = await apiFetch(
    `${BASE}/versions/${encodeURIComponent(versionId)}/publish`,
    { method: "POST" },
  )
  if (!res.ok) throw await readError(res)
  return (await res.json()) as AdminVersion
}

/**
 * POST .../versions/{id}/retire — stop new attempts starting here.
 *
 * NOT a deletion and not a rollback: every row stays, and attempts already open
 * finish during the configured grace window. Idempotent on an already-retired
 * version; 409 on a draft.
 */
export async function retireVersion(versionId: string): Promise<AdminVersion> {
  const res = await apiFetch(
    `${BASE}/versions/${encodeURIComponent(versionId)}/retire`,
    { method: "POST" },
  )
  if (!res.ok) throw await readError(res)
  return (await res.json()) as AdminVersion
}

/** GET .../versions/{id}/checklist — everything standing between draft and publish. */
export async function fetchChecklist(
  versionId: string,
): Promise<PublishChecklist> {
  const res = await apiFetch(
    `${BASE}/versions/${encodeURIComponent(versionId)}/checklist`,
  )
  if (!res.ok) throw await readError(res)
  return (await res.json()) as PublishChecklist
}

// ---------------------------------------------------------------------------
// Calls — supporting reads
// ---------------------------------------------------------------------------

/** GET /roles — so a program's `role_id` can be shown as a role name. */
export async function fetchRoles(): Promise<AdminRole[]> {
  const res = await apiFetch("/roles")
  if (!res.ok) throw await readError(res)
  return (await res.json()) as AdminRole[]
}

/**
 * GET /auth/me — used only to choose between the editor and the refusal screen.
 *
 * NOT the security boundary. The boundary is the API's 403 on all eleven admin
 * routes; this read just spares a director-less visitor a screen full of failed
 * requests.
 */
export async function fetchAuthUser(): Promise<AdminAuthUser> {
  const res = await apiFetch("/auth/me")
  if (!res.ok) throw await readError(res)
  return (await res.json()) as AdminAuthUser
}
