// Durable, append-only log of every registration attempt, written to a
// host-mounted volume (see docker-compose.yml: /app/logs) so a real person's
// failed or partial submission survives deploys and can be recovered.
//
// PII notice: rejected/bot/error entries include the raw submitted body so
// staff can follow up. Keep retention short (rotate/purge the JSONL file
// periodically) — consent covers the AirTable record, not an indefinite log.
import { promises as fs } from "fs"
import path from "path"

const LOG_DIR = process.env.SUBMISSION_LOG_DIR || "/app/logs"
const LOG_FILE = path.join(LOG_DIR, "registrations.jsonl")

type Outcome = "saved" | "rejected" | "bot" | "error"

type LogInput = {
  endpoint: string
  outcome: Outcome
  reason?: string
  recordId?: string
  ip?: string
  ua?: string
  data?: unknown
}

// Extract client IP + user-agent from the request (behind Traefik → x-forwarded-for).
export function clientMeta(req: Request): { ip: string; ua: string } {
  const xff = req.headers.get("x-forwarded-for") || ""
  const ip = xff.split(",")[0].trim() || req.headers.get("x-real-ip") || ""
  const ua = req.headers.get("user-agent") || ""
  return { ip, ua }
}

// Append one JSON line. Never throws — logging must not break a registration.
export async function logSubmission(entry: LogInput): Promise<void> {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true })
    const line = JSON.stringify({ ts: new Date().toISOString(), ...entry }) + "\n"
    await fs.appendFile(LOG_FILE, line, "utf8")
  } catch (err) {
    console.error("submission-log write failed:", err)
  }
}
