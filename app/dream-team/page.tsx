"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TranslatedText } from "@/components/translated-text"
import {
  ArrowLeft,
  Anchor,
  HandHeart,
  Handshake,
  Users,
  ClipboardList,
  Euro,
  TrendingUp,
  FileSignature,
  ScrollText,
  CheckCircle2,
  Star,
} from "lucide-react"

function T({ text }: { text: string }) {
  return <TranslatedText text={text} />
}

const benefits = [
  "Настоящую роль в команде лагеря и доверие взрослых — а не место «на скамейке».",
  "Наставничество и поддержку команды: тебя не оставляют одного.",
  "Новый опыт, навыки и умение работать в команде — то, что пригодится в жизни и работе.",
  "Участие в лагере по льготной ставке сотрудника, а не по полной цене.",
  "Официальное рекомендательное письмо по итогам лагеря — его можно приложить при поступлении на работу или учёбу.",
]

const taskExamples = [
  "Подготовка и установка инвентаря для спортивных игр.",
  "Подготовка инвентаря к предстоящим мероприятиям.",
  "Участие в дежурстве по уборке туалетов и душевых.",
  "Помощь на кухне: расстановка и уборка посуды.",
  "Помощь в мойке посуды на кухне.",
  "Помощь в погрузке и разгрузке инвентаря.",
  "Помощь наставнику в присмотре за группой во время общелагерных мероприятий.",
]

const scaleRows = [
  { score: "10", text: "выдающийся день: инициатива, помог другим, был отличным примером", color: "bg-green-100 text-green-800" },
  { score: "8–9", text: "норма экипажа: пришёл, включился, выполнил, держался хорошо — обычный хороший день", color: "bg-emerald-50 text-emerald-800" },
  { score: "7", text: "были шероховатости (опоздал, отвлёкся, задание сделал частично)", color: "bg-yellow-50 text-yellow-800" },
  { score: "5–6", text: "день не задался — есть над чем подумать", color: "bg-orange-50 text-orange-800" },
  { score: "1–4", text: "почти не включился или нарушил договорённости", color: "bg-red-50 text-red-800" },
]

const assessmentRows = ["П1", "П2", "П3", "П4", "Д1", "Д2", "Д3", "Д4", "Д5", "Д6", "Д7"]

const signatureRoles = [
  "Участник команды «Дрим-тим»",
  "Родитель / законный представитель",
  "Представитель лагеря «Небо зовёт!»",
]

function Blank({ width = "w-40" }: { width?: string }) {
  return <span className={`inline-block ${width} border-b border-gray-400 align-baseline`}>&nbsp;</span>
}

