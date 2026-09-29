"use client"

import { useLanguage } from "@/contexts/language-context"
import { ScrollWords } from "@/components/home/motion/scroll-words"
import { Reveal } from "@/components/home/motion/reveal"
import { Eyebrow } from "./ui"

const QUOTE = "Летний лагерь - это прекрасная возможность вашим детям радостно и полезно отдохнуть на природе."

export default function Manifesto() {
  const { translations = {} } = useLanguage()
  const quote = (translations[QUOTE] || QUOTE).replace(" - ", " — ")

  return (
    <section className="relative bg-paper px-4 py-28 text-ink sm:px-6 md:py-44 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow>Alex Podbrezsky</Eyebrow>
        </Reveal>
        <ScrollWords
          text={`“${quote}”`}
          className="mt-10 font-serif text-[clamp(2.2rem,5.4vw,5.2rem)] font-medium italic leading-[1.05] tracking-[-0.015em]"
        />
      </div>
    </section>
  )
}
