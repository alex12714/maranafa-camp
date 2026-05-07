"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Clock, Users, Package, User, ShieldCheck, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

interface GameDetail {
  id: string
  name: string
  shortDescription: string | null
  longDescription: string | null
  types: string[]
  rating: number | null
  ageGroups: string[]
  image: string | null
  durationMinutes: number | null
  difficulty: string | null
  orgDifficulty: string | null
  minParticipants: number | null
  maxParticipants: number | null
  inventory: string | null
  traumaRisk: number | null
  staffCount: number | null
}

const difficultyStyle: Record<string, string> = {
  Простая: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Средняя: "text-amber-700 bg-amber-50 border-amber-200",
  Сложная: "text-red-700 bg-red-50 border-red-200",
}

function RichText({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim())
  return (
    <div className="space-y-3">
      {paragraphs.map((para, pi) => {
        const lines = para.split("\n").filter((l) => l.trim())
        return (
          <div key={pi} className="space-y-1">
            {lines.map((line, li) => {
              const trimmed = line.replace(/^\s+/, "")
              const parts = trimmed.split(/\*\*([^*]+)\*\*/)
              return (
                <p key={li} className="text-gray-700 leading-relaxed">
                  {parts.map((part, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="font-semibold text-gray-900">
                        {part}
                      </strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </p>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function MetaItem({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn("flex items-start gap-3 p-4 rounded-xl border bg-white", className)}>
      <div className="w-8 h-8 rounded-lg bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-[#B22234]" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

function traumaColor(value: number) {
  if (value <= 2) return "#22c55e"
  if (value <= 4) return "#eab308"
  if (value <= 6) return "#f97316"
  return "#ef4444"
}

function TraumaRiskBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, (value / 10) * 100))
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-white">
      <div className="w-8 h-8 rounded-lg bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <ShieldCheck className="w-4 h-4 text-[#B22234]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Травмоопасность</p>
        <div className="flex items-center gap-2 mt-1.5">
          <div
            className="relative flex-1 h-2 rounded-full"
            style={{ background: "linear-gradient(to right, #22c55e 0%, #eab308 40%, #f97316 70%, #ef4444 100%)" }}
          >
            <div
              className="absolute top-1/2 w-3 h-3 rounded-full bg-white border-2 shadow-sm"
              style={{ left: `${pct}%`, transform: "translate(-50%, -50%)", borderColor: traumaColor(value) }}
            />
          </div>
          <span className="text-sm font-bold tabular-nums" style={{ color: traumaColor(value) }}>
            {value}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [game, setGame] = useState<GameDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/games/${id}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then((d) => {
        if (d) { setGame(d.game); setLoading(false) }
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-72 bg-gray-200 w-full" />
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !game) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-2xl">🎮</p>
        <p className="text-gray-500 font-medium">Игра не найдена</p>
        <Link href="/for-camps/games" className="text-sm text-[#B22234] hover:underline">
          Вернуться к играм
        </Link>
      </div>
    )
  }

  const participants =
    game.minParticipants !== null || game.maxParticipants !== null
      ? game.minParticipants === game.maxParticipants
        ? String(game.minParticipants)
        : `${game.minParticipants ?? "?"} – ${game.maxParticipants ?? "∞"} чел.`
      : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero image */}
      <div className="relative w-full bg-gray-900" style={{ aspectRatio: "16/7", maxHeight: 480 }}>
        {game.image ? (
          <Image
            src={game.image}
            alt={game.name}
            fill
            className="object-cover opacity-90"
            unoptimized
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-8xl bg-gray-800">
            🎮
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/for-camps/games"
            className="inline-flex items-center gap-1.5 text-white/90 hover:text-white bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Игры
          </Link>
        </div>

        {/* Rating badge */}
        {game.rating !== null && (
          <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow">
            <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
            <span className="text-sm font-bold text-gray-900">{game.rating}</span>
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="max-w-3xl mx-auto">
            {game.types.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {game.types.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-white bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              {game.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {game.durationMinutes !== null && (
            <MetaItem icon={Clock} label="Длительность" value={`${game.durationMinutes} мин`} />
          )}
          {participants && (
            <MetaItem icon={Users} label="Участники" value={participants} />
          )}
          {game.ageGroups.length > 0 && (
            <MetaItem icon={User} label="Возраст" value={game.ageGroups.join(", ")} />
          )}
          {game.difficulty && (
            <MetaItem icon={Layers} label="Сложность" value={game.difficulty} />
          )}
          {game.orgDifficulty && (
            <MetaItem icon={Layers} label="Орг. сложность" value={game.orgDifficulty} />
          )}
          {game.staffCount !== null && game.staffCount > 0 && (
            <MetaItem icon={User} label="Ведущих" value={`${game.staffCount} чел.`} />
          )}
          {game.traumaRisk !== null && (
            <TraumaRiskBar value={game.traumaRisk} />
          )}
        </div>

        {/* Short description */}
        {game.shortDescription && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Краткое описание</h2>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-gray-700 leading-relaxed">{game.shortDescription}</p>
            </div>
          </section>
        )}

        {/* Long description */}
        {game.longDescription && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Описание</h2>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <RichText text={game.longDescription} />
            </div>
          </section>
        )}

        {/* Inventory */}
        {game.inventory && game.inventory.trim() && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Инвентарь</h2>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start gap-3">
              <Package className="w-5 h-5 text-[#B22234] flex-shrink-0 mt-0.5" />
              <p className="text-gray-700 leading-relaxed">{game.inventory.trim()}</p>
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="pt-2">
          <Link
            href="/for-camps/games"
            className="inline-flex items-center gap-2 text-sm text-[#B22234] hover:text-[#8e1c29] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к списку игр
          </Link>
        </div>
      </div>
    </div>
  )
}
