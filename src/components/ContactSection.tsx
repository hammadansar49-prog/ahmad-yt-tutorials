import type { SiteContent } from "@/lib/site-content-store";
import TranslatedText from "./TranslatedText";

const iconMap: Record<string, { gradient: string; icon: React.ReactNode }> = {
  youtube: {
    gradient: "from-[#ff2d55] to-[#ff0000]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
      </svg>
    ),
  },
  whatsapp: {
    gradient: "from-[#25D366] to-[#128C7E]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12.01 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12.01 22C17.53 22 22 17.52 22 12S17.53 2 12.01 2Zm5.6 14.2c-.24.67-1.38 1.28-1.9 1.35-.5.07-1.02.3-3.4-.72-2.85-1.24-4.68-4.16-4.82-4.35-.14-.19-1.16-1.55-1.16-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.82 2.01.9 2.15.07.15.12.32.02.51-.1.19-.15.31-.3.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.48.13.65-.07.18-.21.75-.87.95-1.17.2-.3.4-.25.66-.15.27.1 1.7.8 1.99.95.3.15.49.22.56.35.08.13.08.75-.16 1.42Z" />
      </svg>
    ),
  },
  instagram: {
    gradient: "from-[#f58529] via-[#dd2a7b] to-[#8134af]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 2c2.7 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.42.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.42.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.7 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.3 2 12 2Zm0 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.2-2.9a1.17 1.17 0 1 1 0 2.34 1.17 1.17 0 0 1 0-2.34Z" />
      </svg>
    ),
  },
  telegram: {
    gradient: "from-[#2AABEE] to-[#229ED9]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M22 4.5 2.7 12.1c-1.3.5-1.3 1.2-.2 1.6l4.9 1.5 1.9 5.8c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.1-2 4.3 3.2c.8.4 1.3.2 1.5-.7l2.8-13.3c.3-1.2-.4-1.7-1.3-1z" />
      </svg>
    ),
  },
  facebook: {
    gradient: "from-[#1877F2] to-[#0e5fce]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V9c0-.9.25-1.5 1.55-1.5H16.7V4.7c-.28-.04-1.25-.12-2.37-.12-2.35 0-3.96 1.43-3.96 4.06v2.27H7.6v3.1h2.77v8h3.13Z" />
      </svg>
    ),
  },
};

const defaultIcon = {
  gradient: "from-[#4b5563] to-[#1f2937]",
  icon: (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9s1.3-6.5 3.8-9Z" />
    </svg>
  ),
};

export default function ContactSection({
  content,
  showHeading = true,
  headingLevel = "h1",
}: {
  content: SiteContent;
  showHeading?: boolean;
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  return (
    <>
      <div className="relative h-px max-w-5xl mx-auto">
        <div className="absolute inset-x-4 sm:inset-x-6 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/50 to-transparent" />
      </div>

      {showHeading && (
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_30%,rgba(59,130,246,0.14),transparent_70%)]" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-16 text-center">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#ff8a1c] uppercase mb-4">
              Get In Touch
            </span>
            <Heading className="text-3xl sm:text-5xl font-extrabold text-white mb-5">
              {content.contactHeading}
            </Heading>
            <TranslatedText
              as="p"
              className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
              original={content.contactDescription}
              translations={content.translations}
              field="contactDescription"
            />
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-5">
          {content.socials.map((s) => {
            const visuals = iconMap[s.name.toLowerCase()] ?? defaultIcon;
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pop-card pop-hover group flex items-center gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl border border-white/10 bg-[#0d1330]/80 p-3 sm:p-5 hover:border-white/30 transition-colors"
              >
                <span
                  className={`flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${visuals.gradient} text-white shrink-0 [&_svg]:w-4 [&_svg]:h-4 sm:[&_svg]:w-6 sm:[&_svg]:h-6`}
                >
                  {visuals.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-white font-semibold text-sm sm:text-base truncate">
                    {s.name}
                  </span>
                  <span className="block text-white/50 text-xs sm:text-sm truncate">
                    {s.handle}
                  </span>
                </span>
                <span className="ml-auto hidden sm:inline text-white/30 group-hover:text-white/70 transition">
                  ↗
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="pop-card rounded-2xl border border-white/10 bg-[#0d1330]/80 p-8 sm:p-10 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Email</h2>
          <a
            href={`mailto:${content.email}`}
            className="text-[#ff8a1c] font-semibold hover:underline"
          >
            {content.email}
          </a>
        </div>
      </section>
    </>
  );
}
