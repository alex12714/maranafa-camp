/**
 * Telegram channel media scraper.
 *
 * Reads the public web preview at https://t.me/s/<channel>, which exposes every
 * post's photos and (when Telegram transcodes them) direct mp4 URLs. Those URLs
 * are served with `Access-Control-Allow-Origin: *` and support range requests,
 * so the browser can play them straight from Telegram's CDN — no proxying.
 *
 * Pagination is `?before=<messageId>`; a page covers roughly 20 message ids,
 * which is far fewer *posts* when albums are involved (one album can hold 10+
 * ids). Every fetch therefore runs through Next's fetch cache.
 */

const CHANNEL = "maranafacamp"

/** Camp lives in Latvia — a photo posted at 00:30 local belongs to that day. */
const TIMEZONE = "Europe/Riga"

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

/** Media URLs carry signed tokens; keep the cache well inside their lifetime. */
const REVALIDATE_SECONDS = 900

/** Binary-search probes snap to this grid so repeated searches reuse cached pages. */
const PROBE_GRID = 64

export interface MediaItem {
  id: string
  type: "photo" | "video"
  /** Playable/displayable URL. Empty only when a video is `unsupported`. */
  url: string
  thumbUrl?: string
  /** Human-readable duration as Telegram renders it, e.g. "0:46". */
  duration?: string
  /** Telegram refused to transcode ("Media is too big") — show the thumb instead. */
  unsupported?: boolean
  link: string
  pubDate: string
  text?: string
}

export interface MediaDay {
  /** Local (Europe/Riga) calendar day, YYYY-MM-DD. */
  date: string
  photoCount: number
  videoCount: number
  coverUrl?: string
  /** Newest message id seen on this day — used as the slideshow's page cursor. */
  latestId: number
  earliestId: number
  /** Crawl budget ran out mid-day, so the counts are a lower bound. */
  partial?: boolean
}

interface ParsedMessage {
  id: number
  pubDate: string
  text: string
  media: MediaItem[]
}

// ─── HTML helpers ─────────────────────────────────────────────────────────────

function decodeEntities(str: string): string {
  return str
    .replace(/&#33;/g, "!")
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
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

/** Calendar day in camp-local time, as YYYY-MM-DD. */
export function localDate(pubDate: string): string {
  const d = new Date(pubDate)
  if (isNaN(d.getTime())) return ""
  // en-CA renders ISO-ordered dates, which sort lexicographically.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d)
}

// ─── Fetching ─────────────────────────────────────────────────────────────────

async function fetchPage(before?: number | null): Promise<string> {
  const url = before
    ? `https://t.me/s/${CHANNEL}?before=${before}`
    : `https://t.me/s/${CHANNEL}`

  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml" },
    signal: AbortSignal.timeout(12000),
  })
  if (!res.ok) throw new Error(`Telegram fetch ${res.status} for ${url}`)
  return res.text()
}

// ─── Parsing ──────────────────────────────────────────────────────────────────

const MEDIA_ANCHOR_RE =
  /<a class="tgme_widget_message_(photo_wrap|video_player|roundvideo_player)([^"]*)"([^>]*)>/g

function idFromHref(href: string | undefined): string | null {
  const m = href?.match(/\/(\d+)(?:\?|$)/)
  return m ? m[1] : null
}

function parseMediaFromBlock(block: string, postId: number, pubDate: string, text: string): MediaItem[] {
  const items: MediaItem[] = []
  MEDIA_ANCHOR_RE.lastIndex = 0

  let match: RegExpExecArray | null
  while ((match = MEDIA_ANCHOR_RE.exec(block)) !== null) {
    const kind = match[1]
    const classRest = match[2]
    const attrs = match[3]

    const href = attrs.match(/href="([^"]+)"/)?.[1]
    const itemId = idFromHref(href) ?? `${postId}-${items.length}`
    const link = href ? href.replace(/\?single$/, "") : `https://t.me/${CHANNEL}/${postId}`

    if (kind === "photo_wrap") {
      const url = attrs.match(/background-image:url\('([^']+)'\)/)?.[1]
      if (!url) continue
      items.push({ id: itemId, type: "photo", url, link, pubDate, text: text || undefined })
      continue
    }

    // Video: the <video> tag and thumbnail live inside the anchor.
    const close = block.indexOf("</a>", MEDIA_ANCHOR_RE.lastIndex)
    const segment = block.slice(MEDIA_ANCHOR_RE.lastIndex, close === -1 ? undefined : close)

    const thumbUrl =
      segment.match(/tgme_widget_message_(?:video|roundvideo)_thumb"\s+style="background-image:url\('([^']+)'\)/)?.[1] ??
      attrs.match(/background-image:url\('([^']+)'\)/)?.[1]
    // Single-video posts carry the mp4 twice: once on a blurred backdrop
    // (`js-message_video_blured`) and once on the real player. Pin to the
    // latter so the backdrop can never be what we play.
    const src =
      segment.match(/<video\s+src="([^"]+)"[^>]*class="tgme_widget_message_video js-message_video"/)?.[1] ??
      segment.match(/<video[^>]+class="tgme_widget_message_video js-message_video"[^>]*src="([^"]+)"/)?.[1]
    const duration = segment.match(/message_video_duration[^>]*>([^<]+)</)?.[1]
    const unsupported = classRest.includes("not_supported") || !src

    if (!src && !thumbUrl) continue

    items.push({
      id: itemId,
      type: "video",
      url: src ?? "",
      thumbUrl,
      duration,
      unsupported: unsupported || undefined,
      link,
      pubDate,
      text: text || undefined,
    })
  }

  return items
}

