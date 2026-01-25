import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TranslatedText } from "@/components/translated-text"
import Image from "next/image"

export default function ThankYouPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with background image */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/top_background-K6FRFr6idzV7UAiF4VJuWziFOUixuZ.webp"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <TranslatedText text="Спасибо за регистрацию!" />
            </h1>
            <p className="mt-6 text-xl text-gray-100">
              <TranslatedText text="Мы скоро свяжемся с вами" />
            </p>
          </div>
        </div>
      </div>

      {/* Thank you content */}
      <div className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <CheckCircle className="h-24 w-24 text-green-500" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            <TranslatedText text="Ваша регистрация успешно завершена" />
          </h2>

          <p className="text-xl text-gray-600 mb-12">
            <TranslatedText text="Наша команда рассмотрит вашу заявку и свяжется с вами в ближайшее время. Пока вы ждете, вы можете ознакомиться с информацией для родителей." />
          </p>

          <Button asChild className="bg-[#B22234] hover:bg-[#8e1c29] text-white text-lg px-8 py-6">
            <Link href="/parents">
              <TranslatedText text="Информация для родителей" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
