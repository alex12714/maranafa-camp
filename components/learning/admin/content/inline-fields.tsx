"use client"

/**
 * The two inputs the content editor is built from, and the one rule they share:
 * SAVE ON BLUR, NEVER ON KEYSTROKE.
 *
 * Every write here is a round trip that re-reads the whole subtree, so saving
 * per character would be both slow and wrong — a `code` is invalid at almost
 * every intermediate keystroke, and a PUT translation is a REPLACE, so a
 * half-typed prompt briefly becomes the stored prompt. Blur is the moment the
 * author has finished the thought.
 *
 * A field that has not changed does not write at all. That matters more than it
 * sounds: tabbing through a module to read it would otherwise rewrite every
 * translation row it passed, and each rewrite is a real edit to content
 * somebody's certificate may later be issued against.
 *
 * The value is CONTROLLED FROM THE SERVER between edits — when a reload brings
 * back a different value (another director, or the server normalising
 * something) the field follows it, unless the author is typing in it right now.
 */

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface CommonProps {
  label: string
  value: string | null
  onSave: (next: string | null) => Promise<void>
  placeholder?: string
  disabled?: boolean
  /** Rendered under the field — the reason the value has to look a certain way. */
  hint?: string
  /** Blank is not allowed (a `code`); an emptied field snaps back instead of saving. */
  required?: boolean
}

function useInlineValue(value: string | null, focused: boolean) {
  const [draft, setDraft] = useState(value ?? "")
  useEffect(() => {
    // Do not yank the text out from under someone mid-sentence.
    if (!focused) setDraft(value ?? "")
  }, [value, focused])
  return [draft, setDraft] as const
}

function useSaver(
  value: string | null,
  onSave: (next: string | null) => Promise<void>,
  required: boolean,
) {
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)

  async function commit(draft: string, reset: (s: string) => void) {
    const next = draft.trim() === "" ? null : draft
    if (next === (value ?? null)) return
    if (required && next === null) {
      reset(value ?? "")
      return
    }
    setSaving(true)
    setFailed(false)
    try {
      await onSave(next)
    } catch {
      // The parent surfaces the sentence; this just stops the field from
      // claiming a save that did not happen.
      setFailed(true)
      reset(value ?? "")
    } finally {
      setSaving(false)
    }
  }

  return { saving, failed, commit }
}

const FIELD_CLASS =
  "w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 disabled:bg-gray-50 disabled:text-gray-500"

function Frame({
  label,
  saving,
  failed,
  hint,
  children,
}: {
  label: string
  saving: boolean
  failed: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
          {label}
        </span>
        {saving && <Loader2 className="h-3 w-3 animate-spin text-gray-400" />}
        {failed && (
          <span role="alert" className="text-[11px] font-medium text-red-600">
            ×
          </span>
        )}
      </div>
      {children}
      {hint && <p className="text-[11px] leading-relaxed text-gray-400">{hint}</p>}
    </div>
  )
}

export function InlineText({
  label,
  value,
  onSave,
  placeholder,
  disabled,
  hint,
  required = false,
  mono = false,
}: CommonProps & { mono?: boolean }) {
  const focused = useRef(false)
  const [draft, setDraft] = useInlineValue(value, focused.current)
  const { saving, failed, commit } = useSaver(value, onSave, required)

  return (
    <Frame label={label} saving={saving} failed={failed} hint={hint}>
      <input
        type="text"
        value={draft}
        disabled={disabled || saving}
        placeholder={placeholder}
        onFocus={() => {
          focused.current = true
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          focused.current = false
          void commit(draft, setDraft)
        }}
        className={`${FIELD_CLASS} ${mono ? "font-mono text-xs" : ""}`}
      />
    </Frame>
  )
}

export function InlineTextarea({
  label,
  value,
  onSave,
  placeholder,
  disabled,
  hint,
  rows = 3,
}: CommonProps & { rows?: number }) {
  const focused = useRef(false)
  const [draft, setDraft] = useInlineValue(value, focused.current)
  const { saving, failed, commit } = useSaver(value, onSave, false)

  return (
    <Frame label={label} saving={saving} failed={failed} hint={hint}>
      <textarea
        value={draft}
        rows={rows}
        disabled={disabled || saving}
        placeholder={placeholder}
        onFocus={() => {
          focused.current = true
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          focused.current = false
          void commit(draft, setDraft)
        }}
        className={`${FIELD_CLASS} resize-y leading-relaxed`}
      />
    </Frame>
  )
}
