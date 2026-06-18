"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, ArrowLeft, Anchor, CheckCircle, Navigation, AlertTriangle, Car } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"

const activities = [
  { emoji: "🗺️", text: "Квест в Старом городе Риги – по следам миссионерских путешествий апостола Павла" },
  { emoji: "⛵", text: "2-часовое плавание на яхте «Либава» – настоящее морское приключение" },
  { emoji: "🍽️", text: "Еда – угощения и перекусы на борту" },
  { emoji: "🎵", text: "Музыка и поклонение под открытым небом" },
  { emoji: "📖", text: "Живой пересказ историй апостола Павла" },
  { emoji: "🏁", text: "Завершение в 17:00 на причале яхтклуба" },
]

const gallery = [
  { src: "/images/events/libava-11.webp", alt: "Яхта Либава под парусами" },
  { src: "/images/events/libava-4.webp", alt: "Борт яхты Либава" },
  { src: "/images/events/libava-3.webp", alt: "Резная фигура на борту" },
  { src: "/images/events/libava-5.webp", alt: "Пушка на палубе" },
  { src: "/images/events/libava-9.webp", alt: "Каюта яхты Либава" },
  { src: "/images/events/libava-12.webp", alt: "Интерьер яхты" },
  { src: "/images/events/libava-6.webp", alt: "Палуба яхты ночью" },
]

function RegistrationForm() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/dawn-treader-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
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
          <TranslatedText text="Мы свяжемся с вами ближе к событию. До встречи на борту!" />
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500 mb-2">
        <TranslatedText text="Регистрация на одного участника" />
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

export default function DawnTreaderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/events/dawn-treader-2026.png"
          alt="Maranatha Youth – Dawn Treader"
          fill
          className="object-cover object-center brightness-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white bg-black/30 rounded-full px-4 py-2 backdrop-blur-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <TranslatedText text="На главную" />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="container mx-auto max-w-5xl">
            <p className="text-[#FFD700] font-medium uppercase tracking-wider text-sm mb-2">
              <TranslatedText text="Маранафа Молодёжь" />
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
              Dawn Treader – <TranslatedText text="Морской квест" />
            </h1>
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <TranslatedText text="14 июня 2026" />
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                15:00 – 17:00
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <TranslatedText text="14+ лет" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-5xl px-4 py-12">

        {/* Key info */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            <TranslatedText text="Важная информация" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Старт и финиш" /></p>
                <p><TranslatedText text="«Pilsētas Jahtklubs», Balasta dambis 36, Рига – старт в 15:00" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Окончание" /></p>
                <p><TranslatedText text="17:00 на причале яхтклуба" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Возраст" /></p>
                <p><TranslatedText text="14+ лет" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Anchor className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Корабль" /></p>
                <p><TranslatedText text="Яхта «Либава»" /></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B22234]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="h-4 w-4 text-[#B22234]" />
              </div>
              <div>
                <p className="font-medium text-gray-900"><TranslatedText text="Количество мест" /></p>
                <p><TranslatedText text="до 40 человек" /></p>
              </div>
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <TranslatedText text="Программа мероприятия" />
          </h2>
          <div className="space-y-4">
            {activities.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-white rounded-xl border shadow-sm p-4">
                <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                <p className="text-gray-800 font-medium mt-1">
                  <TranslatedText text={item.text} />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <TranslatedText text="Яхта «Либава»" />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="col-span-2 md:col-span-2 relative aspect-[16/9] rounded-xl overflow-hidden shadow-md">
              <Image
                src={gallery[0].src}
                alt={gallery[0].alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md">
              <Image
                src={gallery[1].src}
                alt={gallery[1].alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            {gallery.slice(2).map((img, idx) => (
              <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* How to find the pier */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <TranslatedText text="Как найти причал" />
          </h2>
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4 text-sm text-gray-800 leading-relaxed">
            <div className="flex items-start gap-3">
              <Navigation className="h-5 w-5 text-[#B22234] flex-shrink-0 mt-0.5" />
              <p>
                <TranslatedText text="Точное место спуска к причалам" />:{" "}
                <a
                  href="https://maps.app.goo.gl/YEuEGwFUUdXGUYEc8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B22234] underline font-medium"
                >
                  <TranslatedText text="открыть на карте" />
                </a>{" "}
                <span className="text-gray-500">
                  (<TranslatedText text="удобнее смотреть в приложении Google Maps в спутниковом режиме" />)
                </span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Anchor className="h-5 w-5 text-[#B22234] flex-shrink-0 mt-0.5" />
              <p>
                <TranslatedText text="Если калитка закрыта — её можно открыть, нажав кнопку с внутренней стороны (рука проходит через ячейку забора)." />
              </p>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#B22234] flex-shrink-0 mt-0.5" />
              <p>
                <TranslatedText text="Пройдя за калитку и спустившись вниз на бетонный причал, идём направо до конца, затем налево до конца и ещё раз налево — до парусника." />
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Anchor className="h-5 w-5 text-[#B22234] flex-shrink-0 mt-0.5" />
              <p>
                <TranslatedText text="Место парусника у причала" />:{" "}
                <a
                  href="https://maps.app.goo.gl/Pm2WUQxzoKWqts2m8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B22234] underline font-medium"
                >
                  <TranslatedText text="открыть на карте" />
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
            <TranslatedText text="Правила" />
          </h2>
          <ul className="space-y-3 text-sm text-gray-800">
            <li>
              <TranslatedText text="Просьба ознакомить всех участников с правилами поведения на яхте" />:{" "}
              <a
                href="https://arjahtu.lv/jahtas-nomas-noteikumi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B22234] underline font-medium"
              >
                arjahtu.lv
              </a>
            </li>
            <li>
              <TranslatedText text="Особое внимание — правилам про обувь, закуски, напитки и одежду!" />
            </li>
            <li className="font-semibold">
              <TranslatedText text="Крепкий алкоголь на яхте категорически запрещён." />
            </li>
          </ul>
        </div>

        {/* Parking */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-10 flex items-start gap-3">
          <Car className="h-5 w-5 text-[#B22234] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-800">
            <p className="font-medium text-gray-900 mb-1"><TranslatedText text="Парковка" /></p>
            <p>
              <TranslatedText text="Машины — там же, вдоль Balasta dambis, на брусчатке в свободных местах. Зона оплаты «D»." />
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-[#B22234]/5 border border-[#B22234]/20 rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            <TranslatedText text="Стоимость участия" />
          </h2>
          <ul className="space-y-3 text-gray-800">
            <li className="flex items-start gap-3">
              <span className="text-xl">💰</span>
              <span><strong>20 EUR</strong> – <TranslatedText text="стандартная стоимость участия" /></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">👨‍👩‍👧‍👦</span>
              <span><TranslatedText text="Скидка при регистрации нескольких членов одной семьи" /></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">🍱</span>
              <span><TranslatedText text="Скидка для тех, кто принесёт еду на мероприятие" /></span>
            </li>
          </ul>
        </div>

        {/* Registration form */}
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            <TranslatedText text="Регистрация" />
          </h2>
          <RegistrationForm />
        </div>

      </div>
    </div>
  )
}
