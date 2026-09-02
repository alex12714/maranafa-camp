"use client"

/**
 * `swipe_binary` — a swipe is a shortcut, never the only way in.
 *
 * THE CHOICE IS A RADIO GROUP. Underneath the card are two ordinary radios
 * carrying the same two options, always rendered, always focusable, never
 * conditional on pointer support: keyboard, switch control and screen-reader
 * users get "Влево — <label>, radio button, 1 of 2" and answer the question
 * exactly the way they answer a `single_choice` one. The card above them is a
 * convenience layered on top, `aria-hidden` because it says nothing the radios
 * do not, and removing it would leave a complete, answerable question.
 *
 * DIRECTION IS NEVER THE MESSAGE. `sort 0` is left and `sort 1` is right — that
 * is the content contract (there is no `interaction_config`) — but "left" is
 * only ever shown next to the option's own words. A learner who cannot see the
 * card, cannot perceive the arrow, or does not share the author's intuition
 * about which way "yes" lives still reads the label and chooses by it.
 *
 * WHAT IS SUBMITTED IS AN OPTION ID. The drag resolves to `left.id` or
 * `right.id` and that is what goes to `onSelect`; no coordinate, offset or
 * direction string ever reaches the API, and the submitted payload from a swipe
 * is byte-identical to the one from a keyboard press.
 *
 * A HESITANT SWIPE COMMITS NOTHING. The card follows the finger, but the answer
 * is only taken when the release is past a real threshold — a quarter of the
 * card's width, and never less than 56px. Anything shorter, and any cancelled
 * pointer (a scroll taking over, a call arriving, the finger leaving the
 * screen), returns the card home and selects nothing.
 *
 * NOTHING HERE KNOWS WHICH OPTION IS RIGHT.
 */

import { useEffect, useRef, useState, type PointerEvent } from "react"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

import { SingleChoiceRenderer } from "@/components/learning/single-choice"
import type { QuestionRendererProps } from "@/components/learning/renderer-types"
import type { LearningOption } from "@/lib/portal-learning"
import { TranslatedText } from "@/components/translated-text"

/** Commit at a quarter of the card, floored at a distance a thumb cannot slip. */
const COMMIT_RATIO = 0.25
const MIN_COMMIT_PX = 56
/** How far the card is allowed to travel, so it never leaves its own row. */
const MAX_DRAG_PX = 140
/** Fallback width when the card has not been measured yet. */
const ASSUMED_CARD_PX = 320

export function SwipeBinaryRenderer(props: QuestionRendererProps) {
  const { question, selected, onSelect, disabled } = props
  const options = [...question.options].sort((a, b) => a.sort - b.sort)

  // Without exactly two options there is no left and no right. Fall back to the
  // vertical radio list, which renders any number of them: a learner must never
  // be handed a question they cannot answer because the content surprised us.
  if (options.length !== 2) return <SingleChoiceRenderer {...props} />

  return (
    <SwipeBinary
      question={question}
      left={options[0]}
      right={options[1]}
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
    />
  )
}

