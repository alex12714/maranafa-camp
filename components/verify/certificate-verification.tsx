"use client"

/**
 * The human answer to a scanned certificate QR code.
 *
 * WHY THIS FETCHES FROM THE BROWSER AND NOT FROM OUR SERVER.
 * The endpoint is rate limited at 60 checks per five minutes PER IP. Fetching
 * server-side would put every visitor in the world behind one bucket — our
 * container's IP — so a camp office scanning a stack of sheets before a season
 * would spend that budget for everybody, and unrelated visitors would be told
 * "too many checks" about a certificate they had scanned once. Fetching from
 * the browser gives each scanner their own budget, which is the budget the
 * limiter was sized for. It also keeps our server out of a request that is
 * about somebody's name: the payload goes to the person who scanned the code
 * and nowhere else, and never through a log of ours. The cost is that the page
 * needs JavaScript and that api.maranafa.camp must allow this origin — the
 * portal already relies on the same CORS, and a browser that cannot reach the
 * API lands in the honest "could not check" state below rather than a blank.
 *
 * FOUR THINGS THIS PAGE MUST NEVER DO, in the order they would tempt somebody:
 *
 * 1. Re-derive validity. `status` is read through from the API; `revoked_at`
 *    is displayed, never consulted. One decider.
 * 2. Render a revoked certificate as a valid one with a footnote. Somebody is
 *    standing there deciding whether to trust a printed sheet, so REVOKED gets
 *    its own red banner above everything, and the details below it are muted
 *    and explicitly labelled as coming from a withdrawn document.
 * 3. Accuse anybody on a miss. An unknown token is overwhelmingly a bad scan
 *    or a typo, not a forgery, and the copy says so.
 * 4. Distinguish "never existed" from "was deleted". The API refuses to, and
 *    so does this page — both are one sentence: we have no record of this code.
 */

import { useCallback, useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import {
  BadgeCheck,
  Ban,
  Clock,
  HelpCircle,
  Loader2,
  RefreshCw,
  ShieldQuestion,
  WifiOff,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import {
  verifyCertificate,
  type PublicCertificate,
  type VerificationOutcome,
} from "@/lib/public-certificate"

const CONTACT_EMAIL = "welcome@maranafa.camp"

function localeOf(language: string): string {
  return language === "ru"
    ? "ru-RU"
    : language === "lv"
      ? "lv-LV"
      : language === "uk"
        ? "uk-UA"
        : "en-GB"
}

/**
 * A date the way a person reads one. Timestamps arrive in UTC and are rendered
 * in UTC on purpose: the day printed on the document must not shift because
 * the phone scanning it is in another timezone.
 */
function formatDate(raw: string | null, language: string): string | null {
  if (!raw) return null
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toLocaleDateString(localeOf(language), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

// -------------------------------------------------------------------------- //
// Presentation pieces
// -------------------------------------------------------------------------- //

type Tone = "valid" | "revoked" | "neutral" | "waiting"

const TONES: Record<Tone, { band: string; icon: string }> = {
  valid: { band: "bg-emerald-600 text-white", icon: "text-emerald-100" },
  revoked: { band: "bg-[#B22234] text-white", icon: "text-red-100" },
  neutral: { band: "bg-slate-700 text-white", icon: "text-slate-200" },
  waiting: { band: "bg-amber-500 text-white", icon: "text-amber-50" },
}

/**
 * The card every state shares: a full-width coloured band carrying the verdict
 * as a sentence, and a white body. The band is the whole point — the verdict is
 * the first and largest thing on a phone screen, never a tint on a detail row.
 */
function VerdictCard({
  tone,
  icon,
  title,
  summary,
  children,
}: {
  tone: Tone
  icon: ReactNode
  title: string
  summary: string
  children?: ReactNode
}) {
  const palette = TONES[tone]
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className={`flex items-start gap-4 px-5 py-6 sm:px-7 ${palette.band}`}>
        <span className={`mt-0.5 shrink-0 ${palette.icon}`} aria-hidden="true">
          {icon}
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-bold leading-tight sm:text-2xl">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/90 sm:text-base">{summary}</p>
        </div>
      </div>
      {children ? <div className="px-5 py-6 sm:px-7">{children}</div> : null}
    </div>
  )
}

/** One label/value line. Stacks on a phone, two columns from `sm` up. */
function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: ReactNode
  mono?: boolean
}) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd
        className={`text-base font-medium text-gray-900 ${mono ? "font-mono tracking-wide" : ""}`}
      >
        {value}
      </dd>
    </div>
  )
}

