"use client"

import Link from "next/link"
import Image from "next/image"
import { TranslatedText } from "./translated-text"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
  const { translations = {} } = useLanguage()

  const t = (key: string) => {
    return translations[key] || key
  }

  return (
    <footer className="bg-[#B22234] text-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              <TranslatedText text="О НАС" />
            </h3>
            <p className="mt-4 text-sm">
              <TranslatedText text="Мы являемся частью общественно полезной организации KEFA.org.lv" />
            </p>
            <div className="mt-4">
              <Link href="/">
                <Image
                  src="/images/maranafa-logo.webp"
                  alt="Маранафа"
                  width={150}
                  height={40}
                  className="h-12 w-auto"
                />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              <TranslatedText text="НАШИ МАСТЕРКЛАССЫ" />
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#" className="text-sm hover:text-gray-200">
                  <TranslatedText text="Лазилки по деревьям" />
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-gray-200">
                  <TranslatedText text="Видео кружок" />
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-gray-200">
                  <TranslatedText text="Банданы" />
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-gray-200">
                  <TranslatedText text="Электроника" />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              <TranslatedText text="РЕСУРСЫ" />
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#" className="text-sm hover:text-gray-200">
                  <TranslatedText text="Наша страница на ФБ" />
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-gray-200">
                  <TranslatedText text="Медиалента в Телеграме" />
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-gray-200">
                  <TranslatedText text="YouTube канал" />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              <TranslatedText text="КОНТАКТЫ" />
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm">
                <TranslatedText text="Латвия" />
              </li>
              <li className="text-sm">info@maranafa.org</li>
              <li className="text-sm">+371 26 123 456</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} Maranafa. <TranslatedText text="Все права защищены." />
          </p>
        </div>
      </div>
    </footer>
  )
}
