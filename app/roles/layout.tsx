import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Роли в лагере Маранафа",
  description: "Подробная информация о ролях и обязанностях сотрудников лагеря Маранафа",
}

export default function RolesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </div>
  )
}