// -------------------------------------------------------------------------- //
// The page body
// -------------------------------------------------------------------------- //

export function CertificateVerification({ token }: { token: string }) {
  const { language, translations = {} } = useLanguage()
  const t = (text: string) => translations[text] || text

  const [outcome, setOutcome] = useState<VerificationOutcome | null>(null)
  /** Bumped by the retry button; re-runs the effect with a fresh request. */
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let live = true
    setOutcome(null)
    verifyCertificate(token, controller.signal).then((result) => {
      // An abort resolves as "unavailable"; dropping it here keeps a fast
      // unmount from painting an error over a page nobody is looking at.
      if (live) setOutcome(result)
    })
    return () => {
      live = false
      controller.abort()
    }
  }, [token, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return (
    <div className="min-h-[60vh] bg-gray-50 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-xl">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-500">
          Маранафа · {t("Проверка сертификата")}
        </p>

        <div aria-live="polite">
          {outcome === null ? (
            <Waiting t={t} />
          ) : outcome.kind === "found" ? (
            <Found certificate={outcome.certificate} language={language} t={t} />
          ) : outcome.kind === "not_found" ? (
            <NotFound t={t} />
          ) : outcome.kind === "rate_limited" ? (
            <RateLimited t={t} onRetry={retry} />
          ) : (
            <Unavailable t={t} onRetry={retry} />
          )}
        </div>

        <Explainer t={t} />
      </div>
    </div>
  )
}

type T = (text: string) => string

function Waiting({ t }: { t: T }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-gray-600 shadow-sm">
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      <span className="text-base">{t("Проверяем сертификат…")}</span>
    </div>
  )
}

/**
 * A token the register knows. Three shapes, and the third is the reason
 * `status` is a string rather than a union: a word we do not recognise is
 * shown as itself and is NEVER rounded up to "valid".
 */
