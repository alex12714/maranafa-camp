import { TranslatedText } from "@/components/translated-text"

export default function PortalPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <TranslatedText text="Портал конференции скоро откроется" />
        </h1>
      </div>
    </div>
  )
}
