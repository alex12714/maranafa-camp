"use client"

/**
 * Portal training page (/portal/learning).
 *
 * One card per role the person holds, each with the state of its training and a
 * way in. A learner with two roles trains for them independently: separate
 * progress, separate attempts, separate certificates.
 *
 * A ROLE WITH NO PUBLISHED PATH IS SHOWN, LABELLED, not hidden. Dropping it
 * would make "there is no training for this role yet" indistinguishable from
 * "this person does not hold that role", and only the second would be acted on.
 *
 * PROGRESS IS NEVER COLOUR ALONE: the bar always carries "Освоено 3 из 12"
 * beside it, and every status is a word before it is a tint.
 *
 * Resume is a POST to the API, which decides — an open attempt comes back
 * unchanged, an expired one is closed and a fresh path started. The button does
 * not decide; nothing about where the learner is lives in this browser.
 */

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { AuthoringLink } from "@/components/learning/admin/authoring-link"
import { LearningProgressBar } from "@/components/learning/learning-progress"
import { TranslatedText } from "@/components/translated-text"
import { useLanguage } from "@/contexts/language-context"
import {
  LearningApiError,
  fetchMyLearningRoles,
  startOrResumeAttempt,
  type MyLearningRole,
} from "@/lib/portal-learning"

export default function PortalLearningPage() {
  const router = useRouter()
  const { language } = useLanguage()

  const [roles, setRoles] = useState<MyLearningRole[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  /** The role whose Start/Continue is in flight; also the double-tap guard. */
  const [startingRoleId, setStartingRoleId] = useState<string | null>(null)
  const [startError, setStartError] = useState<string | null>(null)

  const load = useCallback(() => {
    setRoles(null)
    setLoadError(false)
    fetchMyLearningRoles()
      .then(setRoles)
      // A 401 already sent the browser to /portal/login via apiFetch; this
      // covers the rest (network, 404 for a parent token, 5xx).
      .catch(() => setLoadError(true))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function open(role: MyLearningRole) {
    if (startingRoleId !== null) return
    setStartingRoleId(role.role_id)
    setStartError(null)
    try {
      // Idempotent by contract: this both starts and resumes, and always 200s.
      const attempt = await startOrResumeAttempt(role.role_id, language)
      router.push(`/portal/learning/${attempt.id}`)
    } catch (error) {
      const status = error instanceof LearningApiError ? error.status : 0
      setStartError(
        status === 404
          ? "Обучение для этой роли пока не опубликовано."
          : status === 403
            ? "Это обучение недоступно."
            : "Не удалось открыть обучение. Попробуйте ещё раз.",
      )
      setStartingRoleId(null)
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6">
          <Link
            href="/portal/me"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <TranslatedText text="Личный кабинет" />
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            <TranslatedText text="Обучение" />
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            <TranslatedText text="Подготовка к вашему служению на конференции" />
          </p>
        </div>

        {roles === null && !loadError && (
          <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">
              <TranslatedText text="Загрузка…" />
            </p>
          </div>
        )}

        {loadError && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p role="alert" className="text-sm font-medium text-red-600">
              <TranslatedText text="Не удалось загрузить обучение. Попробуйте ещё раз." />
            </p>
            <Button type="button" variant="outline" onClick={load}>
              <TranslatedText text="Повторить" />
            </Button>
          </div>
        )}

        {roles !== null && roles.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-500">
            <GraduationCap className="h-8 w-8 text-gray-300" />
            <p className="text-sm">
              <TranslatedText text="За вами пока не закреплено ни одной роли" />
            </p>
          </div>
        )}

        {startError && (
          <p role="alert" className="mb-4 text-sm font-medium text-red-600">
            <TranslatedText text={startError} />
          </p>
        )}

        {roles !== null && roles.length > 0 && (
          <ul className="space-y-3">
            {roles.map((role) => (
              <li key={role.role_id}>
                <RoleCard
                  role={role}
                  busy={startingRoleId === role.role_id}
                  disabled={
                    startingRoleId !== null && startingRoleId !== role.role_id
                  }
                  onOpen={() => void open(role)}
                />
              </li>
            ))}
          </ul>
        )}

        <AuthoringLink />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Role card
// ---------------------------------------------------------------------------

/**
 * The label for each status the API can report.
 *
 * The vocabulary is ATTEMPT_STATUSES plus the two states that are not attempts
 * — `not_started` and `training_not_available`. An unknown value falls back to
 * the status string itself rather than to silence, so a server that grows a
 * state shows something a support call can quote.
 */
const STATUS_LABELS: Record<string, string> = {
  training_not_available: "Обучение пока недоступно",
  not_started: "Не начато",
  in_progress: "В процессе",
  awaiting_remediation: "Нужно повторить материал",
  passed: "Пройдено",
  expired: "Срок истёк",
  abandoned: "Прервано",
}

function RoleCard({
  role,
  busy,
  disabled,
  onOpen,
}: {
  role: MyLearningRole
  busy: boolean
  disabled: boolean
  onOpen: () => void
}) {
  const passed = role.status === "passed"
  const inProgress =
    role.status === "in_progress" || role.status === "awaiting_remediation"
  // `passed` deliberately offers no start button: the resume POST would find no
  // open attempt and begin a SECOND path through content already certified.
  const canStart =
    role.training_available &&
    (role.status === "not_started" ||
      role.status === "expired" ||
      role.status === "abandoned" ||
      inProgress)

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-gray-900">
            {role.role_name ?? "—"}
          </p>
          {role.version_title && (
            <p className="mt-0.5 truncate text-xs text-gray-500">
              {role.version_title}
            </p>
          )}
        </div>
        <StatusBadge status={role.status} />
      </div>

      {role.progress && role.progress.total_required > 0 && (
        <div className="mt-3">
          <LearningProgressBar progress={role.progress} showPosition={false} />
        </div>
      )}

      {passed && role.certificate && (
        <p className="mt-3 flex items-center gap-2 text-sm text-gray-700">
          <Award className="h-4 w-4 shrink-0 text-green-600" />
          <TranslatedText text="Сертификат" />
          {`: ${role.certificate.certificate_number}`}
        </p>
      )}

      {!role.training_available && (
        <p className="mt-3 text-sm text-gray-500">
          <TranslatedText text="Для этой роли обучение ещё не опубликовано. Мы сообщим, когда оно появится." />
        </p>
      )}

      {role.status === "expired" && (
        <p className="mt-3 text-sm text-gray-500">
          <TranslatedText text="Программа обновилась, и срок прошлой попытки истёк. Можно начать заново." />
        </p>
      )}

      {canStart && (
        <Button
          type="button"
          className="mt-4 h-11 w-full font-semibold"
          disabled={busy || disabled}
          onClick={onOpen}
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BookOpen className="mr-2 h-4 w-4" />
          )}
          <TranslatedText
            text={
              inProgress
                ? "Продолжить обучение"
                : role.status === "not_started"
                  ? "Начать обучение"
                  : "Начать заново"
            }
          />
        </Button>
      )}

      {passed && role.attempt_id && (
        <Link href={`/portal/learning/${role.attempt_id}`}>
          <Button type="button" variant="outline" className="mt-4 h-11 w-full">
            <TranslatedText text="Посмотреть результат" />
          </Button>
        </Link>
      )}
    </div>
  )
}

/** Status as a WORD first — the icon and tint only repeat what it already says. */
function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status]
  const tone =
    status === "passed"
      ? "border-green-200 bg-green-50 text-green-800"
      : status === "in_progress" || status === "awaiting_remediation"
        ? "border-blue-200 bg-blue-50 text-blue-800"
        : "border-gray-200 bg-gray-50 text-gray-600"

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${tone}`}
    >
      {status === "passed" && <CheckCircle2 className="h-3.5 w-3.5" />}
      {label ? <TranslatedText text={label} /> : status}
    </span>
  )
}
