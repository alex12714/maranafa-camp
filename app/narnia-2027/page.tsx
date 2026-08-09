"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users, ArrowLeft, Crown } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"
import EventRegistrationForm from "@/components/event-registration-form"

// TODO(copy): venue, price and the daily programme are placeholders until the
// camp team confirms them. Dates and theme are final.
const EVENT_DATE = "28 июня – 4 июля 2027"
const EVENT_WEEKDAY = "Понедельник – воскресенье"

const highlights = [
  {
    emoji: "🐴",
    title: "Лошади",
    desc: "Настоящие кони, верховая езда и рыцарские выезды — для многих это будет первый раз в жизни",
  },
  {
    emoji: "🧥",
    title: "Костюмы",
    desc: "Каждый получает своё облачение: плащи, туники, доспехи. Всю неделю мы живём в Нарнии, а не просто играем в неё",
  },
  {
    emoji: "🎆",
    title: "Фейерверк",
    desc: "Финальный салют над лагерем — тот самый момент, о котором дети рассказывают весь следующий год",
  },
  {
    emoji: "🔥",
    title: "Фаер-шоу",
    desc: "Огненное представление в ночи: свет, музыка и мастера огня",
  },
  {
    emoji: "📖",
    title: "Библейские герои",
    desc: "Каждый день — новый герой Писания и его выбор: мужество, верность, прощение, жертва",
  },
  {
    emoji: "👑",
    title: "Церемония коронации",
    desc: "В последний вечер каждый ребёнок выходит к трону и получает корону — как сыновья и дочери Царя",
  },
]

export default function Narnia2027Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/events/narnia-2027.svg"
          alt="Лагерь «Возвращение Нарнии» — 28 июня – 4 июля 2027"
          fill
          className="object-contain object-center bg-[#0b1e3a]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white bg-black/30 rounded-full px-4 py-2 backdrop-blur-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <TranslatedText text="На главную" />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="container mx-auto max-w-5xl">
            <p className="text-[#FFD700] font-medium uppercase tracking-wider text-sm mb-2">
              <TranslatedText text="Детский летний лагерь" />
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
              <TranslatedText text="Возвращение Нарнии" />
            </h1>
            <p className="text-white/90 text-lg mb-4 max-w-3xl">
              <TranslatedText text="Неделя в мире, где зима отступает, трусость становится мужеством, а каждый ребёнок узнаёт, что он — сын или дочь Царя." />
            </p>
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <TranslatedText text={EVENT_DATE} />
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <TranslatedText text="Дети 9–15 лет" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-5xl px-4 py-12">

        {/* Date highlight */}
        <div className="bg-white rounded-xl border-l-4 border-[#B22234] shadow-sm p-5 flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="h-6 w-6 text-[#B22234]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              <TranslatedText text={EVENT_WEEKDAY} />
            </p>
            <p className="text-2xl font-bold text-gray-900">
              <TranslatedText text={EVENT_DATE} />
            </p>
            <p className="text-sm text-gray-600 mt-0.5">
              <TranslatedText text="Семь дней · место и стоимость уточняются" />
            </p>
          </div>
        </div>

        {/* Key info */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            <TranslatedText text="Важная информация" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Заезд детей" /></p>
                <p><TranslatedText text="Понедельник, 28 июня 2027" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Разъезд детей" /></p>
                <p><TranslatedText text="Воскресенье, 4 июля 2027" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Для кого" /></p>
                <p><TranslatedText text="Дети 9–15 лет" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Место" /></p>
                <p><TranslatedText text="Уточняется" /></p>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing message */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            <TranslatedText text="Шкаф снова открыт" />
          </h2>
          <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 space-y-5 text-gray-800 leading-relaxed">
            <p>
              Каждое лето лагерь «Маранафа» придумывает мир, в который можно войти по-настоящему. 👑
              В 2027 году мы открываем дверцу старого платяного шкафа — и за ней начинается Нарния.
              Не мультфильм и не книжка на полке, а целая неделя, которую ваш ребёнок проживёт внутри истории.
            </p>
            <p>
              За дверью — зима, которая слишком долго не отпускала эту землю. Нарния ждёт тех, кто
              не побоится сделать первый шаг: разведчиков, следопытов, будущих рыцарей. Дети получат
              свои <strong>костюмы</strong> — плащи, туники, доспехи — и всю неделю будут не зрителями,
              а героями. Их ждут <strong>настоящие лошади</strong>, лесные тропы, тайные знаки на деревьях
              и большая общая цель.
            </p>
            <p>
              Каждый день у нас — свой <strong>библейский герой</strong>. Мы будем говорить о мужестве
              Давида, о верности Руфи, о прощении Иосифа, о жертве Христа — и увидим, что выбор,
              который они когда-то сделали, стоит и перед нами, в лагере и дома. Нарния здесь не
              заменяет Евангелие, а помогает его услышать.
            </p>
            <p>
              А вечера будут такими, ради которых стоит ждать лета: <strong>фаер-шоу</strong> под
              звёздами, костры, музыка, и в финале — <strong>фейерверк</strong> над лагерем.
            </p>
            <p>
              И самое главное — <strong>церемония коронации</strong>. В последний вечер каждый ребёнок
              выйдет к трону и получит свою корону. Не за победу в конкурсе и не за лучшие результаты,
              а потому что так говорит о нём Бог: ты — сын, ты — дочь Царя. Многие дети запоминают
              этот момент на всю жизнь.
            </p>
            <p className="text-[#B22234] font-semibold">
              Дверь шкафа открывается 28 июня 2027 года. Мы будем ждать вашего ребёнка по ту сторону. 🦁
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <TranslatedText text="🎯 Что вас ждёт" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white rounded-xl border shadow-sm p-4">
                <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <p className="font-bold text-gray-900">
                    <TranslatedText text={item.title} />
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    <TranslatedText text={item.desc} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coronation callout */}
        <div className="bg-gradient-to-br from-[#123a63] to-[#0b1e3a] text-white rounded-xl p-6 md:p-8 mb-12">
          <div className="flex items-start gap-4">
            <Crown className="h-10 w-10 text-[#FFD700] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-2">
                <TranslatedText text="Церемония коронации" />
              </h2>
              <p className="text-white/90 leading-relaxed">
                <TranslatedText text="Последний вечер лагеря. Свечи, музыка, трон — и каждый ребёнок по имени выходит вперёд и получает корону. Не за заслуги, а потому что он принят Царём. Родители часто говорят, что именно об этом дети рассказывают дома первым делом." />
              </p>
            </div>
          </div>
        </div>

        {/* Pre-registration */}
        <div id="register" className="scroll-mt-24 bg-white rounded-xl shadow-sm border p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            <TranslatedText text="📝 Предварительная запись" />
          </h2>
          <p className="text-gray-600 mb-6">
            <TranslatedText text="Полная регистрация откроется позже. Оставьте контакты сейчас — и вы первыми узнаете о старте записи, стоимости и месте проведения." />
          </p>
          <div className="max-w-xl">
            <EventRegistrationForm
              event="narnia-2027"
              intro="Это предварительная запись, а не окончательная регистрация в лагерь"
              successMessage="Спасибо! Мы напишем вам, как только откроется полная регистрация в лагерь «Возвращение Нарнии»."
            />
          </div>
        </div>

        {/* Closing */}
        <div className="text-center py-6">
          <p className="text-xl text-gray-700 italic">
            <TranslatedText text="«Однажды король или королева Нарнии — всегда король или королева Нарнии». До встречи за дверцей шкафа! 🦁" />
          </p>
        </div>
      </div>
    </div>
  )
}
