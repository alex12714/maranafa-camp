"use client"

import { useRef, type PointerEvent } from "react"
import Image from "next/image"
import { useReducedMotion } from "motion/react"
import { TranslatedText } from "@/components/translated-text"
import { Reveal } from "@/components/home/motion/reveal"
import { DisplayHeading, Eyebrow } from "./ui"

const staffMembers = [
  {
    name: "Alex Podbrezsky",
    role: "Директор",
    image:
      "/images/staff/alex_director_avatar.webp",
  },
  { name: "Abels Griņuks", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Agita Grinyk", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Aleksandr Gubko", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Aleksandra Butanova", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Aleksandra Mirecka", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Alex Polupanov",
    role: "Сотрудник",
    image:
      "/images/staff/alex-polupanov.jpeg",
  },
  { name: "Alina Machneva", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Amelia Yoc",
    role: "Сотрудник",
    image: "/images/staff/amelia-yoc.jpeg",
  },
  {
    name: "Anastasija Valdmane",
    role: "Сотрудник",
    image:
      "/images/staff/anastasija-valdmane.jpeg",
  },
  { name: "Anna Lendele", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Anna Solyanik", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Darja Koreshuk",
    role: "Сотрудник",
    image:
      "/images/staff/darja-koreshuk.jpeg",
  },
  { name: "Dasha Koreshuk", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Denis Samchuk", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Deniss Snetkovs", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Edgar Kalnins", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Elena Golubeva", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Elisabeth Kalnicka", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Estere Ozolina",
    role: "Сотрудник",
    image:
      "/images/staff/estere-ozolina.jpeg",
  },
  {
    name: "Fedor Kalninsh",
    role: "Сотрудник",
    image:
      "/images/staff/fjodor-kalnins.jpeg",
  },
  { name: "Florint Yunac", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Ginta Vanaga",
    role: "Сотрудник",
    image:
      "/images/staff/ginta-vanaga.jpeg",
  },
  {
    name: "Ilona Drobilenko",
    role: "Сотрудник",
    image:
      "/images/staff/ilona-drobilenko.jpeg",
  },
  { name: "Inga Lokšinska", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Ineta Mozeiko",
    role: "Сотрудник",
    image:
      "/images/staff/ineta-mozeiko.jpeg",
  },
  { name: "Irina Novik", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Irina Yoc",
    role: "Сотрудник",
    image: "/images/staff/irina-yoc.jpeg",
  },
  {
    name: "Jana Silina",
    role: "Сотрудник",
    image:
      "/images/staff/jana-silina.jpeg",
  },
  {
    name: "Jelena Gubko",
    role: "Сотрудник",
    image:
      "/images/staff/jelena-gubko.jpeg",
  },
  { name: "John Kubilus", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Julia Mitjukova", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Julia Stangelini", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Kamila Januskeviciuene", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Kate Podbrezska",
    role: "Сотрудник",
    image:
      "/images/staff/kate-podbrezska.jpeg",
  },
  {
    name: "Larisa Juganova",
    role: "Сотрудник",
    image:
      "/images/staff/larisa-juganova.jpeg",
  },
  {
    name: "Lilija Meshanova (Jr)",
    role: "Сотрудник",
    image:
      "/images/staff/lilja-meshanova.jpeg",
  },
  { name: "Linas Januskevicius", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Lubovj Timonirova",
    role: "Сотрудник",
    image:
      "/images/staff/ljubovj-tihomirova.jpeg",
  },
  {
    name: "Marije Ozolina",
    role: "Сотрудник",
    image:
      "/images/staff/marite-ozolina.jpeg",
  },
  {
    name: "Mira Selukanjeva",
    role: "Сотрудник",
    image:
      "/images/staff/mira-sejtkalijeva.jpeg",
  },
  { name: "Nikolaj Yoc", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Oleg Drobilenko",
    role: "Сотрудник",
    image:
      "/images/staff/oleg-drobilenko.jpeg",
  },
  { name: "Oleg Mihailov", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Olga Klochko",
    role: "Сотрудник",
    image:
      "/images/staff/olga-klochko.jpeg",
  },
  {
    name: "Roman Locans",
    role: "Сотрудник",
    image:
      "/images/staff/roman-locans.jpeg",
  },
  {
    name: "Timofei Koreshuk",
    role: "Сотрудник",
    image:
      "/images/staff/timofei-koreshuk.jpeg",
  },
  {
    name: "Valerij Seitkaliev",
    role: "Сотрудник",
    image:
      "/images/staff/valeri-sejtkalijev.jpeg",
  },
  { name: "Valery Kazan", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Veronika Davidova", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Yuri Skripnik",
    role: "Сотрудник",
    image:
      "/images/staff/yuri-skripnik.jpeg",
  },
  {
    name: "Alena Chumachenko",
    role: "Сотрудник",
    image:
      "/images/staff/alena-chumachenko.jpeg",
  },
  {
    name: "Larisa Sedova",
    role: "Сотрудник",
    image:
      "/images/staff/larisa-sedova.jpeg",
  },
  {
    name: "Viktor Lisov",
    role: "Сотрудник",
    image:
      "/images/staff/viktor-lisov.jpeg",
  },
  {
    name: "Ludmila Lozovska",
    role: "Сотрудник",
    image:
      "/images/staff/ludmila-lozovska.jpeg",
  },
  {
    name: "Sergej Shur",
    role: "Сотрудник",
    image:
      "/images/staff/sergej-shur.jpeg",
  },
]

