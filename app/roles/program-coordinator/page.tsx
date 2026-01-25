import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ClipboardList } from "lucide-react"

export default function ProgramCoordinatorRolePage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Координатор программы</h1>
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

          <h3 className="font-bold text-lg mb-2">Квалификационные требования</h3>
          <ul className="space-y-1 mb-4">
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Успешно проработал наставником не менее четырех смен в два разных сезона</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Не младше 22 лет</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Пользуется уважением у сотрудников</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Способный организатор, умеющий находить общий язык с сотрудниками и воспитанниками</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Имеющий необходимые педагогические навыки работы с молодыми людьми в возрасте 11-18 лет</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Физически и умственно здоров, вынослив, способен работать с большой нагрузкой</span>
            </li>
          </ul>

          <h3 className="font-bold text-lg mb-2">Главная задача</h3>
          <p className="mb-4">
            Помогать наставникам эффективно выполнять свои обязанности и качественно проводить программу. И работать с
            ними на соблюдение расписания лагеря.
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow mb-8">
        <CardHeader>
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
              <ClipboardList className="h-5 w-5 text-[#B22234]" />
            </div>
            <CardTitle className="text-xl text-[#B22234]">Зоны ответственности / Обязанности</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Создание расписания</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Составление легенды</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Организация программы</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Ответственный за проведение утренних и вечерних собраний</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Ответственный за назначение дежурной группы</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Ответственный за работу наставников</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Ответственный за своевременное проведение уроков наставниками</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Ответственный за назначение декораторов и украшения сцены</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Ежедневно молиться за наставников</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Планировать и проводить вечерние собрания</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>
                    Вместе с сотрудниками учебно-воспитательной части планировать и проводить программы Открытия и
                    Закрытия лагеря
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Составить график сценок по группам и просматривать сценки в процессе их подготовки</span>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Составлять и проводить в жизнь распорядок дня</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>
                    Организовывать и контролировать регистрацию воспитанников, формирование групп и распределение по
                    комнатам
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Ежедневно молиться за директора</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Назначать наставников на подходящие возрастные группы</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Контролировать выполнение заданий по программе</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Наблюдать и контролировать качество прохождения всей программы лагеря</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Заведовать программным офисом</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Заведовать костюмами и сценическим реквизитом</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Ежедневно информировать директора программы о положении дел в своем отделе</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2">•</span>
                  <span>Составить план программы для детей 10-15 и 16-18 лет до начала работы лагеря</span>
                </li>
              </ul>
            </div>
          </div>
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
