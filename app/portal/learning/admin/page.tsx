"use client"

/**
 * Authoring home (/portal/learning/admin) — director only.
 *
 * Two panes in one screen: the PROGRAMS (one per role, permanent) and, for
 * whichever is selected, its VERSIONS in the order the server numbered them.
 *
 * A PROGRAM IS NOT A VERSION, and the screen never lets the two blur. The
 * program is the permanent thing a role points at; versions are the successive,
 * frozen contents it has had. "Version 3 of the kitchen path" is what appears
 * on a certificate, which is why the number is rendered as an identity here and
 * not as a row index.
 *
 * ONE ACTIVE PROGRAM PER ROLE, and the API's partial unique index is what
 * enforces it — so roles that already have one are offered without a "create"
 * affordance rather than being hidden. Hiding them would make "this role
 * already has a programme" indistinguishable from "this role does not exist",
 * and only the second is worth acting on.
 */

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, FilePlus2, Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { describeAdminError } from "@/components/learning/admin/describe-error"
import { DirectorGate } from "@/components/learning/admin/director-gate"
import { VersionStatusBadge } from "@/components/learning/admin/version-status"
import { useLanguage } from "@/contexts/language-context"
import {
  createProgram,
  createVersion,
  fetchPrograms,
  fetchRoles,
  fetchVersions,
  type AdminProgram,
  type AdminRole,
  type AdminVersion,
} from "@/lib/portal-learning-admin"

export default function LearningAdminPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        <Header />
        <DirectorGate>
          <AuthoringHome />
        </DirectorGate>
      </div>
    </div>
  )
}

function Header() {
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  return (
    <div className="mb-6">
      <Link
        href="/portal/me"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("Личный кабинет")}
      </Link>
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
        {t("Редактор обучения")}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {t("Программы обучения по ролям и их версии")}
      </p>
    </div>
  )
}

