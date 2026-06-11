"use client"

import Link from "next/link"
import { XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TranslatedText } from "@/components/translated-text"

// Russian source keys (see contexts/language-context.tsx, // F5 block)

/**
 * Payment-provider cancel page. The backend builds the cancel URL as
 * {SHOP_FRONTEND_BASE_URL}/shop/cancel?order={order_id}; the /shop/cancel
 * shim forwards here. The order stays "pending" server-side and can be
 * checked out again from the shop.
 */
export default function PortalServicesCancelPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <XCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h1 className="mt-4 text-xl font-bold text-gray-900">
          <TranslatedText text="Оплата отменена" />
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          <TranslatedText text="Вы можете вернуться и попробовать ещё раз." />
        </p>

        <div className="mt-8 space-y-2">
          <Button asChild className="w-full">
            <Link href="/portal/services">
              <TranslatedText text="Вернуться к покупкам" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/portal/me">
              <TranslatedText text="Личный кабинет" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
