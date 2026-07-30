// Legal content for the Maranafa app & website (Privacy Policy + Terms of Service).
// Rendered by app/privacy/page.tsx and app/terms/page.tsx via the LegalPage component.
//
// Data controller (verified from the organization requisites):
//   Nodibinājums «Maranafa», reg. No. 40008359764
//   Kurzemes prospekts 15, Rīga, Latvia
//   Contact: welcome@maranafa.camp
//
// The Latvian (lv) text is fit-for-purpose but should get a native review.

import type { Language } from "@/contexts/language-context"

export const CONTROLLER_NAME = "Nodibinājums «Maranafa»"
export const CONTROLLER_REG = "40008359764"
export const CONTROLLER_ADDRESS = "Kurzemes prospekts 15, Rīga, Latvia"
export const CONTACT_EMAIL = "welcome@maranafa.camp"
export const EFFECTIVE_DATE_ISO = "2026-06-29"

export type LegalSection = { heading: string; body: string[] }
export type LegalDoc = {
  title: string
  updatedLabel: string // e.g. "Last updated"
  intro: string[]
  sections: LegalSection[]
}

const ED = EFFECTIVE_DATE_ISO

// ---------------------------------------------------------------------------
// PRIVACY POLICY
// ---------------------------------------------------------------------------
export const privacyContent: Record<Language, LegalDoc> = {
  en: {
    title: "Privacy Policy",
    updatedLabel: "Last updated",
    intro: [
      `This Privacy Policy explains how ${CONTROLLER_NAME} (registration No. ${CONTROLLER_REG}, ${CONTROLLER_ADDRESS}) ("Maranafa", "we", "us") collects and processes personal data in the Maranafa camp application and related services. We are the data controller. For any privacy question contact us at ${CONTACT_EMAIL}.`,
    ],
    sections: [
      {
        heading: "1. Who the app is for",
        body: [
          "The Maranafa app is an internal tool for our summer camp. It is used by camp staff, participants and parents who have been registered for a camp or event. Access requires an account that we provision.",
        ],
      },
      {
        heading: "2. Data we process",
        body: [
          "Account & identity: phone number (used to sign in), first and last name, language preference, and the role(s) assigned to you (e.g. staff, participant, parent).",
          "Camp organisation data: group/team and cabin assignment, schedule, tasks, masterclass sign-ups, and similar operational records relevant to your participation.",
          "Staff financial data: for users with finance roles, budget entries, expenses and receipt photographs that you capture or upload.",
          "Images: photographs you take or select (for example receipt images) are uploaded to our servers.",
          "Technical data: an authentication token stored securely on your device, and basic request logs needed to operate and secure the service.",
          "We do not use third-party advertising or analytics SDKs, and we do not track you across other apps or websites.",
        ],
      },
      {
        heading: "3. Why we process it and legal basis",
        body: [
          "Performance of our arrangement with you and the legitimate interests of running a camp safely and efficiently (GDPR Art. 6(1)(b) and (f)): to authenticate you, organise groups, schedules, tasks and catering, and to manage camp finances.",
          "Consent (Art. 6(1)(a)) where it applies, for example when a parent registers a child. Where a participant is a minor, the relevant data is provided and consented to by a parent or guardian during registration.",
        ],
      },
      {
        heading: "4. Where data is stored",
        body: [
          "Personal data is stored in our self-hosted PostgreSQL database on servers located in the European Union. Uploaded images are stored on the same infrastructure. Authentication tokens are kept in your device's secure storage.",
        ],
      },
      {
        heading: "5. Sharing",
        body: [
          "We do not sell personal data. We share it only with service providers that help us operate (hosting infrastructure provider), and, where you use paid services through our platforms, with regulated payment processors (Paysera, Stripe) strictly to process those payments.",
        ],
      },
      {
        heading: "6. Retention and deletion",
        body: [
          "We keep personal data only as long as needed for camp administration and to meet legal (including accounting) obligations.",
          `You can request deletion of your account at any time from within the app (Settings → Delete account) or by emailing ${CONTACT_EMAIL}. On such a request we deactivate the account and remove or anonymise your personal identifiers; records that we must keep for legal/accounting reasons are retained only for the period required by law and then deleted.`,
        ],
      },
      {
        heading: "7. Your rights",
        body: [
          "Under the GDPR you have the right to access, rectify, erase, restrict or object to processing, and to data portability. You may withdraw consent at any time without affecting prior processing.",
          `To exercise any right, contact ${CONTACT_EMAIL}. You also have the right to lodge a complaint with the Latvian supervisory authority, Datu valsts inspekcija (www.dvi.gov.lv).`,
        ],
      },
      {
        heading: "8. Security",
        body: [
          "Data is transmitted over encrypted HTTPS connections and protected with access controls and role-based authorisation. No method of transmission or storage is completely secure, but we take reasonable measures to protect your data.",
        ],
      },
      {
        heading: "9. Children",
        body: [
          "The camp serves minors. Data about a child is provided by a parent or legal guardian, who exercises the child's rights on their behalf. Contact us if you believe a child's data has been provided without proper authorisation.",
        ],
      },
      {
        heading: "10. Changes",
        body: [
          `We may update this policy. The current version and its date are always available here. Material changes will be communicated through the app or by email. Effective date: ${ED}.`,
        ],
      },
    ],
  },

  ru: {
    title: "Политика конфиденциальности",
    updatedLabel: "Последнее обновление",
    intro: [
      `Настоящая Политика конфиденциальности объясняет, как ${CONTROLLER_NAME} (рег. № ${CONTROLLER_REG}, ${CONTROLLER_ADDRESS}) («Маранафа», «мы») собирает и обрабатывает персональные данные в приложении лагеря Маранафа и связанных сервисах. Мы являемся контролёром данных. По вопросам конфиденциальности пишите на ${CONTACT_EMAIL}.`,
    ],
    sections: [
      {
        heading: "1. Для кого приложение",
        body: [
          "Приложение Маранафа — внутренний инструмент нашего летнего лагеря. Им пользуются сотрудники, участники и родители, зарегистрированные на лагерь или событие. Для доступа нужна учётная запись, которую создаём мы.",
        ],
      },
      {
        heading: "2. Какие данные мы обрабатываем",
        body: [
          "Учётная запись и личность: номер телефона (для входа), имя и фамилия, предпочитаемый язык и назначенные вам роли (например, сотрудник, участник, родитель).",
          "Организационные данные лагеря: группа/команда и поселение (домик), расписание, задачи, записи на мастер-классы и подобные рабочие записи, связанные с вашим участием.",
          "Финансовые данные сотрудников: для пользователей с финансовыми ролями — записи бюджета, расходы и фотографии чеков, которые вы делаете или загружаете.",
          "Изображения: сделанные или выбранные вами фотографии (например, изображения чеков) загружаются на наши серверы.",
          "Технические данные: токен аутентификации, надёжно хранящийся на вашем устройстве, и базовые журналы запросов, необходимые для работы и защиты сервиса.",
          "Мы не используем сторонние рекламные или аналитические SDK и не отслеживаем вас в других приложениях и на сайтах.",
        ],
      },
      {
        heading: "3. Цели обработки и правовое основание",
        body: [
          "Исполнение договорённостей с вами и законные интересы безопасной и эффективной организации лагеря (ст. 6(1)(b) и (f) GDPR): аутентификация, формирование групп, расписаний, задач и питания, управление финансами лагеря.",
          "Согласие (ст. 6(1)(a)), где это применимо, например при регистрации ребёнка родителем. Если участник несовершеннолетний, соответствующие данные предоставляются и согласовываются родителем или опекуном при регистрации.",
        ],
      },
      {
        heading: "4. Где хранятся данные",
        body: [
          "Персональные данные хранятся в нашей собственной базе данных PostgreSQL на серверах в Европейском союзе. Загруженные изображения хранятся на той же инфраструктуре. Токены аутентификации хранятся в защищённом хранилище вашего устройства.",
        ],
      },
      {
        heading: "5. Передача данных",
        body: [
          "Мы не продаём персональные данные. Мы передаём их только поставщикам услуг, помогающим нам работать (поставщик хостинга), и — при использовании платных услуг через наши платформы — регулируемым платёжным провайдерам (Paysera, Stripe) исключительно для обработки этих платежей.",
        ],
      },
      {
        heading: "6. Хранение и удаление",
        body: [
          "Мы храним персональные данные только столько, сколько необходимо для администрирования лагеря и выполнения юридических (в т.ч. бухгалтерских) обязательств.",
          `Вы можете в любой момент запросить удаление учётной записи прямо в приложении (Настройки → Удалить аккаунт) или письмом на ${CONTACT_EMAIL}. По такому запросу мы деактивируем учётную запись и удаляем или обезличиваем ваши идентификаторы; записи, которые мы обязаны хранить по закону, сохраняются только на требуемый законом срок и затем удаляются.`,
        ],
      },
      {
        heading: "7. Ваши права",
        body: [
          "Согласно GDPR вы имеете право на доступ, исправление, удаление, ограничение или возражение против обработки, а также на переносимость данных. Вы можете отозвать согласие в любое время без влияния на ранее проведённую обработку.",
          `Для реализации прав пишите на ${CONTACT_EMAIL}. Вы также вправе подать жалобу в надзорный орган Латвии — Datu valsts inspekcija (www.dvi.gov.lv).`,
        ],
      },
      {
        heading: "8. Безопасность",
        body: [
          "Данные передаются по зашифрованным соединениям HTTPS и защищены контролем доступа и ролевой авторизацией. Ни один способ передачи или хранения не является абсолютно безопасным, но мы принимаем разумные меры защиты.",
        ],
      },
      {
        heading: "9. Дети",
        body: [
          "Лагерь работает с несовершеннолетними. Данные о ребёнке предоставляет родитель или законный опекун, который реализует права ребёнка от его имени. Свяжитесь с нами, если считаете, что данные ребёнка были предоставлены без надлежащего разрешения.",
        ],
      },
      {
        heading: "10. Изменения",
        body: [
          `Мы можем обновлять эту политику. Актуальная версия и её дата всегда доступны здесь. О существенных изменениях мы сообщим через приложение или по электронной почте. Дата вступления в силу: ${ED}.`,
        ],
      },
    ],
  },

  lv: {
    title: "Privātuma politika",
    updatedLabel: "Pēdējoreiz atjaunināts",
    intro: [
      `Šī Privātuma politika skaidro, kā ${CONTROLLER_NAME} (reģ. Nr. ${CONTROLLER_REG}, ${CONTROLLER_ADDRESS}) ("Maranafa", "mēs") vāc un apstrādā personas datus Maranafa nometnes lietotnē un saistītajos pakalpojumos. Mēs esam datu pārzinis. Ar jautājumiem par privātumu rakstiet uz ${CONTACT_EMAIL}.`,
    ],
    sections: [
      {
        heading: "1. Kam lietotne paredzēta",
        body: [
          "Maranafa lietotne ir mūsu vasaras nometnes iekšējs rīks. To lieto nometnes darbinieki, dalībnieki un vecāki, kas reģistrēti nometnei vai pasākumam. Piekļuvei nepieciešams konts, ko izveidojam mēs.",
        ],
      },
      {
        heading: "2. Kādus datus mēs apstrādājam",
        body: [
          "Konts un identitāte: tālruņa numurs (pieteikšanās), vārds un uzvārds, valodas izvēle un jums piešķirtās lomas (piemēram, darbinieks, dalībnieks, vecāks).",
          "Nometnes organizācijas dati: grupa/komanda un izmitināšana (māja), grafiks, uzdevumi, pieteikšanās meistarklasēm un līdzīgi ar jūsu dalību saistīti ieraksti.",
          "Darbinieku finanšu dati: lietotājiem ar finanšu lomām — budžeta ieraksti, izdevumi un čeku fotogrāfijas, ko uzņemat vai augšupielādējat.",
          "Attēli: jūsu uzņemtās vai izvēlētās fotogrāfijas (piemēram, čeku attēli) tiek augšupielādētas mūsu serveros.",
          "Tehniskie dati: autentifikācijas marķieris, kas droši glabājas jūsu ierīcē, un pamata pieprasījumu žurnāli, kas nepieciešami pakalpojuma darbībai un drošībai.",
          "Mēs neizmantojam trešo pušu reklāmas vai analītikas SDK un neizsekojam jūs citās lietotnēs vai vietnēs.",
        ],
      },
      {
        heading: "3. Apstrādes mērķi un tiesiskais pamats",
        body: [
          "Vienošanās ar jums izpilde un leģitīmās intereses droši un efektīvi organizēt nometni (VDAR 6.(1)(b) un (f) pants): autentifikācija, grupu, grafiku, uzdevumu un ēdināšanas organizēšana un nometnes finanšu pārvaldība.",
          "Piekrišana (6.(1)(a) pants), kur tā attiecas, piemēram, kad vecāks reģistrē bērnu. Ja dalībnieks ir nepilngadīgs, attiecīgos datus reģistrācijas laikā sniedz un piekrišanu dod vecāks vai aizbildnis.",
        ],
      },
      {
        heading: "4. Kur dati tiek glabāti",
        body: [
          "Personas dati tiek glabāti mūsu pašu uzturētā PostgreSQL datubāzē serveros Eiropas Savienībā. Augšupielādētie attēli tiek glabāti tajā pašā infrastruktūrā. Autentifikācijas marķieri glabājas jūsu ierīces drošajā krātuvē.",
        ],
      },
      {
        heading: "5. Datu nodošana",
        body: [
          "Mēs nepārdodam personas datus. Mēs tos nododam tikai pakalpojumu sniedzējiem, kas palīdz mums darboties (mitināšanas infrastruktūras sniedzējs), un — ja izmantojat maksas pakalpojumus mūsu platformās — regulētiem maksājumu apstrādātājiem (Paysera, Stripe) tikai šo maksājumu apstrādei.",
        ],
      },
      {
        heading: "6. Glabāšana un dzēšana",
        body: [
          "Mēs glabājam personas datus tikai tik ilgi, cik nepieciešams nometnes administrēšanai un juridisko (tostarp grāmatvedības) pienākumu izpildei.",
          `Jūs jebkurā laikā varat pieprasīt sava konta dzēšanu lietotnē (Iestatījumi → Dzēst kontu) vai rakstot uz ${CONTACT_EMAIL}. Pēc šāda pieprasījuma mēs deaktivizējam kontu un dzēšam vai anonimizējam jūsu identifikatorus; ierakstus, kas mums jāglabā juridisku iemeslu dēļ, saglabājam tikai likumā noteiktajā termiņā un pēc tam dzēšam.`,
        ],
      },
      {
        heading: "7. Jūsu tiesības",
        body: [
          "Saskaņā ar VDAR jums ir tiesības piekļūt datiem, tos labot, dzēst, ierobežot vai iebilst pret apstrādi, kā arī uz datu pārnesamību. Jūs jebkurā laikā varat atsaukt piekrišanu, neietekmējot iepriekšējo apstrādi.",
          `Lai īstenotu tiesības, rakstiet uz ${CONTACT_EMAIL}. Jums ir arī tiesības iesniegt sūdzību Latvijas uzraudzības iestādei — Datu valsts inspekcijai (www.dvi.gov.lv).`,
        ],
      },
      {
        heading: "8. Drošība",
        body: [
          "Dati tiek pārsūtīti pa šifrētiem HTTPS savienojumiem un aizsargāti ar piekļuves kontroli un lomu autorizāciju. Neviena pārsūtīšanas vai glabāšanas metode nav pilnībā droša, taču mēs veicam saprātīgus aizsardzības pasākumus.",
        ],
      },
      {
        heading: "9. Bērni",
        body: [
          "Nometne strādā ar nepilngadīgajiem. Datus par bērnu sniedz vecāks vai likumiskais aizbildnis, kas īsteno bērna tiesības viņa vārdā. Sazinieties ar mums, ja uzskatāt, ka bērna dati sniegti bez atļaujas.",
        ],
      },
      {
        heading: "10. Izmaiņas",
        body: [
          `Mēs varam atjaunināt šo politiku. Aktuālā versija un tās datums vienmēr pieejami šeit. Par būtiskām izmaiņām paziņosim lietotnē vai e-pastā. Spēkā stāšanās datums: ${ED}.`,
        ],
      },
    ],
  },

  uk: {
    title: "Політика конфіденційності",
    updatedLabel: "Останнє оновлення",
    intro: [
      `Ця Політика конфіденційності пояснює, як ${CONTROLLER_NAME} (реєстр. № ${CONTROLLER_REG}, ${CONTROLLER_ADDRESS}) («Маранафа», «ми») збирає та обробляє персональні дані в застосунку табору Маранафа. Ми є контролером даних. З питань конфіденційності пишіть на ${CONTACT_EMAIL}. Повна версія доступна англійською та російською мовами.`,
    ],
    sections: [],
  },
}

