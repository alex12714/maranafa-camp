"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Minus, Package, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TranslatedText } from "@/components/translated-text"
import {
  MAX_ORDER_QTY,
  checkoutOrder,
  createOrder,
  fetchProducts,
  formatPrice,
  type PaymentProvider,
  type ShopProduct,
} from "@/lib/portal-shop"

// Russian source keys (see contexts/language-context.tsx, // F5 block)

/** Max purchasable qty for a product (stock-tracked or schema cap). */
function maxQty(product: ShopProduct): number {
  return Math.max(
    1,
    Math.min(product.quantity ?? MAX_ORDER_QTY, MAX_ORDER_QTY),
  )
}

export default function PortalServicesPage() {
  const [products, setProducts] = useState<ShopProduct[] | null>(null)
  const [loadError, setLoadError] = useState(false)

  // Buy flow: which product card is expanded, chosen qty, in-flight provider
  const [buyingId, setBuyingId] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [paying, setPaying] = useState<PaymentProvider | null>(null)
  const [payError, setPayError] = useState(false)

  const load = useCallback(() => {
    setProducts(null)
    setLoadError(false)
    fetchProducts()
      .then(setProducts)
      .catch(() => setLoadError(true))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function openBuy(product: ShopProduct) {
    setBuyingId(product.id)
    setQty(1)
    setPayError(false)
  }

  function closeBuy() {
    if (paying) return
    setBuyingId(null)
    setPayError(false)
  }

  async function startPayment(product: ShopProduct, provider: PaymentProvider) {
    setPaying(provider)
    setPayError(false)
    try {
      const order = await createOrder(product.id, qty)
      const checkoutUrl = await checkoutOrder(order.id, provider)
      // Hosted payment page (Stripe Checkout / Paysera). The provider sends
      // the user back to /shop/success|cancel?order=... which redirects to
      // /portal/services/success|cancel.
      window.location.href = checkoutUrl
    } catch {
      setPayError(true)
      setPaying(null)
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6">
          <Link
            href="/portal/me"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <TranslatedText text="Личный кабинет" />
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            <TranslatedText text="Услуги и товары" />
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            <TranslatedText text="Купите товары и услуги конференции онлайн" />
          </p>
        </div>

        {products === null && !loadError && (
          <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">
              <TranslatedText text="Загрузка…" />
            </p>
          </div>
        )}

        {loadError && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p role="alert" className="text-sm font-medium text-red-600">
              <TranslatedText text="Не удалось загрузить товары. Попробуйте ещё раз." />
            </p>
            <Button type="button" variant="outline" onClick={load}>
              <TranslatedText text="Повторить" />
            </Button>
          </div>
        )}

        {products !== null && products.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-500">
            <Package className="h-8 w-8 text-gray-300" />
            <p className="text-sm">
              <TranslatedText text="Пока нет доступных товаров" />
            </p>
          </div>
        )}

        {products !== null && products.length > 0 && (
          <ul className="space-y-3">
            {products.map((product) => {
              const sellable = product.price !== null
              const expanded = buyingId === product.id
              const limit = maxQty(product)
              const photoUrl = product.photo[0]?.url ?? null

              return (
                <li
                  key={product.id}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-start gap-3">
                    {photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photoUrl}
                        alt={product.name ?? ""}
                        className="h-12 w-12 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                        <Package className="h-6 w-6" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="mt-0.5 text-sm text-gray-500">
                          {product.description}
                        </p>
                      )}
                      {sellable ? (
                        <p className="mt-1 text-base font-bold text-gray-900">
                          {formatPrice(product.price as string)}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm font-medium text-gray-400">
                          <TranslatedText text="Цена не указана" />
                        </p>
                      )}
                    </div>
                  </div>

                  {!expanded && (
                    <Button
                      type="button"
                      className="mt-3 w-full"
                      disabled={!sellable || paying !== null}
                      onClick={() => openBuy(product)}
                    >
                      <TranslatedText text="Купить" />
                    </Button>
                  )}

                  {expanded && (
                    <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
                      {limit > 1 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            <TranslatedText text="Количество" />
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-9 w-9"
                              disabled={qty <= 1 || paying !== null}
                              onClick={() => setQty((q) => Math.max(1, q - 1))}
                              aria-label="−"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center text-sm font-semibold tabular-nums text-gray-900">
                              {qty}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-9 w-9"
                              disabled={qty >= limit || paying !== null}
                              onClick={() =>
                                setQty((q) => Math.min(limit, q + 1))
                              }
                              aria-label="+"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {sellable && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">
                            <TranslatedText text="Итого" />
                          </span>
                          <span className="font-bold text-gray-900">
                            {formatPrice(
                              (
                                Number.parseFloat(product.price as string) *
                                qty
                              ).toFixed(2),
                            )}
                          </span>
                        </div>
                      )}

                      {payError && (
                        <p
                          role="alert"
                          className="text-sm font-medium text-red-600"
                        >
                          <TranslatedText text="Не удалось оформить заказ. Попробуйте ещё раз." />
                        </p>
                      )}

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          <TranslatedText text="Способ оплаты" />
                        </p>
                        <Button
                          type="button"
                          className="w-full"
                          disabled={paying !== null}
                          onClick={() => void startPayment(product, "stripe")}
                        >
                          {paying === "stripe" ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <TranslatedText text="Переход к оплате…" />
                            </>
                          ) : (
                            <TranslatedText text="Карта / Apple Pay" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          disabled={paying !== null}
                          onClick={() => void startPayment(product, "paysera")}
                        >
                          {paying === "paysera" ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <TranslatedText text="Переход к оплате…" />
                            </>
                          ) : (
                            <TranslatedText text="Банковская ссылка" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full"
                          disabled={paying !== null}
                          onClick={closeBuy}
                        >
                          <TranslatedText text="Отмена" />
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
