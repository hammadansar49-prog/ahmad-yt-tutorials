import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import GlowParticles from "@/components/GlowParticles";
import CustomCursor from "@/components/CustomCursor";
import ScrollTextEffect from "@/components/ScrollTextEffect";
import ScrollPopEffect from "@/components/ScrollPopEffect";
import ScrollWiggle from "@/components/ScrollWiggle";
import LanguageProvider from "@/components/LanguageProvider";
import { resolveCountry } from "@/lib/geo";
import { languageForCountry } from "@/lib/country-language-map";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmadyttutorial.com"),
  title: {
    default: "Ahmad YT Tutorial - AI Video Editing, Shorts & Tutorials",
    template: "%s",
  },
  description:
    "The official website of Ahmad YT Tutorial - get the full AI prompt for every YouTube tutorial, free to copy. AI video editing, Shorts, and growth tips.",
  keywords: [
    "Ahmad YT Tutorial",
    "YouTube tutorials",
    "AI video editing",
    "AI prompts",
    "YouTube shorts tutorial",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    siteName: "Ahmad YT Tutorial",
    title: "Ahmad YT Tutorial",
    description:
      "AI Video Editing, Shorts & Tutorials - copy the prompt for every video, free.",
    type: "website",
    url: "https://ahmadyttutorial.com",
    images: ["/icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad YT Tutorial",
    description:
      "AI Video Editing, Shorts & Tutorials - copy the prompt for every video, free.",
    images: ["/icon.png"],
  },
};

async function resolveLang(): Promise<string | null> {
  // The proxy (middleware) resolves this on a visitor's first request and
  // caches it in a cookie — read that first (instant, no network call).
  const cookieStore = await cookies();
  const cached = cookieStore.get("site_lang")?.value;
  if (cached) return cached === "en" ? null : cached;

  // Fallback for the rare case the proxy didn't run/set it in time.
  try {
    const hdrs = await headers();
    const country = await resolveCountry(hdrs);
    return languageForCountry(country);
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const lang = await resolveLang();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="relative min-h-full flex flex-col text-white"
        suppressHydrationWarning
      >
        <GlowParticles />
        <CustomCursor />
        <ScrollTextEffect />
        <ScrollPopEffect />
        <ScrollWiggle />
        <LanguageProvider initialLang={lang}>
          <div className="relative z-10 flex flex-col flex-1 min-h-full">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