// ---------------------------------------------------------------------------
// TERMS OF SERVICE
// ---------------------------------------------------------------------------
export const termsContent: Record<Language, LegalDoc> = {
  en: {
    title: "Terms of Service",
    updatedLabel: "Last updated",
    intro: [
      `These Terms govern your use of the Maranafa application and related services provided by ${CONTROLLER_NAME} (registration No. ${CONTROLLER_REG}, ${CONTROLLER_ADDRESS}). By using the app you agree to these Terms.`,
    ],
    sections: [
      {
        heading: "1. Eligibility and accounts",
        body: [
          "The app is provided for authorised camp staff, participants and parents. You access it with an account we provision, using your phone number to sign in. You are responsible for keeping access to your device and account secure and for activity under your account.",
        ],
      },
      {
        heading: "2. Acceptable use",
        body: [
          "Use the app only for legitimate camp purposes. Do not attempt to access data you are not authorised to see, disrupt the service, upload unlawful content, or use the app to harm others. Access is tied to your role and may be limited accordingly.",
        ],
      },
      {
        heading: "3. Your content",
        body: [
          "You are responsible for the accuracy of information and images you submit (for example receipts and expense data) and confirm you are entitled to provide them. We may store and process this content to operate the camp.",
        ],
      },
      {
        heading: "4. Availability",
        body: [
          "The app is provided on an \"as is\" and \"as available\" basis. We may modify, suspend or discontinue features at any time. We aim for reliable operation but do not guarantee uninterrupted or error-free service.",
        ],
      },
      {
        heading: "5. Limitation of liability",
        body: [
          "To the extent permitted by law, Maranafa is not liable for indirect or consequential losses arising from use of the app. Nothing in these Terms limits liability that cannot be limited under applicable law.",
        ],
      },
      {
        heading: "6. Termination",
        body: [
          `We may suspend or end your access if you breach these Terms or when your involvement with the camp ends. You may stop using the app and request account deletion at any time (see the Privacy Policy or email ${CONTACT_EMAIL}).`,
        ],
      },
      {
        heading: "7. Governing law and contact",
        body: [
          `These Terms are governed by the laws of Latvia. Questions: ${CONTACT_EMAIL}. Effective date: ${ED}.`,
        ],
      },
    ],
  },

  ru: {
    title: "Условия использования",
    updatedLabel: "Последнее обновление",
    intro: [
      `Настоящие Условия регулируют использование приложения Маранафа и связанных сервисов, предоставляемых ${CONTROLLER_NAME} (рег. № ${CONTROLLER_REG}, ${CONTROLLER_ADDRESS}). Используя приложение, вы соглашаетесь с этими Условиями.`,
    ],
    sections: [
      {
        heading: "1. Право доступа и учётные записи",
        body: [
          "Приложение предназначено для уполномоченных сотрудников, участников и родителей лагеря. Доступ осуществляется через создаваемую нами учётную запись с входом по номеру телефона. Вы отвечаете за безопасность вашего устройства и учётной записи и за действия под ней.",
        ],
      },
      {
        heading: "2. Допустимое использование",
        body: [
          "Используйте приложение только в законных целях лагеря. Не пытайтесь получить доступ к данным, на которые у вас нет прав, нарушать работу сервиса, загружать противоправный контент или причинять вред другим. Доступ зависит от вашей роли и может быть ограничен.",
        ],
      },
      {
        heading: "3. Ваш контент",
        body: [
          "Вы отвечаете за достоверность сведений и изображений, которые загружаете (например, чеки и данные о расходах), и подтверждаете право их предоставлять. Мы можем хранить и обрабатывать этот контент для работы лагеря.",
        ],
      },
      {
        heading: "4. Доступность",
        body: [
          "Приложение предоставляется «как есть» и «по мере доступности». Мы можем изменять, приостанавливать или прекращать функции в любое время. Мы стремимся к надёжной работе, но не гарантируем бесперебойность или отсутствие ошибок.",
        ],
      },
      {
        heading: "5. Ограничение ответственности",
        body: [
          "В пределах, допускаемых законом, Маранафа не несёт ответственности за косвенные или сопутствующие убытки, возникшие в связи с использованием приложения. Ничто в настоящих Условиях не ограничивает ответственность, которая не может быть ограничена по применимому праву.",
        ],
      },
      {
        heading: "6. Прекращение",
        body: [
          `Мы можем приостановить или прекратить ваш доступ при нарушении настоящих Условий или по завершении вашего участия в лагере. Вы можете прекратить использование приложения и запросить удаление учётной записи в любое время (см. Политику конфиденциальности или напишите на ${CONTACT_EMAIL}).`,
        ],
      },
      {
        heading: "7. Применимое право и контакты",
        body: [
          `Настоящие Условия регулируются законодательством Латвии. Вопросы: ${CONTACT_EMAIL}. Дата вступления в силу: ${ED}.`,
        ],
      },
    ],
  },

  lv: {
    title: "Lietošanas noteikumi",
    updatedLabel: "Pēdējoreiz atjaunināts",
    intro: [
      `Šie Noteikumi regulē Maranafa lietotnes un saistīto pakalpojumu lietošanu, ko nodrošina ${CONTROLLER_NAME} (reģ. Nr. ${CONTROLLER_REG}, ${CONTROLLER_ADDRESS}). Lietojot lietotni, jūs piekrītat šiem Noteikumiem.`,
    ],
    sections: [
      {
        heading: "1. Tiesības lietot un konti",
        body: [
          "Lietotne paredzēta pilnvarotiem nometnes darbiniekiem, dalībniekiem un vecākiem. Piekļuve notiek ar mūsu izveidotu kontu, pieslēdzoties ar tālruņa numuru. Jūs esat atbildīgs par savas ierīces un konta drošību un par darbībām savā kontā.",
        ],
      },
      {
        heading: "2. Pieļaujamā lietošana",
        body: [
          "Lietojiet lietotni tikai likumīgiem nometnes mērķiem. Nemēģiniet piekļūt datiem, kuriem nav atļaujas, traucēt pakalpojuma darbību, augšupielādēt nelikumīgu saturu vai kaitēt citiem. Piekļuve ir saistīta ar jūsu lomu un var tikt attiecīgi ierobežota.",
        ],
      },
      {
        heading: "3. Jūsu saturs",
        body: [
          "Jūs esat atbildīgs par iesniegtās informācijas un attēlu (piemēram, čeku un izdevumu datu) pareizību un apliecināt tiesības tos sniegt. Mēs varam glabāt un apstrādāt šo saturu nometnes darbības nodrošināšanai.",
        ],
      },
      {
        heading: "4. Pieejamība",
        body: [
          "Lietotne tiek nodrošināta tāda, “kāda tā ir” un “kā pieejama”. Mēs jebkurā laikā varam mainīt, apturēt vai pārtraukt funkcijas. Mēs tiecamies pēc uzticamas darbības, taču negarantējam nepārtrauktu vai bezkļūdu pakalpojumu.",
        ],
      },
      {
        heading: "5. Atbildības ierobežojums",
        body: [
          "Cik to pieļauj likums, Maranafa neatbild par netiešiem vai izrietošiem zaudējumiem, kas radušies lietotnes lietošanas dēļ. Nekas šajos Noteikumos neierobežo atbildību, ko nevar ierobežot saskaņā ar piemērojamiem tiesību aktiem.",
        ],
      },
      {
        heading: "6. Izbeigšana",
        body: [
          `Mēs varam apturēt vai izbeigt jūsu piekļuvi, ja pārkāpjat šos Noteikumus vai kad beidzas jūsu dalība nometnē. Jūs jebkurā laikā varat pārtraukt lietotnes lietošanu un pieprasīt konta dzēšanu (skat. Privātuma politiku vai rakstiet uz ${CONTACT_EMAIL}).`,
        ],
      },
      {
        heading: "7. Piemērojamie tiesību akti un kontakti",
        body: [
          `Šos Noteikumus regulē Latvijas tiesību akti. Jautājumi: ${CONTACT_EMAIL}. Spēkā stāšanās datums: ${ED}.`,
        ],
      },
    ],
  },

  uk: {
    title: "Умови використання",
    updatedLabel: "Останнє оновлення",
    intro: [
      `Ці Умови регулюють використання застосунку Маранафа, що надається ${CONTROLLER_NAME} (реєстр. № ${CONTROLLER_REG}). Використовуючи застосунок, ви погоджуєтеся з цими Умовами. Повна версія доступна англійською та російською мовами. Контакт: ${CONTACT_EMAIL}.`,
    ],
    sections: [],
  },
}
