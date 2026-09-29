"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Globe,
  ChevronDown,
  ShoppingBag,
  Film,
  Package,
  Tent,
  HeartHandshake,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useLanguage,
  type Language,
  languageNames,
} from "@/contexts/language-context";

const mainNavItems = [
  { name: "Блог", href: "/blog" },
  { name: "Сотрудникам", href: "/staff" },
  { name: "О нас", href: "/about" },
  { name: "Родителям", href: "/parents" },
  { name: "Расписание", href: "/schedule" },
  { name: "Гимн лагеря", href: "/camp-anthem" },
];

const moreItems = [
  { name: "Rosetto", href: "/rosetto", icon: HeartHandshake },
  { name: "Для лагерей", href: "/for-camps", icon: Tent },
  { name: "Аренда", href: "/rental", icon: Package },
  { name: "Видео архив", href: "/video-archive", icon: Film },
  { name: "Мерч", href: "/merch", icon: ShoppingBag },
];

const EASE = "[transition-timing-function:cubic-bezier(0.32,0.72,0,1)]";

/**
 * True while the homepage hero (#top) is still under the bar, so the nav can
 * sit transparent with light text over the dark film.
 */
function useOverHero(enabled: boolean) {
  const [over, setOver] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setOver(false);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.getElementById("top");
      const limit = hero
        ? hero.offsetTop + hero.offsetHeight - 72
        : window.innerHeight * 0.8;
      setOver(window.scrollY < limit);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);

  return over;
}

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { translations = {} } = useLanguage();
  const overHero = useOverHero(isHome);
  // Light (transparent) style only over the hero and while the menu is closed.
  const light = isHome && overHero && !mobileMenuOpen;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Before mount, render the Russian source strings so SSR and hydration agree.
  const t = (key: string) => (mounted ? translations[key] || key : key);

  const linkClass = cn(
    "relative text-[14px] font-medium tracking-[-0.005em] transition-colors duration-300",
    light ? "text-white/80 hover:text-white" : "text-ink/70 hover:text-ink",
  );

  return (
    <>
      <header
        className={cn(
          "top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-500",
          EASE,
          isHome ? "fixed" : "sticky",
          light
            ? "border-b border-transparent bg-transparent"
            : "border-b border-ink/[0.07] bg-paper/75 backdrop-blur-xl backdrop-saturate-150",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="relative z-10 flex items-center"
            aria-label="Маранафа"
          >
            <Image
              src={
                light
                  ? "/images/maranafa-logo-white.webp"
                  : "/images/maranafa-logo.webp"
              }
              alt="Маранафа"
              width={200}
              height={50}
              priority
              className="h-12 w-auto md:h-14"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {mainNavItems.map((item) => (
              <Link key={item.name} href={item.href} className={linkClass}>
                {t(item.name)}
              </Link>
            ))}

            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen((v) => !v)}
                className={cn(linkClass, "flex items-center gap-1")}
                aria-expanded={moreOpen}
              >
                {t("Ещё")}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-300",
                    moreOpen && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "absolute right-0 mt-3 w-52 origin-top-right overflow-hidden rounded-2xl bg-paper/95 p-1.5 ring-1 ring-ink/[0.08] backdrop-blur-xl transition-[opacity,transform] duration-300",
                  EASE,
                  moreOpen
                    ? "scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0",
                )}
              >
                {moreItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-ink/75 transition-colors hover:bg-ink/[0.05] hover:text-ink"
                  >
                    <item.icon
                      className="h-4 w-4 text-ink/40"
                      strokeWidth={1.5}
                    />
                    {t(item.name)}
                  </Link>
                ))}
              </div>
            </div>

            <LanguageSelector light={light} />
          </nav>

          {/* Mobile burger: two lines that morph into an X */}
          <button
            type="button"
            className={cn(
              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
              light ? "text-white" : "text-ink",
            )}
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Открыть меню</span>
            <span
              className={cn(
                "absolute h-[1.5px] w-5 bg-current transition-transform duration-500",
                EASE,
                mobileMenuOpen ? "rotate-45" : "-translate-y-[4px]",
              )}
            />
            <span
              className={cn(
                "absolute h-[1.5px] w-5 bg-current transition-transform duration-500",
                EASE,
                mobileMenuOpen ? "-rotate-45" : "translate-y-[4px]",
              )}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu: full-screen glass sheet with staggered links. A sibling of
          the header, because the header's backdrop-filter would otherwise become
          the containing block for this fixed layer. */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-paper/95 backdrop-blur-2xl transition-opacity duration-500 lg:hidden",
          EASE,
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="px-6 pb-16 pt-6">
          <nav className="flex flex-col">
            {mainNavItems.map((item, i) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                tabIndex={mobileMenuOpen ? 0 : -1}
                style={{
                  transitionDelay: mobileMenuOpen ? `${80 + i * 45}ms` : "0ms",
                }}
                className={cn(
                  "border-b border-ink/[0.07] py-4 text-[1.75rem] font-semibold tracking-[-0.03em] text-ink transition-[opacity,transform] duration-700",
                  EASE,
                  mobileMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0",
                )}
              >
                {t(item.name)}
              </Link>
            ))}
          </nav>

          <p className="mt-10 font-serif text-lg italic text-crimson">
            {t("Ещё")}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-x-4">
            {moreItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                tabIndex={mobileMenuOpen ? 0 : -1}
                className="flex items-center gap-2 py-2.5 text-base font-medium text-ink/75 hover:text-ink"
              >
                <item.icon className="h-4 w-4 text-ink/40" strokeWidth={1.5} />
                {t(item.name)}
              </Link>
            ))}
          </div>

          <p className="mt-10 font-serif text-lg italic text-crimson">
            Language
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(Object.keys(languageNames) as Language[]).map((lang) => (
              <LanguageButton
                key={lang}
                lang={lang}
                onDone={() => setMobileMenuOpen(false)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function LanguageSelector({ light }: { light: boolean }) {
  const { language, setLanguage, setShowLanguageModal } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] font-medium ring-1 ring-inset transition-colors duration-300",
          light
            ? "text-white/85 ring-white/25 hover:ring-white/50"
            : "text-ink/75 ring-ink/15 hover:ring-ink/35",
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
        {languageNames[language]}
      </button>
      <div
        className={cn(
          "absolute right-0 mt-3 w-48 origin-top-right overflow-hidden rounded-2xl bg-paper/95 p-1.5 ring-1 ring-ink/[0.08] backdrop-blur-xl transition-[opacity,transform] duration-300",
          EASE,
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        {(Object.keys(languageNames) as Language[]).map((lang) => (
          <button
            key={lang}
            className={cn(
              "block w-full rounded-xl px-3.5 py-2 text-left text-sm transition-colors",
              language === lang
                ? "bg-ink/[0.06] font-medium text-crimson"
                : "text-ink/75 hover:bg-ink/[0.04]",
            )}
            onClick={() => {
              setLanguage(lang);
              setIsOpen(false);
            }}
          >
            {languageNames[lang]}
          </button>
        ))}
        <div className="my-1 h-px bg-ink/[0.07]" />
        <button
          className="block w-full rounded-xl px-3.5 py-2 text-left text-sm text-ink/75 hover:bg-ink/[0.04]"
          onClick={() => {
            setShowLanguageModal(true);
            setIsOpen(false);
          }}
        >
          Change Language
        </button>
      </div>
    </div>
  );
}

function LanguageButton({
  lang,
  onDone,
}: {
  lang: Language;
  onDone: () => void;
}) {
  const { language, setLanguage } = useLanguage();
  return (
    <button
      className={cn(
        "rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
        language === lang
          ? "bg-ink text-paper"
          : "bg-ink/[0.05] text-ink/75 hover:bg-ink/[0.09]",
      )}
      onClick={() => {
        setLanguage(lang);
        onDone();
      }}
    >
      {languageNames[lang]}
    </button>
  );
}
