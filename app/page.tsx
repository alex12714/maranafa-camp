import Hero from "@/components/hero"
import UpcomingEvents from "@/components/upcoming-events"
import DirectorQuote from "@/components/director-quote"
import ParentReviews from "@/components/parent-reviews"
import AboutSection from "@/components/about-section"
import StaffSection from "@/components/staff-section"
import BenefitsSection from "@/components/benefits-section"
import TestimonialsSection from "@/components/testimonials-section"
import LimitedOfferSection from "@/components/limited-offer-section"
import StaffInterviewSection from "@/components/staff-interview-section"
import HomeBlogSection from "@/components/home-blog-section"
import { events as hardcodedEvents } from "@/components/home/sections/events-data"
import { getBusinessEvents, mergeEvents } from "@/lib/onfire-events"

// The classic front page (restored from before the cinematic redesign, 79c307f).
// The cinematic sections stay in components/home/ but are not mounted.
//
// Event cards are read from OnFire (Maranafa business) every 5 minutes; the
// hardcoded list in events-data.ts is the fallback when OnFire is unreachable.
export const revalidate = 300

export default async function Home() {
  const events = mergeEvents(hardcodedEvents, await getBusinessEvents())
  return (
    <div className="flex flex-col">
      <Hero />
      <UpcomingEvents events={events} />
      <StaffInterviewSection />
      <DirectorQuote />
      <ParentReviews />
      <AboutSection />
      <StaffSection />
      <BenefitsSection />
      <TestimonialsSection />
      <HomeBlogSection />
      <LimitedOfferSection />
    </div>
  )
}
