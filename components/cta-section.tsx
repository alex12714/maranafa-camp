import { Button } from "@/components/ui/button"

export default function CtaSection() {
  return (
    <section className="py-16 bg-[#B22234]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready for an Unforgettable Experience?</h2>
          <p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
            Join us at Maranafa Christian Camp for a transformative journey of faith, friendship, and adventure in God's
            beautiful creation.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button className="bg-white text-[#B22234] hover:bg-gray-100">Register Now</Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#B22234]">
              Request Information
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
