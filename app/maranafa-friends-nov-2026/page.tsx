"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users, ArrowLeft, Sparkles } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"
import EventRegistrationForm from "@/components/event-registration-form"

// TODO(copy): dates, venue and price are placeholders until the Friends team
// confirms them. Update here and in components/upcoming-events.tsx together.
const EVENT_DATE = "13 – 15 ноября 2026"
const EVENT_WEEKDAY = "Пятница – воскресенье"
const EVENT_PLACE = "Уточняется"

const program = [
  { emoji: "🎤", title: "Общие сборы", desc: "Живая музыка, поклонение и слово каждый вечер" },
  { emoji: "📖", title: "Библейские мастерские", desc: "Разбираем тексты в небольших группах" },
  { emoji: "🗣", title: "Разговоры по душам", desc: "Время, которого обычно не хватает" },
  { emoji: "🎲", title: "Игры и активности", desc: "Командные, настольные и на свежем воздухе" },
  { emoji: "🍽", title: "Совместные трапезы", desc: "Три дня за одним столом" },
  { emoji: "🔥", title: "Вечер у огня", desc: "Истории, песни и тишина под конец дня" },
]

export default function MaranafaFriendsNovPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/events/friends-nov-2026.svg"
          alt="Маранафа Friends — осенняя встреча"
          fill
          className="object-contain object-center bg-[#f2efe9]"
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
              <TranslatedText text="Маранафа Friends" />
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
              <TranslatedText text="Осенняя встреча друзей" />
            </h1>
            <p className="text-white/90 text-lg mb-4 max-w-3xl">
              <TranslatedText text="Три дня вместе — музыка, Библия, разговоры и много смеха. Приезжайте с друзьями." />
            </p>
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <TranslatedText text={EVENT_DATE} />
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <TranslatedText text="14+ лет" />
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
              <TranslatedText text="Точное место и расписание сообщим зарегистрированным участникам" />
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
                <MapPin className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Место" /></p>
                <p><TranslatedText text={EVENT_PLACE} /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Длительность" /></p>
                <p><TranslatedText text="Три дня, с вечера пятницы до воскресенья" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Для кого" /></p>
                <p><TranslatedText text="Молодёжь и взрослые от 14 лет" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Стоимость" /></p>
                <p><TranslatedText text="Уточняется — сообщим зарегистрированным участникам" /></p>
              </div>
            </div>
          </div>
        </div>

        {/* Program */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <TranslatedText text="🎯 Что вас ждёт" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {program.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white rounded-xl border shadow-sm p-4">
                <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <p className="font-bold text-gray-900">
                    <TranslatedText text={item.title} />
                  </p>
                  {item.desc && (
                    <p className="text-sm text-gray-600 mt-0.5">
                      <TranslatedText text={item.desc} />
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration */}
        <div id="register" className="scroll-mt-24 bg-white rounded-xl shadow-sm border p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            <TranslatedText text="📝 Регистрация" />
          </h2>
          <p className="text-gray-600 mb-6">
            <TranslatedText text="Мест ограниченное количество — зарегистрируйтесь заранее, и мы пришлём все детали." />
          </p>
          <div className="max-w-xl">
            <EventRegistrationForm
              event="friends-nov-2026"
              successMessage="Мы пришлём место, расписание и стоимость, как только всё будет готово. До встречи в ноябре!"
            />
          </div>
        </div>

        {/* Closing */}
        <div className="text-center py-6">
          <p className="text-xl text-gray-700 italic">
            <TranslatedText text="Берите с собой друзей — вместе всегда лучше! 🙌" />
          </p>
        </div>
      </div>
    </div>
  )
}
