import LegalPage from "@/components/legal-page"
import { privacyContent } from "@/lib/legal-content"

export const metadata = {
  title: "Privacy Policy | Maranafa",
  description: "How Maranafa collects and processes personal data in the camp app.",
}

export default function PrivacyPage() {
  return <LegalPage doc={privacyContent} />
}
