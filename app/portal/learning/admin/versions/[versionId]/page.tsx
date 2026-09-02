"use client"

/**
 * One version (/portal/learning/admin/versions/[versionId]) — director only.
 *
 * THE WHOLE SCREEN IS AN ARGUMENT ABOUT IMMUTABILITY. A published version
 * cannot be edited, and the honest way to express that is not a disabled Edit
 * button or a generic one that 409s — it is to offer the operation that DOES
 * work. So a draft gets fields; a published or retired version gets a panel
 * explaining that it is frozen and a primary button that clones it into a new
 * draft. The author never discovers the rule by hitting it.
 *
 * That is also why the certificate story is spelled out here rather than left
 * implicit: the reason this feature refuses to let anyone rewrite a published
 * question is that a certificate issued last season has to stay explainable
 * this season, and an author who does not know that reads the refusal as an
 * obstacle instead of the point.
 *
 * THE CHECKLIST IS FETCHED, NOT GUESSED. Nothing on this page decides whether a
 * draft may publish; the server answers that across five tables and the answer
 * is rendered whole. A refused publish returns the SAME shape in its 422, so
 * pressing Publish on a draft that has gone stale updates the list in place
 * rather than showing an error the author cannot interpret.
 */

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Copy,
  Loader2,
  Lock,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { describeAdminError } from "@/components/learning/admin/describe-error"
import { DirectorGate } from "@/components/learning/admin/director-gate"
import { PublishChecklistPanel } from "@/components/learning/admin/publish-checklist"
import {
  VersionStatusBadge,
  VersionStatusMeaning,
  isDraft,
} from "@/components/learning/admin/version-status"
import { ContentOutline } from "@/components/learning/admin/content-outline"
import { useLanguage } from "@/contexts/language-context"
import {
  LearningAdminError,
  cloneVersion,
  deleteVersion,
  fetchChecklist,
  fetchVersion,
  publishVersion,
  retireVersion,
  updateVersion,
  type AdminVersion,
  type PublishChecklist,
} from "@/lib/portal-learning-admin"

export default function VersionPage() {
  // `useParams` rather than the page's `params` prop, matching the attempt
  // route next door: this screen is a client component all the way down, so
  // there is nothing for a server component to hand it.
  const params = useParams<{ versionId: string }>()
  const versionId = Array.isArray(params.versionId)
    ? params.versionId[0]
    : params.versionId

  if (!versionId) return null

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/portal/learning/admin"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <BackLabel />
        </Link>
        <DirectorGate>
          <VersionEditor versionId={versionId} />
        </DirectorGate>
      </div>
    </div>
  )
}

function BackLabel() {
  const { translations } = useLanguage()
  return <>{translations["Редактор обучения"] || "Редактор обучения"}</>
}

