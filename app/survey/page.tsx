"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage, type Language } from "@/contexts/language-context"
import { isValidEmail, normalizePhone } from "@/lib/validation"
import { CheckCircle2, IceCream, Loader2, PartyPopper } from "lucide-react"

const INTEREST_KEYS = [
  "language",
  "electronics",
  "singing",
  "instrument",
  "theater",
  "bible",
  "christianity",
  "business",
  "movies",
  "logoped",
  "other",
] as const
type InterestKey = (typeof INTEREST_KEYS)[number]

// Child age ranges (over-18 respondents). Numeric labels, shared across languages.
const CHILD_AGE_RANGES = ["0–5", "5–12", "12–14", "14+"] as const

type Copy = {
  heading: string
  intro: string
  name: string
  phone: string
  phoneHint: string
  email: string
  emailOptional: string
  interestsTitle: string
  otherPlaceholder: string
  smsConsent: string
  gdprConsent: string
  submit: string
  sending: string
  errName: string
  errPhone: string
  errEmail: string
  errConsent: string
  errGeneric: string
  successHeading: string
  successMsg: string
  dupHeading: string
  dupMsg: string
  booth: string
  ageQuestion: string
  ageOver: string
  ageUnder: string
  parentName: string
  parentPhone: string
  childrenTitle: string
  errParentName: string
  interests: Record<InterestKey, string>
}

