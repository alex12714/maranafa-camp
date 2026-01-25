"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const staffRoles = [
  {
    title: "Координатор программы",
    description:
      "Задача разработать программу лагеря и качественно проводить её. Помогать наставникам эффективно выполнять свои обязанности и вместе с ними работать на соблюдение расписания лагеря.",
    link: "/roles/program-coordinator",
  },
  {
    title: "Наставник",
    description:
      "Лучший друг детей в лагере. Ответственный за свою группу детей, с которой находится практически все время, проводит уроки по программе, направляет на занятия и заботится об их безопасности.",
    link: "/roles/mentor",
  },
  {
    title: "Помощник наставника",
    description: "Правая рука для наставника. Следит за порядком в группе. Мотиватор и помощник для детей.",
    link: "/roles/mentor-assistant",
  },
  {
    title: "Координатор спорта",
    description:
      "Заботится об игровой части программы лагеря. Готовит и проводит утренние зарядки, игры и спортивные занятия. Подымает спортивный и жизнерадостный дух участников.",
    link: "/roles/sports-coordinator",
  },
  {
    title: "Спорт-инструктор",
    description: "Выполняет поручения координатора спорта для проведения всех необходимых спортивных мероприятий.",
    link: "/roles/sports-instructor",
  },
  {
    title: "Координатор музыки",
    description:
      "Позаботится об музыкальной части программы. Подготовить музыкальные номера на каждую утреннюю и вечернюю встречу. Координировать работу музыкантов.",
    link: "/roles/music-coordinator",
  },
  {
    title: "Музыкант",
    description: "Подготовить и участвовать в музыкальных номерах на каждую утреннюю и вечернюю встречу.",
    link: "/roles/musician",
  },
  {
    title: "Координатор мастеркласса",
    description:
      "Подготовит и провести мастер класс для детей. Наставлять и направлять детей для творческого развития.",
    link: "/roles/workshop-coordinator",
  },
  {
    title: "Координатор кухни",
    description:
      "Шеф повар лагеря. Не забываемый человек. По рецептам готовит блюда для приемов пиши и проверяет состояние ингредиентов. Владеет навыками готовки, осторожен и стресcоустойчив.",
    link: "/roles/kitchen-coordinator",
  },
  {
    title: "Работник кухни",
    description:
      "Ассистирует координатора кухни. Обеспечивает чистой посудой, а также занимается расставлением и уборкой зала.",
    link: "/roles/kitchen-worker",
  },
  {
    title: "Координатор хоз-части",
    description:
      "Обеспечивает бесперебойную работу и техническое состояние производственных помещений и обеспечивающих систем. Организует и следит за пользованием бани.",
    link: "/roles/facilities-coordinator",
  },
  {
    title: "Работник хоз-части",
    description:
      "Обеспечивает бесперебойную работу и технического состояние производственных помещений и обеспечивающих систем.",
    link: "/roles/facilities-worker",
  },
  {
    title: "Молитвенный координатор",
    description:
      "Заботится об молитвенной поддержке во время лагеря. Собирает молитвенные запросы. Проводит духовно воспитательные работы в проблемных случаях.",
    link: "/roles/prayer-coordinator",
  },
  {
    title: "Пастор лагеря",
    description:
      "Духовный ментор в лагере. Готовит и проводит проповеди на утренних и вечерних собраниях согласно общей теме и стилю лагеря. Моральная и духовная поддержка как сотрудникам, так и детям.",
    link: "/roles/camp-pastor",
  },
  {
    title: "Координатор медиа",
    description:
      "Ведет маркетинг до начала лагеря и после окончания лагеря. Ответственный за объявления по рации следующего события - голос лагеря. Заведует программным офисом, ведет инвентарный учет и распределение программных материалов.",
    link: "/roles/media-coordinator",
  },
  {
    title: "PR",
    description:
      "Ведет общение с родителями участников лагеря для обеспечения необходимой информацией и подписанию договоров. Совместно с директором программы планирует и организовывает Родительский день.",
    link: "/roles/pr",
  },
  {
    title: "Координатор сцены",
    description:
      "Заботится об подготовление и сохранения необходимых костюмах для представлений. Украшает зал с преждевременно подготовленным инвентарем.",
    link: "/roles/stage-coordinator",
  },
  {
    title: "Координатор шоу",
    description:
      "Подготавливает утренние и вечерние представления на собраниях. Решает технические и практические вопросы для качественного исполнения представлений на сцене.",
    link: "/roles/show-coordinator",
  },
  {
    title: "Медсестра",
    description: "Оказывает первую неотложную медицинскую помощь руководителю лагеря, сотрудникам и участникам.",
    link: "/roles/nurse",
  },
  {
    title: "Видео-оператор",
    description:
      "Занимается разработкой замысла съемки, устанавливает необходимое оборудование, осуществляет процесс съемки.",
    link: "/roles/video-operator",
  },
  {
    title: "Видео-монтажер",
    description: "Специалист, который монтирует и обрабатывает видеоматериалы.",
    link: "/roles/video-editor",
  },
]

