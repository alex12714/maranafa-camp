"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Calendar, Send, Newspaper, BookOpen, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import type { TelegramPost } from "@/app/api/blog/route"
import type { Article } from "@/app/api/articles/route"

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(raw: string, lang: string): string {
  if (!raw) return ""
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  const locale = lang === "ru" ? "ru-RU" : lang === "lv" ? "lv-LV" : lang === "uk" ? "uk-UA" : "en-GB"
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })
}

function truncate(text: string, max = 200): string {
  if (!text || text.length <= max) return text
  const cut = text.lastIndexOf(" ", max)
  return text.slice(0, cut > 0 ? cut : max) + "…"
}

// ─── Telegram Channel Banner ──────────────────────────────────────────────────
function TelegramChannelCard({ t }: { t: (k: string) => string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#0088cc] to-[#229ed9] text-white p-6 flex flex-col sm:flex-row items-center gap-4 shadow-lg">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Send className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="text-sm text-white/80">{t("Telegram канал")}</p>
          <p className="text-xl font-bold">@maranafacamp</p>
          <p className="text-sm text-white/80 mt-0.5">{t("Новости, фото, объявления")}</p>
        </div>
      </div>
      <a
        href="https://t.me/maranafacamp"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 bg-white text-[#0088cc] font-semibold px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors text-sm"
      >
        {t("Подписаться")}
      </a>
    </div>
  )
}

// ─── Telegram Post Card ───────────────────────────────────────────────────────
function PostCard({ post, language, t }: { post: TelegramPost; language: string; t: (k: string) => string }) {
  const hasText = Boolean(post.text?.trim())
  const displayText = hasText ? truncate(post.text, 220) : null

  return (
    <Card className="border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
      {post.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.imageUrl} alt="" className="w-full h-44 object-cover" loading="lazy" />
      )}
      <CardContent className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          {formatDate(post.pubDate, language)}
        </div>
        {displayText && (
          <p className="text-sm text-gray-700 leading-relaxed flex-1 whitespace-pre-line line-clamp-5">{displayText}</p>
        )}
        {!displayText && post.imageUrl && (
          <p className="text-sm text-gray-400 italic">{t("Фото из Telegram")}</p>
        )}
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#0088cc] hover:text-[#006da3] transition-colors mt-auto pt-1"
        >
          {t("Читать в Telegram")} <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </CardContent>
    </Card>
  )
}

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ article, language, t }: { article: Article; language: string; t: (k: string) => string }) {
  return (
    <Card className="border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden group">
      {article.coverThumbUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.coverThumbUrl}
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-[#B22234]/10 to-[#FFD700]/20 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-[#B22234]/25" />
        </div>
      )}
      <CardContent className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {article.category && (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#FFD700]/20 text-[#7a5500]">
              {article.category}
            </span>
          )}
          {article.date && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(article.date, language)}
            </div>
          )}
        </div>
        <h3 className="font-bold text-gray-900 group-hover:text-[#B22234] transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>
        {article.subtitle && (
          <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-3">{article.subtitle}</p>
        )}
        {article.author && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50">
            <User className="w-3.5 h-3.5" />
            {article.author}
          </div>
        )}
        <Link
          href={`/blog/${article.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#B22234] hover:text-[#8e1c29] transition-colors"
        >
          {t("Читать далее")} →
        </Link>
      </CardContent>
    </Card>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const { language, translations } = useLanguage()
  const t = (key: string) => translations[key] || key

  const [posts, setPosts] = useState<TelegramPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [postsError, setPostsError] = useState(false)

  const [articles, setArticles] = useState<Article[]>([])
  const [articlesLoading, setArticlesLoading] = useState(true)

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((d) => { setPosts(d.posts ?? []); setPostsError(!d.ok && !d.posts?.length) })
      .catch(() => setPostsError(true))
      .finally(() => setPostsLoading(false))

    fetch("/api/articles")
      .then((r) => r.json())
      .then((d) => setArticles(d.articles ?? []))
      .catch(() => {})
      .finally(() => setArticlesLoading(false))
  }, [])

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#B22234] to-[#7a0e1e] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 pl-0 mb-6 -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("Назад на главную")}
            </Button>
          </Link>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Newspaper className="w-8 h-8 text-[#FFD700]" />
              <span className="text-[#FFD700] font-semibold text-sm uppercase tracking-widest">
                {t("Новости и статьи")}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t("Блог Маранафа")}</h1>
            <p className="text-white/80 text-lg">
              {t("Следите за новостями лагеря в нашем Telegram канале и читайте наши статьи и материалы")}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* ── Articles ── */}
        {(articlesLoading || articles.length > 0) && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-[#B22234]" />
              <h2 className="text-2xl font-bold text-gray-900">{t("Статьи и материалы")}</h2>
            </div>
            {articlesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-72 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((a) => (
                  <ArticleCard key={a.id} article={a} language={language} t={t} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Telegram ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Send className="w-6 h-6 text-[#0088cc]" />
            <h2 className="text-2xl font-bold text-gray-900">{t("Наш Telegram канал")}</h2>
          </div>

          <TelegramChannelCard t={t} />

          <div className="mt-8">
            {postsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-56 rounded-xl bg-gray-100 animate-pulse" />)}
              </div>
            ) : postsError || posts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
                <Send className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">{t("Не удалось загрузить посты")}</p>
                <a
                  href="https://t.me/maranafacamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#0088cc] font-medium hover:underline"
                >
                  {t("Открыть канал в Telegram")} <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  {t("Последние публикации")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {posts.map((p) => (
                    <PostCard key={p.id} post={p} language={language} t={t} />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <a
                    href="https://t.me/maranafacamp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0088cc] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#006da3] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {t("Все публикации в Telegram")}
                  </a>
                </div>
              </>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
