"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TranslatedText } from "@/components/translated-text"
import OnFireForm from "@/components/onfire-form"
import { useLanguage, type Language } from "@/contexts/language-context"
import { ArrowLeft } from "lucide-react"

/**
 * Camp application. The form itself is an OnFire form (lib/onfire-forms.ts,
 * key "camp"); OnFire pushes each application into api.maranafa.camp.
 */
export default function CampRegisterPage() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/camp">
            <Button variant="ghost" className="pl-0 flex items-center text-[#B22234]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <TranslatedText text="Назад на страницу лагеря" />
            </Button>
          </Link>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
            aria-label="Language"
          >
            <option value="ru">Русский</option>
            <option value="lv">Latviešu</option>
            <option value="en">English</option>
            <option value="uk">Українська</option>
          </select>
        </div>

        <Card>
          <CardHeader className="bg-[#B22234] text-white rounded-t-lg">
            <h1 className="text-2xl font-bold text-center">
              <TranslatedText text="Регистрация в лагерь «Возвращение Нарнии»" />
            </h1>
            <p className="text-sm text-center text-white/90 mt-1">
              <TranslatedText text="28 июня – 4 июля 2027" /> · <TranslatedText text="Дети 9–15 лет" />
            </p>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <OnFireForm form="camp" title="Регистрация в лагерь «Возвращение Нарнии»" height={1400} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
