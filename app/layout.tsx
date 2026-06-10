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
  other: {
    "verify-paysera": "4491d24eebdd94b4f70a9da42e9491ed",
  },
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
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(){var s=document.createElement("script");var d=new Date();s.src="https://bank.paysera.com/js/compiled/quality-sign.js?v="+d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear();s.setAttribute("data-paysera-project-id","257577");s.setAttribute("data-lang","lv");s.async=true;document.head.appendChild(s);})();`,
              }}
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
