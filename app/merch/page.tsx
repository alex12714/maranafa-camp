"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ExternalLink, ShoppingBag, Tag } from "lucide-react"

interface MerchItem {
  id: string
  name: string
  photo: string | null
  quantity: number
  price: number | null
  link: string | null
  description: string | null
}

export default function MerchPage() {
  const [items, setItems] = useState<MerchItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/merch/items")
      .then((r) => r.json())
      .then((d) => { setItems(d.items ?? []); setLoading(false) })
  }, [])

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

      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Photo */}
                <div className="relative bg-gray-100 aspect-square">
                  {item.photo ? (
                    <Image
                      src={item.photo}
                      alt={item.name}
                      fill
                      className="object-contain p-4"
                      unoptimized
                    />
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
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed flex-1">{item.description}</p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
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

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#B22234] text-white text-sm font-semibold hover:bg-[#9a1c2a] transition-colors"
                    >
                      Заказать
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
