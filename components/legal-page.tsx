"use client"

import { useLanguage, type Language } from "@/contexts/language-context"
import { EFFECTIVE_DATE_ISO, type LegalDoc } from "@/lib/legal-content"

// Renders a localized legal document (Privacy Policy / Terms). Languages with
// no translated sections (e.g. uk) fall back to the English body while keeping
// their localized title/intro.
export default function LegalPage({ doc }: { doc: Record<Language, LegalDoc> }) {
  const { language } = useLanguage()
  const localized = doc[language] ?? doc.en
  const fallback = localized.sections.length === 0 ? doc.en : localized
  const updated = new Date(EFFECTIVE_DATE_ISO).toLocaleDateString(
    language === "en" ? "en-GB" : language,
    { year: "numeric", month: "long", day: "numeric" },
  )

  return (
    <div className="flex flex-col">
      <section className="bg-[#B22234] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {localized.title}
            </h1>
            <p className="mx-auto mt-4 text-white/80">
              {localized.updatedLabel}: {updated}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {localized.intro.map((p, i) => (
            <p key={`intro-${i}`} className="text-gray-700 leading-relaxed mb-4">
              {p}
            </p>
          ))}

          {fallback.sections.map((section, si) => (
            <div key={`s-${si}`} className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
              {section.body.map((line, li) => (
                <p key={`s-${si}-${li}`} className="text-gray-700 leading-relaxed mb-3">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