function AuthoringHome() {
  const router = useRouter()
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  const [programs, setPrograms] = useState<AdminProgram[] | null>(null)
  const [roles, setRoles] = useState<AdminRole[]>([])
  const [loadError, setLoadError] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [versions, setVersions] = useState<AdminVersion[] | null>(null)
  const [versionsError, setVersionsError] = useState(false)

  /** Whichever write is in flight; also the double-tap guard. */
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [creatingProgram, setCreatingProgram] = useState(false)

  const load = useCallback(() => {
    setPrograms(null)
    setLoadError(false)
    Promise.all([fetchPrograms(), fetchRoles().catch(() => [] as AdminRole[])])
      .then(([p, r]) => {
        setPrograms(p)
        setRoles(r)
        // Land straight in the only programme when there is exactly one; a
        // camp with a single path should not have to pick it every visit.
        if (p.length === 1) setSelectedId(p[0].id)
      })
      .catch(() => setLoadError(true))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const loadVersions = useCallback((programId: string) => {
    setVersions(null)
    setVersionsError(false)
    fetchVersions(programId)
      .then(setVersions)
      .catch(() => setVersionsError(true))
  }, [])

  useEffect(() => {
    if (selectedId) loadVersions(selectedId)
  }, [selectedId, loadVersions])

  const roleName = useCallback(
    (roleId: string) => roles.find((r) => r.id === roleId)?.name ?? null,
    [roles],
  )

  async function addVersion(programId: string) {
    if (busy) return
    setBusy(true)
    setActionError(null)
    try {
      const draft = await createVersion(programId, {})
      router.push(`/portal/learning/admin/versions/${draft.id}`)
    } catch (error) {
      setActionError(describeAdminError(error, t))
      setBusy(false)
    }
  }

  async function addProgram(role: AdminRole) {
    if (busy) return
    setBusy(true)
    setActionError(null)
    try {
      // The code is the app-owned slug; the role name is the only sensible
      // seed the UI has, and the author can live with it for a first release.
      const code = slugify(role.name ?? "role")
      const program = await createProgram({ role_id: role.id, code })
      setCreatingProgram(false)
      setPrograms((prev) => (prev ? [...prev, program] : [program]))
      setSelectedId(program.id)
    } catch (error) {
      setActionError(describeAdminError(error, t))
    } finally {
      setBusy(false)
    }
  }

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

  if (programs === null) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm">{t("Загрузка…")}</p>
      </div>
    )
  }

  const takenRoleIds = new Set(programs.filter((p) => p.active).map((p) => p.role_id))
  const freeRoles = roles.filter((r) => !takenRoleIds.has(r.id))

  return (
    <div className="space-y-8">
      {actionError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {actionError}
        </p>
      )}

      {/* --- programs ----------------------------------------------------- */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-bold text-gray-900">{t("Роль")}</h2>
          {freeRoles.length > 0 && (
            <button
              type="button"
              onClick={() => setCreatingProgram((v) => !v)}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("Добавить программу")}
            </button>
          )}
        </div>

        {programs.length === 0 && !creatingProgram && (
          <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
            {t("Пока нет ни одной программы обучения")}
          </p>
        )}

        {programs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {programs.map((program) => {
              const selected = program.id === selectedId
              return (
                <button
                  key={program.id}
                  type="button"
                  onClick={() => setSelectedId(program.id)}
                  aria-pressed={selected}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                    selected
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-900 hover:border-gray-400"
                  }`}
                >
                  <span className="block text-sm font-semibold">
                    {roleName(program.role_id) ?? program.code}
                  </span>
                  <span
                    className={`block font-mono text-[11px] ${
                      selected ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {program.code}
                    {!program.active && ` · ${t("неактивна")}`}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {creatingProgram && (
          <div className="space-y-2 rounded-lg border border-gray-200 p-3">
            <p className="text-xs text-gray-500">
              {t("Выберите роль — у каждой роли может быть одна программа.")}
            </p>
            <div className="flex flex-wrap gap-2">
              {freeRoles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  disabled={busy}
                  onClick={() => addProgram(role)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:border-gray-400 disabled:opacity-50"
                >
                  {role.name ?? role.id.slice(0, 8)}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* --- versions ----------------------------------------------------- */}
      {selectedId && (
        <section className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-bold text-gray-900">{t("Версии")}</h2>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => addVersion(selectedId)}
            >
              <FilePlus2 className="mr-1.5 h-3.5 w-3.5" />
              {t("Новый черновик")}
            </Button>
          </div>

          {versionsError && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {t("Не удалось загрузить обучение. Попробуйте ещё раз.")}
            </p>
          )}

          {versions === null && !versionsError && (
            <div className="flex justify-center py-8 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}

          {versions !== null && versions.length === 0 && (
            <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              {t("У этой программы пока нет ни одной версии")}
            </p>
          )}

          {versions !== null && versions.length > 0 && (
            <ul className="space-y-2">
              {/* Newest first: the version somebody is working on is almost
                  always the last one the server numbered. */}
              {[...versions]
                .sort((a, b) => b.version_number - a.version_number)
                .map((version) => (
                  <li key={version.id}>
                    <Link
                      href={`/portal/learning/admin/versions/${version.id}`}
                      className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:border-gray-400"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {t("Версия {n}").replace(
                            "{n}",
                            String(version.version_number),
                          )}
                          {version.title ? ` · ${version.title}` : ""}
                        </p>
                        {version.available_languages.length > 0 && (
                          <p className="mt-0.5 text-xs text-gray-500">
                            {t("Языки")}:{" "}
                            {version.available_languages.join(", ")}
                          </p>
                        )}
                      </div>
                      <VersionStatusBadge status={version.status} />
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}

/** A conservative slug for a program `code`: the API allows 1–64 characters. */
function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64)
  // A Cyrillic role name slugs to nothing at all, so fall back to something
  // unique rather than sending an empty string the API would reject.
  return slug || `role-${Date.now().toString(36)}`
}
