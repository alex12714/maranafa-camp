import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample gallery data
const galleryCategories = [
  {
    id: "all",
    name: "All Photos",
  },
  {
    id: "youth-camp",
    name: "Youth Camp",
  },
  {
    id: "family-retreat",
    name: "Family Retreat",
  },
  {
    id: "adventure",
    name: "Adventure",
  },
  {
    id: "facilities",
    name: "Facilities",
  },
]

// Generate sample images for each category
const generateImages = (category: string, count: number) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: `${category}-${index}`,
    src: `/placeholder.svg?height=600&width=800`,
    alt: `${category} image ${index + 1}`,
    category: category,
  }))
}

// Create a gallery with images from all categories
const galleryImages = [
  ...generateImages("youth-camp", 8),
  ...generateImages("family-retreat", 6),
  ...generateImages("adventure", 6),
  ...generateImages("facilities", 4),
]

export default function GalleryPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=600&width=1600"
            alt="Maranafa Christian Camp Gallery"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Photo Gallery</h1>
            <p className="mx-auto mt-6 max-w-lg text-xl text-white">
              Explore moments of faith, friendship, and adventure at Maranafa Christian Camp
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-100">
                {galleryCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-[#B22234] data-[state=active]:text-white"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {galleryCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages
                    .filter((img) => category.id === "all" || img.category === category.id)
                    .map((image) => (
                      <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg">
                        <Image
                          src={image.src || "/placeholder.svg"}
                          alt={image.alt}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="text-center mt-12">
            <Button className="bg-[#B22234] hover:bg-[#8e1c29] text-white">Load More Photos</Button>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Camp Videos</h2>
            <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Watch highlights from our programs and hear testimonials from campers and staff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((video) => (
              <div key={video} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Video player would be here</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">Summer Camp Highlights {video}</h3>
                  <p className="text-gray-700 mt-2">
                    Experience the joy, adventure, and spiritual growth from our summer camp program.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Share Your Photos Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Share Your Photos</h2>
              <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">
                Have photos from your time at Maranafa? We'd love to see them! Share your memories with our camp
                community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#B22234] focus:ring-[#B22234]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#B22234] focus:ring-[#B22234]"
                  />
                </div>

                <div>
                  <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">
                    Program/Year
                  </label>
                  <input
                    type="text"
                    id="program"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#B22234] focus:ring-[#B22234]"
                    placeholder="e.g., Youth Camp 2023"
                  />
                </div>

                <div>
                  <label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Photos
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#B22234] hover:text-[#8e1c29]"
                        >
                          <span>Upload files</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-[#B22234] hover:bg-[#8e1c29] text-white">Submit Photos</Button>
              </div>

              <div className="hidden md:block">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Share your camp photos"
                  width={400}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#B22234]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Create Your Own Memories</h2>
            <p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
              Join us at Maranafa Christian Camp and be part of the next photo gallery!
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Button className="bg-white text-[#B22234] hover:bg-gray-100">View Upcoming Programs</Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#B22234]">
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
