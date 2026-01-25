import Image from "next/image"
import { Button } from "@/components/ui/button"
import { TranslatedText } from "@/components/translated-text"

export default function Hero() {
  return (
    <div className="relative bg-white">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/top_background-K6FRFr6idzV7UAiF4VJuWziFOUixuZ.webp"
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
            <TranslatedText text="Детский Христианский Тематический Лагерь" />
          </p>
          <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
            <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
              <Button className="flex items-center justify-center bg-[#B22234] hover:bg-[#8e1c29] text-white px-8 py-6 text-base font-medium">
                <a
                  href="https://airtable.com/appARC2ZsIecCWY2s/shr0CciHO8TthCjJw"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TranslatedText text="Регистрироваться" />
                </a>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center border-white bg-transparent text-white hover:bg-white hover:text-[#B22234] px-8 py-6 text-base font-medium"
              >
                <a href="/parents">
                  <TranslatedText text="Узнать больше" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
