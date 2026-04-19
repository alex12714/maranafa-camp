import { NextRequest, NextResponse } from "next/server"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tblPyigvgBHeh1Onv"
const CAMP_EVENT_ID_2026 = "recgplf2vbi82uDQD"
const CAMP_SESSION_2026 = "3. - 9. Augusts 2026 (Август)"

const channelMap: Record<string, string> = {
  whatsapp: "WhatsApp",
  viber: "Viber",
  sms: "SMS",
  messenger: "FB Messenger",
  telegram: "Telegram",
}

const swimmingMap: Record<string, string> = {
  excellent: "очень хорошее / ļoti laba",
  good: "хорошее / laba",
  medium: "среднее / vidēja",
  weak: "слабое / vāja",
  none: "не умеет / neprot",
}

const genderMap: Record<string, string> = {
  girl: "Девочки / Meitenes",
  boy: "Мальчики / Zēni",
}

const believingFamilyMap: Record<string, string> = {
  yes: "Да",
  no: "Нет",
  adventist: "Адвентисты",
}

const contractMap: Record<string, string> = {
  email: "Pa e-pastu / Через э-почту (bezmaksas / бесплатно)",
  paper: "Uz papira nometnē / На бумаге в лагере (+EUR 10)",
}

const langMap: Record<string, string> = {
  ru: "Русский",
  lv: "Латышский",
  uk: "Украинский",
  en: "Английский",
}

export async function POST(req: NextRequest) {
  try {
    if (!AIRTABLE_TOKEN) {
      console.error("AIRTABLE_API_KEY env var is not set")
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    const body = await req.json()

    if (!body.dataConsent) {
      return NextResponse.json(
        { error: "Data processing consent is required" },
        { status: 400 }
      )
    }

    const fullAddress = [body.street, body.city, body.country]
      .filter((s) => s && String(s).trim().length > 0)
      .join(", ")

    const fields: Record<string, unknown> = {
      "Фамилия Имя на русском": body.nameRu || "",
      "Фамилия Имя на латышском": body.nameLv || "",
      "Дата Рождения": body.birthDate || null,
      "Пол": genderMap[body.gender] || null,
      "Персональный Код": body.personalCode || "",
      "Адрес": fullAddress,
      "Город проживания": body.city || "",
      "Страна": body.country || "",
      "Имя-фамилия родителя": body.parentName || "",
      "Телефон": body.phone || "",
      "E-mail для договора": body.email || "",
      "Канал связи": channelMap[body.contactChannel] || null,
      "Аллергии": body.allergies || "",
      "Умение плавать": swimmingMap[body.swimming] || null,
      "Прививка от клеща": body.tickVaccine || null,
      "Размер майки": body.shirtSize || null,
      "Из верующей семьи": believingFamilyMap[body.believingFamily] || null,
      "Особенности Характера": body.characterTraits || "",
      "Интересы -Хобби": body.interests || "",
      "Музыкальный инструмент": body.instrument || "",
      "Есть ли возможность привезти инструмент  в лагерь?":
        body.instrument && body.canBringInstrument ? body.canBringInstrument : null,
      "Как хотите подписать договор": contractMap[body.contractMethod] || null,
      "Согласен подписание бумажного договора стоит EUR 10":
        body.contractMethod === "paper" ? !!body.paperContractConsent : false,
      "Согласен с обработкой данных": true,
      "Язык": langMap[body.language] || "Русский",
      "Uz kurām nometnes maiņām bērns plāno doties?": [CAMP_SESSION_2026],
      "Текущий лагерь": [CAMP_EVENT_ID_2026],
      "Участник-Сотрудник": "Участник",
      "Заполнили форму регистрации на этот год": true,
    }

    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error("Airtable error:", res.status, error)
      return NextResponse.json({ error: "Failed to save registration" }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, recordId: data.records?.[0]?.id })
  } catch (err) {
    console.error("Camp registration error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
