"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TranslatedText } from "@/components/translated-text"
import { fetchMyOrders } from "@/lib/portal-shop"

// Russian source keys (see contexts/language-context.tsx, // F5 block)

const POLL_INTERVAL_MS = 3_000
const POLL_TIMEOUT_MS = 60_000

type PaymentState = "checking" | "paid" | "failed" | "timeout" | "notfound"

/**
 * Payment-provider return page. The backend builds the return URL as
 * {SHOP_FRONTEND_BASE_URL}/shop/success?order={order_id}; the /shop/success
 * shim forwards here keeping the query string. The webhook settles the order
 * asynchronously, so we poll GET /me/orders until the order leaves "pending".
 */
function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order")
  const [state, setState] = useState<PaymentState>("checking")
  // Whether the order was ever seen in /me/orders (timeout vs notfound)
  const everFoundRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const deadline = Date.now() + POLL_TIMEOUT_MS

    async function poll() {
      try {
        const orders = await fetchMyOrders()
        if (cancelled) return
        // Orders come newest first; without an id fall back to the latest one.
        const order = orderId
          ? orders.find((o) => o.id === orderId)
          : orders[0]
        if (order) {
          everFoundRef.current = true
          if (order.status === "paid") {
            setState("paid")
            return
          }
          if (order.status === "failed" || order.status === "cancelled") {
            setState("failed")
            return
          }
          // "pending" (webhook not arrived yet) — keep polling.
        }
      } catch {
        // Transient network/API error — keep polling until the deadline.
      }
      if (cancelled) return
      if (Date.now() >= deadline) {
        setState(everFoundRef.current ? "timeout" : "notfound")
        return
      }
      timer = setTimeout(() => void poll(), POLL_INTERVAL_MS)
    }

    void poll()
    return () => {
      cancelled = true
      if (timer !== undefined) clearTimeout(timer)
    }
  }, [orderId])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-sm text-center">
        {state === "checking" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-400" />
            <h1 className="mt-4 text-xl font-bold text-gray-900">
              <TranslatedText text="Проверяем оплату…" />
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              <TranslatedText text="Это может занять несколько секунд." />
            </p>
          </>
        )}

        {state === "paid" && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="mt-4 text-xl font-bold text-gray-900">
              <TranslatedText text="Оплата прошла успешно!" />
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              <TranslatedText text="Спасибо за покупку!" />
            </p>
          </>
        )}

        {state === "failed" && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="mt-4 text-xl font-bold text-gray-900">
              <TranslatedText text="Оплата не прошла" />
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              <TranslatedText text="Попробуйте оформить заказ ещё раз." />
            </p>
          </>
        )}

        {(state === "timeout" || state === "notfound") && (
          <>
            <Clock className="mx-auto h-12 w-12 text-amber-500" />
            <h1 className="mt-4 text-xl font-bold text-gray-900">
              <TranslatedText
                text={
                  state === "timeout"
                    ? "Платёж ещё обрабатывается"
                    : "Заказ не найден"
                }
              />
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              <TranslatedText text="Проверьте статус заказа позже в личном кабинете." />
            </p>
          </>
        )}

        {state !== "checking" && (
          <div className="mt-8 space-y-2">
            <Button asChild className="w-full">
              <Link href="/portal/me">
                <TranslatedText text="Личный кабинет" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/portal/services">
                <TranslatedText text="К услугам и товарам" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PortalServicesSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
