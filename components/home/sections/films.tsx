"use client"

import { useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { Play } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"
import { Reveal } from "@/components/home/motion/reveal"
import { cn } from "@/lib/utils"
import { DisplayHeading, Eyebrow } from "./ui"

/** Click-to-load YouTube: a still and a play button until the visitor asks for it. */
function YouTubeFacade({ id, title, className }: { id: string; title: string; className?: string }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden bg-ink", className)}>
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={title}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget
              if (!img.src.includes("hqdefault")) img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
            }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-ink/25 transition-colors duration-700 group-hover:bg-ink/10" />
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 md:h-24 md:w-24">
            <Play className="ml-1 h-7 w-7 fill-current" strokeWidth={1} />
          </span>
        </button>
      )}
    </div>
  )
}

export default function Films() {
  const frameRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "center center"] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1])
  const radius = useTransform(scrollYProgress, [0, 1], [72, 28])

  return (
    <section className="overflow-hidden bg-paper px-4 py-28 text-ink sm:px-6 md:py-44 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow><TranslatedText text="Маранафа" /></Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <DisplayHeading className="mt-6">
              <TranslatedText text="Что такое Маранафа?" />
            </DisplayHeading>
          </Reveal>
        </div>

        <motion.div
          ref={frameRef}
          style={reduce ? { borderRadius: 28 } : { scale, borderRadius: radius }}
          className="mt-16 overflow-hidden will-change-transform"
        >
          <YouTubeFacade id="KO7VG_UkHUA" title="Что такое Маранафа" />
        </motion.div>

        <div className="mt-24 grid grid-cols-1 items-center gap-10 md:mt-36 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-7">
            <div className="rounded-[2rem] bg-ink/[0.04] p-2 ring-1 ring-ink/[0.06]">
              <YouTubeFacade
                id="4GvEYKvkRTw"
                title="Маранафа Встреча Друзей"
                className="rounded-[calc(2rem-0.5rem)]"
              />
            </div>
          </Reveal>
          <div className="md:col-span-5">
            <Reveal>
              <h3 className="text-[clamp(1.8rem,3vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                <TranslatedText text="Интервью с сотрудниками" />
              </h3>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-lg leading-relaxed text-ink/60">
                <TranslatedText text="В этом видео вы можете увидеть, как проходят встречи в нашем лагере, познакомиться с нашими сотрудниками и узнать больше о духе и атмосфере Маранафы." />
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
