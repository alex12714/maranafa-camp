import { NextResponse } from "next/server"
import { mapArticleRecord, normalizeArticleLanguage, pickTranslation } from "@/lib/articles"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tble1JDNo8HBvjjIr"

export const revalidate = 3600

export async function GET(req: Request) {
  if (!AIRTABLE_TOKEN) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 })

  const lang = normalizeArticleLanguage(searchParams.get("lang"))

  // Every translation shares the slug, so fetch them all and pick one.
  const formula = encodeURIComponent(`{Slug}='${slug}'`)
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula=${formula}`,
    {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) return NextResponse.json({ error: "AirTable error" }, { status: 500 })

  const data = await res.json()
  if (!data.records?.length) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const article = pickTranslation(data.records.map(mapArticleRecord), lang)
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ article })
}
