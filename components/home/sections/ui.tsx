import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

/** Serif italic eyebrow with a short hairline — precedes every section title. */
export function Eyebrow({ children, tone = "dark", className }: { children: ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-serif text-xl italic leading-none md:text-2xl",
        tone === "dark" ? "text-crimson" : "text-gold-soft",
        className,
      )}
    >
      <span aria-hidden className={cn("h-px w-8", tone === "dark" ? "bg-crimson/60" : "bg-gold-soft/60")} />
      {children}
    </p>
  )
}

/** Big display heading: heavy grotesk, tight tracking, fluid size. */
export function DisplayHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: ReactNode
  className?: string
  as?: "h2" | "h3"
}) {
  return (
    <Tag
      className={cn(
        "font-sans text-[clamp(2.4rem,5.6vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.035em]",
        className,
      )}
    >
      {children}
    </Tag>
  )
}

type PillProps = {
  href: string
  children: ReactNode
  variant?: "crimson" | "gold" | "ghost" | "ink"
  external?: boolean
  className?: string
}

const pillVariants = {
  crimson: "bg-crimson text-white hover:bg-crimson-deep",
  gold: "bg-gold text-ink hover:bg-gold-soft",
  ink: "bg-ink text-paper hover:bg-ink/85",
  ghost: "bg-transparent text-ink ring-1 ring-inset ring-ink/15 hover:ring-ink/40",
}

const pillIcon = {
  crimson: "bg-white/15",
  gold: "bg-ink/10",
  ink: "bg-white/10",
  ghost: "bg-ink/5",
}

/** Pill CTA with the arrow nested in its own circle ("button-in-button"). */
export function PillLink({ href, children, variant = "crimson", external, className }: PillProps) {
  const classes = cn(
    "group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[15px] font-medium",
    "transition-[background-color,box-shadow,transform] duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]",
    pillVariants[variant],
    className,
  )
  const inner = (
    <>
      <span>{children}</span>
      <span
        aria-hidden
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]",
          "group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-105",
          pillIcon[variant],
        )}
      >
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
      </span>
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  )
}

/** Strips emoji so copy stays typographic (the translation keys keep them). */
export const stripEmoji = (s: string) => s.replace(/\p{Extended_Pictographic}/gu, "").replace(/\s+$/, "")
