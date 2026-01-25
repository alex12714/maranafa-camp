import { TranslatedText } from "./translated-text"

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            <TranslatedText text="Особенности нашего лагеря" />
          </h2>
          <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            <TranslatedText text="Что делает лагерь Маранафа особенным местом для детей и подростков" />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* TASTY-FOOD Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="h-64 overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tasty-food-UWoBIgWI9oOSkQXqmTI37psz4uvdlq.webp"
                alt="Tasty Food"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#B22222] mb-2">
                <TranslatedText text="ВКУСНАЯ ЕДА" />
              </h3>
              <p className="text-gray-700">
                <TranslatedText text="Наша кухня предлагает разнообразное и здоровое питание. Мы готовим вкусные и питательные блюда из свежих продуктов, учитывая особенности и предпочтения каждого ребенка." />
              </p>
            </div>
          </div>

          {/* NATURE Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="h-64 overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nature-jwgo86M1dBZMYBHXYXvr6bKvHA3ECa.webp"
                alt="Nature"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#B22222] mb-2">
                <TranslatedText text="ПРИРОДА" />
              </h3>
              <p className="text-gray-700">
                <TranslatedText text="Лагерь расположен в живописном месте, окруженном лесом. Дети проводят много времени на свежем воздухе, участвуя в различных мероприятиях и наслаждаясь красотой природы." />
              </p>
            </div>
          </div>

          {/* PROGRAM Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="h-64 overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/program-YKgxHFG8Z75tJxAPehTl5XKD7usjjd.webp"
                alt="Program"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#B22222] mb-2">
                <TranslatedText text="ПРОГРАММА" />
              </h3>
              <p className="text-gray-700">
                <TranslatedText text="Наша программа включает в себя разнообразные активности: спортивные игры, творческие мастерские, библейские уроки, песни у костра, походы и многое другое, что делает отдых детей интересным и запоминающимся." />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
