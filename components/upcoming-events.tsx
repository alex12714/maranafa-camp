"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"

const events = [
  {
    id: "friends",
    title: "Friends – Репортёры истории",
    subtitle: "Маранафа Friends",
    date: "3 – 5 апреля 2026",
    eventDate: "2026-04-03",
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
    details: "Заезд в понедельник, автобус от Базницас 12а. Разъезд 9 августа, 16:00–18:00",
    image: "/images/events/nebo-zovet.webp",
    alt: "Лагерь Небо Зовёт",
    registrationUrl: "https://airtable.com/appARC2ZsIecCWY2s/shr0CciHO8TthCjJw",
    detailsPage: null,
  },
  {
    id: "conference",
    title: "Молодёжная конференция \"Грани Будущего\"",
    subtitle: "Христианская молодёжная конференция",
    date: "11 – 14 августа 2026",
    eventDate: "2026-08-11",
    image: "/images/events/grani-budushego.webp",
    alt: "Конференция Грани Будущего",
    registrationUrl: "https://airtable.com/appARC2ZsIecCWY2s/shr0CciHO8TthCjJw",
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

export default function UpcomingEvents() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            <TranslatedText text="Предстоящие события – регистрируйтесь сейчас!" />
          </h2>
          <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {events.map((event) => (
            <Card
              key={event.id}
              className="border-t-4 border-t-[#B22234] hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
            >
              <div className="relative">
                <DaysCountdown eventDate={event.eventDate} />
                {event.detailsPage ? (
                  <Link href={event.detailsPage} className="block">
                    <div className="relative aspect-[2/3] overflow-hidden cursor-pointer">
                      <Image
                        src={event.image}
                        alt={event.alt}
                        fill
                        className="object-cover object-top transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.alt}
                      fill
                      className="object-cover object-top transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <p className="text-sm font-medium text-[#B22234] uppercase tracking-wide">
                  <TranslatedText text={event.subtitle} />
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  <TranslatedText text={event.title} />
                </h3>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-[#B22234]" />
                  <span className="text-sm font-medium">
                    <TranslatedText text={event.date} />
                  </span>
                </div>
                {event.details && (
                  <div className="flex items-start text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5 text-[#B22234]" />
                    <span className="text-sm">
                      <TranslatedText text={event.details} />
                    </span>
                  </div>
                )}
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
