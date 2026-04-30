import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export default function MerchPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-[#B22234]/10 rounded-full flex items-center justify-center mb-4">
        <ShoppingBag className="w-8 h-8 text-[#B22234]" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Мерч Маранафа</h1>
      <p className="text-gray-500 max-w-md mb-6">
        Раздел в разработке. Скоро здесь появятся футболки, кружки и другая продукция лагеря Маранафа.
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
