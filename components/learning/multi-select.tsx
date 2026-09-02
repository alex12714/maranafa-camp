"use client"

/**
 * `multi_select` — several options, and the answer is the SET.
 *
 * THE STAKES ARE ASYMMETRIC AND THE UI HAS TO SAY SO. Scoring is an exact set
 * match: a learner who picks two of the three right options scores zero, the
 * server records a wrong answer against a permanent training record, and the
 * item goes to remediation. That is the correct rule — but it means a learner
 * who mistakes this for `single_choice` loses the question to the interface
 * rather than to the material. So "choose all that apply" is not a hint tucked
 * under the options; it is the first thing above them, it is repeated by the
 * control shape (square checkboxes, never radio circles), and the live count
 * underneath keeps saying how many are chosen.
 *
 * The submitted list is every chosen id, ordered by the question's own `sort`
 * so the payload is stable regardless of the order the learner tapped in.
 *
 * NOTHING HERE KNOWS WHICH OPTIONS ARE RIGHT — not the count of them, not a
 * "pick 2" hint. The payload does not carry it, and telling a learner how many
 * to choose would give away half the question.
 */

import { useId } from "react"
import { Check, ListChecks } from "lucide-react"

import type { QuestionRendererProps } from "@/components/learning/renderer-types"
import { useLanguage } from "@/contexts/language-context"
import { TranslatedText } from "@/components/translated-text"

export function MultiSelectRenderer({
  question,
  selected,
  onSelect,
  disabled,
}: QuestionRendererProps) {
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text
  const hintId = useId()

  const options = [...question.options].sort((a, b) => a.sort - b.sort)
  const chosen = new Set(selected)

  function toggle(optionId: string) {
    const next = new Set(chosen)
    if (next.has(optionId)) next.delete(optionId)
    else next.add(optionId)
    // Rebuild from `options` rather than pushing onto `selected`, so the ids go
    // up in the question's order however the learner arrived at them.
    onSelect(options.filter((option) => next.has(option.id)).map((o) => o.id))
  }

  const countLabel =
    chosen.size === 0
      ? t("Ничего не выбрано")
      : t("Выбрано вариантов: {n}").replace("{n}", String(chosen.size))

  return (
    <div className="space-y-3">
      {/* Above the options, not below them: by the time a learner reaches the
          bottom of the list they have already decided how many to tap. */}
      <div
        id={hintId}
        className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3"
      >
        <ListChecks className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden />
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-bold text-blue-900">
            <TranslatedText text="Выберите все подходящие варианты" />
          </p>
          <p className="text-xs text-blue-800">
            <TranslatedText text="Ответ засчитывается, только если выбраны все верные варианты и ничего лишнего." />
          </p>
        </div>
      </div>

      <div role="group" aria-describedby={hintId} className="space-y-2.5">
        {options.map((option) => {
          const id = `option-${option.id}`
          const isChosen = chosen.has(option.id)
          return (
            <div key={option.id} className="relative">
              <input
                type="checkbox"
                id={id}
                name={`question-${question.id}`}
                className="peer sr-only"
                value={option.id}
                checked={isChosen}
                disabled={disabled}
                onChange={() => toggle(option.id)}
              />
              <label
                htmlFor={id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gray-900 peer-focus-visible:ring-offset-2 ${
                  isChosen
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
              >
                {/* Square, and it fills in — the shape carries "more than one"
                    for a learner who does not read the banner, and the tick
                    survives a forced-colours mode where the tint does not. */}
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                    isChosen ? "border-gray-900 bg-gray-900" : "border-gray-300"
                  }`}
                >
                  {isChosen && <Check className="h-3.5 w-3.5 text-white" />}
                </span>
                <span className="min-w-0 flex-1 text-sm text-gray-900">
                  {/* The label arrives already localized by the API. */}
                  {option.label ?? option.code}
                  {option.audio?.transcript && (
                    <span className="mt-1 block text-xs text-gray-500">
                      {option.audio.transcript}
                    </span>
                  )}
                </span>
              </label>
            </div>
          )
        })}
      </div>

      {/* Announced on every change: a learner who tapped once and moved on
          hears that exactly one is selected, which is the moment to reconsider
          if they meant to choose more. */}
      <p aria-live="polite" className="text-xs font-medium text-gray-600">
        {countLabel}
      </p>
    </div>
  )
}
