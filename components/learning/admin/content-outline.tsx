"use client"

/**
 * The content section of the version screen: the outline, the editors and the
 * preview.
 *
 * A THIN WRAPPER ON PURPOSE. It owns the heading and the one sentence that
 * frames what follows; `ContentEditor` owns the tree. Keeping the framing here
 * means the version page never has to know how deep the content goes.
 *
 * THE WARNING ABOUT `is_correct` APPLIES FROM HERE DOWN. Everything this
 * renders is built from `GET /learning/admin/versions/{id}/content`, the one
 * response in this feature that carries correctness, and it is safe only
 * because every route behind it is `require_director`. Nothing in this subtree
 * — no component, no type derived from that response — may be reused on a
 * learner surface. The preview is the one place the two worlds meet, and it
 * maps down field by field rather than passing anything through.
 */

import { useLanguage } from "@/contexts/language-context"
import { ContentEditor } from "@/components/learning/admin/content/content-editor"

export function ContentOutline({
  versionId,
  editable,
}: {
  versionId: string
  editable: boolean
}) {
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-bold text-gray-900">{t("Содержание")}</h2>
        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
          {editable
            ? t(
                "Модули, материалы и вопросы. Изменения сохраняются сразу, когда вы уходите из поля.",
              )
            : t(
                "Содержание этой версии в том виде, в котором она была опубликована.",
              )}
        </p>
      </div>
      <ContentEditor versionId={versionId} editable={editable} />
    </section>
  )
}
