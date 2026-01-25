import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Sun } from "lucide-react"

export default function SchedulePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=600&width=1600"
            alt="Расписание и Активности"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Расписание и Активности
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-xl text-white">
              Подробная информация о ежедневном распорядке и занятиях в лагере Маранафа
            </p>
          </div>
        </div>
      </section>

      {/* Daily Schedule */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ежедневное расписание</h2>

            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex">
                    <span className="font-bold w-20">08:00</span>
                    <span>Подъем</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">08:15</span>
                    <span>Зарядка</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">08:30</span>
                    <span>Утренняя история в группе</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">09:00</span>
                    <span>Завтрак</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">09:30</span>
                    <span>Утреннее собрание</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">10:30</span>
                    <span>Библейский час</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold w-20">11:30</span>
                    <div>
                      <span>Занятия по кружкам (активный и креативный отдых)</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2 pl-4">
                        <span>• Каллиграфия</span>
                        <span>• Рисование по стеклу</span>
                        <span>• Стрельбы с Лука</span>
                        <span>• Волейбол</span>
                        <span>• Лазилки</span>
                        <span>• Икебана</span>
                        <span>• Драма</span>
                        <span>• Приготовление еды</span>
                        <span>• Видео</span>
                        <span>• Чайная церемония</span>
                        <span>• Рисование на зеркале</span>
                        <span>• Купание</span>
                        <span>• Музыка</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">13:00</span>
                    <span>Обед</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">14:00</span>
                    <span>Тихий час</span>
                  </div>
                  <div className="flex items-start bg-yellow-50 p-2 rounded">
                    <span className="font-bold w-20">15:00</span>
                    <div>
                      <span>Игры и мастерклассы</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pl-4">
                        <span>• Каллиграфия и Искусство</span>
                        <span>• Лазилки по деревьям</span>
                        <span>• Игра в маджонг</span>
                        <span>• Видео</span>
                        <span>• Кузница - Рукоделие</span>
                        <span>• Приготовление десерта</span>
                        <span>• Драма</span>
                        <span>• Музыка</span>
                        <span>• Стрельба из лука</span>
                        <span>• Спорт / Купание</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">16:00</span>
                    <span>Полдник</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">16:30</span>
                    <span>Большая общелагерная игра</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">18:00</span>
                    <span>Ужин</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">18:30</span>
                    <span>Свободное время / Подготовка к вечернему собранию</span>
                  </div>
                  <div className="flex bg-yellow-50 p-2 rounded">
                    <span className="font-bold w-20"></span>
                    <span>Настольные игры, оригами, раскраски</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">19:45</span>
                    <span>Вечернее собрание</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">21:00</span>
                    <span>Снек и вечернее общение с наставником</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">21:30</span>
                    <span>Подготовка ко сну</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-20">22:00</span>
                    <span>Отбой</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gray-100 p-6 rounded-lg mb-8 flex">
              <div className="text-3xl text-[#B22234] mr-4">💡</div>
              <div>
                <p>
                  Для порядка в лагере дети сдают телефоны и берут их с 13:00 до 15:00 - это время тихого часа и самое
                  лучшее время с ними созвониться!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Schedule and Special Days */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Недельное расписание и особые дни</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
                      <Sun className="h-5 w-5 text-[#B22234]" />
                    </div>
                    <CardTitle className="text-xl text-[#B22234]">День заезда (Пятница)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>13:30 - 15:00 - Прибытие и регистрация</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>14:00 - Расселение по домикам</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>16:00 - Знакомство с территорией</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>18:00 - Ужин</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>19:45 - Вечернее собрание</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
                      <Clock className="h-5 w-5 text-[#B22234]" />
                    </div>
                    <CardTitle className="text-xl text-[#B22234]">День отъезда (Пятница)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>08:00 - Подъем</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>09:00 - Завтрак</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>10:00 - Сборы и подготовка к отъезду</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>13:30 - 16:00 - Отъезд</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="hover:shadow-md transition-shadow mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-[#B22234]">Особые события недели</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                    <div>
                      <p className="font-medium">Воскресенье - День тематических игр</p>
                      <p className="text-gray-600">Большая тематическая игра по всей территории лагеря</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                    <div>
                      <p className="font-medium">Понедельник - Творческий вечер</p>
                      <p className="text-gray-600">Презентации групп, песни, стихи и танцы</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                    <div>
                      <p className="font-medium">Среда - Вечер у костра</p>
                      <p className="text-gray-600">Песни под гитару, особое общение и угощения</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                    <div>
                      <p className="font-medium">Четверг - Заключительный концерт</p>
                      <p className="text-gray-600">Показ всех достижений за неделю, финальное представление</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workshops & Activities */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Кружки и Мастерклассы</h2>

            <Tabs defaultValue="workshops">
              <TabsList className="bg-gray-100 mb-6">
                <TabsTrigger
                  value="workshops"
                  className="data-[state=active]:bg-[#B22234] data-[state=active]:text-white"
                >
                  Творческие мастерские
                </TabsTrigger>
                <TabsTrigger value="food" className="data-[state=active]:bg-[#B22234] data-[state=active]:text-white">
                  Питание
                </TabsTrigger>
                <TabsTrigger
                  value="accommodation"
                  className="data-[state=active]:bg-[#B22234] data-[state=active]:text-white"
                >
                  Проживание
                </TabsTrigger>
              </TabsList>

              <TabsContent value="workshops">
                <Card>
                  <CardContent className="pt-6">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <strong>Видео</strong>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <strong>Кузница - Рукоделие</strong>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <strong>Искусство</strong> (рисование по стеклу)
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <strong>Приготовление азиатских пельменей</strong>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <strong>Каллиграфия</strong>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <strong>Драма</strong>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <strong>Музыка</strong>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <strong>Лазилки</strong> - Наставник + инструктор
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <strong>Стрельба из лука</strong>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <strong>Спорт</strong> / <strong>Купание</strong>
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="food">
                <Card>
                  <CardContent className="pt-6">
                    <p className="mb-4">В лагере организовано пятиразовое питание:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>Завтрак</span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>Обед</span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>Полдник</span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>Ужин</span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>Снек</span>
                      </li>
                    </ul>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">
                        Пожалуйста не давайте в лагерь сладкое. Ваших детей ждет сбалансированное 5-ти разовое питание и
                        отличная программа.
                      </p>
                      <p className="mt-2">
                        Вы очень поможете нам сделать пребывание ваших детей радостным, если дадите нам возможность
                        выдавать сладкое в рамках питания и программы. Заранее благодарим 😉
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="accommodation">
                <Card>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>Летний домик на 10 мест</span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>Вместе с группой и наставником</span>
                      </li>
                    </ul>
                    <div className="mt-4 p-4 bg-pink-50 rounded-lg">
                      <p>
                        Мы гибко подходим к пожеланиям по расселению и распределению по группам - это можно указать в
                        форме регистрации. Мы помогаем детям завести новые знакомства и развить дружбу. Распределение и
                        компоновку групп мы делаем по возрасту.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Фотогалерея активностей</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={`/placeholder.svg?height=400&width=400`}
                    alt={`Активность ${index}`}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button className="bg-[#B22234] hover:bg-[#8e1c29] text-white">Смотреть больше фото</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#B22234]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Готовы к приключениям?</h2>
            <p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
              Зарегистрируйте своего ребенка сегодня и подарите ему незабываемое лето в лагере Маранафа!
            </p>
            <div className="mt-8">
              <Button className="bg-white text-[#B22234] hover:bg-gray-100 px-8 py-6 text-xl">Регистрация</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
