"use client"

/**
 * The content editor: one version's modules, materials, questions and options.
 *
 * ONE EDITING LANGUAGE AT A TIME, chosen at the top and applied all the way
 * down. That is not a simplification of a richer four-column design — it is how
 * authoring this content actually happens. A path is written whole in Russian
 * and translated whole afterwards, and the rule the feature rests on is that a
 * version is COMPLETE in a language or does not offer it. So the useful
 * question is never "what does this one field say in four languages" but "what
 * is still missing in Latvian", and that is answered by switching one control
 * and reading down the page.
 *
 * THE SERVER OWNS THE STATE, exactly as it does on the learner's side. Every
 * write is followed by a fresh read of the whole subtree rather than a local
 * patch of the tree in this browser: sorts are renumbered server-side, a
 * question's options constrain each other, and a clone or a concurrent edit by
 * a second director must not leave this page confidently showing something that
 * is no longer true. It costs a round trip and buys never being wrong.
 *
 * A NON-DRAFT VERSION RENDERS THE SAME TREE, READ-ONLY. The editor is not
 * hidden once a version is published, because "what exactly is in version 2"
 * is a question directors ask constantly — about the version somebody's
 * certificate was issued against, which is precisely the one that is frozen.
 * Every control is disabled rather than removed, and the clone affordance above
 * is the way to change anything.
 */

import { useCallback, useEffect, useState } from "react"
import { Eye, Loader2, Pencil, Plus } from "lucide-react"

import { useLanguage } from "@/contexts/language-context"
import { describeAdminError } from "@/components/learning/admin/describe-error"
import { ModuleCard } from "@/components/learning/admin/content/module-card"
import {
  createModule,
  fetchVersionContent,
  reorderModules,
  CONTENT_LANGUAGES,
  type AdminVersionContent,
} from "@/lib/portal-learning-admin"

/** Endonyms — a language's own name is what a translator looks for. */
const LANGUAGE_LABELS: Record<string, string> = {
  ru: "Русский",
  en: "English",
  lv: "Latviešu",
  uk: "Українська",
}

export function ContentEditor({
  versionId,
  editable,
}: {
  versionId: string
  editable: boolean
}) {
  const { translations, language } = useLanguage()
  const t = (text: string) => translations[text] || text

  const [content, setContent] = useState<AdminVersionContent | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState(false)

  /**
   * The language being authored. Seeded from the portal's own language so a
   * Latvian-speaking director lands on Latvian, but it is a separate control:
   * the language you read the UI in and the language you are writing content
   * in are different choices, and conflating them would make an author switch
   * their whole interface to fix one missing prompt.
   */
  const [lang, setLang] = useState<string>(() =>
    CONTENT_LANGUAGES.includes(language as (typeof CONTENT_LANGUAGES)[number])
      ? language
      : "ru",
  )

  const reload = useCallback(async () => {
    const next = await fetchVersionContent(versionId)
    setContent(next)
  }, [versionId])

  useEffect(() => {
    let cancelled = false
    setContent(null)
    setLoadError(false)
    fetchVersionContent(versionId)
      .then((next) => {
        if (!cancelled) setContent(next)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })
    return () => {
      cancelled = true
    }
  }, [versionId])

  const onError = useCallback(
    (error: unknown) => setActionError(describeAdminError(error, t)),
    // `t` is derived from the translations object and is stable enough here;
    // rebuilding this callback on every render would defeat its purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translations],
  )

  async function run(work: () => Promise<unknown>) {
    if (busy) return
    setBusy(true)
    setActionError(null)
    try {
      await work()
      await reload()
    } catch (error) {
      onError(error)
    } finally {
      setBusy(false)
    }
  }

  if (loadError) {
    return (
      <p role="alert" className="text-sm font-medium text-red-600">
        {t("Не удалось загрузить содержание. Попробуйте ещё раз.")}
      </p>
    )
  }

  if (content === null) {
    return (
      <div className="flex justify-center py-8 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  const modules = [...content.modules].sort((a, b) => a.sort - b.sort)

  function moveModule(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= modules.length) return
    const next = [...modules]
    ;[next[index], next[target]] = [next[target], next[index]]
    // The complete list, always — a partial reorder is refused.
    return run(() => reorderModules(versionId, next.map((m) => m.id)))
  }

  return (
    <div className="space-y-4">
      {/* --- controls --------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
            {t("Язык содержания")}
          </span>
          {CONTENT_LANGUAGES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-pressed={lang === code}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                lang === code
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {LANGUAGE_LABELS[code] ?? code}
              {code === "ru" && (
                <span
                  className={lang === code ? "text-gray-300" : "text-gray-400"}
                >
                  {" "}
                  ·{" "}
                  {t("обязательный")}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-gray-400"
        >
          {preview ? (
            <>
              <Pencil className="h-3.5 w-3.5" />
              {t("Редактировать")}
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              {t("Предпросмотр")}
            </>
          )}
        </button>
      </div>

      {actionError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {actionError}
        </p>
      )}

      {/* --- modules ---------------------------------------------------- */}
      {modules.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          {t("В этой версии пока нет ни одного модуля")}
        </p>
      ) : (
        <div className="space-y-3">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              lang={lang}
              assets={content.assets}
              editable={editable}
              preview={preview}
              canMoveUp={index > 0}
              canMoveDown={index < modules.length - 1}
              onMove={(d) => moveModule(index, d)}
              reload={reload}
              onError={onError}
            />
          ))}
        </div>
      )}

      {editable && (
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            run(() =>
              createModule(versionId, {
                code: `module-${modules.length + 1}`,
                sort: modules.length,
                required: true,
              }),
            )
          }
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          {t("Добавить модуль")}
        </button>
      )}
    </div>
  )
}
