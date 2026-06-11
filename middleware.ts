import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PORTAL_HOST = "conference.maranafa.camp"

export function middleware(request: NextRequest) {
  // Strip any port and normalize case before comparing hosts
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase()

  // maranafa.camp / www.maranafa.camp (and anything else) pass through untouched
  if (host !== PORTAL_HOST) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // Already targeting the portal section — do not double-prefix
  if (pathname === "/portal" || pathname.startsWith("/portal/")) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = pathname === "/" ? "/portal" : `/portal${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Skip Next.js internals (_next/*), API routes, favicon, and any path
  // containing a dot (static files with extensions)
  matcher: ["/((?!_next/|api/|favicon.ico|.*\\..*).*)"],
}
