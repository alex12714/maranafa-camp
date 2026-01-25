import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "История мероприятий Маранафа",
  description: "Хронология всех мероприятий Маранафа с 2017 года до наших дней",
}

export default function PastEventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-white">{children}</div>
}
