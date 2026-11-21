import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content-store";

export default async function Footer() {
  const content = await getSiteContent();

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/tutorials", label: "All Posts" },
    { href: "/articles", label: "Articles" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/privacy-policy", label: "Privacy Policy" },
  ];

  return (
    <footer className="relative mt-8 border-t border-line bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-12">
        <div>
          <span className="flex items-center gap-3 font-semibold text-lg tracking-tight text-ink">
            <Image
              src="/icon.png"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            Ahmad YT Tutorial
          </span>
          <p className="mt-4 max-w-sm text-sm text-muted leading-relaxed">
            {content.aboutDescription}
          </p>
          <a
            href={`${content.youtubeUrl}?sub_confirmation=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-lg bg-brand px-5 py-3 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Subscribe on YouTube
          </a>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-[0.12em] mb-5">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-[15px]">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="nav-link-fx text-ink hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-[0.12em] mb-5">
            Get In Touch
          </h3>
          <ul className="space-y-2.5 text-[15px]">
            {content.socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link-fx text-ink hover:text-brand"
                >
                  {s.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${content.email}`}
                className="nav-link-fx text-ink hover:text-brand break-all"
              >
                {content.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap justify-between gap-3 text-sm text-muted">
          <span>© {new Date().getFullYear()} Ahmad YT Tutorial. All rights reserved.</span>
          <span>Learn · Create · Grow</span>
        </div>
      </div>
    </footer>
  );
}
