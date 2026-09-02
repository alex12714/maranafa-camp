/**
 * The option rules each renderer imposes, mirrored so the editor can say so NOW.
 *
 * THIS IS A MIRROR, NOT THE AUTHORITY. `_option_problems` in
 * app/services/learning_publish.py decides whether a version publishes, and it
 * is the only thing that does. What this buys is timing: an author building a
 * `yes_no` question should be told it needs exactly two options coded `yes` and
 * `no` while they are adding the third, not at publish time three screens
 * later. The checklist remains the backstop and always wins — if these ever
 * disagree, the server is right and this file is stale.
 *
 * The rules themselves are not arbitrary. `swipe_binary`'s sorts ARE its
 * left/right mapping — there is no `interaction_config` column precisely
 * because sort 0 = left and sort 1 = right is already deterministic — and
 * `yes_no` is keyed on option CODES rather than labels because correctness that
 * depended on the reader's language is the exact defect that design avoided.
 */

import type { AdminOption } from "@/lib/portal-learning-admin"

export interface OptionRules {
  /** Exact number of options, or null when only a minimum applies. */
  exactCount: number | null
  minCount: number
  /** Exact number of correct options, or null when only a minimum applies. */
  exactCorrect: number | null
  minCorrect: number
  /** The option codes this type demands, in order, or null when free. */
  fixedCodes: readonly string[] | null
  /** True when `sort` carries meaning the author must not shuffle. */
  sortIsMapping: boolean
}

const RULES: Record<string, OptionRules> = {
  single_choice: {
    exactCount: 4,
    minCount: 4,
    exactCorrect: 1,
    minCorrect: 1,
    fixedCodes: null,
    sortIsMapping: false,
  },
  yes_no: {
    exactCount: 2,
    minCount: 2,
    exactCorrect: 1,
    minCorrect: 1,
    fixedCodes: ["yes", "no"],
    sortIsMapping: false,
  },
  multi_select: {
    exactCount: null,
    minCount: 2,
    exactCorrect: null,
    minCorrect: 1,
    fixedCodes: null,
    sortIsMapping: false,
  },
  swipe_binary: {
    exactCount: 2,
    minCount: 2,
    exactCorrect: 1,
    minCorrect: 1,
    fixedCodes: null,
    sortIsMapping: true,
  },
}

export function rulesFor(questionType: string): OptionRules | null {
  return RULES[questionType] ?? null
}

/** True when exactly one option may be correct — so marking one unmarks the rest. */
export function isSingleAnswer(questionType: string): boolean {
  return rulesFor(questionType)?.exactCorrect === 1
}

/**
 * What is wrong with this question's option set right now, as translatable
 * templates with `{n}`/`{codes}` to interpolate. Empty when the set is valid.
 */
export function optionProblems(
  questionType: string,
  options: AdminOption[],
): { template: string; n?: number; codes?: string }[] {
  const rules = rulesFor(questionType)
  if (!rules) return [{ template: "Неизвестный тип вопроса" }]

  const problems: { template: string; n?: number; codes?: string }[] = []
  const correct = options.filter((o) => o.is_correct).length

  if (rules.exactCount !== null && options.length !== rules.exactCount) {
    problems.push({
      template: "Нужно ровно {n} вариантов, сейчас {m}",
      n: rules.exactCount,
      codes: String(options.length),
    })
  } else if (options.length < rules.minCount) {
    problems.push({
      template: "Нужно минимум {n} варианта, сейчас {m}",
      n: rules.minCount,
      codes: String(options.length),
    })
  }

  if (rules.exactCorrect !== null && correct !== rules.exactCorrect) {
    problems.push({
      template: "Правильный ответ должен быть ровно один, сейчас {m}",
      codes: String(correct),
    })
  } else if (rules.exactCorrect === null && correct < rules.minCorrect) {
    problems.push({ template: "Отметьте хотя бы один правильный ответ" })
  }

  if (rules.fixedCodes) {
    const actual = [...options.map((o) => o.code)].sort().join(", ")
    const expected = [...rules.fixedCodes].sort().join(", ")
    if (actual !== expected) {
      problems.push({
        template: "Коды вариантов должны быть {codes}",
        codes: rules.fixedCodes.join(", "),
      })
    }
  }

  if (rules.sortIsMapping && options.length === 2) {
    const sorts = [...options.map((o) => o.sort)].sort((a, b) => a - b)
    if (sorts[0] !== 0 || sorts[1] !== 1) {
      problems.push({ template: "Порядок вариантов должен быть 0 и 1: 0 — влево, 1 — вправо" })
    }
  }

  return problems
}

// ---------------------------------------------------------------------------
// Translation helpers
// ---------------------------------------------------------------------------

/**
 * The row for one language, or null.
 *
 * Absence is meaningful and is never papered over with an empty object: "this
 * module has no Latvian" is what the checklist reports and what the editor must
 * show, and a silently-defaulted blank row would make it look filled in.
 */
export function forLang<T extends { lang: string }>(
  rows: T[],
  lang: string,
): T | null {
  return rows.find((r) => r.lang === lang) ?? null
}
