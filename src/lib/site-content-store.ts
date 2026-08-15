import { unstable_cache } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";

export type SocialLink = {
  name: string;
  handle: string;
  url: string;
};

export type SiteContent = {
  aboutHeading: string;
  aboutDescription: string;
  contactHeading: string;
  contactDescription: string;
  email: string;
  youtubeUrl: string;
  socials: SocialLink[];
  // { [languageCode]: { aboutDescription, contactDescription } }
  translations?: Record<string, Record<string, string>>;
};

const contentDocRef = () => adminDb.collection("config").doc("site-content");

async function fetchSiteContent(): Promise<SiteContent> {
  const snap = await contentDocRef().get();
  return snap.data() as SiteContent;
}

export const getSiteContent = unstable_cache(fetchSiteContent, ["site-content"], {
  tags: ["site-content"],
});

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await contentDocRef().set(content);
}
