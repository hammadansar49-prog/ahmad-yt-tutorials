import Link from "next/link";
import { getSiteContent } from "@/lib/site-content-store";

export default async function Footer() {
  const content = await getSiteContent();

  return (
    <footer className="relative border-t border-white/10 mt-8 bg-[#06102b]/60 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <span className="font-extrabold text-lg text-white">
            Ahmad <span className="text-[#ff6a3d]">YT</span> Tutorial
          </span>
          <p className="mt-3 text-sm text-white/60 leading-relaxed">
            {content.aboutDescription}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="nav-link-fx text-white/70 hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="nav-link-fx text-white/70 hover:text-white transition"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="nav-link-fx text-white/70 hover:text-white transition"
              >
                Contact
              </Link>
            </li>
            <li>
              <a
                href={content.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link-fx text-white/70 hover:text-white transition"
              >
                YouTube Channel
              </a>
            </li>
            <li>
              <Link
                href="/disclaimer"
                className="nav-link-fx text-white/70 hover:text-white transition"
              >
                Disclaimer
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="nav-link-fx text-white/70 hover:text-white transition"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">
            Get In Touch
          </h3>
          <ul className="space-y-2 text-sm">
            {content.socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link-fx text-white/70 hover:text-white transition"
                >
                  {s.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${content.email}`}
                className="nav-link-fx text-white/70 hover:text-white transition"
              >
                {content.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Ahmad YT Tutorial. All rights reserved.
      </div>
    </footer>
  );
}