function Found({
  certificate,
  language,
  t,
}: {
  certificate: PublicCertificate
  language: string
  t: T
}) {
  const details = <Details certificate={certificate} language={language} t={t} />

  if (certificate.status === "valid") {
    return (
      <VerdictCard
        tone="valid"
        icon={<BadgeCheck className="h-8 w-8" />}
        title={t("Сертификат действителен")}
        summary={t("Эта запись подтверждена реестром обучения «Маранафы».")}
      >
        {details}
      </VerdictCard>
    )
  }

  if (certificate.status === "revoked") {
    return (
      <VerdictCard
        tone="revoked"
        icon={<Ban className="h-8 w-8" />}
        title={t("Сертификат отозван")}
        summary={t(
          "Этот сертификат больше не действителен и не подтверждает прохождение обучения.",
        )}
      >
        <p className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-[#8e1c29]">
          {t("Не принимайте этот документ как подтверждение обучения.")}
        </p>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {t("Сведения с этого документа")}
        </p>
        {/* Muted and labelled as belonging to a withdrawn document — the same
            rows as a valid card must not read as the same verdict. */}
        <div className="opacity-70">{details}</div>
      </VerdictCard>
    )
  }

  return (
    <VerdictCard
      tone="neutral"
      icon={<ShieldQuestion className="h-8 w-8" />}
      title={t("Состояние сертификата требует уточнения")}
      summary={`${t("Реестр вернул состояние")} «${certificate.status}». ${t(
        "Прежде чем принимать этот документ, напишите нам.",
      )}`}
    >
      {details}
      <ContactLine t={t} />
    </VerdictCard>
  )
}

/**
 * The fields, in the order somebody checking a sheet reads them: whose, for
 * what, when — and last the serial, which is the one thing they can compare
 * against the paper in their hand.
 *
 * A NULL FIELD IS NOT AN EMPTY ROW. All three snapshots go null together when
 * the personal details were erased, and saying so plainly is the honest answer:
 * the record that the training happened outlives the name.
 */
function Details({
  certificate,
  language,
  t,
}: {
  certificate: PublicCertificate
  language: string
  t: T
}) {
  const erased =
    certificate.recipient_name === null &&
    certificate.role_name === null &&
    certificate.program_title === null
  const issued = formatDate(certificate.issued_at, language)
  const revoked = formatDate(certificate.revoked_at, language)

  return (
    <dl className="divide-y divide-gray-100">
      {erased ? (
        <div className="py-3">
          <p className="text-base font-medium text-gray-900">
            {t("Личные данные удалены по запросу")}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {t("Запись о прохождении обучения сохраняется, имя из неё удалено.")}
          </p>
        </div>
      ) : (
        <>
          {certificate.recipient_name ? (
            <DetailRow label={t("Кому выдан")} value={certificate.recipient_name} />
          ) : null}
          {certificate.role_name ? (
            <DetailRow label={t("Роль")} value={certificate.role_name} />
          ) : null}
          {certificate.program_title ? (
            <DetailRow label={t("Программа обучения")} value={certificate.program_title} />
          ) : null}
        </>
      )}
      {issued ? <DetailRow label={t("Дата выдачи")} value={issued} /> : null}
      {revoked ? <DetailRow label={t("Дата отзыва")} value={revoked} /> : null}
      <DetailRow label={t("Номер сертификата")} value={certificate.certificate_number} mono />
    </dl>
  )
}

/**
 * No match. Not an accusation: the likeliest cause by a wide margin is a
 * half-read QR code or a hand-typed link, and the copy leads with that.
 */
function NotFound({ t }: { t: T }) {
  return (
    <VerdictCard
      tone="neutral"
      icon={<HelpCircle className="h-8 w-8" />}
      title={t("Мы не нашли такой сертификат")}
      summary={t("По этому коду в реестре ничего не значится.")}
    >
      <p className="text-base leading-relaxed text-gray-700">
        {t(
          "Чаще всего код считался не полностью или в адресе ссылки опечатка. Отсканируйте QR-код ещё раз при хорошем освещении или наберите ссылку целиком.",
        )}
      </p>
      <ContactLine t={t} />
    </VerdictCard>
  )
}

/** 429. A busy scanner, not a broken page — and never a verdict on the code. */
function RateLimited({ t, onRetry }: { t: T; onRetry: () => void }) {
  return (
    <VerdictCard
      tone="waiting"
      icon={<Clock className="h-8 w-8" />}
      title={t("Слишком много проверок подряд")}
      summary={t("Мы пока не проверяли этот код — сначала нужно немного подождать.")}
    >
      <p className="text-base leading-relaxed text-gray-700">
        {t(
          "Из этой сети только что проверили много сертификатов. Подождите пару минут и попробуйте снова — сертификат никуда не денется.",
        )}
      </p>
      <RetryButton t={t} onRetry={onRetry} />
    </VerdictCard>
  )
}

/** Offline, CORS, or a 5xx: we could not ask, so we say nothing about the code. */
function Unavailable({ t, onRetry }: { t: T; onRetry: () => void }) {
  return (
    <VerdictCard
      tone="neutral"
      icon={<WifiOff className="h-8 w-8" />}
      title={t("Не удалось выполнить проверку")}
      summary={t("Это сбой связи, а не ответ о сертификате.")}
    >
      <p className="text-base leading-relaxed text-gray-700">
        {t("Реестр сейчас недоступен. Проверьте соединение и попробуйте ещё раз.")}
      </p>
      <RetryButton t={t} onRetry={onRetry} />
    </VerdictCard>
  )
}

function RetryButton({ t, onRetry }: { t: T; onRetry: () => void }) {
  return (
    <Button
      onClick={onRetry}
      className="mt-5 w-full bg-[#B22234] text-white hover:bg-[#8e1c29] sm:w-auto"
    >
      <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
      {t("Попробовать ещё раз")}
    </Button>
  )
}

function ContactLine({ t }: { t: T }) {
  return (
    <p className="mt-5 text-sm text-gray-600">
      {t("Если код точно верный, напишите нам:")}{" "}
      <a className="font-medium text-[#B22234] underline" href={`mailto:${CONTACT_EMAIL}`}>
        {CONTACT_EMAIL}
      </a>
    </p>
  )
}

/**
 * For the visitor who has never heard of us and arrived here from a QR code on
 * a stranger's sheet of paper: what this page is, and a way onto the site.
 */
function Explainer({ t }: { t: T }) {
  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white/60 px-5 py-5 sm:px-7">
      <h2 className="text-sm font-semibold text-gray-900">{t("Что это за страница?")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        {t(
          "Сертификаты «Маранафы» подтверждают, что человек прошёл обучение для своего служения. QR-код на документе ведёт сюда, и эта страница отвечает по реестру лагеря.",
        )}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-gray-500">
        {t("Данные показаны так, как они записаны в реестре «Маранафы».")}
      </p>
      <Link href="/" className="mt-4 inline-block text-sm font-medium text-[#B22234] underline">
        {t("На сайт «Маранафа»")}
      </Link>
    </div>
  )
}
