import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function RentalSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Оплата прошла успешно!</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        Спасибо за аренду оборудования. Мы свяжемся с вами для подтверждения деталей.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#B22234] text-white rounded-lg font-medium hover:bg-[#9a1c2a] transition-colors"
      >
        На главную
      </Link>
    </div>
  )
}
