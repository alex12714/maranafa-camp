"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Users, ArrowLeft, Sun, Moon, Coffee, Utensils } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"
import { ConferenceRegistrationForm } from "@/components/conference-registration-form"
import { useLanguage } from "@/contexts/language-context"

const speakers = [
  { nameKey: "Олег Боков", daysKey: "11–12 августа", image: "/images/events/bokov.jpg" },
  { nameKey: "Юрий Бондаренко", daysKey: "13–14 августа", image: "/images/events/bondarenko.jpg" },
  { nameKey: "Алекс Подбрезский", daysKey: "", image: "/images/events/podbrezsky.jpg" },
  { nameKey: "Давис Трубецкойс", daysKey: "", image: "/images/events/trubeckojs.jpg" },
]

type ScheduleItem = {
  time: string
  tue: string
  wed: string
  thu: string
  fri: string
  highlight?: "morning" | "meal" | "evening" | "activity" | "night"
}

const schedule: ScheduleItem[] = [
  { time: "7:00–7:25", tue: "", wed: "Личное общение с Богом", thu: "Личное общение с Богом", fri: "Личное общение с Богом" },
  { time: "7:30–8:00", tue: "", wed: "Зарядка", thu: "Зарядка", fri: "Зарядка" },
  { time: "8:00–8:15", tue: "", wed: "Подъём", thu: "Подъём", fri: "Подъём" },
  { time: "8:20–8:50", tue: "", wed: "Взгляд в будущее", thu: "Взгляд в будущее", fri: "Взгляд в будущее", highlight: "morning" },
  { time: "9:00–9:50", tue: "", wed: "Завтрак", thu: "Завтрак", fri: "Завтрак", highlight: "meal" },
  { time: "10:00–11:00", tue: "РЕГИСТРАЦИЯ", wed: "Утренняя встреча в зале", thu: "Утренняя встреча в зале", fri: "Семинар", highlight: "morning" },
  { time: "11:15–11:55", tue: "", wed: "Семинар", thu: "Семинар", fri: "Закрытие", highlight: "activity" },
  { time: "12:05–12:45", tue: "", wed: "Семинар", thu: "", fri: "Фото / Прощание", highlight: "activity" },
  { time: "13:00–14:00", tue: "", wed: "Обед", thu: "Обед", fri: "", highlight: "meal" },
  { time: "14:00–15:00", tue: "Открытие конференции", wed: "Свободное время", thu: "Свободное время", fri: "", highlight: "morning" },
  { time: "15:00–16:00", tue: "Активити", wed: "Активити", thu: "Активити", fri: "Разъезд", highlight: "activity" },
  { time: "16:15–16:55", tue: "Семинар", wed: "Семинар", thu: "Семинар", fri: "", highlight: "activity" },
  { time: "17:10–17:50", tue: "Семинар", wed: "Свободное время", thu: "Свободное время", fri: "", highlight: "activity" },
  { time: "18:00–19:00", tue: "Ужин", wed: "Ужин", thu: "Ужин", fri: "", highlight: "meal" },
  { time: "19:10–20:40", tue: "Вечерняя встреча в зале", wed: "Вечерняя встреча в зале", thu: "Вечерняя встреча в зале", fri: "", highlight: "evening" },
  { time: "20:40–21:10", tue: "Снек — Прощание с прошлым", wed: "Снек — Прощание с прошлым", thu: "Снек — Прощание с прошлым", fri: "", highlight: "night" },
  { time: "21:10–23:00", tue: "Молитвенная тропа", wed: "Ночной поход", thu: "Костёр / Ночной волейбол", fri: "", highlight: "night" },
  { time: "23:00–0:00", tue: "Столовая, Костровая, Большой зал", wed: "Столовая, Костровая, Большой зал", thu: "Столовая, Костровая, Большой зал", fri: "", highlight: "night" },
  { time: "0:00", tue: "Отбой", wed: "Отбой", thu: "Отбой", fri: "", highlight: "night" },
]

const highlightColors: Record<string, string> = {
  morning: "bg-yellow-50",
  meal: "bg-green-50",
  evening: "bg-blue-50",
  activity: "bg-orange-50",
  night: "bg-purple-50",
}

