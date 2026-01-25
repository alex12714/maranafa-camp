import { CheckCircle } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"

const benefits = [
  "Духовное развитие и укрепление веры",
  "Новые друзья и социальные навыки",
  "Активный отдых на природе",
  "Творческое развитие",
  "Изучение Библии в интересной форме",
  "Здоровое питание",
  "Безопасная и дружелюбная среда",
  "Опытные наставники",
]

export default function BenefitsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            <TranslatedText text="Преимущества нашего лагеря" />
          </h2>
          <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start p-3">
                <CheckCircle className="h-6 w-6 text-[#B22234] mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  <TranslatedText text={benefit} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
