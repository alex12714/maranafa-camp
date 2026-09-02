"use client"

/**
 * The director-only wrapper for every authoring screen.
 *
 * NOT THE SECURITY BOUNDARY, and it is worth being blunt about that: the
 * boundary is `require_director` on all eleven admin routes, reads included, so
 * a non-director who reaches these URLs gets 403 from the server no matter what
 * this component decides. What this buys is a HONEST SCREEN instead of a broken
 * one — without it a visitor without the capability would watch an editor
 * render its chrome and then fail every request inside it, which reads as a bug
 * rather than as a refusal.
 *
 * `is_director` is orthogonal to the auth role, not a narrowing of it: it is an
 * AirTable 'Роли' assignment, so a person recorded as `participant` may hold it
 * and most `staff` do not. Deliberately so — `staff` is most of the camp, and
 * training content is the thing certificates attest to.
 *
 * A 401 never lands here: `apiFetch` has already cleared the session and sent
 * the browser to /portal/login.
 */

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, ShieldOff } from "lucide-react"

import { useLanguage } from "@/contexts/language-context"
import { fetchAuthUser } from "@/lib/portal-learning-admin"

type GateState = "checking" | "allowed" | "denied" | "error"

export function DirectorGate({ children }: { children: ReactNode }) {
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  const [state, setState] = useState<GateState>("checking")

  useEffect(() => {
    let cancelled = false
    fetchAuthUser()
      .then((user) => {
        if (cancelled) return
        setState(user.is_director ? "allowed" : "denied")
      })
      .catch(() => {
        if (cancelled) return
        // A 403 on /auth/me is not a thing, so anything landing here is a
        // network or server failure — distinct from "you may not", and told
        // apart because only one of the two is worth retrying.
        setState("error")
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (state === "checking") {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm">{t("Загрузка…")}</p>
      </div>
    )
  }

  if (state === "error") {
    return (
      <p role="alert" className="py-16 text-center text-sm font-medium text-red-600">
        {t("Не удалось загрузить обучение. Попробуйте ещё раз.")}
      </p>
    )
  }

  if (state === "denied") {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <ShieldOff className="h-8 w-8 text-gray-300" aria-hidden />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-900">
            {t("Редактирование обучения доступно только директорам")}
          </p>
          <p className="mx-auto max-w-xs text-xs leading-relaxed text-gray-500">
            {t(
              "Содержание обучения — это то, что подтверждают сертификаты, поэтому менять его может узкий круг.",
            )}
          </p>
        </div>
        <Link
          href="/portal/learning"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("К обучению")}
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
