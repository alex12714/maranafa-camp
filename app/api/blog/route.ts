import { NextResponse } from "next/server"

export interface TelegramPost {
  id: string
  text: string
  pubDate: string
  link: string
  imageUrl?: string
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#33;/g, "!")
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
}

function cleanTelegramHtml(html: string): string {
  return decodeHtmlEntities(
    html
      // Extract emoji characters from <i class="emoji"><b>X</b></i>
      .replace(/<i\s[^>]*class="emoji"[^>]*><b>([^<]*)<\/b><\/i>/g, "$1")
      // br → newline
      .replace(/<br\s*\/?>/gi, "\n")
      // Remove all remaining tags
      .replace(/<[^>]+>/g, "")
      .trim()
  )
}

function extractBgImage(blockHtml: string): string | undefined {
  const m = blockHtml.match(/background-image:url\('([^']+)'\)/)
  return m?.[1]
}

async function scrapeTelegramChannel(channel: string, limit = 8): Promise<TelegramPost[]> {
  const res = await fetch(`https://t.me/s/${channel}`, {
    next: { revalidate: 1800 },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "ru-RU,ru;q=0.9",
    },
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) throw new Error(`Telegram fetch failed: ${res.status}`)

  const html = await res.text()
  const posts: TelegramPost[] = []

  // Split by message wrap containers
  const messageBlocks = html.split("tgme_widget_message_wrap js-widget_message_wrap")
  // Iterate in reverse so latest posts come first; skip index 0 (it's before the first container)
  for (let i = messageBlocks.length - 1; i >= 1 && posts.length < limit; i--) {
    const block = messageBlocks[i]

    // Extract post ID from data-post attribute
    const postIdMatch = block.match(/data-post="([^"]+)"/)
    if (!postIdMatch) continue
    const postPath = postIdMatch[1] // e.g. "maranafacamp/4793"
    const link = `https://t.me/${postPath}`

    // Extract datetime
    const dateMatch = block.match(/datetime="([^"]+)"/)
    const pubDate = dateMatch?.[1] ?? ""

    // Extract text content
    const textMatch = block.match(/<div class="tgme_widget_message_text js-message_text"[^>]*>([\s\S]*?)<\/div>\s*(?:<div class="tgme_widget_message_reactions|<div class="tgme_widget_message_footer)/)
    const text = textMatch ? cleanTelegramHtml(textMatch[1]) : ""

    // Skip if no text and would just be an image post (we still include image-only posts if they have a date)
    if (!text && !pubDate) continue

    // Extract first photo background-image
    const photoWrapMatch = block.match(/tgme_widget_message_photo_wrap[^"]*"[^>]*>([\s\S]*?)(?=tgme_widget_message_footer|tgme_widget_message_text)/)
    const imageUrl = extractBgImage(photoWrapMatch?.[0] ?? block.slice(0, 2000))

    posts.push({ id: postPath, text, pubDate, link, imageUrl })
  }

  return posts
}

export async function GET() {
  try {
    const posts = await scrapeTelegramChannel("maranafacamp", 8)
    return NextResponse.json(
      { posts, ok: true },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      }
    )
  } catch (err) {
    console.error("[blog/api]", err)
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
