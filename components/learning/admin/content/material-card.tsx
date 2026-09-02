"use client"

/**
 * One material: what a learner is sent to read, watch or listen to after a
 * wrong answer, or as mandatory reading in its own right.
 *
 * KIND IS NOT DECORATION. `audio` and `video` are the two kinds publish
 * validation refuses without a transcript, because a learner using a screen
 * reader would otherwise be GRADED on a prompt they cannot perceive — so
 * switching a material to one of those kinds shows the transcript state
 * immediately rather than letting the checklist deliver the news later.
 *
 * ASSETS ARE CHOSEN, NOT UPLOADED. There is no upload route in this API, so the
 * picker offers only assets already referenced by this version — the same
 * recording is legitimately reused across materials, which is exactly why the
 * aggregate read returns one deduplicated list rather than inlining it. Clearing
 * the link sends `asset_id: null`, which the API distinguishes from omitting it;
 * omitting would silently keep the old file.
 *
 * `body_markdown` IS STORED VERBATIM AND MUST BE TYPED VERBATIM. Leading spaces
 * nest a bullet under its section and two trailing spaces are a hard line
 * break, so nothing here trims the value on its way to the server.
 */

import { useState } from "react"
import { ArrowDown, ArrowUp, Loader2, Trash2 } from "lucide-react"

import { useLanguage } from "@/contexts/language-context"
import {
  deleteMaterial,
  putMaterialTranslation,
  updateMaterial,
  MATERIAL_KINDS,
  type AdminAsset,
  type AdminMaterialContent,
} from "@/lib/portal-learning-admin"
import { forLang } from "@/components/learning/admin/content/rules"
import {
  InlineText,
  InlineTextarea,
} from "@/components/learning/admin/content/inline-fields"

/** The kinds whose asset must carry a transcript before the version publishes. */
const SPOKEN_KINDS = new Set(["audio", "video"])

interface Props {
  material: AdminMaterialContent
  lang: string
  /** Every asset this version references, deduplicated by the aggregate read. */
  assets: AdminAsset[]
  editable: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  onMove: (direction: -1 | 1) => void
  reload: () => Promise<void>
  onError: (error: unknown) => void
}

export function MaterialCard({
  material,
  lang,
  assets,
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

  const tr = forLang(material.translations, lang)
  const asset = assets.find((a) => a.id === material.asset_id) ?? null
  const spoken = SPOKEN_KINDS.has(material.kind)

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

  /** PUT is a replace — send the whole row for this language. */
  function saveTranslation(patch: {
    title?: string | null
    body_markdown?: string | null
  }) {
    return run(() =>
      putMaterialTranslation(material.id, lang, {
        title: tr?.title ?? null,
        body_markdown: tr?.body_markdown ?? null,
        ...patch,
      }),
    )
  }

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
            {material.kind}
          </span>
          {material.required && (
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
              {t("обязательный")}
            </span>
          )}
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />}
        </div>
        {editable && (
          <div className="flex items-center gap-1">
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
                  onClick={() => run(() => deleteMaterial(material.id))}
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
                label={t("Удалить материал")}
                disabled={busy}
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </MiniButton>
            )}
          </div>
        )}
      </div>

      {editable && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              {t("Тип материала")}
            </span>
            <select
              value={material.kind}
              disabled={busy}
              onChange={(e) =>
                run(() => updateMaterial(material.id, { kind: e.target.value }))
              }
              className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-gray-900"
            >
              {MATERIAL_KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {kind}
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
                checked={material.required}
                disabled={busy}
                onChange={(e) =>
                  run(() =>
                    updateMaterial(material.id, { required: e.target.checked }),
                  )
                }
                className="h-4 w-4 accent-gray-900"
              />
              {t("Нужно подтвердить")}
            </label>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              {t("Файл")}
            </span>
            <select
              value={material.asset_id ?? ""}
              disabled={busy}
              onChange={(e) =>
                run(() =>
                  updateMaterial(material.id, {
                    // null CLEARS the link; the API tells that apart from an
                    // omitted field, which would keep the old file.
                    asset_id: e.target.value === "" ? null : e.target.value,
                  }),
                )
              }
              className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-gray-900"
            >
              <option value="">{t("без файла")}</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.storage_key}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {spoken && (
        <p
          className={`rounded-md border px-2 py-1.5 text-[11px] font-medium ${
            asset?.transcript
              ? "border-gray-200 bg-gray-50 text-gray-600"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {asset?.transcript
            ? t("Расшифровка есть")
            : asset
              ? t(
                  "У файла нет расшифровки — публикация будет заблокирована: участник со скринридером не сможет воспринять материал",
                )
              : t("К материалу не приложен файл — урок с заголовком и без содержания")}
        </p>
      )}

      <InlineText
        label={t("Заголовок")}
        value={tr?.title ?? null}
        disabled={!editable}
        placeholder={t("Название материала на выбранном языке")}
        onSave={(next) => saveTranslation({ title: next })}
      />
      <InlineTextarea
        label={t("Текст")}
        value={tr?.body_markdown ?? null}
        disabled={!editable}
        rows={4}
        hint={t("Markdown. Отступы и переносы сохраняются как есть.")}
        onSave={(next) => saveTranslation({ body_markdown: next })}
      />
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
