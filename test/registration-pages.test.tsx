import { readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import CampRegisterPage from "@/app/camp/register/page"
import Narnia2027Page from "@/app/narnia-2027/page"
import DawnTreaderPage from "@/app/dawn-treader/page"
import RosettoProgrammePage from "@/app/rosetto/programme/page"
import FriendsPage from "@/app/maranafa-friends-nov-2026/friends-page-client"

const ROOT = path.resolve(__dirname, "..")

function renderNoFetch(ui: React.ReactElement) {
  const fetchSpy = vi.fn()
  vi.stubGlobal("fetch", fetchSpy)
  const result = render(ui)
  expect(fetchSpy).not.toHaveBeenCalled()
  return result
}

describe("registration pages embed OnFire forms", () => {
  // Live forms embed their OnFire iframe; the site builds no form of its own.
  it.each([
    ["camp register", CampRegisterPage, "https://forms.onfire.so/2027-lis"],
    ["narnia 2027", Narnia2027Page, "https://forms.onfire.so/2027-xhy"],
    ["rosetto programme", RosettoProgrammePage, "https://forms.onfire.so/rosetto-cza"],
  ])("%s embeds its OnFire form and no site-built form", (_name, Page, url) => {
    const { container } = renderNoFetch(<Page />)
    const iframe = container.querySelector("iframe")
    expect(iframe).not.toBeNull()
    const src = new URL(iframe!.getAttribute("src")!)
    expect(src.origin + src.pathname).toBe(url)
    expect(src.searchParams.get("embed")).toBe("1")
    expect(screen.queryByTestId("onfire-form-fallback")).toBeNull()
    expect(container.querySelector("form")).toBeNull()
  })

  // The Dawn Treader trip is over: no form URL, so the "opens soon" fallback shows.
  it("dawn treader shows the fallback and no site-built form", () => {
    const { container } = renderNoFetch(<DawnTreaderPage />)
    expect(screen.getByTestId("onfire-form-fallback")).toBeTruthy()
    expect(container.querySelector("iframe")).toBeNull()
    expect(container.querySelector("form")).toBeNull()
  })

  it("friends page embeds its existing OnFire form", () => {
    const { container } = renderNoFetch(
      <FriendsPage
        data={{
          title: null,
          date: "13 – 15 ноября 2026",
          weekdays: "Пятница – воскресенье",
          times: null,
          place: "Rīga",
          cover: null,
          description: null,
          price: null,
        }}
      />
    )
    const iframe = container.querySelector("#register iframe")
    expect(iframe?.getAttribute("src")).toBe("https://forms.onfire.so/maranafa-friends-acw?embed=1&lang=ru")
    expect(container.querySelector("form")).toBeNull()
  })
})

describe("nothing on the site posts registrations to the retired routes", () => {
  function sourceFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const p = path.join(dir, name)
      if (statSync(p).isDirectory()) return sourceFiles(p)
      return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [p] : []
    })
  }

  it("has no client code calling /api/*-register", () => {
    const offenders = ["app", "components", "lib", "contexts"]
      .flatMap((d) => sourceFiles(path.join(ROOT, d)))
      .filter((f) =>
        /\/api\/(camp|event|conference|rosetto|dawn-treader)-register/.test(readFileSync(f, "utf8"))
      )
      .map((f) => path.relative(ROOT, f))
    expect(offenders).toEqual([])
  })

  it("has no AirTable write left in the registration routes or payment webhooks", () => {
    const routes = [
      "app/api/camp-register/route.ts",
      "app/api/event-register/route.ts",
      "app/api/conference-register/route.ts",
      "app/api/rosetto-register/route.ts",
      "app/api/dawn-treader-register/route.ts",
      "app/api/merch/webhook/route.ts",
      "app/api/rental/webhook/route.ts",
      "lib/website-payment.ts",
      "lib/registration-gone.ts",
    ]
    for (const r of routes) {
      expect(readFileSync(path.join(ROOT, r), "utf8"), r).not.toMatch(/airtable\.com|AIRTABLE_API_KEY/i)
    }
  })
})
