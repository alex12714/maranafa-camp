"use client"

import { useEffect, type ReactNode } from "react"
import Lenis from "lenis"

/**
 * Inertial smooth scrolling for the homepage. Lenis drives the native window
 * scroll, so `useScroll` and sticky positioning keep working unchanged.
 * Skipped entirely for people who prefer reduced motion.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({ lerp: 0.1, autoRaf: true, anchors: true })
    return () => lenis.destroy()
  }, [])

  return <>{children}</>
}