function SwipeBinary({
  question,
  left,
  right,
  selected,
  onSelect,
  disabled,
}: {
  question: QuestionRendererProps["question"]
  left: LearningOption
  right: LearningOption
  selected: string[]
  onSelect: (optionIds: string[]) => void
  disabled: boolean
}) {
  const reducedMotion = usePrefersReducedMotion()
  const chosen = selected[0] ?? null

  const cardRef = useRef<HTMLDivElement | null>(null)
  const pointerIdRef = useRef<number | null>(null)
  const startXRef = useRef(0)
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)

  // A drag in flight belongs to the question that started it. If the runner
  // swaps in a new item — or locks the controls mid-gesture — the card goes
  // home and nothing is chosen on its way out.
  useEffect(() => {
    pointerIdRef.current = null
    setDrag(0)
    setDragging(false)
  }, [question.id, disabled])

  /** How far the card must travel before a release counts as an answer. */
  function commitDistance(): number {
    const width = cardRef.current?.offsetWidth ?? ASSUMED_CARD_PX
    return Math.max(MIN_COMMIT_PX, width * COMMIT_RATIO)
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled || pointerIdRef.current !== null) return
    // Right-click and middle-click are not gestures.
    if (event.pointerType === "mouse" && event.button !== 0) return
    pointerIdRef.current = event.pointerId
    startXRef.current = event.clientX
    setDragging(true)
    // Capture so the gesture survives the finger leaving the card's box; the
    // matching release arrives as pointerup or pointercancel either way.
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Capture is a nicety. Without it the pointer leaving the element fires
      // pointercancel, which cancels the swipe — the safe direction to fail.
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return
    const dx = event.clientX - startXRef.current
    setDrag(Math.max(-MAX_DRAG_PX, Math.min(MAX_DRAG_PX, dx)))
  }

  /**
   * End the gesture. `dx` is the raw travel; anything short of the threshold
   * (and every cancellation, which passes 0) selects NOTHING.
   */
  function release(dx: number) {
    pointerIdRef.current = null
    setDragging(false)
    // The card always returns home. What persists is the selection, and the
    // learner reads that off the radios below, not off where the card stopped.
    setDrag(0)
    if (Math.abs(dx) >= commitDistance()) {
      onSelect([dx < 0 ? left.id : right.id])
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return
    release(event.clientX - startXRef.current)
  }

  function handlePointerCancel(event: PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return
    release(0)
  }

  // Past the threshold the card names the option it would take. Never the tint
  // alone — the side's label is what grows bold.
  const past = Math.abs(drag) >= commitDistance()
  const armed = past ? (drag < 0 ? left.id : right.id) : null

  return (
    <div className="space-y-3">
      {/* The card. Decoration for the pointer, hidden from the accessibility
          tree, and not a tab stop: everything it offers is on the radios. */}
      <div
        aria-hidden
        className="select-none overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3"
      >
        <div
          ref={cardRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          style={{
            // pan-y keeps the page scrollable under a vertical drag; the
            // horizontal axis is ours.
            touchAction: "pan-y",
            transform: `translateX(${drag}px)${
              reducedMotion ? "" : ` rotate(${drag / 28}deg)`
            }`,
            transition:
              dragging || reducedMotion ? "none" : "transform 200ms ease-out",
          }}
          className={`flex items-center justify-between gap-3 rounded-lg border-2 bg-white px-3 py-4 ${
            disabled ? "cursor-not-allowed opacity-60" : "cursor-grab active:cursor-grabbing"
          } ${armed ? "border-gray-900" : "border-gray-200"}`}
        >
          <SwipeEdge
            option={left}
            side="left"
            armed={armed === left.id}
            chosen={chosen === left.id}
          />
          <p className="min-w-0 shrink px-1 text-center text-xs font-medium leading-snug text-gray-500">
            <TranslatedText text="Проведите карточку влево или вправо — или выберите вариант кнопкой." />
          </p>
          <SwipeEdge
            option={right}
            side="right"
            armed={armed === right.id}
            chosen={chosen === right.id}
          />
        </div>
      </div>

      {/* The actual control. Always here, whether or not the card above was
          ever touched, and identical in every way that reaches the API. */}
      <div className="grid grid-cols-2 gap-3" role="radiogroup">
        <DirectionOption
          question={question}
          option={left}
          side="left"
          chosen={chosen === left.id}
          disabled={disabled}
          onSelect={onSelect}
        />
        <DirectionOption
          question={question}
          option={right}
          side="right"
          chosen={chosen === right.id}
          disabled={disabled}
          onSelect={onSelect}
        />
      </div>
    </div>
  )
}

/** One end of the card: the direction, and the option's own words beside it. */
function SwipeEdge({
  option,
  side,
  armed,
  chosen,
}: {
  option: LearningOption
  side: "left" | "right"
  armed: boolean
  chosen: boolean
}) {
  const Arrow = side === "left" ? ArrowLeft : ArrowRight
  return (
    <span
      className={`flex min-w-0 flex-1 items-center gap-1.5 text-xs ${
        side === "left" ? "justify-start text-left" : "justify-end text-right"
      } ${armed || chosen ? "font-bold text-gray-900" : "font-medium text-gray-400"}`}
    >
      {side === "left" && <Arrow className="h-4 w-4 shrink-0" />}
      <span className="min-w-0 break-words">{option.label ?? option.code}</span>
      {side === "right" && <Arrow className="h-4 w-4 shrink-0" />}
    </span>
  )
}

/**
 * One of the two real choices: a native radio, labelled with the option's text
 * and — secondary, never on its own — the direction that reaches the same
 * answer by swipe.
 */
function DirectionOption({
  question,
  option,
  side,
  chosen,
  disabled,
  onSelect,
}: {
  question: QuestionRendererProps["question"]
  option: LearningOption
  side: "left" | "right"
  chosen: boolean
  disabled: boolean
  onSelect: (optionIds: string[]) => void
}) {
  const id = `option-${option.id}`
  const Arrow = side === "left" ? ArrowLeft : ArrowRight

  return (
    <div className="relative">
      <input
        type="radio"
        id={id}
        name={`question-${question.id}`}
        className="peer sr-only"
        value={option.id}
        checked={chosen}
        disabled={disabled}
        onChange={() => onSelect([option.id])}
      />
      <label
        htmlFor={id}
        className={`flex h-full min-h-[5rem] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border px-3 py-4 text-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gray-900 peer-focus-visible:ring-offset-2 ${
          chosen
            ? "border-gray-900 bg-gray-50"
            : "border-gray-200 bg-white hover:bg-gray-50"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <span
          aria-hidden
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            chosen ? "border-gray-900 bg-gray-900" : "border-gray-300"
          }`}
        >
          {chosen && <Check className="h-3 w-3 text-white" />}
        </span>
        {/* The direction, announced with the label rather than instead of it. */}
        <span className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
          <Arrow className="h-3 w-3" aria-hidden />
          <TranslatedText text={side === "left" ? "Влево" : "Вправо"} />
        </span>
        <span className="min-w-0 text-base font-semibold text-gray-900">
          {/* The label arrives already localized by the API. */}
          {option.label ?? option.code}
        </span>
        {option.audio?.transcript && (
          <span className="min-w-0 text-xs font-normal text-gray-500">
            {option.audio.transcript}
          </span>
        )}
      </label>
    </div>
  )
}

/**
 * `prefers-reduced-motion`, read live.
 *
 * Starts false so the server and the first client render agree, then corrects
 * on mount. It gates the card's tilt and its snap-back transition; the drag
 * itself is direct manipulation — the card under the finger is not animation —
 * and stays.
 */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return reduced
}