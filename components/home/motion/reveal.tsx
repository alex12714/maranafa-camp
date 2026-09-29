"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"
import { EASE_OUT } from "./ease"

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: "div" | "li" | "span"
}

/** Heavy fade-up with a touch of blur as the element enters the viewport. */
export function Reveal({ children, className, delay = 0, y = 48, as = "div" }: RevealProps) {
  const reduce = useReducedMotion()
  const Tag = motion[as]

  if (reduce) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease: EASE_OUT, delay }}
    >
      {children}
    </Tag>
  )
}

/** Delay for the n-th item in a staggered group. */
export const stagger = (index: number, step = 0.08, base = 0) => base + index * step
