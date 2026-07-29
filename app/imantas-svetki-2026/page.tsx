"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users, ArrowLeft, Sparkles, Car } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"

type Activity = {
  emoji: string
  title: string
}

const activities: Activity[] = [
  { emoji: "🎈", title: "Надувные аттракционы для детей" },
  { emoji: "🫧", title: "Шоу мыльных пузырей и аниматор" },
  { emoji: "🎁", title: "Лотерея и подарки" },
  { emoji: "🍰", title: "Мороженое для всех" },
]

export default function ImantasSvetkiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/events/imantas-svetki.webp"
          alt="Праздник открытия Общественного центра Иманты"
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
              <TranslatedText text="Бесплатный семейный праздник" />
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
              <TranslatedText text="🎉 Праздник открытия Общественного центра Иманты" />
            </h1>
            <p className="text-white/90 text-lg mb-4 max-w-3xl">
              <TranslatedText text="Надувные аттракционы, шоу мыльных пузырей, аниматор, лотерея и мороженое — приходите всей семьёй!" />
            </p>
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <TranslatedText text="19 июля 2026" />
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                16:00 – 18:00
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                Kurzemes prospekts 15
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-5xl px-4 py-12">

        {/* Post-event report */}
        <div className="bg-gradient-to-r from-[#B22234] to-[#7a0e1e] text-white rounded-xl shadow-md p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold mb-1">
              <TranslatedText text="🎉 Праздник состоялся!" />
            </p>
            <p className="text-white/85 text-sm">
              <TranslatedText text="19 июля мы вместе открыли новый центр — смотрите фотогалерею и читайте, как это было." />
            </p>
          </div>
          <Link
            href="/blog/otkrytie-centra-imanta-2026"
            className="flex-shrink-0 bg-white text-[#B22234] font-semibold px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors text-sm"
          >
            <TranslatedText text="Читать репортаж →" />
          </Link>
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
                <p className="font-medium text-gray-900"><TranslatedText text="Место проведения" /></p>
                <p><TranslatedText text="Kurzemes prospekts 15, Рига, Иманта" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Время" /></p>
                <p>16:00 – 18:00</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Для кого" /></p>
                <p><TranslatedText text="Семьи с детьми, друзья — все желающие" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Вход" /></p>
                <p><TranslatedText text="Свободный. Всё бесплатно!" /></p>
              </div>
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <TranslatedText text="🎈 Что вас ждёт" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activities.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow">
                <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                <p className="text-gray-900 font-semibold">
                  <TranslatedText text={item.title} />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Parking */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Car className="h-6 w-6 text-[#B22234]" />
            <TranslatedText text="🅿️ Парковка" />
          </h2>
          <p className="text-gray-700 leading-relaxed">
            <TranslatedText text="Автомобиль можно оставить у магазина Maxima, Slokas iela 115." />
          </p>
        </div>

        {/* Closing */}
        <div className="bg-gradient-to-br from-[#B22234]/5 to-[#FFD700]/10 border border-[#B22234]/20 rounded-xl p-8 text-center">
          <p className="text-xl md:text-2xl font-semibold text-gray-800">
            <TranslatedText text="👉 Приходите с семьёй, друзьями и детьми — всё бесплатно и весело!" />
          </p>
        </div>
      </div>
    </div>
  )
}