// Only people with a real portrait; placeholders would read as gaps.
const people = staffMembers.filter((p) => !p.image.startsWith("/placeholder"))
const director = people.find((p) => p.role === "Директор")
const team = people.filter((p) => p !== director)
const rows = [team.filter((_, i) => i % 2 === 0), team.filter((_, i) => i % 2 === 1)]

function Portrait({ name, image }: { name: string; image: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.transform = `perspective(700px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateZ(0)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ""
  }

  return (
    <figure className="group w-40 flex-shrink-0 md:w-52">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-ink/5 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="208px"
          className="object-cover grayscale transition-[filter,transform] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:grayscale-0"
        />
      </div>
      <figcaption className="mt-3 truncate text-sm font-medium text-ink/80">{name}</figcaption>
    </figure>
  )
}

function MarqueeRow({ items, reverse }: { items: typeof team; reverse?: boolean }) {
  return (
    <div className="marquee-mask group/row flex overflow-hidden">
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className="marquee-track flex flex-shrink-0 gap-5 pr-5 group-hover/row:[animation-play-state:paused] md:gap-6 md:pr-6"
          style={{ animationDirection: reverse ? "reverse" : "normal" }}
        >
          {items.map((p) => (
            <Portrait key={p.name} name={p.name} image={p.image} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function Staff() {
  return (
    <section className="overflow-hidden bg-paper py-28 text-ink md:py-44">
      <style>{`
        @keyframes marquee-x { from { transform: translateX(0) } to { transform: translateX(-100%) } }
        .marquee-track { animation: marquee-x 80s linear infinite; }
        .marquee-mask { mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
        @media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }
      `}</style>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-12 md:items-end lg:px-8">
        <div className="md:col-span-8">
          <Reveal>
            <Eyebrow><TranslatedText text="Маранафа" /></Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <DisplayHeading className="mt-6">
              <TranslatedText text="Команда" />
            </DisplayHeading>
          </Reveal>
        </div>
        {director && (
          <Reveal delay={0.12} className="md:col-span-4">
            <div className="flex items-center gap-4 md:justify-end">
              <div className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-ink/10">
                <Image src={director.image} alt={director.name} fill sizes="64px" className="object-cover" />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-[-0.01em]">{director.name}</p>
                <p className="font-serif text-lg italic text-crimson">
                  <TranslatedText text={director.role} />
                </p>
              </div>
            </div>
          </Reveal>
        )}
      </div>

      <div className="mt-16 space-y-5 md:space-y-6">
        {rows.map((row, i) => (
          <MarqueeRow key={i} items={row} reverse={i === 1} />
        ))}
      </div>
    </section>
  )
}
