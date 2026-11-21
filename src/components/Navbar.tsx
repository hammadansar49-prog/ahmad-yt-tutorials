"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = pathname === "/" ? searchParams.get("q") ?? "" : "";

  const [query, setQuery] = useState(urlQuery);
  const [trackedUrlQuery, setTrackedUrlQuery] = useState(urlQuery);
  const [menuOpen, setMenuOpen] = useState(false);

  // Keep the search box in sync with the URL when navigation happens
  // externally (browser back/forward, clicking a link elsewhere). Adjusting
  // state during render (rather than in an effect) avoids an extra paint.
  if (urlQuery !== trackedUrlQuery) {
    setTrackedUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  function handleChange(value: string) {
    setQuery(value);
    const trimmed = value.trim();
    const category = pathname === "/" ? searchParams.get("category") : null;

    const next = new URLSearchParams();
    if (trimmed) next.set("q", trimmed);
    if (category) next.set("category", category);

    const qs = next.toString();
    router.replace(qs ? `/?${qs}` : "/");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    handleChange(query);
  }

  function clearSearch() {
    handleChange("");
  }

  function goHome(e: React.MouseEvent) {
    e.preventDefault();
    setMenuOpen(false);
    const alreadyHome = pathname === "/";
    router.push("/");
    if (alreadyHome) router.refresh();
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/tutorials", label: "All Posts" },
    { href: "/articles", label: "Articles" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/privacy-policy", label: "Privacy Policy" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const searchBox = (id: string) => (
    <div className="relative w-full">
      <label htmlFor={id} className="sr-only">
        Search tutorials
      </label>
      <svg
        viewBox="0 0 24 24"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
      <input
        id={id}
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search tutorials"
        className="w-full rounded-lg border border-line bg-soft pl-9 pr-9 py-2.5 text-sm text-ink placeholder-muted"
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <header className="glass-header sticky top-0 z-50 border-b border-line">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center gap-4 lg:gap-6">
        <Link
          href="/"
          onClick={goHome}
          className="flex items-center gap-2.5 font-semibold text-[15px] sm:text-base tracking-tight text-ink shrink-0"
        >
          <Image
            src="/icon.png"
            alt=""
            width={44}
            height={44}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover"
            priority
          />
          <span>Ahmad YT Tutorial</span>
        </Link>

        <div className="hidden xl:flex flex-1 items-center justify-center gap-6 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={l.href === "/" ? goHome : undefined}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`nav-link-fx whitespace-nowrap ${
                isActive(l.href) ? "text-ink font-semibold" : "text-muted hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center w-52 shrink-0 ml-auto xl:ml-0"
        >
          {searchBox("nav-search")}
        </form>

        <a
          href="https://www.youtube.com/@AhmadYTTutorial?sub_confirmation=1"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex shrink-0 rounded-lg border border-ink px-4 py-2.5 text-sm text-ink font-medium hover:bg-ink hover:text-white hover:-translate-y-0.5 whitespace-nowrap"
        >
          Subscribe
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="xl:hidden ml-auto sm:ml-0 shrink-0 w-11 h-11 flex items-center justify-center rounded-full border border-line text-ink hover:bg-soft"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="xl:hidden border-t border-line px-4 py-4 bg-white fade-up" style={{ animationDuration: ".35s" }}>
          <form onSubmit={handleSearch} className="mb-3 md:hidden">
            {searchBox("menu-search")}
          </form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={l.href === "/" ? goHome : () => setMenuOpen(false)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`block rounded-lg px-3 py-3 ${
                  isActive(l.href) ? "bg-brand-soft text-brand font-semibold" : "text-ink hover:bg-soft"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <a
            href="https://www.youtube.com/@AhmadYTTutorial?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden block rounded-lg bg-brand px-3 py-3 text-white font-medium text-center mt-3"
          >
            Subscribe on YouTube
          </a>
        </div>
      )}
    </header>
  );
}
