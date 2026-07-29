"use client"

import { useState } from "react"

// OnFire Messenger (onfire.so) has no public share-intent URL like t.me/share,
// so this pill uses the Web Share API — on mobile the native share sheet opens
// with OnFire in it when the app is installed. Desktops copy the link instead.
const ONFIRE_LOGO =
  "data:image/png;base64,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"

export function OnFireShareButton({
  url,
  title,
  copiedLabel,
}: {
  url: string
  title: string
  copiedLabel: string
}) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ url, title })
        return
      } catch {
        // the user closed the sheet — nothing to do
        return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — leave the label as is
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      title="OnFire"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-medium transition-colors bg-[#FF6B1F] hover:bg-[#e55a10]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ONFIRE_LOGO} alt="" className="w-4 h-4 rounded" />
      {copied ? copiedLabel : "OnFire"}
    </button>
  )
}
