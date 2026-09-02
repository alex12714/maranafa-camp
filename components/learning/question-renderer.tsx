"use client"

/**
 * The renderer registry: question_type -> component.
 *
 * The runner asks for a renderer and never switches on the type itself, so each
 * of the four content types landed as one entry here and no change to the state
 * machine. The fallback below stays regardless: the registry is keyed on a
 * string the server chose, and a version published with a fifth type must not
 * take the page down.
 *
 * An unknown or not-yet-built type renders an honest notice rather than a blank
 * card or a crash: the version was published with content this build cannot
 * draw, and telling the learner to open the path in the app that can is the
 * only useful thing to say.
 */

import type { ComponentType } from "react"

import { MultiSelectRenderer } from "@/components/learning/multi-select"
import { SingleChoiceRenderer } from "@/components/learning/single-choice"
import { SwipeBinaryRenderer } from "@/components/learning/swipe-binary"
import { YesNoRenderer } from "@/components/learning/yes-no"
import type { QuestionRendererProps } from "@/components/learning/renderer-types"
import { TranslatedText } from "@/components/translated-text"

const RENDERERS: Record<string, ComponentType<QuestionRendererProps>> = {
  single_choice: SingleChoiceRenderer,
  yes_no: YesNoRenderer,
  multi_select: MultiSelectRenderer,
  swipe_binary: SwipeBinaryRenderer,
}

/** True when this build can draw controls for the question. */
export function canRender(questionType: string): boolean {
  return questionType in RENDERERS
}

export function QuestionRenderer(props: QuestionRendererProps) {
  const Renderer = RENDERERS[props.question.question_type]

  if (!Renderer) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
      >
        <TranslatedText text="Этот тип вопроса пока не поддерживается. Обновите приложение или откройте обучение позже." />
      </p>
    )
  }

  return <Renderer {...props} />
}
