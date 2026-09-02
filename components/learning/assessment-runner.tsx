"use client"

/**
 * The assessment runner: one state machine for every question type.
 *
 * show item -> submit -> correct (mastered, advance, the author's explanation
 * if there is one) OR incorrect (-> awaiting_remediation: the assigned material
 * and a retry of the SAME question).
 *
 * THE SERVER IS AUTHORITATIVE AND THE SERVER IS THE ONLY STATE. Every screen
 * here is drawn from a fresh `GET /me/learning/attempts/{id}`; nothing about
 * where the learner is touches localStorage, which is what makes "start on a
 * laptop, finish on a phone" and "refresh mid-question" the same code path.
 * Correctness, eligibility and progress are read, never computed.
 *
 * THE RETRY NEVER REVEALS THE ANSWER. A wrong answer is told it was wrong and
 * nothing else — no option is marked, no option is eliminated, and the payload
 * that drew the question carries no correctness to leak.
 *
 * The disabled controls and the stale-response guard below are CONVENIENCE.
 * They stop a double-tap from looking like two answers; what stops it from
 * BEING two answers is the idempotency key and the server's item lock.
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Loader2,
  RotateCcw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { QuestionRenderer, canRender } from "@/components/learning/question-renderer"
import { LearningProgressBar } from "@/components/learning/learning-progress"
import { TranslatedText } from "@/components/translated-text"
import { useLanguage } from "@/contexts/language-context"
import {
  LearningApiError,
  fetchAttempt,
  isActiveAttempt,
  newIdempotencyKey,
  submitResponse,
  type LearningAttempt,
  type LearningItem,
  type LearningMaterial,
  type LearningProgress,
  type ResponseResult,
} from "@/lib/portal-learning"

/** Why a submission did not land, in the terms the learner needs. */
type SubmitError =
  /** Network / 5xx: the answer may or may not have been recorded — retry replays the key. */
  | "network"
  /** 409: the world moved (attempt closed, not the current item, remediation not acknowledged). */
  | "state"
  /** 422: the answer is not well-formed for this question. */
  | "invalid"

