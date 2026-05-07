import { NextResponse } from "next/server"

export interface TelegramPost {
  id: string
  title: string
  text: string
  pubDate: string
  link: string
  imageUrl?: string
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim()
}

function extractImageUrl(html: string): string | undefined {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/)
  return match?.[1]
}

function extractLinkFromItem(itemXml: string): string {
  // Try <link> with content
  const linkMatch = itemXml.match(/<link>(https?:\/\/[^<]+)<\/link>/)
  if (linkMatch) return linkMatch[1].trim()
  // Try <guid>
  const guidMatch = itemXml.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/)
  if (guidMatch) return guidMatch[1].trim()
  return ""
}

function extractCdata(tag: string, xml: string): string {
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))
  if (cdataMatch) return cdataMatch[1]
  const plainMatch = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))
  return plainMatch?.[1] ?? ""
}

async function fetchTelegramPosts(channel: string, limit = 8): Promise<TelegramPost[]> {
  const res = await fetch(`https://rsshub.app/telegram/channel/${channel}`, {
    next: { revalidate: 1800 },
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; maranafa-bot/1.0)",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)

  const xml = await res.text()
  const posts: TelegramPost[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match: RegExpExecArray | null

  while ((match = itemRegex.exec(xml)) !== null && posts.length < limit) {
    const item = match[1]
    const rawTitle = extractCdata("title", item)
    const rawDescription = extractCdata("description", item)
    const pubDate = extractCdata("pubDate", item)
    const link = extractLinkFromItem(item)

    const text = stripHtml(rawDescription || rawTitle)
    if (!text && !link) continue

    posts.push({
      id: link || String(posts.length),
      title: stripHtml(rawTitle),
      text,
      pubDate,
      link,
      imageUrl: extractImageUrl(rawDescription),
    })
  }

  return posts
}

export async function GET() {
  try {
    const posts = await fetchTelegramPosts("maranafacamp", 8)
    return NextResponse.json(
      { posts, ok: true },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      }
    )
  } catch {
    return NextResponse.json(
      { posts: [], ok: false },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    )
  }
}
