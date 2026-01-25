import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { LanguageProvider } from "@/contexts/language-context"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Маранафа - Детский Христианский Тематический Лагерь",
  description: "Детский Христианский Тематический Лагерь Маранафа",
    generator: 'v0.app'
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
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#B22234] to-[#8e1c29]">
              {/* Coming Soon Page */}
              <div className="text-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8">
                    <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">Maranafa</h1>
                    <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-8"></div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">We'll Be Back Soon</h2>
                    <p className="text-lg text-white/90 mb-4">Our website is currently under maintenance.</p>
                  </div>

                  <div className="text-white/70 text-sm">Made with love in USA 🇺🇸</div>
                </div>
              </div>

              {/* Keep all existing functionality intact but hidden */}
              <div className="hidden">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
