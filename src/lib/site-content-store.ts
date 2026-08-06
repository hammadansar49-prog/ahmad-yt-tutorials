import fs from "fs/promises";
import path from "path";

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
};

const filePath = path.join(process.cwd(), "src/data/site-content.json");

export async function getSiteContent(): Promise<SiteContent> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), "utf-8");
}
