import { NextResponse } from "next/server"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tblZXo7EbS0qYdgTS"

export const revalidate = 120

export async function GET() {
  if (!AIRTABLE_TOKEN) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`)
  url.searchParams.set("filterByFormula", '{Тип}="Мерч"')
  url.searchParams.set("fields[]", "Name")
  url.searchParams.append("fields[]", "Photo")
  url.searchParams.append("fields[]", "Quantity")
  url.searchParams.append("fields[]", "Цена")
  url.searchParams.append("fields[]", "Ссылка")
  url.searchParams.append("fields[]", "Описание")

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    next: { revalidate: 120 },
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }

  const data = await res.json()

  const items = data.records.map((r: any) => ({
    id: r.id,
    name: r.fields["Name"] ?? "",
    photo: r.fields["Photo"]?.[0]?.thumbnails?.large?.url ?? r.fields["Photo"]?.[0]?.url ?? null,
    quantity: r.fields["Quantity"] ?? 0,
    price: r.fields["Цена"] ?? null,
    link: r.fields["Ссылка"] ?? null,
    description: r.fields["Описание"] ?? null,
  }))

  return NextResponse.json({ items })
}
