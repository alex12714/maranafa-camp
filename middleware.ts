import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PORTAL_HOST = "conference.maranafa.camp"

// /ru, /en/about, /ukr/blog/... — a shareable deep link into a specific language
const LOCALE_PREFIX = /^\/(ru|en|lv|uk|ukr)(?=\/|$)/i
const LOCALE_COOKIE = "NEXT_LOCALE"
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function middleware(request: NextRequest) {
  // Strip any port and normalize case before comparing hosts
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase()
  const { pathname } = request.nextUrl

  if (host === PORTAL_HOST) {
    // Already targeting the portal section — do not double-prefix
    if (pathname === "/portal" || pathname.startsWith("/portal/")) {
      return NextResponse.next()
    }

    const url = request.nextUrl.clone()
    url.pathname = pathname === "/" ? "/portal" : `/portal${pathname}`
    return NextResponse.rewrite(url)
  }

  // maranafa.camp / www.maranafa.camp: serve the plain route and remember the
  // language, so the client picks it up instead of asking which one to use.
  const prefix = pathname.match(LOCALE_PREFIX)
  if (!prefix) return NextResponse.next()

  const requested = prefix[1].toLowerCase()
  const locale = requested === "ukr" ? "uk" : requested
  const rest = pathname.slice(prefix[0].length)

  const url = request.nextUrl.clone()
  url.pathname = rest === "" ? "/" : rest

  const response = NextResponse.rewrite(url)
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  })
  return response
}

export const config = {
  // Skip Next.js internals (_next/*), API routes, favicon, and any path
  // containing a dot (static files with extensions)
  matcher: ["/((?!_next/|api/|favicon.ico|.*\\..*).*)"],
}
