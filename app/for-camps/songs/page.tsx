"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Search, X, Music, Star, ChevronRight } from "lucide-react"

interface Song {
  id: string
  name: string
  preview: string | null
  rating: number | null
}

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/songs")
      .then((r) => r.json())
      .then((d) => { setSongs(d.songs ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return songs
    return songs.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      (s.preview ?? "").toLowerCase().includes(q)
    )
  }, [songs, search])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#B22234] text-white pt-10 pb-14 px-4">
        <div className="container mx-auto max-w-3xl">
          <Link
            href="/for-camps"
            className="inline-flex items-center gap-1.5 text-red-200 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Для лагерей
          </Link>
          <h1 className="text-4xl font-extrabold mb-2">Песни</h1>
          <p className="text-red-100 text-lg">Сборник лагерных песен с текстами</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto max-w-3xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию..."
                className="w-full pl-9 pr-9 py-2.5 text-base border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#B22234] focus:outline-none transition-colors placeholder:text-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <span className="text-sm text-gray-400 whitespace-nowrap">
              {loading ? "..." : `${filtered.length} песен`}
            </span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="container mx-auto max-w-3xl px-4 py-6">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Music className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Песни не найдены</p>
            {search && (
              <button onClick={() => setSearch("")} className="mt-2 text-sm text-[#B22234] hover:underline">
                Сбросить поиск
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
            {filtered.map((song) => (
              <Link
                key={song.id}
                href={`/for-camps/songs/${song.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#B22234]/8 flex items-center justify-center flex-shrink-0">
                  <Music className="w-4 h-4 text-[#B22234]" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-[#B22234] transition-colors truncate">
                    {song.name}
                  </p>
                  {song.preview && (
                    <p className="text-sm text-gray-400 truncate mt-0.5">{song.preview}</p>
                  )}
                </div>

                {song.rating !== null && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
                    <span className="text-xs font-bold text-gray-600">{song.rating}</span>
                  </div>
                )}

                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#B22234] flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
