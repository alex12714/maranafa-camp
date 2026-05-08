import { NextResponse } from "next/server"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tble1JDNo8HBvjjIr"

export const revalidate = 60

export interface Article {
  id: string
  title: string
  subtitle: string
  slug: string
  author: string
  date: string
  status: string
  category: string
  content: string
  coverUrl?: string
  coverThumbUrl?: string
}

function mapRecord(r: any): Article {
  const f = r.fields
  const cover = f["Обложка"]?.[0]
  return {
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
}

export async function GET() {
  if (!AIRTABLE_TOKEN) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })

  const records: any[] = []
  let offset: string | undefined

  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`)
    url.searchParams.set("filterByFormula", "{Статус}='Опубликовано'")
    url.searchParams.set("sort[0][field]", "Дата")
    url.searchParams.set("sort[0][direction]", "desc")
    if (offset) url.searchParams.set("offset", offset)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      next: { revalidate: 60 },
    })
    if (!res.ok) return NextResponse.json({ error: "AirTable error" }, { status: 500 })

    const data = await res.json()
    records.push(...data.records)
    offset = data.offset
  } while (offset)

  return NextResponse.json({
    articles: records.map(mapRecord),
  })
}
