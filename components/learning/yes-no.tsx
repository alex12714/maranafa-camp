"use client"

/**
 * `yes_no` — two options, side by side.
 *
 * Structurally the same control as `single_choice`: a native radio group, so a
 * screen reader announces "1 of 2" and the arrow keys move between them. The
 * only difference is the layout — two options fit on one row at the size a
 * thumb wants, and a two-column pair reads as a pair rather than as the first
 * two entries of a longer list.
 *
 * THE LABELS COME FROM THE API. The option codes happen to be `yes` and `no`,
 * but nothing here says "Да" or "Yes": the content is authored per language and
 * arrives already localized, and a question whose author wrote "Соглашусь" /
 * "Откажусь" must render those words. `sort` decides the order, never the code.
 *
 * NOTHING HERE KNOWS WHICH OPTION IS RIGHT.
 */

import { Check } from "lucide-react"

import { SingleChoiceRenderer } from "@/components/learning/single-choice"
import type { QuestionRendererProps } from "@/components/learning/renderer-types"

export function YesNoRenderer(props: QuestionRendererProps) {
  const { question, selected, onSelect, disabled } = props
  const options = [...question.options].sort((a, b) => a.sort - b.sort)

  // A `yes_no` question that did not arrive with exactly two options is content
  // this layout cannot represent. Fall back to the vertical radio list, which
  // renders any number of options, rather than dropping one on the floor or
  // showing the learner an empty card.
  if (options.length !== 2) return <SingleChoiceRenderer {...props} />

  const chosen = selected[0] ?? null

  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup">
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
              className={`flex h-full min-h-[5rem] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border px-4 py-4 text-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gray-900 peer-focus-visible:ring-offset-2 ${
                isChosen
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <span
                aria-hidden
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isChosen ? "border-gray-900 bg-gray-900" : "border-gray-300"
                }`}
              >
                {isChosen && <Check className="h-3 w-3 text-white" />}
              </span>
              <span className="min-w-0 text-base font-semibold text-gray-900">
                {/* The label arrives already localized by the API. */}
                {option.label ?? option.code}
              </span>
              {option.audio?.transcript && (
                // The non-audio equivalent of an audio option: a learner on a
                // screen reader must not be graded on a clip they cannot hear.
                <span className="min-w-0 text-xs font-normal text-gray-500">
                  {option.audio.transcript}
                </span>
              )}
            </label>
          </div>
        )
      })}
    </div>
  )
}
