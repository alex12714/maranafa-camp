// @vitest-environment node
import { describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const logSubmission = vi.hoisted(() => vi.fn(async () => {}))
vi.mock("@/lib/submission-log", () => ({
  logSubmission,
  clientMeta: () => ({ ip: "", ua: "" }),
}))

const ROUTES = [
  "camp-register",
  "event-register",
  "conference-register",
  "rosetto-register",
  "dawn-treader-register",
] as const

async function load(name: (typeof ROUTES)[number]) {
  switch (name) {
    case "camp-register":
      return import("@/app/api/camp-register/route")
    case "event-register":
      return import("@/app/api/event-register/route")
    case "conference-register":
      return import("@/app/api/conference-register/route")
    case "rosetto-register":
      return import("@/app/api/rosetto-register/route")
    case "dawn-treader-register":
      return import("@/app/api/dawn-treader-register/route")
  }
}

describe.each(ROUTES)("/api/%s", (name) => {
  it("answers 410 Gone, writes nowhere but the local log", async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal("fetch", fetchSpy)
    logSubmission.mockClear()
    const { POST } = await load(name)
    const res = await POST(
      new NextRequest(`http://localhost/api/${name}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Stale Tab", email: "stale@example.test" }),
      })
    )
    expect(res.status).toBe(410)
    expect(await res.json()).toMatchObject({ code: "gone" })
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(logSubmission).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: name, outcome: "rejected", reason: "gone:moved-to-onfire" })
    )
  })

  it("answers 410 for an empty body without logging", async () => {
    logSubmission.mockClear()
    const { POST } = await load(name)
    const res = await POST(new NextRequest(`http://localhost/api/${name}`, { method: "POST" }))
    expect(res.status).toBe(410)
    expect(logSubmission).not.toHaveBeenCalled()
  })
})
