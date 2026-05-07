"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Star, Music } from "lucide-react"

interface SongDetail {
  id: string
  name: string
  text: string | null
  rating: number | null
}

export default function SongDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [song, setSong] = useState<SongDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/songs/${id}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then((d) => { if (d) { setSong(d.song); setLoading(false) } })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="h-36 bg-[#B22234]/80" />
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-5 bg-gray-200 rounded w-full" />
          <div className="h-5 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    )
  }

  if (notFound || !song) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Music className="w-10 h-10 text-gray-300" />
        <p className="text-gray-500 font-medium">Песня не найдена</p>
        <Link href="/for-camps/songs" className="text-sm text-[#B22234] hover:underline">
          Вернуться к песням
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#B22234] text-white pt-10 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/for-camps/songs"
            className="inline-flex items-center gap-1.5 text-red-200 hover:text-white text-sm mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Песни
          </Link>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-extrabold leading-tight">{song.name}</h1>
            {song.rating !== null && (
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 flex-shrink-0">
                <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                <span className="text-sm font-bold">{song.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lyrics */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {song.text ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <pre className="font-sans text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
              {song.text.trim()}
            </pre>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Music className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Текст не добавлен</p>
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/for-camps/songs"
            className="inline-flex items-center gap-2 text-sm text-[#B22234] hover:text-[#8e1c29] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к списку песен
          </Link>
        </div>
      </div>
    </div>
  )
}
