import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { LanguageProvider } from "@/contexts/language-context"
import LanguageSelectorModal from "@/components/language-selector-modal"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Маранафа — Христианские мероприятия для детей и молодёжи",
  description: "Маранафа — христианские мероприятия для детей и молодёжи: лагеря, конференции и события для всей семьи.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <LanguageSelectorModal />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
