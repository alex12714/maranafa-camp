import { NextResponse } from "next/server"
import { getMediaForDate } from "@/lib/telegram"

export const revalidate = 900

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date") ?? ""
  const rawBefore = searchParams.get("before")
  const before = rawBefore && /^\d+$/.test(rawBefore) ? Number(rawBefore) : null

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ items: [], ok: false, error: "bad date" }, { status: 400 })
  }

  try {
    const { items, truncated } = await getMediaForDate(date, before)
    return NextResponse.json(
      { date, items, truncated, ok: true },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } }
    )
  } catch (err) {
    console.error("[telegram-media]", err)
    return NextResponse.json(
      { date, items: [], truncated: false, ok: false },
      { status: 200, headers: { "Cache-Control": "public, s-maxage=60" } }
    )
  }
}
