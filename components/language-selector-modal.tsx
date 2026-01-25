"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLanguage, type Language } from "@/contexts/language-context"
import Image from "next/image"

export default function LanguageSelectorModal() {
  const { language, setLanguage, showLanguageModal, setShowLanguageModal } = useLanguage()
  const [mounted, setMounted] = useState(false)

  // Only show the modal after the component has mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang)
    setShowLanguageModal(false)
  }

  return (
    <Dialog open={showLanguageModal} onOpenChange={setShowLanguageModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Choose Your Language
            <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <LanguageButton
            language="lv"
            name="Latviešu"
            flag="/flags/lv.png"
            onClick={() => {
              setLanguage("lv")
              setShowLanguageModal(false)
            }}
            selected={language === "lv"}
          />
          <LanguageButton
            language="uk"
            name="Українська"
            flag="/flags/uk.png"
            onClick={() => {
              setLanguage("uk")
              setShowLanguageModal(false)
            }}
            selected={language === "uk"}
          />
          <LanguageButton
            language="en"
            name="English"
            flag="/flags/en.png"
            onClick={() => {
              setLanguage("en")
              setShowLanguageModal(false)
            }}
            selected={language === "en"}
          />
          <LanguageButton
            language="ru"
            name="Русский"
            flag="/flags/ru.png"
            onClick={() => {
              setLanguage("ru")
              setShowLanguageModal(false)
            }}
            selected={language === "ru"}
          />
        </div>
      </DialogContent>
    </Dialog>
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
    <Button
      variant={selected ? "default" : "outline"}
      className={`flex flex-col items-center justify-center h-32 ${
        selected ? "bg-[#B22234] hover:bg-[#8e1c29]" : "hover:border-[#B22234] hover:text-[#B22234]"
      }`}
      onClick={onClick}
    >
      <div className="w-16 h-12 relative mb-2 overflow-hidden rounded border">
        <Image
          src={flag || "/placeholder.svg"}
          alt={`${name} flag`}
          fill
          className="object-cover"
          priority={language === "uk"}
        />
      </div>
      <span className="text-lg font-medium">{name}</span>
    </Button>
  )
}
