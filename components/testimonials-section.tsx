import { Card, CardContent } from "@/components/ui/card"
import { QuoteIcon } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"

const testimonials = [
  {
    quote: "Очень довольны лагерем! 3 год подряд выбираем Маранафу!",
    author: "Снежанна",
  },
  {
    quote:
      "Очень здорово, что есть Замечательный Лагерь, где детей учат навыкам морали и ответственности!!! Это место, где обретают Друзей и Самого Главного Друга - ИИСУСА!!!",
    author: "Юлия",
  },
  {
    quote: "Маранафа Самый лучший лагерь! Уважаемые работники и вожатые лагеря! От всей души спасибо Вам за все!",
    author: "Карина",
  },
  {
    quote: "Супер марафон, а точнее сказать, лучший! Мой ребенок счастлив!",
    author: "Татьяна",
  },
  {
    quote: "Мы с Украины, в лагере Маранафа первый раз, восторг, большое спасибо всей команде!",
    author: "Ира",
  },
  {
    quote: "Спасибо за такое разностороннее развитие в лагере 'Маранафа'! Для сына этот лагерь был незабываемым!",
    author: "Ира Ю.",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            <TranslatedText text="Отзывы" />
          </h2>
          <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-50 border-none shadow-sm">
              <CardContent className="pt-6">
                <QuoteIcon className="h-8 w-8 text-[#FFD700] mb-4" />
                <p className="text-gray-700 mb-6 italic">
                  "<TranslatedText text={testimonial.quote} />"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#B22234] flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      <TranslatedText text={testimonial.author} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
