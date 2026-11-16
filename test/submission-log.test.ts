// @vitest-environment node
import { mkdirSync, readFileSync, rmSync, truncateSync, writeFileSync } from "node:fs"
import path from "node:path"
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest"

// LOG_DIR is read at import time, so point it at a temp dir first.
const dir = vi.hoisted(() => {
  const d = `${(process.env.TMPDIR || "/tmp").replace(/\/+$/, "")}/submission-log-test-${process.pid}`
  process.env.SUBMISSION_LOG_DIR = d
  return d
})

import { logSubmission, MAX_ENTRY_BYTES, MAX_FILE_BYTES } from "@/lib/submission-log"

const file = path.join(dir, "registrations.jsonl")
const lines = () => readFileSync(file, "utf8").trim().split("\n").filter(Boolean)

beforeEach(() => {
  mkdirSync(dir, { recursive: true })
  writeFileSync(file, "")
})

afterAll(() => rmSync(dir, { recursive: true, force: true }))

describe("logSubmission", () => {
  it("appends one JSON line with a timestamp", async () => {
    await logSubmission({ endpoint: "x", outcome: "rejected", data: { email: "a@example.test" } })
    const [line] = lines()
    const entry = JSON.parse(line)
    expect(entry).toMatchObject({ endpoint: "x", outcome: "rejected", data: { email: "a@example.test" } })
    expect(typeof entry.ts).toBe("string")
  })

  it("drops the data of an entry over the size cap but keeps its metadata", async () => {
    await logSubmission({ endpoint: "x", outcome: "error", reason: "r", data: { blob: "y".repeat(MAX_ENTRY_BYTES * 2) } })
    const [line] = lines()
    expect(Buffer.byteLength(line + "\n")).toBeLessThanOrEqual(MAX_ENTRY_BYTES)
    expect(JSON.parse(line)).toMatchObject({ endpoint: "x", outcome: "error", reason: "r", data: null, truncated: true })
  })

  it("stops appending above the file cap and warns without personal data", async () => {
    truncateSync(file, MAX_FILE_BYTES) // sparse file at the cap
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    await logSubmission({ endpoint: "x", outcome: "rejected", data: { email: "secret@example.test" } })
    expect(readFileSync(file).byteLength).toBe(MAX_FILE_BYTES)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).not.toContain("secret@example.test")
  })
})
