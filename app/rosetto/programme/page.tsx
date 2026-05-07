"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowLeft, ArrowRight, CheckCircle2, FileSignature,
  Calendar, Heart, Users, Phone, Mail, HelpingHand,
  Handshake, Shield, Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { TranslatedText } from "@/components/translated-text"

/* ── animation presets ─────────────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as const
const vp = { once: true, margin: "-70px" }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.13, delayChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } }
const fadeIn = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease } } }
const slideL = { hidden: { opacity: 0, x: -36 }, visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease } } }
const slideR = { hidden: { opacity: 0, x: 36 }, visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease } } }
const barX = { hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.85, ease, delay: 0.3 } } }

/* ── data ──────────────────────────────────────────────────────────── */
const steps = [
  {
    n: "01",
    icon: CheckCircle2,
    titleKey: "Зарегистрируйтесь",
    descKey: "Заполните форму регистрации. Мы свяжемся с вами, расскажем о проекте и ответим на вопросы.",
  },
  {
    n: "02",
    icon: FileSignature,
    titleKey: "Подпишите договор",
    descKey: "Каждый участник подписывает договор взаимной поддержки — обязательство заботиться о других членах проекта.",
  },
  {
    n: "03",
    icon: Calendar,
    titleKey: "Участвуйте в расписании",
    descKey: "Когда кто-то из участников нуждается в помощи, вы получаете запрос и подтверждаете участие по возможности.",
  },
]

const benefits = [
  { icon: Shield, titleKey: "Защита в трудный момент", descKey: "Вы и ваша семья знаете: в сложной ситуации вы не одни. Участники проекта готовы прийти на помощь." },
  { icon: Heart, titleKey: "Настоящая поддержка", descKey: "Не виртуальные слова участия, а реальная, практическая помощь — как и жили жители Розето." },
  { icon: Users, titleKey: "Живая община", descKey: "Вы становитесь частью сети людей, которые знают и заботятся друг о друге." },
  { icon: Handshake, titleKey: "Взаимность", descKey: "Вы помогаете другим — и получаете поддержку сами. Проект работает в обоих направлениях." },
]

const howItWorks = [
  { emoji: "✍️", textKey: "Подпишите договор участия и заботы" },
  { emoji: "📩", textKey: "Получите сообщение о помощи от другого участника" },
  { emoji: "✅", textKey: "По возможности подтвердите участие в запросе о помощи" },
  { emoji: "🙋", textKey: "Если поддержка нужна вам — вы или ваши друзья создаёте запрос, и другие участники откликаются" },
]

