import { TranslatedText } from "@/components/translated-text"
import { Reveal } from "@/components/home/motion/reveal"
import { PillLink } from "./ui"

/** Closing call to action on ink, with a whisper of the brand's gold. */
export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink px-4 py-32 text-paper sm:px-6 md:py-52 lg:px-8">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-[0.18em] select-none text-center font-serif text-[clamp(7rem,24vw,22rem)] italic leading-none text-white/[0.04]"
      >
        Maranafa
      </span>
      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="font-serif text-2xl italic text-gold-soft md:text-3xl">
            <TranslatedText text="Маранафа" />
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-8 text-[clamp(2.4rem,6vw,5.5rem)] font-semibold leading-[1] tracking-[-0.035em]">
            <TranslatedText text="Присоединяйтесь до 1 июня, чтобы получить скидку в 50 евро" />
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-8 max-w-xl text-lg text-paper/55">
            <TranslatedText text="После 1го июня, скидка больше не будет доступна" />
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-12 flex justify-center">
            <PillLink href="/camp/register" variant="gold" className="text-base">
              <TranslatedText text="Поехали в лагерь" />
            </PillLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
