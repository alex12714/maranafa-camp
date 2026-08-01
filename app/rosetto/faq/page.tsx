"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowLeft, ArrowRight, ChevronDown, Check,
  Headphones, Settings, Stethoscope, Car, PhoneCall, HeartPulse,
  Receipt, Phone, Handshake, FileSignature, CreditCard, Smartphone,
  BadgeCheck, Clock, ShieldCheck, BellRing,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { TranslatedText } from "@/components/translated-text"

/* ── animation presets ─────────────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as const
const vp = { once: true, margin: "-70px" }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }
const fadeIn = { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease } } }
const slideL = { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } } }
const barX = { hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.8, ease, delay: 0.25 } } }

/* ── data ──────────────────────────────────────────────────────────── */
const spending = [
  {
    icon: Headphones,
    titleKey: "Выделенный координатор",
    descKey: "Человек, который занимается вашими вопросами: находит специалиста, договаривается об условиях и следит, что дело доведено до конца. Это его работа, а не общественная нагрузка в свободное время.",
  },
  {
    icon: Settings,
    titleKey: "Администрирование",
    descKey: "Приложение и его поддержка, бухгалтерия, договоры, подбор и проверка партнёров — всё, что делает сервис предсказуемым, а не разовой услугой по знакомству.",
  },
  {
    icon: Stethoscope,
    titleKey: "Закупка услуг у специалистов",
    descKey: "Договорённости со специалистами и согласованные для участников ставки. Услуги оказывают сами специалисты; что входит в план, а что оплачивается отдельно по льготной ставке, фиксируется в договоре участия.",
  },
  {
    icon: Car,
    titleKey: "Содержание автопарка",
    descKey: "Страховка, техобслуживание, ремонт, шины и замена машин — чтобы автомобиль был исправен и доступен тогда, когда он вам нужен.",
  },
  {
    icon: PhoneCall,
    titleKey: "Оплата мобильного плана",
    descKey: "Корпоративный тариф у оператора связи: мы как бизнес-клиент оплачиваем пакет и подключаем к нему участников, выдавая SIM-карты. Услугу связи оказывает оператор.",
  },
  {
    icon: BellRing,
    titleKey: "Устройства и связь для тревожной кнопки",
    descKey: "Носимые устройства и мобильная связь для них. Приём сигнала обеспечивает действующая лицензированная служба мониторинга.",
  },
  {
    icon: HeartPulse,
    titleKey: "Медицинская страховка",
    descKey: "Оплата взносов страховщику по групповому полису. Страхование предоставляет лицензированная страховая компания — мы не являемся страховщиком.",
  },
]

/* Two-series comparison. Colours validated with the dataviz palette checker:
   #2F6FB8 / #B22234 pass lightness, chroma, CVD separation, normal-vision and
   contrast against a white surface. Figures are an illustrative example — the
   section says so, and the real ones land when pricing is fixed. */
const NOW_COLOR = "#2F6FB8"
const ROSETTO_COLOR = "#B22234"

const comparison = [
  {
    labelKey: "Деньги",
    subKey: "Страховка, помощь на дороге, связь и разовые визиты к специалистам — если покупать всё это по отдельности",
    now: 78, nowLabelKey: "€78 в месяц",
    ros: 20, rosLabelKey: "от €20 в месяц",
  },
  {
    labelKey: "Время",
    subKey: "Поиск, звонки, сравнение цен и ожидание ответа — в среднем за месяц",
    now: 6, nowLabelKey: "около 6 часов",
    ros: 0.5, rosLabelKey: "около 30 минут",
  },
  {
    labelKey: "Сколько держать в голове",
    subKey: "Отдельные договоры, счета и телефоны, которые нужно найти, помнить и не потерять",
    now: 6, nowLabelKey: "6 договоров",
    ros: 1, rosLabelKey: "1 договор",
  },
]

const scenarios = [
  {
    situationKey: "Ночью упал пожилой родитель",
    nowKey: "Узнаёте утром — если вообще позвонят.",
    communityKey: "Кнопка сама поднимает тревогу: служба мониторинга вызывает 112, вам приходит уведомление.",
  },
  {
    situationKey: "Машина встала на трассе",
    nowKey: "Обзваниваете эвакуаторы и торгуетесь на обочине.",
    communityKey: "Вызов из приложения по тарифу, согласованному заранее.",
  },
  {
    situationKey: "Ребёнку нужен логопед",
    nowKey: "Очередь на месяцы или частник наугад.",
    communityKey: "Бронируете проверенного специалиста в приложении по ставке для участников.",
  },
  {
    situationKey: "Нужно подвезти, встретить или передать вещи",
    nowKey: "Думаете, кого попросить, и неудобно просить.",
    communityKey: "Запрос с геолокацией в приложении — откликается тот, кому по пути.",
  },
]

