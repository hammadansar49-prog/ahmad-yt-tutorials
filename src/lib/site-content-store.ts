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

export async function getSiteContent(): Promise<SiteContent> {
  const snap = await contentDocRef().get();
  return snap.data() as SiteContent;
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await contentDocRef().set(content);
}
