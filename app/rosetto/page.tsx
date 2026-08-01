"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowLeft, Heart, Users, TrendingDown, Quote,
  Sparkles, ArrowRight, Leaf, BookOpen, Music
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { TranslatedText } from "@/components/translated-text"

/* --- animation helpers ------------------------------------------- */
const ease = [0.22, 1, 0.36, 1] as const
const vp = { once: true, margin: "-80px" }

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.08 } } }
const fadeUp = { hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }
const fadeIn = { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease } } }
const slideLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } } }
const slideRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } } }
const scaleX = { hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.9, ease, delay: 0.35 } } }

/* --- data --------------------------------------------------------- */
const stats = [
  { value: "0", label: "сердечных приступов", sub: "у мужчин до 55 лет", icon: Heart },
  { value: "2×", label: "ниже смертность", sub: "от болезней сердца", icon: TrendingDown },
  { value: "65%", label: "меньше инсультов", sub: "по сравнению с соседними городами", icon: Sparkles },
]

const timeline = [
  {
    year: "1882",
    titleKey: "Начало",
    descKey: "Итальянские иммигранты из провинции Фоджа основывают Розето в Пенсильвании. Они строят дома рядом с семьями и воссоздают уклад жизни, оставленный на родине: вместе готовят, вместе молятся, вместе отмечают праздники.",
    icon: Users,
  },
  {
    year: "1961",
    titleKey: "Открытие",
    descKey: "Доктор Стюарт Вульф замечает странное: соседний врач говорит, что в Розето практически не бывает сердечных приступов. Вульф начинает исследование. То, что он находит, перевернёт медицину.",
    icon: Heart,
  },
  {
    year: "1964",
    titleKey: "Исследование",
    descKey: "Вульф и социолог Джон Брун публикуют многолетние данные. Уровень смертности от болезней сердца в Розето — вдвое ниже, чем в США. Ни диета, ни гены, ни физическая активность этого не объясняют. Разгадка — сама община.",
    icon: BookOpen,
  },
  {
    year: "1970-е",
    titleKey: "Испытание",
    descKey: "Молодёжь строит дома за пределами города. Старые клубы закрываются. Семьи разделяются. Уровень сердечных приступов в Розето стремительно вырастает — и достигает среднего по стране. Эксперимент закончился.",
    icon: TrendingDown,
  },
]

const pillars = [
  { icon: Users, titleKey: "Межпоколенческие семьи", descKey: "Дедушки и бабушки, родители, дети — под одной крышей. Пожилые не одиноки, дети всегда под заботой." },
  { icon: Leaf, titleKey: "Культура без конкуренции", descKey: "В Розето не принято было выставлять богатство напоказ. Успешные соседи помогали менее удачливым — и никакой зависти." },
  { icon: Music, titleKey: "Живые ритуалы", descKey: "Церковь, клубы, совместные ужины, праздники на улице. Каждый ритуал — нить, которая ткёт общину." },
  { icon: Heart, titleKey: "Настоящий контакт", descKey: "Живые разговоры через забор, помощь без просьбы, присутствие рядом. Не виртуальные лайки — реальное соседство." },
]

