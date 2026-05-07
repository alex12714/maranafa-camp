import { NextResponse } from "next/server"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tblS5gANIQSSVabCs"

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
    url.searchParams.append("fields[]", "Текст")
    url.searchParams.append("fields[]", "Оценка")
    if (offset) url.searchParams.set("offset", offset)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      next: { revalidate: 3600 },
    })

    if (!res.ok) return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 })

    const data = await res.json()
    allRecords.push(...data.records)
    offset = data.offset
  } while (offset)

  const songs = allRecords
    .map((r: any) => ({
      id: r.id,
      name: r.fields["Название"] ?? "",
      preview: (r.fields["Текст"] ?? "").split("\n").find((l: string) => l.trim()) ?? null,
      rating: r.fields["Оценка"] ?? null,
    }))
    .filter((s) => s.name)
    .sort((a, b) => a.name.localeCompare(b.name, "ru"))

  return NextResponse.json({ songs })
}
