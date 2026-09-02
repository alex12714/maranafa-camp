"use client"

/**
 * Where the module outline, material editor and question editor go.
 *
 * THEY ARE NOT BUILT, AND THIS SAYS SO RATHER THAN PRETENDING. The authoring
 * API (app/routers/learning_admin.py) exposes programs, versions and the
 * lifecycle — and nothing else. There is no route that creates, reads, reorders
 * or deletes a module; none that writes a material, its translations or its
 * asset link; none that writes a question, an option, `is_correct`, or any
 * per-language text. There is not even an admin-side READ of a version's
 * content, so this cannot honestly render a read-only outline either: the only
 * content read in the whole API is the learner's attempt endpoint, which
 * requires an open attempt against a PUBLISHED version and deliberately strips
 * correctness, so it can never show a director their own draft.
 *
 * A PLACEHOLDER IS THE GRACEFUL FAILURE HERE; an editor wired to endpoints that
 * do not exist would render its chrome, accept typing, and lose the work on
 * save — which is worse than the absence, because it is indistinguishable from
 * a bug until somebody has already written a question into it.
 *
 * THE SEAM IS SHAPED FOR THE DROP-IN. This takes `versionId` already, even
 * though nothing here reads it yet, so the arrival of
 * `GET /learning/admin/versions/{id}/content` — the aggregate read of the whole
 * subtree, and the one place in this feature where `is_correct` is legitimately
 * exposed, because an author has to see which option is right — changes this
 * component's body and nothing at its boundary.
 *
 * The author is not left without a route forward: the publish checklist below
 * is computed server-side over exactly these tables, so it still names every
 * missing prompt, untranslated option and unlinked remediation material by
 * code. Until the content routes land, the checklist IS the view of the
 * content — which is why this panel points at it rather than apologising.
 */

import { Layers } from "lucide-react"

import { useLanguage } from "@/contexts/language-context"

export function ContentOutline({
  versionId,
  editable,
}: {
  /** Unused until the content routes land; see the note above. */
  versionId: string
  editable: boolean
}) {
  void versionId
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold text-gray-900">{t("Содержание")}</h2>
      <div className="space-y-2 rounded-lg border border-dashed border-gray-300 bg-gray-50/60 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Layers className="h-4 w-4 text-gray-400" aria-hidden />
          {t("Редактор модулей и вопросов пока недоступен")}
        </p>
        <p className="text-xs leading-relaxed text-gray-600">
          {t(
            "Модули, материалы и вопросы этой версии заполняются через сид-скрипт: в API ещё нет маршрутов для их редактирования.",
          )}
        </p>
        <p className="text-xs leading-relaxed text-gray-600">
          {editable
            ? t(
                "Проверка ниже выполняется на сервере по этим же данным и назовёт каждый пропущенный вопрос, перевод и материал по его коду.",
              )
            : t(
                "Проверка ниже показывает состояние содержания этой версии на момент публикации.",
              )}
        </p>
      </div>
    </section>
  )
}
