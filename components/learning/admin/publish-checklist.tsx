"use client"

/**
 * The publish checklist — the centrepiece of the authoring screen.
 *
 * The server validates a draft across five tables and hands back every problem
 * at once (app/services/learning_publish.py). This renders that answer as a
 * LIST AN AUTHOR CAN ACT ON — "у вопроса «q7» нет материала для повторения",
 * "нет латышской формулировки" — and never as a raw 422. A checklist that
 * reported one failure per round trip is a checklist somebody works around by
 * publishing an empty version, which is the one outcome the whole feature
 * exists to prevent.
 *
 * BLOCKS AND WARNINGS ARE NOT THE SAME THING AND ARE NEVER MIXED. A block
 * refuses the publish; a warning is reported and changes nothing. Ordering them
 * into one list by "severity" would leave an author guessing which rows they
 * actually have to fix, so they are two sections with two headings and two
 * counts.
 *
 * NEVER COLOUR ALONE, the same rule the learner screens follow: every row
 * carries an icon AND a word ("Препятствие" / "Предупреждение") before it
 * carries a tint, and the counts are in the headings as text.
 *
 * EACH ROW IS TRANSLATED FROM ITS `code`, NOT FROM THE SERVER'S SENTENCE. The
 * API's message is English prose built for a developer reading a log; the
 * author reading this screen is a camp director who may be reading in Latvian.
 * So the code drives a translated sentence with the locators interpolated, and
 * the server's own message is kept underneath as the precise, untranslated
 * detail — which also means a code this build has never heard of still renders
 * something true rather than nothing.
 */

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Languages,
  XCircle,
} from "lucide-react"

import { useLanguage } from "@/contexts/language-context"
import type { ChecklistItem, PublishChecklist } from "@/lib/portal-learning-admin"

/** Display names for the four languages the portal ships. */
const LANGUAGE_LABELS: Record<string, string> = {
  ru: "Русский",
  en: "English",
  lv: "Latviešu",
  uk: "Українська",
}

/**
 * The translated sentence for each checklist code, with `{q}`, `{m}` and
 * `{lang}` interpolated from the item's locators.
 *
 * Keyed by the server's stable `code` rather than matched on its message: the
 * codes are contract, the sentences are not.
 */
const MESSAGE_BY_CODE: Record<string, string> = {
  // --- blocks ---
  no_required_questions:
    "В версии нет ни одного обязательного вопроса — она выдаст сертификат всем сразу",
  question_missing_remediation:
    "У вопроса «{q}» нет материала для повторения — ответившему неверно некуда идти",
  question_untranslated: "У вопроса «{q}» нет формулировки на языке {lang}",
  option_untranslated:
    "У одного из вариантов вопроса «{q}» нет подписи на языке {lang}",
  material_untranslated:
    "У материала для повторения нет текста на языке {lang}",
  material_missing_asset:
    "К материалу не приложен файл — урок с заголовком и без содержания",
  asset_missing: "Материал ссылается на файл, которого больше нет",
  asset_missing_transcript:
    "У аудио или видео нет расшифровки — участник со скринридером будет оценён по вопросу, который не может воспринять",
  unknown_material_kind: "Неизвестный тип материала",
  required_language_incomplete:
    "{lang} — обязательный язык, и версия переведена на него не полностью",
  unknown_required_language:
    "В настройках обязательным указан язык, которого нет в приложении",
  // --- warnings ---
  language_incomplete:
    "{lang} переведён частично и НЕ будет предложен: версия либо полна на языке, либо не предлагает его вовсе",
  module_title_missing:
    "У модуля «{m}» нет заголовка на языке {lang} — заголовок будет пустым",
  required_material_untranslated:
    "У обязательного материала нет текста на языке {lang}",
  module_without_questions:
    "В обязательном модуле «{m}» нет обязательных вопросов, и он не влияет на сертификацию",
  unknown_language_present:
    "Переводы сохранены под кодом языка, которого нет в приложении — их никто не увидит",
}

/** Interpolate an item's locators into its translated sentence. */
function describe(item: ChecklistItem, t: (s: string) => string): string | null {
  const template = MESSAGE_BY_CODE[item.code]
  if (!template) return null
  return t(template)
    .replace("{q}", item.question_code ?? "—")
    .replace("{m}", item.module_code ?? "—")
    .replace("{lang}", item.lang ? t(LANGUAGE_LABELS[item.lang] ?? item.lang) : "—")
}

/** A locator chip — which module, question or language the row is about. */
function Locator({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
      <span className="text-gray-400">{label}</span>
      <span className="font-mono">{value}</span>
    </span>
  )
}

