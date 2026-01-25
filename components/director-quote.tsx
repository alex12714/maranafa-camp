import { TranslatedText } from "@/components/translated-text"

export default function DirectorQuote() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="text-[#B22234] text-6xl font-serif absolute -top-6 left-0">"</div>
            <blockquote className="text-2xl font-medium text-gray-900 text-center px-10 italic">
              <TranslatedText text="Летний лагерь - это прекрасная возможность вашим детям радостно и полезно отдохнуть на природе." />
            </blockquote>
            <div className="text-[#B22234] text-6xl font-serif absolute -bottom-10 right-0">"</div>
          </div>
        </div>
      </div>
    </section>
  )
}
