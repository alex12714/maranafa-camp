"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, BookOpen } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import TelegramSlideshow from "@/components/telegram-slideshow"
import { Reveal } from "@/components/home/motion/reveal"
import type { TelegramPost } from "@/app/api/blog/route"
import type { Article } from "@/app/api/articles/route"
import { DisplayHeading, Eyebrow, PillLink } from "./ui"

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

function ArticleCard({
  article,
  language,
  t,
  lead,
}: {
  article: Article
  language: string
  t: (k: string) => string
  lead?: boolean
}) {
  return (
    <Link href={`/${language}/blog/${article.slug}`} className="group block h-full">
      <article className="flex h-full flex-col rounded-[2rem] bg-white p-2 ring-1 ring-ink/[0.06] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1">
        <div
          className={`relative overflow-hidden rounded-[calc(2rem-0.5rem)] bg-ink/5 ${lead ? "aspect-[16/10]" : "aspect-[4/3]"}`}
        >
          {article.coverThumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.coverThumbUrl}
              alt={article.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-ink/15" strokeWidth={1} />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col px-4 pb-5 pt-5 md:px-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/50">
            {article.category && <span className="font-serif text-base italic text-crimson">{t(article.category)}</span>}
            {article.date && <span className="tabular-nums">{formatDate(article.date, language)}</span>}
          </div>
          <h3
            className={`mt-2 line-clamp-3 font-semibold leading-[1.15] tracking-[-0.02em] text-ink ${lead ? "text-2xl md:text-3xl" : "text-xl"}`}
          >
            {article.title}
          </h3>
          {article.subtitle && (
            <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-ink/60">{article.subtitle}</p>
          )}
          {article.author && <p className="mt-auto pt-5 text-sm text-ink/45">{article.author}</p>}
        </div>
      </article>
    </Link>
  )
}

function TelegramCard({ post, language, t }: { post: TelegramPost; language: string; t: (k: string) => string }) {
  const text = truncate(post.text, 140)
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col border-t border-ink/15 pt-5"
    >
      {post.imageUrl && (
        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-ink/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        </div>
      )}
      <span className="text-sm tabular-nums text-ink/45">{formatDate(post.pubDate, language)}</span>
      <p className="mt-2 line-clamp-4 flex-1 text-[15px] leading-relaxed text-ink/80">
        {text || <span className="italic text-ink/45">{t("Фото из Telegram")}</span>}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink/70 transition-colors group-hover:text-ink">
        {t("Открыть")} <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
      </span>
    </a>
  )
}

export default function Journal() {
  const { language, translations } = useLanguage()
  const t = (key: string) => translations[key] || key

  const [articles, setArticles] = useState<Article[]>([])
  const [posts, setPosts] = useState<TelegramPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([
      fetch(`/api/articles?lang=${language}`).then((r) => r.json()).catch(() => ({ articles: [] })),
      fetch("/api/blog").then((r) => r.json()).catch(() => ({ posts: [] })),
    ])
      .then(([articlesData, postsData]) => {
        if (!active) return
        setArticles((articlesData.articles ?? []).slice(0, 3))
        setPosts((postsData.posts ?? []).slice(0, 4))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [language])

  if (!loading && articles.length === 0 && posts.length === 0) return null

  return (
    <section className="bg-[#EFE9DE] px-4 py-28 text-ink sm:px-6 md:py-44 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <Eyebrow>{t("Новости и статьи")}</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <DisplayHeading className="mt-6">{t("Блог Маранафа")}</DisplayHeading>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <PillLink href="/blog" variant="ghost">
              {t("Все публикации")}
            </PillLink>
          </Reveal>
        </div>

        {loading ? (
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-[2rem] bg-ink/[0.06]" />
            ))}
          </div>
        ) : (
          <>
            {articles.length > 0 && (
              <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-12">
                {articles.map((a, i) => (
                  <Reveal key={a.id} delay={i * 0.06} className={i === 0 ? "md:col-span-6" : "md:col-span-3"}>
                    <ArticleCard article={a} language={language} t={t} lead={i === 0} />
                  </Reveal>
                ))}
              </div>
            )}

            <div className="mt-24">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-2xl font-semibold tracking-[-0.02em]">{t("Наш Telegram канал")}</h3>
                <div className="flex items-center gap-3">
                  <TelegramSlideshow />
                  <PillLink href="https://t.me/maranafacamp" external variant="ink">
                    {t("Подписаться")}
                  </PillLink>
                </div>
              </div>

              {posts.length > 0 ? (
                <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {posts.map((p, i) => (
                    <Reveal key={p.id} delay={i * 0.05} className="h-full">
                      <TelegramCard post={p} language={language} t={t} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <a
                  href="https://t.me/maranafacamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 block border-t border-ink/15 pt-6 font-serif text-2xl italic text-ink/70 hover:text-ink"
                >
                  @maranafacamp
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
