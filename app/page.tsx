import HeroCinematic from "@/components/home/hero/hero-cinematic"
import SmoothScroll from "@/components/home/smooth-scroll"
import Manifesto from "@/components/home/sections/manifesto"
import EventsGallery from "@/components/home/sections/events-gallery"
import Story from "@/components/home/sections/story"
import CampLife from "@/components/home/sections/camp-life"
import Staff from "@/components/home/sections/staff"
import Voices from "@/components/home/sections/voices"
import Journal from "@/components/home/sections/journal"
import FinalCta from "@/components/home/sections/final-cta"

// Films (components/home/sections/films.tsx) is ready but not mounted: both
// YouTube videos it used (KO7VG_UkHUA, 4GvEYKvkRTw) are no longer available.

export default function Home() {
  return (
    <SmoothScroll>
      <div className="flex flex-col bg-paper">
        <HeroCinematic />
        <Manifesto />
        <EventsGallery />
        <Story />
        <CampLife />
        <Staff />
        <Voices />
        <Journal />
        <FinalCta />
      </div>
    </SmoothScroll>
  )
}
