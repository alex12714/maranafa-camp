"use client"

import { useState } from "react"
import { TranslatedText } from "@/components/translated-text"

export default function StaffInterviewSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            <TranslatedText text="Интервью с сотрудниками" />
          </h2>
          <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            <TranslatedText text="Узнайте больше о нашем христианском лагере и нашей миссии" />
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative pb-[56.25%] h-0">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/4GvEYKvkRTw"
              title="Маранафа Встреча Друзей"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              <TranslatedText text="Маранафа Встреча Друзей" />
            </h3>
            <p className="text-gray-700">
              <TranslatedText text="В этом видео вы можете увидеть, как проходят встречи в нашем лагере, познакомиться с нашими сотрудниками и узнать больше о духе и атмосфере Маранафы." />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
