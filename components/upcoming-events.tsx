"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, MapPin, ChevronRight } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"

import { events, type EventItem } from "@/components/home/sections/events-data"

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

function RegistrationButton({ url }: { url: string }) {
  const isInternal = url.startsWith("/")
  if (isInternal) {
    return (
      <Button className="w-full bg-[#B22234] hover:bg-[#8e1c29] text-white" asChild>
        <Link href={url}>
          <TranslatedText text="Регистрироваться" />
        </Link>
      </Button>
    )
  }
  return (
    <Button className="w-full bg-[#B22234] hover:bg-[#8e1c29] text-white" asChild>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <TranslatedText text="Регистрироваться" />
      </a>
    </Button>
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
            <RegistrationButton url={event.registrationUrl} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function EventLineCard({ event }: { event: EventItem }) {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    event.detailsPage ? (
      <Link
        href={event.detailsPage}
        className="block bg-white border-l-4 border-[#B22234] rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
      >
        {children}
      </Link>
    ) : (
      <div className="bg-white border-l-4 border-[#B22234] rounded-lg shadow-sm">
        {children}
      </div>
    )

  return (
    <Wrapper>
      <div className="flex items-center gap-4 p-3 sm:p-4">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
          <Image
            src={event.image}
            alt={event.alt}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[#B22234] truncate">
            <TranslatedText text={event.subtitle} />
          </p>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
            <TranslatedText text={event.title} />
          </h3>
          <div className="flex items-center text-gray-600 mt-1">
            <Calendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-[#B22234]" />
            <span className="text-xs sm:text-sm font-medium">
              <TranslatedText text={event.date} />
            </span>
          </div>
          {/* The whole row is already a link to the details page, where the form
              lives — a badge rather than a nested link keeps the markup valid. */}
          {event.registrationUrl && (
            <span className="inline-block mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#B22234] bg-[#B22234]/10 rounded-full px-2 py-0.5">
              <TranslatedText text="Регистрация открыта" />
            </span>
          )}
        </div>
        {event.detailsPage && (
          <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </div>
    </Wrapper>
  )
}

// Not mounted on the current homepage (events-gallery.tsx is). Kept in step:
// pass the server-merged list (lib/onfire-events.ts mergeEvents) as `events`.
export default function UpcomingEvents({ events: list = events }: { events?: EventItem[] } = {}) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
  }, [])

  const isPast = (event: EventItem) => {
    if (now === null) return false
    const cutoff = new Date((event.endDate || event.eventDate) + "T23:59:59").getTime()
    return cutoff < now
  }

  const upcoming = list
    .filter((e) => !isPast(e))
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
  const nextThree = upcoming.slice(0, 3)
  const later = upcoming.slice(3)
  const past = list.filter((e) => isPast(e))

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {nextThree.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {later.length > 0 && (
            <div className="mt-12 max-w-3xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                <TranslatedText text="И позже в этом сезоне" />
              </h3>
              <div className="space-y-3">
                {later.map((event) => (
                  <EventLineCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
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
