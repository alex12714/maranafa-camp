import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Event data structured from the markdown
const events = [
  { year: 2017, name: "Маранафа - Павел в Римской Империи", status: "completed" },
  { year: 2018, name: "Маранафа - Путешествие в Небесную Гавань", status: "completed" },
  { year: 2019, name: "Маранафа - Назад в Будущее", status: "completed" },
  { year: 2020, name: "Маранафа - Нарния", status: "completed" },
  { year: 2021, name: "Маранафа - Королевство Л", status: "completed" },
  { year: 2022, name: "Маранафа - 7G Миссия Выполнима", status: "completed" },
  { year: 2023, name: "Маранафа - Зеркальная Страна", status: "completed" },
  { year: 2023, name: "Маранафа Друзья - Осень - Я могу", status: "completed", season: "autumn" },
  { year: 2024, name: "Маранафа Друзья - Весна - Выбор", status: "completed", season: "spring" },
  { year: 2024, name: "Маранафа - Исход из Египта: Зов Свободы", status: "completed" },
  { year: 2024, name: "Маранафа Друзья - Осень", status: "completed", season: "autumn" },
  { year: 2025, name: "Маранафа Друзья - Весна", status: "planned", season: "spring" },
  {
    year: 2025,
    name: "Маранафа - Minecraft Adventure: Эсфирь и тайна царского дворца 13-20 Jūnija",
    status: "planned",
  },
  {
    year: 2025,
    name: "Маранафа - Minecraft Adventure: Эсфирь и тайна царского дворца 8-15 Augusta",
    status: "planned",
  },
  { year: 2025, name: "Маранафа Друзья - Осень", status: "planned", season: "autumn" },
  { year: 2026, name: "Маранафа Друзья - Весна", status: "planned", season: "spring" },
  { year: 2026, name: "Маранафа - Лето", status: "planned" },
]

// Group events by year for the timeline
const eventsByYear = events.reduce(
  (acc, event) => {
    if (!acc[event.year]) {
      acc[event.year] = []
    }
    acc[event.year].push(event)
    return acc
  },
  {} as Record<number, typeof events>,
)

// Sort years in descending order (most recent first)
const sortedYears = Object.keys(eventsByYear)
  .map(Number)
  .sort((a, b) => b - a)

export default function PastEventsPage() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0 flex items-center text-[#B22234]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад на главную
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">История мероприятий Маранафа</h1>
          <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Хронология всех мероприятий Маранафа с 2017 года до наших дней
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#FFD700] md:left-1/2 md:-ml-0.5"></div>

          {/* Timeline content */}
          <div className="space-y-12">
            {sortedYears.map((year) => (
              <div key={year} className="mb-16">
                <div className="flex items-center justify-start md:justify-center mb-8">
                  <div className="z-10 flex items-center justify-center w-16 h-16 rounded-full bg-[#B22234] text-white text-xl font-bold">
                    {year}
                  </div>
                </div>

                <div className="space-y-8">
                  {eventsByYear[year].map((event, index) => (
                    <div key={index} className="relative">
                      <div className="flex flex-col md:flex-row items-start md:items-center">
                        <div className="hidden md:block md:w-1/2 md:pr-8 md:text-right">
                          {index % 2 === 0 ? (
                            <Card className="border-t-4 border-t-[#B22234] hover:shadow-lg transition-shadow">
                              <CardHeader>
                                <CardTitle className="text-xl text-[#B22234]">{event.name}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-end">
                                  {event.status === "completed" ? (
                                    <div className="flex items-center text-green-600">
                                      <CheckCircle className="h-5 w-5 mr-2" />
                                      <span>Проведено</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center text-blue-600">
                                      <Clock className="h-5 w-5 mr-2" />
                                      <span>Запланировано</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ) : null}
                        </div>

                        <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#FFD700] border-4 border-white md:mx-4">
                          <Calendar className="h-4 w-4 text-[#B22234]" />
                        </div>

                        <div className="md:w-1/2 md:pl-8">
                          {index % 2 !== 0 || !event.name ? null : (
                            <div className="md:hidden">
                              <Card className="border-t-4 border-t-[#B22234] hover:shadow-lg transition-shadow">
                                <CardHeader>
                                  <CardTitle className="text-xl text-[#B22234]">{event.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex items-center">
                                    {event.status === "completed" ? (
                                      <div className="flex items-center text-green-600">
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        <span>Проведено</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center text-blue-600">
                                        <Clock className="h-5 w-5 mr-2" />
                                        <span>Запланировано</span>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}

                          {index % 2 !== 0 ? (
                            <Card className="border-t-4 border-t-[#B22234] hover:shadow-lg transition-shadow">
                              <CardHeader>
                                <CardTitle className="text-xl text-[#B22234]">{event.name}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center">
                                  {event.status === "completed" ? (
                                    <div className="flex items-center text-green-600">
                                      <CheckCircle className="h-5 w-5 mr-2" />
                                      <span>Проведено</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center text-blue-600">
                                      <Clock className="h-5 w-5 mr-2" />
                                      <span>Запланировано</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">О программе Маранафа</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-8">
            Маранафа - это серия тематических мероприятий, которые проводятся с 1998 года. Каждое мероприятие исследует
            различные темы или истории, предоставляя участникам уникальный опыт от библейских повествований до
            фантастических миров.
          </p>
          <Button className="bg-[#B22234] hover:bg-[#8e1c29] text-white">
            <Link href="/">Вернуться на главную</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
