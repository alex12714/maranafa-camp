// Homepage events. Past/upcoming split happens client-side by date.
export type EventItem = {
  id: string
  title: string
  subtitle: string
  date: string
  eventDate: string
  endDate?: string
  details?: string
  image: string
  alt: string
  registrationUrl?: string
  detailsPage?: string | null
}

export const events: EventItem[] = [
  {
    id: "imantas-svetki",
    title: "Праздник открытия Общественного центра Иманты",
    subtitle: "Бесплатный семейный праздник",
    date: "19 июля 2026",
    eventDate: "2026-07-19",
    endDate: "2026-07-19",
    details: "Воскресенье, 16:00 – 18:00 · Kurzemes prospekts 15",
    image: "/images/events/imantas-svetki.webp",
    alt: "Праздник открытия Общественного центра Иманты",
    detailsPage: "/imantas-svetki-2026",
  },
  {
    id: "friends",
    title: "Friends – Репортёры истории",
    subtitle: "Маранафа Friends",
    date: "3 – 5 апреля 2026",
    eventDate: "2026-04-03",
    endDate: "2026-04-05",
    image: "/images/events/friends.webp",
    alt: "Maranafa Friends",
    registrationUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfwnCiib7B3msRUVy_jIlBwa8f9VHzOjPwzgJAdilb_c478Pg/viewform?usp=publish-editor",
    detailsPage: null,
  },
  {
    id: "dawn-treader",
    title: "Маранафа Youth – Dawn Treader",
    subtitle: "Путешествие на Яхте",
    date: "21 июня 2026",
    eventDate: "2026-06-21",
    endDate: "2026-06-21",
    details: "Старт в 15:00 на Базницас 12а. Финиш в 18:30 в центре Риги",
    image: "/images/events/dawn-treader-2026.png",
    alt: "Maranatha Youth – Dawn Treader",
    registrationUrl: "/dawn-treader",
    detailsPage: "/dawn-treader",
  },
  {
    id: "camp",
    title: "Лагерь \"Небо Зовёт\"",
    subtitle: "Детский летний лагерь",
    date: "3 – 9 августа 2026",
    eventDate: "2026-08-03",
    endDate: "2026-08-09",
    details: "Заезд в понедельник, автобус от Базницас 12а. Разъезд 9 августа, 16:00–18:00",
    image: "/images/events/nebo-zovet.webp",
    alt: "Лагерь Небо Зовёт",
    registrationUrl: "/camp/register",
    detailsPage: "/camp",
  },
  {
    id: "conference",
    title: "Молодёжная конференция \"Грани Будущего\"",
    subtitle: "Христианская молодёжная конференция",
    date: "11 – 14 августа 2026",
    eventDate: "2026-08-11",
    endDate: "2026-08-14",
    image: "/images/events/grani-budushego.webp",
    alt: "Конференция Грани Будущего",
    registrationUrl: "/conference#register",
    detailsPage: "/conference",
  },
  {
    id: "friends-nov",
    title: "Маранафа Friends – Осенняя встреча",
    subtitle: "Маранафа Friends",
    date: "13 – 15 ноября 2026",
    eventDate: "2026-11-13",
    endDate: "2026-11-15",
    details: "Три дня вместе · место уточняется",
    image: "/images/events/friends-nov-2026.svg",
    alt: "Маранафа Friends — осенняя встреча",
    registrationUrl: "/maranafa-friends-nov-2026#register",
    detailsPage: "/maranafa-friends-nov-2026",
  },
  {
    id: "narnia-2027",
    title: "Лагерь \"Возвращение Нарнии\"",
    subtitle: "Детский летний лагерь",
    date: "28 июня – 4 июля 2027",
    eventDate: "2027-06-28",
    endDate: "2027-07-04",
    details: "Лошади, костюмы, фаер-шоу, фейерверк и церемония коронации",
    image: "/images/events/narnia-2027.svg",
    alt: "Лагерь Возвращение Нарнии 2027",
    registrationUrl: "/narnia-2027#register",
    detailsPage: "/narnia-2027",
  },
  {
    id: "maijas-grafs",
    title: "Летний праздник Maijas Grafs",
    subtitle: "Семейный праздник в Ziedoņdārzs",
    date: "22 мая 2027",
    eventDate: "2027-05-22",
    endDate: "2027-05-22",
    details: "Ziedoņdārzs, Рига · 11:00 – 21:00 · Вход свободный",
    image: "/images/events/maijas-grafs.jpg",
    alt: "Летний праздник Maijas Grafs",
    detailsPage: "/maijas-grafs",
  },
]
