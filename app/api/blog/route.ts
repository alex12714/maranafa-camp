import { NextResponse } from "next/server"

export interface TelegramPost {
  id: string
  text: string
  pubDate: string
  link: string
  imageUrl?: string
}

function decodeEntities(str: string): string {
  return str
    .replace(/&#33;/g, "!")
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
}

function cleanHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<i\s[^>]*class="emoji"[^>]*><b>([^<]*)<\/b><\/i>/g, "$1")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .trim()
  )
}

async function scrapeTelegramChannel(channel: string, limit = 8): Promise<TelegramPost[]> {
  const res = await fetch(`https://t.me/s/${channel}`, {
    next: { revalidate: 1800 },
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(12000),
  })

  if (!res.ok) throw new Error(`Telegram fetch ${res.status}`)

  const html = await res.text()
  const blocks = html.split("tgme_widget_message_wrap js-widget_message_wrap")
  const posts: TelegramPost[] = []

  // Iterate latest-first (reverse), skip index 0 which is pre-first-message HTML
  for (let i = blocks.length - 1; i >= 1 && posts.length < limit; i--) {
    const block = blocks[i]

    const postMatch = block.match(/data-post="([^"]+)"/)
    if (!postMatch) continue
    const postPath = postMatch[1]
    const link = `https://t.me/${postPath}`

    const dateMatch = block.match(/datetime="([^"]+)"/)
    const pubDate = dateMatch?.[1] ?? ""

    // Extract text from message_text div (stop at first </div>)
    const textMatch = block.match(/<div class="tgme_widget_message_text js-message_text"[^>]*>([\s\S]*?)<\/div>/)
    const text = textMatch ? cleanHtml(textMatch[1]) : ""

    // Extract first image URL from any background-image in the block
    const imgMatch = block.match(/background-image:url\('(https?:\/\/[^']+)'\)/)
    const imageUrl = imgMatch?.[1]

    // Include post if it has any content (text or image)
    if (!text && !imageUrl && !pubDate) continue

    posts.push({ id: postPath, text, pubDate, link, imageUrl })
  }

  return posts
}

export async function GET() {
  try {
    const posts = await scrapeTelegramChannel("maranafacamp", 8)
    return NextResponse.json(
      { posts, ok: true },
      { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } }
    )
  } catch (err) {
    console.error("[blog/api]", err)
    return NextResponse.json(
      { posts: [], ok: false },
      { status: 200, headers: { "Cache-Control": "public, s-maxage=60" } }
    )
  }
}
