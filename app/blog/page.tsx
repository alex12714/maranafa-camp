"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ExternalLink, Calendar, Send, Newspaper, BookOpen, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import type { TelegramPost } from "@/app/api/blog/route"

// ─── Static articles ───────────────────────────────────────────────────────────
const articles = [
  {
    id: "what-is-maranafa",
    title: "Что такое Маранафа?",
    titleEn: "What is Maranafa?",
    titleLv: "Kas ir Maranafa?",
    date: "2024-01-15",
    category: "О лагере",
    categoryEn: "About camp",
    excerpt:
      "Маранафа — это детский христианский тематический лагерь, который проводится с 1998 года. Каждый год — новая тема, новые приключения и незабываемые воспоминания для детей и подростков.",
    excerptEn:
      "Maranafa is a Christian themed children's camp that has been running since 1998. Every year brings a new theme, new adventures and unforgettable memories.",
    image: "/images/about-camp.jpg",
    href: "/about",
  },
  {
    id: "how-to-prepare",
    title: "Как подготовиться к лагерю",
    titleEn: "How to prepare for camp",
    titleLv: "Kā sagatavoties nometnei",
    date: "2025-04-20",
    category: "Родителям",
    categoryEn: "For parents",
    excerpt:
      "Список вещей, советы по подготовке и ответы на частые вопросы родителей перед отправкой ребёнка в лагерь. Поможем сделать сборы лёгкими и без стресса.",
    excerptEn:
      "Packing list, preparation tips and answers to common parent questions before sending your child to camp. We'll help make getting ready easy and stress-free.",
    image: "/placeholder.jpg",
    href: "/parents",
  },
  {
    id: "staff-stories",
    title: "Истории наших вожатых",
    titleEn: "Stories from our counselors",
    titleLv: "Mūsu instruktoru stāsti",
    date: "2025-03-10",
    category: "Команда",
    categoryEn: "Team",
    excerpt:
      "Люди, которые делают лагерь особенным. Наши вожатые и координаторы делятся тем, почему они возвращаются год за годом и что для них значит Маранафа.",
    excerptEn:
      "The people who make camp special. Our counselors and coordinators share why they come back year after year and what Maranafa means to them.",
    image: "/placeholder.jpg",
    href: "/staff",
  },
  {
    id: "rosetto-2025",
    title: "Rosetto 2025 — конференция для молодёжи",
    titleEn: "Rosetto 2025 — youth conference",
    titleLv: "Rosetto 2025 — jauniešu konference",
    date: "2025-02-01",
    category: "События",
    categoryEn: "Events",
    excerpt:
      "В этом году мы проводим очередную конференцию Rosetto для молодёжи. Три дня общения, вдохновения и роста вместе с единомышленниками из разных городов.",
    excerptEn:
      "This year we're hosting another Rosetto youth conference. Three days of fellowship, inspiration and growth with like-minded people from different cities.",
    image: "/placeholder.jpg",
    href: "/rosetto",
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(raw: string, lang: string): string {
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  const locale = lang === "ru" ? "ru-RU" : lang === "lv" ? "lv-LV" : lang === "uk" ? "uk-UA" : "en-GB"
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })
}

function truncate(text: string, max = 200): string {
  if (text.length <= max) return text
  return text.slice(0, text.lastIndexOf(" ", max)) + "…"
}

// ─── Sub-components ────────────────────────────────────────────────────────────
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

function PostCard({ post, language, t }: { post: TelegramPost; language: string; t: (k: string) => string }) {
  return (
    <Card className="border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
      {post.imageUrl && (
        <div className="relative w-full h-44 overflow-hidden rounded-t-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
      <CardContent className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          {formatDate(post.pubDate, language)}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed flex-1">{truncate(post.text, 220)}</p>
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#0088cc] hover:text-[#006da3] transition-colors mt-auto"
        >
          {t("Читать в Telegram")} <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </CardContent>
    </Card>
  )
}

function ArticleCard({ article, language, t }: { article: typeof articles[0]; language: string; t: (k: string) => string }) {
  const title = language === "en" ? article.titleEn : language === "lv" ? article.titleLv : article.title
  const category = language === "en" ? article.categoryEn : article.category
  const excerpt = language === "en" ? article.excerptEn : article.excerpt

  return (
    <Card className="border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full group">
      <div className="relative w-full h-44 overflow-hidden rounded-t-lg bg-gradient-to-br from-[#B22234]/10 to-[#FFD700]/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-[#B22234]/30" />
        </div>
      </div>
      <CardContent className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#FFD700]/20 text-[#8a6500]">
            {category}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(article.date, language)}
          </div>
        </div>
        <h3 className="font-bold text-gray-900 group-hover:text-[#B22234] transition-colors leading-snug">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed flex-1">{excerpt}</p>
        <Link
          href={article.href}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#B22234] hover:text-[#8e1c29] transition-colors mt-auto"
        >
          {t("Читать далее")} →
        </Link>
      </CardContent>
    </Card>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const { language, translations } = useLanguage()
  const t = (key: string) => translations[key] || key

  const [posts, setPosts] = useState<TelegramPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [postsError, setPostsError] = useState(false)

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.posts ?? [])
        setPostsError(!data.ok && data.posts?.length === 0)
      })
      .catch(() => setPostsError(true))
      .finally(() => setPostsLoading(false))
  }, [])

  return (
    <div className="bg-white min-h-screen">
      {/* ── Hero ── */}
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

        {/* ── Telegram section ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Send className="w-6 h-6 text-[#0088cc]" />
            <h2 className="text-2xl font-bold text-gray-900">{t("Наш Telegram канал")}</h2>
          </div>

          <TelegramChannelCard t={t} />

          <div className="mt-8">
            {postsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-56 rounded-xl bg-gray-100 animate-pulse" />
                ))}
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
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} language={language} t={t} />
                  ))}
                </div>
                <div className="text-center mt-6">
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

        {/* ── Articles section ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-[#B22234]" />
            <h2 className="text-2xl font-bold text-gray-900">{t("Статьи и материалы")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} language={language} t={t} />
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
