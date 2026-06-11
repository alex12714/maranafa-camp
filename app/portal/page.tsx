"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { TranslatedText } from "@/components/translated-text"
import { isLoggedIn } from "@/lib/portal-api"

/**
 * Portal entry point: an authenticated visitor goes straight to their
 * profile, everyone else to the login page. Token check is client-side
 * (JWT lives in localStorage), so this is a tiny client redirect page.
 */
export default function PortalPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(isLoggedIn() ? "/portal/me" : "/portal/login")
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">
          <TranslatedText text="Загрузка…" />
        </span>
      </div>
    </div>
  )
}
