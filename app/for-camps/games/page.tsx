"use client"

import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface Game {
  id: string
  name: string
  shortDescription: string | null
  types: string[]
  rating: number | null
  ageGroups: string[]
  image: string | null
  durationMinutes: number | null
  difficulty: string | null
  minParticipants: number | null
  maxParticipants: number | null
}

const ALL_AGES = ["6-12", "12-17", "17+"]

const difficultyStyle: Record<string, string> = {
  Простая: "text-emerald-700 bg-emerald-50",
  Средняя: "text-amber-700 bg-amber-50",
  Сложная: "text-red-700 bg-red-50",
}

function GameCard({ game }: { game: Game }) {
  const participants =
    game.minParticipants !== null || game.maxParticipants !== null
      ? game.minParticipants === game.maxParticipants
        ? String(game.minParticipants)
        : `${game.minParticipants ?? "?"} – ${game.maxParticipants ?? "∞"}`
      : null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
      {/* Cover image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {game.image ? (
          <Image
            src={game.image}
            alt={game.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl select-none">
            🎮
          </div>
        )}
        {game.rating !== null && (
          <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
            <span className="text-xs font-bold text-gray-800">{game.rating}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-gray-900 text-[15px] leading-snug">{game.name}</h3>

        {/* Type badges */}
        {game.types.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {game.types.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[11px] text-[#B22234] bg-[#B22234]/8 px-2 py-0.5 rounded-full leading-none font-medium"
              >
                {t}
              </span>
            ))}
            {game.types.length > 3 && (
              <span className="text-[11px] text-gray-400 px-1 leading-none self-center">
                +{game.types.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {game.shortDescription && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
            {game.shortDescription}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-auto pt-1 border-t border-gray-100">
          {game.durationMinutes !== null && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              {game.durationMinutes} мин
            </span>
          )}
          {participants && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Users className="w-3.5 h-3.5 flex-shrink-0" />
              {participants}
            </span>
          )}
          {game.difficulty && (
            <span
              className={cn(
                "text-[11px] px-2 py-0.5 rounded-full font-medium leading-none",
                difficultyStyle[game.difficulty] ?? "text-gray-600 bg-gray-100"
              )}
            >
              {game.difficulty}
            </span>
          )}
          {game.ageGroups.length > 0 && (
            <span className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full leading-none">
              {game.ageGroups.join(", ")}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-xs px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap",
        active
          ? "bg-[#B22234] text-white border-[#B22234]"
          : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
      )}
    >
      {label}
    </button>
  )
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"popular" | "all">("popular")
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set())
  const [activeAges, setActiveAges] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch("/api/games")
      .then((r) => r.json())
      .then((d) => {
        setGames(d.games ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const allTypes = useMemo(() => {
    const set = new Set<string>()
    games.forEach((g) => g.types.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [games])

  const filtered = useMemo(() => {
    let result = games.filter((g) => {
      if (activeTypes.size > 0 && !g.types.some((t) => activeTypes.has(t))) return false
      if (activeAges.size > 0 && !g.ageGroups.some((a) => activeAges.has(a))) return false
      return true
    })
    if (sortBy === "popular") {
      result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    }
    return result
  }, [games, activeTypes, activeAges, sortBy])

  const toggleType = (t: string) =>
    setActiveTypes((prev) => {
      const next = new Set(prev)
      next.has(t) ? next.delete(t) : next.add(t)
      return next
    })

  const toggleAge = (a: string) =>
    setActiveAges((prev) => {
      const next = new Set(prev)
      next.has(a) ? next.delete(a) : next.add(a)
      return next
    })

  const clearFilters = () => {
    setActiveTypes(new Set())
    setActiveAges(new Set())
    setSortBy("popular")
  }

  const hasFilters = activeTypes.size > 0 || activeAges.size > 0 || sortBy !== "popular"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#B22234] text-white pt-10 pb-14 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link
            href="/for-camps"
            className="inline-flex items-center gap-1.5 text-red-200 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Для лагерей
          </Link>
          <h1 className="text-4xl font-extrabold mb-2">Игры</h1>
          <p className="text-red-100 text-lg">
            Подборка игр для лагеря — фильтруй, выбирай, вдохновляйся
          </p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-3 space-y-2.5">
          {/* Top row: count + sort */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {loading ? "Загрузка..." : `${filtered.length} игр`}
              </span>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#B22234] hover:underline"
                >
                  Сбросить
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <FilterPill
                label="По популярности"
                active={sortBy === "popular"}
                onClick={() => setSortBy("popular")}
              />
              <FilterPill
                label="Все"
                active={sortBy === "all"}
                onClick={() => setSortBy("all")}
              />
            </div>
          </div>

          {/* Age filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-0.5">
              Возраст
            </span>
            {ALL_AGES.map((age) => (
              <FilterPill
                key={age}
                label={age}
                active={activeAges.has(age)}
                onClick={() => toggleAge(age)}
              />
            ))}
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-0.5">
              Тип
            </span>
            {allTypes.map((type) => (
              <FilterPill
                key={type}
                label={type}
                active={activeTypes.has(type)}
                onClick={() => toggleType(type)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Game grid */}
      <div className="container mx-auto max-w-6xl px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-2xl mb-2">🎮</p>
            <p className="text-lg font-medium text-gray-500">Игры не найдены</p>
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-[#B22234] hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
