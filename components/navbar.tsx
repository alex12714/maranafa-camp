"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Globe, ChevronDown, ShoppingBag, Film, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage, type Language, languageNames } from "@/contexts/language-context"

const mainNavItems = [
  { name: "Сотрудникам", href: "/staff" },
  { name: "О нас", href: "/about" },
  { name: "Родителям", href: "/parents" },
  { name: "Расписание", href: "/schedule" },
  { name: "Гимн лагеря", href: "/camp-anthem" },
]

const moreItems = [
  { name: "Аренда", href: "/rental", icon: Package },
  { name: "Видео архив", href: "/video-archive", icon: Film },
  { name: "Мерч", href: "/merch", icon: ShoppingBag },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const { language, setLanguage, translations = {}, setShowLanguageModal } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const t = (key: string) => translations[key] || key

  const navLinkClass =
    "flex items-center text-base font-medium text-gray-700 hover:text-[#B22234] transition-colors"

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <Image src="/images/maranafa-logo.webp" alt="Маранафа" width={200} height={50} className="h-20 w-auto" />
          </Link>
          <div className="hidden md:flex md:space-x-8">
            {mainNavItems.map((item) => (
              <Link key={item.name} href={item.href} className={navLinkClass}>{item.name}</Link>
            ))}
          </div>
          <div className="flex md:hidden">
            <button type="button" className="inline-flex items-center justify-center rounded-md p-2 text-gray-700">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image src="/images/maranafa-logo.webp" alt="Маранафа" width={200} height={50} className="h-20 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex md:items-center md:space-x-8">
          {mainNavItems.map((item) => (
            <Link key={item.name} href={item.href} className={navLinkClass}>
              {t(item.name)}
            </Link>
          ))}

          {/* "Ещё" dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className={cn(navLinkClass, "gap-1")}
            >
              Ещё
              <ChevronDown className={cn("h-4 w-4 transition-transform", moreOpen && "rotate-180")} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-lg bg-white ring-1 ring-black/5 z-50 overflow-hidden">
                {moreItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#B22234] transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-gray-400" />
                    {t(item.name)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <LanguageSelector />
        </nav>

        {/* Mobile burger */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Открыть меню</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="space-y-1 px-4 pb-3 pt-2">
          {mainNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center py-2 text-base font-medium text-gray-700 hover:text-[#B22234]"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t(item.name)}
            </Link>
          ))}

          {/* More section in mobile */}
          <div className="border-t border-gray-100 pt-2 mt-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-0 py-1">Ещё</p>
            {moreItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 py-2 text-base font-medium text-gray-700 hover:text-[#B22234]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-4 w-4 text-gray-400" />
                {t(item.name)}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-2 mt-2">
            <p className="text-base font-medium text-gray-700 mb-2">Language</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(languageNames) as Language[]).map((lang) => (
                <LanguageButton
                  key={lang}
                  lang={lang}
                  onClick={() => { setLanguage(lang); setMobileMenuOpen(false) }}
                />
              ))}
            </div>
          </div>
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
    return () => document.removeEventListener("mousedown", handleClickOutside)
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
                onClick={() => { setLanguage(lang); setIsOpen(false) }}
              >
                {languageNames[lang]}
              </button>
            ))}
            <div className="border-t border-gray-100 my-1" />
            <button
              className="block px-4 py-2 text-sm w-full text-left text-gray-700 hover:bg-gray-50"
              onClick={() => { setShowLanguageModal(true); setIsOpen(false) }}
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
