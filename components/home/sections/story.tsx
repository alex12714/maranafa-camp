import Image from "next/image"
import { TranslatedText } from "@/components/translated-text"
import { Parallax } from "@/components/home/motion/parallax"
import { Reveal } from "@/components/home/motion/reveal"
import { DisplayHeading, Eyebrow } from "./ui"

const benefits = [
  "Духовное развитие и укрепление веры",
  "Новые друзья и социальные навыки",
  "Активный отдых на природе",
  "Творческое развитие",
  "Изучение Библии в интересной форме",
  "Здоровое питание",
  "Безопасная и дружелюбная среда",
  "Опытные наставники",
]

/** Editorial split: sticky parallax photograph beside a numbered list of benefits. */
export default function Story() {
  return (
    <section className="bg-paper px-4 pb-28 pt-8 text-ink sm:px-6 md:pb-44 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-[2rem] bg-ink/[0.04] p-2 ring-1 ring-ink/[0.06]">
              <Parallax
                distance={140}
                scale={1.18}
                className="relative aspect-[4/5] overflow-hidden rounded-[calc(2rem-0.5rem)] lg:aspect-[5/6]"
              >
                <Image
                  src="/hero/golden-hour.webp"
                  alt="Маранафа"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[30%_50%]"
                />
              </Parallax>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:pt-10">
          <Reveal>
            <Eyebrow>
              <TranslatedText text="Что такое Маранафа?" />
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <DisplayHeading className="mt-6">
              <TranslatedText text="Преимущества нашего лагеря" />
            </DisplayHeading>
          </Reveal>

          <ol className="mt-14 border-t border-ink/10">
            {benefits.map((benefit, i) => (
              <Reveal as="li" key={benefit} delay={i * 0.04} y={24}>
                <div className="group flex items-baseline gap-6 border-b border-ink/10 py-6 md:py-7">
                  <span className="w-8 flex-shrink-0 font-serif text-xl italic tabular-nums text-crimson/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[clamp(1.15rem,1.8vw,1.6rem)] font-medium leading-snug tracking-[-0.015em] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5">
                    <TranslatedText text={benefit} />
                  </span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
