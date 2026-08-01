"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowLeft, ArrowRight, CheckCircle2, Check, Phone, Mail,
  Car, HeartPulse, Stethoscope, Scale, MessageCircle, Truck,
  Wrench, PhoneCall, Ticket, Home, Users, User, UsersRound,
  Sparkles, HelpingHand, Handshake, Headphones, CalendarCheck, BellRing,
  Smartphone, ClipboardList, ShieldCheck, ShoppingCart, Star, RefreshCw, Gauge,
  Scissors, Smile, Package, MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { TranslatedText } from "@/components/translated-text"
import { useLanguage } from "@/contexts/language-context"

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

/** Life without a community desk — the problem the membership removes. */
const painPoints = [
  "Отец упал ночью. Скорая приехала не сразу, а я узнал об этом только утром.",
  "Машина встала на трассе поздно вечером: первый эвакуатор не берёт трубку, второй называет цену, которую не с чем сравнить.",
  "Маме нужен уход днём. Сиделку ищу по объявлениям — и не знаю, кому можно доверить ключи от квартиры.",
  "Ребёнку нужен логопед. В очереди месяцы, а про частного никто не скажет, хороший он или нет.",
  "Нужен юрист на один документ — но непонятно, к кому идти и во сколько это выльется.",
]

const relief = [
  "Тревожная кнопка сама поднимает тревогу: служба мониторинга вызывает 112 и сразу оповещает близких.",
  "Эвакуатор — из приложения, по цене, согласованной заранее.",
  "Сиделку и медсестру подбираем из зарегистрированных поставщиков, по результатам оценки потребностей.",
  "Врача, логопеда и юриста бронируете в приложении — по ставке для участников.",
  "Нужен живой человек — координатор на связи, а за ним волонтёрская сеть.",
]

const appFeatures = [
  { icon: Smartphone, textKey: "Заказать услугу или вызвать помощь в пару касаний" },
  { icon: Car, textKey: "Забронировать машину из автопарка на нужные даты" },
  { icon: CalendarCheck, textKey: "Записаться к врачу, юристу или логопеду" },
  { icon: ClipboardList, textKey: "Видеть статус заявки и всю историю обращений" },
  { icon: Users, textKey: "Управлять услугами всей семьи из одного аккаунта" },
  { icon: MapPin, textKey: "Попросить о помощи с геолокацией — откликнется тот, кому по пути" },
  { icon: Headphones, textKey: "Позвать координатора, когда нужен человек, а не форма" },
]

const leverage = [
  {
    icon: ShoppingCart,
    titleKey: "Оптовая закупка вместо разовой покупки",
    descKey: "Мы приходим к поставщику не с одним клиентом, а с сотнями. Это другая цена и, что важнее, другое отношение.",
  },
  {
    icon: Gauge,
    titleKey: "Требования к качеству — в договоре",
    descKey: "С каждым поставщиком мы фиксируем требования к качеству и срокам. Их несоблюдение — основание для пересмотра условий.",
  },
  {
    icon: Star,
    titleKey: "Решают отзывы участников",
    descKey: "После каждой услуги вы оцениваете её в приложении. Мы смотрим на реальные оценки участников, а не на обещания поставщика.",
  },
  {
    icon: RefreshCw,
    titleKey: "Не справляется — меняем",
    descKey: "Поставщика, который стабильно не дотягивает до требований, мы заменяем. Искать замену самому не нужно — это наша работа.",
  },
]

