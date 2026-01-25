"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import the ExactChatbotScript with no SSR
const ExactChatbotScript = dynamic(() => import("@/components/exact-chatbot-script"), {
  ssr: false,
})

export default function ChatbotWrapper() {
  // Use state to ensure this only runs on the client
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <ExactChatbotScript />
}
