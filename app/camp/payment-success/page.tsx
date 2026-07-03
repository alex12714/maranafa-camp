"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TranslatedText } from "@/components/translated-text"
import { CheckCircle2 } from "lucide-react"

export default function CampPaymentSuccessPage() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <Card>
          <CardContent className="py-16 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              <TranslatedText text="Оплата получена!" />
            </h1>
            <p className="text-gray-600 mb-6">
              <TranslatedText text="Спасибо! Ваш платёж за лагерь успешно обработан. Подтверждение придёт на вашу электронную почту." />
            </p>
            <Button className="bg-[#B22234] hover:bg-[#8e1c29] text-white" asChild>
              <Link href="/">
                <TranslatedText text="Вернуться на главную" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
