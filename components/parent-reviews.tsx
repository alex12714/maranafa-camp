"use client"

// Let's update the Parent Reviews component to ensure all text is properly translated

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { TranslatedText } from "@/components/translated-text"

const reviews = [
  {
    name: "Анна К.",
    role: "Мама Миши, 12 лет",
    content:
      "Мой сын вернулся из лагеря с таким восторгом! Он нашел новых друзей, научился многим полезным навыкам и каждый день рассказывает о своих приключениях. Спасибо команде Маранафа за заботу и внимание к детям!",
    avatar: "/diverse-woman-portrait.png",
  },
  {
    name: "Сергей П.",
    role: "Отец Кати, 10 лет",
    content:
      "Дочь была в восторге от программы лагеря. Особенно ей понравились творческие мастерские и вечерние мероприятия. Она уже спрашивает, когда снова поедет в Маранафу!",
    avatar: "/thoughtful-man.png",
  },
  {
    name: "Елена В.",
    role: "Мама Димы и Саши, 9 и 11 лет",
    content:
      "Отправила двоих детей и не пожалела! Вернулись счастливые, полные впечатлений. Очень ценю христианские ценности, которые прививают в лагере. Будем ездить каждый год!",
    avatar: "/woman-with-glasses.png",
  },
]

export default function ParentReviews() {
  const [showAll, setShowAll] = useState(false)

  const displayedReviews = reviews

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            <TranslatedText text="Отзывы родителей" />
          </h2>
          <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">
            <TranslatedText text="Хотите такое своим детям? 🥳" />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {displayedReviews.map((review, index) => (
            <Card key={index} className="bg-white border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={review.avatar || "/placeholder.svg"}
                      alt={review.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      <TranslatedText text={review.name} />
                    </p>
                    <p className="text-sm text-gray-600">
                      <TranslatedText text={review.role} />
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">
                  <TranslatedText text={review.content} />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Media Reviews Images */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            <TranslatedText text="Отзывы в социальных сетях" />
          </h3>
          <div className="flex flex-col gap-6 max-w-6xl mx-auto items-center">
            <div className="bg-white rounded-lg shadow-md overflow-hidden w-4/5">
              <Image
                src="/images/reviews/review-1.webp"
                alt="Отзывы родителей в социальных сетях - часть 1"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden w-4/5">
              <Image
                src="/images/reviews/review-2.webp"
                alt="Отзывы родителей в социальных сетях - часть 2"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden w-4/5">
              <Image
                src="/images/reviews/review-3.webp"
                alt="Отзывы родителей в социальных сетях - часть 3"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden w-4/5">
              <Image
                src="/images/reviews/review-4.webp"
                alt="Отзывы родителей в социальных сетях - часть 4"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
