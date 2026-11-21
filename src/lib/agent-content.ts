import { getVideos, getVideoBySlug, thumbnailSrc, type Video } from "@/lib/videos-store";
import { getSiteContent } from "@/lib/site-content-store";
import { ARTICLES } from "@/lib/articles-data";
import { SITE_URL, SITE_NAME, YOUTUBE_CHANNEL_URL, SAME_AS, absoluteUrl } from "@/lib/site";

// Shared, read-only content helpers for AI agents: the Markdown views,
// the public tutorials search API, WebMCP tools and the MCP server all
// go through these so they return exactly what the public pages show.

export type TutorialSummary = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tools: string[];
  url: string;
  youtubeUrl: string | null;
  thumbnail: string;
};

function summary(v: Video): TutorialSummary {
  return {
    slug: v.slug,
    title: v.title,
    description: v.description,
    category: v.category,
    tools: v.tools ?? [],
    url: `${SITE_URL}/tutorial/${v.slug}`,
    youtubeUrl: v.youtubeUrl || null,
    thumbnail: absoluteUrl(thumbnailSrc(v)),
  };
}

export async function searchTutorials(query = "", category = "", limit = 20) {
  const q = query.trim().toLowerCase();
  const videos = await getVideos();
  return videos
    .filter((v) =>
      (!q ||
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        (v.tools ?? []).some((t) => t.toLowerCase().includes(q))) &&
      (!category || v.category.toLowerCase() === category.toLowerCase())
    )
    .slice(0, Math.max(1, Math.min(limit, 100)))
    .map(summary);
}

export async function getTutorial(slug: string) {
  const v = await getVideoBySlug(slug);
  if (!v) return null;
  return {
    ...summary(v),
    prompts: v.prompts ?? [],
    faqs: (v.faqs ?? []).filter((f) => f.question && f.answer),
  };
}

export function listArticles() {
  return ARTICLES.map((a) => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    category: a.category,
    url: `${SITE_URL}/articles/${a.slug}`,
  }));
}

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}

// ---------- Markdown views ----------

const footer = `\n---\n${SITE_NAME} · ${SITE_URL} · YouTube: ${YOUTUBE_CHANNEL_URL}\n`;

function tutorialList(items: TutorialSummary[]) {
  return items
    .map((t) => `- [${t.title}](${t.url}) — ${t.category}${t.description ? `: ${t.description.replace(/\s+/g, " ").slice(0, 160)}` : ""}`)
    .join("\n");
}

export async function markdownFor(pathname: string): Promise<string | null> {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/" || path === "/tutorials") {
    const tutorials = await searchTutorials("", "", 100);
    const articles = listArticles();
    return `# ${SITE_NAME} — Free AI Video Prompts

Official website of the ${SITE_NAME} YouTube channel (${YOUTUBE_CHANNEL_URL}). Every tutorial page has the exact, tested AI video prompts used to make the video, free to copy.

## Tutorials (${tutorials.length})
${tutorialList(tutorials)}

## Articles
${articles.map((a) => `- [${a.title}](${a.url})`).join("\n")}

## Other pages
- [About](${SITE_URL}/about)
- [Contact](${SITE_URL}/contact)
- Profiles: ${SAME_AS.join(", ")}
${footer}`;
  }

  if (path.startsWith("/tutorial/")) {
    const t = await getTutorial(decodeURIComponent(path.slice("/tutorial/".length)));
    if (!t) return null;
    return `# ${t.title}

${t.description}

- Category: ${t.category}
- Tools: ${t.tools.join(", ") || "—"}
- Video: ${t.youtubeUrl ?? "coming soon"}
- Page: ${t.url}

## AI prompts
${t.prompts.map((p, i) => `### Prompt ${i + 1}\n\n\`\`\`text\n${p}\n\`\`\``).join("\n\n") || "_No prompts yet._"}
${t.faqs.length ? `\n## FAQ\n${t.faqs.map((f) => `### ${f.question}\n\n${f.answer}`).join("\n\n")}\n` : ""}${footer}`;
  }

  if (path === "/articles") {
    return `# Articles — ${SITE_NAME}\n\n${listArticles().map((a) => `- [${a.title}](${a.url}) — ${a.description}`).join("\n")}\n${footer}`;
  }

  if (path.startsWith("/articles/")) {
    const a = getArticle(decodeURIComponent(path.slice("/articles/".length)));
    if (!a) return null;
    const body = a.blocks.map((b) => ("h2" in b ? `## ${b.h2}` : b.p)).join("\n\n");
    return `# ${a.title}\n\n${a.description}\n\n${body}\n${footer}`;
  }

  if (path === "/about" || path === "/contact") {
    const c = await getSiteContent();
    if (path === "/about") return `# ${c.aboutHeading}\n\n${c.aboutDescription}\n${footer}`;
    return `# ${c.contactHeading}\n\n${c.contactDescription}\n\n${(c.socials ?? []).map((s) => `- ${s.name}: ${s.url}`).join("\n")}\n${footer}`;
  }

  return null;
}