const S: Record<Language, Copy> = {
  ru: {
    heading: "Заполни анкету и получи мороженое!",
    intro:
      "После отправки на твой телефон придёт код (действует 10 минут). Покажи его на стойке в лагере, чтобы получить мороженое и доступ к батуту.",
    name: "Имя",
    phone: "Телефон",
    phoneHint: "С кодом страны, например +37120172714",
    email: "Электронная почта",
    emailOptional: "необязательно",
    interestsTitle: "Какие кружки в центре тебе интересны?",
    otherPlaceholder: "Напиши свой вариант",
    smsConsent: "Согласен(на) получать SMS с информацией об участии в лагере",
    gdprConsent:
      "Согласен(на) на обработку моих данных, чтобы центр мог связаться со мной по выбранным направлениям",
    submit: "Отправить",
    sending: "Отправка...",
    errName: "Пожалуйста, укажи имя",
    errPhone: "Введи один номер телефона с + и кодом страны",
    errEmail: "Введи корректный адрес электронной почты",
    errConsent: "Нужны оба согласия, чтобы отправить анкету",
    errGeneric: "Что-то пошло не так. Попробуй ещё раз.",
    successHeading: "Спасибо!",
    successMsg:
      "Мы отправили код на твой телефон. Он действует 10 минут.",
    dupHeading: "Мы тебя очень ценим!",
    dupMsg: "Но мороженое можно получить только один раз :)",
    booth: "Покажи код из SMS на стойке в лагере, чтобы получить ваучер на мороженое и батут.",
    ageQuestion: "Твой возраст",
    ageOver: "Мне 18 или больше",
    ageUnder: "Мне меньше 18",
    parentName: "Имя родителя",
    parentPhone: "Телефон родителя",
    childrenTitle: "Возраст ваших детей",
    errParentName: "Укажите имя родителя",
    interests: {
      language: "Изучение языков",
      electronics: "Электроника",
      singing: "Пение",
      instrument: "Музыка — игра на инструменте",
      theater: "Театр",
      bible: "Изучение Библии",
      christianity: "Знакомство с христианством (курс «Альфа»)",
      business: "Начало своего дела",
      movies: "Киновечера",
      logoped: "Логопед",
      other: "Другое",
    },
  },
  lv: {
    heading: "Aizpildi anketu un saņem saldējumu!",
    intro:
      "Pēc nosūtīšanas uz tavu tālruni tiks nosūtīts kods (derīgs 10 minūtes). Parādi to nometnes stendā, lai saņemtu saldējumu un piekļuvi piepūšamajai atrakcijai.",
    name: "Vārds",
    phone: "Tālrunis",
    phoneHint: "Ar valsts kodu, piemēram, +37120172714",
    email: "E-pasts",
    emailOptional: "nav obligāti",
    interestsTitle: "Kuri pulciņi centrā tevi interesē?",
    otherPlaceholder: "Ieraksti savu variantu",
    smsConsent: "Piekrītu saņemt SMS ar informāciju par dalību nometnē",
    gdprConsent:
      "Piekrītu savu datu apstrādei, lai centrs varētu ar mani sazināties par izvēlētajām jomām",
    submit: "Nosūtīt",
    sending: "Nosūta...",
    errName: "Lūdzu, norādi vārdu",
    errPhone: "Ievadi vienu tālruņa numuru ar + un valsts kodu",
    errEmail: "Ievadi derīgu e-pasta adresi",
    errConsent: "Vajadzīgas abas piekrišanas, lai nosūtītu anketu",
    errGeneric: "Kaut kas nogāja greizi. Mēģini vēlreiz.",
    successHeading: "Paldies!",
    successMsg: "Mēs nosūtījām kodu uz tavu tālruni. Tas ir derīgs 10 minūtes.",
    dupHeading: "Mēs tevi ļoti novērtējam!",
    dupMsg: "Bet saldējumu var saņemt tikai vienu reizi :)",
    booth: "Parādi SMS kodu nometnes stendā, lai saņemtu saldējuma un atrakcijas kuponu.",
    ageQuestion: "Tavs vecums",
    ageOver: "Man ir 18 vai vairāk",
    ageUnder: "Esmu jaunāks par 18",
    parentName: "Vecāka vārds",
    parentPhone: "Vecāka tālrunis",
    childrenTitle: "Jūsu bērnu vecums",
    errParentName: "Lūdzu, norādi vecāka vārdu",
    interests: {
      language: "Valodu apguve",
      electronics: "Elektronika",
      singing: "Dziedāšana",
      instrument: "Mūzika — instrumenta spēle",
      theater: "Teātris",
      bible: "Bībeles apguve",
      christianity: "Iepazīšanās ar kristietību (Alfa kurss)",
      business: "Sava biznesa uzsākšana",
      movies: "Kino vakari",
      logoped: "Logopēds",
      other: "Cits",
    },
  },
  uk: {
    heading: "Заповни анкету й отримай морозиво!",
    intro:
      "Після надсилання на твій телефон надійде код (діє 10 хвилин). Покажи його на стійці в таборі, щоб отримати морозиво та доступ до надувної гірки.",
    name: "Ім'я",
    phone: "Телефон",
    phoneHint: "З кодом країни, наприклад +37120172714",
    email: "Електронна пошта",
    emailOptional: "необов'язково",
    interestsTitle: "Які гуртки в центрі тобі цікаві?",
    otherPlaceholder: "Напиши свій варіант",
    smsConsent: "Погоджуюсь отримувати SMS з інформацією про участь у таборі",
    gdprConsent:
      "Погоджуюсь на обробку моїх даних, щоб центр міг зв'язатися зі мною щодо обраних напрямів",
    submit: "Надіслати",
    sending: "Надсилання...",
    errName: "Будь ласка, вкажи ім'я",
    errPhone: "Введи один номер телефону з + та кодом країни",
    errEmail: "Введи коректну адресу електронної пошти",
    errConsent: "Потрібні обидві згоди, щоб надіслати анкету",
    errGeneric: "Щось пішло не так. Спробуй ще раз.",
    successHeading: "Дякуємо!",
    successMsg: "Ми надіслали код на твій телефон. Він діє 10 хвилин.",
    dupHeading: "Ми тебе дуже цінуємо!",
    dupMsg: "Але морозиво можна отримати лише один раз :)",
    booth: "Покажи код із SMS на стійці в таборі, щоб отримати ваучер на морозиво та гірку.",
    ageQuestion: "Твій вік",
    ageOver: "Мені 18 або більше",
    ageUnder: "Мені менше 18",
    parentName: "Ім'я батьків",
    parentPhone: "Телефон батьків",
    childrenTitle: "Вік ваших дітей",
    errParentName: "Вкажіть ім'я батьків",
    interests: {
      language: "Вивчення мов",
      electronics: "Електроніка",
      singing: "Спів",
      instrument: "Музика — гра на інструменті",
      theater: "Театр",
      bible: "Вивчення Біблії",
      christianity: "Знайомство з християнством (курс «Альфа»)",
      business: "Започаткування власної справи",
      movies: "Кіновечори",
      logoped: "Логопед",
      other: "Інше",
    },
  },
  en: {
    heading: "Fill in the survey and get an ice cream!",
    intro:
      "After you submit, a code will be sent to your phone (valid for 10 minutes). Show it at the camp booth to get an ice cream and access to the bouncy castle.",
    name: "Name",
    phone: "Phone",
    phoneHint: "With country code, e.g. +37120172714",
    email: "E-mail",
    emailOptional: "optional",
    interestsTitle: "Which clubs at the centre interest you?",
    otherPlaceholder: "Write your own option",
    smsConsent: "I agree to receive SMS with information about taking part in the camp",
    gdprConsent:
      "I agree to the processing of my data so the centre can contact me about the areas I chose",
    submit: "Submit",
    sending: "Sending...",
    errName: "Please enter a name",
    errPhone: "Enter a single phone number with + and the country code",
    errEmail: "Enter a valid e-mail address",
    errConsent: "Both agreements are required to submit the survey",
    errGeneric: "Something went wrong. Please try again.",
    successHeading: "Thank you!",
    successMsg: "We've sent a code to your phone. It's valid for 10 minutes.",
    dupHeading: "We value you a lot!",
    dupMsg: "But an ice cream can only be claimed once :)",
    booth: "Show the code from the SMS at the camp booth to get your ice cream & bouncy castle voucher.",
    ageQuestion: "Your age",
    ageOver: "I'm 18 or older",
    ageUnder: "I'm under 18",
    parentName: "Parent's name",
    parentPhone: "Parent's phone",
    childrenTitle: "Your children's ages",
    errParentName: "Please enter the parent's name",
    interests: {
      language: "Language learning",
      electronics: "Electronics",
      singing: "Singing",
      instrument: "Music — playing an instrument",
      theater: "Theatre",
      bible: "Bible study",
      christianity: "Getting to know Christianity (Alpha course)",
      business: "Starting a business",
      movies: "Movie nights",
      logoped: "Speech therapist",
      other: "Other",
    },
  },
}

