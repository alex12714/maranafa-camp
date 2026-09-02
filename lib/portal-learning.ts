/**
 * Role learning (training paths & assessments) API helpers for the portal.
 *
 * Mirrors the maranafa-api contracts (app/schemas/learning.py,
 * app/routers/learning.py, app/routers/learning_responses.py):
 *   GET  /me/learning/roles                       -> MyLearningRole[]
 *   POST /me/learning/roles/{role_id}/attempts    -> LearningAttempt (start OR resume; always 200)
 *   GET  /me/learning/attempts/{attempt_id}       -> LearningAttempt
 *   POST /me/learning/attempts/{id}/items/{id}/responses -> ResponseResult
 *
 * THE SERVER OWNS THE STATE. Nothing about where a learner is may be cached in
 * localStorage: resume has to work on a second device and after a refresh, and
 * the only way that is true is if every screen is drawn from a fresh read of
 * the attempt. Correctness, eligibility and progress are likewise never
 * computed here — the client renders what the API says.
 *
 * NO CORRECTNESS EVER ARRIVES. Options carry no `is_correct` and the response
 * result names no right option, deliberately: a learner reading the network tab
 * must learn nothing beyond the verdict on the answer they gave. Do not add a
 * field here "just for the preview".
 */

import { apiFetch } from "@/lib/portal-api"

// ---------------------------------------------------------------------------
// Types (mirror app/schemas/learning.py)
// ---------------------------------------------------------------------------

/**
 * A playable/downloadable file behind a prompt, option or material.
 *
 * Carries an id rather than a URL — the bytes are served by an authenticated
 * endpoint. NOTE: that endpoint does not exist in the API yet, so only
 * `transcript` is renderable today.
 */
export interface LearningAsset {
  id: string
  mime_type: string | null
  duration_ms: number | null
  transcript: string | null
}

/**
 * One answer option as the learner sees it.
 *
 * `sort` is contract, not decoration: for `swipe_binary` the option at
 * `sort === 0` is the left direction and `sort === 1` the right one, so
 * renderers must order by `sort` and never by array position.
 */
export interface LearningOption {
  id: string
  code: string
  sort: number
  label: string | null
  audio: LearningAsset | null
}

/** The four renderers the content model allows. Only `single_choice` is built. */
export type LearningQuestionType =
  | "single_choice"
  | "yes_no"
  | "multi_select"
  | "swipe_binary"

export interface LearningQuestion {
  id: string
  code: string
  /** One of `LearningQuestionType`; typed loosely so new server types render a fallback. */
  question_type: string
  prompt_markdown: string | null
  audio: LearningAsset | null
  options: LearningOption[]
}

/**
 * One remediation material with this learner's progress through it.
 *
 * `opened_at` and `acknowledged_at` are separate on purpose: opening is
 * passive, acknowledging is an explicit tap, and only the second unlocks the
 * retry. Writing either is the remediation-gate bead's job, not this one's.
 */
export interface LearningMaterial {
  id: string
  kind: string
  sort: number
  required: boolean
  title: string | null
  body_markdown: string | null
  asset: LearningAsset | null
  opened_at: string | null
  acknowledged_at: string | null
}

/** `can_retry` is computed server-side; the gate is enforced at the response endpoint. */
export interface LearningRemediation {
  materials: LearningMaterial[]
  can_retry: boolean
}

/** Per-item state within an attempt. */
export type LearningItemStatus = "pending" | "awaiting_remediation" | "mastered"

/** The one item the learner is on — never a list, never the next one. */
export interface LearningItem {
  id: string
  status: string
  /** 1-based; the numerator of "Вопрос 4 из 12". */
  position: number
  remediation_count: number
  question: LearningQuestion
  /** Present only while the item is `awaiting_remediation`. */
  remediation: LearningRemediation | null
}

