"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TranslatedText } from "@/components/translated-text"
import { useLanguage, type Language } from "@/contexts/language-context"
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"

type FormData = {
  nameRu: string
  nameLv: string
  birthDate: string
  gender: string
  personalCode: string
  street: string
  city: string
  country: string
  parentName: string
  phone: string
  email: string
  contactChannel: string
  allergies: string
  swimming: string
  tickVaccine: string
  shirtSize: string
  believingFamily: string
  characterTraits: string
  interests: string
  instrument: string
  canBringInstrument: string
  contractMethod: string
  paperContractConsent: boolean
  dataConsent: boolean
}

const initialForm: FormData = {
  nameRu: "",
  nameLv: "",
  birthDate: "",
  gender: "",
  personalCode: "",
  street: "",
  city: "",
  country: "Latvija",
  parentName: "",
  phone: "+371",
  email: "",
  contactChannel: "",
  allergies: "",
  swimming: "",
  tickVaccine: "",
  shirtSize: "",
  believingFamily: "",
  characterTraits: "",
  interests: "",
  instrument: "",
  canBringInstrument: "",
  contractMethod: "",
  paperContractConsent: false,
  dataConsent: false,
}

const swimmingOptions = [
  { value: "excellent", label: "Очень хорошее" },
  { value: "good", label: "Хорошее" },
  { value: "medium", label: "Среднее" },
  { value: "weak", label: "Слабое" },
  { value: "none", label: "Не умеет" },
]

const tickVaccineOptions = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "Нет"]

const channelOptions = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "viber", label: "Viber" },
  { value: "sms", label: "SMS" },
  { value: "messenger", label: "FB Messenger" },
  { value: "telegram", label: "Telegram" },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#B22234] border-b border-gray-200 pb-2">
        <TranslatedText text={title} />
      </h3>
      {children}
    </div>
  )
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <TranslatedText text={label} />
        {required && " *"}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-xs text-gray-500">
          <TranslatedText text={hint} />
        </p>
      )}
    </div>
  )
}