/* ── page ──────────────────────────────────────────────────────────── */
export default function RosettoProgrammePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden bg-[#6B0000]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4a0000] via-[#8B0000] to-[#B22234]" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,215,0,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,.6) 1px,transparent 1px)", backgroundSize: "48px 48px" }}
        />
        <div className="absolute -top-20 -right-20 w-[480px] h-[480px] rounded-full bg-[#FFD700]/6 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-[320px] h-[320px] rounded-full bg-white/3 blur-2xl pointer-events-none" />

        {/* nav */}
        <Link
          href="/rosetto"
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-white/80 hover:text-white bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <TranslatedText text="Об эффекте Розето" />
        </Link>

        <motion.div
          className="relative z-10 container mx-auto max-w-5xl px-4 pb-20 pt-40"
          initial="hidden" animate="visible" variants={stagger}
        >
          <motion.p variants={fadeUp} className="text-[#FFD700] uppercase tracking-[0.3em] text-sm font-bold mb-4">
            <TranslatedText text="Программа" />
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-black text-white leading-[1.05] mb-4">
            Maranafa Rosetto
          </motion.h1>
          <motion.div variants={barX} className="h-[3px] w-28 bg-gradient-to-r from-[#FFD700] to-[#FFC200] origin-left mb-7" />
          <motion.p variants={fadeUp} className="text-xl md:text-2xl text-white/75 max-w-2xl leading-relaxed mb-10">
            <TranslatedText text="Проект взаимной поддержки" />
          </motion.p>
          <motion.p variants={fadeUp} className="text-base text-white/65 max-w-xl leading-relaxed mb-10">
            <TranslatedText text="Участие в проекте даёт уверенность: в трудную минуту каждому участнику и его семье придут на помощь такие же участники. Каждый по мере возможности участвует в расписании поддержки." />
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <a href="https://rosetto.maranafa.camp" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#FFD700] text-[#6B0000] hover:bg-[#FFC200] font-black px-9 py-5 rounded-xl text-base shadow-lg">
                  <TranslatedText text="Хочу присоединиться" />
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <a href="https://rosetto.maranafa.camp" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent px-9 py-5 rounded-xl text-base">
                  <TranslatedText text="Создать запрос о помощи" />
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════ 3 STEPS ══════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
              <TranslatedText text="Как начать" />
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              <TranslatedText text="Три шага к участию" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left" />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={i} variants={fadeIn}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="relative bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-[#B22234]/20 hover:shadow-md transition-all group"
                >
                  {/* large number watermark */}
                  <div className="absolute top-5 right-6 text-7xl font-black text-gray-100 leading-none select-none group-hover:text-[#B22234]/8 transition-colors">
                    {s.n}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-[#B22234]/10 flex items-center justify-center mb-6 group-hover:bg-[#B22234]/15 transition-colors">
                    <Icon className="h-7 w-7 text-[#B22234]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <TranslatedText text={s.titleKey} />
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    <TranslatedText text={s.descKey} />
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS (detail) ══════ */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
            <div className="grid md:grid-cols-2 gap-14 items-center">
              <motion.div variants={slideL}>
                <p className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
                  <TranslatedText text="Механика" />
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
                  <TranslatedText text="Как это работает" />
                </h2>
                <div className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mb-6" />
                <p className="text-gray-600 leading-relaxed mb-8">
                  <TranslatedText text="Взаимопомощь работает в двух направлениях — для вас и от вас. Вы участвуете в расписании поддержки других, и другие участвуют в вашем." />
                </p>
                <div className="space-y-4">
                  {howItWorks.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5, ease }}
                      className="flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                    >
                      <span className="text-2xl flex-shrink-0 mt-0.5">{item.emoji}</span>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        <TranslatedText text={item.textKey} />
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={slideR} className="space-y-5">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <Image src="/images/features/program.webp" alt="Rosetto Programme" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6B0000]/50 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-white font-semibold text-sm">
                      <TranslatedText text="Команда Маранафа направляет проект" />
                    </p>
                  </div>
                </div>
                {/* bidirectional callout */}
                <div className="bg-gradient-to-br from-[#6B0000] to-[#B22234] rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <HelpingHand className="h-6 w-6 text-[#FFD700] flex-shrink-0" />
                    <h3 className="font-bold text-lg"><TranslatedText text="Двустороннее участие" /></h3>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    <TranslatedText text="Вы помогаете другим участникам — и получаете поддержку сами, когда она нужна вам или вашей семье. Не пожертвование, а взаимность." />
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ BENEFITS ══════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
              <TranslatedText text="Преимущества" />
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              <TranslatedText text="Что даёт участие" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left" />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {benefits.map((b, i) => {
              const Icon = b.icon
              return (
                <motion.div
                  key={i} variants={fadeIn}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="flex gap-5 bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-[#B22234]/20 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#B22234]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-[#B22234]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2"><TranslatedText text={b.titleKey} /></h3>
                    <p className="text-gray-600 text-sm leading-relaxed"><TranslatedText text={b.descKey} /></p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════ ROSETO LINK ══════ */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto max-w-3xl px-4">
          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="flex flex-col sm:flex-row items-center gap-6 bg-white rounded-2xl p-7 shadow-sm border border-gray-100"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#B22234]/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-7 w-7 text-[#B22234]" />
            </div>
            <motion.div variants={slideL} className="flex-1 text-center sm:text-left">
              <p className="font-bold text-gray-900 mb-1">
                <TranslatedText text="Откуда название Rosetto?" />
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                <TranslatedText text="Проект назван в честь Розето, Пенсильвания — городка, где сила общины заменяла лекарства." />
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="flex-shrink-0">
              <Link href="/rosetto">
                <Button variant="outline" className="border-[#B22234] text-[#B22234] hover:bg-[#B22234] hover:text-white rounded-xl text-sm">
                  <TranslatedText text="Читать историю" />
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════ CTA + CONTACT ══════ */}
      <section className="py-24 bg-gradient-to-br from-[#6B0000] via-[#B22234] to-[#8B0000] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,215,0,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,.5) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#FFD700]/6 blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-4xl px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-14">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-white mb-4">
              <TranslatedText text="Стать участником Rosetto" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left mb-6" />
            <motion.p variants={fadeUp} className="text-white/70 max-w-xl mx-auto leading-relaxed">
              <TranslatedText text="Зарегистрируйтесь и мы расскажем подробности. Проект основан на доверии — поэтому первый шаг это личный контакт." />
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            {/* join CTA */}
            <motion.div variants={fadeIn}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-[#FFD700]/20 hover:border-[#FFD700]/40 text-center"
            >
              <Users className="h-10 w-10 text-[#FFD700] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                <TranslatedText text="Хочу присоединиться" />
              </h3>
              <p className="text-white/65 text-sm mb-6 leading-relaxed">
                <TranslatedText text="Заполните форму, мы свяжемся и расскажем о проекте." />
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <a href="https://rosetto.maranafa.camp" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-[#FFD700] text-[#6B0000] hover:bg-[#FFC200] font-black py-5 rounded-xl text-base">
                    <TranslatedText text="Присоединиться" />
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </motion.div>
            </motion.div>

            {/* help request CTA */}
            <motion.div variants={fadeIn}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/15 hover:border-[#FFD700]/40 text-center"
            >
              <HelpingHand className="h-10 w-10 text-[#FFD700] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                <TranslatedText text="Нужна помощь" />
              </h3>
              <p className="text-white/65 text-sm mb-6 leading-relaxed">
                <TranslatedText text="Вы или ваши близкие в сложной ситуации? Создайте запрос — участники откликнутся." />
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <a href="https://rosetto.maranafa.camp" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-white/40 text-white hover:bg-white/15 bg-transparent py-5 rounded-xl text-base">
                    <TranslatedText text="Создать запрос о помощи" />
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* contact */}
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.a
              variants={fadeIn}
              href="tel:+37120172714"
              className="flex items-center gap-3 bg-white/8 rounded-xl px-6 py-4 border border-white/15 hover:border-[#FFD700]/40 text-white/80 hover:text-white transition-colors"
            >
              <Phone className="h-5 w-5 text-[#FFD700]" />
              <span className="font-medium">+371 2017-2714</span>
            </motion.a>
            <motion.a
              variants={fadeIn}
              href="mailto:rosetto@maranafa.camp"
              className="flex items-center gap-3 bg-white/8 rounded-xl px-6 py-4 border border-white/15 hover:border-[#FFD700]/40 text-white/80 hover:text-white transition-colors"
            >
              <Mail className="h-5 w-5 text-[#FFD700]" />
              <span className="font-medium">rosetto@maranafa.camp</span>
            </motion.a>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
