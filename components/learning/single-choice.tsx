"use client"

/**
 * `single_choice` — four options, exactly one of them right.
 *
 * A native radio group, not a list of divs with click handlers: arrow keys move
 * between options, the label is clickable, and a screen reader announces "2 of
 * 4". The visible ring is drawn from `peer-checked` and `peer-focus-visible` so
 * the checked state survives a forced-colours mode where the tint does not.
 *
 * NOTHING HERE KNOWS WHICH OPTION IS RIGHT — the payload does not carry it, and
 * this component must never grow a prop that would.
 *
 * Options are ordered by `sort`, which is contract rather than presentation.
 */

import type { QuestionRendererProps } from "@/components/learning/renderer-types"

export function SingleChoiceRenderer({
  question,
  selected,
  onSelect,
  disabled,
}: QuestionRendererProps) {
  const options = [...question.options].sort((a, b) => a.sort - b.sort)
  const chosen = selected[0] ?? null

  return (
    <div className="space-y-2.5" role="radiogroup">
      {options.map((option) => {
        const id = `option-${option.id}`
        const isChosen = chosen === option.id
        return (
          <div key={option.id} className="relative">
            <input
              type="radio"
              id={id}
              name={`question-${question.id}`}
              className="peer sr-only"
              value={option.id}
              checked={isChosen}
              disabled={disabled}
              onChange={() => onSelect([option.id])}
            />
            <label
              htmlFor={id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gray-900 peer-focus-visible:ring-offset-2 ${
                isChosen
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <span
                aria-hidden
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isChosen ? "border-gray-900" : "border-gray-300"
                }`}
              >
                {isChosen && (
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
                )}
              </span>
              <span className="min-w-0 flex-1 text-sm text-gray-900">
                {/* The label arrives already localized by the API. */}
                {option.label ?? option.code}
                {option.audio?.transcript && (
                  // The non-audio equivalent of an audio option: a learner on a
                  // screen reader must not be graded on a clip they cannot hear.
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
  )
}