export default function DreamTeamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-sky-600 text-white">
        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <T text="На главную" />
          </Link>
        </div>
        <div className="container mx-auto max-w-4xl px-6 pt-28 pb-16 text-center">
          <p className="text-[#FFD700] font-medium uppercase tracking-wider text-sm mb-3">
            <T text="Детский христианский лагерь «Небо зовёт!» · фонд «Maranafa»" />
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <T text="Команда «Дрим-тим»" />
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 font-light">
            <T text="Твой шаг из пассажиров в экипаж" />
          </p>
          <p className="mt-6 max-w-2xl mx-auto text-blue-50/90 leading-relaxed">
            <T text="Ты уже не участник, которого нужно развлекать, — ты становишься частью команды, которая делает лагерь. «Дрим-тим» — это молодой экипаж «Небо зовёт!»: настоящая ответственность, служение рядом со взрослыми и первый опыт работы в команде." />
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 md:px-6 py-12 space-y-10">
        {/* Intro note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-blue-900 text-sm leading-relaxed">
          <T text="На этой странице — полный текст внутреннего соглашения участника команды «Дрим-тим» и пример листа самооценки, чтобы вы могли ознакомиться с ними заранее. Это соглашение — не про запреты, а про честную договорённость: что ты получаешь и что берёшь на себя, присоединяясь к экипажу. Общие условия участия в лагере регулируются отдельным официальным договором, который подписывается дополнительно." />
        </div>

        {/* ============ AGREEMENT ============ */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              <T text="Внутреннее соглашение" />
            </h2>
            <p className="text-gray-600 mt-1">
              <T text="участника команды «Дрим-тим»" />
            </p>
          </div>

          <div className="space-y-6">
            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <HandHeart className="h-6 w-6 text-blue-600 shrink-0" />
                  <T text="Что тебе даёт участие в «Дрим-тим»" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        <T text={b} />
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* First step */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Anchor className="h-6 w-6 text-blue-600 shrink-0" />
                  <T text="Первый шаг — твоя встреча с директором" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>
                  <T text="Прежде чем подписать соглашение, ты сам(а) договариваешься о личной встрече с директором лагеря, чтобы разобрать все пункты и задать любые вопросы. Это твоё первое задание как участника команды — и первый показатель ответственности." />
                </p>
                <p>
                  <T text="Контакт директора для записи:" /> <Blank />
                </p>
                <p>
                  <T text="Дата встречи:" /> <Blank />
                </p>
              </CardContent>
            </Card>

            {/* 1. Participant data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Users className="h-6 w-6 text-blue-600 shrink-0" />
                  <T text="1. Данные участника" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>
                  <T text="ФИО участника:" /> <Blank width="w-64" />
                </p>
                <p>
                  <T text="Дата рождения / возраст:" /> <Blank width="w-48" />
                </p>
                <p>
                  <T text="Телефон / контакт:" /> <Blank width="w-56" />
                </p>
                <p>
                  <T text="ФИО родителя (законного представителя):" /> <Blank width="w-64" />
                </p>
                <p>
                  <T text="Контакт родителя:" /> <Blank width="w-56" />
                </p>
              </CardContent>
            </Card>

            {/* 2. Expectations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <ClipboardList className="h-6 w-6 text-blue-600 shrink-0" />
                  <T text="2. Что мы ждём от тебя" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p>
                  <strong>2.1</strong>{" "}
                  <T text="Посещать все запланированные мероприятия и активности лагеря по расписанию." />
                </p>
                <p>
                  <strong>2.2</strong>{" "}
                  <T text="Выполнять все задания и поручения от координаторов и руководства." />
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium mb-2">
                    <T text="Например, задания могут быть такими:" />
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {taskExamples.map((t) => (
                      <li key={t}>
                        <T text={t} />
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="italic text-gray-600">
                  <T text="Служение — это и заметные роли, и совсем незаметные, вроде швабры и посуды. В этом и есть смысл: ты делаешь лагерь возможным наравне со взрослыми." />
                </p>
                <p>
                  <strong>2.3</strong>{" "}
                  <T text="Участвовать во всех планёрках — онлайн до лагеря и во время лагеря." />
                </p>
                <p>
                  <strong>2.4</strong>{" "}
                  <T text="Быть примером для младших детей: в поведении, словах и отношении к другим." />
                </p>
                <p>
                  <strong>2.5</strong>{" "}
                  <T text="Заранее сообщать координатору, если не можешь присутствовать по уважительной причине (болезнь, семейные обстоятельства)." />
                </p>
              </CardContent>
            </Card>

            {/* 3. Our promises */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Handshake className="h-6 w-6 text-blue-600 shrink-0" />
                  <T text="3. Что мы обещаем со своей стороны" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>
                  <strong>3.1</strong>{" "}
                  <T text="Заранее давать тебе расписание, задания и всю нужную информацию." />
                </p>
                <p>
                  <strong>3.2</strong>{" "}
                  <T text="Поддерживать и помогать в течение лагеря — ты не остаёшься один." />
                </p>
                <p>
                  <strong>3.3</strong>{" "}
                  <T text="Честно и вовремя вернуть залог по итогам участия (см. раздел 4)." />
                </p>
                <p>
                  <strong>3.4</strong>{" "}
                  <T text="Выдать официальное рекомендательное письмо по итогам лагеря, которое можно использовать при поступлении на работу или учёбу." />
                </p>
              </CardContent>
            </Card>

            {/* 4. Financial terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Euro className="h-6 w-6 text-blue-600 shrink-0" />
                  <T text="4. Финансовые условия" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                  <T text="Льготная ставка сотрудника — это привилегия, которую ты подтверждаешь тем, что реально в команде: приходишь и берёшь на себя свою часть. Чтобы закрепить договорённость, вся сумма вносится сразу как возвратный залог, а разница возвращается после лагеря. Это возврат заработанной скидки, а не штраф." />
                </p>
                <p>
                  <strong>4.1</strong> <T text="Льготная ставка сотрудника:" /> <Blank width="w-20" /> EUR.
                </p>
                <p>
                  <strong>4.2</strong>{" "}
                  <T text="При регистрации вносится полная ставка участника как возвратный залог:" />{" "}
                  <Blank width="w-20" /> EUR.
                </p>
                <p>
                  <strong>4.3</strong> <T text="После лагеря залог возвращается (разница —" />{" "}
                  <Blank width="w-20" />{" "}
                  <T text="EUR), если ты участвовал(а) в планёрках и днях лагеря и брал(а) на себя задания команды." />
                </p>
                <p>
                  <strong>4.4</strong>{" "}
                  <T text="Пропуск по уважительной причине, о котором ты сообщил(а) заранее, на возврат не влияет." />
                </p>
                <p>
                  <strong>4.5</strong>{" "}
                  <T text="На возврат влияет только систематический пропуск без причины или отказ от заданий — и то сначала будет разговор с наставником и возможность выправиться, а не молчаливое удержание." />
                </p>
                <p>
                  <strong>4.6</strong>{" "}
                  <T text="Если договорённость всё же не выполнена, участие засчитывается по обычной ставке участника. Это не штраф: ты оплачиваешь участие как обычный участник лагеря." />
                </p>
                <p>
                  <strong>4.7</strong> <T text="Возвратная сумма выдаётся в последний день лагеря." />
                </p>
              </CardContent>
            </Card>

            {/* 5. Self-assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <TrendingUp className="h-6 w-6 text-blue-600 shrink-0" />
                  <T text="5. Самооценка и рост" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>
                  <T text="Каждый день ты сам(а) честно оцениваешь свой день — участие, задания, отношения — в личном листе самооценки. Это инструмент твоего роста, а не проверка: его никто не оценивает за тебя, и с оплатой он не связан." />
                </p>
                <p>
                  <T text="Экипаж держит для себя планку — средняя самооценка 7 и выше. Это наш общий ориентир и повод для честного разговора с собой, а не условие возврата залога." />
                </p>
                <p className="text-sm text-blue-700">
                  <T text="Пример листа самооценки — ниже на этой странице." />
                </p>
              </CardContent>
            </Card>

            {/* 6. Agreement & official contract */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <ScrollText className="h-6 w-6 text-blue-600 shrink-0" />
                  <T text="6. Соглашение и официальный договор" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>
                  <strong>6.1</strong>{" "}
                  <T text="Настоящее соглашение — это внутренняя договорённость команды «Дрим-тим». Оно дополняет официальный договор об участии в лагере, а не заменяет его." />
                </p>
                <p>
                  <strong>6.2</strong>{" "}
                  <T text="Все прочие условия участия (общие правила, оплата, безопасность, ответственность, обработка персональных данных) регулируются отдельным официальным подписанным договором." />
                </p>
                <p>
                  <strong>6.3</strong>{" "}
                  <T text="При отказе от участия до начала лагеря возврат внесённой суммы производится по договорённости с организаторами в зависимости от сроков отказа." />
                </p>
                <p>
                  <strong>6.4</strong>{" "}
                  <T text="Соглашение вступает в силу с момента подписания обеими сторонами и действует до завершения лагеря и полного расчёта залога." />
                </p>
              </CardContent>
            </Card>

            {/* 7. Signatures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <FileSignature className="h-6 w-6 text-blue-600 shrink-0" />
                  <T text="7. Подписи сторон" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p className="flex items-start gap-2">
                  <span className="inline-block h-4 w-4 border border-gray-500 rounded-sm mt-1 shrink-0" />
                  <T text="Встреча с директором проведена, все вопросы обсуждены." />
                </p>
                <p>
                  <T text="С условиями соглашения ознакомлен(а) и обязуюсь их выполнять." />
                </p>
                <p className="text-sm text-gray-600">
                  <T text="Для участников младше 18 лет обязательна подпись родителя (законного представителя)." />
                </p>
                <div className="space-y-5 pt-2">
                  {signatureRoles.map((role) => (
                    <div key={role}>
                      <div className="flex gap-8">
                        <Blank width="w-48" />
                        <Blank width="w-48" />
                      </div>
                      <div className="flex gap-8 text-xs text-gray-500 mt-1">
                        <span className="w-48">
                          <T text="подпись" />
                        </span>
                        <span className="w-48">
                          <T text="ФИО (расшифровка)" />
                        </span>
                      </div>
                      <p className="text-sm font-medium mt-1">
                        <T text={role} />
                      </p>
                    </div>
                  ))}
                </div>
                <p className="pt-2">
                  <T text="Дата:" /> <Blank width="w-32" /> &nbsp;&nbsp; <T text="Место:" /> <Blank width="w-32" />
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ============ SELF-ASSESSMENT SHEET ============ */}
        <section id="self-assessment">
          <div className="text-center mb-8 pt-4">
            <h2 className="text-3xl font-extrabold text-gray-900">
              <T text="Лист самооценки" />
            </h2>
            <p className="text-gray-600 mt-1">
              <T text="команда «Дрим-тим» · «Небо зовёт!» — пример для ознакомления" />
            </p>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <p className="text-gray-700">
                <T text="Честно оцени свой день сам(а) по шкале 0–10. Это твой личный инструмент роста — не проверка и не условие оплаты. Смотришь на три вещи:" />{" "}
                <strong>
                  <T text="участие · задания · пример в отношениях." />
                </strong>
              </p>
              <p className="text-gray-700">
                <T text="Имя:" /> <Blank width="w-56" />
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="border border-blue-800 px-3 py-2 text-left">
                        <T text="Событие" />
                      </th>
                      <th className="border border-blue-800 px-3 py-2 text-left">
                        <T text="Дата" />
                      </th>
                      <th className="border border-blue-800 px-3 py-2">
                        <T text="Участие" />
                      </th>
                      <th className="border border-blue-800 px-3 py-2">
                        <T text="Задания" />
                      </th>
                      <th className="border border-blue-800 px-3 py-2">
                        <T text="Отношения" />
                      </th>
                      <th className="border border-blue-800 px-3 py-2">
                        <T text="Оценка дня" />
                      </th>
                      <th className="border border-blue-800 px-3 py-2 text-left">
                        <T text="Что получилось / над чем поработать" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessmentRows.map((row, i) => (
                      <tr key={row} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="border border-gray-200 px-3 py-2 font-medium">{row}</td>
                        <td className="border border-gray-200 px-3 py-2" />
                        <td className="border border-gray-200 px-3 py-2" />
                        <td className="border border-gray-200 px-3 py-2" />
                        <td className="border border-gray-200 px-3 py-2" />
                        <td className="border border-gray-200 px-3 py-2" />
                        <td className="border border-gray-200 px-3 py-2" />
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={4} className="border-0" />
                      <td className="border border-gray-300 px-3 py-2 font-semibold text-right bg-blue-50">
                        <T text="Моя средняя:" />
                      </td>
                      <td className="border border-gray-300 px-3 py-2 bg-blue-50" />
                      <td className="border-0" />
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500">
                <T text="П1–П4 — планёрки до лагеря, Д1–Д7 — дни лагеря." />
              </p>

              {/* Scale */}
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <T text="Шкала (0–10): как честно оценить себя" />
                </h3>
                <div className="space-y-2">
                  {scaleRows.map((s) => (
                    <div key={s.score} className={`flex items-start gap-3 rounded-lg px-4 py-2 ${s.color}`}>
                      <span className="font-bold w-12 shrink-0">{s.score}</span>
                      <span>
                        <T text={s.text} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Three questions */}
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-3">
                  <T text="Три вопроса к себе за день" />
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>
                      <T text="Участие" />
                    </strong>{" "}
                    <T text="— был(а) ли я включён(а), не отсиживался(ась) в стороне?" />
                  </li>
                  <li>
                    <strong>
                      <T text="Задания" />
                    </strong>{" "}
                    <T text="— сделал(а) ли то, что взял(а) на себя?" />
                  </li>
                  <li>
                    <strong>
                      <T text="Отношения" />
                    </strong>{" "}
                    <T text="— был(а) ли примером в словах и отношении к другим?" />
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-900 text-sm">
                <T text="Это лист для тебя. Его никто не проверяет, и с оплатой он не связан. Экипаж держит планку 7+ — это наш ориентир." />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
