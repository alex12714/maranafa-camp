import { NextRequest, NextResponse } from "next/server"
import { isBot, isFilled, isValidEmail, normalizePhone } from "@/lib/validation"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tbln73o1tF4hMKLUg"

export async function POST(req: NextRequest) {
  try {
    if (!AIRTABLE_TOKEN) {
      console.error("AIRTABLE_API_KEY env var is not set")
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    const body = await req.json()

    // Bot honeypot — pretend it worked so bots don't retry with variations.
    if (isBot(body)) {
      return NextResponse.json({ success: true })
    }

    if (!isFilled(body.fullName)) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 })
    }
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { error: "A valid e-mail address is required" },
        { status: 400 }
      )
    }
    const phone = normalizePhone(body.phone)
    if (!phone) {
      return NextResponse.json(
        {
          error:
            "Enter a single valid phone number starting with + and the country code",
        },
        { status: 400 }
      )
    }

    // Map "heard from" value
    let heardFrom = body.heardFrom
    if (heardFrom === "свой вариант" && body.heardFromCustom) {
      heardFrom = body.heardFromCustom
    }

    // Map allergies
    let allergies = "Нет"
    if (body.allergies === "есть" && body.allergyDetails) {
      allergies = body.allergyDetails
    }

    // Map church name / denomination
    let churchInfo = ""
    if (body.faith === "член церкви" && body.faithChurchName) {
      churchInfo = body.faithChurchName
    } else if (body.faith === "не являюсь членом церкви" && body.faithNoChurchName) {
      churchInfo = body.faithNoChurchName
    }

    // Map arrivedWith to match AirTable select options
    const arrivedWithMap: Record<string, string> = {
      "один": "Один / одна",
      "с друзьями": "С друзьями",
      "с супругом": "С супругом / супругой",
    }

    // Map diet to match AirTable select options
    const dietMap: Record<string, string> = {
      "общий": "Общий",
      "вегетарианский": "Вегетарианский",
    }

    const fields: Record<string, unknown> = {
      "Фамилия и имя": String(body.fullName).trim(),
      "Дата рождения": body.birthDate || null,
      "Адрес проживания": body.address,
      "Телефон": phone,
      "Электронная почта": String(body.email).trim(),
      "Вероисповедание": body.faith,
      "Название церкви / конфессия": churchInfo,
      "Тип питания": dietMap[body.diet] || null,
      "Аллергии": allergies,
      "Я приехал": arrivedWithMap[body.arrivedWith] || null,
      "Как узнал о конференции": heardFrom,
      "Ожидания от конференции": body.expectations || "",
      "Чем могу помочь": (() => {
        const items = Array.isArray(body.howCanHelp) ? [...body.howCanHelp] : []
        const idx = items.indexOf("свой вариант")
        if (idx !== -1 && body.howCanHelpCustom) {
          items[idx] = body.howCanHelpCustom
        }
        return items.join(", ")
      })(),
      "Контактный телефон ЧС": body.emergencyPhone || "",
      "Несовершеннолетний": body.parentalConsent || false,
      "Дата регистрации": new Date().toISOString().split("T")[0],
    }

    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: [{ fields }] }),
      }
    )

    if (!res.ok) {
      const error = await res.text()
      console.error("Airtable error:", error)
      return NextResponse.json({ error: "Failed to save registration" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Registration error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
