"use client"

/**
 * The way in to the authoring area, shown only to directors.
 *
 * Renders NOTHING for everyone else — not a disabled link, not a locked row.
 * An affordance that exists but refuses is worth showing when the viewer could
 * plausibly gain the capability by asking; `is_director` is not that. It is a
 * small standing group, and offering the rest of the camp a door into the
 * editor would produce exactly one outcome: people following it to a 403.
 *
 * This is presentation, never protection — see `DirectorGate` and, behind it,
 * `require_director` on all eleven admin routes.
 */

import { useEffect, useState } from "react"
import Link from "next/link"
import { PencilRuler } from "lucide-react"

import { useLanguage } from "@/contexts/language-context"
import { fetchAuthUser } from "@/lib/portal-learning-admin"

export function AuthoringLink() {
  const { translations } = useLanguage()
  const [show, setShow] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchAuthUser()
      .then((user) => {
        if (!cancelled) setShow(user.is_director)
      })
      // A learner's page must not report a failure of a link they cannot use.
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  if (!show) return null

  return (
    <Link
      href="/portal/learning/admin"
      className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
    >
      <PencilRuler className="h-4 w-4" />
      {translations["Редактор обучения"] || "Редактор обучения"}
    </Link>
  )
}