function VersionEditor({ versionId }: { versionId: string }) {
  const router = useRouter()
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  const [version, setVersion] = useState<AdminVersion | null>(null)
  const [loadError, setLoadError] = useState(false)

  const [checklist, setChecklist] = useState<PublishChecklist | null>(null)
  const [checklistLoading, setChecklistLoading] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dirty, setDirty] = useState(false)

  /** Which write is in flight — also the double-tap guard for all of them. */
  const [busy, setBusy] = useState<null | "save" | "publish" | "clone" | "retire" | "delete">(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const applyVersion = useCallback((v: AdminVersion) => {
    setVersion(v)
    setTitle(v.title ?? "")
    setDescription(v.description ?? "")
    setDirty(false)
  }, [])

  const loadChecklist = useCallback((id: string) => {
    setChecklistLoading(true)
    fetchChecklist(id)
      .then(setChecklist)
      // A checklist that will not load must not take the page down with it —
      // the lifecycle actions below are still usable and still meaningful.
      .catch(() => setChecklist(null))
      .finally(() => setChecklistLoading(false))
  }, [])

  const load = useCallback(() => {
    setVersion(null)
    setLoadError(false)
    fetchVersion(versionId)
      .then((v) => {
        applyVersion(v)
        loadChecklist(v.id)
      })
      .catch(() => setLoadError(true))
  }, [versionId, applyVersion, loadChecklist])

  useEffect(() => {
    load()
  }, [load])

  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p role="alert" className="text-sm font-medium text-red-600">
          {t("Не удалось загрузить обучение. Попробуйте ещё раз.")}
        </p>
        <Button type="button" variant="outline" onClick={load}>
          {t("Повторить")}
        </Button>
      </div>
    )
  }

  if (version === null) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm">{t("Загрузка…")}</p>
      </div>
    )
  }

  const editable = isDraft(version.status)

  async function save() {
    if (busy || !version) return
    setBusy("save")
    setActionError(null)
    setNotice(null)
    try {
      applyVersion(
        await updateVersion(version.id, {
          title: title.trim() || null,
          description: description.trim() || null,
        }),
      )
      setNotice(t("Сохранено"))
    } catch (error) {
      setActionError(describeAdminError(error, t))
    } finally {
      setBusy(null)
    }
  }

  async function publish() {
    if (busy || !version) return
    setBusy("publish")
    setActionError(null)
    setNotice(null)
    try {
      const published = await publishVersion(version.id)
      applyVersion(published)
      loadChecklist(published.id)
      setNotice(
        t(
          "Версия опубликована. Предыдущая опубликованная версия снята с публикации.",
        ),
      )
    } catch (error) {
      // The 422 carries the whole checklist, so a refusal REPLACES the list
      // rather than sitting on top of a stale one.
      if (error instanceof LearningAdminError && error.checklist) {
        setChecklist(error.checklist)
      }
      setActionError(describeAdminError(error, t))
    } finally {
      setBusy(null)
    }
  }

  async function clone() {
    if (busy || !version) return
    setBusy("clone")
    setActionError(null)
    try {
      const draft = await cloneVersion(version.id)
      router.push(`/portal/learning/admin/versions/${draft.id}`)
    } catch (error) {
      setActionError(describeAdminError(error, t))
      setBusy(null)
    }
  }

  async function retire() {
    if (busy || !version) return
    setBusy("retire")
    setActionError(null)
    setNotice(null)
    try {
      applyVersion(await retireVersion(version.id))
      setNotice(t("Версия снята с публикации. Ничего не удалено."))
    } catch (error) {
      setActionError(describeAdminError(error, t))
    } finally {
      setBusy(null)
    }
  }

  async function destroy() {
    if (busy || !version) return
    setBusy("delete")
    setActionError(null)
    try {
      await deleteVersion(version.id)
      router.push("/portal/learning/admin")
    } catch (error) {
      setActionError(describeAdminError(error, t))
      setBusy(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* --- header ------------------------------------------------------- */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            {t("Версия {n}").replace("{n}", String(version.version_number))}
          </h1>
          <VersionStatusBadge status={version.status} />
        </div>
        <VersionStatusMeaning status={version.status} />
      </div>

      {actionError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {actionError}
        </p>
      )}
      {notice && (
        <p role="status" className="text-sm font-medium text-green-700">
          {notice}
        </p>
      )}

      {/* --- frozen banner + clone-to-edit -------------------------------- */}
      {!editable && (
        <section className="space-y-3 rounded-lg border border-gray-300 bg-gray-50 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Lock className="h-4 w-4 text-gray-500" aria-hidden />
            {t("Эта версия заморожена")}
          </p>
          <p className="text-xs leading-relaxed text-gray-600">
            {t(
              "Опубликованную версию изменить нельзя — именно поэтому сертификат, выданный в прошлом сезоне, можно объяснить и через несколько лет. Чтобы внести правки, создайте копию: это будет новый черновик с тем же содержанием.",
            )}
          </p>
          <Button type="button" disabled={busy !== null} onClick={clone}>
            {busy === "clone" ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Copy className="mr-1.5 h-4 w-4" />
            )}
            {t("Копировать в новый черновик")}
          </Button>
        </section>
      )}

      {/* --- title / description ------------------------------------------ */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-gray-900">{t("Описание версии")}</h2>
        {editable ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <label
                htmlFor="version-title"
                className="text-xs font-medium text-gray-700"
              >
                {t("Название")}
              </label>
              <Input
                id="version-title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setDirty(true)
                }}
                placeholder={t("Например: Подготовка наставников")}
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="version-description"
                className="text-xs font-medium text-gray-700"
              >
                {t("Описание")}
              </label>
              <Textarea
                id="version-description"
                value={description}
                rows={3}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setDirty(true)
                }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy !== null || !dirty}
              onClick={save}
            >
              {busy === "save" && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              {t("Сохранить")}
            </Button>
          </div>
        ) : (
          <div className="space-y-1 rounded-lg border border-gray-200 p-3">
            <p className="text-sm font-medium text-gray-900">
              {version.title || t("Без названия")}
            </p>
            {version.description && (
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-gray-600">
                {version.description}
              </p>
            )}
          </div>
        )}
      </section>

      {/* --- content ------------------------------------------------------ */}
      <ContentOutline versionId={version.id} editable={editable} />

      {/* --- checklist ---------------------------------------------------- */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-bold text-gray-900">
            {t("Проверка перед публикацией")}
          </h2>
          <button
            type="button"
            disabled={checklistLoading}
            onClick={() => loadChecklist(version.id)}
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${checklistLoading ? "animate-spin" : ""}`}
            />
            {t("Проверить снова")}
          </button>
        </div>

        {checklist === null && checklistLoading && (
          <div className="flex justify-center py-8 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {checklist === null && !checklistLoading && (
          <p className="text-sm text-gray-500">
            {t("Не удалось выполнить проверку. Попробуйте ещё раз.")}
          </p>
        )}

        {checklist !== null && <PublishChecklistPanel checklist={checklist} />}

        {editable && (
          <Button
            type="button"
            disabled={busy !== null}
            onClick={publish}
            className="w-full sm:w-auto"
          >
            {busy === "publish" ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-1.5 h-4 w-4" />
            )}
            {t("Опубликовать версию")}
          </Button>
        )}
      </section>

      {/* --- lifecycle ---------------------------------------------------- */}
      <section className="space-y-3 border-t border-gray-200 pt-6">
        <h2 className="text-sm font-bold text-gray-900">{t("Жизненный цикл")}</h2>

        {version.status === "published" && (
          <div className="space-y-2">
            <p className="text-xs leading-relaxed text-gray-600">
              {t(
                "Снятие с публикации останавливает начало новых попыток. Уже открытые попытки завершаются, все данные остаются на месте.",
              )}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy !== null}
              onClick={retire}
            >
              {busy === "retire" && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              {t("Снять с публикации")}
            </Button>
          </div>
        )}

        {editable && (
          <div className="space-y-2">
            <p className="text-xs leading-relaxed text-gray-600">
              {t(
                "Черновик можно удалить целиком — вместе с модулями, материалами и вопросами. Это необратимо.",
              )}
            </p>
            {confirmDelete ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-red-700">
                  {t("Удалить этот черновик?")}
                </span>
                <Button
                  type="button"
                  size="sm"
                  disabled={busy !== null}
                  onClick={destroy}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {busy === "delete" && (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  )}
                  {t("Да, удалить")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setConfirmDelete(false)}
                >
                  {t("Отмена")}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy !== null}
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                {t("Удалить черновик")}
              </Button>
            )}
          </div>
        )}

        {version.status === "retired" && (
          <p className="text-xs leading-relaxed text-gray-600">
            {t(
              "Снятую с публикации версию удалить нельзя: это содержание уже выданных сертификатов.",
            )}
          </p>
        )}
      </section>
    </div>
  )
}