/** Messages on a page, newest first. */
function parseMessages(html: string): ParsedMessage[] {
  const blocks = html.split("tgme_widget_message_wrap js-widget_message_wrap")
  const messages: ParsedMessage[] = []

  // Index 0 is page chrome that precedes the first message.
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i]

    const postPath = block.match(/data-post="[^"/]+\/(\d+)"/)?.[1]
    if (!postPath) continue
    const id = Number(postPath)

    const pubDate = block.match(/datetime="([^"]+)"/)?.[1] ?? ""
    if (!pubDate) continue

    const textHtml = block.match(
      /<div class="tgme_widget_message_text js-message_text"[^>]*>([\s\S]*?)<\/div>/
    )?.[1]
    const text = textHtml ? cleanHtml(textHtml) : ""

    messages.push({ id, pubDate, text, media: parseMediaFromBlock(block, id, pubDate, text) })
  }

  messages.sort((a, b) => b.id - a.id)
  return messages
}

// ─── Public queries ───────────────────────────────────────────────────────────

/** Newest message id on the channel, used as the upper bound for searches. */
async function newestId(): Promise<number> {
  const messages = parseMessages(await fetchPage())
  return messages[0]?.id ?? 0
}

/**
 * Walk backwards from `before`, grouping media by camp-local day.
 *
 * Bounded by `maxPages` so a single request can never turn into a full-channel
 * crawl; the returned `nextBefore` lets the caller ask for older days.
 */
export async function getMediaDays(
  before?: number | null,
  maxPages = 12
): Promise<{ days: MediaDay[]; nextBefore: number | null }> {
  const byDate = new Map<string, MediaDay>()
  let cursor = before ?? null
  let exhausted = false

  for (let page = 0; page < maxPages; page++) {
    const messages = parseMessages(await fetchPage(cursor))
    if (messages.length === 0) {
      exhausted = true
      break
    }

    for (const msg of messages) {
      if (msg.media.length === 0) continue
      const date = localDate(msg.pubDate)
      if (!date) continue

      const day = byDate.get(date) ?? {
        date,
        photoCount: 0,
        videoCount: 0,
        latestId: msg.id,
        earliestId: msg.id,
      }
      for (const item of msg.media) {
        if (item.type === "video") day.videoCount++
        else day.photoCount++
        if (!day.coverUrl) day.coverUrl = item.type === "photo" ? item.url : item.thumbUrl
      }
      day.latestId = Math.max(day.latestId, msg.id)
      day.earliestId = Math.min(day.earliestId, msg.id)
      byDate.set(date, day)
    }

    cursor = messages[messages.length - 1].id
    if (cursor <= 1) {
      exhausted = true
      break
    }
  }

  const days = [...byDate.values()].sort((a, b) => (a.date < b.date ? 1 : -1))
  // The oldest day was cut off by the page budget — its counts are incomplete.
  if (!exhausted && days.length > 0) days[days.length - 1].partial = true
  return { days, nextBefore: exhausted ? null : cursor }
}

/**
 * Smallest grid-aligned cursor that is guaranteed to sit *after* every message
 * of `date`. Binary search over message ids — they increase monotonically with
 * time — probing on a fixed grid so repeated searches hit the same cached pages.
 */
async function findCursorForDate(date: string): Promise<number | null> {
  const max = await newestId()
  if (!max) return null

  const dateAt = async (k: number): Promise<string> => {
    const messages = parseMessages(await fetchPage(k * PROBE_GRID))
    return messages[0] ? localDate(messages[0].pubDate) : ""
  }

  let lo = 0
  let hi = Math.ceil((max + 1) / PROBE_GRID)
  let answer: number | null = null

  // Find the smallest k whose newest-message-before-k*GRID is already newer
  // than `date`; everything from `date` therefore lies below that cursor.
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    const d = await dateAt(mid)
    if (d && d > date) {
      answer = mid
      hi = mid - 1
    } else {
      lo = mid + 1
    }
  }

  if (answer === null) return max + 1 // `date` is at or after the newest post
  return Math.min(answer * PROBE_GRID, max + 1)
}

/**
 * Every photo and video posted on `date`, in chronological order.
 *
 * `before` short-circuits the binary search when the caller already knows the
 * day's newest message id (the day list hands it over).
 */
export async function getMediaForDate(
  date: string,
  before?: number | null,
  { maxPages = 40, maxItems = 300 }: { maxPages?: number; maxItems?: number } = {}
): Promise<{ items: MediaItem[]; truncated: boolean }> {
  let cursor = before ?? (await findCursorForDate(date))
  if (cursor === null) return { items: [], truncated: false }

  const collected: MediaItem[] = []
  let reachedStart = false
  let truncated = false

  for (let page = 0; page < maxPages; page++) {
    const messages = parseMessages(await fetchPage(cursor))
    if (messages.length === 0) break

    for (const msg of messages) {
      const d = localDate(msg.pubDate)
      if (d > date) continue // still newer than the requested day
      if (d < date) {
        reachedStart = true
        break
      }
      collected.push(...msg.media)
    }

    if (reachedStart) break

    const oldest = messages[messages.length - 1].id
    if (oldest <= 1) break
    cursor = oldest

    if (collected.length >= maxItems) {
      truncated = true
      break
    }
  }

  // Collected newest-first; a day should play forwards.
  collected.reverse()
  if (collected.length > maxItems) {
    collected.splice(0, collected.length - maxItems)
    truncated = true
  }

  return { items: collected, truncated }
}
