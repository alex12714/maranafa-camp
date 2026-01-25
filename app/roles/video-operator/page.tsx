import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Video, Camera, Settings, Users } from "lucide-react"

export default function VideoOperatorPage() {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Видео-оператор</h1>
            <div className="h-1 w-20 bg-[#FFD700]"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#B22234] flex items-center">
                    <Video className="mr-2 h-5 w-5" />
                    Описание роли
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    Видео-оператор отвечает за профессиональную видеосъемку всех мероприятий лагеря. Занимается
                    разработкой замысла съемки, устанавливает необходимое оборудование, осуществляет процесс съемки
                    утренних и вечерних собраний, спортивных мероприятий, мастер-классов и других активностей лагеря.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#B22234] flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Основные обязанности
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Планирование и подготовка видеосъемки мероприятий лагеря</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Установка и настройка видеооборудования (камеры, штативы, освещение)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Съемка утренних и вечерних собраний, проповедей, музыкальных номеров</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Документирование спортивных мероприятий и мастер-классов</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Создание интервью с участниками и сотрудниками лагеря</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Съемка общих моментов жизни лагеря и атмосферных кадров</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Передача отснятого материала видео-монтажеру</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Обслуживание и уход за видеооборудованием</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#B22234] flex items-center">
                    <Camera className="mr-2 h-5 w-5" />
                    Необходимые навыки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Опыт работы с профессиональным видеооборудованием</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Понимание основ композиции и кадрирования</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Умение работать в различных условиях освещения</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Креативное мышление и художественный вкус</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Физическая выносливость для длительной работы</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Внимательность к деталям и ответственность</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2 mt-1">•</span>
                      <span>Умение работать в команде с другими медиа-специалистами</span>
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
                    <p className="text-gray-700">Желателен опыт видеосъемки</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Время работы:</p>
                    <p className="text-gray-700">Весь период лагеря</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Особые требования:</p>
                    <p className="text-gray-700">Собственное оборудование приветствуется</p>
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
                      <span>Видео-монтажер</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Координатор сцены</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Координатор шоу</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Пастор лагеря</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button asChild className="w-full bg-[#B22234] hover:bg-[#8e1c29] text-white">
                    <Link href="/staff">Вернуться к списку ролей</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