export default function CampRegisterPage() {
  const { translations = {}, language, setLanguage } = useLanguage()
  const t = (text: string) => translations[text] || text
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.dataConsent) {
      setError(t("Необходимо согласие на обработку данных"))
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/camp-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Failed")
      }
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setError(t("Не удалось отправить регистрацию. Попробуйте позже."))
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card>
            <CardContent className="py-16 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                <TranslatedText text="Спасибо за регистрацию!" />
              </h1>
              <p className="text-gray-600 mb-6">
                <TranslatedText text="Мы получили вашу заявку и скоро свяжемся с вами по указанному каналу." />
              </p>
              <Button className="bg-[#B22234] hover:bg-[#8e1c29] text-white" asChild>
                <Link href="/">
                  <TranslatedText text="Вернуться на главную" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
              <TranslatedText text="Регистрация в лагерь Небо Зовёт" />
            </h1>
            <p className="text-sm text-center text-white/90 mt-1">
              <TranslatedText text="3 – 9 августа 2026" />
            </p>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <Section title="О ребёнке">
                <Field label="Фамилия и имя на русском" required>
                  <Input
                    required
                    value={form.nameRu}
                    onChange={(e) => update("nameRu", e.target.value)}
                    placeholder={t("Иванов Иван")}
                  />
                </Field>
                <Field label="Vārds un uzvārds latviski" required>
                  <Input
                    required
                    value={form.nameLv}
                    onChange={(e) => update("nameLv", e.target.value)}
                    placeholder={t("Ivanovs Ivans")}
                  />
                </Field>
                <Field label="Дата рождения" required>
                  <Input
                    type="date"
                    required
                    value={form.birthDate}
                    onChange={(e) => update("birthDate", e.target.value)}
                  />
                </Field>
                <Field label="Пол" required>
                  <div className="flex gap-6">
                    {[
                      { value: "girl", label: "Девочка" },
                      { value: "boy", label: "Мальчик" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          required
                          value={o.value}
                          checked={form.gender === o.value}
                          onChange={(e) => update("gender", e.target.value)}
                          className="accent-[#B22234]"
                        />
                        <span className="text-sm text-gray-700">
                          <TranslatedText text={o.label} />
                        </span>
                      </label>
                    ))}
                  </div>
                </Field>
                <Field label="Персональный код (Personas kods)">
                  <Input
                    value={form.personalCode}
                    onChange={(e) => update("personalCode", e.target.value)}
                    placeholder="123456-12345"
                  />
                </Field>
              </Section>

              <Section title="Адрес проживания">
                <Field label="Улица, дом, квартира" required>
                  <Input
                    required
                    value={form.street}
                    onChange={(e) => update("street", e.target.value)}
                    placeholder={t("Baznicas iela 12a-3")}
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Город" required>
                    <Input
                      required
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder={t("Рига")}
                    />
                  </Field>
                  <Field label="Страна" required>
                    <Input
                      required
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                    />
                  </Field>
                </div>
              </Section>

              <Section title="Контакты родителя">
                <Field label="Имя и фамилия родителя" required>
                  <Input
                    required
                    value={form.parentName}
                    onChange={(e) => update("parentName", e.target.value)}
                  />
                </Field>
                <Field label="Телефон" required>
                  <Input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+371 ..."
                  />
                </Field>
                <Field label="Электронная почта (для договора)" required>
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="parent@example.com"
                  />
                </Field>
                <Field label="Удобный канал связи" required>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {channelOptions.map((o) => (
                      <label key={o.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contactChannel"
                          required
                          value={o.value}
                          checked={form.contactChannel === o.value}
                          onChange={(e) => update("contactChannel", e.target.value)}
                          className="accent-[#B22234]"
                        />
                        <span className="text-sm text-gray-700">{o.label}</span>
                      </label>
                    ))}
                  </div>
                </Field>
              </Section>

              <Section title="Здоровье и подготовка">
                <Field label="Аллергии" hint="Если нет, оставьте пустым или напишите «нет»">
                  <Input
                    value={form.allergies}
                    onChange={(e) => update("allergies", e.target.value)}
                    placeholder={t("Например: орехи, лактоза")}
                  />
                </Field>
                <Field label="Умение плавать" required>
                  <select
                    required
                    value={form.swimming}
                    onChange={(e) => update("swimming", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">{t("— выбрать —")}</option>
                    {swimmingOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {t(o.label)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Прививка от клеща (год последней прививки)">
                  <select
                    value={form.tickVaccine}
                    onChange={(e) => update("tickVaccine", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">{t("— выбрать —")}</option>
                    {tickVaccineOptions.map((o) => (
                      <option key={o} value={o}>
                        {o === "Нет" ? t("Нет") : o}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Размер майки" required>
                  <div className="flex gap-3">
                    {["S", "M", "L", "XL"].map((s) => (
                      <label key={s} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="shirtSize"
                          required
                          value={s}
                          checked={form.shirtSize === s}
                          onChange={(e) => update("shirtSize", e.target.value)}
                          className="accent-[#B22234]"
                        />
                        <span className="text-sm text-gray-700">{s}</span>
                      </label>
                    ))}
                  </div>
                </Field>
              </Section>

              <Section title="О ребёнке (дополнительно)">
                <Field label="Из верующей семьи">
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {[
                      { value: "yes", label: "Да" },
                      { value: "no", label: "Нет" },
                      { value: "adventist", label: "Адвентисты" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="believingFamily"
                          value={o.value}
                          checked={form.believingFamily === o.value}
                          onChange={(e) => update("believingFamily", e.target.value)}
                          className="accent-[#B22234]"
                        />
                        <span className="text-sm text-gray-700">
                          <TranslatedText text={o.label} />
                        </span>
                      </label>
                    ))}
                  </div>
                </Field>
                <Field
                  label="Особенности характера"
                  hint="Что нам важно знать, чтобы лучше позаботиться о ребёнке"
                >
                  <Textarea
                    value={form.characterTraits}
                    onChange={(e) => update("characterTraits", e.target.value)}
                    rows={2}
                  />
                </Field>
                <Field label="Интересы и хобби">
                  <Input
                    value={form.interests}
                    onChange={(e) => update("interests", e.target.value)}
                    placeholder={t("Например: рисование, футбол, музыка")}
                  />
                </Field>
                <Field label="Музыкальный инструмент">
                  <Input
                    value={form.instrument}
                    onChange={(e) => update("instrument", e.target.value)}
                    placeholder={t("Например: гитара, фортепиано")}
                  />
                </Field>
                {form.instrument.trim().length > 0 && (
                  <Field label="Возможность привезти инструмент в лагерь">
                    <div className="flex gap-6">
                      {[
                        { value: "Да", label: "Да" },
                        { value: "Нет", label: "Нет" },
                      ].map((o) => (
                        <label key={o.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="canBringInstrument"
                            value={o.value}
                            checked={form.canBringInstrument === o.value}
                            onChange={(e) => update("canBringInstrument", e.target.value)}
                            className="accent-[#B22234]"
                          />
                          <span className="text-sm text-gray-700">
                            <TranslatedText text={o.label} />
                          </span>
                        </label>
                      ))}
                    </div>
                  </Field>
                )}
              </Section>

              <Section title="Договор">
                <Field label="Как хотите подписать договор?" required>
                  <div className="space-y-2">
                    {[
                      { value: "email", label: "По электронной почте (бесплатно)" },
                      { value: "paper", label: "На бумаге в лагере (+€10)" },
                    ].map((o) => (
                      <label key={o.value} className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contractMethod"
                          required
                          value={o.value}
                          checked={form.contractMethod === o.value}
                          onChange={(e) => update("contractMethod", e.target.value)}
                          className="accent-[#B22234] mt-1"
                        />
                        <span className="text-sm text-gray-700">
                          <TranslatedText text={o.label} />
                        </span>
                      </label>
                    ))}
                  </div>
                </Field>
                {form.contractMethod === "paper" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={form.paperContractConsent}
                        onChange={(e) => update("paperContractConsent", e.target.checked)}
                        className="accent-[#B22234] mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        <TranslatedText text="Согласен(на) оплатить €10 за бумажный договор" />
                      </span>
                    </label>
                  </div>
                )}
              </Section>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={form.dataConsent}
                    onChange={(e) => update("dataConsent", e.target.checked)}
                    className="accent-[#B22234] mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    <TranslatedText text="Согласен(на) с обработкой персональных данных в целях организации лагеря" />
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#B22234] hover:bg-[#8e1c29] text-white py-6 text-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <TranslatedText text="Отправка..." />
                  </>
                ) : (
                  <TranslatedText text="Зарегистрироваться" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
