"use client"

import { useState, useEffect } from "react"
import { useLanguage, type Language } from "@/contexts/language-context"
import Image from "next/image"

export default function LanguageSelectorModal() {
  const { language, setLanguage, showLanguageModal, setShowLanguageModal } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !showLanguageModal) {
    return null
  }

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang)
    setShowLanguageModal(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
        <h2 className="text-center text-2xl font-bold mb-2">Choose Your Language</h2>
        <div className="mx-auto mb-6 h-1 w-20 bg-[#FFD700] rounded"></div>
        <div className="grid grid-cols-2 gap-4">
          <LanguageButton language="lv" name="Latviešu" flag="/flags/lv.png" onClick={() => handleSelectLanguage("lv")} selected={language === "lv"} />
          <LanguageButton language="uk" name="Українська" flag="/flags/uk.png" onClick={() => handleSelectLanguage("uk")} selected={language === "uk"} />
          <LanguageButton language="en" name="English" flag="/flags/en.png" onClick={() => handleSelectLanguage("en")} selected={language === "en"} />
          <LanguageButton language="ru" name="Русский" flag="/flags/ru.png" onClick={() => handleSelectLanguage("ru")} selected={language === "ru"} />
        </div>
      </div>
    </div>
  )
}

interface LanguageButtonProps {
  language: Language
  name: string
  flag: string
  onClick: () => void
  selected: boolean
}

function LanguageButton({ language, name, flag, onClick, selected }: LanguageButtonProps) {
  return (
    <button
      onClick={onClick}
      className={"flex flex-col items-center justify-center h-32 w-full rounded-lg border-2 transition-colors " + (selected ? "border-[#B22234] bg-[#B22234] text-white" : "border-gray-200 bg-white hover:border-[#B22234] hover:text-[#B22234]")}
    >
      <div className="w-16 h-12 relative mb-2 overflow-hidden rounded border">
        <Image src={flag} alt={name + " flag"} fill className="object-cover" priority={language === "lv"} />
      </div>
      <span className="text-lg font-medium">{name}</span>
    </button>
  )
}
