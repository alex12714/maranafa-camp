"use client"

/**
 * Progress through one path, in the two forms the screen needs.
 *
 * NEVER COLOUR ALONE. The bar is `mastered_required / total_required` — the
 * honest measure, which a wrong answer does not move — and beside it, always,
 * the same fact in words plus "Вопрос 4 из 12", which is where the learner
 * actually is in the sequence. The two numbers differ on purpose whenever
 * somebody is partway through an item they have not yet mastered, and a bar
 * drawn from the position would tell them they had passed something they had
 * not.
 *
 * The counts are interpolated into ONE translation key rather than assembled
 * from a noun and a preposition, because "4 of 12" puts its words in a
 * different order in every language the portal ships.
 */

import { useLanguage } from "@/contexts/language-context"
import type { LearningProgress } from "@/lib/portal-learning"

export function LearningProgressBar({
  progress,
  /** Hide the "Вопрос N из M" line once nothing is left to answer. */
  showPosition = true,
}: {
  progress: LearningProgress
  showPosition?: boolean
}) {
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  const total = progress.total_required
  const mastered = progress.mastered_required
  const percent = total > 0 ? Math.round((mastered / total) * 100) : 0

  const masteredLabel = t("Освоено {n} из {total}")
    .replace("{n}", String(mastered))
    .replace("{total}", String(total))
  const positionLabel =
    progress.position === null
      ? null
      : t("Вопрос {n} из {total}")
          .replace("{n}", String(progress.position))
          .replace("{total}", String(total))

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium text-gray-900">{masteredLabel}</span>
        {showPosition && positionLabel && (
          <span className="shrink-0 tabular-nums text-gray-500">
            {positionLabel}
          </span>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={mastered}
        aria-valuetext={masteredLabel}
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
      >
        <div
          className="h-full rounded-full bg-green-600 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