const onboarding = [
  {
    n: "01",
    icon: Phone,
    titleKey: "Созвон",
    descKey: "Созваниваемся и разбираем вашу ситуацию: кто в семье, что нужно чаще всего, есть ли старшие родственники и что вас беспокоит больше всего.",
  },
  {
    n: "02",
    icon: Handshake,
    titleKey: "Обсуждение плана",
    descKey: "Вместе подбираем подходящий план — по реальным потребностям, а не по прайсу. Если половина услуг вам не нужна, это влияет на выбор.",
  },
  {
    n: "03",
    icon: FileSignature,
    titleKey: "Подписание договора участия",
    descKey: "Договор описывает услуги, размер взноса и взаимные обязательства — включая готовность по мере возможности помогать другим участникам.",
  },
  {
    n: "04",
    icon: CreditCard,
    titleKey: "Оплата",
    descKey: "Первый взнос. После оплаты начинается подключение услуг.",
  },
  {
    n: "05",
    icon: Smartphone,
    titleKey: "Доступ к приложению",
    descKey: "Вы получаете доступ в приложение Rosetto. С этого момента все услуги заказываются оттуда.",
  },
]

const afterAccess = [
  {
    icon: BadgeCheck,
    titleKey: "Автопарк — интервью и проверка прав",
    descKey: "Доступ к машинам открывается отдельно: короткое интервью и проверка водительского удостоверения — действительность прав мы проверяем в регистре CSDD. И то, и другое проходит в приложении.",
  },
  {
    icon: Clock,
    titleKey: "Машины доступны круглосуточно",
    descKey: "После открытия доступа автомобили можно бронировать в любое время — 24/7, включая выходные и ночь.",
  },
  {
    icon: PhoneCall,
    titleKey: "Подключение мобильного плана",
    descKey: "Сразу после подключения начинается перевод на корпоративный тариф: мы помогаем подать оператору заявление о сохранении номера — сам перенос выполняет оператор, ваш номер остаётся прежним.",
  },
  {
    icon: Smartphone,
    titleKey: "Остальные услуги — через приложение",
    descKey: "Врач, юрист, логопед, эвакуатор, помощь на дороге, медсестра и помощник по дому — всё заказывается в приложении. Координатор нужен только тогда, когда нужен живой человек.",
  },
]

