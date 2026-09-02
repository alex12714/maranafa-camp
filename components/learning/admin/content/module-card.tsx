"use client"

/**
 * One module — an ordered subject area inside a version, with its materials and
 * its questions.
 *
 * MATERIALS COME BEFORE QUESTIONS in the layout because that is the order the
 * author has to work in: a question cannot be linked to a remediation material
 * that does not exist yet, and a question with no remediation link is the
 * single most common thing that blocks a publish. Putting the questions first
 * would produce a screen where the fix for the warning is above the warning.
 *
 * REORDERING SENDS THE COMPLETE LIST, always. The API refuses a partial
 * reorder rather than applying it, because renumbering three of four children
 * leaves a duplicate sort behind silently.
 */

import { useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react"

import { useLanguage } from "@/contexts/language-context"
import {
  createMaterial,
  createQuestion,
  deleteModule,
  putModuleTranslation,
  reorderMaterials,
  reorderQuestions,
  updateModule,
  type AdminAsset,
  type AdminModuleContent,
} from "@/lib/portal-learning-admin"
import { forLang } from "@/components/learning/admin/content/rules"
import {
  InlineText,
  InlineTextarea,
} from "@/components/learning/admin/content/inline-fields"
import { MaterialCard } from "@/components/learning/admin/content/material-card"
import { QuestionCard } from "@/components/learning/admin/content/question-card"
import { QuestionPreview } from "@/components/learning/admin/content/preview"

interface Props {
  module: AdminModuleContent
  lang: string
  assets: AdminAsset[]
  editable: boolean
  preview: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  onMove: (direction: -1 | 1) => void
  reload: () => Promise<void>
  onError: (error: unknown) => void
}

export function ModuleCard({
  module,
  lang,
  assets,
  editable,
  preview,
  canMoveUp,
  canMoveDown,
  onMove,
  reload,
  onError,
}: Props) {
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  const [open, setOpen] = useState(true)
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const tr = forLang(module.translations, lang)
  const materials = [...module.materials].sort((a, b) => a.sort - b.sort)
  const questions = [...module.questions].sort((a, b) => a.sort - b.sort)

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

  function saveTranslation(patch: {
    title?: string | null
    description?: string | null
  }) {
    return run(() =>
      putModuleTranslation(module.id, lang, {
        title: tr?.title ?? null,
        description: tr?.description ?? null,
        ...patch,
      }),
    )
  }

  function moveChild(
    kind: "material" | "question",
    index: number,
    direction: -1 | 1,
  ) {
    const list = kind === "material" ? materials : questions
    const target = index + direction
    if (target < 0 || target >= list.length) return
    const next = [...list]
    ;[next[index], next[target]] = [next[target], next[index]]
    const ids = next.map((row) => row.id)
    return run(() =>
      kind === "material"
        ? reorderMaterials(module.id, ids)
        : reorderQuestions(module.id, ids),
    )
  }

  const title = tr?.title ?? null

  return (
    <div className="space-y-3 rounded-lg border border-gray-300 bg-gray-50/50 p-3">
      {/* --- header ---------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 items-center gap-2 text-left"
        >
          {open ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
          )}
          <span className="truncate text-sm font-bold text-gray-900">
            {title || t("Без названия")}
          </span>
          <span className="shrink-0 rounded bg-gray-200 px-1.5 py-0.5 font-mono text-[11px] font-medium text-gray-600">
            {module.code}
          </span>
          {!module.required && (
            <span className="shrink-0 rounded bg-gray-200 px-1.5 py-0.5 text-[11px] font-medium text-gray-500">
              {t("необязательный")}
            </span>
          )}
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />}
        </button>

        <div className="flex items-center gap-1">
          <span className="mr-1 text-[11px] text-gray-500">
            {t("вопросов: {n}").replace("{n}", String(questions.length))}
          </span>
          {editable && (
            <>
              <MiniButton
                label={t("Выше")}
                disabled={!canMoveUp || busy}
                onClick={() => onMove(-1)}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </MiniButton>
              <MiniButton
                label={t("Ниже")}
                disabled={!canMoveDown || busy}
                onClick={() => onMove(1)}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </MiniButton>
              {confirmDelete ? (
                <>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => run(() => deleteModule(module.id))}
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
                <MiniButton
                  label={t("Удалить модуль")}
                  disabled={busy}
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </MiniButton>
              )}
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="space-y-4">
          {/* --- module fields ------------------------------------------ */}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-3">
            {editable && (
              <div className="grid gap-3 sm:grid-cols-2">
                <InlineText
                  label={t("Код")}
                  value={module.code}
                  mono
                  required
                  onSave={(next) =>
                    run(() => updateModule(module.id, { code: next ?? "" }))
                  }
                />
                <div className="space-y-1">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    {t("Обязательный")}
                  </span>
                  <label className="flex items-center gap-2 py-1.5 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={module.required}
                      disabled={busy}
                      onChange={(e) =>
                        run(() =>
                          updateModule(module.id, {
                            required: e.target.checked,
                          }),
                        )
                      }
                      className="h-4 w-4 accent-gray-900"
                    />
                    {t("Влияет на сертификацию")}
                  </label>
                </div>
              </div>
            )}
            <InlineText
              label={t("Заголовок")}
              value={tr?.title ?? null}
              disabled={!editable}
              placeholder={t("Название модуля на выбранном языке")}
              onSave={(next) => saveTranslation({ title: next })}
            />
            <InlineTextarea
              label={t("Описание")}
              value={tr?.description ?? null}
              disabled={!editable}
              rows={2}
              onSave={(next) => saveTranslation({ description: next })}
            />
          </div>

          {/* --- materials ---------------------------------------------- */}
          <section className="space-y-2">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">
                {t("Материалы")}
              </h4>
              {editable && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    run(() =>
                      createMaterial(module.id, {
                        kind: "article",
                        sort: materials.length,
                      }),
                    )
                  }
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-gray-900 disabled:opacity-50"
                >
                  <Plus className="h-3 w-3" />
                  {t("Материал")}
                </button>
              )}
            </div>
            {materials.length === 0 ? (
              <p className="text-[11px] text-gray-400">
                {t("Материалов пока нет")}
              </p>
            ) : (
              <div className="space-y-2">
                {materials.map((material, index) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    lang={lang}
                    assets={assets}
                    editable={editable}
                    canMoveUp={index > 0}
                    canMoveDown={index < materials.length - 1}
                    onMove={(d) => moveChild("material", index, d)}
                    reload={reload}
                    onError={onError}
                  />
                ))}
              </div>
            )}
          </section>

          {/* --- questions ---------------------------------------------- */}
          <section className="space-y-2">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">{t("Вопросы")}</h4>
              {editable && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    run(() =>
                      createQuestion(module.id, {
                        code: `${module.code}-q${questions.length + 1}`,
                        question_type: "single_choice",
                        sort: questions.length,
                      }),
                    )
                  }
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-gray-900 disabled:opacity-50"
                >
                  <Plus className="h-3 w-3" />
                  {t("Вопрос")}
                </button>
              )}
            </div>
            {questions.length === 0 ? (
              <p className="text-[11px] text-gray-400">
                {t("Вопросов пока нет")}
              </p>
            ) : (
              <div className="space-y-3">
                {questions.map((question, index) =>
                  preview ? (
                    <QuestionPreview
                      key={question.id}
                      question={question}
                      lang={lang}
                      assets={assets}
                    />
                  ) : (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      lang={lang}
                      moduleMaterials={materials}
                      editable={editable}
                      canMoveUp={index > 0}
                      canMoveDown={index < questions.length - 1}
                      onMove={(d) => moveChild("question", index, d)}
                      reload={reload}
                      onError={onError}
                    />
                  ),
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

function MiniButton({
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
