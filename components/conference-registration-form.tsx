"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TranslatedText } from "@/components/translated-text"
import { useLanguage } from "@/contexts/language-context"
import { CheckCircle2 } from "lucide-react"

type FormData = {
  fullName: string
  birthDate: string
  address: string
  phone: string
  email: string
  faith: string
  faithChurchName: string
  faithNoChurchName: string
  diet: string
  allergies: string
  allergyDetails: string
  arrivedWith: string
  heardFrom: string
  heardFromCustom: string
  expectations: string
  emergencyPhone: string
  parentalConsent: boolean
}

const initialForm: FormData = {
  fullName: "",
  birthDate: "",
  address: "",
  phone: "",
  email: "",
  faith: "",
  faithChurchName: "",
  faithNoChurchName: "",
  diet: "",
  allergies: "",
  allergyDetails: "",
  arrivedWith: "",
  heardFrom: "",
  heardFromCustom: "",
  expectations: "",
  emergencyPhone: "",
  parentalConsent: false,
}

export function ConferenceRegistrationForm() {
  const { translations = {} } = useLanguage()
  const t = (text: string) => translations[text] || text
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const update = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    // Build the fields for Airtable
    let faithValue = form.faith
    if (form.faith === "член церкви" && form.faithChurchName) {
      faithValue = `член церкви: ${form.faithChurchName}`
    } else if (form.faith === "не являюсь членом церкви" && form.faithNoChurchName) {
      faithValue = `не являюсь членом церкви: ${form.faithNoChurchName}`
    }

    let allergiesValue = form.allergies
    if (form.allergies === "есть" && form.allergyDetails) {
      allergiesValue = `есть: ${form.allergyDetails}`
    }

    let heardFromValue = form.heardFrom
    if (form.heardFrom === "свой вариант" && form.heardFromCustom) {
      heardFromValue = form.heardFromCustom
    }

    const payload = {
      records: [
        {
          fields: {
            "Фамилия имя": form.fullName,
            "Дата рождения": form.birthDate,
            "Адрес проживания": form.address,
            "Телефон": form.phone,
            "Электронная почта": form.email,
            "Вероисповедание": faithValue,
            "Тип питания": form.diet,
            "Аллергии": allergiesValue,
            "Я приехал": form.arrivedWith,
            "Как узнал о конференции": heardFromValue,
            "Ожидания от конференции": form.expectations,
            "Контактный телефон экстренный": form.emergencyPhone,
            "Разрешение родителей": form.parentalConsent ? "Да" : "",
          },
        },
      ],
    }

    try {
      const res = await fetch("/api/conference-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Registration failed")
      setSubmitted(true)
    } catch {
      setError(t("Произошла ошибка при отправке. Попробуйте ещё раз."))
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-16 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            <TranslatedText text="Спасибо за регистрацию!" />
          </h3>
          <p className="text-gray-600">
            <TranslatedText text="Мы скоро свяжемся с вами" />
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="bg-[#B22234] text-white rounded-t-lg">
        <h2 className="text-2xl font-bold text-center">
          <TranslatedText text="Анкета регистрации" />
        </h2>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Full name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText text="Фамилия и имя" /> *
            </label>
            <Input
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder={t("Введите фамилию и имя")}
            />
          </div>

          {/* 2. Birth date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText text="Дата рождения" /> *
            </label>
            <Input
              type="date"
              required
              value={form.birthDate}
              onChange={(e) => update("birthDate", e.target.value)}
            />
          </div>

          {/* 3. Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText text="Адрес проживания" /> *
            </label>
            <Input
              required
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder={t("Введите адрес проживания")}
            />
          </div>

          {/* 4. Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText text="Телефон" /> *
            </label>
            <Input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+371 ..."
            />
          </div>

          {/* 5. Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText text="Электронная почта" /> *
            </label>
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          {/* 6. Faith */}
          <fieldset className="space-y-2">
            <legend className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText text="Вероисповедание" /> *
            </legend>
            {[
              { value: "регулярно посещаю церковь", label: "Регулярно посещаю церковь" },
              { value: "иногда посещаю церковь", label: "Иногда посещаю церковь" },
              { value: "не посещаю церковь", label: "Не посещаю церковь" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="faith"
                  required
                  value={opt.value}
                  checked={form.faith === opt.value}
                  onChange={(e) => update("faith", e.target.value)}
                  className="accent-[#B22234]"
                />
                <span className="text-sm text-gray-700">
                  <TranslatedText text={opt.label} />
                </span>
              </label>
            ))}
            {/* Church member with text */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="faith"
                required
                value="член церкви"
                checked={form.faith === "член церкви"}
                onChange={(e) => update("faith", e.target.value)}
                className="accent-[#B22234]"
              />
              <span className="text-sm text-gray-700">
                <TranslatedText text="Член церкви" />
              </span>
            </label>
            {form.faith === "член церкви" && (
              <Input
                className="ml-6 max-w-xs"
                value={form.faithChurchName}
                onChange={(e) => update("faithChurchName", e.target.value)}
                placeholder={t("Название церкви")}
              />
            )}
            {/* Not a church member with text */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="faith"
                required
                value="не являюсь членом церкви"
                checked={form.faith === "не являюсь членом церкви"}
                onChange={(e) => update("faith", e.target.value)}
                className="accent-[#B22234]"
              />
              <span className="text-sm text-gray-700">
                <TranslatedText text="Не являюсь членом церкви" />
              </span>
            </label>
            {form.faith === "не являюсь членом церкви" && (
              <Input
                className="ml-6 max-w-xs"
                value={form.faithNoChurchName}
                onChange={(e) => update("faithNoChurchName", e.target.value)}
                placeholder={t("Укажите конфессию или деноминацию")}
              />
            )}
          </fieldset>

          {/* 7. Diet */}
          <fieldset className="space-y-2">
            <legend className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText text="Тип питания" /> *
            </legend>
            {[
              { value: "общий", label: "Общий" },
              { value: "вегетарианский", label: "Вегетарианский" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="diet"
                  required
                  value={opt.value}
                  checked={form.diet === opt.value}
                  onChange={(e) => update("diet", e.target.value)}
                  className="accent-[#B22234]"
                />
                <span className="text-sm text-gray-700">
                  <TranslatedText text={opt.label} />
                </span>
              </label>
            ))}
          </fieldset>

          {/* 8. Allergies */}
          <fieldset className="space-y-2">
            <legend className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText text="Аллергии" /> *
            </legend>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="allergies"
                required
                value="нет"
                checked={form.allergies === "нет"}
                onChange={(e) => update("allergies", e.target.value)}
                className="accent-[#B22234]"
              />
              <span className="text-sm text-gray-700">
                <TranslatedText text="Нет" />
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="allergies"
                required
                value="есть"
                checked={form.allergies === "есть"}
                onChange={(e) => update("allergies", e.target.value)}
                className="accent-[#B22234]"
              />
              <span className="text-sm text-gray-700">
                <TranslatedText text="Есть" />
              </span>
            </label>
            {form.allergies === "есть" && (
              <Input
                className="ml-6"
                value={form.allergyDetails}
                onChange={(e) => update("allergyDetails", e.target.value)}
                placeholder={t("Укажите аллергии")}
              />
            )}
          </fieldset>

          {/* 9. Arrived with */}
          <fieldset className="space-y-2">
            <legend className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText text="Я приехал" /> *
            </legend>
            {[
              { value: "один", label: "Один / одна" },
              { value: "с друзьями", label: "С друзьями" },
              { value: "с супругом", label: "С супругом / супругой" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="arrivedWith"
                  required
                  value={opt.value}
                  checked={form.arrivedWith === opt.value}
                  onChange={(e) => update("arrivedWith", e.target.value)}
                  className="accent-[#B22234]"
                />
                <span className="text-sm text-gray-700">
                  <TranslatedText text={opt.label} />
                </span>
              </label>
            ))}
          </fieldset>

          {/* 10. How did you hear */}
          <fieldset className="space-y-2">
            <legend className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText text="Как узнал о конференции" /> *
            </legend>
            {[
              { value: "реклама в Instagram", label: "Реклама в Instagram" },
              { value: "реклама в Facebook", label: "Реклама в Facebook" },
              { value: "от друзей", label: "От друзей" },
              { value: "в церкви", label: "В церкви" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="heardFrom"
                  required
                  value={opt.value}
                  checked={form.heardFrom === opt.value}
                  onChange={(e) => update("heardFrom", e.target.value)}
                  className="accent-[#B22234]"
                />
                <span className="text-sm text-gray-700">
                  <TranslatedText text={opt.label} />
                </span>
              </label>
            ))}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="heardFrom"
                required
                value="свой вариант"
                checked={form.heardFrom === "свой вариант"}
                onChange={(e) => update("heardFrom", e.target.value)}
                className="accent-[#B22234]"
              />
              <span className="text-sm text-gray-700">
                <TranslatedText text="Свой вариант" />
              </span>
            </label>
            {form.heardFrom === "свой вариант" && (
              <Input
                className="ml-6"
                value={form.heardFromCustom}
                onChange={(e) => update("heardFromCustom", e.target.value)}
                placeholder={t("Укажите свой вариант")}
              />
            )}
          </fieldset>

          {/* 11. Expectations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText text="Что ожидаешь от конференции" />
            </label>
            <Textarea
              value={form.expectations}
              onChange={(e) => update("expectations", e.target.value)}
              placeholder={t("Расскажите о ваших ожиданиях")}
              rows={3}
            />
          </div>

          {/* 12. Emergency phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText text="Контактный телефон в случае чрезвычайных ситуаций" /> *
            </label>
            <Input
              type="tel"
              required
              value={form.emergencyPhone}
              onChange={(e) => update("emergencyPhone", e.target.value)}
              placeholder="+371 ..."
            />
          </div>

          {/* 13. Parental consent */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.parentalConsent}
                onChange={(e) => update("parentalConsent", e.target.checked)}
                className="accent-[#B22234] mt-1"
              />
              <span className="text-sm text-gray-700">
                <TranslatedText text="Лицам младше 18 лет: У меня есть разрешение от родителей на посещение молодёжной конференции" />
              </span>
            </label>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#B22234] hover:bg-[#8e1c29] text-white py-6 text-lg"
          >
            {submitting ? (
              <TranslatedText text="Отправка..." />
            ) : (
              <TranslatedText text="Зарегистрироваться" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
