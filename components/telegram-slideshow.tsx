"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  ImageIcon,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { MediaDay, MediaItem } from "@/lib/telegram"

const PHOTO_MS = 5000
const CONTROLS_IDLE_MS = 3000

function localeOf(lang: string): string {
  return lang === "ru" ? "ru-RU" : lang === "lv" ? "lv-LV" : lang === "uk" ? "uk-UA" : "en-GB"
}

function formatDay(date: string, lang: string): string {
  const d = new Date(`${date}T12:00:00Z`)
  if (isNaN(d.getTime())) return date
  return d.toLocaleDateString(localeOf(lang), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

function formatWeekday(date: string, lang: string): string {
  const d = new Date(`${date}T12:00:00Z`)
  if (isNaN(d.getTime())) return ""
  return d.toLocaleDateString(localeOf(lang), { weekday: "long", timeZone: "UTC" })
}

function monthKey(date: string, lang: string): string {
  const d = new Date(`${date}T12:00:00Z`)
  if (isNaN(d.getTime())) return ""
  return d.toLocaleDateString(localeOf(lang), { month: "long", year: "numeric", timeZone: "UTC" })
}

// ─── Date picker ──────────────────────────────────────────────────────────────
function DatePicker({
  onPick,
  onClose,
  t,
  language,
}: {
  onPick: (day: MediaDay) => void
  onClose: () => void
  t: (k: string) => string
  language: string
}) {
  const [days, setDays] = useState<MediaDay[]>([])
  const [jumpDate, setJumpDate] = useState("")
  const [cursor, setCursor] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [failed, setFailed] = useState(false)

  const load = useCallback(async (before?: number | null) => {
    const url = before ? `/api/telegram-media/days?before=${before}` : "/api/telegram-media/days"
    const res = await fetch(url)
    if (!res.ok) throw new Error(`days ${res.status}`)
    return (await res.json()) as { days: MediaDay[]; nextBefore: number | null }
  }, [])

  useEffect(() => {
    let active = true
    load()
      .then((data) => {
        if (!active) return
        setDays(data.days ?? [])
        setCursor(data.nextBefore ?? null)
      })
      .catch(() => active && setFailed(true))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [load])

  const loadMore = async () => {
    if (!cursor || loadingMore) return
    setLoadingMore(true)
    try {
      const data = await load(cursor)
      setDays((prev) => {
        // The newest day of an older batch usually continues the last day we
        // already have — merge rather than drop, so counts stay honest.
        const merged = [...prev]
        for (const day of data.days ?? []) {
          const at = merged.findIndex((d) => d.date === day.date)
          if (at === -1) {
            merged.push(day)
            continue
          }
          const existing = merged[at]
          merged[at] = {
            ...existing,
            photoCount: existing.photoCount + day.photoCount,
            videoCount: existing.videoCount + day.videoCount,
            coverUrl: existing.coverUrl ?? day.coverUrl,
            latestId: Math.max(existing.latestId, day.latestId),
            earliestId: Math.min(existing.earliestId, day.earliestId),
            // The newer batch is authoritative: it either completed this day
            // or is itself the one now cut short.
            partial: day.partial,
          }
        }
        return merged
      })
      setCursor(data.nextBefore ?? null)
    } catch {
      setCursor(null)
    } finally {
      setLoadingMore(false)
    }
  }

  // Group consecutive days under their month heading.
  const grouped = useMemo(() => {
    const out: { month: string; days: MediaDay[] }[] = []
    for (const day of days) {
      const key = monthKey(day.date, language)
      const last = out[out.length - 1]
      if (last && last.month === key) last.days.push(day)
      else out.push({ month: key, days: [day] })
    }
    return out
  }, [days, language])

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{t("Выберите дату")}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{t("Фото и видео из Telegram по дням")}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={t("Закрыть")}
            className="p-2 -m-2 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Jump straight to any date, including ones older than the list below */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
          <CalendarDays className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="date"
            value={jumpDate}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setJumpDate(e.target.value)}
            className="flex-1 min-w-0 text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0088cc]"
          />
          <button
            disabled={!jumpDate}
            onClick={() =>
              onPick({ date: jumpDate, photoCount: 0, videoCount: 0, latestId: 0, earliestId: 0 })
            }
            className="px-4 py-1.5 rounded-lg bg-[#0088cc] text-white text-sm font-medium disabled:opacity-40 hover:bg-[#006da3] transition-colors flex-shrink-0"
          >
            {t("Смотреть")}
          </button>
        </div>

        <div className="overflow-y-auto p-3 sm:p-4 flex-1">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : failed || days.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-10">{t("Дат пока нет")}</p>
          ) : (
            grouped.map((group) => (
              <div key={group.month} className="mb-4 last:mb-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-2 mb-2">
                  {group.month}
                </p>
                <div className="space-y-2">
                  {group.days.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => onPick(day)}
                      className="w-full flex items-center gap-3 p-2 rounded-xl border border-gray-100 hover:border-[#0088cc] hover:bg-[#0088cc]/5 transition-colors text-left group"
                    >
                      {day.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={day.coverUrl}
                          alt=""
                          loading="lazy"
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{formatDay(day.date, language)}</p>
                        <p className="text-xs text-gray-400 capitalize">{formatWeekday(day.date, language)}</p>
                        <p className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          {day.photoCount > 0 && (
                            <span className="flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" /> {day.photoCount}
                              {day.partial && "+"}
                            </span>
                          )}
                          {day.videoCount > 0 && (
                            <span className="flex items-center gap-1">
                              <Film className="w-3 h-3" /> {day.videoCount}
                              {day.partial && "+"}
                            </span>
                          )}
                        </p>
                      </div>
                      <Play className="w-5 h-5 text-gray-300 group-hover:text-[#0088cc] transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}

          {cursor && !loading && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full mt-3 py-2.5 text-sm font-medium text-[#0088cc] hover:bg-[#0088cc]/5 rounded-xl transition-colors disabled:opacity-50"
            >
              {loadingMore ? t("Загрузка…") : t("Загрузить более ранние даты")}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Fullscreen player ────────────────────────────────────────────────────────
function Player({
  day,
  onClose,
  onBack,
  t,
  language,
}: {
  day: MediaDay
  onClose: () => void
  onBack: () => void
  t: (k: string) => string
  language: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [progress, setProgress] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(true)

  const current = items[index]
  // Telegram refuses to transcode oversized videos ("Media is too big"). Those
  // arrive without an mp4, so they play as a still frame on the photo timer.
  const isPlayableVideo = current?.type === "video" && !current.unsupported && Boolean(current.url)

  // ── Load the day's media ────────────────────────────────────────────────────
  useEffect(() => {
    let active = true
    const params = new URLSearchParams({ date: day.date })
    if (day.latestId) params.set("before", String(day.latestId + 1))
    fetch(`/api/telegram-media?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error(`media ${r.status}`)
        return r.json()
      })
      .then((data: { items: MediaItem[] }) => {
        if (!active) return
        const list = data.items ?? []
        setItems(list)
        if (list.length === 0) setFailed(true)
      })
      .catch(() => active && setFailed(true))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [day.date, day.latestId])

  // ── Enter fullscreen (best effort — iOS Safari has no element fullscreen) ────
  useEffect(() => {
    const el = containerRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null
    if (!el) return
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {})
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prevOverflow
      const doc = document as Document & { webkitExitFullscreen?: () => void; webkitFullscreenElement?: Element }
      if (doc.fullscreenElement && doc.exitFullscreen) doc.exitFullscreen().catch(() => {})
      else if (doc.webkitFullscreenElement && doc.webkitExitFullscreen) doc.webkitExitFullscreen()
    }
  }, [])

  const goTo = useCallback(
    (next: number) => {
      setProgress(0)
      if (next < 0) {
        setIndex(0)
        return
      }
      if (next >= items.length) {
        setFinished(true)
        return
      }
      setIndex(next)
    },
    [items.length]
  )

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  const restart = () => {
    setFinished(false)
    setIndex(0)
    setProgress(0)
    setPaused(false)
  }

  // ── Advance timing: photos on a timer, videos on `ended` ─────────────────────
  useEffect(() => {
    if (!current || finished || paused) return
    if (isPlayableVideo) {
      // Progress tracked from the video element's own clock.
      let raf = 0
      const tick = () => {
        const v = videoRef.current
        if (v && v.duration > 0) setProgress(Math.min(1, v.currentTime / v.duration))
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(raf)
    }

    let raf = 0
    const start = performance.now() - progress * PHOTO_MS
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / PHOTO_MS)
      setProgress(p)
      if (p >= 1) next()
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // `progress` is intentionally read once at effect start to resume from a pause.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, finished, isPlayableVideo, next])

  // ── Video element lifecycle: autoplay, falling back to muted when blocked ────
  useEffect(() => {
    const v = videoRef.current
    if (!v || !isPlayableVideo) return
    v.muted = muted
    if (paused) {
      v.pause()
      return
    }
    v.play().catch(() => {
      // Autoplay with sound was refused — retry muted so the show goes on.
      v.muted = true
      setMuted(true)
      v.play().catch(() => next())
    })
  }, [index, paused, muted, isPlayableVideo, next])

  // ── Preload the next still so transitions do not flash ───────────────────────
  useEffect(() => {
    const upcoming = items[index + 1]
    if (!upcoming) return
    const src = upcoming.type === "photo" ? upcoming.url : upcoming.thumbUrl
    if (!src) return
    const img = new window.Image()
    img.src = src
  }, [index, items])

  // ── Keyboard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        next()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        prev()
      } else if (e.key === " ") {
        e.preventDefault()
        setPaused((p) => !p)
      } else if (e.key.toLowerCase() === "m") {
        setMuted((m) => !m)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [next, prev, onClose])

  // ── Auto-hide controls ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!controlsVisible || paused || finished) return
    const id = setTimeout(() => setControlsVisible(false), CONTROLS_IDLE_MS)
    return () => clearTimeout(id)
  }, [controlsVisible, paused, finished, index])

  const wake = () => setControlsVisible(true)

  // ── Swipe ───────────────────────────────────────────────────────────────────
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchStart.current
    if (!s) return
    const dx = e.changedTouches[0].clientX - s.x
    const dy = e.changedTouches[0].clientY - s.y
    touchStart.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? next() : prev()
    }
  }

  const showControls = controlsVisible || paused || finished

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[80] bg-black flex flex-col select-none"
      onMouseMove={wake}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Overall progress — one continuous bar, since a day can hold hundreds
          of items and per-item segments would collapse to nothing. */}
      {!loading && !failed && items.length > 0 && !finished && (
        <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-white/20">
          <div
            className="h-full bg-white/90"
            style={{ width: `${((index + progress) / items.length) * 100}%` }}
          />
        </div>
      )}

      {/* Top bar */}
      <div
        className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between gap-3 px-4 pt-6 pb-8 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">{t("Выберите дату")}</span>
        </button>
        <div className="text-center min-w-0">
          <p className="text-white text-sm font-semibold truncate">{formatDay(day.date, language)}</p>
          {items.length > 0 && !finished && (
            <p className="text-white/60 text-xs">
              {index + 1} / {items.length}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label={t("Закрыть")}
          className="text-white/90 hover:text-white p-1 -m-1"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Stage */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {loading && (
          <div className="flex flex-col items-center gap-3 text-white/70">
            <div className="w-10 h-10 border-2 border-white/25 border-t-white rounded-full animate-spin" />
            <p className="text-sm">{t("Загрузка…")}</p>
          </div>
        )}

        {!loading && failed && (
          <div className="text-center px-6">
            <p className="text-white/80 mb-4">{t("Нет медиа за эту дату")}</p>
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold"
            >
              {t("Выберите дату")}
            </button>
          </div>
        )}

        {!loading && !failed && finished && (
          <div className="text-center px-6">
            <p className="text-white text-xl font-semibold mb-1">{t("Слайдшоу завершено")}</p>
            <p className="text-white/60 text-sm mb-6">{formatDay(day.date, language)}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={restart}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold"
              >
                <RotateCcw className="w-4 h-4" /> {t("Начать заново")}
              </button>
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 text-white text-sm font-semibold"
              >
                {t("Выберите дату")}
              </button>
            </div>
          </div>
        )}

        {!loading && !failed && !finished && current && (
          <>
            {isPlayableVideo ? (
              <video
                ref={videoRef}
                key={current.id}
                src={current.url}
                poster={current.thumbUrl}
                className="max-w-full max-h-full object-contain"
                playsInline
                autoPlay
                onEnded={next}
                onError={next}
              />
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={current.id}
                  src={current.url || current.thumbUrl}
                  alt=""
                  className="max-w-full max-h-full object-contain"
                  onError={next}
                />
                {current.type === "video" && (
                  <a
                    href={current.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute z-10 bottom-24 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm"
                  >
                    <Film className="w-4 h-4" />
                    {t("Видео слишком большое — смотреть в Telegram")}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </>
            )}

            {/* Tap zones: sides step, centre toggles pause */}
            <button
              aria-label={t("Назад")}
              onClick={prev}
              className="absolute inset-y-0 left-0 w-1/4 cursor-w-resize focus:outline-none"
            />
            <button
              aria-label={paused ? t("Играть") : t("Пауза")}
              onClick={() => {
                wake()
                setPaused((p) => !p)
              }}
              className="absolute inset-y-0 left-1/4 w-1/2 focus:outline-none"
            />
            <button
              aria-label={t("Вперёд")}
              onClick={next}
              className="absolute inset-y-0 right-0 w-1/4 cursor-e-resize focus:outline-none"
            />

            {paused && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom bar */}
      {!loading && !failed && !finished && current && (
        <div
          className={`absolute bottom-0 left-0 right-0 z-20 px-4 pb-5 pt-10 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {current.text && (
            <p className="text-white/85 text-xs sm:text-sm text-center mb-3 line-clamp-2 max-w-3xl mx-auto">
              {current.text}
            </p>
          )}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={prev}
              aria-label={t("Назад")}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? t("Играть") : t("Пауза")}
              className="p-3 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
            >
              {paused ? <Play className="w-5 h-5 ml-0.5" /> : <Pause className="w-5 h-5" />}
            </button>
            <button
              onClick={next}
              aria-label={t("Вперёд")}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? t("Звук") : t("Без звука")}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-2"
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <a
              href={current.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("Открыть в Telegram")}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Entry point ──────────────────────────────────────────────────────────────
export default function TelegramSlideshow({ className = "" }: { className?: string }) {
  const { language, translations } = useLanguage()
  const t = (key: string) => translations[key] || key

  const [picking, setPicking] = useState(false)
  const [day, setDay] = useState<MediaDay | null>(null)

  return (
    <>
      <button
        onClick={() => setPicking(true)}
        className={`inline-flex items-center gap-2 bg-[#B22234] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#8e1c29] transition-colors ${className}`}
      >
        <Play className="w-3.5 h-3.5" />
        {t("Смотреть слайдшоу")}
      </button>

      {picking && (
        <DatePicker
          t={t}
          language={language}
          onClose={() => setPicking(false)}
          onPick={(d) => {
            setPicking(false)
            setDay(d)
          }}
        />
      )}

      {day && (
        <Player
          day={day}
          t={t}
          language={language}
          onClose={() => setDay(null)}
          onBack={() => {
            setDay(null)
            setPicking(true)
          }}
        />
      )}
    </>
  )
}
