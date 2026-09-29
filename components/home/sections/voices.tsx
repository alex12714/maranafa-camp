"use client"

import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { TranslatedText } from "@/components/translated-text"
import { Reveal } from "@/components/home/motion/reveal"
import { DisplayHeading, Eyebrow, stripEmoji } from "./ui"

const parentReviews = [
  {
    name: "Анна К.",
    role: "Мама Миши, 12 лет",
    content:
      "Мой сын вернулся из лагеря с таким восторгом! Он нашел новых друзей, научился многим полезным навыкам и каждый день рассказывает о своих приключениях. Спасибо команде Маранафа за заботу и внимание к детям!",
    avatar: "/diverse-woman-portrait.png",
  },
  {
    name: "Сергей П.",
    role: "Отец Кати, 10 лет",
    content:
      "Дочь была в восторге от программы лагеря. Особенно ей понравились творческие мастерские и вечерние мероприятия. Она уже спрашивает, когда снова поедет в Маранафу!",
    avatar: "/thoughtful-man.png",
  },
  {
    name: "Елена В.",
    role: "Мама Димы и Саши, 9 и 11 лет",
    content:
      "Отправила двоих детей и не пожалела! Вернулись счастливые, полные впечатлений. Очень ценю христианские ценности, которые прививают в лагере. Будем ездить каждый год!",
    avatar: "/woman-with-glasses.png",
  },
]

const testimonials = [
  { quote: "Очень довольны лагерем! 3 год подряд выбираем Маранафу!", author: "Снежанна" },
  {
    quote:
      "Очень здорово, что есть Замечательный Лагерь, где детей учат навыкам морали и ответственности!!! Это место, где обретают Друзей и Самого Главного Друга - ИИСУСА!!!",
    author: "Юлия",
  },
  {
    quote: "Маранафа Самый лучший лагерь! Уважаемые работники и вожатые лагеря! От всей души спасибо Вам за все!",
    author: "Карина",
  },
  { quote: "Супер марафон, а точнее сказать, лучший! Мой ребенок счастлив!", author: "Татьяна" },
  { quote: "Мы с Украины, в лагере Маранафа первый раз, восторг, большое спасибо всей команде!", author: "Ира" },
  {
    quote: "Спасибо за такое разностороннее развитие в лагере 'Маранафа'! Для сына этот лагерь был незабываемым!",
    author: "Ира Ю.",
  },
]

const screenshots = [1, 2, 3, 4].map((n) => ({
  src: `/images/reviews/review-${n}.webp`,
  alt: `Отзывы родителей в социальных сетях - часть ${n}`,
}))

type Tile =
  | { kind: "review"; data: (typeof parentReviews)[number] }
  | { kind: "quote"; data: (typeof testimonials)[number] }
  | { kind: "shot"; data: (typeof screenshots)[number] }

// Interleave long reviews, short quotes and social screenshots so the masonry breathes.
const tiles: Tile[] = [
  { kind: "review", data: parentReviews[0] },
  { kind: "quote", data: testimonials[0] },
  { kind: "shot", data: screenshots[0] },
  { kind: "quote", data: testimonials[1] },
  { kind: "review", data: parentReviews[1] },
  { kind: "shot", data: screenshots[1] },
  { kind: "quote", data: testimonials[2] },
  { kind: "quote", data: testimonials[3] },
  { kind: "review", data: parentReviews[2] },
  { kind: "shot", data: screenshots[2] },
  { kind: "quote", data: testimonials[4] },
  { kind: "shot", data: screenshots[3] },
  { kind: "quote", data: testimonials[5] },
]

function TileView({ tile }: { tile: Tile }) {
  if (tile.kind === "shot") {
    return (
      <figure className="rounded-[1.75rem] bg-ink/[0.04] p-1.5 ring-1 ring-ink/[0.06]">
        <Image
          src={tile.data.src}
          alt={tile.data.alt}
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="h-auto w-full rounded-[calc(1.75rem-0.375rem)]"
        />
      </figure>
    )
  }

  if (tile.kind === "review") {
    const r = tile.data
    return (
      <figure className="rounded-[1.75rem] bg-white p-7 ring-1 ring-ink/[0.06] md:p-8">
        <blockquote className="font-serif text-[1.45rem] italic leading-[1.3] text-ink">
          <TranslatedText text={r.content} />
        </blockquote>
        <figcaption className="mt-7 flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-full bg-ink/5">
            <Image src={r.avatar} alt={r.name} fill sizes="40px" className="object-cover" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-ink">
              <TranslatedText text={r.name} />
            </span>
            <span className="block text-sm text-ink/50">
              <TranslatedText text={r.role} />
            </span>
          </span>
        </figcaption>
      </figure>
    )
  }

  const q = tile.data
  return (
    <figure className="border-t border-ink/15 px-1 pb-4 pt-6">
      <span aria-hidden className="block font-serif text-5xl leading-none text-crimson">“</span>
      <blockquote className="mt-1 text-xl font-medium leading-snug tracking-[-0.015em] text-ink">
        <TranslatedText text={q.quote} />
      </blockquote>
      <figcaption className="mt-5 font-serif text-lg italic text-ink/55">
        <TranslatedText text={q.author} />
      </figcaption>
    </figure>
  )
}

export default function Voices() {
  const { translations = {} } = useLanguage()
  const t = (k: string) => translations[k] || k

  return (
    <section className="bg-paper px-4 py-28 text-ink sm:px-6 md:py-44 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>
              <TranslatedText text="Отзывы" />
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <DisplayHeading className="mt-6">
              <TranslatedText text="Отзывы родителей" />
            </DisplayHeading>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 text-xl text-ink/60">{stripEmoji(t("Хотите такое своим детям? 🥳"))}</p>
          </Reveal>
        </div>

        <div className="mt-16 columns-1 gap-5 md:columns-2 md:gap-6 lg:columns-3">
          {tiles.map((tile, i) => (
            <Reveal key={i} delay={(i % 3) * 0.06} className="mb-5 break-inside-avoid md:mb-6">
              <TileView tile={tile} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