const faq = [
  {
    q: "Это страховка?",
    a: "Нет. Rosetto — это членство в объединении, которое организует доступ к услугам лицензированных партнёров. Медицинское страхование предоставляет лицензированный страховщик, а не мы: сама программа страховым продуктом не является, и страховых выплат мы не производим.",
  },
  {
    q: "Кто оказывает услуги — вы или партнёры?",
    a: "Партнёры. Мы не являемся страховщиком, оператором связи, медицинским учреждением или охранной службой. Страхование предоставляет лицензированный страховщик, связь — оператор, медицинскую помощь — лицензированные специалисты, эвакуацию и помощь на дороге — лицензированная служба, приём сигнала тревожной кнопки — действующая служба мониторинга. Наша роль — закупать услуги у лицензированных поставщиков оптом, открывать к ним доступ участникам и координировать.",
  },
  {
    q: "Тревожная кнопка заменяет скорую помощь?",
    a: "Нет. При тревоге служба мониторинга при необходимости вызывает 112 и оповещает близких и координатора. Экстренную медицинскую помощь оказывает государственная служба неотложной помощи — устройство помогает вызвать её быстрее, но не заменяет её.",
  },
  {
    q: "Что если поставщик работает плохо?",
    a: "Скажите координатору и поставьте оценку в приложении. Мы смотрим на реальные оценки участников по каждому поставщику: если качество стабильно не дотягивает до требований договора, мы меняем поставщика. Именно в этом смысл коллективной закупки — у одного клиента такой переговорной силы нет, у общины есть.",
  },
  {
    q: "Сколько это стоит?",
    a: "Планы начинаются от €20 в месяц. Окончательные цены ещё формируются: мы закрепляем договорённости с партнёрами. Участники ранней регистрации узнают условия первыми.",
  },
  {
    q: "Когда запуск?",
    a: "Точная дата зависит от того, как быстро мы закроем договорённости с партнёрами. Тем, кто оставил заявку, мы напишем первыми — заявка ни к чему не обязывает.",
  },
  {
    q: "Что если я не смогу помогать другим участникам?",
    a: "Договор участия предполагает помощь по мере возможности, а не обязательство быть доступным всегда. Никто не ведёт учёт долгов и не выставляет счёт за неучастие.",
  },
  {
    q: "Мне нужны не все услуги. Получается, я переплачиваю?",
    a: "План подбирается на созвоне под ваши реальные потребности. Скажите, что вам не нужно, — это влияет и на выбор плана, и на то, какие услуги мы подключаем первыми.",
  },
  {
    q: "Можно ли выйти из программы?",
    a: "Да. Договор заключается дистанционно, поэтому у вас есть 14 дней, чтобы отказаться от него без объяснения причин. Дальше участие прекращается по вашему заявлению — условия выхода прописаны в договоре, и вы видите их до подписания.",
  },
  {
    q: "Кто отвечает за качество специалистов?",
    a: "Партнёров подбираем и проверяем мы, а услугу оказывает и профессиональную ответственность за неё несёт сам специалист или его организация. Наш рычаг — объём: мы закупаем оптом, поэтому требования к качеству закреплены в договоре, а оценки участников из приложения решают, продлевать его или нет.",
  },
  {
    q: "Что происходит с моими данными?",
    a: "Сейчас, на этапе ранней регистрации, мы собираем только контактные данные и храним их у поставщика сервиса — чтобы связаться с вами по программе Rosetto. Мы их не продаём. До запуска мы опубликуем полное описание обработки: каким партнёрам и какие данные передаются, на каком основании и как долго хранятся. Данные удаляем по запросу — кроме тех, которые обязаны хранить по закону.",
  },
]

