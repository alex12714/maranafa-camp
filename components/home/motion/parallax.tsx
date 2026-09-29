"use client"

import { useRef, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

type ParallaxProps = {
  children: ReactNode
  className?: string
  /** Total vertical travel in px across the element's pass through the viewport. */
  distance?: number
  /** Extra scale so the moving layer never reveals its edges inside a clipped frame. */
  scale?: number
}

/**
 * Moves its content against the scroll direction while the wrapper crosses the
 * viewport. Wrap an image inside an `overflow-hidden` frame for inner parallax.
 */
export function Parallax({ children, className, distance = 120, scale = 1 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [-distance / 2, distance / 2])

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full w-full will-change-transform"
        style={reduce ? { scale } : { y, scale }}
      >
        {children}
      </motion.div>
    </div>
  )
}
