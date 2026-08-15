import type { MetadataRoute } from "next";
import { getVideos } from "@/lib/videos-store";
import { ARTICLES } from "@/lib/articles-data";

const BASE_URL = "https://ahmadyttutorial.com";

const STATIC_ROUTES = [
  "",
  "/tutorials",
  "/articles",
  "/about",
  "/contact",
  "/disclaimer",
  "/privacy-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const videos = await getVideos().catch(() => []);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const tutorialEntries: MetadataRoute.Sitemap = videos.map((video) => ({
    url: `${BASE_URL}/tutorial/${video.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const articleEntries: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...tutorialEntries, ...articleEntries];
}