const services = [
  {
    icon: Car,
    titleKey: "Доступ к автопарку",
    descKey: "Общий автопарк участников: машина, когда она нужна, без покупки второго автомобиля в семью.",
  },
  {
    icon: HeartPulse,
    titleKey: "Медицинская страховка",
    descKey: "Доступ к групповому полису лицензированного страховщика. Страхование предоставляет страховая компания — мы выступаем только страхователем группы.",
  },
  {
    icon: Stethoscope,
    titleKey: "Проверенные врачи",
    descKey: "Пул врачей и клиник, с которыми у нас есть договорённости. Услугу оказывает сам специалист, запись — прямо в приложении.",
  },
  {
    icon: Scale,
    titleKey: "Юридическая помощь",
    descKey: "Юрист для договоров, документов, споров и вопросов, в которых страшно ошибиться.",
  },
  {
    icon: MessageCircle,
    titleKey: "Логопед и детские специалисты",
    descKey: "Проверенные логопеды и специалисты по развитию детей — по договорным ставкам для участников.",
  },
  {
    icon: Truck,
    titleKey: "Эвакуатор",
    descKey: "Услуги лицензированной службы эвакуации, которые мы закупаем оптом: вызов из приложения по тарифу для участников, без поиска и торга на обочине.",
  },
  {
    icon: Wrench,
    titleKey: "Помощь на дороге",
    descKey: "Разрядился аккумулятор, пробито колесо, закрылась машина — вызов лицензированной службы, услуги которой мы закупаем оптом, по тарифу для участников.",
  },
  {
    icon: PhoneCall,
    titleKey: "Тариф Rosetto Call",
    descKey: "Корпоративный тариф оператора связи: мы как бизнес-клиент подключаем участников и выдаём SIM-карты. Услугу связи оказывает сам оператор.",
  },
  {
    icon: Ticket,
    titleKey: "Скидки на события Маранафы",
    descKey: "Льготные цены на лагерь, конференции и все остальные события Маранафы.",
  },
  {
    icon: Home,
    titleKey: "Медсестра и помощь на дому",
    descKey: "Для старшего поколения: визиты лицензированных медсестёр и помощник по дому от зарегистрированных поставщиков. Мы принимаем обращение, определяем срочность и связываем вас со специалистом.",
  },
  {
    icon: Scissors,
    titleKey: "Красота и уход",
    descKey: "Парикмахер, маникюр и массаж у мастеров, с которыми мы договорились о ставках для участников. Запись — в приложении, без обзвона и поиска свободного окна.",
  },
  {
    icon: Smile,
    titleKey: "Стоматология",
    descKey: "Зубная клиника-партнёр: плановый осмотр и лечение по ставкам для участников, срочный приём — через координатора.",
  },
  {
    icon: Package,
    titleKey: "Пакомат и передача вещей",
    descKey: "Забрать посылку, отправить или передать вещи другому участнику — через пакомат или через того, кому по пути.",
  },
  {
    icon: BellRing,
    titleKey: "Тревожная кнопка и датчик падения",
    descKey: "Носимое устройство с кнопкой помощи и автоматическим датчиком падения. Устройство и мобильную связь обеспечиваем мы, сигнал принимает действующая лицензированная служба мониторинга: при необходимости вызывается 112 и оповещаются близкие. Это не замена скорой помощи.",
  },
]

const plans = [
  {
    value: "Solo",
    nameKey: "Rosetto Solo",
    forKey: "Молодым и тем, кто живёт один",
    priceKey: "от €20",
    perKey: "в месяц",
    featured: false,
    featuresKey: [
      "Приложение Rosetto: все услуги в одном месте",
      "Доступ к волонтёрской сети",
      "Доступ к автопарку участников",
      "Эвакуатор и помощь на дороге по тарифу для участников",
      "Тариф связи Rosetto Call",
      "Участие в групповом полисе страховщика",
      "Проверенные врачи и юрист",
      "Скидки на все события Маранафы",
    ],
  },
  {
    value: "Family",
    nameKey: "Rosetto Family",
    forKey: "Для семьи с детьми",
    priceKey: "Цена уточняется",
    perKey: "",
    featured: true,
    featuresKey: [
      "Всё из плана Solo — на всю семью",
      "Семейное участие в групповом полисе страховщика",
      "Логопед и детские специалисты",
      "Семейный тариф связи",
      "Скидки на лагерь и события для всех членов семьи",
      "Персональный координатор семьи",
      "Помощь при рождении ребёнка и в первые месяцы",
    ],
  },
  {
    value: "Family+",
    nameKey: "Rosetto Family+",
    forKey: "Семье со старшим поколением",
    priceKey: "Цена уточняется",
    perKey: "",
    featured: false,
    featuresKey: [
      "Всё из плана Family",
      "Тревожная кнопка и датчик падения с лицензированной службой мониторинга",
      "Визиты лицензированной медсестры на дом",
      "Помощник по дому — по результатам оценки потребностей",
      "Сопровождение к врачу и на процедуры",
      "Приоритетная линия поддержки",
      "Регулярные проверки благополучия старших",
    ],
  },
]

