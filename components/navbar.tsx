"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage, type Language, languageNames } from "@/contexts/language-context"

const navItems = [
  { name: "Аренда", href: "/rental" },
  { name: "Сотрудникам", href: "/staff" },
  { name: "О нас", href: "/about" },
  { name: "Родителям", href: "/parents" },
  { name: "Расписание", href: "/schedule" },
  { name: "Видео архив", href: "/video-archive" },
  { name: "Гимн лагеря", href: "/camp-anthem" },
  { name: "Language", href: "#", icon: Globe, isLanguageSelector: true },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { language, setLanguage, translations = {}, setShowLanguageModal } = useLanguage()

  // Only run client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  // If not mounted yet (during SSR), render a simpler version
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/maranafa-logo.webp"
                alt="Маранафа"
                width={200}
                height={50}
                className="h-20 w-auto"
              />
            </Link>
          </div>
          <div className="hidden md:flex md:space-x-8">
            {navItems
              .filter((item) => !item.isLanguageSelector)
              .map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center text-base font-medium text-gray-700 hover:text-[#B22234] transition-colors"
                >
                  {item.name}
                  {item.icon && <item.icon className="ml-1 h-4 w-4" />}
                </Link>
              ))}
          </div>
          <div className="flex md:hidden">
            <button type="button" className="inline-flex items-center justify-center rounded-md p-2 text-gray-700">
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
    )
  }

  const t = (key: string) => {
    return translations[key] || key
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/maranafa-logo.webp"
              alt="Маранафа"
              width={200}
              height={50}
              className="h-20 w-auto"
            />
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex md:space-x-8">
          {navItems.map((item) => {
            if (item.isLanguageSelector) {
              return <LanguageSelector key={item.name} />
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center text-base font-medium text-gray-700 hover:text-[#B22234] transition-colors"
              >
                {t(item.name)}
                {item.icon && !item.isLanguageSelector && <item.icon className="ml-1 h-4 w-4" />}
              </Link>
            )
          })}
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Открыть меню</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="space-y-1 px-4 pb-3 pt-2">
          {navItems.map((item) => {
            if (item.isLanguageSelector) {
              return (
                <div key={item.name} className="py-2">
                  <p className="text-base font-medium text-gray-700 mb-2">Language</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(languageNames) as Language[]).map((lang) => (
                      <LanguageButton
                        key={lang}
                        lang={lang}
                        onClick={() => {
                          setLanguage(lang)
                          setMobileMenuOpen(false)
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center py-2 text-base font-medium text-gray-700 hover:text-[#B22234]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(item.name)}
                {item.icon && !item.isLanguageSelector && <item.icon className="ml-1 h-4 w-4" />}
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}

function LanguageSelector() {
  const { language, setLanguage, setShowLanguageModal } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center text-base font-medium text-gray-700 hover:text-[#B22234] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="mr-1 h-4 w-4" />
        {languageNames[language]}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {(Object.keys(languageNames) as Language[]).map((lang) => (
              <button
                key={lang}
                className={`block px-4 py-2 text-sm w-full text-left ${
                  language === lang ? "bg-gray-100 text-[#B22234] font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => {
                  setLanguage(lang)
                  setIsOpen(false)
                }}
              >
                {languageNames[lang]}
              </button>
            ))}
            <div className="border-t border-gray-100 my-1"></div>
            <button
              className="block px-4 py-2 text-sm w-full text-left text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setShowLanguageModal(true)
                setIsOpen(false)
              }}
            >
              Change Language
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function LanguageButton({ lang, onClick }: { lang: Language; onClick: () => void }) {
  const { language } = useLanguage()

  return (
    <button
      className={`px-3 py-2 text-sm rounded-md ${
        language === lang ? "bg-[#B22234] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={onClick}
    >
      {languageNames[lang]}
    </button>
  )
}
