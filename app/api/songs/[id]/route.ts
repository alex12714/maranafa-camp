import { NextResponse } from "next/server"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tblS5gANIQSSVabCs"

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

  if (!res.ok) return NextResponse.json({ error: "Song not found" }, { status: res.status })

  const r = await res.json()
  return NextResponse.json({
    song: {
      id: r.id,
      name: r.fields["Название"] ?? "",
      text: r.fields["Текст"] ?? null,
      rating: r.fields["Оценка"] ?? null,
    },
  })
}
