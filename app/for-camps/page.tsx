import Link from "next/link"
import { Gamepad2, Music } from "lucide-react"

const resources = [
  {
    title: "Игры",
    description:
      "Подборка игр для лагеря: спортивные, командные, интеллектуальные и многое другое. Фильтруй по типу, возрасту и популярности.",
    href: "/for-camps/games",
    icon: Gamepad2,
    badge: "50+ игр",
  },
  {
    title: "Песни",
    description:
      "Сборник лагерных песен с текстами. Ищи по названию, открывай и пой вместе с отрядом.",
    href: "/for-camps/songs",
    icon: Music,
    badge: "100+ песен",
  },
]

export default function ForCampsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-[#B22234] text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">Для лагерей</h1>
          <p className="text-red-100 text-xl max-w-2xl mx-auto">
            Полезные ресурсы для организаторов и сотрудников детских лагерей
          </p>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 bg-gray-50 flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Ресурсы</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => {
              const Icon = res.icon
              return (
                <Link
                  key={res.href}
                  href={res.href}
                  className="group block bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-[#B22234]/30 transition-all p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#B22234]/10 flex items-center justify-center mb-4 group-hover:bg-[#B22234]/20 transition-colors">
                    <Icon className="h-6 w-6 text-[#B22234]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{res.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{res.description}</p>
                  <span className="text-xs font-semibold text-[#B22234] bg-[#B22234]/10 px-2.5 py-1 rounded-full">
                    {res.badge}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
