import { NextResponse } from "next/server"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tbl9YKW3EaTm2FrEm"

export const revalidate = 3600

export async function GET() {
  if (!AIRTABLE_TOKEN) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const allRecords: any[] = []
  let offset: string | undefined

  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`)
    url.searchParams.append("fields[]", "Название")
    url.searchParams.append("fields[]", "Краткое описание")
    url.searchParams.append("fields[]", "Тип")
    url.searchParams.append("fields[]", "Оценка")
    url.searchParams.append("fields[]", "Возраст")
    url.searchParams.append("fields[]", "Картинка")
    url.searchParams.append("fields[]", "Время игры (минуты)")
    url.searchParams.append("fields[]", "Сложность в участии")
    url.searchParams.append("fields[]", "Мин количество участников")
    url.searchParams.append("fields[]", "Макс количество участников")
    if (offset) url.searchParams.set("offset", offset)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 })
    }

    const data = await res.json()
    allRecords.push(...data.records)
    offset = data.offset
  } while (offset)

  const games = allRecords
    .map((r: any) => ({
      id: r.id,
      name: r.fields["Название"] ?? "",
      shortDescription: r.fields["Краткое описание"] ?? null,
      types: r.fields["Тип"] ?? [],
      rating: r.fields["Оценка"] ?? null,
      ageGroups: r.fields["Возраст"] ?? [],
      image:
        r.fields["Картинка"]?.[0]?.thumbnails?.large?.url ??
        r.fields["Картинка"]?.[0]?.url ??
        null,
      durationMinutes: r.fields["Время игры (минуты)"] ?? null,
      difficulty: r.fields["Сложность в участии"] ?? null,
      minParticipants: r.fields["Мин количество участников"] ?? null,
      maxParticipants: r.fields["Макс количество участников"] ?? null,
    }))
    .filter((g) => g.name)

  return NextResponse.json({ games })
}
