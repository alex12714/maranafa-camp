import { NextRequest, NextResponse } from "next/server"

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY
const BASE_ID = "appARC2ZsIecCWY2s"
const TABLE_ID = process.env.DAWN_TREADER_TABLE_ID || ""

export async function POST(req: NextRequest) {
  try {
    if (!AIRTABLE_TOKEN) {
      console.error("AIRTABLE_API_KEY env var is not set")
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }
    if (!TABLE_ID) {
      console.error("DAWN_TREADER_TABLE_ID env var is not set")
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    const body = await req.json()

    if (!body.name || !body.phone || !body.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const fields: Record<string, unknown> = {
      "Имя": body.name,
      "Телефон": body.phone,
      "Электронная почта": body.email,
      "Дата регистрации": new Date().toISOString().split("T")[0],
    }

    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records: [{ fields }] }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error("Airtable error:", res.status, error)
      return NextResponse.json({ error: "Failed to save registration" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Dawn Treader registration error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
