"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ShoppingBag, Tag, ShoppingCart, Minus, Plus, X, Truck, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface MerchItem {
  id: string
  name: string
  photo: string | null
  quantity: number
  price: number | null
  link: string | null
  description: string | null
}

interface CartItem extends MerchItem {
  selectedQty: number
}

type Shipping = "collect" | "post"

export default function MerchPage() {
  const [items, setItems] = useState<MerchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [shipping, setShipping] = useState<Shipping>("collect")
  const [email, setEmail] = useState("")
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    fetch("/api/merch/items")
      .then((r) => r.json())
      .then((d) => { setItems(d.items ?? []); setLoading(false) })
  }, [])

  const addToCart = (item: MerchItem) =>
    setCart((prev) => prev.find((c) => c.id === item.id) ? prev : [...prev, { ...item, selectedQty: 1 }])
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.id !== id))
  const updateQty = (id: string, delta: number) =>
    setCart((prev) => prev.map((c) =>
      c.id !== id ? c : { ...c, selectedQty: Math.max(1, c.selectedQty + delta) }
    ))
  const inCart = (id: string) => cart.some((c) => c.id === id)

  const itemsTotal = cart.reduce((sum, c) => sum + (c.price ?? 0) * c.selectedQty, 0)
  const shippingCost = shipping === "post" ? 5 : 0
  const total = itemsTotal + shippingCost

  const handleCheckout = async () => {
    if (!cart.length) return
    setCheckoutLoading(true)
    try {
      const res = await fetch("/api/merch/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((c) => ({ id: c.id, name: c.name, price: c.price, quantity: c.selectedQty })),
          shipping,
          customerEmail: email || undefined,
        }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#B22234] text-white py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <ShoppingBag className="w-8 h-8 opacity-80" />
          <h1 className="text-4xl font-bold">Мерч Маранафа</h1>
        </div>
        <p className="text-red-100 max-w-md mx-auto">
          Фирменная продукция лагеря — футболки, кружки и другие сувениры
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        {/* Items grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Товары скоро появятся</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "bg-white rounded-2xl border overflow-hidden flex flex-col transition-all",
                    inCart(item.id)
                      ? "border-[#B22234] shadow-md ring-2 ring-[#B22234]/20"
                      : "border-gray-200 shadow-sm hover:shadow-md"
                  )}
                >
                  {/* Photo */}
                  <div className="relative bg-gray-100 aspect-square">
                    {item.photo ? (
                      <Image src={item.photo} alt={item.name} fill className="object-contain p-4" unoptimized />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-lg leading-snug">{item.name}</h3>

                    {item.description && (
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.description}</p>
                    )}

                    <div className="mt-auto pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        {item.price != null ? (
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-4 h-4 text-[#B22234]" />
                            <span className="text-2xl font-bold text-[#B22234]">€{item.price.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Цена по запросу</span>
                        )}
                        {item.quantity > 0 ? (
                          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
                            В наличии: {item.quantity}
                          </span>
                        ) : (
                          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">
                            Под заказ
                          </span>
                        )}
                      </div>

                      {item.price != null && (
                        inCart(item.id) ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1 flex-1">
                              <button
                                onClick={() => updateQty(item.id, -1)}
                                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#B22234] hover:text-[#B22234] transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="flex-1 text-center text-sm font-semibold">
                                {cart.find((c) => c.id === item.id)?.selectedQty ?? 1}
                              </span>
                              <button
                                onClick={() => updateQty(item.id, 1)}
                                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#B22234] hover:text-[#B22234] transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-[#B22234] border border-[#B22234] text-sm font-medium hover:bg-red-100 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              Убрать
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="w-full py-2.5 rounded-xl bg-[#B22234] text-white text-sm font-semibold hover:bg-[#9a1c2a] transition-colors"
                          >
                            В корзину
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart sidebar */}
        <div className="lg:w-80 xl:w-96 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-20">
            <div className="flex items-center gap-2 p-5 border-b border-gray-100">
              <ShoppingCart className="w-5 h-5 text-[#B22234]" />
              <h2 className="font-bold text-gray-900">Корзина</h2>
              {cart.length > 0 && (
                <span className="ml-auto bg-[#B22234] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((s, c) => s + c.selectedQty, 0)}
                </span>
              )}
            </div>

            <div className="p-5 space-y-4">
              {/* Cart items */}
              {cart.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4">Корзина пуста</p>
              ) : (
                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          €{item.price?.toFixed(2)} × {item.selectedQty} ={" "}
                          <span className="font-semibold text-gray-700">
                            €{((item.price ?? 0) * item.selectedQty).toFixed(2)}
                          </span>
                        </p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 mt-0.5 shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Shipping */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Способ получения</p>
                <div className="space-y-2">
                  <label className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                    shipping === "collect" ? "border-[#B22234] bg-red-50" : "border-gray-200 hover:border-gray-300"
                  )}>
                    <input type="radio" name="shipping" value="collect" checked={shipping === "collect"} onChange={() => setShipping("collect")} className="accent-[#B22234]" />
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">Самовывоз</p>
                      <p className="text-xs text-gray-500">Забрать на мероприятии лагеря</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">Бесплатно</span>
                  </label>

                  <label className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                    shipping === "post" ? "border-[#B22234] bg-red-50" : "border-gray-200 hover:border-gray-300"
                  )}>
                    <input type="radio" name="shipping" value="post" checked={shipping === "post"} onChange={() => setShipping("post")} className="accent-[#B22234]" />
                    <Truck className="w-4 h-4 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">Доставка почтой</p>
                      <p className="text-xs text-gray-500">Отправим по вашему адресу</p>
                    </div>
                    <span className="text-sm font-bold text-gray-700">+€5.00</span>
                  </label>
                </div>
              </div>

              {/* Email */}
              {cart.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Email для подтверждения</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#B22234]"
                  />
                </div>
              )}

              {/* Total */}
              {cart.length > 0 && (
                <div className="border-t border-gray-100 pt-3 space-y-1.5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Товары</span>
                    <span>€{itemsTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Доставка</span>
                    <span>{shippingCost === 0 ? "Бесплатно" : `€${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1 border-t border-gray-100">
                    <span className="font-semibold text-gray-900">Итого</span>
                    <span className="text-2xl font-bold text-gray-900">€{total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={!cart.length || checkoutLoading}
                className="w-full py-3 bg-[#B22234] text-white rounded-xl font-semibold hover:bg-[#9a1c2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? "Оформление..." : "Оплатить через Stripe"}
              </button>

              <p className="text-xs text-center text-gray-400">Оплата защищена Stripe 🔒</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