const steps = [
  {
    n: "01",
    icon: CalendarCheck,
    titleKey: "Оставьте заявку",
    descKey: "Предварительная регистрация ни к чему не обязывает. Мы свяжемся, расскажем детали и уточним, что вам нужно.",
  },
  {
    n: "02",
    icon: Handshake,
    titleKey: "Выберите план",
    descKey: "Вместе подбираем подходящий план — по составу семьи и реальным потребностям, а не по прайсу.",
  },
  {
    n: "03",
    icon: Smartphone,
    titleKey: "Получите доступ в приложение",
    descKey: "Вы получаете приложение Rosetto, где собраны все услуги, и координатора — на случай, когда нужен живой человек.",
  },
]

/* ── pre-registration form ─────────────────────────────────────────── */
function PreRegistrationForm({
  plan,
  setPlan,
}: {
  plan: string
  setPlan: (v: string) => void
}) {
  const { language, translations = {} } = useLanguage()
  const t = (s: string) => translations[s] || s

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")
  const [website, setWebsite] = useState("") // honeypot
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/rosetto-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, comment, plan, language, website }),
      })
      if (!res.ok) throw new Error("error")
      setSuccess(true)
    } catch {
      setError(t("Произошла ошибка. Попробуйте ещё раз."))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <h3 className="text-xl font-bold text-gray-900">
          <TranslatedText text="Заявка получена!" />
        </h3>
        <p className="text-gray-600 max-w-sm">
          <TranslatedText text="Мы свяжемся с вами, как только планы будут готовы к запуску — расскажем условия и ответим на вопросы." />
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot — hidden from users; bots that fill it are silently dropped */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <TranslatedText text="Имя и фамилия" /> <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234] focus:border-transparent"
          placeholder="Иван Иванов"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <TranslatedText text="Телефон" /> <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          required
          inputMode="tel"
          pattern="\+[1-9][0-9 ()\-.]{6,}"
          title="Один номер, начиная с + и кода страны, например +37120172714"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234] focus:border-transparent"
          placeholder="+371 12345678"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <TranslatedText text="Электронная почта" /> <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234] focus:border-transparent"
          placeholder="ivan@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <TranslatedText text="Интересующий план" />
        </label>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#B22234] focus:border-transparent"
        >
          <option value="Solo">{`Rosetto Solo — ${t("Молодым и тем, кто живёт один")}`}</option>
          <option value="Family">{`Rosetto Family — ${t("Для семьи с детьми")}`}</option>
          <option value="Family+">{`Rosetto Family+ — ${t("Семье со старшим поколением")}`}</option>
          <option value="Не определился">{t("Пока не определился")}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <TranslatedText text="Что для вас важнее всего?" />
        </label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234] focus:border-transparent resize-none"
          placeholder={t("Например: уход за родителями, помощь с машиной, логопед для ребёнка")}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#B22234] hover:bg-[#8e1c29] text-white py-3 rounded-lg text-base font-semibold"
      >
        {loading ? <TranslatedText text="Отправка..." /> : <TranslatedText text="Записаться в лист ожидания" />}
      </Button>

      <p className="text-xs text-gray-500 text-center leading-relaxed">
        <TranslatedText text="Это ранняя регистрация интереса: состав услуг и цены ещё уточняются. Заявка бесплатна и ни к чему не обязывает." />
      </p>
    </form>
  )
}

