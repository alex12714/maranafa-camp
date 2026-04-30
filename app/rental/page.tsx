"use client"

import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import {
  ShoppingCart, Minus, Plus, X, Calendar,
  Search, LayoutGrid, List, SlidersHorizontal, ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

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

const ALL_TYPES = ["Декорации", "Инвентарь", "Техника"]

export default function RentalPage() {
  const [items, setItems] = useState<RentalItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [days, setDays] = useState(1)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [email, setEmail] = useState("")

  // Filter state
  const [search, setSearch] = useState("")
  const [activeTypes, setActiveTypes] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name")
  const [filtersOpen, setFiltersOpen] = useState(false)

  // View state
  const [view, setView] = useState<"grid" | "list">("grid")

  useEffect(() => {
    fetch("/api/rental/items")
      .then((r) => r.json())
      .then((d) => { setItems(d.items ?? []); setLoading(false) })
  }, [])

  const filtered = useMemo(() => {
    let out = [...items]
    if (search.trim()) {
      const q = search.toLowerCase()
      out = out.filter((i) => i.name.toLowerCase().includes(q))
    }
    if (activeTypes.length) {
      out = out.filter((i) => activeTypes.includes(i.type))
    }
    if (priceMin !== "") out = out.filter((i) => i.pricePerDay >= Number(priceMin))
    if (priceMax !== "") out = out.filter((i) => i.pricePerDay <= Number(priceMax))
    if (sortBy === "price-asc") out.sort((a, b) => a.pricePerDay - b.pricePerDay)
    else if (sortBy === "price-desc") out.sort((a, b) => b.pricePerDay - a.pricePerDay)
    else out.sort((a, b) => a.name.localeCompare(b.name))
    return out
  }, [items, search, activeTypes, priceMin, priceMax, sortBy])

  const toggleType = (t: string) =>
    setActiveTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])

  const clearFilters = () => {
    setSearch(""); setActiveTypes([]); setPriceMin(""); setPriceMax(""); setSortBy("name")
  }
  const hasFilters = search || activeTypes.length || priceMin || priceMax || sortBy !== "name"

  // Cart helpers
  const addToCart = (item: RentalItem) =>
    setCart((prev) => prev.find((c) => c.id === item.id) ? prev : [...prev, { ...item, selectedQty: 1 }])
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.id !== id))
  const updateQty = (id: string, delta: number) =>
    setCart((prev) => prev.map((c) => c.id !== id ? c : { ...c, selectedQty: Math.max(1, Math.min(c.quantity, c.selectedQty + delta)) }))
  const inCart = (id: string) => cart.some((c) => c.id === id)
  const total = cart.reduce((sum, c) => sum + c.pricePerDay * c.selectedQty * days, 0)

  const handleCheckout = async () => {
    if (!cart.length) return
    setCheckoutLoading(true)
    try {
      const res = await fetch("/api/rental/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((c) => ({ id: c.id, name: c.name, pricePerDay: c.pricePerDay, quantity: c.selectedQty })),
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

  const daysLabel = (n: number) => n === 1 ? "день" : n < 5 ? "дня" : "дней"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#B22234] text-white py-10 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Аренда оборудования</h1>
        <p className="text-red-100 max-w-xl mx-auto">
          Выберите нужные предметы, укажите количество дней и оформите заказ онлайн
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search + toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B22234] focus:ring-1 focus:ring-[#B22234]/20"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-gray-700 focus:outline-none focus:border-[#B22234] cursor-pointer"
              >
                <option value="name">По названию</option>
                <option value="price-asc">Цена: сначала дешевле</option>
                <option value="price-desc">Цена: сначала дороже</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Filters toggle */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors",
                filtersOpen || hasFilters
                  ? "bg-[#B22234] text-white border-[#B22234]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#B22234]"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Фильтры
              {hasFilters && (
                <span className="bg-white/30 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                  {activeTypes.length + (priceMin ? 1 : 0) + (priceMax ? 1 : 0)}
                </span>
              )}
            </button>

            {/* View toggle */}
            <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={cn("px-3 py-2.5 transition-colors", view === "grid" ? "bg-[#B22234] text-white" : "text-gray-500 hover:text-gray-700")}
                title="Сетка"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn("px-3 py-2.5 border-l border-gray-200 transition-colors", view === "list" ? "bg-[#B22234] text-white" : "text-gray-500 hover:text-gray-700")}
                title="Список"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filter panel */}
          {filtersOpen && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap gap-6">
              {/* Type filter */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Категория</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleType(t)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm border transition-colors",
                        activeTypes.includes(t)
                          ? "bg-[#B22234] text-white border-[#B22234]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#B22234]"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Цена в день</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="от €"
                    className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#B22234]"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    min={0}
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder="до €"
                    className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#B22234]"
                  />
                </div>
              </div>

              {hasFilters && (
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#B22234] hover:underline"
                  >
                    Сбросить всё
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results count */}
          {!loading && (
            <p className="text-sm text-gray-500 mb-3">
              {filtered.length === items.length
                ? `${items.length} позиций`
                : `${filtered.length} из ${items.length} позиций`}
            </p>
          )}

          {/* Items */}
          {loading ? (
            <div className={cn(view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              : "flex flex-col gap-3"
            )}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={cn("bg-white rounded-xl animate-pulse", view === "grid" ? "h-64" : "h-24")} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Ничего не найдено</p>
              <button onClick={clearFilters} className="mt-2 text-sm text-[#B22234] hover:underline">Сбросить фильтры</button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((item) => (
                <GridCard key={item.id} item={item} inCart={inCart(item.id)} onAdd={() => addToCart(item)} onRemove={() => removeFromCart(item.id)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((item) => (
                <ListRow key={item.id} item={item} inCart={inCart(item.id)} onAdd={() => addToCart(item)} onRemove={() => removeFromCart(item.id)} />
              ))}
            </div>
          )}
        </div>

        {/* Cart sidebar */}
        <div className="lg:w-80 xl:w-96 shrink-0">
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
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 mt-0.5">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

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

              {cart.length > 0 && (
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-600">Итого за {days} {daysLabel(days)}:</span>
                    <span className="text-2xl font-bold text-gray-900">€{total.toFixed(2)}</span>
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

              <p className="text-xs text-center text-gray-400">Оплата защищена Stripe 🔒</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Grid card component ---
function GridCard({ item, inCart, onAdd, onRemove }: {
  item: RentalItem; inCart: boolean; onAdd: () => void; onRemove: () => void
}) {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border overflow-hidden transition-all",
      inCart ? "border-[#B22234] ring-2 ring-[#B22234]/20" : "border-gray-200 hover:shadow-md"
    )}>
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
          onClick={inCart ? onRemove : onAdd}
          className={cn(
            "mt-3 w-full py-2 rounded-lg text-sm font-medium transition-colors",
            inCart
              ? "bg-red-50 text-[#B22234] border border-[#B22234] hover:bg-red-100"
              : "bg-[#B22234] text-white hover:bg-[#9a1c2a]"
          )}
        >
          {inCart ? "Убрать из корзины" : "В корзину"}
        </button>
      </div>
    </div>
  )
}

// --- List row component ---
function ListRow({ item, inCart, onAdd, onRemove }: {
  item: RentalItem; inCart: boolean; onAdd: () => void; onRemove: () => void
}) {
  return (
    <div className={cn(
      "bg-white rounded-xl border flex items-center gap-4 p-3 transition-all",
      inCart ? "border-[#B22234] ring-2 ring-[#B22234]/20" : "border-gray-200 hover:shadow-sm"
    )}>
      {/* Thumbnail */}
      <div className="relative w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        {item.photo ? (
          <Image src={item.photo} alt={item.name} fill className="object-contain p-1" unoptimized />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-300 text-xs">—</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{item.name}</h3>
          {item.type && (
            <span className="shrink-0 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{item.type}</span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">в наличии: {item.quantity} шт.</p>
      </div>

      {/* Price + action */}
      <div className="shrink-0 flex flex-col items-end gap-2">
        <div className="text-right">
          <span className="text-lg font-bold text-[#B22234]">€{item.pricePerDay}</span>
          <span className="text-xs text-gray-500 ml-1">/ день</span>
        </div>
        <button
          onClick={inCart ? onRemove : onAdd}
          className={cn(
            "px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
            inCart
              ? "bg-red-50 text-[#B22234] border border-[#B22234] hover:bg-red-100"
              : "bg-[#B22234] text-white hover:bg-[#9a1c2a]"
          )}
        >
          {inCart ? "Убрать" : "В корзину"}
        </button>
      </div>
    </div>
  )
}
