import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, FileText, Heart, Shield, Users, Clock, Sun, AlertTriangle, CheckCircle2 } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"

export default function ParentsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/top_background-K6FRFr6idzV7UAiF4VJuWziFOUixuZ.webp"
            alt="Информация родителям"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <TranslatedText text="Информация родителям" />
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-xl text-white">
              <TranslatedText text="Всё, что вам нужно знать о лагере Маранафа" />
            </p>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#B22234]">
                  <TranslatedText text="Содержание" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  <Link
                    href="#contacts"
                    className="block py-2 text-gray-700 hover:text-[#B22234] border-b border-gray-100"
                  >
                    <TranslatedText text="Контактная информация" />
                  </Link>
                  <Link
                    href="#documents"
                    className="block py-2 text-gray-700 hover:text-[#B22234] border-b border-gray-100"
                  >
                    <TranslatedText text="Необходимые документы" />
                  </Link>
                  <Link
                    href="#values"
                    className="block py-2 text-gray-700 hover:text-[#B22234] border-b border-gray-100"
                  >
                    <TranslatedText text="Ценности лагеря" />
                  </Link>
                  <Link
                    href="#safety"
                    className="block py-2 text-gray-700 hover:text-[#B22234] border-b border-gray-100"
                  >
                    <TranslatedText text="Безопасность детей" />
                  </Link>
                  <Link
                    href="#spiritual"
                    className="block py-2 text-gray-700 hover:text-[#B22234] border-b border-gray-100"
                  >
                    <TranslatedText text="Духовная направленность" />
                  </Link>
                  <Link
                    href="#location"
                    className="block py-2 text-gray-700 hover:text-[#B22234] border-b border-gray-100"
                  >
                    <TranslatedText text="Место проведения и как добраться" />
                  </Link>
                  <Link
                    href="/schedule"
                    className="block py-2 text-gray-700 hover:text-[#B22234] border-b border-gray-100"
                  >
                    <TranslatedText text="Расписание" />
                  </Link>
                  <Link
                    href="#packing"
                    className="block py-2 text-gray-700 hover:text-[#B22234] border-b border-gray-100"
                  >
                    <TranslatedText text="Что брать с собой" />
                  </Link>
                  <Link
                    href="#rules"
                    className="block py-2 text-gray-700 hover:text-[#B22234] border-b border-gray-100"
                  >
                    <TranslatedText text="Правила лагеря" />
                  </Link>
                  <Link
                    href="#camp2025"
                    className="block py-2 text-gray-700 hover:text-[#B22234] border-b border-gray-100"
                  >
                    <TranslatedText text="Информация о лагере 2025" />
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-[#B22234]">
                    <TranslatedText text="Страничка на Фейсбуке" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href="http://facebook.com/maranafacamp/"
                    target="_blank"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <span className="mr-2">facebook.com/maranafacamp</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-[#B22234]">
                    <TranslatedText text="Лента фото и видео в Телеграме" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href="https://t.me/maranafacamp"
                    target="_blank"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <span className="mr-2">t.me/maranafacamp</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.27-.535.133l.76-3.04L16.78 9.19c.308-.274-.068-.425-.475-.274l-8.114 5.099-3.49-1.086c-.76-.242-.775-.76.158-1.125l13.662-5.261c.533-.198 1.038.13.83.83z" />
                    </svg>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section id="contacts" className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              <TranslatedText text="Контактная информация" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold">
                      <TranslatedText text="Директор / Регистрация участников" />
                    </p>
                    <p>
                      <TranslatedText text="Алекс одбрезский" />
                    </p>
                    <p className="text-gray-600">+371 20172714</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold">
                      <TranslatedText text="Зам директора" />
                    </p>
                    <p>Федор Калниньш</p>
                    <p className="text-gray-600">+371 22331104</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold">
                      <TranslatedText text="Координатор Программы (дети 7-12 лет)" />
                    </p>
                    <p>Ирина Йоц</p>
                    <p className="text-gray-600">+371 26352546</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold">
                      <TranslatedText text="Координатор Программы (дети 13-17 лет)" />
                    </p>
                    <p>Лариса Юганова</p>
                    <p className="text-gray-600">+371 28808607</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section id="documents" className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              <TranslatedText text="Необходимые документы от родителей" />
            </h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <FileText className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Подписанный договор участника и согласие с правилами лагеря (присылаем на е-майл)" />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FileText className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Указание в форме регистрации если есть ли прививка от энцефалита - необходимо, чтобы знать как действовать в редком случае" />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FileText className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="По приезду подписание ребенком согласия с правилами лагеря" />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FileText className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="По приезду - подписание родителем согласия, что они осмотрели вещи и у ребенка с собой нет привезенных запрещенных вещей или веществ с собой" />
                    </span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p>
                    <TranslatedText text="В русскоговорящую группу можем принять только тех детей, которые говорят и понимают по русски." />
                  </p>
                  <p className="mt-2">
                    <TranslatedText text="У нас также есть отдельная латышская группа." />
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Camp Values */}
      <section id="values" className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              <TranslatedText text="Ценности лагеря Маранафа" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center mb-4">
                      <Sun className="h-6 w-6 text-[#B22234]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#B22234] mb-2">
                      <TranslatedText text="Радость" />
                    </h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6 text-[#B22234]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#B22234] mb-2">
                      <TranslatedText text="Безопасность" />
                    </h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-[#B22234]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#B22234] mb-2">
                      <TranslatedText text="Уважение" />
                    </h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center mb-4">
                      <Heart className="h-6 w-6 text-[#B22234]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#B22234] mb-2">
                      <TranslatedText text="Духовность" />
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section id="safety" className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              <TranslatedText text="Как мы работаем и смотрим за детьми" />
            </h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <strong>
                        <TranslatedText text="Радость и безопасность" />
                      </strong>{" "}
                      <TranslatedText text="участника в лагере для нас на первом месте!" />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Мы заботимся о физической, эмоциональной и духовной безопасности каждого ребенка по заранее продуманным критериям (их более 100), в зонах ответственности по которым каждый сотрудник и участник проинструктирован и подписал договор." />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="В лагере не место буллингу и моббингу." />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Каждый сотрудник имеет при себе" />{" "}
                      <strong>
                        <TranslatedText text="рацию" />
                      </strong>
                      <TranslatedText text='. Именно это помогает нам иметь "глаза и уши" по всему лагерю в любой момент времени. Наставник/помощник находится с детьми 24/7 и спит с ними в домике.' />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="В домике с девочками - находится и спит наставник женщина." />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="В домике с мальчиками - находится и спит наставник мужчина." />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Когда наставник отлучается - его заменяет помощник." />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Утром, на тихом часу и вечером во время планерок сотрудников у нас в лагере посменный патруль, чтобы обеспечить безопасный отдых." />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Когда группа идёт на купание в местной речке - мы обеспечиваем 1 сотрудника на 4х детей, которые находятся с ними в воде, а также смотрят с берега." />
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Spiritual Direction */}
      <section id="spiritual" className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              <TranslatedText text="Духовная направленность" />
            </h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="У каждого ребенка свобода вероисповедания и наш лагерь обще-христианский, не-конфессиональный." />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Мы работаем над развитием характера, чтобы вырастить добрых, уверенных, радостных, благодарных, посвященных людей." />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p>
                        <TranslatedText text="Наша цель - познакомить детей с Библией и Иисусом Христом на занятиях через интересные занятия." />
                      </p>
                      <ul className="mt-2 space-y-2 pl-6">
                        <li className="list-disc">
                          <TranslatedText text="О том что Библия - это собрание из 66 книг, написанное разными людьми об одном Боге на протяжении 1600 лет" />
                        </li>
                        <li className="list-disc">
                          <TranslatedText text="Откуда пошли люди - история сотворения мира" />
                        </li>
                        <li className="list-disc">
                          <TranslatedText text="Что говорит Бог об отношениях с Ним и другими людьми основываясь на 10 заповедях" />
                        </li>
                        <li className="list-disc">
                          <TranslatedText text="Почему важно уважать и слушать родителей?" />
                        </li>
                        <li className="list-disc">
                          <TranslatedText text="Как быть хорошим другом / подругой?" />
                        </li>
                        <li className="list-disc">
                          <TranslatedText text="Какой пример посвящения и дружбы мы можем взять у Иисуса Христа?" />
                        </li>
                        <li className="list-disc">
                          <TranslatedText text="Настоящие сокровища - это характер, который поможет приобрести все остальное" />
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              <TranslatedText text="Место проведения лагеря" />
            </h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold">
                    <TranslatedText text="Адрес:" />
                  </p>
                  <p>Norkalni</p>
                  <p>Bajārkrogs</p>
                  <p>Ropažu novads</p>
                  <p>Rigas rajons</p>
                  <p>LV-2135</p>
                </div>
              </div>
            </div>

            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2173.0734234762166!2d24.6124!3d56.9748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTbCsDU4JzI5LjMiTiAyNMKwMzYnNDQuNiJF!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#B22234]">
                    <TranslatedText text="Посмотреть на карте Google Maps" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href="https://maps.app.goo.gl/ivVQtyzamUQAv7b29?g_st=ic"
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    maps.app.goo.gl/ivVQtyzamUQAv7b29
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#B22234]">
                    <TranslatedText text="Инструкции для навигатора Waze" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href="https://waze.com/ul/hud1kp2rxu"
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    waze.com/ul/hud1kp2rxu
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#B22234]">
                    <TranslatedText text="Время приезда" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Clock className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                      <span>
                        <TranslatedText text="Пятница, 8 августа, 13:30 - 15:00" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Clock className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                      <span>
                        <TranslatedText text="Расположение по домикам начинается c 14:00" />
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#B22234]">
                    <TranslatedText text="Время отъезда" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Пятница, 15 августа, 13:30 - 16:00. Утром программа по расписанию" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Packing List */}
      <section id="packing" className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              <TranslatedText text="Что важно взять с собой" />
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#B22234]">
                    <TranslatedText text="Что брать" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Постельное белье (комплект можно арендовать на месте за 5 евро, сообщите заранее, если есть такая необходимость)" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Экстра одеяло (или тёплое одеяло) - некоторые ночи могут быть прохладными" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Одежда на теплое и холодное время" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Бутылка для воды с именем ребенка" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Комплект одежды, который не жалко испачкать (для кружков)" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Резиновые сапоги на случай дождливой погоды" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Спортивные кроссовки" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Резиновые сланцы" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Сменное нижнее белье на неделю" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Полотенце" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Головной убор от солнца" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Зубная щетка / паста" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Шампунь / гель для душа" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Средства личной гигиены для девочек" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Средство от укусов насекомых" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Крем от солнца" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Плавки / купальник" />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>
                        <TranslatedText text="Фен для девочек сушить волосы" />
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div>
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#B22234]">
                      <TranslatedText text="Что НЕ брать" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <TranslatedText text="Пожалуйста не давайте в лагерь сладкое. Ваших детей ждет сбалансированное 5-ти разовое питание (завтрак, обед, полдник, ужин, снек) и отличная программа." />
                    </p>
                    <p className="mt-4">
                      <TranslatedText text="Вы очень поможете нам сделать пребывание ваших детей радостным, если дадите нам возможность выдавать сладкое в рамках питания и программы. Заранее благодарим 😉" />
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-[#B22234]">
                      <TranslatedText text="Детям старше 10 лет важно самим" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <TranslatedText text="Проверяться на клещей (мы напоминаем)" />
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <TranslatedText text="Пить воду (мы напоминаем)" />
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <TranslatedText text="Одевать головной убор" />
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <TranslatedText text="Смотреть за своей гигиеной - принимать душ, менять белье" />
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <TranslatedText text="Мазаться кремом против солнца и против клещей" />
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <TranslatedText text="Отвечать за сохранность своих вещей" />
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <TranslatedText text="Заряжать свои телефоны" />
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD700] mr-2">•</span>
                        <span>
                          <TranslatedText text="Следить за своим самочуствием и докладывать наставнику-вожатому или медсестре" />
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section id="rules" className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              <TranslatedText text="⚠️ Дополненные правила лагеря" />
            </h2>

            <p className="mb-4">
              <TranslatedText text="Чтобы обезопасить ваших детей во время пребывания в лагере, мы добавили следующие пункты в этом году. Пожалуйста сообщите о них детям, и мы также сообщим об этом в первый день лагеря:" />
            </p>

            <div className="bg-gray-100 p-6 rounded-lg mb-8 flex">
              <div className="text-3xl text-[#B22234] mr-4">⚠️</div>
              <div>
                <p className="font-bold">
                  <TranslatedText text="Нарушение одного из этих правил приведет отстранению от участия в лагере и поездкой домой в тот же день." />
                </p>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <p className="font-bold mb-4">
                  <TranslatedText text="Категорически запрещено:" />
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Делать фото и видео себя или кого-то или чего-то другого. Фото можно делать только с согласованием и разрешения директора (чтобы уберечь других участников от неприятных и нежелательных фотографий)" />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Выкладывание неофициального медиа контента в интернет без разрешения директора" />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Любой просмотр 14+ и 18+ контента" />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Ношение одежды с изображением неприличных/матных выражений, жестов или картинок" />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Любое культурно неприемлемое физическое, эмоциональное и любое другое воздействие на другого участника лагеря или на его вещи (подглядывать, трогать приватные части тела, проявлять любую сексуальную активность)" />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Приведение в лагерь потенциально опасных вещей: ножи, зажигалки, спички, игральные карты, алкоголь, сигареты, вейпы, наркотические и химические вещества, энергетические напитки, любые лекарства без согласования с директором" />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Шутки, пранки, разукрашивания себя и других, прятание вещей, обзывательства, издевательства" />
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-[#B22234] mr-3 mt-1 flex-shrink-0" />
                    <span>
                      <TranslatedText text="Использование инвентаря или инфраструктуры (бассейн, батут, лазилки, рации) без особого разрешения или не в специально отведенное для этого время" />
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="py-16 bg-[#B22234]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              <TranslatedText text="Готовы зарегистрировать ребенка?" />
            </h2>
            <p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
              <TranslatedText text="Заполните форму регистрации и подарите своему ребенку незабываемую неделю в лагере Маранафа!" />
            </p>
            <div className="mt-8">
              <Button className="bg-white text-[#B22234] hover:bg-gray-100 px-8 py-6 text-xl" asChild>
                <a
                  href="https://airtable.com/appARC2ZsIecCWY2s/shr0CciHO8TthCjJw"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TranslatedText text="Регистрация" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
