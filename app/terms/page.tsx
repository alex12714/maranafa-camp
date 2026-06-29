import LegalPage from "@/components/legal-page"
import { termsContent } from "@/lib/legal-content"

export const metadata = {
  title: "Terms of Service | Maranafa",
  description: "Terms governing use of the Maranafa camp app and services.",
}

export default function TermsPage() {
  return <LegalPage doc={termsContent} />
}