/**
 * Two different numbers, both needed.
 *
 * `mastered_required`/`total_required` is the bar; `position`/`total_required`
 * is "Вопрос 4 из 12". They differ whenever somebody is partway through an item
 * they have not mastered, and drawing the bar from the position would tell them
 * they had passed something they had not.
 */
export interface LearningProgress {
  mastered_required: number
  total_required: number
  position: number | null
}

export interface LearningCertificateSummary {
  id: string
  certificate_number: string
  issued_at: string | null
}

/** An attempt's lifecycle (ATTEMPT_STATUSES in app/models/learning_progress.py). */
export type LearningAttemptStatus =
  | "in_progress"
  | "awaiting_remediation"
  | "passed"
  | "expired"
  | "abandoned"

/** The two statuses that mean the path is still open and takes answers. */
export const ACTIVE_ATTEMPT_STATUSES: readonly string[] = [
  "in_progress",
  "awaiting_remediation",
]

export function isActiveAttempt(status: string): boolean {
  return ACTIVE_ATTEMPT_STATUSES.includes(status)
}

export interface LearningAttempt {
  id: string
  status: string
  role_id: string
  role_name: string | null
  program_id: string
  program_code: string
  version_id: string
  version_number: number
  version_title: string | null
  /** The language this payload was rendered in. */
  lang: string
  /** The languages the version is COMPLETE in; anything else falls back to ru. */
  available_languages: string[]
  /** Non-null only while running against a RETIRED version: the closing moment. */
  grace_deadline: string | null
  progress: LearningProgress
  current_item: LearningItem | null
  certificate: LearningCertificateSummary | null
  started_at: string | null
  last_activity_at: string | null
  completed_at: string | null
}

/**
 * One of the caller's roles and the state of its training.
 *
 * A role with NO published path is returned, not omitted, with
 * `status === "training_not_available"` — so the vocabulary is
 * `LearningAttemptStatus` plus `not_started` and `training_not_available`.
 */
export type MyLearningRoleStatus =
  | LearningAttemptStatus
  | "not_started"
  | "training_not_available"

export interface MyLearningRole {
  role_id: string
  role_name: string | null
  training_available: boolean
  /** One of `MyLearningRoleStatus`; typed loosely so an unknown status still renders. */
  status: string

  program_id: string | null
  program_code: string | null
  version_id: string | null
  version_number: number | null
  version_title: string | null
  available_languages: string[]

  attempt_id: string | null
  grace_deadline: string | null
  last_activity_at: string | null
  progress: LearningProgress | null
  certificate: LearningCertificateSummary | null
}

/**
 * The verdict on one answer, and the state it left behind.
 *
 * `replayed` tells a client that retried after a dropped connection that it is
 * looking at its own original verdict rather than a second recorded answer.
 *
 * `correct_explanation_markdown` is the author's note on an understanding the
 * learner has just demonstrated. It is null on every wrong answer, and it is
 * carried here rather than on the question precisely so that it cannot be read
 * before an answer has been given.
 */
export interface ResponseResult {
  response_id: string
  is_correct: boolean
  replayed: boolean
  item_id: string
  item_status: string
  remediation_count: number
  attempt_id: string
  attempt_status: string
  mastered_items: number
  total_items: number
  next_item_id: string | null
  certificate_id: string | null
  correct_explanation_markdown: string | null
}

/** One answer as the client sends it. */
export interface ResponseSubmission {
  idempotency_key: string
  selected_option_ids: string[]
  raw_answer?: Record<string, unknown> | null
  elapsed_ms?: number | null
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/**
 * A refusal from the learning API, carrying the status so callers can act on
 * the distinction the server drew:
 *   403 — you do not hold this role / this attempt is somebody else's
 *   404 — no person record, no such attempt/item, or the role has no path
 *   409 — the state is not what you assumed (attempt finished, not the current
 *         item, remediation not acknowledged). Recoverable by re-reading.
 *   422 — the answer is not a well-formed answer to this question.
 */
export class LearningApiError extends Error {
  readonly status: number