/* ── accordion item ────────────────────────────────────────────────── */
function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-gray-900 text-base">
          <TranslatedText text={q} />
        </span>
        <ChevronDown
          className={`h-5 w-5 text-[#B22234] flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">
            <TranslatedText text={a} />
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── page ──────────────────────────────────────────────────────────── */
export default function RosettoFaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-white">

      {/* ══════ HERO ══════ */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-[#6B0000]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4a0000] via-[#8B0000] to-[#B22234]" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,215,0,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,.6) 1px,transparent 1px)", backgroundSize: "48px 48px" }}
        />
        <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#FFD700]/6 blur-3xl pointer-events-none" />

        <Link
          href="/rosetto/programme"
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-white/80 hover:text-white bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <TranslatedText text="Планы участия" />
        </Link>

        <motion.div
          className="relative z-10 container mx-auto max-w-4xl px-4"
          initial="hidden" animate="visible" variants={stagger}
        >
          <motion.p variants={fadeUp} className="text-[#FFD700] uppercase tracking-[0.25em] text-sm font-bold mb-4">
            <TranslatedText text="Частые вопросы" />
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4">
            <TranslatedText text="Куда идут деньги и как всё устроено" />
          </motion.h1>
          <motion.div variants={barX} className="h-[3px] w-24 bg-gradient-to-r from-[#FFD700] to-[#FFC200] origin-left mb-6" />
          <motion.p variants={fadeUp} className="text-lg text-white/75 max-w-2xl leading-relaxed">
            <TranslatedText text="Честный ответ на главный вопрос любого членства: за что именно вы платите. Плюс то, как выглядит подключение — шаг за шагом, без сюрпризов." />
          </motion.p>
        </motion.div>
      </section>

      {/* ══════ WHERE THE MONEY GOES ══════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
              <TranslatedText text="Взнос" />
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              <TranslatedText text="Куда идут деньги" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left mb-6" />
            <motion.p variants={fadeUp} className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <TranslatedText text="Взнос не уходит в общий котёл. Он покрывает конкретные статьи расходов — и каждая из них видна в ежемесячном отчёте." />
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {spending.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={i} variants={fadeIn}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-[#B22234]/20 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#B22234]/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-[#B22234]" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    <TranslatedText text={s.titleKey} />
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    <TranslatedText text={s.descKey} />
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════ COMPARISON ══════ */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
              <TranslatedText text="Сравнение" />
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              <TranslatedText text="Сейчас и в общине" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left mb-6" />
            <motion.p variants={fadeUp} className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <TranslatedText text="Считать стоит не только деньги. Время и количество вещей, которые приходится держать в голове, обычно стоят дороже." />
            </motion.p>
          </motion.div>

          {/* legend — identity never rests on colour alone */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-6 mb-10"
          >
            <span className="inline-flex items-center gap-2 text-sm text-gray-600">
              <span className="w-3 h-3 rounded-sm" style={{ background: NOW_COLOR }} aria-hidden="true" />
              <TranslatedText text="Сейчас, по отдельности" />
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-gray-600">
              <span className="w-3 h-3 rounded-sm" style={{ background: ROSETTO_COLOR }} aria-hidden="true" />
              <TranslatedText text="Через Rosetto" />
            </span>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="space-y-5">
            {comparison.map((c, i) => {
              const max = Math.max(c.now, c.ros)
              const pct = (v: number) => `${Math.max((v / max) * 100, 7)}%`
              return (
                <motion.div
                  key={i} variants={fadeUp}
                  className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm"
                >
                  <h3 className="font-bold text-gray-900 mb-1"><TranslatedText text={c.labelKey} /></h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5"><TranslatedText text={c.subKey} /></p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        {/* 20px bar, 4px rounded data-end, square at the baseline */}
                        <div
                          className="h-5 rounded-r"
                          style={{ background: NOW_COLOR, width: pct(c.now) }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap w-36 text-right">
                        <TranslatedText text={c.nowLabelKey} />
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div
                          className="h-5 rounded-r"
                          style={{ background: ROSETTO_COLOR, width: pct(c.ros) }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap w-36 text-right">
                        <TranslatedText text={c.rosLabelKey} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.p
            initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp}
            className="text-center text-gray-500 text-xs leading-relaxed mt-6 max-w-xl mx-auto"
          >
            <TranslatedText text="Пример расчёта для одного человека, чтобы показать порядок величин. Окончательные цены мы объявим до запуска — и посчитаем вместе с вами на созвоне под ваш состав семьи." />
          </motion.p>

          {/* situation → now → community */}
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="mt-14">
            <motion.h3 variants={fadeUp} className="text-xl font-black text-gray-900 mb-6 text-center">
              <TranslatedText text="Одна и та же ситуация" />
            </motion.h3>
            <div className="space-y-4">
              {scenarios.map((s, i) => (
                <motion.div
                  key={i} variants={fadeUp}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <p className="font-bold text-gray-900 px-6 pt-5 pb-4">
                    <TranslatedText text={s.situationKey} />
                  </p>
                  <div className="grid sm:grid-cols-2 border-t border-gray-100">
                    <div className="p-6 sm:border-r border-gray-100">
                      <p className="uppercase tracking-[0.18em] text-[11px] font-bold mb-2" style={{ color: NOW_COLOR }}>
                        <TranslatedText text="Сейчас" />
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed"><TranslatedText text={s.nowKey} /></p>
                    </div>
                    <div className="p-6 border-t sm:border-t-0 border-gray-100 bg-[#B22234]/[0.03]">
                      <p className="uppercase tracking-[0.18em] text-[11px] font-bold mb-2" style={{ color: ROSETTO_COLOR }}>
                        <TranslatedText text="В общине" />
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed"><TranslatedText text={s.communityKey} /></p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ TRANSPARENCY ══════ */}
      <section className="py-24 bg-gradient-to-br from-[#6B0000] via-[#B22234] to-[#8B0000] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,215,0,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,.5) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute -bottom-28 -left-28 w-[460px] h-[460px] rounded-full bg-[#FFD700]/6 blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-4xl px-4 relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
            <motion.div variants={fadeIn} className="w-16 h-16 rounded-2xl bg-[#FFD700]/15 flex items-center justify-center mx-auto mb-6">
              <Receipt className="h-8 w-8 text-[#FFD700]" />
            </motion.div>
            <motion.p variants={fadeUp} className="text-[#FFD700] uppercase tracking-[0.25em] text-sm font-bold mb-3">
              <TranslatedText text="Прозрачность" />
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-white mb-5">
              <TranslatedText text="Ежемесячный отчёт — прямо в приложении" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left mb-7" />
            <motion.p variants={fadeUp} className="text-white/80 leading-relaxed max-w-2xl mx-auto mb-10">
              <TranslatedText text="Каждый месяц в приложении появляется отчёт: сколько собрано, сколько и на что потрачено — координатор, автопарк, страховка, специалисты, связь, администрирование. Ничего не нужно запрашивать и никого не нужно об этом просить: отчёт публикуется сам и виден всем участникам." />
            </motion.p>

            <motion.div variants={stagger} className="grid sm:grid-cols-3 gap-4 text-left">
              {[
                "Полная расшифровка по каждой статье расходов",
                "Отчёт виден всем участникам, а не только по запросу",
                "Вопросы по любой строке можно задать координатору",
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="flex gap-3 bg-white/10 rounded-xl p-5 border border-[#FFD700]/20">
                  <Check className="h-4 w-4 text-[#FFD700] flex-shrink-0 mt-1" />
                  <span className="text-white/85 text-sm leading-relaxed">
                    <TranslatedText text={item} />
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════ ONBOARDING ══════ */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
              <TranslatedText text="Подключение" />
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              <TranslatedText text="Как выглядит процесс" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left mb-6" />
            <motion.p variants={fadeUp} className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <TranslatedText text="Пять шагов от первого разговора до работающего приложения. Ничего не подписывается и не оплачивается до того, как вы увидите условия." />
            </motion.p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#B22234] via-[#FFD700] to-[#B22234] opacity-25 hidden sm:block" />
            <div className="space-y-5">
              {onboarding.map((s, i) => {
                const Icon = s.icon
                return (
                  <motion.div
                    key={i}
                    initial="hidden" whileInView="visible" viewport={vp} variants={slideL}
                    className="relative flex flex-col sm:flex-row gap-5 items-start"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#B22234] border-4 border-gray-50 shadow-md flex items-center justify-center flex-shrink-0 z-10">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-black text-[#FFD700] leading-none">{s.n}</span>
                        <h3 className="font-bold text-gray-900 text-lg">
                          <TranslatedText text={s.titleKey} />
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        <TranslatedText text={s.descKey} />
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ AFTER ACCESS ══════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
              <TranslatedText text="После подключения" />
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              <TranslatedText text="Что происходит дальше" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left" />
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {afterAccess.map((a, i) => {
              const Icon = a.icon
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
                    <h3 className="font-bold text-gray-900 mb-2">
                      <TranslatedText text={a.titleKey} />
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      <TranslatedText text={a.descKey} />
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto max-w-3xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
              <TranslatedText text="Ещё вопросы" />
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              <TranslatedText text="Коротко и по делу" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left" />
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="space-y-3"
          >
            {faq.map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <FaqItem
                  q={item.q}
                  a={item.a}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
            <motion.div variants={fadeIn} className="w-14 h-14 rounded-2xl bg-[#B22234]/10 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="h-7 w-7 text-[#B22234]" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              <TranslatedText text="Остались вопросы?" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left mb-6" />
            <motion.p variants={fadeUp} className="text-gray-600 text-lg mb-9 max-w-xl mx-auto leading-relaxed">
              <TranslatedText text="Напишите или позвоните — ответим без формальностей. Или оставьте заявку: разберём вашу ситуацию на созвоне, это ни к чему не обязывает." />
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center mb-10">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/rosetto/programme#register">
                  <Button className="bg-[#B22234] hover:bg-[#8e1c29] text-white font-bold px-10 py-6 text-base rounded-xl shadow-md">
                    <TranslatedText text="Записаться в лист ожидания" />
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/rosetto/programme">
                  <Button variant="outline" className="border-[#B22234] text-[#B22234] hover:bg-[#B22234] hover:text-white px-10 py-6 text-base rounded-xl">
                    <TranslatedText text="Смотреть планы участия" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={stagger} className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                variants={fadeIn}
                href="tel:+37120172714"
                className="flex items-center justify-center gap-3 bg-gray-50 rounded-xl px-6 py-4 border border-gray-200 hover:border-[#B22234]/40 text-gray-700 transition-colors"
              >
                <Phone className="h-4 w-4 text-[#B22234]" />
                <span className="font-medium text-sm">+371 2017-2714</span>
              </motion.a>
              <motion.a
                variants={fadeIn}
                href="mailto:rosetto@maranafa.camp"
                className="flex items-center justify-center gap-3 bg-gray-50 rounded-xl px-6 py-4 border border-gray-200 hover:border-[#B22234]/40 text-gray-700 transition-colors"
              >
                <span className="font-medium text-sm">rosetto@maranafa.camp</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
