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
      expect.objectContaining({
        endpoint: name,
        outcome: "rejected",
        reason: "gone:moved-to-onfire",
        data: { name: "Stale Tab", phone: null, email: "stale@example.test", event: null },
      })
    )
  })

  it("logs only recontact fields, never medical or free-text ones", async () => {
    logSubmission.mockClear()
    const { POST } = await load(name)
    await POST(
      new NextRequest(`http://localhost/api/${name}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          surname: "Child",
          firstName: "Test",
          parentName: "Parent Test",
          phone: "+37100000000",
          email: "parent@example.test",
          allergies: "peanuts",
          personalCode: "000000-00000",
          characterTraits: "x".repeat(50_000),
          comment: "free text",
          event: "narnia-2027",
        }),
      })
    )
    const entry = (logSubmission.mock.calls[0] as unknown as [{ data: unknown }])[0]
    expect(entry.data).toEqual({
      name: "Parent Test",
      phone: "+37100000000",
      email: "parent@example.test",
      event: "narnia-2027",
    })
    expect(JSON.stringify(entry)).not.toMatch(/peanuts|000000-00000|free text|xxxx/)
  })

  it("does not log a body without any contact field", async () => {
    logSubmission.mockClear()
    const { POST } = await load(name)
    await POST(
      new NextRequest(`http://localhost/api/${name}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ allergies: "peanuts" }),
      })
    )
    expect(logSubmission).not.toHaveBeenCalled()
  })

  it("answers 410 for an empty body without logging", async () => {
    logSubmission.mockClear()
    const { POST } = await load(name)
    const res = await POST(new NextRequest(`http://localhost/api/${name}`, { method: "POST" }))
    expect(res.status).toBe(410)
    expect(logSubmission).not.toHaveBeenCalled()
  })
})
