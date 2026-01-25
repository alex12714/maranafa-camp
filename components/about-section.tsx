import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, TreesIcon as Tree, Calendar } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"

export default function AboutSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            <TranslatedText text="Что такое Маранафа?" />
          </h2>
          <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
        </div>

        {/* Video Embed */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative" style={{ paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
            <iframe
              src="https://www.youtube.com/embed/KO7VG_UkHUA"
              title="Что такое Маранафа"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900">
            <TranslatedText text="Что будет в лагере?" />
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-t-4 border-t-[#B22234] hover:shadow-lg transition-shadow overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tasty-food-UWoBIgWI9oOSkQXqmTI37psz4uvdlq.webp"
                alt="Tasty Food"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
                  <Utensils className="h-5 w-5 text-[#B22234]" />
                </div>
                <CardTitle className="text-xl text-[#B22234]">
                  <TranslatedText text="Очень вкусная еда" />
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                <TranslatedText text="Отдельная команда сделает что-то, от чего дети будут в восторге. Секрет прост - это домашняя еда на природе." />
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full text-[#B22234] border-[#B22234] hover:bg-[#B22234] hover:text-white"
              >
                <TranslatedText text="УЗНАТЬ БОЛЬШЕ" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-t-4 border-t-[#B22234] hover:shadow-lg transition-shadow overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nature-jwgo86M1dBZMYBHXYXvr6bKvHA3ECa.webp"
                alt="Nature"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
                  <Tree className="h-5 w-5 text-[#B22234]" />
                </div>
                <CardTitle className="text-xl text-[#B22234]">
                  <TranslatedText text="Природа" />
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                <TranslatedText text="Специально оборудованная база для отдыха сделает отдых детей незабываемым и очень активным." />
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full text-[#B22234] border-[#B22234] hover:bg-[#B22234] hover:text-white"
              >
                <TranslatedText text="УЗНАТЬ БОЛЬШЕ" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-t-4 border-t-[#B22234] hover:shadow-lg transition-shadow overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/program-YKgxHFG8Z75tJxAPehTl5XKD7usjjd.webp"
                alt="Program"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-[#B22234]" />
                </div>
                <CardTitle className="text-xl text-[#B22234]">
                  <TranslatedText text="Программа" />
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                <TranslatedText text="Каждый год мы готовим отдельную легенду и прорабатываем все до мелочей. Мы вкладываем всё самое лучшее во время этой недели." />
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full text-[#B22234] border-[#B22234] hover:bg-[#B22234] hover:text-white"
              >
                <TranslatedText text="УЗНАТЬ БОЛЬШЕ" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
