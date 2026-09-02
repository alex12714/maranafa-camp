/**
 * The contract every question renderer implements.
 *
 * ONE RUNNER, SMALL RENDERERS. `AssessmentRunner` owns the whole state machine
 * — loading, submitting, the verdict, remediation, progress — and a renderer
 * owns exactly one thing: turning a question into controls and reporting which
 * options are selected. A renderer never fetches, never scores, never advances.
 *
 * `single_choice` is the only one built so far; `yes_no`, `multi_select` and
 * `swipe_binary` are a later bead and drop in beside it by adding one entry to
 * the registry in `question-renderer.tsx`.
 *
 * SELECTION IS ALWAYS A LIST, even for the three renderers that record exactly
 * one id, because the API takes one answer shape (`selected_option_ids`) for
 * all four. Per-renderer cardinality is enforced server-side.
 */

import type { LearningQuestion } from "@/lib/portal-learning"

export interface QuestionRendererProps {
  question: LearningQuestion
  /** Currently selected option ids. */
  selected: string[]
  /** Report a new selection. Never call while `disabled`. */
  onSelect: (optionIds: string[]) => void
  /** True while a response is in flight, or once the item is locked. */
  disabled: boolean
}
