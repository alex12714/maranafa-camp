import { NextResponse } from "next/server"
import { mapArticleRecord, normalizeArticleLanguage, pickTranslationsPerSlug } from "@/lib/articles"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tble1JDNo8HBvjjIr"

export const revalidate = 60

export type { Article } from "@/lib/articles"

export async function GET(req: Request) {
  if (!AIRTABLE_TOKEN) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })

  const lang = normalizeArticleLanguage(new URL(req.url).searchParams.get("lang"))

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
    articles: pickTranslationsPerSlug(records.map(mapArticleRecord), lang),
  })
}
