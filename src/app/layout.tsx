import type { Metadata } from "next";
import { Geist_Mono, Inter, Instrument_Serif } from "next/font/google";
import ScrollTextEffect from "@/components/ScrollTextEffect";
import ScrollPopEffect from "@/components/ScrollPopEffect";
import ScrollWiggle from "@/components/ScrollWiggle";
import LanguageProvider from "@/components/LanguageProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="relative min-h-full flex flex-col bg-white text-ink"
        suppressHydrationWarning
      >
        <ScrollTextEffect />
        <ScrollPopEffect />
        <ScrollWiggle />
        <LanguageProvider initialLang={null}>
          <div className="relative z-10 flex flex-col flex-1 min-h-full">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