const dayHeaders = [
  { date: "11.08", dayKey: "Вторник" },
  { date: "12.08", dayKey: "Среда" },
  { date: "13.08", dayKey: "Четверг" },
  { date: "14.08", dayKey: "Пятница" },
]

function T({ text }: { text: string }) {
  return <TranslatedText text={text} />
}

export default function ConferencePage() {
  const { translations = {} } = useLanguage()
  const t = (key: string) => translations[key] || key

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/events/grani-budushego.webp"
          alt={t("Конференция Грани Будущего")}
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
            <T text="На главную" />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="container mx-auto max-w-5xl">
            <p className="text-[#FFD700] font-medium uppercase tracking-wider text-sm mb-2">
              <T text="Христианская молодёжная конференция" />
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
              <T text="Грани Будущего" />
            </h1>
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <T text="11 – 14 августа 2026" />
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <T text="Молодёжь" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-5xl px-4 py-12">
        {/* Tagline */}
        <div className="text-center mb-12">
          <p className="text-xl md:text-2xl text-gray-700 italic">
            <T text="Воплоти мечту. Найди свой путь. Измени мир." />
          </p>
        </div>

        {/* Speakers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            <T text="Спикеры" />
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {speakers.map((speaker) => (
              <Card key={speaker.nameKey} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3">
                    <Image
                      src={speaker.image}
                      alt={t(speaker.nameKey)}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-semibold text-base text-gray-900">{t(speaker.nameKey)}</h3>
                  {speaker.daysKey && <p className="text-sm text-gray-500 mt-1">{t(speaker.daysKey)}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            <T text="Расписание" />
          </h2>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#B22234] text-white">
                  <th className="px-4 py-3 text-left font-medium w-28">
                    <T text="Время" />
                  </th>
                  {dayHeaders.map((d) => (
                    <th key={d.date} className="px-4 py-3 text-center font-medium">
                      <div>{d.date}</div>
                      <div className="text-xs text-white/70 font-normal">{t(d.dayKey)}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, i) => (
                  <tr
                    key={i}
                    className={"border-b last:border-0 " + (row.highlight ? highlightColors[row.highlight] : i % 2 === 0 ? "bg-white" : "bg-gray-50")}
                  >
                    <td className="px-4 py-2.5 font-medium text-gray-700 whitespace-nowrap">{row.time}</td>
                    <td className="px-4 py-2.5 text-center text-gray-700">{row.tue ? t(row.tue) : "—"}</td>
                    <td className="px-4 py-2.5 text-center text-gray-700">{row.wed ? t(row.wed) : "—"}</td>
                    <td className="px-4 py-2.5 text-center text-gray-700">{row.thu ? t(row.thu) : "—"}</td>
                    <td className="px-4 py-2.5 text-center text-gray-700">{row.fri ? t(row.fri) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-6">
            {dayHeaders.map((d, dayIdx) => {
              const dayKey = ["tue", "wed", "thu", "fri"][dayIdx] as "tue" | "wed" | "thu" | "fri"
              const dayItems = schedule.filter((row) => row[dayKey] && row[dayKey] !== "")
              if (dayItems.length === 0) return null
              return (
                <Card key={d.date}>
                  <CardHeader className="bg-[#B22234] text-white rounded-t-lg py-3">
                    <div className="text-center">
                      <div className="font-bold text-lg">{d.date} — {t(d.dayKey)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {dayItems.map((row, i) => (
                      <div
                        key={i}
                        className={"flex px-4 py-3 border-b last:border-0 " + (row.highlight ? highlightColors[row.highlight] : "")}
                      >
                        <span className="text-xs font-medium text-gray-500 w-24 flex-shrink-0 pt-0.5">{row.time}</span>
                        <span className="text-sm text-gray-800">{t(row[dayKey])}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Registration Form */}
        <div className="mb-12" id="register">
          <ConferenceRegistrationForm />
        </div>

        {/* CTA */}
        <div className="text-center bg-[#B22234] rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">
            <T text="Присоединяйся к конференции!" />
          </h2>
          <p className="text-white/80 mb-6">
            <T text="11 – 14 августа 2026" />
          </p>
          <Button className="bg-white text-[#B22234] hover:bg-gray-100 px-10 py-6 text-lg">
            <a href="#register">
              <T text="Регистрироваться" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