const staffMembers = [
  { name: "АЛЕКС ПОДБРЕЗСКИЙ", role: "Директор лагеря" },
  { name: "ФЕДОР КАЛНИНЬШ", role: "Помощник директора" },
  { name: "ЕКАТЕРИНА ПОДБРЕЗСКАЯ", role: "Помощник наставник" },
  { name: "ИНЕТА ДРОБИЛЕНКО", role: "Наставник" },
  { name: "ЮЛИЯ МАЧНЕВА", role: "Наставник" },
  { name: "МАРИТЕ ОЗОЛИНЯ", role: "Наставник" },
  { name: "МИРА СЕЙТКАЛИЕВА", role: "Работник кухни" },
  { name: "ВАЛЕРИЙ СЕЙТКАЛИЕВ", role: "Наставник" },
  { name: "ИРИНА ЙОЦ", role: "Координатор программы" },
  { name: "АЛЕКСАНДРА БУТАНОВА", role: "Координатор спорта" },
  { name: "ЛАРИСА ЮГАНОВА", role: "Координатор программы" },
  { name: "ОЛЕГ МИХАЙЛОВ", role: "Пастор лагеря, видеокружок" },
  { name: "ЮРИЙ СКРЫПНИК", role: "Координатор мастеркласса, помощник наставника" },
  { name: "АЛЕКСАНДР ПОЛУПАНОВ", role: "Наставник" },
  { name: "ФЕЛИКС ЛОКШИНСКИЙ", role: "Наставник" },
  { name: "ВИКТОР ЛИСОВ", role: "Наставник" },
  { name: "ОКСАНА ЙОЦ", role: "Наставник" },
  { name: "ОЛЕГ ДРОБИЛЕНКО", role: "Хоз-часть" },
  { name: "ЛАРИСА СЕДОВА", role: "Помощик повара" },
  { name: "РОМАН ЛОЦАНС", role: "Хоз-часть" },
  { name: "ВИТАЛИЙ ДОКУКА", role: "Пастор лагеря" },
  { name: "ДЕНИС САМЧУК", role: "Спортинструктор" },
  { name: "НИКИТА АБРАМОВ", role: "Координатор мастеркласса" },
]

