import type { Metadata } from "next"
import { getEventBySlug, toPageData } from "@/lib/onfire-events"
import MaranafaFriendsNovPage from "./friends-page-client"

// OnFire event (business Maranafa) behind this page. Re-read every 5 minutes.
const SLUG = "maranafa-friends-nov-2026"
export const revalidate = 300

// Shown when OnFire is unreachable or the event is not public yet.
const FALLBACK = {
  date: "13 – 15 ноября 2026",
  weekdays: "Пятница – воскресенье",
  place: "Уточняется",
}
const FALLBACK_TITLE = "Маранафа Friends — осенняя встреча"
const FALLBACK_DESCRIPTION =
  "Три дня вместе — музыка, Библия, разговоры и много смеха. 13 – 15 ноября 2026. Регистрация открыта."
const FALLBACK_IMAGE = "/images/events/friends-nov-2026.svg"

export async function generateMetadata(): Promise<Metadata> {
  const data = toPageData(await getEventBySlug(SLUG), FALLBACK)
  const title = data.title ? `${data.title} — ${data.date}` : FALLBACK_TITLE
  const description = (data.description || FALLBACK_DESCRIPTION).replace(/\s+/g, " ").slice(0, 200)
  const image = data.cover || FALLBACK_IMAGE
  return {
    title,
    description,
    alternates: { canonical: `https://maranafa.camp/${SLUG}` },
    openGraph: {
      title,
      description,
      url: `https://maranafa.camp/${SLUG}`,
      siteName: "Маранафа",
      type: "website",
      locale: "ru_RU",
      images: [{ url: image.startsWith("/") ? `https://maranafa.camp${image}` : image }],
    },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function Page() {
  // Same fetch as generateMetadata; Next dedupes it within one render.
  const data = toPageData(await getEventBySlug(SLUG), FALLBACK)
  return <MaranafaFriendsNovPage data={data} />
}
