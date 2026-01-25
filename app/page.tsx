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

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <UpcomingEvents />
      <StaffInterviewSection />
      <DirectorQuote />
      <ParentReviews />
      <AboutSection />
      <StaffSection />
      <BenefitsSection />
      <TestimonialsSection />
      <LimitedOfferSection />
    </div>
  )
}
