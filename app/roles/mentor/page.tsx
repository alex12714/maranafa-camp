import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, BookOpen, Home, Smile, ClipboardList } from "lucide-react"

export default function MentorRolePage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Наставник</h1>
        <div className="mt-2 h-1 w-20 bg-[#FFD700]"></div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-[#B22234]">Общая информация</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            <strong>Подчиняется:</strong> Координатору программы
          </p>

          <h3 className="font-bold text-lg mb-2">Квалификационные требования</h3>
          <ul className="space-y-1 mb-4">
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>На три года старше воспитанников, с которыми он работает</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Минимальный возраст 19 лет</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Призыв от Господа евангелизировать и обучать подростков</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Способность находить общий язык с подростками</span>
            </li>
          </ul>

          <h3 className="font-bold text-lg mb-2">Главная задача</h3>
          <p className="mb-4">
            Показать воспитанникам пример искупительных взаимоотношений, научить их строить такие взаимоотношения и
            сделать все возможное, чтобы они имели радость, находясь в лагере.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-[#B22234]" />
              </div>
              <CardTitle className="text-xl text-[#B22234]">Духовное лидерство</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>
                  Жить в группе состоящей из 8-9 воспитанников в возрасте от 9 до 15 лет, делиться с ними своим
                  жизненным опытом, верой и жизненными ценностями
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Наладить личные взаимоотношения с каждым воспитанником</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Ежедневно молиться за каждого воспитанника</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Готовить ежедневные библейские уроки и молитвы</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Побуждать воспитанников заучивать наизусть стихи из Писания</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Учить воспитанников молиться</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Помочь воспитанникам выработать хорошие навыки личной молитвы</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Научить воспитанников самостоятельно изучать Библию</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Рассказать своим воспитанникам свой "Путь веры"</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>
                  Организовать своих воспитанников подготовить и представить на вечернем собрании историю из Библии
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-[#B22234]" />
              </div>
              <CardTitle className="text-xl text-[#B22234]">Социальное лидерство</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Наладить личные взаимоотношения с каждым воспитанником</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Развивать интенсивную динамику группы</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Наблюдать за каждым воспитанником с целью раскрыть его дары, способности и сильные стороны</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Призывать воспитанников к честности, открытости и доверию друг ко другу</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Учить воспитанников любить ближних своих как самих себя</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
                <Home className="h-5 w-5 text-[#B22234]" />
              </div>
              <CardTitle className="text-xl text-[#B22234]">Бытовое лидерство</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Приготовить комнату за два дня до прибытия воспитанников</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Вместе с воспитанниками ежедневно убирать и наводить порядок</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Следить за тем, чтобы каждый воспитанник соблюдал правила личной гигиены</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Стараться искать пути, которые позволят внести свой вклад в благосостояние всего лагеря</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
                <Smile className="h-5 w-5 text-[#B22234]" />
              </div>
              <CardTitle className="text-xl text-[#B22234]">Лидерство на досуге</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Усвоить способы организации досуга</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Научиться играть во многие игры и эффективно их преподносить</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Вместе с воспитанниками планировать время досуга</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Позаботиться о том, чтобы у каждого воспитанника всегда была возможность принимать участие</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Учить воспитанников правильно пользоваться и ухаживать за спортивным инвентарем</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Полностью брать на себя ответственность за организацию походов за территорию лагеря</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-shadow mb-8">
        <CardHeader>
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
              <ClipboardList className="h-5 w-5 text-[#B22234]" />
            </div>
            <CardTitle className="text-xl text-[#B22234]">Административное лидерство</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Полностью отвечать за каждого воспитанника вашей группы</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Следить за своими воспитанниками и докладывать координатору программы</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Присутствовать на всех собраниях сотрудников</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Сдать координатору программы письменную характеристику на каждого воспитанника</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Вернуть все программные материалы, оборудование и инвентарь перед отъездом</span>
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
