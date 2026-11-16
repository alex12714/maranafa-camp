// Durable, append-only log of every registration attempt, written to a
// host-mounted volume (see docker-compose.yml: /app/logs) so a real person's
// failed or partial submission survives deploys and can be recovered.
//
// PII notice: rejected/bot/error entries include submitted data so staff can
// follow up (the retired registration routes keep contact fields only; see
// lib/registration-gone.ts). Entries are capped at MAX_ENTRY_BYTES and the
// file stops growing at MAX_FILE_BYTES. Keep retention short (rotate/purge the JSONL file
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

/** Largest single line written; a bigger entry keeps its metadata but loses `data`. */
export const MAX_ENTRY_BYTES = 20 * 1024
/** Above this the log stops growing (a warning is printed instead) so it cannot fill the disk. */
export const MAX_FILE_BYTES = 50 * 1024 * 1024

// Append one JSON line. Never throws — logging must not break a registration.
export async function logSubmission(entry: LogInput): Promise<void> {
  try {
    const ts = new Date().toISOString()
    let line = JSON.stringify({ ts, ...entry }) + "\n"
    if (Buffer.byteLength(line, "utf8") > MAX_ENTRY_BYTES) {
      const trimmed = {
        ...entry,
        ua: entry.ua?.slice(0, 300),
        reason: entry.reason?.slice(0, 300),
        recordId: entry.recordId?.slice(0, 300),
        data: null,
        truncated: true,
      }
      line = JSON.stringify({ ts, ...trimmed }) + "\n"
    }

    await fs.mkdir(LOG_DIR, { recursive: true })
    const size = await fs.stat(LOG_FILE).then((s) => s.size, () => 0)
    if (size + Buffer.byteLength(line, "utf8") > MAX_FILE_BYTES) {
      // No personal data in the warning: endpoint and outcome only.
      console.warn(
        `submission-log: ${LOG_FILE} is over ${MAX_FILE_BYTES} bytes; not logging ${entry.endpoint}/${entry.outcome}. Rotate the file.`
      )
      return
    }
    await fs.appendFile(LOG_FILE, line, "utf8")
  } catch (err) {
    console.error("submission-log write failed:", err)
  }
}
