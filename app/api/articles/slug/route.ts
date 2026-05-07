import { NextResponse } from "next/server"
import type { Article } from "@/app/api/articles/route"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tble1JDNo8HBvjjIr"

export const revalidate = 3600

export async function GET(req: Request) {
  if (!AIRTABLE_TOKEN) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 })

  const formula = encodeURIComponent(`{Slug}='${slug}'`)
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula=${formula}&maxRecords=1`,
    {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) return NextResponse.json({ error: "AirTable error" }, { status: 500 })

  const data = await res.json()
  if (!data.records?.length) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const r = data.records[0]
  const f = r.fields
  const cover = f["Обложка"]?.[0]

  const article: Article = {
    id: r.id,
    title: f["Заголовок"] ?? "",
    subtitle: f["Подзаголовок"] ?? "",
    slug: f["Slug"] ?? r.id,
    author: f["Автор"] ?? "",
    date: f["Дата"] ?? "",
    status: f["Статус"] ?? "Черновик",
    category: f["Категория"] ?? "",
    content: f["Содержимое"] ?? "",
    coverUrl: cover?.url ?? undefined,
    coverThumbUrl: cover?.thumbnails?.large?.url ?? cover?.url ?? undefined,
  }

  return NextResponse.json({ article })
}
