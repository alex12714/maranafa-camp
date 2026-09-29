"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react"

type ScrollWordsProps = {
  text: string
  className?: string
}

/**
 * Words light up one by one (15% → 100% opacity) as the block scrolls
 * through the viewport — the "read along" effect from Apple product pages.
 */
export function ScrollWords({ text, className }: ScrollWordsProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.4"] })
  const words = text.split(/\s+/).filter(Boolean)

  if (reduce) {
    return <p className={className}>{text}</p>
  }

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return (
          <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        )
      })}
    </p>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <span aria-hidden className="relative inline-block whitespace-pre">
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </span>
  )
}
