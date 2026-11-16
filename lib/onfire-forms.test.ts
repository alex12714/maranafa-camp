import { describe, expect, it, vi } from "vitest"
import { buildFormHref, getOnFireFormUrl, normalizeFormUrl } from "@/lib/onfire-forms"

describe("normalizeFormUrl", () => {
  it("accepts a forms.onfire.so URL and drops query and hash", () => {
    expect(normalizeFormUrl("https://forms.onfire.so/maranafa-camp-2027?embed=1#x")).toBe(
      "https://forms.onfire.so/maranafa-camp-2027"
    )
    expect(normalizeFormUrl(" https://forms.onfire.so/abc/ ")).toBe("https://forms.onfire.so/abc")
  })

  it("accepts a bare slug", () => {
    expect(normalizeFormUrl("maranafa-friends-acw")).toBe("https://forms.onfire.so/maranafa-friends-acw")
  })

  it("treats empty or missing values as not configured", () => {
    expect(normalizeFormUrl("")).toBeNull()
    expect(normalizeFormUrl("   ")).toBeNull()
    expect(normalizeFormUrl(undefined)).toBeNull()
    expect(normalizeFormUrl(null)).toBeNull()
  })

  it("rejects anything that is not a forms.onfire.so form", () => {
    expect(normalizeFormUrl("http://forms.onfire.so/abc")).toBeNull()
    expect(normalizeFormUrl("https://evil.example/abc")).toBeNull()
    expect(normalizeFormUrl("https://forms.onfire.so.evil.example/abc")).toBeNull()
    expect(normalizeFormUrl("https://forms.onfire.so/")).toBeNull()
    expect(normalizeFormUrl("https://forms.onfire.so/a/b")).toBeNull()
    expect(normalizeFormUrl("javascript:alert(1)")).toBeNull()
  })
})

describe("getOnFireFormUrl", () => {
  it("returns null for an unconfigured form (fallback) and the URL for a configured one", () => {
    const config = { camp: "", rosetto: "https://forms.onfire.so/rosetto-pre" }
    expect(getOnFireFormUrl("camp", config)).toBeNull()
    expect(getOnFireFormUrl("dawn-treader", config)).toBeNull()
    expect(getOnFireFormUrl("rosetto", config)).toBe("https://forms.onfire.so/rosetto-pre")
  })

  it("ships the known Friends form and leaves the not-yet-created forms empty", () => {
    expect(getOnFireFormUrl("friends-nov-2026")).toBe("https://forms.onfire.so/maranafa-friends-acw")
    for (const key of ["camp", "narnia-2027", "rosetto", "dawn-treader", "conference"] as const) {
      expect(getOnFireFormUrl(key)).toBeNull()
    }
  })

  it("reads NEXT_PUBLIC_ONFIRE_FORM_* overrides", async () => {
    vi.stubEnv("NEXT_PUBLIC_ONFIRE_FORM_CAMP", "https://forms.onfire.so/camp-2027")
    vi.resetModules()
    const mod = await import("@/lib/onfire-forms")
    expect(mod.getOnFireFormUrl("camp")).toBe("https://forms.onfire.so/camp-2027")
  })
})

describe("buildFormHref", () => {
  const url = "https://forms.onfire.so/camp-2027"

  it("adds embed=1 and the language for the iframe", () => {
    const href = new URL(buildFormHref(url, "lv", { embed: true }))
    expect(href.origin + href.pathname).toBe(url)
    expect(href.searchParams.get("embed")).toBe("1")
    expect(href.searchParams.get("lang")).toBe("lv")
  })

  it("omits embed for the open-in-new-window link", () => {
    expect(buildFormHref(url, "uk")).toBe(`${url}?lang=uk`)
  })

  it("ignores a malformed language", () => {
    expect(buildFormHref(url, "ru-RU")).toBe(url)
    expect(buildFormHref(url, null)).toBe(url)
  })
})
