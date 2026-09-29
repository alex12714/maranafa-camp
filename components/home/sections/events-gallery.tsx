"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"
import { Reveal } from "@/components/home/motion/reveal"
import { events, type EventItem } from "./events-data"
import { DisplayHeading, Eyebrow, PillLink } from "./ui"

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

function useDaysUntil(eventDate: string) {
  const [days, setDays] = useState<number | null>(null)
  useEffect(() => {
    const target = new Date(eventDate + "T00:00:00")
    setDays(Math.ceil((target.getTime() - Date.now()) / 86_400_000))
  }, [eventDate])
  return days
}

function DaysBadge({ eventDate }: { eventDate: string }) {
  const days = useDaysUntil(eventDate)
  if (days === null || days < 0) return null
  return (
    <div className="absolute left-4 top-4 z-10 flex items-baseline gap-1.5 rounded-full bg-ink/70 px-3.5 py-1.5 text-paper backdrop-blur-md">
      <span className="text-base font-semibold tabular-nums tracking-tight">{days}</span>
      <span className="text-[11px] uppercase tracking-[0.16em] text-paper/70">
        <TranslatedText text="дней" />
      </span>
    </div>
  )
}

function EventCard({ event, progress }: { event: EventItem; progress?: MotionValue<number> }) {
  const reduce = useReducedMotion()
  const fallback = useTransform(() => 0)
  const x = useTransform(progress ?? fallback, [0, 1], reduce || !progress ? [0, 0] : [36, -36])

  const media = (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(2rem-0.5rem)] bg-ink">
      {/* Blurred cover fill, so posters of any ratio sit on their own colours. */}
      <Image
        src={event.image}
        alt=""
        aria-hidden
        fill
        sizes="40vw"
        className="scale-125 object-cover opacity-60 blur-2xl"
      />
      <motion.div className="absolute inset-[-6%]" style={{ x }}>
        <Image
          src={event.image}
          alt={event.alt}
          fill
          sizes="(max-width: 1024px) 90vw, 520px"
          className="object-contain transition-transform duration-[1.2s] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
      </motion.div>
      <DaysBadge eventDate={event.eventDate} />
    </div>
  )

  return (
    <article className="group flex h-full w-full flex-col rounded-[2rem] bg-white/70 p-2 ring-1 ring-ink/[0.06]">
      {event.detailsPage ? (
        <Link href={event.detailsPage} aria-label={event.alt}>
          {media}
        </Link>
      ) : (
        media
      )}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-6 sm:px-5">
        <p className="font-serif text-lg italic text-crimson">
          <TranslatedText text={event.subtitle} />
        </p>
        <h3 className="mt-1 text-2xl font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
          <TranslatedText text={event.title} />
        </h3>
        <p className="mt-4 text-[15px] font-medium tabular-nums text-ink">
          <TranslatedText text={event.date} />
        </p>
        {event.details && (
          <p className="mt-1 text-[15px] leading-relaxed text-ink/60">
            <TranslatedText text={event.details} />
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
          {event.registrationUrl && (
            <PillLink href={event.registrationUrl} external={!event.registrationUrl.startsWith("/")}>
              <TranslatedText text="Регистрироваться" />
            </PillLink>
          )}
          {event.detailsPage && event.detailsPage !== event.registrationUrl && (
            <Link
              href={event.detailsPage}
              className="inline-flex items-center gap-1 px-2 text-[15px] font-medium text-ink/70 transition-colors hover:text-ink"
            >
              <TranslatedText text="Подробнее" />
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

function PastEvents({ past }: { past: EventItem[] }) {
  if (past.length === 0) return null
  return (
    <div className="flex h-full w-full flex-col justify-end">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/50">
        <TranslatedText text="Прошедшие события" />
      </p>
      <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
        {past.map((event) => {
          const row = (
            <>
              <span className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-ink/5">
                <Image src={event.image} alt="" fill sizes="48px" className="object-cover grayscale-[30%]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium text-ink">
                  <TranslatedText text={event.title} />
                </span>
                <span className="block text-sm text-ink/50">
                  <TranslatedText text={event.date} />
                </span>
              </span>
              {event.detailsPage && (
                <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-ink/40 transition-transform duration-500 group-hover:-translate-y-px group-hover:translate-x-0.5" strokeWidth={1.5} />
              )}
            </>
          )
          return (
            <li key={event.id}>
              {event.detailsPage ? (
                <Link href={event.detailsPage} className="group flex items-center gap-4 py-3">
                  {row}
                </Link>
              ) : (
                <div className="flex items-center gap-4 py-3">{row}</div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Intro({ count }: { count: number }) {
  return (
    <div className="flex h-full flex-col justify-end">
      <Eyebrow>
        <TranslatedText text="Регистрация открыта" />
      </Eyebrow>
      <DisplayHeading className="mt-6 text-[clamp(2.4rem,4.4vw,4.25rem)] text-ink">
        <TranslatedText text="Предстоящие события – регистрируйтесь сейчас!" />
      </DisplayHeading>
      <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-ink/40 tabular-nums">
        {String(count).padStart(2, "0")}
      </p>
    </div>
  )
}

export default function EventsGallery() {
  const [now, setNow] = useState<number | null>(null)
  const [desktop, setDesktop] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    setNow(Date.now())
    const mq = window.matchMedia("(min-width: 1024px)")
    const update = () => setDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const isPast = (e: EventItem) =>
    now !== null && new Date((e.endDate || e.eventDate) + "T23:59:59").getTime() < now

  const upcoming = events.filter((e) => !isPast(e)).sort((a, b) => a.eventDate.localeCompare(b.eventDate))
  const past = events.filter(isPast).sort((a, b) => b.eventDate.localeCompare(a.eventDate))

  const pinned = desktop && !reduce

  return (
    <section id="events" className="relative bg-paper text-ink">
      {pinned ? (
        <PinnedTrack upcoming={upcoming} past={past} />
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal>
            <Intro count={upcoming.length} />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {upcoming.map((event, i) => (
              <Reveal key={event.id} delay={i * 0.06}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
          <div className="mt-20">
            <PastEvents past={past} />
          </div>
        </div>
      )}
    </section>
  )
}

/** Desktop: vertical scroll drives a horizontal track inside a sticky viewport. */
function PinnedTrack({ upcoming, past }: { upcoming: EventItem[]; past: EventItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useIsoLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [upcoming.length, past.length])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const bar = useTransform(scrollYProgress, [0, 1], [0.04, 1])

  return (
    <div ref={sectionRef} style={{ height: `calc(100dvh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden pt-16">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-stretch gap-8 pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-[12vw] will-change-transform"
        >
          <div className="w-[34rem] flex-shrink-0 pb-6">
            <Intro count={upcoming.length} />
          </div>
          {upcoming.map((event) => (
            <div key={event.id} className="w-[min(26rem,34vw,calc((100dvh-30rem)*0.8))] flex-shrink-0">
              <EventCard event={event} progress={scrollYProgress} />
            </div>
          ))}
          {past.length > 0 && (
            <div className="w-[26rem] flex-shrink-0 pb-4">
              <PastEvents past={past} />
            </div>
          )}
        </motion.div>
        <div className="mx-auto mt-8 h-px w-[min(80rem,calc(100vw-4rem))] bg-ink/10">
          <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-ink/60" />
        </div>
      </div>
    </div>
  )
}
