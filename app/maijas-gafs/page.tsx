"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users, ArrowLeft, Sparkles } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"

type ScheduleItem = {
  time: string
  emoji: string
  title: string
  desc?: string
}

const schedule: ScheduleItem[] = [
  { time: "11:00", emoji: "🫧", title: "Открытие", desc: "Мыльные пузыри встречают гостей — добро пожаловать!" },
  { time: "11:15", emoji: "🏰", title: "Надувные замки", desc: "Два огромных надувных замка. Ротация по группам под живую музыку — 10 минут на группу." },
  { time: "11:30", emoji: "🗺", title: "Квест по парку (поток 1)", desc: "Команды отправляются на захватывающий квест — задания, загадки, призы." },
  { time: "12:00", emoji: "🎨", title: "Творческий кружок + литературный уголок", desc: "Поделки, рисование. Уголок с детской литературой на русском и латышском. Работает весь день." },
  { time: "13:00", emoji: "🏃", title: "Командные эстафеты", desc: "Весёлые командные конкурсы на открытой площадке." },
  { time: "14:00", emoji: "🎭", title: "Кукольный театр", desc: "Яркое кукольное представление для самых маленьких и не только." },
  { time: "14:45", emoji: "🗺", title: "Квест по парку (поток 2)", desc: "Новые команды — новые приключения по парку!" },
  { time: "15:15", emoji: "📱", title: "Kahoot — викторина", desc: "Интерактивная викторина для детей. Быстро, весело и с призами!" },
  { time: "16:00", emoji: "🎭", title: "Театральное представление «Лютер»", desc: "Центральное событие дня. Живая постановка для всей семьи." },
  { time: "16:45", emoji: "🫧", title: "Мыльные пузыри + свободная игра", desc: "Надувные замки, пузыри, общение — свободное время для всех." },
  { time: "17:00", emoji: "🎨", title: "Творческий кружок (поток 2) + эстафеты", desc: "Второй поток творческих активностей и повтор командных конкурсов." },
  { time: "17:45", emoji: "🗺", title: "Квест по парку (поток 3)", desc: "Финальный поток квеста — последний шанс пройти маршрут!" },
  { time: "18:15", emoji: "🏰", title: "Надувные замки (последний блок)", desc: "Финальный заход на замки перед закрытием детской программы." },
  { time: "18:30", emoji: "🎵", title: "Совместное пение", desc: "Живое пение — все вместе, дети и взрослые." },
  { time: "18:45", emoji: "📸", title: "Общее фото", desc: "Финальный кадр — все вместе!" },
  { time: "19:00", emoji: "🌆", title: "Завершение детской программы" },
]

const eveningProgram = [
  { emoji: "🎵", text: "Живая музыка и пение" },
  { emoji: "📱", text: "Kahoot — взрослая викторина" },
  { emoji: "💬", text: "Свободное общение" },
]

const zones = [
  { emoji: "🏰", title: "Надувные замки", desc: "2 замка, ротация групп под музыку" },
  { emoji: "🗺", title: "Квест", desc: "Маршрут по парку, задания, призы" },
  { emoji: "🎨", title: "Творческий кружок", desc: "Поделки, рисование" },
  { emoji: "📚", title: "Литературный уголок", desc: "Книги на русском и латышском" },
  { emoji: "🎭", title: "Сцена", desc: "Кукольный театр, спектакль «Лютер», пение" },
  { emoji: "📱", title: "Kahoot", desc: "Интерактивная викторина" },
  { emoji: "🫧", title: "Мыльные пузыри", desc: "Для самых маленьких" },
  { emoji: "🍦", title: "Мороженое и вода", desc: "Свободный доступ весь день" },
]

export default function MaijasGafsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/events/maijas-gafs.jpg"
          alt="Летний праздник Maijas Gafs"
          fill
          className="object-cover object-center brightness-75"
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
              <TranslatedText text="Часть фестиваля Maijas Gafs" />
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
              <TranslatedText text="🎉 Летний праздник на улице" />
            </h1>
            <p className="text-white/90 text-lg mb-4 max-w-3xl">
              <TranslatedText text="Один день — активности, творчество, театр, музыка и много радости для всей семьи!" />
            </p>
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <TranslatedText text="22 мая 2027" />
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                11:00 – 21:00
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                Ziedoņdārzs, <TranslatedText text="Рига" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-5xl px-4 py-12">

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
                <p className="font-medium text-gray-900"><TranslatedText text="Место проведения" /></p>
                <p>Ziedoņdārzs, <TranslatedText text="Рига" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Время" /></p>
                <p>11:00 – 21:00</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Для кого" /></p>
                <p><TranslatedText text="Семьи с детьми. Детская программа: 11:00–19:00" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Вход" /></p>
                <p><TranslatedText text="Свободный. Открытое мероприятие на свежем воздухе." /></p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <TranslatedText text="🎠 Программа дня" />
          </h2>
          <div className="space-y-3">
            {schedule.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 flex flex-col items-center justify-start min-w-[64px] pt-1">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs font-bold text-[#B22234] mt-1">{item.time}</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">
                    <TranslatedText text={item.title} />
                  </p>
                  {item.desc && (
                    <p className="text-gray-600 text-sm mt-1">
                      <TranslatedText text={item.desc} />
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evening */}
        <div className="bg-gradient-to-br from-[#B22234]/5 to-[#FFD700]/10 border border-[#B22234]/20 rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            <TranslatedText text="🌆 Вечерняя программа" />
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            <TranslatedText text="19:00 — 21:00" />
          </p>
          <ul className="space-y-3">
            {eveningProgram.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-800">
                <span className="text-xl">{item.emoji}</span>
                <span><TranslatedText text={item.text} /></span>
              </li>
            ))}
          </ul>
        </div>

        {/* Zones */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <TranslatedText text="🎯 Активности и зоны" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {zones.map((zone, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white rounded-xl border shadow-sm p-4">
                <span className="text-3xl flex-shrink-0">{zone.emoji}</span>
                <div>
                  <p className="font-bold text-gray-900">
                    <TranslatedText text={zone.title} />
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    <TranslatedText text={zone.desc} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            <TranslatedText text="☀️ Погода" />
          </h2>
          <p className="text-gray-700 leading-relaxed">
            <TranslatedText text="Мероприятие проходит на улице. По статистике последних лет, в конце мая в Риге — один из тёплых майских дней (+17–28°C). Оборудованы навесы и большая палатка на случай дождя." />
          </p>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            <TranslatedText text="📍 Место проведения" />
          </h2>
          <p className="text-gray-800 font-semibold text-lg">
            Ziedoņdārzs, <TranslatedText text="Рига" />
          </p>
          <p className="text-gray-600 mt-2">
            <TranslatedText text="Мероприятие проходит в рамках городского фестиваля Maijas Gafs." />
          </p>
        </div>

        {/* Closing */}
        <div className="text-center py-6">
          <p className="text-xl text-gray-700 italic">
            <TranslatedText text="Ждём вас и ваших детей! Приходите всей семьёй." />
          </p>
        </div>
      </div>
    </div>
  )
}
