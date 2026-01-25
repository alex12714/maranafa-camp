"use client"

import { useLanguage } from "@/contexts/language-context"

interface TranslatedTextProps {
  text: string
}

export function TranslatedText({ text }: TranslatedTextProps) {
  // Get translations safely with fallback
  const { translations = {} } = useLanguage()

  // Return the translated text or the original text if translation is not available
  return <>{translations[text] || text}</>
}