export function AssessmentRunner({ attemptId }: { attemptId: string }) {
  const { language } = useLanguage()

  const [attempt, setAttempt] = useState<LearningAttempt | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<Error | null>(null)

  const [selected, setSelected] = useState<string[]>([])
  const [pending, setPending] = useState(false)
  const [submitError, setSubmitError] = useState<SubmitError | null>(null)
  /** Set only for a CORRECT answer — the confirmation the learner reads before advancing. */
  const [verdict, setVerdict] = useState<ResponseResult | null>(null)
  /**
   * The learner has read the remediation and asked for the question back.
   *
   * CLIENT-ONLY, AND DELIBERATELY NOT PERSISTED. The item stays
   * ``awaiting_remediation`` on the server until an answer is accepted, so a
   * refresh lands back on the material — which is the state the server holds
   * and the state the retry is gated on. This flag only spares the learner a
   * second tap between reading and answering.
   */
  const [retrying, setRetrying] = useState(false)

  /**
   * Monotonic request counter. Every read and every submit takes a ticket, and
   * a result whose ticket is no longer current is dropped: after the learner
   * has moved on, a late reply must not repaint the screen they are looking at.
   */
  const seqRef = useRef(0)
  const mountedRef = useRef(true)
  /** Mirrors `pending` for the guard, because setState is not synchronous. */
  const pendingRef = useRef(false)
  /**
   * The key for the answer currently being submitted, pinned to its item.
   *
   * Kept across a failed send so a retry REPLAYS rather than records a second
   * response — a duplicated wrong answer would inflate `remediation_count` on a
   * permanent training record. Cleared once a verdict is in hand, so the next
   * answer (after remediation, say) is a new answer with a new key.
   */
  const keyRef = useRef<{ itemId: string; key: string } | null>(null)
  /** When the current question was first shown, for the audit-only `elapsed_ms`. */
  const shownAtRef = useRef<number | null>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  /**
   * Re-read the attempt. Returns true only when THIS call painted the screen —
   * a stale or failed read returns false, and callers use that to decide
   * whether the state they were showing may be dropped.
   */
  const load = useCallback(
    async ({ quiet = false }: { quiet?: boolean } = {}): Promise<boolean> => {
      const seq = ++seqRef.current
      if (!quiet) setLoading(true)
      setLoadError(null)
      try {
        const next = await fetchAttempt(attemptId, language)
        if (!mountedRef.current || seq !== seqRef.current) return false
        setAttempt(next)
        setSelected([])
        setRetrying(false)
        shownAtRef.current = Date.now()
        return true
      } catch (error) {
        if (!mountedRef.current || seq !== seqRef.current) return false
        // A 401 already sent the browser to /portal/login via apiFetch.
        setLoadError(error as Error)
        return false
      } finally {
        if (mountedRef.current && seq === seqRef.current) setLoading(false)
      }
    },
    [attemptId, language],
  )

  // Re-reads on mount AND whenever the language changes: the prompt and the
  // options are localized by the API, so a language switch is a new payload
  // rather than a client-side relabelling.
  useEffect(() => {
    void load()
  }, [load])

  async function handleSubmit() {
    const item = attempt?.current_item
    if (!item || pendingRef.current || selected.length === 0) return

    pendingRef.current = true
    setPending(true)
    setSubmitError(null)

    if (keyRef.current?.itemId !== item.id) {
      keyRef.current = { itemId: item.id, key: newIdempotencyKey() }
    }
    const key = keyRef.current.key
    const seq = ++seqRef.current
    const elapsedMs =
      shownAtRef.current === null ? null : Date.now() - shownAtRef.current

    try {
      const result = await submitResponse(
        attemptId,
        item.id,
        {
          idempotency_key: key,
          selected_option_ids: selected,
          elapsed_ms: elapsedMs,
        },
        language,
      )
      // The answer is recorded; the NEXT answer is a different answer.
      keyRef.current = null
      if (!mountedRef.current || seq !== seqRef.current) return

      // The verdict is held for BOTH outcomes until the state behind it has
      // actually been read. Dropping a wrong verdict on the assumption that the
      // re-read will succeed would put the learner back on an answerable
      // question with the answer already recorded — and their next tap would
      // record a SECOND wrong answer against the same item.
      setVerdict(result)
      if (!result.is_correct) {
        // The remediation materials and `can_retry` are only on the attempt
        // read, so a wrong answer costs one extra round trip. Once it lands the
        // item is `awaiting_remediation` and the panel below takes over.
        if (await load({ quiet: true })) setVerdict(null)
      }
    } catch (error) {
      if (!mountedRef.current || seq !== seqRef.current) return
      const status = error instanceof LearningApiError ? error.status : 0
      if (status === 409) {
        // The state is not what we assumed. 409 means nothing was written, so
        // the key is spent; re-read and show the learner where they actually
        // are.
        keyRef.current = null
        setSubmitError("state")
        await load({ quiet: true })
      } else if (status === 422 || status === 404 || status === 403) {
        keyRef.current = null
        setSubmitError(status === 422 ? "invalid" : "state")
        if (status !== 422) await load({ quiet: true })
      } else {
        // Network failure or 5xx: the write may have landed. KEEP the key so a
        // retry replays that verdict instead of recording a second answer.
        setSubmitError("network")
      }
    } finally {
      if (mountedRef.current) {
        pendingRef.current = false
        setPending(false)
      }
    }
  }

  /**
   * Pull the state behind the verdict, THEN leave the verdict.
   *
   * Used by both outcomes: after a correct answer it fetches the next item, and
   * after a wrong one whose follow-up read failed it fetches the remediation.
   *
   * In that order so a slow network shows the confirmation a moment longer
   * rather than flashing the question that was just answered — and so a failed
   * read leaves the learner somewhere true, with the retry still in front of
   * them.
   */
  async function advance() {
    if (loading) return
    if (await load()) setVerdict(null)
  }

  /**
   * Back to the SAME question after the remediation.
   *
   * No re-read: the question is already in hand and unchanged, and the server
   * would still report ``awaiting_remediation`` — the item does not leave that
   * state until an answer is accepted. Whether the retry is allowed at all is
   * the server's call, made again when the answer is submitted.
   */
  function retry() {
    setSelected([])
    setSubmitError(null)
    setRetrying(true)
    shownAtRef.current = Date.now()
  }

  // --- Loading ------------------------------------------------------------ //
  if (loading && attempt === null) {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">
            <TranslatedText text="Загрузка…" />
          </p>
        </div>
      </Shell>
    )
  }

  // --- Load error --------------------------------------------------------- //
  if (attempt === null) {
    const status = loadError instanceof LearningApiError ? loadError.status : 0
    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p role="alert" className="text-sm font-medium text-red-600">
            <TranslatedText
              text={
                status === 403 || status === 404
                  ? "Это обучение недоступно."
                  : "Не удалось загрузить обучение. Попробуйте ещё раз."
              }
            />
          </p>
          {status !== 403 && status !== 404 && (
            <Button type="button" variant="outline" onClick={() => void load()}>
              <TranslatedText text="Повторить" />
            </Button>
          )}
          <Link
            href="/portal/learning"
            className="text-sm font-medium text-gray-500 underline-offset-4 hover:underline"
          >
            <TranslatedText text="К обучению" />
          </Link>
        </div>
      </Shell>
    )
  }

  const item = attempt.current_item
  // After a correct answer the attempt in hand is one answer stale, so the bar
  // is drawn from the verdict's counts — the same two integers, freshly read.
  const progress: LearningProgress = verdict
    ? {
        mastered_required: verdict.mastered_items,
        total_required: verdict.total_items,
        position: null,
      }
    : attempt.progress

  // --- The attempt is over ------------------------------------------------ //
  if (!isActiveAttempt(attempt.status)) {
    return (
      <Shell title={attempt.role_name} progress={progress}>
        <ClosedAttempt attempt={attempt} />
      </Shell>
    )
  }

  return (
    <Shell title={attempt.role_name} progress={progress}>
      {attempt.grace_deadline && (
        <GraceNotice deadline={attempt.grace_deadline} />
      )}

      {/* Correct: confirm, explain if the author wrote one, then advance. */}
      {verdict?.is_correct && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <div className="min-w-0 space-y-2">
              <p className="text-sm font-semibold text-green-800">
                <TranslatedText text="Верно!" />
              </p>
              {verdict.correct_explanation_markdown && (
                <p className="whitespace-pre-wrap text-sm text-green-900">
                  {verdict.correct_explanation_markdown}
                </p>
              )}
            </div>
          </div>
          {loadError && (
            <p role="alert" className="text-sm font-medium text-red-600">
              <TranslatedText text="Не удалось загрузить обучение. Попробуйте ещё раз." />
            </p>
          )}
          <Button
            type="button"
            className="h-12 w-full text-base font-semibold"
            disabled={loading}
            onClick={() => void advance()}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <TranslatedText
              text={
                verdict.next_item_id === null ? "Завершить" : "Следующий вопрос"
              }
            />
          </Button>
        </div>
      )}

      {/* Wrong, and the read that fetches the remediation did not land. The
          answer IS recorded, so the question must not come back with a submit
          button under it — the learner is told what happened and offered the
          read again. */}
      {verdict && !verdict.is_correct && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4">
            <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <p role="status" className="text-sm font-semibold text-amber-900">
              <TranslatedText text="Не совсем — прочитай и попробуй ещё раз." />
            </p>
          </div>
          <p role="alert" className="text-sm font-medium text-red-600">
            <TranslatedText text="Не удалось загрузить обучение. Попробуйте ещё раз." />
          </p>
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full text-base font-semibold"
            disabled={loading}
            onClick={() => void advance()}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <TranslatedText text="Повторить" />
          </Button>
        </div>
      )}

      {/* Wrong: the assigned material and a retry of the SAME question. */}
      {!verdict && !retrying && item?.status === "awaiting_remediation" && (
        <Remediation
          item={item}
          busy={loading || pending}
          onRetry={retry}
        />
      )}

      {/* The question itself. */}
      {!verdict && item && (retrying || item.status !== "awaiting_remediation") && (
        <div className="space-y-5">
          <Question item={item} />
          <QuestionRenderer
            question={item.question}
            selected={selected}
            onSelect={setSelected}
            disabled={pending}
          />
          {submitError && <SubmitErrorNotice kind={submitError} />}
          <Button
            type="button"
            className="h-12 w-full text-base font-semibold"
            disabled={
              pending || selected.length === 0 || !canRender(item.question.question_type)
            }
            onClick={() => void handleSubmit()}
          >
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <TranslatedText
              text={submitError === "network" ? "Повторить" : "Ответить"}
            />
          </Button>
        </div>
      )}

      {/* Active, but the server gave us no item: nothing sensible to draw. */}
      {!verdict && !item && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p role="alert" className="text-sm text-gray-500">
            <TranslatedText text="Не удалось загрузить обучение. Попробуйте ещё раз." />
          </p>
          <Button type="button" variant="outline" onClick={() => void load()}>
            <TranslatedText text="Повторить" />
          </Button>
        </div>
      )}
    </Shell>
  )
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function Shell({
  title,
  progress,
  children,
}: {
  title?: string | null
  progress?: LearningProgress
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto w-full max-w-lg space-y-6">
        <div>
          <Link
            href="/portal/learning"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <TranslatedText text="К обучению" />
          </Link>
          {title && (
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
              {title}
            </h1>
          )}
        </div>
        {progress && <LearningProgressBar progress={progress} />}
        {children}
      </div>
    </div>
  )
}

