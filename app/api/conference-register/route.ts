import { NextResponse } from "next/server"

const AIRTABLE_TOKEN = "patb4ITHpFjMt4yDe.dd088747d8444e98a81432e762db4f6a0bfdcbf61395ae3ef1486928ecd15016"
const AIRTABLE_BASE = "appARC2ZsIecCWY2s"
const TABLE_ID = "tblHeW06JjaYPPyhe"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${TABLE_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error("Airtable error:", err)
      return NextResponse.json({ error: "Failed to create record" }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
