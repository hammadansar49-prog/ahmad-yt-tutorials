import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GlowParticles from "@/components/GlowParticles";
import CustomCursor from "@/components/CustomCursor";
import ScrollTextEffect from "@/components/ScrollTextEffect";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
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
        <div className="relative z-10 flex flex-col flex-1 min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
