import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Wrench } from "lucide-react"

export default function FacilitiesCoordinatorRolePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/staff">
          <Button variant="ghost" className="pl-0 flex items-center text-[#B22234]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к списку ролей
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Координатор хоз-части</h1>
        <div className="mt-2 h-1 w-20 bg-[#FFD700]"></div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-[#B22234]">Общая информация</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            <strong>Подчиняется:</strong> Директору лагеря
          </p>

          <h3 className="font-bold text-lg mb-2">Главная задача</h3>
          <p className="mb-4">
            Обеспечивать бесперебойную работу и техническое состояние производственных помещений и обеспечивающих
            систем.
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow mb-8">
        <CardHeader>
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
              <Wrench className="h-5 w-5 text-[#B22234]" />
            </div>
            <CardTitle className="text-xl text-[#B22234]">Зоны ответственности / Обязанности</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Организация транспорта для инвентаря</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Установка / Разбор бассейна</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Ответственный за доставку / увоз</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Организация бани</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Организация постельного белья - раздача, сбор</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Ответственный за координацию мусора</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Обеспечение исправности технических систем лагеря</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Контроль состояния инфраструктуры лагеря</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link href="/staff">
          <Button className="bg-[#B22234] hover:bg-[#8e1c29] text-white">Вернуться к списку ролей</Button>
        </Link>
      </div>
    </div>
  )
}
