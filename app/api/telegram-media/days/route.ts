import { NextResponse } from "next/server"
import { getMediaDays } from "@/lib/telegram"

export const revalidate = 900

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get("before")
  const before = raw && /^\d+$/.test(raw) ? Number(raw) : null

  try {
    const { days, nextBefore } = await getMediaDays(before)
    return NextResponse.json(
      { days, nextBefore, ok: true },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } }
    )
  } catch (err) {
    console.error("[telegram-media/days]", err)
    return NextResponse.json(
      { days: [], nextBefore: null, ok: false },
      { status: 200, headers: { "Cache-Control": "public, s-maxage=60" } }
    )
  }
}
