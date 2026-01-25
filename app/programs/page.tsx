import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Users, Calendar, Mountain, Compass, Book, Heart } from "lucide-react"

const programs = [
  {
    title: "Summer Youth Camp",
    description:
      "A week-long adventure for teens to grow in faith and friendship through worship, Bible study, and outdoor activities.",
    age: "Ages 13-18",
    dates: "June - August",
    duration: "1 week sessions",
    icon: Users,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Family Retreat",
    description:
      "Strengthen family bonds through shared experiences, devotionals, and recreational activities in God's creation.",
    age: "All ages",
    dates: "May & September",
    duration: "Weekend (Fri-Sun)",
    icon: Heart,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Adventure Camp",
    description:
      "Challenge yourself with rock climbing, hiking, and team-building activities while growing spiritually.",
    age: "Ages 15-21",
    dates: "July - August",
    duration: "10 days",
    icon: Mountain,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Leadership Training",
    description: "Develop your leadership skills and spiritual gifts through hands-on training and mentorship.",
    age: "Ages 16-22",
    dates: "June & July",
    duration: "2 weeks",
    icon: Compass,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Bible Study Retreat",
    description: "Dive deep into God's Word through intensive study, discussion, and reflection in a peaceful setting.",
    age: "Ages 18+",
    dates: "Year-round",
    duration: "3-5 days",
    icon: Book,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Group Retreats",
    description:
      "Custom retreats for church groups, youth groups, and Christian organizations with tailored programming.",
    age: "All ages",
    dates: "Year-round",
    duration: "Flexible",
    icon: Calendar,
    image: "/placeholder.svg?height=400&width=600",
  },
]

export default function ProgramsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=600&width=1600"
            alt="Maranafa Christian Camp Programs"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Our Programs</h1>
            <p className="mx-auto mt-6 max-w-lg text-xl text-white">
              Discover life-changing experiences designed for spiritual growth and adventure
            </p>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Program Offerings</h2>
            <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              At Maranafa, we offer a variety of Christ-centered programs designed to meet the needs of different age
              groups and interests. Each program is carefully crafted to foster spiritual growth, build community, and
              create lasting memories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => {
              const Icon = program.icon
              return (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 relative h-48">
                    <Image
                      src={program.image || "/placeholder.svg"}
                      alt={program.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
                        <Icon className="h-5 w-5 text-[#B22234]" />
                      </div>
                      <CardTitle className="text-xl text-[#B22234]">{program.title}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-600">{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Age Group:</span>
                        <span>{program.age}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Dates:</span>
                        <span>{program.dates}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Duration:</span>
                        <span>{program.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="text-[#B22234] hover:text-[#8e1c29] hover:bg-[#B22234]/10 p-0">
                      Learn more <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* A Day at Camp */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">A Day at Maranafa</h2>
            <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              While each program has its unique schedule, here's a glimpse of what a typical day at Maranafa Christian
              Camp might look like.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#FFD700] md:left-1/2 md:-ml-0.5"></div>

              {/* Timeline items */}
              <div className="space-y-12">
                {[
                  {
                    time: "7:30 AM",
                    event: "Wake Up & Morning Devotional",
                    description: "Start the day with personal or cabin devotions to center our hearts on Christ.",
                  },
                  {
                    time: "8:00 AM",
                    event: "Breakfast",
                    description: "Enjoy a hearty meal together in the dining hall.",
                  },
                  {
                    time: "9:00 AM",
                    event: "Morning Worship & Bible Study",
                    description:
                      "Gather for worship and dive into God's Word through engaging teaching and small group discussions.",
                  },
                  {
                    time: "11:00 AM",
                    event: "Activity Period 1",
                    description: "Participate in various activities like swimming, archery, crafts, or team sports.",
                  },
                  { time: "12:30 PM", event: "Lunch", description: "Refuel with a delicious lunch and fellowship." },
                  {
                    time: "1:30 PM",
                    event: "Rest & Free Time",
                    description: "Take time to rest, write letters home, or enjoy quiet activities.",
                  },
                  {
                    time: "2:30 PM",
                    event: "Activity Period 2",
                    description: "More exciting camp activities and adventures.",
                  },
                  {
                    time: "5:00 PM",
                    event: "Cabin Time",
                    description: "Connect with your cabin mates and counselors.",
                  },
                  { time: "6:00 PM", event: "Dinner", description: "Gather for the evening meal and announcements." },
                  {
                    time: "7:30 PM",
                    event: "Evening Program",
                    description: "Enjoy campfires, games, talent shows, or special events.",
                  },
                  {
                    time: "9:00 PM",
                    event: "Cabin Devotions",
                    description: "Reflect on the day and share what God is teaching you.",
                  },
                  { time: "10:00 PM", event: "Lights Out", description: "Rest up for another exciting day at camp!" },
                ].map((item, index) => (
                  <div key={index} className="relative mb-8">
                    <div className="flex items-center md:justify-between">
                      <div className="flex md:w-5/12 md:text-right md:pr-8">
                        <div className="md:hidden mr-4 flex-shrink-0 h-8 w-8 rounded-full bg-[#B22234] flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#B22234]">{item.time}</h3>
                          <h4 className="font-semibold text-gray-900">{item.event}</h4>
                        </div>
                      </div>

                      <div className="hidden md:flex h-8 w-8 rounded-full bg-[#B22234] items-center justify-center text-white text-xs font-bold z-10">
                        {index + 1}
                      </div>

                      <div className="hidden md:block md:w-5/12 md:pl-8">
                        <p className="text-gray-700">{item.description}</p>
                      </div>
                    </div>
                    <div className="mt-2 md:hidden">
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Bring */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What to Bring</h2>
              <div className="h-1 w-20 bg-[#FFD700] mb-6"></div>
              <p className="text-gray-700 mb-6">
                Proper preparation helps ensure a comfortable and enjoyable camp experience. While specific packing
                lists will be provided for each program, here are some general items to bring:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-[#B22234] mb-2">Essentials</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Bible, notebook, and pen</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Sleeping bag and pillow</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Toiletries and towels</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Clothing for all weather</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Closed-toe shoes</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-[#B22234] mb-2">Recommended</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Flashlight</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Water bottle</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Sunscreen and bug spray</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Camera</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>Swimwear (modest)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Campers enjoying activities"
                width={800}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-bold text-[#B22234] mb-2">How do I register for a program?</h3>
              <p className="text-gray-700">
                Registration can be completed online through our website or by calling our office. A deposit is required
                to secure your spot, with the balance due two weeks before the program start date.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#B22234] mb-2">What is your cancellation policy?</h3>
              <p className="text-gray-700">
                Deposits are refundable up to 30 days before the program start date, minus a $50 processing fee.
                Cancellations within 30 days are non-refundable unless due to medical emergencies.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#B22234] mb-2">Is medical staff available?</h3>
              <p className="text-gray-700">
                Yes, we have a registered nurse on-site during all youth programs and medical professionals on call for
                all other programs. All staff are trained in basic first aid and CPR.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#B22234] mb-2">Can parents visit during camp?</h3>
              <p className="text-gray-700">
                For youth programs, we generally discourage visits as they can disrupt the camp experience and cause
                homesickness. For family programs, visitors must check in at the office upon arrival.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#B22234]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Register?</h2>
            <p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
              Secure your spot for an unforgettable experience at Maranafa Christian Camp. Space is limited, so register
              today!
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Button className="bg-white text-[#B22234] hover:bg-gray-100">Register Now</Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#B22234]">
                Download Information Packet
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
