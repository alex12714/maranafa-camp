"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would handle form submission here
    setIsSubmitted(true)
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#B22234] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Contact Us</h1>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-white/90">
              We'd love to hear from you! Reach out with any questions about our programs or facilities.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-[#B22234]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 text-[#B22234] mr-2" />
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">(555) 123-4567</p>
                <p className="text-gray-500 text-sm mt-1">Monday-Friday: 9am-5pm</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#FFD700]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 text-[#B22234] mr-2" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">info@maranafacamp.org</p>
                <p className="text-gray-500 text-sm mt-1">We'll respond within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#B22234]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 text-[#B22234] mr-2" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">123 Faith Valley Road</p>
                <p className="text-gray-700">Peaceful Mountains, CA 12345</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <div className="h-1 w-20 bg-[#FFD700] mb-6"></div>

              {isSubmitted ? (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-gray-700">
                        Thank you for reaching out. We'll get back to you as soon as possible.
                      </p>
                      <Button className="mt-6 bg-[#B22234] hover:bg-[#8e1c29]" onClick={() => setIsSubmitted(false)}>
                        Send Another Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <Input id="firstName" name="firstName" required className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <Input id="lastName" name="lastName" required className="w-full" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input id="email" name="email" type="email" required className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <Input id="phone" name="phone" type="tel" className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <Input id="subject" name="subject" required className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <Textarea id="message" name="message" required rows={5} className="w-full" />
                  </div>

                  <Button type="submit" className="bg-[#B22234] hover:bg-[#8e1c29]">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Map */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Us</h2>
              <div className="h-1 w-20 bg-[#FFD700] mb-6"></div>

              <div className="bg-gray-200 rounded-lg overflow-hidden h-[400px] flex items-center justify-center">
                <p className="text-gray-600">Map would be displayed here</p>
                {/* In a real application, you would embed a Google Map or similar here */}
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Directions</h3>
                <p className="text-gray-700 mb-4">
                  Maranafa Christian Camp is located in the beautiful mountains, approximately 2 hours from the nearest
                  major city.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">From Highway 101:</span> Take exit 123 and follow Faith Valley Road for
                  5 miles. The camp entrance will be on your right, marked with our sign.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-bold text-[#B22234] mb-2">What are your camp hours?</h3>
              <p className="text-gray-700">
                Check-in for most camps is between 2-4pm on the first day, and pick-up is between 10am-12pm on the last
                day. Specific times will be provided in your registration confirmation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#B22234] mb-2">What should campers bring?</h3>
              <p className="text-gray-700">
                A detailed packing list will be provided after registration, but essentials include clothing,
                toiletries, Bible, sleeping bag, and appropriate outdoor gear.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#B22234] mb-2">Do you accommodate dietary restrictions?</h3>
              <p className="text-gray-700">
                Yes, we can accommodate most dietary needs. Please note any restrictions during registration, and our
                kitchen staff will ensure appropriate meals are provided.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#B22234] mb-2">Is financial assistance available?</h3>
              <p className="text-gray-700">
                Yes, we offer scholarships and payment plans to ensure camp is accessible to all. Please contact our
                office for more information about financial assistance options.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
