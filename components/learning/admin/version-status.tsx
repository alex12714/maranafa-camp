"use client"

/**
 * A version's lifecycle state, as a word before it is a colour.
 *
 * THE THREE STATES ARE NOT THREE SHADES OF THE SAME THING. `draft` is the only
 * writable one; `published` is frozen; `retired` is frozen AND closed to new
 * attempts while remaining, permanently, the content behind somebody's
 * certificate. An author who reads "retired" as "deleted" will eventually try
 * to tidy one away, so the explanatory line under the badge says what each
 * state actually means rather than restating its name.
 */

import { FileEdit, Lock, Archive } from "lucide-react"

import { useLanguage } from "@/contexts/language-context"

interface StatusPresentation {
  /** The word. Always rendered — the tint is never the only signal. */
  label: string
  /** What this state MEANS for the author, in one sentence. */
  meaning: string
  className: string
  Icon: typeof Lock
}

const PRESENTATION: Record<string, StatusPresentation> = {
  draft: {
    label: "Черновик",
    meaning: "Можно редактировать и удалить. Ещё никому не показывается.",
    className: "border-blue-200 bg-blue-50 text-blue-800",
    Icon: FileEdit,
  },
  published: {
    label: "Опубликована",
    meaning:
      "Заморожена и неизменна. Новые участники проходят обучение по ней.",
    className: "border-green-200 bg-green-50 text-green-800",
    Icon: Lock,
  },
  retired: {
    label: "Снята с публикации",
    meaning:
      "Новые попытки по ней не начинаются. Ничего не удалено: это содержание уже выданных сертификатов.",
    className: "border-gray-300 bg-gray-100 text-gray-700",
    Icon: Archive,
  },
}

/** Whether a status is the one and only writable state. */
export function isDraft(status: string): boolean {
  return status === "draft"
}

export function VersionStatusBadge({ status }: { status: string }) {
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  const p = PRESENTATION[status]
  if (!p) {
    // An unknown state from a newer API still renders its name rather than
    // nothing — the alternative is a badge that silently disappears.
    return (
      <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
        {status}
      </span>
    )
  }

  const { Icon } = p
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${p.className}`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {t(p.label)}
    </span>
  )
}

/** The badge's one-sentence explanation, for detail screens. */
export function VersionStatusMeaning({ status }: { status: string }) {
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  const p = PRESENTATION[status]
  if (!p) return null
  return <p className="text-xs leading-relaxed text-gray-500">{t(p.meaning)}</p>
}
