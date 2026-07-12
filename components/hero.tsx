import Image from "next/image"
import { TranslatedText } from "@/components/translated-text"

export default function Hero() {
  return (
    <div className="relative bg-white">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/features/top_background.webp"
          alt="Маранафа Христианский лагерь"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 sm:py-40 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block text-[#FFD700]">
              <TranslatedText text="Маранафа" />
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-xl text-white">
            <TranslatedText text="Христианские мероприятия для детей и молодёжи" />
          </p>
        </div>
      </div>
    </div>
  )
}
