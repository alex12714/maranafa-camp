"use client"

import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

export default function AboutPage() {
  const { translations } = useLanguage()
  const t = (key: string) => translations[key] || key
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/features/top_background.webp"
            alt="Маранафа Христианский лагерь"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("О нас")}
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-xl text-white">{t("Мы не сами по себе")}</p>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t("Технологии и компании, которые мы используем")}</h2>
            <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Camp Process Development */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-t-[#B22234]">
              <h4 className="text-xl font-bold text-[#B22234] mb-4">{t("Проработка процессов лагеря и событий")}</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>MIRO</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>Notion</span>
                </li>
              </ul>
            </div>

            {/* Marketing */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-t-[#B22234]">
              <h4 className="text-xl font-bold text-[#B22234] mb-4">{t("Маркетинг")}</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>Telegram</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>YouTube</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>Instagram</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>Canva</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>ChatGPT</span>
                </li>
              </ul>
            </div>

            {/* Camp Preparation */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-t-[#B22234]">
              <h4 className="text-xl font-bold text-[#B22234] mb-4">{t("Подготовка лагеря")}</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>Zoom</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>Notion</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>AirTable</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>AI: Claude / ChatGPT</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>Google Docs</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>Google Drive</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>{t("Е-майл и СМС рассылка GoHighLevel")}</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>{t("Веб-сайт Vercel")}</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>{t("Автоматизация и AI-боты: Make.com")}</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>Telegram</span>
                </li>
              </ul>
            </div>

            {/* Camp Registration */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-t-[#B22234]">
              <h4 className="text-xl font-bold text-[#B22234] mb-4">{t("Регистрация лагеря")}</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>AirTable</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>{t("Подписание договоров: SignRequest")}</span>
                </li>
              </ul>
            </div>

            {/* Camp Arrival */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-t-[#B22234]">
              <h4 className="text-xl font-bold text-[#B22234] mb-4">{t("Заезд в лагерь")}</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>CityBee</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>BoldDrive</span>
                </li>
              </ul>
            </div>

            {/* During Camp */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-t-[#B22234]">
              <h4 className="text-xl font-bold text-[#B22234] mb-4">{t("В режиме лагеря")}</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>AirTable</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>PrintNode</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>Canon</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>Telegram</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2"></div>
                  <span>LMT 5G</span>
                </li>
              </ul>
            </div>

            {/* Media */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-t-[#FFD700]">
              <h4 className="text-xl font-bold text-[#B22234] mb-4">{t("Медиа")}</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#B22234] mr-2"></div>
                  <span>Bose S1 Pro</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#B22234] mr-2"></div>
                  <span>JBL speakers</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#B22234] mr-2"></div>
                  <span>Shure mirophones</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#B22234] mr-2"></div>
                  <span>Apple Macs / iPhones / iPads</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#B22234] mr-2"></div>
                  <span>{t("Рации Baofeng 888g")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t("Наши партнёры и организации, которые нас поддерживают")}</h2>
            <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#B22234] rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">{partner.initial}</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{t(partner.name)}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const partners = [
  {
    name: "Seventh Day Adventist Church",
    initial: "S",
  },
  {
    name: "7dayCosmetics",
    initial: "7",
  },
  {
    name: "Lanos Logic Ltd",
    initial: "L",
  },
  {
    name: "ХМЛ - Христианские Международные Лагеря",
    initial: "Х",
  },
  {
    name: "Христианский центр Норкалны",
    initial: "Н",
  },
]
