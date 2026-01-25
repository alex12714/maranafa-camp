"use client"

import { createContext, useState, useEffect, useContext, type ReactNode } from "react"

// Define available languages
export type Language = "en" | "ru" | "lv" | "uk"

// Define language names for display
export const languageNames = {
  en: "English",
  ru: "Русский",
  lv: "Latviešu",
  uk: "Українська",
}

// Define language context type
type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  translations: Record<string, string>
  showLanguageModal: boolean
  setShowLanguageModal: (show: boolean) => void
}

// Create the context with default values
const defaultContext: LanguageContextType = {
  language: "ru",
  setLanguage: () => {},
  translations: {},
  showLanguageModal: false,
  setShowLanguageModal: () => {},
}

// Create the context
const LanguageContext = createContext<LanguageContextType>(defaultContext)

// Translations for each language
export const translationData: Record<Language, Record<string, string>> = {
  en: {
    // All English translations here
    Маранафа: "Maranafa",
    "Детский Христианский Тематический Лагерь": "Children's Christian Themed Camp",
    Регистрироваться: "Register",
    "Узнать больше": "Learn More",
    "Что такое Маранафа?": "What is Maranafa?",
    "Что будет в лагере?": "What will be in the camp?",
    "Очень вкусная еда": "Delicious Food",
    Природа: "Nature",
    Программа: "Program",
    "УЗНАТЬ БОЛЬШЕ": "LEARN MORE",
    "Предстоящие события – регистрируйтесь сейчас!": "Upcoming Events - Register Now!",
    "Маранафа - летний лагерь": "Maranafa - Summer Camp",
    "Прошедшие события": "Past Events",
    "Отзывы родителей": "Parent Reviews",
    "Хотите такое своим детям? 🥳": "Want this for your children? 🥳",
    "Смотреть все отзывы": "View All Reviews",
    "Скрыть отзывы": "Hide Reviews",
    Отзывы: "Testimonials",
    "Присоединяйтесь до 1 июня, чтобы получить скидку в 50 евро": "Join before June 1 to get a €50 discount",
    "После 1го июня, скидка больше не будет доступна": "After June 1, the discount will no longer be available",
    "Поехали в лагерь": "Let's go to camp",
    Сотрудникам: "For Staff",
    Родителям: "For Parents",
    Расписание: "Schedule",
    "Видео архив": "Video Archive",
    "Гимн лагеря": "Camp Anthem",
    "Информация о лагере 2025": "Camp 2025 Information",
    "Хотим рассказать вам, что будет происходить в лагере в 2025 году и почему мы выбрали именно такой формат.":
      "We want to tell you what will happen at camp in 2025 and why we chose this particular format.",
    "Почему Minecraft-стиль?": "Why Minecraft style?",
    "Мы знаем, что компьютерные игры сильно влияют на подростков - и это может быть как плохо, так и хорошо. Поэтому мы решили взять знакомые вам визуальные элементы и использовать их для чего-то действительно важного - для изучения Библии и развития характера.":
      "We know that computer games strongly influence teenagers - and this can be both bad and good. Therefore, we decided to take familiar visual elements and use them for something really important - for studying the Bible and character development.",
    "Что будет в лагере:": "What will be at camp:",
    "Квадратные декорации (как в Minecraft, но вживую)": "Square decorations (like in Minecraft, but live)",
    "Интересные костюмы и реквизит": "Interesting costumes and props",
    "Игры и активности в этом стиле": "Games and activities in this style",
    "Главная тема: История царицы Есфирь": "Main theme: The story of Queen Esther",
    "Есфирь - это девушка, которая оказалась в очень сложной ситуации и должна была принять трудное решение. Ее история поможет нам разобрать:":
      "Esther is a girl who found herself in a very difficult situation and had to make a difficult decision. Her story will help us understand:",
    "Как быть смелым, когда страшно": "How to be brave when scared",
    "Как поступать правильно, даже если это сложно": "How to do the right thing, even when it's difficult",
    "Как понимать, для чего Бог поставил тебя в определенное место и время":
      "How to understand why God placed you in a certain place and time",
    "Зачем это нужно:": "Why this is needed:",
    "В школе и жизни вы постоянно сталкиваетесь с выбором - списывать или нет, заступиться за одноклассника или промолчать, быть честным или соврать. История Есфирь покажет, как принимать правильные решения.":
      "At school and in life, you constantly face choices - to cheat or not, to stand up for a classmate or stay silent, to be honest or lie. Esther's story will show how to make the right decisions.",
    "Как это работает:": "How it works:",
    "Minecraft-оформление делает изучение Библии интересным и понятным, а не скучным. Мы используем то, что вам знакомо, чтобы рассказать о вечных истинах.":
      "Minecraft design makes Bible study interesting and understandable, not boring. We use what is familiar to you to tell about eternal truths.",
    "Увидимся в лагере!": "See you at camp!",
    "Ссылка на детский урочник:": "Link to children's curriculum:",
    "Ссылка на детальное расписание смены": "Link to detailed camp schedule",
    "Ссылка на прорамму координатора": "Link to coordinator program",
    "Полезные ссылки:": "Useful links:",
    "Информация родителям": "Information for Parents",
    "Всё, что вам нужно знать о лагере Маранафа": "Everything you need to know about Maranafa Camp",
    "О нас": "About Us",
    "Спасибо за регистрацию!": "Thank you for registering!",
    "Мы скоро свяжемся с вами": "We will be in touch soon",
    "Информация для родителей": "Information for Parents",
  },
  ru: {
    // All Russian translations (same as keys)
    Маранафа: "Маранафа",
    "Детский Христианский Тематический Лагерь": "Детский Христианский Тематический Лагерь",
    Регистрироваться: "Регистрироваться",
    "Узнать больше": "Узнать больше",
    "Что такое Маранафа?": "Что такое Маранафа?",
    "Что будет в лагере?": "Что будет в лагере?",
    "Очень вкусная еда": "Очень вкусная еда",
    Природа: "Природа",
    Программа: "Программа",
    "УЗНАТЬ БОЛЬШЕ": "УЗНАТЬ БОЛЬШЕ",
    "Предстоящие события – регистрируйтесь сейчас!": "Предстоящие события – регистрируйтесь сейчас!",
    "Маранафа - летний лагерь": "Маранафа - летний лагерь",
    "Прошедшие события": "Прошедшие события",
    "Отзывы родителей": "Отзывы родителей",
    "Хотите такое своим детям? 🥳": "Хотите такое своим детям? 🥳",
    "Смотреть все отзывы": "Смотреть все отзывы",
    "Скрыть отзывы": "Скрыть отзывы",
    Отзывы: "Отзывы",
    "Присоединяйтесь до 1 июня, чтобы получить скидку в 50 евро":
      "Присоединяйтесь до 1 июня, чтобы получить скидку в 50 евро",
    "После 1го июня, скидка больше не будет доступна": "После 1го июня, скидка больше не будет доступна",
    "Поехали в лагерь": "Поехали в лагерь",
    Сотрудникам: "Сотрудникам",
    Родителям: "Родителям",
    Расписание: "Расписание",
    "Видео архив": "Видео архив",
    "Гимн лагеря": "Гимн лагеря",
    "Информация о лагере 2025": "Информация о лагере 2025",
    "Хотим рассказать вам, что будет происходить в лагере в 2025 году и почему мы выбрали именно такой формат.":
      "Хотим рассказать вам, что будет происходить в лагере в 2025 году и почему мы выбрали именно такой формат.",
    "Почему Minecraft-стиль?": "Почему Minecraft-стиль?",
    "Мы знаем, что компьютерные игры сильно влияют на подростков - и это может быть как плохо, так и хорошо. Поэтому мы решили взять знакомые вам визуальные элементы и использовать их для чего-то действительно важного - для изучения Библии и развития характера.":
      "Мы знаем, что компьютерные игры сильно влияют на подростков - и это может быть как плохо, так и хорошо. Поэтому мы решили взять знакомые вам визуальные элементы и использовать их для чего-то действительно важного - для изучения Библии и развития характера.",
    "Что будет в лагере:": "Что будет в лагере:",
    "Квадратные декорации (как в Minecraft, но вживую)": "Квадратные декорации (как в Minecraft, но вживую)",
    "Интересные костюмы и реквизит": "Интересные костюмы и реквизит",
    "Игры и активности в этом стиле": "Игры и активности в этом стиле",
    "Главная тема: История царицы Есфирь": "Главная тема: История царицы Есфирь",
    "Есфирь - это девушка, которая оказалась в очень сложной ситуаци�� и должна была принять трудное решение. Ее история поможет нам разобрать:":
      "Есфирь - это девушка, которая оказалась в очень сложной ситуации и должна была принять трудное решение. Ее история поможет нам разобрать:",
    "Как быть смелым, когда страшно": "Как быть смелым, когда страшно",
    "Как поступать правильно, даже если это сложно": "Как быть смелым, когда страшно",
    "Как понимать, для чего Бог поставил тебя в определенное место и время":
      "Как понимать, для чего Бог поставил тебя в определенное место и время",
    "Зачем это нужно:": "Зачем это нужно:",
    "В школе и жизни вы постоянно сталкиваетесь с выбором - списывать или нет, заступиться за одноклассника или промолчать, быть честным или соврать. История Есфирь покажет, как принимать правильные решения.":
      "В школе и жизни вы постоянно сталкиваетесь с выбором - списывать или нет, заступиться за одноклассника или промолчать, быть честным или соврать. История Есфирь покажет, как принимать правильные решения.",
    "Как это работает:": "Как это работает:",
    "Minecraft-оформление делает изучение Библии интересным и понятным, а не скучным. Мы используем то, что вам знакомо, чтобы рассказать о вечных истинах.":
      "Minecraft-оформление делает изучение Библии интересным и понятным, а не скучным. Мы используем то, что вам знакомо, чтобы рассказать о вечных истинах.",
    "Увидимся в лагере!": "Увидимся в лагере!",
    "Ссылка на детский урочник:": "Ссылка на детский урочник:",
    "Ссылка на детальное расписание смены": "Ссылка на детальное расписание смены",
    "Ссылка на прорамму координатора": "Ссылка на прорамму координатора",
    "Полезные ссылки:": "Полезные ссылки:",
    "Информация родителям": "Информация родителям",
    "Всё, что вам нужно знать о лагере Маранафа": "Всё, что вам нужно знать о лагере Маранафа",
    "О нас": "О нас",
    "Спасибо за регистрацию!": "Спасибо за регистрацию!",
    "Мы скоро свяжемся с вами": "Мы скоро свяжемся с вами",
    "Информация для родителей": "Информация для родителей",
  },
  lv: {
    // Latvian translations
    Маранафа: "Maranafa",
    "Детский Христианский Тематический Лагерь": "Bērnu kristīgā tematiskā nometne",
    Регистрироваться: "Reģistrēties",
    "Узнать больше": "Uzzināt vairāk",
    "Что такое Маранафа?": "Kas ir Maranafa?",
    "Что будет в лагере?": "Kas būs nometnē?",
    "Очень вкусная еда": "Ļoti garšīgs ēdiens",
    Природа: "Daba",
    Программа: "Programma",
    "УЗНАТЬ БОЛЬШЕ": "UZZINĀT VAIRĀK",
    "Предстоящие события – регистрируйтесь сейчас!": "Gaidāmie pasākumi - reģistrējieties tagad!",
    "Маранафа - летний лагерь": "Maranafa - vasaras nometne",
    "Прошедшие события": "Pagātnes pasākumi",
    "Отзывы родителей": "Vecāku atsauksmes",
    "Хотите такое своим детям? 🥳": "Vai vēlaties to saviem bērniem? 🥳",
    "Смотреть все отзывы": "Skatīt visas atsauksmes",
    "Скрыть отзывы": "Paslēpt atsauksmes",
    Отзывы: "Atsauksmes",
    "Присоединяйтесь до 1 июня, чтобы получить скидку в 50 евро":
      "Pievienojieties līdz 1. jūnijam, lai saņemtu 50 eiro atlaidi",
    "После 1го июня, скидка больше не будет доступна": "Pēc 1. jūnija atlaide vairs nebūs pieejama",
    "Поехали в лагерь": "Dodamies uz nometni",
    Сотрудникам: "Darbiniekiem",
    Родителям: "Vecākiem",
    Расписание: "Grafiks",
    "Видео архив": "Video arhīvs",
    "Гимн лагеря": "Nometnes himna",
    "Информация о лагере 2025": "Informācija par nometni 2025",
    "Хотим рассказать вам, что будет происходить в лагере в 2025 году и почему мы выбрали именно такой формат.":
      "Mēs vēlamies pastāstīt jums, kas notiks nometnē 2025. gadā un kāpēc mēs izvēlējāmies tieši šādu formātu.",
    "Почему Minecraft-стиль?": "Kāpēc Minecraft stils?",
    "Мы знаем, что компьютерные игры сильно влияют на подростков - и это может быть как плохо, так и хорошо. Поэтому мы решили взять знакомые вам визуальные элементы и использовать их для чего-то действительно важного - для изучения Библии и развития характера.":
      "Mēs zinām, ka datorspēles stipri ietekmē pusaudžus - un tas var būt gan slikti, gan labi. Tāpēc mēs nolēmām ņemt jums pazīstamus vizuālos elementus un izmantot tos kaut kam patiesi svarīgam - Bībeles studijām un rakstura attīstībai.",
    "Что будет в лагере:": "Kas būs nometnē:",
    "Квадратные декорации (как в Minecraft, но вживую)": "Kvadrātas dekorācijas (kā Minecraft, bet dzīvē)",
    "Интересные костюмы и реквизит": "Interesanti kostīmi un rekvizīti",
    "Игры и активности в этом стиле": "Spēles un aktivitātes šajā stilā",
    "Главная тема: История царицы Есфирь": "Galvenā tēma: Karaliene Esteres stāsts",
    "Есфирь - это девушка, которая оказалась в очень сложной ситуации и должна была принять трудное решение. Ее история поможет нам разобрать:":
      "Estere ir meitene, kas nonāca ļoti sarežģītā situācijā un viņai bija jāpieņem grūts lēmums. Viņas stāsts palīdzēs mums saprast:",
    "Как быть смелым, когда страшно": "Kā būt drosmīgam, kad ir bail",
    "Как поступать правильно, даже если это сложно": "Kā rīkoties pareizi, pat ja tas ir grūti",
    "Как понимать, для чего Бог поставил тебя в определенное место и время":
      "Kā saprast, kāpēc Dievs tevi ielika noteiktā vietā un laikā",
    "Зачем это нужно:": "Kāpēc tas ir vajadzīgs:",
    "В школе и жизни вы постоянно сталкиваетесь с выбором - списывать или не, aizstāvēt klasesbiedru vai klusēt, būt godīgam vai melot. Esteres stāsts parādīs, kā pieņemt pareizos lēmumus.":
      "Skolā un dzīvē jūs pastāvīgi saskaraties ar izvēli - norakstīt vai ne, aizstāvēt klasesbiedru vai klusēt, būt godīgam vai melot. Esteres stāsts parādīs, kā pieņemt pareizos lēmumus.",
    "Как это работает:": "Kā tas darbojas:",
    "Minecraft-оформление делает изучение Библии интересным и понятным, а не скучным. Мы используем то, что вам знакомо, чтобы рассказать о вечных истинах.":
      "Minecraft noformējums padara Bībeles studijas interesantas un saprotamas, nevis garlaicīgas. Mēs izmantojam to, kas jums ir pazīstams, lai pastāstītu par mūžīgām patiesībām.",
    "Увидимся в лагере!": "Tiksimies nometnē!",
    "Ссылка на детский урочник:": "Saite uz bērnu mācību grāmatu:",
    "Ссылка на детальное расписание смены": "Saite uz detalizētu nometnes grafiku",
    "Ссылка на прорамму координатора": "Saite uz koordinatora programmu",
    "Полезные ссылки:": "Noderīgas saites:",
    "Информация родителям": "Informācija vecākiem",
    "Всё, что вам нужно знать о лагере Маранафа": "Viss, kas jums jāzina par Maranafa nometni",
    "О нас": "Par mums",
    "Спасибо за регистрацию!": "Paldies par reģistrāciju!",
    "Мы скоро свяжемся с вами": "Mēs drīzumā ar jums sazināsimies",
    "Информация для родителей": "Informācija vecākiem",
  },
  uk: {
    // Ukrainian translations
    Маранафа: "Маранафа",
    "Детский Христианский Тематический Лагерь": "Дитячий християнський тематичний табір",
    Регистрироваться: "Зареєструватися",
    "Узнать больше": "Дізнатися більше",
    "Что такое Маранафа?": "Що таке Маранафа?",
    "Что будет в лагере?": "Що буде в таборі?",
    "Очень вкусная еда": "Дуже смачна їжа",
    Природа: "Природа",
    Программа: "Програма",
    "УЗНАТЬ БОЛЬШЕ": "ДІЗНАТИСЯ БІЛЬШЕ",
    "Предстоящие события – регистрируйтесь сейчас!": "Майбутні події — реєструйтеся зараз!",
    "Маранафа - летний лагерь": "Маранафа - літній табір",
    "Прошедшие события": "Минулі події",
    "Отзывы родителей": "Відгуки батьків",
    "Хотите такое своим детям? 🥳": "Хочете таке своїм дітям? 🥳",
    "Смотреть все отзывы": "Переглянути всі відгуки",
    "Скрыть отзывы": "Приховати відгуки",
    Отзывы: "Відгуки",
    "Присоединяйтесь до 1 июня, чтобы получить скидку у 50 євро":
      "Приєднуйтесь до 1 червня, щоб отримати знижку у 50 євро",
    "После 1го июня, скидка больше не будет доступна": "Після 1 червня знижка більше не буде доступна",
    "Поехали в лагерь": "Поїхали в табір",
    Сотрудникам: "Співробітникам",
    Родителям: "Батькам",
    Расписание: "Розклад",
    "Видео архив": "Відео архів",
    "Гимн лагеря": "Гімн табору",
    "Информация о лагере 2025": "Інформація про табір 2025",
    "Хотим рассказать вам, что будет происходить в лагере в 2025 году и почему мы выбрали именно такой формат.":
      "Хочемо розповісти вам, що відбуватиметься в таборі у 2025 році і чому ми обрали саме такий формат.",
    "Почему Minecraft-стиль?": "Чому стиль Minecraft?",
    "Мы знаем, что компьютерные игры сильно влияют на подростков - и это может быть как плохо, так и хорошо. Поэтому мы решили взять знакомые вам визуальные элементы и использовать их для чего-то действительно важного - для изучения Библии и развития характера.":
      "Ми знаємо, що комп'ютерні ігри сильно впливають на підлітків - і це може бути як погано, так і добре. Тому ми вирішили взяти знайомі вам візуальні елементи і використати їх для чогось справді важливого - для вивчення Біблії та розвитку характеру.",
    "Что будет в лагере:": "Що буде в таборі:",
    "Квадратные декорации (как в Minecraft, но вживую)": "Квадратні декорації (як у Minecraft, але наживо)",
    "Интересные костюмы и реквизит": "Цікаві костюми та реквізит",
    "Игры и активности в этом стиле": "Ігри та активності в цьому стилі",
    "Главная тема: История царицы Есфирь": "Головна тема: Історія цариці Естер",
    "Есфирь - это девушка, которая оказалась в очень сложной ситуации и должна была принять трудное решение. Ее история поможет нам разобрать:":
      "Естер - це дівчина, яка опинилася в дуже складній ситуації і мала прийняти важке рішення. Її історія допоможе нам розібрати:",
    "Как быть смелым, когда страшно": "Як бути сміливим, коли страшно",
    "Как поступать правильно, даже если это сложно": "Як вчиняти правильно, навіть якщо це складно",
    "Как понимать, для чего Бог поставил тебя в определенное место и время":
      "Як розуміти, для чого Бог поставив тебе в певне місце і час",
    "Зачем это нужно:": "Навіщо це потрібно:",
    "В школе и жизни вы постоянно сталкиваетесь с выбором - списывать или нет, заступиться за одноклассника или промолчать, быть честным или сбрехать. История Есфирь покажет, как принимать правильные решения.":
      "У школі та житті ви постійно стикаєтеся з вибором - списувати чи ні, заступитися за однокласника чи промовчати, бути чесним чи збрехати. Історія Естер покаже, як приймати правильні рішення.",
    "Как это работает:": "Як це працює:",
    "Minecraft-оформление делает изучение Библии интересным и понятным, а не скучным. Мы используем то, что вам знакомо, чтобы рассказать о вечных истинах.":
      "Оформлення в стилі Minecraft робить вивчення Біблії цікавим і зрозумілим, а не нудним. Ми використовуємо те, що вам знайоме, щоб розповісти про вічні істини.",
    "Увидимся в лагере!": "Побачимося в таборі!",
    "Ссылка на детский урочник:": "Посилання на дитячий підручник:",
    "Ссылка на детальное расписание смены": "Посилання на детальний розклад зміни",
    "Ссылка на прорамму координатора": "Посилання на програму координатора",
    "Полезные ссылки:": "Корисні посилання:",
    "Информация родителям": "Інформація для батьків",
    "Всё, что вам нужно знать о лагере Маранафа": "Все, що вам потрібно знати про табір Маранафа",
    "О нас": "Про нас",
    "Спасибо за регистрацию!": "Дякуємо за реєстрацію!",
    "Мы скоро свяжемся с вами": "Ми незабаром зв'яжемося з вами",
    "Информация для родителей": "Інформація для батьків",
  },
}

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with default language
  const [language, setLanguageState] = useState<Language>("ru")
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Set language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLanguage", lang)
    }
  }

  // Initialize on client-side only
  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem("preferredLanguage") as Language | null

    if (savedLanguage && Object.keys(translationData).includes(savedLanguage)) {
      setLanguageState(savedLanguage)
      setShowLanguageModal(false)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0]
      const mappedLang = {
        en: "en",
        ru: "ru",
        lv: "lv",
        uk: "uk",
      }[browserLang] as Language

      if (mappedLang) {
        setLanguageState(mappedLang)
      }

      // Still show the modal on first visit
      setShowLanguageModal(true)
    }
  }, [])

  // Get translations for the current language with fallback
  const translations = isClient ? translationData[language] || translationData.ru : translationData.ru

  const value: LanguageContextType = {
    language,
    setLanguage,
    translations,
    showLanguageModal,
    setShowLanguageModal,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// Hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    // Return default context if used outside provider
    return defaultContext
  }
  return context
}
