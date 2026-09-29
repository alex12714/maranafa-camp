import Image from "next/image"
import { TranslatedText } from "@/components/translated-text"
import { Parallax } from "@/components/home/motion/parallax"
import { Reveal } from "@/components/home/motion/reveal"
import { cn } from "@/lib/utils"
import { DisplayHeading, Eyebrow, PillLink } from "./ui"

const features = [
  {
    title: "Программа",
    text: "Каждый год мы готовим отдельную легенду и прорабатываем все до мелочей. Мы вкладываем всё самое лучшее во время этой недели.",
    image: "/images/events/maijas-grafs.jpg",
    span: "md:col-span-12",
    aspect: "aspect-[4/3] md:aspect-[21/9]",
  },
  {
    title: "Природа",
    text: "Специально оборудованная база для отдыха сделает отдых детей незабываемым и очень активным.",
    image: "/images/features/nature.webp",
    span: "md:col-span-6",
    aspect: "aspect-[4/3]",
  },
  {
    title: "Очень вкусная еда",
    text: "Отдельная команда сделает что-то, от чего дети будут в восторге. Секрет прост - это домашняя еда на природе.",
    image: "/images/features/tasty-food.webp",
    span: "md:col-span-6",
    aspect: "aspect-[4/3]",
  },
]

/** Dark bento: "what happens at camp", three photographs with inner parallax. */
export default function CampLife() {
  return (
    <section className="bg-ink px-4 py-28 text-paper sm:px-6 md:py-44 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <Eyebrow tone="light"><TranslatedText text="Маранафа" /></Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <DisplayHeading className="mt-6 max-w-3xl">
                <TranslatedText text="Что будет в лагере?" />
              </DisplayHeading>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <PillLink href="/camp" variant="gold">
              <TranslatedText text="УЗНАТЬ БОЛЬШЕ" />
            </PillLink>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08} className={cn("group", f.span)}>
              <article className="flex h-full flex-col rounded-[2rem] bg-white/[0.04] p-2 ring-1 ring-white/10 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] md:group-hover:-translate-y-1.5">
                <Parallax
                  distance={90}
                  scale={1.2}
                  className={cn("relative overflow-hidden rounded-[calc(2rem-0.5rem)]", f.aspect)}
                >
                  <Image
                    src={f.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover transition-transform duration-[1.4s] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </Parallax>
                <div className="px-4 pb-5 pt-6 md:px-6">
                  <h3 className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
                    <TranslatedText text={f.title} />
                  </h3>
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-paper/60 md:text-base">
                    <TranslatedText text={f.text} />
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
