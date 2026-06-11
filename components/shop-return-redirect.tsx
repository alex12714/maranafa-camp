"use client"

import { useEffect } from "react"
import { Loader2 } from "lucide-react"

/**
 * Redirect shim for payment-provider return URLs.
 *
 * The backend (maranafa-api) hardcodes Stripe/Paysera return URLs to
 * {SHOP_FRONTEND_BASE_URL}/shop/success|cancel?order={id}. On the
 * conference.maranafa.camp host the middleware rewrites that path to
 * /portal/shop/..., where this shim forwards the browser to the real portal
 * page (/portal/services/success|cancel) keeping the query string intact.
 */
export function ShopReturnRedirect({
  target,
}: {
  target: "success" | "cancel"
}) {
  useEffect(() => {
    window.location.replace(
      `/portal/services/${target}${window.location.search}`,
    )
  }, [target])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  )
}
