import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"

export default function LimitedOfferSection() {
  return (
    <section className="py-16 bg-[#B22234]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Clock className="h-12 w-12 text-[#FFD700]" />
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            <TranslatedText text="Присоединяйтесь до 1 июня, чтобы получить скидку в 50 евро" />
          </h2>
          <p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
            <TranslatedText text="После 1го июня, скидка больше не будет доступна" />
          </p>
          <div className="mt-8">
            <Button className="bg-white text-[#B22234] hover:bg-gray-100 px-8 py-6 text-xl">
              <a
                href="https://airtable.com/appARC2ZsIecCWY2s/shr0CciHO8TthCjJw"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TranslatedText text="Поехали в лагерь" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