function Question({ item }: { item: LearningItem }) {
  return (
    <div className="space-y-2">
      {/* Markdown is rendered as text on purpose: the portal has no markdown
          renderer, and injecting authored HTML into the page would be a far
          worse answer than showing the source line breaks. */}
      <p className="whitespace-pre-wrap text-base font-semibold text-gray-900">
        {item.question.prompt_markdown ?? item.question.code}
      </p>
      {item.question.audio?.transcript && (
        <p className="whitespace-pre-wrap text-sm text-gray-500">
          {item.question.audio.transcript}
        </p>
      )}
    </div>
  )
}

/**
 * The wrong-answer screen.
 *
 * It says the answer was wrong and points at what to read. It does NOT say
 * which option was right, does not eliminate the chosen one, and does not
 * change between attempts — a learner must not be able to converge on the
 * answer by reading the feedback.
 *
 * `can_retry` comes from the server, which also enforces it: the retry stays
 * disabled until every required material has been opened AND acknowledged.
 * Recording those two timestamps is the remediation-gate bead's job; until it
 * lands, a question with required material shows the material and an explicit
 * "not yet" rather than a button that would 409.
 */
function Remediation({
  item,
  busy,
  onRetry,
}: {
  item: LearningItem
  busy: boolean
  onRetry: () => void
}) {
  const materials = [...(item.remediation?.materials ?? [])].sort(
    (a, b) => a.sort - b.sort,
  )
  const canRetry = item.remediation?.can_retry ?? false

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4">
        <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <p role="status" className="text-sm font-semibold text-amber-900">
          <TranslatedText text="Не совсем — прочитай и попробуй ещё раз." />
        </p>
      </div>

      {materials.map((material) => (
        <MaterialCard key={material.id} material={material} />
      ))}

      <Button
        type="button"
        className="h-12 w-full text-base font-semibold"
        disabled={busy || !canRetry}
        onClick={onRetry}
      >
        {busy ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RotateCcw className="mr-2 h-4 w-4" />
        )}
        <TranslatedText text="Попробовать ещё раз" />
      </Button>
      {!canRetry && (
        <p className="text-center text-xs text-gray-500">
          <TranslatedText text="Сначала откройте и подтвердите материал." />
        </p>
      )}
    </div>
  )
}

