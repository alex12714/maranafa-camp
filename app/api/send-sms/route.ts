import { NextResponse } from "next/server"
import crypto from "crypto"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ZADARMA_KEY = process.env.ZADARMA_KEY
const ZADARMA_SECRET = process.env.ZADARMA_SECRET
const SMS_API_TOKEN = process.env.SMS_API_TOKEN

const ZADARMA_BASE = "https://api.zadarma.com"
const METHOD = "/v1/sms/send/"

// Match PHP urlencode() / http_build_query (RFC1738): space -> '+',
// and encode the chars JS leaves literal but PHP escapes.
function phpUrlEncode(s: string): string {
  return encodeURIComponent(s)
    .replace(/%20/g, "+")
    .replace(/[!'()*~]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase())
}

// PHP http_build_query: keys sorted, key & value urlencoded, joined by '&'
function buildQuery(params: Record<string, string>): string {
  return Object.keys(params)
    .sort()
    .map((k) => `${phpUrlEncode(k)}=${phpUrlEncode(params[k])}`)
    .join("&")
}

function timingSafeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

export async function POST(req: Request) {
  // --- Auth: require Bearer token ---
  const authHeader = req.headers.get("authorization") ?? ""
  const token = authHeader.replace(/^Bearer\s+/i, "")
  if (!SMS_API_TOKEN || !timingSafeEqual(token, SMS_API_TOKEN)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!ZADARMA_KEY || !ZADARMA_SECRET) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  // --- Parse body ---
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const number = (body?.number ?? "").toString().trim()
  const message = (body?.message ?? "").toString()
  const caller_id = (body?.caller_id ?? "Maranafa").toString()

  if (!number || !message) {
    return NextResponse.json(
      { error: "Both 'number' and 'message' are required" },
      { status: 400 }
    )
  }

  // --- Sign (Zadarma) ---
  const params: Record<string, string> = { number, message, caller_id }
  const paramStr = buildQuery(params)
  const md5 = crypto.createHash("md5").update(paramStr).digest("hex")
  const hmacHex = crypto
    .createHmac("sha1", ZADARMA_SECRET)
    .update(METHOD + paramStr + md5)
    .digest("hex")
  const signature = Buffer.from(hmacHex).toString("base64")
  const authorization = `${ZADARMA_KEY}:${signature}`

  // --- Send ---
  let upstream: Response
  try {
    upstream = await fetch(ZADARMA_BASE + METHOD, {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: paramStr,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: "Upstream request failed", detail: String(e?.message ?? e) },
      { status: 502 }
    )
  }

  const text = await upstream.text()
  let data: any
  try {
    data = JSON.parse(text)
  } catch {
    data = { raw: text }
  }

  return NextResponse.json(data, { status: upstream.ok ? 200 : upstream.status })
}
