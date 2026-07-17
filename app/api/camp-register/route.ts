import { NextRequest, NextResponse } from "next/server"
import { isBot, isFilled, isValidEmail, normalizePhone } from "@/lib/validation"
import { logSubmission, clientMeta } from "@/lib/submission-log"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tblPyigvgBHeh1Onv"
const CAMP_EVENT_ID_2026 = "recgplf2vbi82uDQD"
const CAMP_SESSION_2026 = "3. - 9. Augusts 2026 (Август)"
const ENDPOINT = "camp-register"

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
  let meta = { ip: "", ua: "" }
  let body: any
  try {
    if (!AIRTABLE_TOKEN) {
      console.error("AIRTABLE_API_KEY env var is not set")
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    body = await req.json()
    meta = clientMeta(req)

    // Bot honeypot — pretend it worked so bots don't retry with variations.
    if (isBot(body)) {
      await logSubmission({ endpoint: ENDPOINT, outcome: "bot", ...meta, data: body })
      return NextResponse.json({ success: true })
    }

    if (!body.dataConsent) {
      await logSubmission({
        endpoint: ENDPOINT,
        outcome: "rejected",
        reason: "no-consent",
        ...meta,
        data: body,
      })
      return NextResponse.json(
        { error: "Data processing consent is required" },
        { status: 400 }
      )
    }

    // Required identity fields — reject blank/bot submissions.
    const requiredText: Record<string, unknown> = {
      surname: body.surname,
      firstName: body.firstName,
      birthDate: body.birthDate,
      gender: body.gender,
      parentName: body.parentName,
    }
    const missing = Object.entries(requiredText)
      .filter(([, v]) => !isFilled(v))
      .map(([k]) => k)
    if (missing.length > 0) {
      await logSubmission({
        endpoint: ENDPOINT,
        outcome: "rejected",
        reason: `missing:${missing.join(",")}`,
        ...meta,
        data: body,
      })
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      )
    }

    if (!isValidEmail(body.email)) {
      await logSubmission({
        endpoint: ENDPOINT,
        outcome: "rejected",
        reason: "invalid-email",
        ...meta,
        data: body,
      })
      return NextResponse.json(
        { error: "A valid e-mail address is required" },
        { status: 400 }
      )
    }

    const phone = normalizePhone(body.phone)
    if (!phone) {
      await logSubmission({
        endpoint: ENDPOINT,
        outcome: "rejected",
        reason: "invalid-phone",
        ...meta,
        data: body,
      })
      return NextResponse.json(
        {
          error:
            "Enter a single valid phone number starting with + and the country code",
        },
        { status: 400 }
      )
    }

    const fullAddress = [body.street, body.city, body.country]
      .filter((s) => s && String(s).trim().length > 0)
      .join(", ")

    // Name is collected as separate surname + first name in a single language;
    // store the combined "Surname Name" in both the RU and LV name fields so
    // the downstream formulas and the contract keep working.
    const childName = `${String(body.surname).trim()} ${String(
      body.firstName
    ).trim()}`.trim()

    const fields: Record<string, unknown> = {
      "Фамилия Имя на русском": childName,
      "Фамилия Имя на латышском": childName,
      "Дата Рождения": body.birthDate || null,
      "Пол": genderMap[body.gender as string] || null,
      "Персональный Код": body.personalCode || "",
      "Адрес": fullAddress,
      "Город проживания": body.city || "",
      "Страна": body.country || "",
      "Имя-фамилия родителя": String(body.parentName).trim(),
      "Телефон": phone,
      "E-mail для договора": String(body.email).trim(),
      "Канал связи": channelMap[body.contactChannel as string] || null,
      "Аллергии": body.allergies || "",
      "Умение плавать": swimmingMap[body.swimming as string] || null,
      "Прививка от клеща": body.tickVaccine || null,
      "Размер майки": body.shirtSize || null,
      "Особенности Характера": body.characterTraits || "",
      "Интересы -Хобби": body.interests || "",
      "Музыкальный инструмент": body.instrument || "",
      "Есть ли возможность привезти инструмент  в лагерь?":
        body.instrument && body.canBringInstrument ? body.canBringInstrument : null,
      "Как хотите подписать договор": contractMap[body.contractMethod as string] || null,
      "Согласен подписание бумажного договора стоит EUR 10":
        body.contractMethod === "paper" ? !!body.paperContractConsent : false,
      "Согласен с обработкой данных": true,
      "Язык": langMap[body.language as string] || "Русский",
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
      await logSubmission({
        endpoint: ENDPOINT,
        outcome: "error",
        reason: `airtable-${res.status}`,
        ...meta,
        data: body,
      })
      return NextResponse.json({ error: "Failed to save registration" }, { status: 500 })
    }

    const data = await res.json()
    const recordId = data.records?.[0]?.id
    await logSubmission({
      endpoint: ENDPOINT,
      outcome: "saved",
      recordId,
      ...meta,
      data: { childName, phone, email: String(body.email).trim() },
    })
    return NextResponse.json({ success: true, recordId })
  } catch (err) {
    console.error("Camp registration error:", err)
    await logSubmission({
      endpoint: ENDPOINT,
      outcome: "error",
      reason: String(err),
      ...meta,
      data: body,
    })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
