"use client"

/**
 * The learner's eye view of a question, drawn by the LEARNER'S OWN renderers.
 *
 * `QuestionRenderer` is the same registry `AssessmentRunner` uses, so what an
 * author sees here is not an approximation of the learner's screen — it IS the
 * learner's screen, including the swipe mapping and the "unsupported type"
 * fallback. A second, author-only rendering would drift from the real one, and
 * the drift would be invisible until somebody published.
 *
 * THE MAPPING DOWN IS EXPLICIT, FIELD BY FIELD, AND DROPS `is_correct`. That is
 * the whole discipline of this file. `AdminOptionContent` carries correctness;
 * `LearningOption` must never receive it, so the object below is CONSTRUCTED
 * rather than spread — a spread would carry every field the admin shape grows
 * later, and the first one to arrive would be the one that matters. The API
 * draws this same line by writing the learner's option DTO out field by field
 * instead of inheriting the director's.
 *
 * WHERE THE ANSWER IS SHOWN, IT IS SHOWN OUTSIDE THE RENDERER. The author needs
 * to know which option is right; the learner's components must not be the thing
 * that tells them, or "preview" and "the real screen" stop being the same code.
 * So correctness is annotated beneath the renderer, clearly labelled as the
 * author's view.
 */

import { useState } from "react"

import { QuestionRenderer } from "@/components/learning/question-renderer"
import { useLanguage } from "@/contexts/language-context"
import type {
  LearningAsset,
  LearningOption,
  LearningQuestion,
} from "@/lib/portal-learning"
import type {
  AdminAsset,
  AdminQuestionContent,
} from "@/lib/portal-learning-admin"
import { forLang } from "@/components/learning/admin/content/rules"

/** An admin asset narrowed to the four fields a learner is ever given. */
function toLearnerAsset(
  assetId: string | null,
  assets: AdminAsset[],
): LearningAsset | null {
  if (!assetId) return null
  const asset = assets.find((a) => a.id === assetId)
  if (!asset) return null
  return {
    id: asset.id,
    mime_type: asset.mime_type,
    duration_ms: asset.duration_ms,
    transcript: asset.transcript,
  }
}

/**
 * Build the learner's question from the author's.
 *
 * Every field is named. Do not replace this with a spread — see the note above.
 */
function toLearnerQuestion(
  question: AdminQuestionContent,
  lang: string,
  assets: AdminAsset[],
): LearningQuestion {
  const tr = forLang(question.translations, lang)

  const options: LearningOption[] = [...question.options]
    .sort((a, b) => a.sort - b.sort)
    .map((option) => {
      const otr = forLang(option.translations, lang)
      return {
        id: option.id,
        code: option.code,
        sort: option.sort,
        label: otr?.label ?? null,
        audio: toLearnerAsset(otr?.audio_asset_id ?? null, assets),
        // `is_correct` is deliberately absent. It is not omitted by accident
        // and must not be added "just for the preview".
      }
    })

  return {
    id: question.id,
    code: question.code,
    question_type: question.question_type,
    prompt_markdown: tr?.prompt_markdown ?? null,
    audio: toLearnerAsset(tr?.audio_asset_id ?? null, assets),
    options,
  }
}

export function QuestionPreview({
  question,
  lang,
  assets,
}: {
  question: AdminQuestionContent
  lang: string
  assets: AdminAsset[]
}) {
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  const [selected, setSelected] = useState<string[]>([])
  const learnerQuestion = toLearnerQuestion(question, lang, assets)

  const correct = question.options
    .filter((o) => o.is_correct)
    .map((o) => o.code)

  const prompt = learnerQuestion.prompt_markdown

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/60 p-3">
      <div className="flex items-center gap-2">
        <span className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-[11px] font-medium text-gray-700">
          {question.code}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
          {t("Как это увидит участник")}
        </span>
      </div>

      {prompt ? (
        <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-gray-900">
          {prompt}
        </p>
      ) : (
        <p className="text-sm font-medium text-amber-700">
          {t("Формулировки на этом языке пока нет")}
        </p>
      )}

      <div className="rounded-md bg-white p-2">
        <QuestionRenderer
          question={learnerQuestion}
          selected={selected}
          onSelect={setSelected}
          disabled={false}
        />
      </div>

      {/* The author's annotation — outside the learner's components. */}
      <p className="text-[11px] font-medium text-gray-500">
        {correct.length > 0
          ? `${t("Правильный ответ")}: ${correct.join(", ")}`
          : t("Правильный ответ не отмечен")}
      </p>
    </div>
  )
}
