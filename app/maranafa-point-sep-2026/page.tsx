"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users, ArrowLeft, Sparkles } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"

const EVENT_DATE = "19 сентября 2026"
const EVENT_WEEKDAY = "Суббота"

const program = [
  { emoji: "🎬", title: "Кино-вечер" },
  { emoji: "📖", title: "Библейская история", desc: "Открытия и обсуждение в кругу друзей" },
  { emoji: "🗺", title: "Планерка квестов", desc: "Подробности предстоящих приключений и возможность подключиться к подготовке" },
  { emoji: "🍽", title: "Угощения и общение", desc: "Тёплая атмосфера, чай, вкусности и душевные разговоры" },
  { emoji: "🎲", title: "Настольные игры", desc: "Для всех возрастов" },
  { emoji: "📖", title: "Закрытие субботы", desc: "Тихий совместный момент в конце вечера" },
  { emoji: "🎬", title: "Конкурс микро видео репортажей", desc: "С призами!" },
  { emoji: "🟣🔵🟡", title: "Шариковый бассейн", desc: "Радость для детей и взрослых" },
]

const gallery = [
  { src: "/images/events/mp-lights.jpg", alt: "Маранафа Point — вечерний свет и атмосфера" },
  { src: "/images/events/mp-hall-snowflakes.jpg", alt: "Зал с зимним оформлением" },
  { src: "/images/events/mp-ballpit.jpg", alt: "Шариковый бассейн" },
  { src: "/images/events/mp-lounge.jpg", alt: "Лаунж зона с диванами" },
  { src: "/images/events/mp-hall-balls.jpg", alt: "Зал с праздничными шарами" },
  { src: "/images/events/mp-kitchen.jpg", alt: "Кухонная зона" },
]

export default function MaranafaPointSepPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/events/maranafa-point.png"
          alt="Маранафа Point"
          fill
          className="object-contain object-center bg-[#1ea3d8]"
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
              <TranslatedText text="Встреча друзей Маранафа" />
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
              ⚡ <TranslatedText text="Маранафа Point" /> ⚡
            </h1>
            <p className="text-white/90 text-lg mb-4 max-w-3xl">
              <TranslatedText text="Кино, библейские истории, квесты, игры, общение и много радости — берите с собой семью, друзей и хорошее настроение!" />
            </p>
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <TranslatedText text={EVENT_DATE} />
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                16:00 – 21:00
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <TranslatedText text="Мера 36, 2 этаж" />
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
            <p className="text-sm text-gray-600 mt-0.5">16:00 – 21:00 · <TranslatedText text="Мера 36, 2 этаж" /></p>
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
                <p><TranslatedText text="Мера 36, 2 этаж, Рига" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Время" /></p>
                <p>16:00 – 21:00</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Для кого" /></p>
                <p><TranslatedText text="Для всей семьи — детей, молодёжи и взрослых" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Стоимость" /></p>
                <p><TranslatedText text="Приводишь друга — бесплатно. Один — 5 €." /></p>
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

        {/* Pricing */}
        <div className="bg-gradient-to-br from-[#B22234]/5 to-[#FFD700]/10 border border-[#B22234]/20 rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            <TranslatedText text="💰 Стоимость участия" />
          </h2>
          <ul className="space-y-3 text-gray-800">
            <li className="flex items-start gap-3">
              <span className="text-xl">👥</span>
              <span><strong><TranslatedText text="Приводишь друга — БЕСПЛАТНО!" /></strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">💸</span>
              <span><TranslatedText text="Приходишь один — всего 5 евро" /></span>
            </li>
          </ul>
        </div>

        {/* Gallery */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <TranslatedText text="📸 Атмосфера" />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="col-span-2 md:col-span-2 relative aspect-[16/9] rounded-xl overflow-hidden shadow-md">
              <Image
                src={gallery[0].src}
                alt={gallery[0].alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md">
              <Image
                src={gallery[1].src}
                alt={gallery[1].alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            {gallery.slice(2).map((img, idx) => (
              <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="text-center py-6">
          <p className="text-xl text-gray-700 italic">
            <TranslatedText text="Берите с собой семью, друзей и хорошее настроение! До встречи на Маранафа Point! 🙌" />
          </p>
        </div>
      </div>
    </div>
  )
}