export default function SurveyPage() {
  const { language, setShowLanguageModal } = useLanguage()
  const c = S[language] || S.ru

  // QR visitors are new each time — always prompt for a language via the same
  // site-wide modal shown on first visit. The timeout lets the LanguageProvider's
  // own mount effect settle first so it can't immediately re-close it.
  useEffect(() => {
    const id = setTimeout(() => setShowLanguageModal(true), 0)
    return () => clearTimeout(id)
  }, [setShowLanguageModal])

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("+371")
  const [email, setEmail] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [other, setOther] = useState("")
  const [smsConsent, setSmsConsent] = useState(false)
  const [gdprConsent, setGdprConsent] = useState(false)
  const [website, setWebsite] = useState("") // honeypot
  const [over18, setOver18] = useState(true)
  const [parentName, setParentName] = useState("")
  const [childrenAges, setChildrenAges] = useState<string[]>([])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<null | "unique" | "duplicate">(null)

  const toggleInterest = (key: string) => {
    setInterests((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const toggleChildAge = (range: string) => {
    setChildrenAges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) return setError(c.errName)
    if (!over18 && !parentName.trim()) return setError(c.errParentName)
    if (!normalizePhone(phone)) return setError(c.errPhone)
    if (email.trim() && !isValidEmail(email)) return setError(c.errEmail)
    if (!smsConsent || !gdprConsent) return setError(c.errConsent)

    setSubmitting(true)
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          interests,
          otherInterest: other,
          over18,
          parentName: over18 ? "" : parentName,
          childrenAges: over18 ? childrenAges : [],
          smsConsent,
          gdprConsent,
          language,
          website,
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j.error || "failed")
      setResult(j.status === "duplicate" ? "duplicate" : "unique")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      console.error(err)
      setError(c.errGeneric)
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    const dup = result === "duplicate"
    return (
      <div className="py-12 bg-gray-50 min-h-[70vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-xl">
          <Card>
            <CardContent className="pt-10 pb-8 px-6 text-center">
              {dup ? (
                <IceCream className="h-16 w-16 text-[#B22234] mx-auto mb-4" />
              ) : (
                <PartyPopper className="h-16 w-16 text-[#B22234] mx-auto mb-4" />
              )}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {dup ? c.dupHeading : c.successHeading}
              </h1>
              <p className="text-gray-600">{dup ? c.dupMsg : c.successMsg}</p>
              <div className="mt-5 inline-flex items-start gap-2 text-sm text-gray-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-left">
                <IceCream className="h-5 w-5 mt-0.5 shrink-0 text-[#B22234]" />
                <span>{c.booth}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-xl">
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-6">
              <IceCream className="h-12 w-12 text-[#B22234] mx-auto mb-3" />
              <h1 className="text-2xl font-bold text-gray-900">{c.heading}</h1>
              <p className="mt-2 text-sm text-gray-600">{c.intro}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot */}
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

              {/* Age toggle */}
              <div>
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  {c.ageQuestion} *
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOver18(true)}
                    className={`rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                      over18
                        ? "border-[#B22234] bg-[#B22234] text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {c.ageOver}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOver18(false)}
                    className={`rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                      !over18
                        ? "border-[#B22234] bg-[#B22234] text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {c.ageUnder}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {c.name} *
                </label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {!over18 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {c.parentName} *
                  </label>
                  <Input
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {over18 ? c.phone : c.parentPhone} *
                </label>
                <Input
                  type="tel"
                  required
                  inputMode="tel"
                  pattern="\+[1-9][0-9\s\-]{6,}"
                  title={c.phoneHint}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+371 ..."
                />
                <p className="mt-1 text-xs text-gray-500">{c.phoneHint}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {c.email}{" "}
                  <span className="text-gray-400 font-normal">({c.emailOptional})</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              {over18 && (
                <div>
                  <div className="block text-sm font-medium text-gray-700 mb-2">
                    {c.childrenTitle}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CHILD_AGE_RANGES.map((range) => (
                      <label
                        key={range}
                        className="flex items-center justify-center gap-2 cursor-pointer rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={childrenAges.includes(range)}
                          onChange={() => toggleChildAge(range)}
                          className="accent-[#B22234]"
                        />
                        <span className="text-sm text-gray-700">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  {c.interestsTitle}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INTEREST_KEYS.map((key) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 cursor-pointer rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={interests.includes(key)}
                        onChange={() => toggleInterest(key)}
                        className="accent-[#B22234]"
                      />
                      <span className="text-sm text-gray-700">{c.interests[key]}</span>
                    </label>
                  ))}
                </div>
                {interests.includes("other") && (
                  <Input
                    className="mt-2"
                    value={other}
                    onChange={(e) => setOther(e.target.value)}
                    placeholder={c.otherPlaceholder}
                  />
                )}
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  className="accent-[#B22234] mt-1"
                />
                <span className="text-sm text-gray-700">{c.smsConsent}</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gdprConsent}
                  onChange={(e) => setGdprConsent(e.target.checked)}
                  className="accent-[#B22234] mt-1"
                />
                <span className="text-sm text-gray-700">{c.gdprConsent}</span>
              </label>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
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
                    {c.sending}
                  </>
                ) : (
                  c.submit
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
