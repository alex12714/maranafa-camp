"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, Users, ArrowLeft, BookOpen, Star } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"

const dailyThemes = [
  { date: "3.08", day: "Понедельник", theme: "Доверие", bible: "Гедеон", verse: "Будь тверд и мужествен, ибо с тобой Господь (Иисус Навин 1:9)", hero: "Мардохей" },
  { date: "4.08", day: "Вторник", theme: "Правда", bible: "Адам и Ева", verse: "Гордость предшествует падению (Притчи 16:18)", hero: "Аман" },
  { date: "5.08", day: "Среда", theme: "Воля Божья", bible: "Ровоам", verse: "Время молчать и время говорить (Екклесиаст 3:7)", hero: "Эсфирь" },
  { date: "6.08", day: "Четверг", theme: "Вера в прощенье", bible: "Пётр", verse: "Не бойся, ибо Я с тобой (Исайя 41:10)", hero: "Артаксеркс" },
  { date: "7.08", day: "Пятница", theme: "Страх", bible: "Иисус в лодке", verse: "", hero: "Иисус Христос" },
  { date: "8.08", day: "Суббота", theme: "Ожидание", bible: "2-е Пришествие", verse: "", hero: "" },
]

type ScheduleItem = {
  time: string
  activity: string
  highlight?: "morning" | "meal" | "activity" | "evening" | "night" | "bible"
}

const typicalDay: ScheduleItem[] = [
  { time: "6:30–7:00", activity: "Личное время с Богом", highlight: "morning" },
  { time: "8:00–8:30", activity: "Подъём, уборка, зарядка", highlight: "morning" },
  { time: "8:30–8:50", activity: "Утренняя история" },
  { time: "8:50–9:00", activity: "Перекличка — стих дня" },
  { time: "9:00–9:30", activity: "Завтрак", highlight: "meal" },
  { time: "9:40–10:15", activity: "Утреннее собрание стана", highlight: "bible" },
  { time: "10:20–11:05", activity: "Библейский час (подростки / младшие)", highlight: "bible" },
  { time: "11:10–12:55", activity: "Мастерклассы", highlight: "activity" },
  { time: "13:00–13:40", activity: "Обед", highlight: "meal" },
  { time: "13:45–14:55", activity: "Час привала" },
  { time: "15:00–15:55", activity: "Факультатив (Особое задание)", highlight: "activity" },
  { time: "16:00–16:25", activity: "Полдник", highlight: "meal" },
  { time: "16:30–17:50", activity: "Большая игра", highlight: "activity" },
  { time: "18:00–18:30", activity: "Ужин", highlight: "meal" },
  { time: "19:30–20:50", activity: "Вечернее собрание стана", highlight: "evening" },
  { time: "21:00", activity: "Снэк, общение в хижинах", highlight: "night" },
  { time: "22:30", activity: "Отбой", highlight: "night" },
]

const highlightColors: Record<string, string> = {
  morning: "bg-yellow-50",
  meal: "bg-green-50",
  bible: "bg-blue-50",
  activity: "bg-orange-50",
  evening: "bg-purple-50",
  night: "bg-gray-100",
}

const activities = [
  { icon: "🎨", title: "Мастерклассы", desc: "Творческие занятия на выбор" },
  { icon: "🏃", title: "Большая игра", desc: "Эстафеты, квесты, поиск сокровищ" },
  { icon: "📖", title: "Библейский час", desc: "Герои дня: Мардохей, Аман, Эсфирь, Артаксеркс" },
  { icon: "🔥", title: "Вечерние собрания", desc: "Проповеди с примерами из жизни Христа" },
  { icon: "🏕️", title: "Костёр", desc: "Откровенные разговоры и ночные походы" },
  { icon: "🎉", title: "Особые события", desc: "Конкурс красоты и талантов, ярмарка, ужин-пир" },
]

export default function CampPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/events/nebo-zovet.webp"
          alt="Лагерь Небо Зовёт"
          fill
          className="object-cover object-top brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
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
              <TranslatedText text="Небо Зовёт!" />
            </h1>
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <TranslatedText text="2 – 9 августа 2026" />
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <TranslatedText text="Дети 7–14 лет" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-5xl px-4 py-12">
        {/* Logistics */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            <TranslatedText text="Важная информация" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Заезд детей" /></p>
                <p><TranslatedText text="Понедельник, 3 августа. Автобус от Базницас 12а" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Разъезд детей" /></p>
                <p><TranslatedText text="Воскресенье, 9 августа, 16:00–18:00" /></p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Button className="bg-[#B22234] hover:bg-[#8e1c29] text-white px-10 py-6 text-lg">
              <a href="/camp/register">
                <TranslatedText text="Регистрироваться" />
              </a>
            </Button>
          </div>
        </div>

        {/* Daily Themes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            <TranslatedText text="Темы дня" />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {dailyThemes.map((d) => (
              <Card key={d.date} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-4 px-3">
                  <div className="text-xs text-gray-500 mb-1">{d.date} — {d.day}</div>
                  <h3 className="font-bold text-[#B22234] text-base mb-1">{d.theme}</h3>
                  <p className="text-xs text-gray-600 mb-2">{d.bible}</p>
                  {d.hero && (
                    <div className="inline-flex items-center gap-1 bg-[#FFD700]/20 rounded-full px-2 py-0.5">
                      <Star className="h-3 w-3 text-[#B22234]" />
                      <span className="text-xs font-medium text-gray-700">{d.hero}</span>
                    </div>
                  )}
                  {d.verse && (
                    <p className="text-[10px] text-gray-400 mt-2 italic leading-tight">{d.verse}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What to expect */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            <TranslatedText text="Что ждёт в лагере" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((a) => (
              <div key={a.title} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm border">
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{a.title}</h3>
                  <p className="text-xs text-gray-600 mt-0.5">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typical Day Schedule */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            <TranslatedText text="Типичный день" />
          </h2>
          <div className="max-w-xl mx-auto">
            <div className="rounded-lg border shadow-sm overflow-hidden">
              {typicalDay.map((item, i) => (
                <div
                  key={i}
                  className={"flex px-4 py-3 border-b last:border-0 " + (item.highlight ? highlightColors[item.highlight] : i % 2 === 0 ? "bg-white" : "bg-gray-50")}
                >
                  <span className="text-xs font-medium text-gray-500 w-28 flex-shrink-0 pt-0.5">{item.time}</span>
                  <span className="text-sm text-gray-800 font-medium">{item.activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#B22234] rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">
            <TranslatedText text="Готовься к взлёту!" />
          </h2>
          <p className="text-white/80 mb-6">
            <TranslatedText text="2 – 9 августа 2026" />
          </p>
          <Button className="bg-white text-[#B22234] hover:bg-gray-100 px-10 py-6 text-lg">
            <a href="/camp/register">
              <TranslatedText text="Поехали в лагерь" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