/* --- component ---------------------------------------------------- */
export default function RosettoPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ----------- HERO ----------- */}
      <section className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden">
        {/* bg image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/features/top_background.webp"
            alt="Rosetto"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#4a0000]/60 via-[#8B0000]/70 to-[#6B0000]/95" />
        </div>

        {/* subtle gold grid */}
        <div
          className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,215,0,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* back link */}
        <Link
          href="/"
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-white/80 hover:text-white bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <TranslatedText text="На главную" />
        </Link>

        {/* decorative glow */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#FFD700]/8 blur-3xl pointer-events-none z-0" />

        {/* hero text */}
        <motion.div
          className="relative z-10 container mx-auto max-w-5xl px-4 pb-20 pt-40"
          initial="hidden" animate="visible" variants={stagger}
        >
          <motion.p variants={fadeUp} className="text-[#FFD700] uppercase tracking-[0.3em] text-sm font-bold mb-4">
            Rosetto
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-5">
            <TranslatedText text="Эффект Розето" />
          </motion.h1>
          <motion.div variants={scaleX} className="h-[3px] w-28 bg-gradient-to-r from-[#FFD700] to-[#FFC200] origin-left mb-7" />
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed">
            <TranslatedText text="История маленького городка, который случайно доказал: самое мощное лекарство — это люди рядом." />
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
            <a href="#story">
              <Button className="bg-[#FFD700] text-[#6B0000] hover:bg-[#FFC200] font-bold px-8 py-5 rounded-xl text-base shadow-lg">
                <TranslatedText text="Читать историю" />
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <Link href="/rosetto/programme">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8 py-5 rounded-xl text-base bg-transparent">
                <TranslatedText text="Планы участия" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ----------- INTRO PULL-QUOTE ----------- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
            <motion.div variants={fadeIn}>
              <Quote className="h-10 w-10 text-[#FFD700] mx-auto mb-6" />
            </motion.div>
            <motion.blockquote variants={fadeUp} className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug italic mb-6">
              "<TranslatedText text="Я искал физические причины. Но болезнь сердца в Розето объяснялась только одним — тем, как люди относились друг к другу." />"
            </motion.blockquote>
            <motion.p variants={fadeUp} className="text-[#B22234] font-semibold tracking-wide">
              Dr. Stewart Wolf, 1964
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ----------- STATS ----------- */}
      <section className="py-20 bg-gradient-to-br from-[#6B0000] via-[#B22234] to-[#8B0000] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,215,0,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,.5) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="container mx-auto max-w-5xl px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-[#FFD700] uppercase tracking-[0.25em] text-sm font-bold mb-3">
                <TranslatedText text="Данные исследования" />
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white">
                <TranslatedText text="Цифры, которые удивили весь мир" />
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((s, i) => {
                const Icon = s.icon
                return (
                  <motion.div
                    key={i} variants={fadeIn}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="text-center bg-white/8 backdrop-blur-sm rounded-2xl p-8 border border-[#FFD700]/20 hover:border-[#FFD700]/50 cursor-default"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#FFD700]/15 flex items-center justify-center mx-auto mb-5">
                      <Icon className="h-6 w-6 text-[#FFD700]" />
                    </div>
                    <div className="text-6xl font-black text-[#FFD700] leading-none mb-3">{s.value}</div>
                    <div className="text-white font-semibold mb-1"><TranslatedText text={s.label} /></div>
                    <div className="text-white/50 text-sm"><TranslatedText text={s.sub} /></div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ----------- TIMELINE ----------- */}
      <section id="story" className="py-24 bg-gray-50">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
              <TranslatedText text="Хроника" />
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              <TranslatedText text="История Розето" />
            </motion.h2>
            <motion.div variants={scaleX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left" />
          </motion.div>

          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#B22234] via-[#FFD700] to-[#B22234] opacity-30 hidden sm:block" />

            <div className="space-y-12">
              {timeline.map((item, i) => {
                const Icon = item.icon
                const isRight = i % 2 === 0
                return (
                  <motion.div
                    key={i}
                    initial="hidden" whileInView="visible" viewport={vp}
                    variants={isRight ? slideLeft : slideRight}
                    className={`relative flex flex-col sm:flex-row items-start gap-6 ${!isRight ? "sm:flex-row-reverse" : ""}`}
                  >
                    {/* year bubble */}
                    <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#B22234] border-4 border-white shadow-lg items-center justify-center z-10 flex-shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>

                    {/* spacer */}
                    <div className="hidden sm:block flex-1" />

                    {/* card */}
                    <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-7 hover:shadow-md transition-shadow ${!isRight ? "sm:mr-8" : "sm:ml-8"}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="sm:hidden w-10 h-10 rounded-full bg-[#B22234] flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-3xl font-black text-[#FFD700] leading-none">{item.year}</span>
                        <div className="h-[2px] flex-1 bg-[#FFD700]/30 rounded" />
                      </div>
                      <h3 className="text-[#B22234] font-bold text-lg mb-3">
                        <TranslatedText text={item.titleKey} />
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                        <TranslatedText text={item.descKey} />
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ----------- THE FOUR PILLARS ----------- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div variants={slideLeft}>
                <p className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
                  <TranslatedText text="Разгадка" />
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5 leading-tight">
                  <TranslatedText text="Четыре столпа розетского феномена" />
                </h2>
                <div className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mb-6" />
                <p className="text-gray-600 leading-relaxed text-base">
                  <TranslatedText text="Вульф и его команда исключали одну причину за другой. Не диета — жители ели насыщенные жиры и пили вино. Не гены — родственники в других городах болели обычно. Не спорт. Не врачи. Только когда они посмотрели на саму жизнь общины — ответ стал очевиден." />
                </p>
              </motion.div>
              <motion.div variants={slideRight} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image src="/images/features/program.webp" alt="Community" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#B22234]/30 to-transparent" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {pillars.map((p, i) => {
              const Icon = p.icon
              return (
                <motion.div
                  key={i} variants={fadeIn}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="flex gap-5 bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-[#B22234]/20 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#B22234]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-[#B22234]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2"><TranslatedText text={p.titleKey} /></h3>
                    <p className="text-gray-600 text-sm leading-relaxed"><TranslatedText text={p.descKey} /></p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ----------- CAMP PHOTOS STRIP ----------- */}
      <section className="py-4 bg-white overflow-hidden">
        <motion.div
          initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
          className="flex gap-3 px-4 max-w-6xl mx-auto"
        >
          {[
            "/images/features/nature.webp",
            "/images/features/tasty-food.webp",
            "/images/features/program.webp",
            "/images/features/top_background.webp",
          ].map((src, i) => (
            <motion.div
              key={i} variants={fadeIn}
              className="flex-1 aspect-[4/3] relative rounded-xl overflow-hidden shadow-md min-w-0"
            >
              <Image src={src} alt="" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ----------- MARANAFA CONNECTION ----------- */}
      <section className="py-24 bg-gradient-to-br from-[#6B0000] via-[#B22234] to-[#8B0000] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,215,0,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,.5) 1px,transparent 1px)", backgroundSize: "48px 48px" }}
        />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#FFD700]/6 blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-[#FFD700] uppercase tracking-[0.25em] text-sm font-bold mb-3">
                <TranslatedText text="Связь с лагерем" />
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                <TranslatedText text="Маранафа — это живая община" />
              </h2>
              <motion.div variants={scaleX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left" />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-center mb-14">
              <motion.div variants={slideLeft} className="space-y-5 text-white/85 text-base leading-relaxed">
                <p>
                  <TranslatedText text="Розетский эффект — не академическая теория. Это доказанная закономерность: когда люди по-настоящему принадлежат общине, их здоровье, счастье и стойкость растут в разы." />
                </p>
                <p>
                  <TranslatedText text="Именно это Маранафа строит каждое лето. Не просто лагерь с программой — а настоящую общину. Здесь старшие наставляют младших. Здесь еду готовят вместе. Здесь истории рассказывают у костра, а не в экране." />
                </p>
                <p>
                  <TranslatedText text="Дети, которые прошли через Маранафу, помнят не расписание — они помнят людей. Это и есть розетский эффект в действии." />
                </p>
              </motion.div>

              <motion.div variants={slideRight} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#FFD700]/20">
                <Image src="/images/features/nature.webp" alt="Маранафа" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#6B0000]/60 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white font-semibold text-sm">
                    <TranslatedText text="Лагерь Маранафа, Латвия" />
                  </p>
                </div>
              </motion.div>
            </div>

            {/* final quote */}
            <motion.div
              variants={fadeIn}
              className="relative bg-white/8 rounded-2xl p-8 border border-[#FFD700]/25 text-center overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFD700] to-[#FFC200] rounded-l-2xl" />
              <div className="absolute -top-4 left-5 text-[#FFD700]/15 text-[100px] font-serif leading-none select-none pointer-events-none">"</div>
              <p className="text-lg md:text-xl text-white/90 italic leading-relaxed relative z-10 max-w-2xl mx-auto">
                <TranslatedText text="В лагере Маранафа мы создаём именно такую атмосферу — живую, настоящую общину, где каждый важен" />
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ----------- CTA ----------- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              <TranslatedText text="Станьте частью общины" />
            </motion.h2>
            <motion.div variants={scaleX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left mb-6" />
            <motion.p variants={fadeUp} className="text-gray-600 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              <TranslatedText text="Программа Rosetto — это то, как мы сознательно строим эти связи: единая точка контакта, специалисты и волонтёрская сеть. Планы участия готовятся — открыта ранняя регистрация интереса." />
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/rosetto/programme">
                  <Button className="bg-[#B22234] hover:bg-[#8e1c29] text-white font-bold px-10 py-6 text-base rounded-xl shadow-md">
                    <TranslatedText text="Смотреть планы участия" />
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/camp">
                  <Button variant="outline" className="border-[#B22234] text-[#B22234] hover:bg-[#B22234] hover:text-white px-10 py-6 text-base rounded-xl">
                    <TranslatedText text="О лагере Маранафа" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
