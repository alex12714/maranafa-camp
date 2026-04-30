"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ShoppingCart, Minus, Plus, X, Calendar } from "lucide-react"

interface RentalItem {
  id: string
  name: string
  photo: string | null
  quantity: number
  pricePerDay: number
  type: string
}

interface CartItem extends RentalItem {
  selectedQty: number
}

export default function RentalPage() {
  const [items, setItems] = useState<RentalItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [days, setDays] = useState(1)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    fetch("/api/rental/items")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items ?? [])
        setLoading(false)
      })
  }, [])

  const addToCart = (item: RentalItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) return prev
      return [...prev, { ...item, selectedQty: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id))
  }

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        const next = Math.max(1, Math.min(c.quantity, c.selectedQty + delta))
        return { ...c, selectedQty: next }
      })
    )
  }

  const total = cart.reduce((sum, c) => sum + c.pricePerDay * c.selectedQty * days, 0)
  const inCart = (id: string) => cart.some((c) => c.id === id)

  const handleCheckout = async () => {
    if (!cart.length) return
    setCheckoutLoading(true)
    try {
      const res = await fetch("/api/rental/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((c) => ({
            id: c.id,
            name: c.name,
            pricePerDay: c.pricePerDay,
            quantity: c.selectedQty,
          })),
          days,
          customerEmail: email || undefined,
        }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setCheckoutLoading(false)
    }
  }

  const daysLabel = (n: number) => {
    if (n === 1) return "день"
    if (n < 5) return "дня"
    return "дней"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#B22234] text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Аренда оборудования</h1>
        <p className="text-lg text-red-100 max-w-xl mx-auto">
          Выберите нужные предметы, укажите количество дней и оформите заказ онлайн
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        {/* Items grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
                    inCart(item.id) ? "border-[#B22234] ring-2 ring-[#B22234]/20" : "border-gray-200 hover:shadow-md"
                  }`}
                >
                  <div className="relative h-44 bg-gray-100">
                    {item.photo ? (
                      <Image src={item.photo} alt={item.name} fill className="object-contain p-2" unoptimized />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm">Нет фото</div>
                    )}
                    {item.type && (
                      <span className="absolute top-2 left-2 bg-white text-gray-600 text-xs px-2 py-0.5 rounded-full border">
                        {item.type}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{item.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-xl font-bold text-[#B22234]">€{item.pricePerDay}</span>
                        <span className="text-xs text-gray-500 ml-1">/ день</span>
                      </div>
                      <span className="text-xs text-gray-400">в наличии: {item.quantity}</span>
                    </div>
                    <button
                      onClick={() => (inCart(item.id) ? removeFromCart(item.id) : addToCart(item))}
                      className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                        inCart(item.id)
                          ? "bg-red-50 text-[#B22234] border border-[#B22234] hover:bg-red-100"
                          : "bg-[#B22234] text-white hover:bg-[#9a1c2a]"
                      }`}
                    >
                      {inCart(item.id) ? "Убрать из корзины" : "В корзину"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart sidebar */}
        <div className="lg:w-80 xl:w-96">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-20">
            <div className="flex items-center gap-2 p-5 border-b border-gray-100">
              <ShoppingCart className="w-5 h-5 text-[#B22234]" />
              <h2 className="font-bold text-gray-900">Корзина</h2>
              {cart.length > 0 && (
                <span className="ml-auto bg-[#B22234] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>

            <div className="p-5 space-y-4">
              {/* Days selector */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Количество дней аренды
                </label>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                  <button
                    onClick={() => setDays((d) => Math.max(1, d - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#B22234] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="flex-1 text-center font-bold text-lg text-gray-900">
                    {days} <span className="text-sm font-normal text-gray-500">{daysLabel(days)}</span>
                  </span>
                  <button
                    onClick={() => setDays((d) => d + 1)}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#B22234] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Cart items */}
              {cart.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">Корзина пуста</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          €{item.pricePerDay} × {item.selectedQty} × {days} {daysLabel(days)} ={" "}
                          <span className="font-semibold text-gray-700">
                            €{(item.pricePerDay * item.selectedQty * days).toFixed(2)}
                          </span>
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#B22234] hover:text-[#B22234]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs w-4 text-center">{item.selectedQty}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            disabled={item.selectedQty >= item.quantity}
                            className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#B22234] hover:text-[#B22234] disabled:opacity-40"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 mt-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

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
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Итого за {days} {daysLabel(days)}:</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-bold text-gray-900">€{total.toFixed(2)}</span>
                    <span className="text-xs text-gray-400">{cart.length} {cart.length === 1 ? "позиция" : "позиции"}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={!cart.length || checkoutLoading}
                className="w-full py-3 bg-[#B22234] text-white rounded-lg font-semibold hover:bg-[#9a1c2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? "Оформление..." : "Оплатить через Stripe"}
              </button>

              <p className="text-xs text-center text-gray-400">
                Оплата защищена Stripe 🔒
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