/* ── page ──────────────────────────────────────────────────────────── */
export default function RosettoProgrammePage() {
  const [plan, setPlan] = useState("Не определился")

  const choosePlan = (value: string) => {
    setPlan(value)
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-[80vh] flex flex-col justify-end overflow-hidden bg-[#6B0000]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4a0000] via-[#8B0000] to-[#B22234]" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,215,0,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,.6) 1px,transparent 1px)", backgroundSize: "48px 48px" }}
        />
        <div className="absolute -top-20 -right-20 w-[480px] h-[480px] rounded-full bg-[#FFD700]/6 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-[320px] h-[320px] rounded-full bg-white/3 blur-2xl pointer-events-none" />

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
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-[#FFD700]/15 border border-[#FFD700]/40 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
            <span className="text-[#FFD700] text-xs font-bold uppercase tracking-[0.2em]">
              <TranslatedText text="Ранняя регистрация интереса — запуск готовится" />
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-black text-white leading-[1.05] mb-4">
            Maranafa Rosetto
          </motion.h1>
          <motion.div variants={barX} className="h-[3px] w-28 bg-gradient-to-r from-[#FFD700] to-[#FFC200] origin-left mb-7" />
          <motion.p variants={fadeUp} className="text-xl md:text-2xl text-white/80 max-w-2xl leading-relaxed mb-6">
            <TranslatedText text="Все услуги — в одном приложении. И община, которая рядом, когда нужен человек." />
          </motion.p>
          <motion.p variants={fadeUp} className="text-base text-white/65 max-w-2xl leading-relaxed mb-9">
            <TranslatedText text="Одно членство — вместо десятка отдельных поисков, договоров и телефонных номеров. Машина, здоровье, документы, дети, забота о старших: вы заказываете и бронируете всё в приложении Rosetto, а координатор и волонтёрская сеть остаются на случай, когда нужен человек. Сейчас мы закрепляем договорённости с партнёрами и открываем раннюю регистрацию интереса." />
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <a href="#register">
                <Button className="bg-[#FFD700] text-[#6B0000] hover:bg-[#FFC200] font-black px-9 py-5 rounded-xl text-base shadow-lg">
                  <TranslatedText text="Записаться в лист ожидания" />
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <a href="#plans">
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent px-9 py-5 rounded-xl text-base">
                  <TranslatedText text="Смотреть планы" />
                </Button>
              </a>
            </motion.div>
            <div className="text-white/70 text-sm">
              <TranslatedText text="Планы — от €20 в месяц" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════ SINGLE POINT OF CONTACT ══════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
              <TranslatedText text="Зачем это нужно" />
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              <TranslatedText text="Одно приложение вместо десяти телефонных номеров" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left mb-6" />
            <motion.p variants={fadeUp} className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <TranslatedText text="Почти всё из этого решаемо. Сложно другое — в нужный момент знать, к кому идти, сколько это стоит и можно ли этому человеку доверять. Обычно это выясняется в самый плохой день." />
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* before */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={vp} variants={slideL}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
            >
              <p className="text-gray-500 uppercase tracking-[0.2em] text-xs font-bold mb-5">
                <TranslatedText text="Как обычно" />
              </p>
              <ul className="space-y-4">
                {painPoints.map((p, i) => (
                  <li key={i} className="flex gap-3 text-gray-600 text-sm leading-relaxed">
                    <span className="text-gray-300 font-black flex-shrink-0">—</span>
                    <span className="italic"><TranslatedText text={p} /></span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* after */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={vp} variants={slideR}
              className="bg-gradient-to-br from-[#6B0000] to-[#B22234] rounded-2xl p-8 text-white relative overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#FFD700]/8 blur-2xl pointer-events-none" />
              <p className="text-[#FFD700] uppercase tracking-[0.2em] text-xs font-bold mb-5 relative z-10">
                <TranslatedText text="С Rosetto" />
              </p>
              <ul className="space-y-4 relative z-10">
                {relief.map((r, i) => (
                  <li key={i} className="flex gap-3 text-white/85 text-sm leading-relaxed">
                    <Check className="h-4 w-4 text-[#FFD700] flex-shrink-0 mt-0.5" />
                    <span><TranslatedText text={r} /></span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* volunteer network callout */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={fadeIn}
            className="mt-8 flex flex-col sm:flex-row items-center gap-6 bg-[#FFD700]/8 border border-[#FFD700]/40 rounded-2xl p-7"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#B22234]/10 flex items-center justify-center flex-shrink-0">
              <HelpingHand className="h-7 w-7 text-[#B22234]" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-bold text-gray-900 mb-1">
                <TranslatedText text="За приложением стоят живые люди" />
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                <TranslatedText text="Приложение закрывает всё, что можно заказать. Но не всё решается заказом: подвезти, забрать, встретить, передать вещи, посидеть с детьми. Для этого в приложении есть запрос о помощи: вы описываете, что нужно, и делитесь геолокацией — запрос видят участники рядом, и откликается тот, кому по пути. Никто никому не обязан: помогает тот, у кого есть возможность." />
              </p>
            </div>
          </motion.div>

          {/* Quiet nudge — the list above should do the persuading, not us. */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp}
            className="mt-10 text-center"
          >
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-5">
              <TranslatedText text="Если хотя бы одно из этого вам знакомо — оставьте заявку. Мы напишем, когда всё будет готово, и вы решите тогда." />
            </p>
            <a href="#register" className="inline-flex items-center gap-2 text-[#B22234] hover:text-[#8e1c29] font-semibold transition-colors">
              <TranslatedText text="Оставить заявку — это бесплатно" />
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══════ THE APP ══════ */}
      <section className="py-24 bg-gradient-to-br from-[#6B0000] via-[#B22234] to-[#8B0000] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,215,0,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,.5) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#FFD700]/6 blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-[#FFD700] uppercase tracking-[0.25em] text-sm font-bold mb-3">
              <TranslatedText text="Приложение Rosetto" />
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-white mb-4">
              <TranslatedText text="Всё в одном месте" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left mb-6" />
            <motion.p variants={fadeUp} className="text-white/75 max-w-2xl mx-auto leading-relaxed">
              <TranslatedText text="Доступ ко всем услугам — через приложение: заказать, забронировать и отследить, не разыскивая ничьи телефоны. Координатор никуда не девается — но звонить ему нужно только тогда, когда действительно нужен человек." />
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {appFeatures.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i} variants={fadeIn}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-[#FFD700]/20 hover:border-[#FFD700]/45 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#FFD700]/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-[#FFD700]" />
                  </div>
                  <p className="text-white/85 text-sm leading-relaxed">
                    <TranslatedText text={f.textKey} />
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════ WHAT'S INCLUDED ══════ */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
              <TranslatedText text="Что войдёт" />
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              <TranslatedText text="Доступ ко всему сразу" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left mb-6" />
            <motion.p variants={fadeUp} className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <TranslatedText text="Состав услуг различается по планам. Сейчас мы закрепляем договорённости с партнёрами и специалистами — окончательный список и условия подтвердим до запуска." />
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {services.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={i} variants={fadeIn}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#B22234]/20 hover:shadow-md transition-all"
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

          {/* Honest status of the offering — nothing here is contracted yet. */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={fadeIn}
            className="mt-8 flex flex-col sm:flex-row items-center gap-6 bg-white border border-[#B22234]/25 rounded-2xl p-7"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
              <CalendarCheck className="h-7 w-7 text-[#B22234]" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-bold text-gray-900 mb-1">
                <TranslatedText text="Договорённости закрепляются сейчас" />
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                <TranslatedText text="Это состав, который мы формируем к запуску. По каждой услуге мы согласовываем партнёра, условия и цену — и подтвердим окончательный список до старта. Участники ранней регистрации узнают об этом первыми." />
              </p>
            </div>
          </motion.div>

          {/* Who actually delivers what — stated once, plainly. */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={fadeIn}
            className="mt-5 flex flex-col sm:flex-row items-center gap-6 bg-white border border-gray-200 rounded-2xl p-7"
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-7 w-7 text-gray-500" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-bold text-gray-900 mb-1">
                <TranslatedText text="Все услуги оказывают лицензированные партнёры" />
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                <TranslatedText text="Мы не являемся страховщиком, оператором связи, медицинским учреждением или охранной службой. Страхование предоставляет лицензированный страховщик, связь — оператор, медицинскую помощь — лицензированные специалисты, эвакуацию и помощь на дороге — лицензированная служба, приём сигнала тревожной кнопки — действующая служба мониторинга. Наша роль — закупать услуги у лицензированных поставщиков оптом, открывать к ним доступ участникам и координировать. Тревожная кнопка не заменяет скорую помощь." />
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ NEGOTIATING POWER ══════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
              <TranslatedText text="Почему это работает" />
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              <TranslatedText text="Переговорная сила общины" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left mb-6" />
            <motion.p variants={fadeUp} className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <TranslatedText text="Один человек не может диктовать поставщику условия — он просто клиент, которого легко потерять. Сотни людей вместе могут. Мы закупаем услуги оптом, и это меняет сам разговор: не мы просим об одолжении, а нас слушают." />
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {leverage.map((l, i) => {
              const Icon = l.icon
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
                    <h3 className="font-bold text-gray-900 mb-2"><TranslatedText text={l.titleKey} /></h3>
                    <p className="text-gray-600 text-sm leading-relaxed"><TranslatedText text={l.descKey} /></p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* The review loop — the mechanism, not a promise */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={fadeIn}
            className="mt-10 bg-gradient-to-br from-[#6B0000] to-[#B22234] rounded-2xl p-8 md:p-10 text-white relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#FFD700]/8 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Star className="h-7 w-7 text-[#FFD700] flex-shrink-0" />
                <h3 className="text-2xl md:text-3xl font-black">
                  <TranslatedText text="Поставщиков выбирает община" />
                </h3>
              </div>
              <p className="text-white/80 leading-relaxed max-w-2xl mb-8">
                <TranslatedText text="Это не формальность и не «мы учитываем ваше мнение». Оценки участников — это то, по чему мы решаем, продлевать договор с поставщиком или искать другого. Решает не отдел закупок, а те, кто пользовался услугой." />
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { n: "01", t: "Вы оцениваете услугу", d: "Сразу после визита или вызова — одна оценка и, если хотите, пара слов." },
                  { n: "02", t: "Рейтинг виден всем участникам", d: "Каждый видит, как община оценивает каждого поставщика, а не только мы." },
                  { n: "03", t: "Низкий рейтинг — разговор или замена", d: "Сначала разговор с поставщиком и срок на исправление. Не исправился — меняем." },
                ].map((s, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-5 border border-[#FFD700]/20">
                    <div className="text-[#FFD700] font-black text-lg mb-2">{s.n}</div>
                    <p className="font-bold text-sm mb-2"><TranslatedText text={s.t} /></p>
                    <p className="text-white/70 text-sm leading-relaxed"><TranslatedText text={s.d} /></p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.p
            initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp}
            className="text-center text-gray-600 leading-relaxed max-w-2xl mx-auto mt-10"
          >
            <TranslatedText text="Поэтому качество здесь — не обещание на сайте, а следствие того, что поставщику есть что терять." />
          </motion.p>
        </div>
      </section>

      {/* ══════ PLANS ══════ */}
      <section id="plans" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
              <TranslatedText text="Планы участия" />
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              <TranslatedText text="Выберите свой формат" />
            </motion.h2>
            <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mx-auto origin-left mb-6" />
            <motion.p variants={fadeUp} className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <TranslatedText text="Состав услуг и окончательные цены ещё формируются; ориентир по самому простому плану — от €20 в месяц. Это ранняя регистрация интереса: заявка помогает нам понять спрос и закрепить договорённости." />
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
          >
            {plans.map((p, i) => {
              const Icon = i === 0 ? User : i === 1 ? Users : UsersRound
              return (
                <motion.div
                  key={p.value} variants={fadeIn}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={`relative rounded-2xl p-8 border-2 flex flex-col h-full ${
                    p.featured
                      ? "bg-gradient-to-br from-[#6B0000] to-[#B22234] border-[#FFD700]/50 text-white shadow-xl lg:-mt-4 lg:pb-12"
                      : "bg-white border-gray-200 hover:border-[#B22234]/30 hover:shadow-lg"
                  }`}
                >
                  {p.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFD700] text-[#6B0000] text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full whitespace-nowrap">
                      <TranslatedText text="Чаще всего выбирают" />
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${p.featured ? "bg-[#FFD700]/20" : "bg-[#B22234]/10"}`}>
                    <Icon className={`h-6 w-6 ${p.featured ? "text-[#FFD700]" : "text-[#B22234]"}`} />
                  </div>

                  <h3 className={`text-2xl font-black mb-1 ${p.featured ? "text-white" : "text-gray-900"}`}>
                    {p.nameKey}
                  </h3>
                  <p className={`text-sm mb-6 ${p.featured ? "text-white/65" : "text-gray-500"}`}>
                    <TranslatedText text={p.forKey} />
                  </p>

                  <div className="mb-6">
                    {/* A placeholder price shouldn't shout as loudly as a real number. */}
                    <div className={`${p.perKey ? "text-3xl" : "text-xl"} font-black leading-none ${p.featured ? "text-[#FFD700]" : "text-[#B22234]"}`}>
                      <TranslatedText text={p.priceKey} />
                    </div>
                    {p.perKey && (
                      <div className={`text-sm mt-1 ${p.featured ? "text-white/60" : "text-gray-500"}`}>
                        <TranslatedText text={p.perKey} />
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {p.featuresKey.map((f, j) => (
                      <li key={j} className="flex gap-3 text-sm leading-relaxed">
                        <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${p.featured ? "text-[#FFD700]" : "text-[#B22234]"}`} />
                        <span className={p.featured ? "text-white/85" : "text-gray-600"}>
                          <TranslatedText text={f} />
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => choosePlan(p.value)}
                    className={`w-full py-5 rounded-xl font-bold text-base ${
                      p.featured
                        ? "bg-[#FFD700] text-[#6B0000] hover:bg-[#FFC200]"
                        : "bg-[#B22234] text-white hover:bg-[#8e1c29]"
                    }`}
                  >
                    <TranslatedText text="Оставить заявку" />
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.p
            initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp}
            className="text-center text-gray-500 text-sm mt-10 max-w-2xl mx-auto leading-relaxed"
          >
            <TranslatedText text="Состав планов предварительный: мы закрепляем договорённости с партнёрами и подтвердим окончательные условия до запуска. Услуги для старшего поколения — визиты медсестры и помощник по дому — предоставляются по результатам индивидуальной оценки потребностей." />
          </motion.p>

          <motion.div
            initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp}
            className="text-center mt-6"
          >
            <Link href="/rosetto/faq" className="inline-flex items-center gap-2 text-[#B22234] hover:text-[#8e1c29] font-semibold transition-colors">
              <TranslatedText text="Куда идут деньги и как проходит подключение" />
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════ THREE STEPS ══════ */}
      <section className="py-24 bg-gray-50">
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
                  className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#B22234]/20 hover:shadow-md transition-all group"
                >
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

      {/* ══════ RECIPROCITY ══════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
            <div className="grid md:grid-cols-2 gap-14 items-center">
              <motion.div variants={slideL}>
                <p className="text-[#B22234] uppercase tracking-[0.25em] text-sm font-bold mb-3">
                  <TranslatedText text="Принцип" />
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
                  <TranslatedText text="Это не страховка. Это община." />
                </h2>
                <div className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] mb-6" />
                <div className="space-y-5 text-gray-600 leading-relaxed">
                  <p>
                    <TranslatedText text="Взнос покрывает работу координатора, администрирование и доступ к услугам партнёров. Но главное в Rosetto не покупается: участники подписывают договор взаимной поддержки и по мере возможности откликаются на просьбы других." />
                  </p>
                  <p>
                    <TranslatedText text="Вы помогаете другим участникам — и получаете поддержку сами, когда она нужна вам или вашей семье. Не пожертвование, а взаимность." />
                  </p>
                  <p>
                    <TranslatedText text="Именно это делали жители Розето — и именно поэтому они жили дольше и болели реже своих соседей." />
                  </p>
                </div>
                <div className="mt-8">
                  <Link href="/rosetto">
                    <Button variant="outline" className="border-[#B22234] text-[#B22234] hover:bg-[#B22234] hover:text-white rounded-xl">
                      <TranslatedText text="Читать историю Розето" />
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div variants={slideR} className="space-y-5">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <Image src="/images/features/program.webp" alt="Rosetto" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6B0000]/50 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-white font-semibold text-sm">
                      <TranslatedText text="Команда Маранафа направляет проект" />
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#6B0000] to-[#B22234] rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Handshake className="h-6 w-6 text-[#FFD700] flex-shrink-0" />
                    <h3 className="font-bold text-lg"><TranslatedText text="Двустороннее участие" /></h3>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    <TranslatedText text="Уже участвуете в проекте взаимопомощи? Запросы о помощи по-прежнему создаются в приложении Rosetto — планы участия его дополняют, а не заменяют." />
                  </p>
                  <a href="https://rosetto.maranafa.camp" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#FFD700] hover:text-[#FFC200] text-sm font-semibold mt-4 transition-colors">
                    <TranslatedText text="Открыть приложение Rosetto" />
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ PRE-REGISTRATION ══════ */}
      <section id="register" className="py-24 bg-gradient-to-br from-[#6B0000] via-[#B22234] to-[#8B0000] relative overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,215,0,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,.5) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#FFD700]/6 blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
              <motion.p variants={fadeUp} className="text-[#FFD700] uppercase tracking-[0.25em] text-sm font-bold mb-3">
                <TranslatedText text="Предварительная регистрация" />
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                <TranslatedText text="Расскажите, что вам нужно" />
              </motion.h2>
              <motion.div variants={barX} className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] to-[#FFC200] origin-left mb-6" />
              <motion.p variants={fadeUp} className="text-white/75 leading-relaxed mb-8">
                <TranslatedText text="Сейчас мы закрепляем договорённости с партнёрами и формируем первый набор участников. Оставьте заявку — как только условия будут подтверждены, мы свяжемся с вами первыми." />
              </motion.p>

              <motion.ul variants={stagger} className="space-y-3 mb-8">
                {[
                  "Заявка бесплатна и ни к чему не обязывает",
                  "Вы первыми узнаете окончательный состав услуг и цены",
                  "Ваши ответы влияют на то, какие услуги мы подключим первыми",
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeUp} className="flex gap-3 text-white/80 text-sm">
                    <Sparkles className="h-4 w-4 text-[#FFD700] flex-shrink-0 mt-0.5" />
                    <span><TranslatedText text={item} /></span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={stagger} className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  variants={fadeIn}
                  href="tel:+37120172714"
                  className="flex items-center gap-3 bg-white/8 rounded-xl px-5 py-3 border border-white/15 hover:border-[#FFD700]/40 text-white/80 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#FFD700]" />
                  <span className="font-medium text-sm">+371 2017-2714</span>
                </motion.a>
                <motion.a
                  variants={fadeIn}
                  href="mailto:rosetto@maranafa.camp"
                  className="flex items-center gap-3 bg-white/8 rounded-xl px-5 py-3 border border-white/15 hover:border-[#FFD700]/40 text-white/80 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 text-[#FFD700]" />
                  <span className="font-medium text-sm">rosetto@maranafa.camp</span>
                </motion.a>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={vp} variants={fadeIn}
              className="bg-white rounded-2xl p-8 shadow-2xl"
            >
              <PreRegistrationForm plan={plan} setPlan={setPlan} />
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  )
}
