"use client"

import { useState } from "react"

// OnFire Messenger (onfire.so) has no public share-intent URL like t.me/share,
// so this pill uses the Web Share API — on mobile the native share sheet opens
// with OnFire in it when the app is installed. Desktops copy the link instead.
const ONFIRE_LOGO =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAoCAYAAACfKfiZAAAEmUlEQVR4nLVYTYiVZRR+3u+7M1bWjJqJlT+FQ4hpi6IinGoTbkwoIQhRJAvaFEQI7VoGrVq0aSNuWtSiRZGb/sCQoIiohKgkhCKT8Yc0rRnv3PvEmfscO37z3u/eb2Y68PLdef/OOc/5fQdYBJFMJFvh76LpHWkRzEv7pJS6JB8HMAPgM59b6L1DEckRfdeQPMQe/UJyLCLyfzPfSvI7MTcUPiW5guSyJve1GjJvpZTaJO8D8D6A2wFMA7gOwGnb0tSsRQPmtte0nQDwnpjPAphDBMDfAMz2jexfNETrBgCHAGwU84jgqBDAkgtAciSldAXAiwAeyTA3Wi8hFhxZdbFektxM8hzJjpzOyX+fk2OO2hksIQIt2XU/gFUZR7PfHa09AaAd/GLxRHKE5K0kT0hbQ6BKXY0pktvMYZckH7B3kY2dgUk/csG+IHmzzNZqbAL+Z/MU1i3u04AQK2SKhwC8A2Cl/T1IiKKqcUrJcnnHvgBKefZdGI5KRchjAD4EsCmlNGuOOVAAqriQvJfkmyTXyeEsy63B8NSSEA8C+JjkpIVwnRBzpPC5keQx2XK3waeC87nmTJthyfdeIPmk80AOAZKlEo2V1e3SwGiZUDDbNqVS58bMJ0g+lUOi8C9Jg3qPGHradcf6s4YRa5yz1JoxPUzyYcsTMvdVxkmX3CntndYG7X+rESBGS04QV2I5gLcArA58UWjYwW3KZp0QerZmG38KzKLmRlMAfg3MmClKHh1bADxrJd1rSaFLbWyuXGyhtE5rP6jcOoO47wyAlwC8DOCTcF9VCD+73xw7ThaSZkMFMoPqBQDmnL8DOF6B2ZG7W3niAwCvAHgVwD8VIX0/pOgDhojlHZ8cEfyoXP48gAMATgH4KGNfZ7BbndF5AG8DeA15cvPeL5TKVnAiiwJUbG3fN4TO1spa1OoemetbpWBLxebxO8S0rJydUGR0W0ETs3Ek32yHD2aY+h7PlivkaBf1PSIBcr3BuFCfaYU47hdqvh7DzamruRMATkqrK5q7kEHMqePOWoRG8sc+B+ZslWFOzU3J+c7rnlJCTAQhq3TW/aEIWnwvqWOoDSI7+zqAr0L6bstn9vXpnox+dsULPaMoCI/VSF3VPonpcfnP5ZTSjJzxsDpnRykiZnu+8XAvgtTT8t5hHhfenJjN9yqEJ0ha3jgKYDIgG9Ey+tLNffUNqS7I3nUbSR5ZQOk9o7Jbbc9y5fk5kivnlWb2+oFbSD5K8lQDIWKfONuHuVVASrk7SI7Pe8qzh4I1JLeR3EvyYkMh+jWs7fB63q4GJ98dsdcB2wt3A8lnSJ7W4U4fzeqoE4Q/SXKXlFte+3BhryNeJSF2hXbMNXWYu5nhTCMaR0nuILlefnYN9CkjgGe8mzSsKu4E8LQq37BkJfxdVcmzStEWqte0d6kGCS9QY/quVRmdVGOxOrRtlg8uAfhDIWah9rX+ZzAt5tO5f92kOhWEhtWL68VsNBSecc2VyiOXlEn/EtO2EpT1BrN6Z8yjNAyWEsQfKdYpWyXzbsrJa4oxtlpgwx84fanxWz74SE6Auco5iGmkfwERWJDqng2QcgAAAABJRU5ErkJggg=="

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
      <img src={ONFIRE_LOGO} alt="" className="h-4 w-auto" />
      {copied ? copiedLabel : "OnFire"}
    </button>
  )
}
