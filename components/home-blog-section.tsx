"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Send, BookOpen, ExternalLink, Clock, ArrowRight, Calendar, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import type { TelegramPost } from "@/app/api/blog/route"
import type { Article } from "@/app/api/articles/route"

function formatDate(raw: string, lang: string): string {
  if (!raw) return ""
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  const locale = lang === "ru" ? "ru-RU" : lang === "lv" ? "lv-LV" : lang === "uk" ? "uk-UA" : "en-GB"
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })
}

function truncate(text: string, max: number): string {
  if (!text || text.length <= max) return text
  const cut = text.lastIndexOf(" ", max)
  return text.slice(0, cut > 0 ? cut : max) + "…"
}

// ─── Article card (homepage compact) ─────────────────────────────────────────
function ArticleCard({ article, language, t }: { article: Article; language: string; t: (k: string) => string }) {
  return (
    <Link href={`/blog/${article.slug}`} className="block group h-full">
      <Card className="border border-gray-100 group-hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
        {article.coverThumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverThumbUrl}
            alt={article.title}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-[#B22234]/10 to-[#FFD700]/20 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-[#B22234]/25" />
          </div>
        )}
        <CardContent className="flex flex-col flex-1 p-4 gap-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {article.category && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#FFD700]/20 text-[#7a5500]">
                {article.category}
              </span>
            )}
            {article.date && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                {formatDate(article.date, language)}
              </span>
            )}
          </div>
          <h3 className="font-bold text-gray-900 group-hover:text-[#B22234] transition-colors leading-snug line-clamp-2 text-sm">
            {article.title}
          </h3>
          {article.subtitle && (
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{article.subtitle}</p>
          )}
          {article.author && (
            <p className="flex items-center gap-1 text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50">
              <User className="w-3 h-3" /> {article.author}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

// ─── Telegram post card (homepage compact) ────────────────────────────────────
function TelegramCard({ post, language, t }: { post: TelegramPost; language: string; t: (k: string) => string }) {
  const text = truncate(post.text, 160)
  return (
    <a href={post.link} target="_blank" rel="noopener noreferrer" className="block group h-full">
      <Card className="border border-gray-100 group-hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
        {post.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.imageUrl} alt="" className="w-full h-36 object-cover" loading="lazy" />
        )}
        <CardContent className="flex flex-col flex-1 p-4 gap-2">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {formatDate(post.pubDate, language)}
          </span>
          {text ? (
            <p className="text-xs text-gray-700 leading-relaxed line-clamp-4 flex-1">{text}</p>
          ) : (
            <p className="text-xs text-gray-400 italic flex-1">{t("Фото из Telegram")}</p>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0088cc] mt-auto pt-1 group-hover:underline">
            {t("Открыть")} <ExternalLink className="w-3 h-3" />
          </span>
        </CardContent>
      </Card>
    </a>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function HomeBlogSection() {
  const { language, translations } = useLanguage()
  const t = (key: string) => translations[key] || key

  const [articles, setArticles] = useState<Article[]>([])
  const [posts, setPosts] = useState<TelegramPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/articles").then((r) => r.json()).catch(() => ({ articles: [] })),
      fetch("/api/blog").then((r) => r.json()).catch(() => ({ posts: [] })),
    ]).then(([articlesData, postsData]) => {
      setArticles((articlesData.articles ?? []).slice(0, 3))
      setPosts((postsData.posts ?? []).slice(0, 4))
    }).finally(() => setLoading(false))
  }, [])

  const hasContent = articles.length > 0 || posts.length > 0

  if (!loading && !hasContent) return null

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[#B22234] font-semibold text-sm uppercase tracking-widest mb-1">
              {t("Новости и статьи")}
            </p>
            <h2 className="text-3xl font-bold text-gray-900">{t("Блог Маранафа")}</h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[#B22234] hover:text-[#8e1c29] transition-colors"
          >
            {t("Все публикации")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {[1, 2, 3].map((i) => <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse" />)}
          </div>
        ) : (
          <>
            {/* Articles grid */}
            {articles.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen className="w-5 h-5 text-[#B22234]" />
                  <h3 className="text-lg font-semibold text-gray-800">{t("Статьи и материалы")}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {articles.map((a) => (
                    <ArticleCard key={a.id} article={a} language={language} t={t} />
                  ))}
                </div>
              </div>
            )}

            {/* Telegram section */}
            <div>
              {/* Channel banner */}
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#0088cc]" />
                  <h3 className="text-lg font-semibold text-gray-800">{t("Наш Telegram канал")}</h3>
                </div>
                <a
                  href="https://t.me/maranafacamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#0088cc] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#006da3] transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  {t("Подписаться")}
                </a>
              </div>

              {posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {posts.map((p) => (
                    <TelegramCard key={p.id} post={p} language={language} t={t} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl">
                  <a href="https://t.me/maranafacamp" target="_blank" rel="noopener noreferrer"
                    className="text-[#0088cc] font-medium hover:underline flex items-center gap-2 justify-center">
                    <Send className="w-4 h-4" /> @maranafacamp
                  </a>
                </div>
              )}
            </div>
          </>
        )}

        {/* Mobile "all posts" link */}
        <div className="sm:hidden text-center mt-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-[#B22234]">
            {t("Все публикации")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}
