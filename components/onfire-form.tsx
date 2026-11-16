"use client"

import { ExternalLink, Mail } from "lucide-react"
import { TranslatedText } from "@/components/translated-text"
import { useLanguage } from "@/contexts/language-context"
import { CONTACT_EMAIL } from "@/lib/legal-content"
import { buildFormHref, getOnFireFormUrl, type OnFireFormKey } from "@/lib/onfire-forms"

/**
 * An OnFire registration form embedded in the page (lib/onfire-forms.ts maps
 * `form` to its URL). The form is shown in the site's current language.
 *
 * forms.onfire.so has no height messaging for embeds, so the iframe has a
 * fixed height and scrolls inside; `height` should fit the form's first page.
 * A link under the form opens it full-screen, which is easier on a phone.
 *
 * When the form's URL is not configured yet, a "registration opens soon"
 * notice with a contact e-mail is rendered instead.
 */
export default function OnFireForm({
  form,
  title,
  height = 900,
  contactEmail = CONTACT_EMAIL,
  className = "",
}: {
  form: OnFireFormKey
  /** Accessible name for the iframe (Russian key, translated like other text). */
  title: string
  height?: number
  contactEmail?: string
  className?: string
}) {
  const { language, translations = {} } = useLanguage()
  const t = (s: string) => translations[s] || s
  const url = getOnFireFormUrl(form)

  if (!url) {
    return (
      <div
        className={`rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center ${className}`}
        data-testid="onfire-form-fallback"
      >
        <p className="text-lg font-semibold text-gray-900">
          <TranslatedText text="Регистрация скоро откроется" />
        </p>
        <p className="mt-2 text-sm text-gray-600">
          <TranslatedText text="Форма регистрации появится здесь в ближайшее время. А пока вы можете написать нам:" />
        </p>
        <a
          href={`mailto:${contactEmail}`}
          className="mt-4 inline-flex items-center gap-2 font-medium text-[#B22234] underline"
        >
          <Mail className="h-4 w-4" />
          {contactEmail}
        </a>
      </div>
    )
  }

  return (
    <div className={className}>
      <iframe
        src={buildFormHref(url, language, { embed: true })}
        title={t(title)}
        width="100%"
        height={height}
        loading="lazy"
        allow="payment; clipboard-write"
        className="block w-full rounded-lg border-0 bg-white"
        style={{ height }}
      />
      <p className="mt-3 text-center text-sm text-gray-500">
        <a
          href={buildFormHref(url, language)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline hover:text-gray-700"
        >
          <TranslatedText text="Открыть форму в новом окне" />
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </p>
    </div>
  )
}
