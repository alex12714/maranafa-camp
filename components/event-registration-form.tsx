"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"
import { useLanguage } from "@/contexts/language-context"

/**
 * Registration form shared by the one-off events (Маранафа Point, Friends, …).
 * `event` is the key the /api/event-register route maps to an Airtable choice —
 * it must exist in that route's EVENTS map.
 */
export default function EventRegistrationForm({
  event,
  successMessage = "Мы свяжемся с вами ближе к событию. До встречи!",
  intro = "Регистрация занимает меньше минуты",
}: {
  event: string
  successMessage?: string
  intro?: string
}) {
  const { language } = useLanguage()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [people, setPeople] = useState("1")
  const [comment, setComment] = useState("")
  const [website, setWebsite] = useState("") // honeypot
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/event-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, name, phone, email, people, comment, website, language }),
      })
      if (!res.ok) throw new Error("error")
      setSuccess(true)
    } catch {
      setError("Произошла ошибка. Попробуйте ещё раз.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <CheckCircle className="h-14 w-14 text-green-500" />
        <h3 className="text-xl font-bold text-gray-900">
          <TranslatedText text="Регистрация получена!" />
        </h3>
        <p className="text-gray-600 text-center">
          <TranslatedText text={successMessage} />
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot — hidden from users; bots that fill it are silently dropped */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>
      <p className="text-sm text-gray-500 mb-2">
        <TranslatedText text={intro} />
      </p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <TranslatedText text="Имя и фамилия" /> <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234] focus:border-transparent"
          placeholder="Иван Иванов"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <TranslatedText text="Телефон" /> <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          required
          inputMode="tel"
          pattern="\+[1-9][0-9 ()\-.]{6,}"
          title="Один номер, начиная с + и кода страны, например +37120172714"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234] focus:border-transparent"
          placeholder="+371 12345678"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <TranslatedText text="Электронная почта" /> <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234] focus:border-transparent"
          placeholder="ivan@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <TranslatedText text="Сколько человек придёт" />
        </label>
        <input
          type="number"
          min={1}
          max={20}
          inputMode="numeric"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234] focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <TranslatedText text="Комментарий" />
        </label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234] focus:border-transparent"
          placeholder="Вопросы, пожелания, с кем придёте"
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#B22234] hover:bg-[#8e1c29] text-white py-3 rounded-lg text-base font-semibold"
      >
        {loading ? <TranslatedText text="Отправка..." /> : <TranslatedText text="Зарегистрироваться" />}
      </Button>
    </form>
  )
}