function MaterialCard({ material }: { material: LearningMaterial }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3.5">
      {material.title && (
        <p className="text-sm font-semibold text-gray-900">{material.title}</p>
      )}
      {material.body_markdown && (
        <p className="mt-1.5 whitespace-pre-wrap text-sm text-gray-700">
          {material.body_markdown}
        </p>
      )}
      {material.asset?.transcript && (
        <p className="mt-1.5 whitespace-pre-wrap text-sm text-gray-500">
          {material.asset.transcript}
        </p>
      )}
    </div>
  )
}

/** Passed, expired or abandoned — no question, and nothing to answer. */
function ClosedAttempt({ attempt }: { attempt: LearningAttempt }) {
  if (attempt.status === "passed") {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-4">
          <Award className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-green-800">
              <TranslatedText text="Обучение пройдено!" />
            </p>
            {attempt.certificate && (
              <p className="mt-1 text-sm text-green-900">
                <TranslatedText text="Сертификат" />
                {`: ${attempt.certificate.certificate_number}`}
              </p>
            )}
          </div>
        </div>
        <Link href="/portal/learning">
          <Button type="button" variant="outline" className="h-12 w-full">
            <TranslatedText text="К обучению" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
        <p className="text-sm font-medium text-gray-800">
          <TranslatedText
            text={
              attempt.status === "expired"
                ? "Срок этой попытки истёк. Начните обучение заново."
                : "Эта попытка закрыта."
            }
          />
        </p>
      </div>
      <Link href="/portal/learning">
        <Button type="button" variant="outline" className="h-12 w-full">
          <TranslatedText text="К обучению" />
        </Button>
      </Link>
    </div>
  )
}

/** Only ever shown while a retired version's window is still open. */
function GraceNotice({ deadline }: { deadline: string }) {
  const when = new Date(deadline)
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <TranslatedText text="Программа обновилась. Завершите эту попытку до" />
      {` ${Number.isNaN(when.getTime()) ? deadline : when.toLocaleString()}.`}
    </p>
  )
}

function SubmitErrorNotice({ kind }: { kind: SubmitError }) {
  const text =
    kind === "network"
      ? "Ответ не отправлен. Проверьте связь и попробуйте ещё раз."
      : kind === "invalid"
        ? "Выберите один вариант ответа."
        : "Обучение обновилось. Посмотрите, что изменилось."
  return (
    <p role="alert" className="text-sm font-medium text-red-600">
      <TranslatedText text={text} />
    </p>
  )
}
