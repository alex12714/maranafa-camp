"use client"

import { motion } from "motion/react"
import { Heart, Users, TrendingDown, ArrowRight } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"
import { Button } from "@/components/ui/button"

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const fadeInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.3 },
  },
}

const stats = [
  {
    value: "0",
    label: "сердечных приступов",
    sublabel: "у мужчин до 55 лет",
    icon: Heart,
  },
  {
    value: "2×",
    label: "ниже смертность",
    sublabel: "от болезней сердца",
    icon: TrendingDown,
  },
  {
    value: "1882",
    label: "год основания",
    sublabel: "итальянской общины",
    icon: Users,
  },
]

const timeline = [
  {
    title: "1961 — Открытие",
    desc: "Доктор Стюарт Вульф замечает: в Розето практически нет инфарктов. Никаких особых диет, никакого спорта — просто крепкая, живая община.",
    icon: Heart,
    number: "01",
  },
  {
    title: "Секрет — это люди",
    desc: "Семьи жили вместе через поколения. Соседи заботились друг о друге. Сообщество было настоящим лекарством.",
    icon: Users,
    number: "02",
  },
  {
    title: "Когда связи ослабли",
    desc: "В 1970-х годах молодёжь стала уезжать, семьи разъединились. Смертность от сердечных заболеваний выросла до среднего по стране уровня.",
    icon: TrendingDown,
    number: "03",
  },
]

export default function RosettoSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-[#8B0000]">
      {/* Layered gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6B0000] via-[#B22234] to-[#8B0000]" />

      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FFD700]/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#FFD700]/6 blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/2 pointer-events-none" />

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,215,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
        >
          <motion.p
            variants={fadeUpVariants}
            className="text-[#FFD700] uppercase tracking-[0.3em] text-sm font-bold mb-3"
          >
            Rosetto
          </motion.p>

          <motion.h2
            variants={fadeUpVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
          >
            <TranslatedText text="Эффект Розето" />
          </motion.h2>

          <motion.div
            variants={lineVariants}
            className="mt-5 h-[3px] w-24 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left"
          />

          <motion.p
            variants={fadeUpVariants}
            className="mt-6 text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed"
          >
            <TranslatedText text="В 1961 году доктор Стюарт Вульф обнаружил поразительное: в маленьком итало-американском городке Розето, Пенсильвания, почти не было сердечных заболеваний. Секрет оказался не в диете и не в спорте — а в самой общине." />
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                variants={fadeInVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="text-center bg-white/8 backdrop-blur-sm rounded-2xl p-7 border border-[#FFD700]/20 hover:border-[#FFD700]/50 cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFD700]/15 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-[#FFD700]" />
                </div>
                <div className="text-5xl font-black text-[#FFD700] leading-none mb-2">
                  {stat.value}
                </div>
                <div className="text-white font-semibold text-base">
                  <TranslatedText text={stat.label} />
                </div>
                <div className="text-white/50 text-sm mt-1">
                  <TranslatedText text={stat.sublabel} />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Timeline story cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          {timeline.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                variants={fadeUpVariants}
                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                className="relative bg-white/6 backdrop-blur-sm rounded-2xl p-7 border border-white/10 hover:border-[#FFD700]/40 group overflow-hidden"
              >
                {/* Card number watermark */}
                <div className="absolute top-4 right-5 text-7xl font-black text-white/4 leading-none select-none pointer-events-none group-hover:text-[#FFD700]/8 transition-colors duration-300">
                  {item.number}
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#FFD700]/15 flex items-center justify-center mb-5 group-hover:bg-[#FFD700]/25 transition-colors duration-300">
                  <Icon className="h-6 w-6 text-[#FFD700]" />
                </div>

                <h3 className="text-[#FFD700] font-bold text-lg mb-3 leading-snug">
                  <TranslatedText text={item.title} />
                </h3>

                <p className="text-white/70 text-sm leading-relaxed">
                  <TranslatedText text={item.desc} />
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Quote + CTA */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={containerVariants}
        >
          <motion.div
            variants={fadeInVariants}
            className="relative mb-10 bg-white/8 rounded-2xl p-8 border border-[#FFD700]/25 overflow-hidden"
          >
            {/* Left gold accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFD700] to-[#FFC200] rounded-l-2xl" />

            {/* Quote mark */}
            <div className="text-[#FFD700]/20 text-[100px] font-serif leading-none absolute -top-4 -left-1 select-none pointer-events-none">
              "
            </div>

            <p className="text-lg md:text-xl text-white/90 italic leading-relaxed relative z-10 pl-4">
              <TranslatedText text="В лагере Маранафа мы создаём именно такую атмосферу — живую, настоящую общину, где каждый важен" />
            </p>
          </motion.div>

          <motion.div variants={fadeUpVariants} className="text-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <a
                href="https://rosetto.maranafa.camp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#FFD700] text-[#6B0000] hover:bg-[#FFC200] font-black px-10 py-6 text-base rounded-xl shadow-lg shadow-black/30">
                  <TranslatedText text="Узнать о программе Rosetto" />
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
