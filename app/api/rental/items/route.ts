import { NextResponse } from "next/server"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = "tblZXo7EbS0qYdgTS"

export const revalidate = 60

export async function GET() {
  if (!AIRTABLE_TOKEN) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`)
  url.searchParams.set("filterByFormula", "{Доступно для аренды} = TRUE()")
  url.searchParams.set("fields[]", "Name")
  url.searchParams.append("fields[]", "Photo")
  url.searchParams.append("fields[]", "Quantity")
  url.searchParams.append("fields[]", "Цена аренды в день")
  url.searchParams.append("fields[]", "Тип")

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }

  const data = await res.json()

  const items = data.records.map((r: any) => ({
    id: r.id,
    name: r.fields["Name"] ?? "",
    photo: r.fields["Photo"]?.[0]?.thumbnails?.large?.url ?? r.fields["Photo"]?.[0]?.url ?? null,
    quantity: r.fields["Quantity"] ?? 1,
    pricePerDay: r.fields["Цена аренды в день"] ?? 0,
    type: r.fields["Тип"] ?? "",
  }))

  return NextResponse.json({ items })
}