export default function StaffPage() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Сотрудникам</h1>
          <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Информация для сотрудников лагеря Маранафа</p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#B22234]">Стать сотрудником лагеря</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Если вы хотите стать частью команды лагеря Маранафа, заполните анкету и отправьте ее нам. Мы свяжемся с
                вами для дальнейшего обсуждения.
              </p>
              <p className="text-gray-700">Требования к сотрудникам:</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1 mt-2">
                <li>Возраст от 18 лет</li>
                <li>Христианское мировоззрение</li>
                <li>Любовь к детям</li>
                <li>Ответственность и пунктуальность</li>
                <li>Готовность работать в команде</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="bg-[#B22234] hover:bg-[#8e1c29] text-white"
                onClick={() => window.open("https://airtable.com/appARC2ZsIecCWY2s/shrUJpVYXF8P89c8T", "_blank")}
              >
                Заполнить анкету
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="roles" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="roles" className="data-[state=active]:bg-[#B22234] data-[state=active]:text-white">
                Роли в лагере
              </TabsTrigger>
              <TabsTrigger
                value="personnel"
                className="data-[state=active]:bg-[#B22234] data-[state=active]:text-white"
              >
                Наш персонал
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-[#B22234] data-[state=active]:text-white"
              >
                Документы
              </TabsTrigger>
              <TabsTrigger value="training" className="data-[state=active]:bg-[#B22234] data-[state=active]:text-white">
                Обучение
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="roles" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffRoles.map((role, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#B22234]">{role.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-sm">{role.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={role.link}>
                      <Button variant="ghost" className="text-[#B22234] hover:text-[#8e1c29] hover:bg-[#B22234]/10 p-0">
                        Узнать больше
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="personnel" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {staffMembers.map((member, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="font-bold text-[#B22234]">{member.name}</p>
                  <p className="text-gray-600 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#B22234]">Документы для сотрудников</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span className="text-gray-700">Инструкция для наставников</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span className="text-gray-700">Расписание лагеря</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span className="text-gray-700">Правила безопасности</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span className="text-gray-700">Контактная информация</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="bg-[#B22234] hover:bg-[#8e1c29] text-white">Скачать документы</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#B22234]">Обучающие материалы</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span className="text-gray-700">Как работать с детьми разного возраста</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span className="text-gray-700">Разрешение конфликтов</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span className="text-gray-700">Организация групповых активностей</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span className="text-gray-700">Духовное наставничество</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="bg-[#B22234] hover:bg-[#8e1c29] text-white">Смотреть материалы</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="training" className="mt-0">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[#B22234] mb-6 text-center">Обучающие видео для сотрудников</h2>

              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-[#B22234] mb-2">Введение в лагерь Маранафа</h3>
                    <p className="text-gray-700 mb-4">Общая информация о лагере, его миссии и ценностях.</p>
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        className="w-full h-96"
                        src="https://www.youtube.com/embed/Zy-2dDlQ7FM"
                        title="Введение в лагерь Маранафа"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-[#B22234] mb-2">Работа с детьми разных возрастов</h3>
                    <p className="text-gray-700 mb-4">
                      Особенности работы с детьми разных возрастных групп и как найти подход к каждому ребенку.
                    </p>
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        className="w-full h-96"
                        src="https://www.youtube.com/embed/Zy-2dDlQ7FM"
                        title="Работа с детьми разных возрастов"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-[#B22234] mb-2">Безопасность в лагере</h3>
                    <p className="text-gray-700 mb-4">Правила безопасности и действия в чрезвычайных ситуациях.</p>
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        className="w-full h-96"
                        src="https://www.youtube.com/embed/Zy-2dDlQ7FM"
                        title="Безопасность в лагере"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-[#B22234] mb-2">Духовное наставничество</h3>
                    <p className="text-gray-700 mb-4">Как быть духовным наставником для детей и подростков в лагере.</p>
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        className="w-full h-96"
                        src="https://www.youtube.com/embed/Zy-2dDlQ7FM"
                        title="Духовное наставничество"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-700 mb-4">
                    Для доступа к полному списку обучающих материалов, пожалуйста, посетите нашу страницу на Notion:
                  </p>
                  <Button
                    className="bg-[#B22234] hover:bg-[#8e1c29] text-white"
                    onClick={() =>
                      window.open("https://onfire.notion.site/1619955aa3b78153a0b8d7d365b98d9d?pvs=4", "_blank")
                    }
                  >
                    Открыть полный список материалов
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
