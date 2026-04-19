"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"

type EventItem = {
  id: string
  title: string
  subtitle: string
  date: string
  eventDate: string
  endDate?: string
  details?: string
  image: string
  alt: string
  registrationUrl?: string
  detailsPage?: string | null
}

const events: EventItem[] = [
  {
    id: "friends",
    title: "Friends – Репортёры истории",
    subtitle: "Маранафа Friends",
    date: "3 – 5 апреля 2026",
    eventDate: "2026-04-03",
    endDate: "2026-04-05",
    image: "/images/events/friends.webp",
    alt: "Maranafa Friends",
    registrationUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfwnCiib7B3msRUVy_jIlBwa8f9VHzOjPwzgJAdilb_c478Pg/viewform?usp=publish-editor",
    detailsPage: null,
  },
  {
    id: "camp",
    title: "Лагерь \"Небо Зовёт\"",
    subtitle: "Детский летний лагерь",
    date: "2 – 9 августа 2026",
    eventDate: "2026-08-02",
    endDate: "2026-08-09",
    details: "Заезд в понедельник, автобус от Базницас 12а. Разъезд 9 августа, 16:00–18:00",
    image: "/images/events/nebo-zovet.webp",
    alt: "Лагерь Небо Зовёт",
    registrationUrl: "https://airtable.com/appARC2ZsIecCWY2s/shr0CciHO8TthCjJw",
    detailsPage: "/camp",
  },
  {
    id: "conference",
    title: "Молодёжная конференция \"Грани Будущего\"",
    subtitle: "Христианская молодёжная конференция",
    date: "11 – 14 августа 2026",
    eventDate: "2026-08-11",
    endDate: "2026-08-14",
    image: "/images/events/grani-budushego.webp",
    alt: "Конференция Грани Будущего",
    registrationUrl: "/conference#register",
    detailsPage: "/conference",
  },
]

function DaysCountdown({ eventDate }: { eventDate: string }) {
  const [days, setDays] = useState<number | null>(null)

  useEffect(() => {
    const target = new Date(eventDate + "T00:00:00")
    const now = new Date()
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    setDays(diff)
  }, [eventDate])

  if (days === null || days < 0) return null

  return (
    <div className="absolute top-3 right-3 bg-[#B22234] text-white rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg z-10">
      <span className="text-lg font-bold leading-none">{days}</span>
      <span className="text-[10px] uppercase leading-none mt-0.5">
        <TranslatedText text="дней" />
      </span>
    </div>
  )
}

function EventCard({ event, past = false }: { event: EventItem; past?: boolean }) {
  const ImageWrapper = ({ children }: { children: React.ReactNode }) =>
    event.detailsPage ? (
      <Link href={event.detailsPage} className="block">
        <div className="relative aspect-[4/5] overflow-hidden cursor-pointer">{children}</div>
      </Link>
    ) : (
      <div className="relative aspect-[4/5] overflow-hidden">{children}</div>
    )

  return (
    <Card
      className={`border-t-4 ${past ? "border-t-gray-400 opacity-90" : "border-t-[#B22234]"} hover:shadow-xl transition-shadow overflow-hidden flex flex-col`}
    >
      <div className="relative">
        {!past && <DaysCountdown eventDate={event.eventDate} />}
        {past && (
          <div className="absolute top-3 right-3 bg-gray-700/90 text-white text-xs uppercase tracking-wide rounded-full px-3 py-1 shadow z-10">
            <TranslatedText text="Прошло" />
          </div>
        )}
        <ImageWrapper>
          <Image
            src={event.image}
            alt={event.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
            className={`object-contain transition-transform duration-300 hover:scale-105 ${past ? "grayscale-[20%]" : ""}`}
          />
        </ImageWrapper>
      </div>
      <CardHeader className="pb-2">
        <p className={`text-sm font-medium uppercase tracking-wide ${past ? "text-gray-500" : "text-[#B22234]"}`}>
          <TranslatedText text={event.subtitle} />
        </p>
        <h3 className="text-xl font-bold text-gray-900 mt-1">
          <TranslatedText text={event.title} />
        </h3>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className={`h-4 w-4 mr-2 flex-shrink-0 ${past ? "text-gray-500" : "text-[#B22234]"}`} />
          <span className="text-sm font-medium">
            <TranslatedText text={event.date} />
          </span>
        </div>
        {event.details && (
          <div className="flex items-start text-gray-600 mb-2">
            <MapPin className={`h-4 w-4 mr-2 flex-shrink-0 mt-0.5 ${past ? "text-gray-500" : "text-[#B22234]"}`} />
            <span className="text-sm">
              <TranslatedText text={event.details} />
            </span>
          </div>
        )}
        {!past && event.registrationUrl && (
          <div className="mt-auto pt-4">
            <Button className="w-full bg-[#B22234] hover:bg-[#8e1c29] text-white">
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <TranslatedText text="Регистрироваться" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function UpcomingEvents() {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
  }, [])

  const isPast = (event: EventItem) => {
    if (now === null) return false
    const cutoff = new Date((event.endDate || event.eventDate) + "T23:59:59").getTime()
    return cutoff < now
  }

  const upcoming = events.filter((e) => !isPast(e))
  const past = events.filter((e) => isPast(e))

  return (
    <>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              <TranslatedText text="Предстоящие события – регистрируйтесь сейчас!" />
            </h2>
            <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {past.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                <TranslatedText text="Прошедшие события" />
              </h2>
              <div className="mt-2 h-1 w-20 bg-gray-400 mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {past.map((event) => (
                <EventCard key={event.id} event={event} past />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
