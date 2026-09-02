"use client"

/**
 * One question, its options, and where a wrong answer sends the learner.
 *
 * THE OPTIONS LIVE IN THIS FILE ON PURPOSE. Correctness is not a property of an
 * option, it is an invariant of the SET — "exactly one correct" for
 * `single_choice`, `yes_no` and `swipe_binary` — so marking one right has to
 * unmark the others, and a component that owned a single option could not do
 * that without reaching around its own boundary.
 *
 * THE RULES ARE SHOWN WHILE THE AUTHOR WORKS, NOT AT PUBLISH TIME. `rules.ts`
 * mirrors the server's option validation so a `yes_no` question says it needs
 * codes `yes`/`no` while the third option is being added. The publish checklist
 * is still the authority and still the backstop; this is about telling somebody
 * now rather than three screens later.
 *
 * `sort` IS THE SWIPE MAPPING. For `swipe_binary` the option at sort 0 is the
 * left swipe and sort 1 the right one — there is no separate config column
 * because that mapping is already deterministic — so the reorder controls are
 * labelled as directions for that type rather than as ordering.
 *
 * REMEDIATION IS THE ONE LINK THAT CAN FAIL ACROSS VERSIONS, and the API refuses
 * it with a 409 naming both versions. The picker only ever offers materials from
 * this question's own module, so the case should not arise — but the refusal is
 * surfaced rather than swallowed, because the alternative is a link the author
 * believes they made.
 */

import { useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  Check,
  CircleDot,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react"

import { useLanguage } from "@/contexts/language-context"
import {
  createOption,
  deleteOption,
  deleteQuestion,
  deleteQuestionMaterial,
  putOptionTranslation,
  putQuestionMaterial,
  putQuestionTranslation,
  reorderOptions,
  updateOption,
  updateQuestion,
  QUESTION_TYPES,
  type AdminMaterialContent,
  type AdminOptionContent,
  type AdminQuestionContent,
} from "@/lib/portal-learning-admin"
import {
  forLang,
  isSingleAnswer,
  optionProblems,
  rulesFor,
} from "@/components/learning/admin/content/rules"
import {
  InlineText,
  InlineTextarea,
} from "@/components/learning/admin/content/inline-fields"

interface Props {
  question: AdminQuestionContent
  lang: string
  /** The module's materials — the only ones a remediation link may point at. */
  moduleMaterials: AdminMaterialContent[]
  editable: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  onMove: (direction: -1 | 1) => void
  reload: () => Promise<void>
  onError: (error: unknown) => void
}

export function QuestionCard({
  question,
  lang,
  moduleMaterials,
  editable,
  canMoveUp,
  canMoveDown,
  onMove,
  reload,
  onError,
}: Props) {
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const tr = forLang(question.translations, lang)
  const rules = rulesFor(question.question_type)
  const problems = optionProblems(question.question_type, question.options)
  const options = [...question.options].sort((a, b) => a.sort - b.sort)

  /** Run a write, then re-read the subtree. The server owns the state. */
  async function run(work: () => Promise<unknown>) {
    if (busy) return
    setBusy(true)
    try {
      await work()
      await reload()
    } catch (error) {
      onError(error)
    } finally {
      setBusy(false)
    }
  }

  /** PUT is a replace — send the whole translation row, not just the edit. */
  function saveTranslation(patch: {
    prompt_markdown?: string | null
    correct_explanation_markdown?: string | null
  }) {
    return run(() =>
      putQuestionTranslation(question.id, lang, {
        prompt_markdown: tr?.prompt_markdown ?? null,
        correct_explanation_markdown: tr?.correct_explanation_markdown ?? null,
        audio_asset_id: tr?.audio_asset_id ?? null,
        ...patch,
      }),
    )
  }

  /**
   * Mark one option correct.
   *
   * For a single-answer type this also unmarks whichever option was correct
   * before — the API patches one option at a time, so the invariant has to be
   * maintained here or the author is left with a set the checklist refuses.
   */
  function setCorrect(option: AdminOptionContent, next: boolean) {
    return run(async () => {
      if (next && isSingleAnswer(question.question_type)) {
        for (const other of question.options) {
          if (other.id !== option.id && other.is_correct) {
            await updateOption(other.id, { is_correct: false })
          }
        }
      }
      await updateOption(option.id, { is_correct: next })
    })
  }

  function addOption() {
    // Seed the code the type demands when it demands specific ones, so a
    // `yes_no` question is valid as soon as its two options exist.
    const fixed = rules?.fixedCodes
    const used = new Set(question.options.map((o) => o.code))
    const code =
      fixed?.find((c) => !used.has(c)) ?? `opt${question.options.length + 1}`
    return run(() =>
      createOption(question.id, { code, sort: question.options.length }),
    )
  }

  function moveOption(index: number, direction: -1 | 1) {
    const next = [...options]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    // The reorder endpoint demands the COMPLETE list: a partial one produces a
    // duplicate sort, which is how a swipe question loses its left/right.
    return run(() => reorderOptions(question.id, next.map((o) => o.id)))
  }

  const linkedIds = new Set(question.materials.map((m) => m.material_id))
  const linkable = moduleMaterials.filter((m) => !linkedIds.has(m.id))

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-3">
      {/* --- header --------------------------------------------------- */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-gray-600">
            {question.code}
          </span>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
            {question.question_type}
          </span>
          {!question.required && (
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-500">
              {t("необязательный")}
            </span>
          )}
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />}
        </div>
        {editable && (
          <div className="flex items-center gap-1">
            <IconButton
              label={t("Выше")}
              disabled={!canMoveUp || busy}
              onClick={() => onMove(-1)}
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </IconButton>
            <IconButton
              label={t("Ниже")}
              disabled={!canMoveDown || busy}
              onClick={() => onMove(1)}
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </IconButton>
            {confirmDelete ? (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(() => deleteQuestion(question.id))}
                  className="rounded px-2 py-1 text-[11px] font-bold text-red-700 hover:bg-red-50"
                >
                  {t("Да, удалить")}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="rounded px-2 py-1 text-[11px] font-medium text-gray-500 hover:bg-gray-100"
                >
                  {t("Отмена")}
                </button>
              </>
            ) : (
              <IconButton
                label={t("Удалить вопрос")}
                disabled={busy}
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </IconButton>
            )}
          </div>
        )}
      </div>

      {/* --- rule guidance -------------------------------------------- */}
      {problems.length > 0 && (
        <ul className="space-y-1 rounded-md border border-amber-200 bg-amber-50 p-2">
          {problems.map((p, i) => (
            <li key={i} className="text-[11px] font-medium text-amber-800">
              {t(p.template)
                .replace("{n}", String(p.n ?? ""))
                .replace("{m}", p.codes ?? "")
                .replace("{codes}", p.codes ?? "")}
            </li>
          ))}
        </ul>
      )}

      {/* --- settings -------------------------------------------------- */}
      {editable && (
        <div className="grid gap-3 sm:grid-cols-3">
          <InlineText
            label={t("Код")}
            value={question.code}
            mono
            required
            hint={t("Идентификатор для проверок и сравнения версий")}
            onSave={(next) =>
              run(() => updateQuestion(question.id, { code: next ?? "" }))
            }
          />
          <div className="space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              {t("Тип вопроса")}
            </span>
            <select
              value={question.question_type}
              disabled={busy}
              onChange={(e) =>
                run(() =>
                  updateQuestion(question.id, { question_type: e.target.value }),
                )
              }
              className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-gray-900"
            >
              {QUESTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              {t("Обязательный")}
            </span>
            <label className="flex items-center gap-2 py-1.5 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={question.required}
                disabled={busy}
                onChange={(e) =>
                  run(() =>
                    updateQuestion(question.id, { required: e.target.checked }),
                  )
                }
                className="h-4 w-4 accent-gray-900"
              />
              {t("Влияет на сертификацию")}
            </label>
          </div>
        </div>
      )}

      {/* --- prompt ---------------------------------------------------- */}
      <InlineTextarea
        label={t("Формулировка")}
        value={tr?.prompt_markdown ?? null}
        disabled={!editable}
        rows={2}
        placeholder={t("Текст вопроса на выбранном языке")}
        onSave={(next) => saveTranslation({ prompt_markdown: next })}
      />
      <InlineTextarea
        label={t("Пояснение к правильному ответу")}
        value={tr?.correct_explanation_markdown ?? null}
        disabled={!editable}
        rows={2}
        hint={t("Показывается только после верного ответа")}
        onSave={(next) =>
          saveTranslation({ correct_explanation_markdown: next })
        }
      />

      {/* --- options --------------------------------------------------- */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            {t("Варианты ответа")}
          </span>
          {editable && (
            <button
              type="button"
              disabled={busy}
              onClick={addOption}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-gray-900 disabled:opacity-50"
            >
              <Plus className="h-3 w-3" />
              {t("Вариант")}
            </button>
          )}
        </div>

        {options.length === 0 && (
          <p className="text-[11px] text-gray-400">{t("Вариантов пока нет")}</p>
        )}

        <ul className="space-y-2">
          {options.map((option, index) => (
            <li
              key={option.id}
              className={`space-y-2 rounded-md border p-2 ${
                option.is_correct
                  ? "border-green-200 bg-green-50/60"
                  : "border-gray-200"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={!editable || busy}
                  onClick={() => setCorrect(option, !option.is_correct)}
                  aria-pressed={option.is_correct}
                  className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-bold transition-colors disabled:opacity-60 ${
                    option.is_correct
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {option.is_correct ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <CircleDot className="h-3 w-3" />
                  )}
                  {option.is_correct ? t("Верный") : t("Неверный")}
                </button>

                {rules?.sortIsMapping && (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
                    {option.sort === 0 ? t("влево") : t("вправо")}
                  </span>
                )}

                <span className="ml-auto flex items-center gap-1">
                  {editable && (
                    <>
                      <IconButton
                        label={t("Выше")}
                        disabled={index === 0 || busy}
                        onClick={() => moveOption(index, -1)}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </IconButton>
                      <IconButton
                        label={t("Ниже")}
                        disabled={index === options.length - 1 || busy}
                        onClick={() => moveOption(index, 1)}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </IconButton>
                      <IconButton
                        label={t("Удалить вариант")}
                        disabled={busy}
                        onClick={() => run(() => deleteOption(option.id))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </IconButton>
                    </>
                  )}
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-[10rem_1fr]">
                <InlineText
                  label={t("Код")}
                  value={option.code}
                  mono
                  required
                  disabled={!editable}
                  onSave={(next) =>
                    run(() => updateOption(option.id, { code: next ?? "" }))
                  }
                />
                <InlineText
                  label={t("Подпись")}
                  value={forLang(option.translations, lang)?.label ?? null}
                  disabled={!editable}
                  placeholder={t("Текст варианта на выбранном языке")}
                  onSave={(next) =>
                    run(() =>
                      putOptionTranslation(option.id, lang, {
                        label: next,
                        audio_asset_id:
                          forLang(option.translations, lang)?.audio_asset_id ??
                          null,
                      }),
                    )
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* --- remediation ----------------------------------------------- */}
      <div className="space-y-2 border-t border-gray-100 pt-3">
        <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
          {t("Материал при неверном ответе")}
        </span>

        {question.materials.length === 0 ? (
          <p className="text-[11px] text-amber-700">
            {t("Не связан ни с одним материалом — ответившему неверно некуда идти")}
          </p>
        ) : (
          <ul className="space-y-1">
            {question.materials.map((link) => {
              const material = moduleMaterials.find(
                (m) => m.id === link.material_id,
              )
              return (
                <li
                  key={link.material_id}
                  className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-1"
                >
                  <span className="min-w-0 truncate text-xs text-gray-700">
                    {forLang(material?.translations ?? [], lang)?.title ??
                      material?.kind ??
                      link.material_id.slice(0, 8)}
                  </span>
                  {editable && (
                    <IconButton
                      label={t("Убрать связь")}
                      disabled={busy}
                      onClick={() =>
                        run(() =>
                          deleteQuestionMaterial(question.id, link.material_id),
                        )
                      }
                    >
                      <Trash2 className="h-3 w-3" />
                    </IconButton>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {editable && linkable.length > 0 && (
          <select
            value=""
            disabled={busy}
            onChange={(e) => {
              const id = e.target.value
              if (id) void run(() => putQuestionMaterial(question.id, id))
            }}
            className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-gray-900"
          >
            <option value="">{t("Связать с материалом…")}</option>
            {linkable.map((m) => (
              <option key={m.id} value={m.id}>
                {forLang(m.translations, lang)?.title ?? `${m.kind} · ${m.id.slice(0, 8)}`}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}
