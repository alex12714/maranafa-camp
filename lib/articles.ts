// Articles live in AirTable with one record per translation. All translations of
// the same article share a Slug and are told apart by the «Язык» single-select.

export type ArticleLanguage = "ru" | "en" | "lv" | "uk"

export const DEFAULT_ARTICLE_LANGUAGE: ArticleLanguage = "ru"

// Note: the AirTable option for Ukrainian really is spelled "Ukranian".
const AIRTABLE_LANGUAGE: Record<ArticleLanguage, string> = {
  ru: "Russian",
  en: "English",
  lv: "Latvian",
  uk: "Ukranian",
}

export interface Article {
  id: string
  title: string
  subtitle: string
  slug: string
  author: string
  date: string
  status: string
  category: string
  content: string
  language: string
  coverUrl?: string
  coverThumbUrl?: string
}

/** Accepts a site language code (plus the `ukr` alias); anything else falls back to Russian. */
export function normalizeArticleLanguage(raw: string | null | undefined): ArticleLanguage {
  const code = (raw ?? "").trim().toLowerCase()
  if (code === "ukr") return "uk"
  return code === "ru" || code === "en" || code === "lv" || code === "uk"
    ? code
    : DEFAULT_ARTICLE_LANGUAGE
}

export function mapArticleRecord(r: any): Article {
  const f = r.fields
  const cover = f["Обложка"]?.[0]
  return {
    id: r.id,
    title: f["Заголовок"] ?? "",
    subtitle: f["Подзаголовок"] ?? "",
    slug: f["Slug"] ?? r.id,
    author: f["Автор"] ?? "",
    date: f["Дата"] ?? "",
    status: f["Статус"] ?? "Черновик",
    category: f["Категория"] ?? "",
    content: f["Содержимое"] ?? "",
    language: f["Язык"] ?? "",
    coverUrl: cover?.url ?? undefined,
    coverThumbUrl: cover?.thumbnails?.large?.url ?? cover?.url ?? undefined,
  }
}

/**
 * Picks one translation out of a group of same-slug records: the requested
 * language, else Russian (a record with no «Язык» counts as Russian), else
 * whatever exists.
 */
export function pickTranslation(group: Article[], lang: ArticleLanguage): Article | null {
  if (!group.length) return null
  const wanted = AIRTABLE_LANGUAGE[lang]
  const russian = AIRTABLE_LANGUAGE.ru
  return (
    group.find((a) => a.language === wanted) ??
    group.find((a) => !a.language || a.language === russian) ??
    group[0]
  )
}

/** Collapses a mixed-language list down to one article per slug, newest first. */
export function pickTranslationsPerSlug(articles: Article[], lang: ArticleLanguage): Article[] {
  const bySlug = new Map<string, Article[]>()
  for (const article of articles) {
    const group = bySlug.get(article.slug)
    if (group) group.push(article)
    else bySlug.set(article.slug, [article])
  }

  return [...bySlug.values()]
    .flatMap((group) => {
      const picked = pickTranslation(group, lang)
      return picked ? [picked] : []
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
}

// «Категория» options are Russian names; show them in the article's language.
const CATEGORY_LABELS: Record<string, Partial<Record<ArticleLanguage, string>>> = {
  "Новости": { en: "News", lv: "Ziņas", uk: "Новини" },
  "События": { en: "Events", lv: "Notikumi", uk: "Події" },
  "О лагере": { en: "About the Camp", lv: "Par nometni", uk: "Про табір" },
  "Родителям": { en: "For Parents", lv: "Vecākiem", uk: "Батькам" },
  "Команда": { en: "Team", lv: "Komanda", uk: "Команда" },
}

export function localizeCategory(category: string, lang: ArticleLanguage): string {
  return CATEGORY_LABELS[category]?.[lang] ?? category
}
