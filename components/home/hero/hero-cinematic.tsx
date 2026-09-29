"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { TranslatedText } from "@/components/translated-text"

const EmberField = dynamic(() => import("./ember-field"), { ssr: false })

// The Seedance clip: painted lettering drifts out of frame around the middle,
// then the scene settles into golden hour. The headline takes over from there.
const REVEAL_AT = 0.6
const EASE = [0.16, 1, 0.3, 1] as const

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

export default function HeroCinematic() {
  const prefersReduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [src, setSrc] = useState<string | null>(null)
  const [particleCount, setParticleCount] = useState(600)
  const [videoReady, setVideoReady] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [inView, setInView] = useState(true)

  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const fadeRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })

  const still = mounted && prefersReduced === true

  useEffect(() => {
    setMounted(true)
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const small = window.innerWidth < 900 || conn?.saveData === true
    setSrc(small ? "/hero/hero-scrub-854.mp4" : "/hero/hero-scrub-1280.mp4")
    setParticleCount(small ? 200 : 600)
  }, [])

  // Pause the WebGL loop when the hero is off-screen or the tab is hidden.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let visible = true
    let onScreen = true
    const update = () => setInView(visible && onScreen)
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      update()
    })
    io.observe(el)
    const onVis = () => {
      visible = document.visibilityState === "visible"
      update()
    }
    document.addEventListener("visibilitychange", onVis)
    return () => {
      io.disconnect()
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [])

  // iOS only allows seeking a video after it has been played once.
  useEffect(() => {
    const video = videoRef.current
    if (!video || still) return
    const unlock = () => {
      video
        .play()
        .then(() => video.pause())
        .catch(() => {})
    }
    const onMeta = () => unlock()
    const onReady = () => setVideoReady(true)
    video.addEventListener("loadedmetadata", onMeta)
    video.addEventListener("loadeddata", onReady)
    window.addEventListener("touchstart", unlock, { once: true, passive: true })
    if (video.readyState >= 2) setVideoReady(true)
    return () => {
      video.removeEventListener("loadedmetadata", onMeta)
      video.removeEventListener("loadeddata", onReady)
      window.removeEventListener("touchstart", unlock)
    }
  }, [src, still])

  useEffect(() => {
    if (still) return
    const onPointer = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointerRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener("pointermove", onPointer, { passive: true })
    return () => window.removeEventListener("pointermove", onPointer)
  }, [still])

  // Scroll → progress → video time, with a lerp so scrubbing feels weighted.
  useEffect(() => {
    if (still) return
    let raf = 0
    let smooth = 0
    let px = 0
    let py = 0
    let wasRevealed = false

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const travel = section.offsetHeight - window.innerHeight
      const target = travel > 0 ? clamp01(-rect.top / travel) : 0
      // Skip work while the hero is well out of view.
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return

      smooth += (target - smooth) * 0.12
      if (Math.abs(target - smooth) < 0.0005) smooth = target
      progressRef.current = smooth

      const video = videoRef.current
      if (video && video.duration && !video.seeking) {
        const t = smooth * (video.duration - 0.05)
        if (Math.abs(video.currentTime - t) > 1 / 48) video.currentTime = t
      }

      px += (pointerRef.current.x - px) * 0.06
      py += (pointerRef.current.y - py) * 0.06
      if (mediaRef.current) {
        const scale = 1.06 - smooth * 0.045
        // Never shift further than the overscan, or the stage edge shows.
        const maxX = Math.min(10, ((scale - 1) * window.innerWidth) / 2 - 1)
        const maxY = Math.min(8, ((scale - 1) * window.innerHeight) / 2 - 1)
        mediaRef.current.style.transform = `translate3d(${(-px * maxX).toFixed(2)}px, ${(py * maxY).toFixed(2)}px, 0) scale(${scale.toFixed(4)})`
      }
      if (cueRef.current) cueRef.current.style.opacity = String(clamp01(1 - smooth * 6))
      if (eyebrowRef.current) eyebrowRef.current.style.opacity = String(clamp01(1 - smooth * 4))
      if (scrimRef.current) scrimRef.current.style.opacity = String(clamp01((smooth - 0.4) / 0.25))
      if (fadeRef.current) fadeRef.current.style.opacity = String(clamp01((smooth - 0.85) / 0.15))

      const shouldReveal = smooth > REVEAL_AT
      if (shouldReveal !== wasRevealed) {
        wasRevealed = shouldReveal
        setRevealed(shouldReveal)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [still])

  if (still) {
    return (
      <section id="top" className="relative h-[100svh] overflow-hidden bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/golden-hour.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-ink/85 via-ink/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-ink/80 to-transparent" />
        <Headline />
        <div className="absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-b from-transparent to-paper" />
      </section>
    )
  }

  return (
    <section id="top" ref={sectionRef} className="relative h-[300vh] bg-ink">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div ref={mediaRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.06)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/hero-start.webp"
            alt="Маранафа — христианский лагерь"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: videoReady ? 0 : 1 }}
            fetchPriority="high"
          />
          {src && (
            <video
              ref={videoRef}
              src={src}
              poster="/hero/hero-start.webp"
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>

        {/* Legibility scrim: deepens as the headline arrives. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/60 to-transparent" />
        <div ref={scrimRef} className="pointer-events-none absolute inset-0" style={{ opacity: 0 }}>
          <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-ink/85 via-ink/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-ink/80 to-transparent" />
        </div>

        {mounted && (
          <EmberField progressRef={progressRef} pointerRef={pointerRef} active={inView} count={particleCount} />
        )}

        <div
          ref={eyebrowRef}
          className="pointer-events-none absolute inset-x-0 top-24 text-center font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-paper/80 sm:top-28 sm:text-xs"
        >
          <TranslatedText text="Лагерь Маранафа, Латвия" />
        </div>

        <AnimatePresence>{revealed && <Headline animated />}</AnimatePresence>

        <div
          ref={cueRef}
          className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-3 text-paper/80"
        >
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.32em]">
            <TranslatedText text="Листайте" />
          </span>
          <span className="relative block h-10 w-px overflow-hidden bg-paper/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[heroCue_1.8s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-paper" />
          </span>
        </div>

        <div
          ref={fadeRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-b from-transparent to-paper"
          style={{ opacity: 0 }}
        />
      </div>
      <style>{`@keyframes heroCue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  )
}

function Headline({ animated = false }: { animated?: boolean }) {
  const item = (delay: number) =>
    animated
      ? {
          initial: { opacity: 0, y: 32, filter: "blur(12px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          exit: { opacity: 0, y: -16, filter: "blur(8px)", transition: { duration: 0.35 } },
          transition: { duration: 1.1, ease: EASE, delay },
        }
      : {}

  return (
    <div className="absolute inset-0 flex flex-col items-center px-4 pt-[17svh] text-center sm:px-6 sm:pt-[15svh]">
      <motion.h1
        {...item(0)}
        className="bg-gradient-to-b from-paper via-gold-soft to-gold bg-clip-text pb-[0.08em] font-sans font-semibold leading-[0.9] tracking-[-0.04em] text-transparent drop-shadow-[0_8px_40px_rgba(11,10,9,0.45)]"
        style={{ fontSize: "clamp(4rem, 13vw, 12rem)" }}
      >
        <TranslatedText text="Маранафа" />
      </motion.h1>
      <motion.p
        {...item(0.12)}
        className="mt-3 max-w-2xl font-serif text-2xl italic leading-snug text-paper sm:mt-4 sm:text-3xl lg:text-[2.5rem] [text-shadow:0_2px_24px_rgba(11,10,9,0.6)]"
      >
        <TranslatedText text="Христианские мероприятия для детей и молодёжи" />
      </motion.p>
      <motion.div
        {...item(0.24)}
        className="absolute inset-x-0 bottom-[16svh] flex flex-col items-center gap-3 px-4 sm:bottom-[14svh] sm:flex-row sm:justify-center sm:gap-4"
      >
        <a
          href="#events"
          className="inline-flex h-12 items-center justify-center rounded-full bg-paper px-7 font-sans text-[15px] font-medium text-ink transition-[transform,background-color] duration-300 hover:bg-gold-soft active:scale-[0.97]"
        >
          <TranslatedText text="Ближайшие события" />
        </a>
        <Link
          href="/camp"
          className="inline-flex h-12 items-center justify-center rounded-full border border-paper/40 px-7 font-sans text-[15px] font-medium text-paper backdrop-blur-md transition-[transform,background-color,border-color] duration-300 hover:border-paper/70 hover:bg-paper/10 active:scale-[0.97]"
        >
          <TranslatedText text="О лагере" /> <span aria-hidden="true" className="ml-2">→</span>
        </Link>
      </motion.div>
    </div>
  )
}
