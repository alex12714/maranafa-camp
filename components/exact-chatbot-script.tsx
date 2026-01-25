"use client"

import { useEffect } from "react"

export default function ExactChatbotScript() {
  useEffect(() => {
    // Remove any existing chatbot scripts to avoid duplicates
    const existingScript = document.getElementById("vectorshift-chat-widget")
    if (existingScript) {
      existingScript.remove()
    }

    // Create script element with exact attributes as in the original tag
    const script = document.createElement("script")
    script.id = "vectorshift-chat-widget"
    script.src = "https://app.vectorshift.ai/chatWidget.js"
    script.async = true

    // Use the exact attribute names from the original script
    script.setAttribute("chatbot-id", "6820c9ca4a796326a91a0b5d")
    script.setAttribute("chatbot-height", "600px")
    script.setAttribute("chatbot-width", "400px")

    // Add error handling
    script.onerror = (error) => {
      console.error("Error loading chatbot script:", error)
    }

    // Append to document body
    document.body.appendChild(script)

    // Cleanup function
    return () => {
      // Remove the script when component unmounts
      const scriptToRemove = document.getElementById("vectorshift-chat-widget")
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, []) // Empty dependency array ensures this runs once on mount

  // This component doesn't render anything visible
  return null
}