  constructor(status: number, detail?: string) {
    super(detail ?? `Learning API error: HTTP ${status}`)
    this.name = "LearningApiError"
    this.status = status
  }
}

async function readError(res: Response): Promise<LearningApiError> {
  let detail: string | undefined
  try {
    const body = (await res.json()) as { detail?: unknown }
    if (typeof body.detail === "string") detail = body.detail
  } catch {
    // Non-JSON body (proxy error page, empty 502) — the status is the message.
  }
  return new LearningApiError(res.status, detail)
}

// ---------------------------------------------------------------------------
// Idempotency keys
// ---------------------------------------------------------------------------

/**
 * A fresh key for one answer submission. Minimum accepted length is 16, and a
 * uuid is 36.
 *
 * ONE KEY PER ANSWER, REUSED ON RETRY. That is the whole point: a client that
 * re-sends after a dropped connection must send the SAME key, so the server
 * replays its original verdict instead of logging a second wrong answer and
 * inflating `remediation_count` on somebody's permanent record. A genuinely new
 * answer — after remediation, say — gets a new key.
 *
 * `crypto.randomUUID` needs a secure context; the fallback keeps a plain-HTTP
 * dev host working and is still 32 hex characters of `crypto.getRandomValues`.
 */
export function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined") {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID()
    if (typeof crypto.getRandomValues === "function") {
      const bytes = crypto.getRandomValues(new Uint8Array(16))
      return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
    }
  }
  // Last resort: never expected in a browser, and still comfortably over the
  // 16-character floor.
  return `k${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${Math.random()
    .toString(36)
    .slice(2)}`
}

// ---------------------------------------------------------------------------
// Calls
// ---------------------------------------------------------------------------

function langQuery(lang?: string): string {
  return lang ? `?lang=${encodeURIComponent(lang)}` : ""
}

/** GET /me/learning/roles — every role the caller holds, with its training state. */
export async function fetchMyLearningRoles(): Promise<MyLearningRole[]> {
  const res = await apiFetch("/me/learning/roles")
  if (!res.ok) throw await readError(res)
  return (await res.json()) as MyLearningRole[]
}

/**
 * POST /me/learning/roles/{roleId}/attempts — start the path, or hand back the
 * attempt already open. Always 200: tapping Start twice expresses one intention.
 */
export async function startOrResumeAttempt(
  roleId: string,
  lang?: string,
): Promise<LearningAttempt> {
  const res = await apiFetch(
    `/me/learning/roles/${encodeURIComponent(roleId)}/attempts${langQuery(lang)}`,
    { method: "POST" },
  )
  if (!res.ok) throw await readError(res)
  return (await res.json()) as LearningAttempt
}

/**
 * GET /me/learning/attempts/{attemptId} — status, progress, and ONLY the
 * current item. This is the read every screen is drawn from.
 */
export async function fetchAttempt(
  attemptId: string,
  lang?: string,
): Promise<LearningAttempt> {
  const res = await apiFetch(
    `/me/learning/attempts/${encodeURIComponent(attemptId)}${langQuery(lang)}`,
  )
  if (!res.ok) throw await readError(res)
  return (await res.json()) as LearningAttempt
}

/**
 * POST .../items/{itemId}/responses — score one answer.
 *
 * The body's `idempotency_key` must be reused verbatim when retrying the same
 * tap; see `newIdempotencyKey`. `lang` renders the one piece of prose this
 * endpoint returns — the author's explanation of a correct answer.
 */
export async function submitResponse(
  attemptId: string,
  itemId: string,
  submission: ResponseSubmission,
  lang?: string,
): Promise<ResponseResult> {
  const res = await apiFetch(
    `/me/learning/attempts/${encodeURIComponent(attemptId)}/items/${encodeURIComponent(
      itemId,
    )}/responses${langQuery(lang)}`,
    { method: "POST", body: JSON.stringify(submission) },
  )
  if (!res.ok) throw await readError(res)
  return (await res.json()) as ResponseResult
}
