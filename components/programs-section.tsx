import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Calendar, Mountain } from "lucide-react"

const programs = [
  {
    title: "Summer Youth Camp",
    description:
      "A week-long adventure for teens to grow in faith and friendship through worship, Bible study, and outdoor activities.",
    age: "Ages 13-18",
    dates: "June - August",
    icon: Users,
  },
  {
    title: "Family Retreat",
    description:
      "Strengthen family bonds through shared experiences, devotionals, and recreational activities in God's creation.",
    age: "All ages",
    dates: "May & September",
    icon: Calendar,
  },
  {
    title: "Adventure Camp",
    description:
      "Challenge yourself with rock climbing, hiking, and team-building activities while growing spiritually.",
    age: "Ages 15-21",
    dates: "July - August",
    icon: Mountain,
  },
]

export default function ProgramsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Programs</h2>
          <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our range of Christ-centered programs designed for spiritual growth, fellowship, and adventure in
            God's beautiful creation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            const Icon = program.icon
            return (
              <Card key={index} className="border-t-4 border-t-[#B22234] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-[#B22234]" />
                  </div>
                  <CardTitle className="text-xl text-[#B22234]">{program.title}</CardTitle>
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

        <div className="text-center mt-12">
          <Button className="bg-[#B22234] hover:bg-[#8e1c29] text-white">View All Programs</Button>
        </div>
      </div>
    </section>
  )
}
