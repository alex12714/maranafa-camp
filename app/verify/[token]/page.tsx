/**
 * Public certificate verification — /verify/{token}
 *
 * Where the QR code printed on every issued certificate lands. Until now that
 * code pointed at `GET https://api.maranafa.camp/public/certificates/{token}`,
 * so a parent, an employer or another camp scanning a printed sheet was shown
 * a raw JSON body. It verified; it was not a verification page. This route is
 * that page, and it answers the same three questions the endpoint does.
 *
 * NO AUTHENTICATION, AND IT MUST NEVER ACQUIRE ANY. Everybody who reaches this
 * URL got here from a piece of paper, and most of them have never used this
 * site. Nothing on this route may redirect to a login, read a token, or fail
 * differently for a signed-in visitor.
 *
 * A SERVER SHELL AROUND A CLIENT BODY, on purpose. This file stays a server
 * component only so it can export `metadata` — chiefly `robots: noindex`, since
 * these pages carry a named person and a serial and have no business in a
 * search index. The verification request itself is made by the visitor's own
 * browser; `components/verify/certificate-verification.tsx` documents why
 * (the rate limiter is per IP, and our container is one IP for the world).
 *
 * The header, footer and language modal come from `app/layout.tsx`, so this
 * page is part of maranafa.camp without asking for anything. `/ru/verify/…`,
 * `/lv/verify/…` and the rest work through `middleware.ts` for free.
 */

import type { Metadata } from "next"

import { CertificateVerification } from "@/components/verify/certificate-verification"

export const metadata: Metadata = {
  title: "Проверка сертификата — Маранафа",
  description:
    "Проверка сертификата обучения «Маранафы» по коду с документа.",
  // A verification page names a person and a serial. Useful to whoever scanned
  // the sheet, and to nobody else — least of all a crawler building an index
  // of who trained at this camp.
  robots: { index: false, follow: false, nocache: true },
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  return <CertificateVerification token={token} />
}