function ChecklistRow({
  item,
  blocking,
}: {
  item: ChecklistItem
  blocking: boolean
}) {
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  const sentence = describe(item, t)

  return (
    <li
      className={`flex gap-3 rounded-lg border p-3 ${
        blocking ? "border-red-200 bg-red-50/60" : "border-amber-200 bg-amber-50/60"
      }`}
    >
      {blocking ? (
        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
      ) : (
        <AlertTriangle
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
          aria-hidden
        />
      )}
      <div className="min-w-0 space-y-1.5">
        {/* The word, so severity is never carried by the tint alone. */}
        <p
          className={`text-[11px] font-bold uppercase tracking-wide ${
            blocking ? "text-red-700" : "text-amber-700"
          }`}
        >
          {blocking ? t("Препятствие") : t("Предупреждение")}
        </p>
        <p className="text-sm font-medium text-gray-900">
          {sentence ?? item.message}
        </p>
        {/* The server's own words: precise, and the only thing rendered for a
            code this build does not know. Redundant once `sentence` exists —
            kept because it names things (an exact option code) the DTO does
            not carry as a locator. */}
        {sentence && (
          <p className="font-mono text-[11px] leading-relaxed text-gray-500">
            {item.message}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          <Locator label={t("код")} value={item.code} />
          {item.module_code && (
            <Locator label={t("модуль")} value={item.module_code} />
          )}
          {item.question_code && (
            <Locator label={t("вопрос")} value={item.question_code} />
          )}
          {item.lang && <Locator label={t("язык")} value={item.lang} />}
        </div>
      </div>
    </li>
  )
}

/**
 * The languages a publish WOULD freeze onto the version, and the ones it must
 * have.
 *
 * Shown next to the verdict because `available_languages` is the single most
 * surprising thing about this feature: a language translated halfway is ABSENT
 * from the list rather than present-with-holes, so an author who has done half
 * the Latvian needs to see that Latvian is not in the row — and the warning
 * below telling them why.
 */
function LanguageSummary({ checklist }: { checklist: PublishChecklist }) {
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  const label = (code: string) => t(LANGUAGE_LABELS[code] ?? code)

  return (
    <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/70 p-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
        <Languages className="h-3.5 w-3.5 text-gray-400" aria-hidden />
        {t("Языки")}
      </p>
      <div className="space-y-1.5 text-xs">
        <p className="text-gray-600">
          <span className="font-medium text-gray-900">
            {t("Обязательные")}:{" "}
          </span>
          {checklist.required_languages.length > 0
            ? checklist.required_languages.map(label).join(", ")
            : "—"}
        </p>
        <p className="text-gray-600">
          <span className="font-medium text-gray-900">
            {t("Будут доступны после публикации")}:{" "}
          </span>
          {checklist.available_languages.length > 0
            ? checklist.available_languages.map(label).join(", ")
            : t("пока ни одного")}
        </p>
      </div>
      <p className="text-[11px] leading-relaxed text-gray-500">
        {t(
          "Версия либо полностью переведена на язык, либо не предлагает его. Частично переведённый язык не появится в списке.",
        )}
      </p>
    </div>
  )
}

/**
 * The whole checklist.
 *
 * `checklist` is the same object whether it came from GET .../checklist or from
 * the 422 a refused publish returned — which is why a failed publish needs no
 * second request to explain itself.
 */
export function PublishChecklistPanel({
  checklist,
}: {
  checklist: PublishChecklist
}) {
  const { translations } = useLanguage()
  const t = (text: string) => translations[text] || text

  const blocks = checklist.blocks
  const warnings = checklist.warnings
  const isDraft = checklist.status === "draft"

  return (
    <div className="space-y-4">
      {/* --- verdict ------------------------------------------------------ */}
      <div
        className={`flex items-start gap-3 rounded-lg border p-3 ${
          checklist.publishable
            ? "border-green-200 bg-green-50"
            : "border-red-200 bg-red-50"
        }`}
      >
        {checklist.publishable ? (
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-green-600"
            aria-hidden
          />
        ) : (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
        )}
        <div className="min-w-0">
          <p
            className={`text-sm font-bold ${
              checklist.publishable ? "text-green-900" : "text-red-900"
            }`}
          >
            {checklist.publishable
              ? t("Версию можно публиковать")
              : t("Публикация невозможна: {n} препятствий").replace(
                  "{n}",
                  String(blocks.length),
                )}
          </p>
          <p className="mt-0.5 text-xs text-gray-600">
            {checklist.publishable
              ? warnings.length > 0
                ? t(
                    "Предупреждения ниже публикацию не остановят, но их стоит прочитать.",
                  )
                : t("Всё на месте.")
              : t("Исправьте всё перечисленное ниже, затем проверьте снова.")}
          </p>
        </div>
      </div>

      {!isDraft && (
        <p className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
          {t(
            "Эта версия уже не черновик, поэтому проверка носит справочный характер.",
          )}
        </p>
      )}

      <LanguageSummary checklist={checklist} />

      {/* --- blocks ------------------------------------------------------- */}
      {blocks.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900">
            {t("Препятствия ({n})").replace("{n}", String(blocks.length))}
          </h3>
          <p className="text-xs text-gray-500">
            {t("Пока они не исправлены, версию опубликовать нельзя.")}
          </p>
          <ul className="space-y-2">
            {blocks.map((item, i) => (
              <ChecklistRow key={`${item.code}-${i}`} item={item} blocking />
            ))}
          </ul>
        </section>
      )}

      {/* --- warnings ----------------------------------------------------- */}
      {warnings.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900">
            {t("Предупреждения ({n})").replace("{n}", String(warnings.length))}
          </h3>
          <p className="text-xs text-gray-500">
            {t("Публикацию не останавливают.")}
          </p>
          <ul className="space-y-2">
            {warnings.map((item, i) => (
              <ChecklistRow
                key={`${item.code}-${i}`}
                item={item}
                blocking={false}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
