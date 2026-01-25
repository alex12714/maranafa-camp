import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Film, Scissors, Monitor, Users } from "lucide-react"

export default function VideoEditorPage() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/staff">
              <Button variant="ghost" className="text-[#B22234] hover:text-[#8e1c29] hover:bg-[#B22234]/10 mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к ролям
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Видео-монтажер</h1>
            <div className="h-1 w-20 bg-[#FFD700]"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#B22234] flex items-center">
                    <Film className="mr-2 h-5 w-5" />
                    Описание роли
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    Видео-монтажер - специалист, который монтирует и обрабатывает видеоматериалы, отснятые во время
                    лагеря. Создает финальные видеоролики для презентации родителям, архива лагеря и продвижения будущих
                    мероприятий. Отвечает за качественную постобработку и создание эмоциональных видеоисторий.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#B22234] flex items-center">
                    <Scissors className="mr-2 h-5 w-5" />
                    Основные обязанности
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Монтаж видеоматериалов с утренних и вечерних собраний</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Создание итогового фильма о лагере для родителей</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Обработка и синхронизация аудио и видео дорожек</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Цветокоррекция и улучшение качества изображения</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Добавление титров, переходов и спецэффектов</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Создание промо-роликов для социальных сетей</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Архивирование и организация видеоматериалов</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Подготовка видео в различных форматах для разных платформ</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#B22234] flex items-center">
                    <Monitor className="mr-2 h-5 w-5" />
                    Необходимые навыки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Владение программами видеомонтажа (Adobe Premiere, Final Cut Pro, DaVinci Resolve)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Понимание принципов монтажа и повествования</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Навыки цветокоррекции и звукового дизайна</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Креативное мышление и чувство ритма</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Терпение и внимание к деталям</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Умение работать с большими объемами материала</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Понимание различных видеоформатов и кодеков</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#B22234]">Информация о роли</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">Возрастные требования:</p>
                    <p className="text-gray-700">От 18 лет</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Опыт работы:</p>
                    <p className="text-gray-700">Обязателен опыт видеомонтажа</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Время работы:</p>
                    <p className="text-gray-700">Во время и после лагеря</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Особые требования:</p>
                    <p className="text-gray-700">Мощный компьютер для монтажа</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#B22234] flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Взаимодействие
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Координатор медиа</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Видео-оператор</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>PR-координатор</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Директор лагеря</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Координатор музыки</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Link href="/staff">
                    <Button className="w-full bg-[#B22234] hover:bg-[#8e1c29] text-white">
                      Вернуться к списку ролей
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
