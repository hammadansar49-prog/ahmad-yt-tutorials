"use client";

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

  const navLinkClass =
    "text-white/80 hover:text-white transition";

  return (
    <header className="sticky top-0 z-50 bg-[#06102b]/90 backdrop-blur border-b border-white/10 relative after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[#3b82f6]/60 after:to-transparent">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3 sm:gap-6">
        <Link
          href="/"
          onClick={goHome}
          className="font-extrabold text-base sm:text-lg text-white shrink-0"
        >
          Ahmad <span className="text-[#ff6a3d]">YT</span> Tutorial
        </Link>

        <form
          onSubmit={handleSearch}
          className="flex-1 min-w-0 max-w-sm hidden sm:flex items-center"
        >
          <div className="relative w-full">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Search tutorials..."
              className="w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-9 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#ff6a3d]/60 transition"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </form>

        <div className="hidden sm:flex items-center gap-6 text-sm font-medium ml-auto">
          <Link href="/" onClick={goHome} className={navLinkClass}>
            Home
          </Link>
          <Link href="/about" className={navLinkClass}>
            About
          </Link>
          <Link href="/contact" className={navLinkClass}>
            Contact
          </Link>
          <Link href="/disclaimer" className={navLinkClass}>
            Disclaimer
          </Link>
          <Link href="/privacy-policy" className={navLinkClass}>
            Privacy Policy
          </Link>
          <a
            href="https://www.youtube.com/@AhmadYTTutorial?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] px-4 py-2 text-white font-semibold hover:brightness-110 transition whitespace-nowrap"
          >
            Subscribe
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="sm:hidden ml-auto shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/80 hover:text-white transition"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      <form onSubmit={handleSearch} className="sm:hidden px-4 pb-3">
        <div className="relative w-full">
          <svg
            viewBox="0 0 24 24"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search tutorials..."
            className="w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#ff6a3d]/60 transition"
          />
        </div>
      </form>

      {menuOpen && (
        <div className="sm:hidden border-t border-white/10 px-4 py-3 space-y-1 bg-[#06102b]">
          <Link
            href="/"
            onClick={goHome}
            className="block rounded-lg px-3 py-2.5 text-white/80 hover:bg-white/5 hover:text-white transition"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-white/80 hover:bg-white/5 hover:text-white transition"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-white/80 hover:bg-white/5 hover:text-white transition"
          >
            Contact
          </Link>
          <Link
            href="/disclaimer"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-white/80 hover:bg-white/5 hover:text-white transition"
          >
            Disclaimer
          </Link>
          <Link
            href="/privacy-policy"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-white/80 hover:bg-white/5 hover:text-white transition"
          >
            Privacy Policy
          </Link>
          <a
            href="https://www.youtube.com/@AhmadYTTutorial?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] px-3 py-2.5 text-white font-semibold text-center mt-2"
          >
            Subscribe
          </a>
        </div>
      )}
    </header>
  );
}
