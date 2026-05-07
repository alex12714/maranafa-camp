import { NextResponse } from "next/server"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tbl9YKW3EaTm2FrEm"

export const revalidate = 3600

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!AIRTABLE_TOKEN) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const { id } = await params

  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${id}`,
    {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) {
    return NextResponse.json({ error: "Game not found" }, { status: res.status })
  }

  const r = await res.json()
  const f = r.fields

  return NextResponse.json({
    game: {
      id: r.id,
      name: f["Название"] ?? "",
      shortDescription: f["Краткое описание"] ?? null,
      longDescription: f["Длинное описание"] ?? null,
      types: f["Тип"] ?? [],
      rating: f["Оценка"] ?? null,
      ageGroups: f["Возраст"] ?? [],
      image:
        f["Картинка"]?.[0]?.thumbnails?.full?.url ??
        f["Картинка"]?.[0]?.url ??
        null,
      durationMinutes: f["Время игры (минуты)"] ?? null,
      difficulty: f["Сложность в участии"] ?? null,
      orgDifficulty: f["Сложность организации"] ?? null,
      minParticipants: f["Мин количество участников"] ?? null,
      maxParticipants: f["Макс количество участников"] ?? null,
      inventory: f["Необходимый инвентарь"] ?? null,
      traumaRisk: f["Травмоопасность"] ?? null,
      staffCount: f["Нужное количество сотрудников"] ?? null,
    },
  })
}
