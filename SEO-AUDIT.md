# SEO Audit – ahmadyttutorial.com

Method: the claude-seo `seo-audit` checklist. I crawled the live site (all 36 sitemap URLs) on 2026-11-21, then fixed the code.

## Score (estimate)

| Category | Before | After deploy |
|---|---|---|
| Technical SEO | 70 | 85 |
| Content quality | 70 | 70 |
| On-page (titles, descriptions, headings) | 55 | 85 |
| Schema / structured data | 25 | 90 |
| Performance | 35 | 70 |
| AI search readiness | 40 | 75 |
| Images | 70 | 85 |
| **Overall** | **~55** | **~80** |

## Already good
- robots.txt and sitemap.xml are present and correct. Admin and API are blocked.
- Every page has a canonical URL, one `<h1>` and alt text on its images.
- Content is server-rendered: 18 articles with 1000+ words each, and tutorials with 900–1900 words.

## Problems found and fixed in code
1. **Home page HTML was 2.3 MB** (9 thumbnails embedded as base64, plus every prompt). Grids now get a light list, and images load from `/api/image/...` (cacheable and resized by next/image). This is the biggest speed/Core Web Vitals win.
2. **No structured data on home or tutorial pages.**
   - Home: `WebSite` + `SearchAction`, `Organization` (with `sameAs` to YouTube, Instagram, Telegram and Facebook) and `ItemList`.
   - Tutorials: `VideoObject` (YouTube embed URL, thumbnail, author = channel), `BreadcrumbList`, and `FAQPage` built from the FAQs you already write.
   - Articles: `Article` now has url, author, image and logo, plus `BreadcrumbList`.
3. **Titles too long** (up to 117 characters, so Google cuts them). The " - Ahmad YT Tutorial" suffix is now added only when the title stays under 60 characters.
4. **Descriptions too long** (home 239 characters, some tutorials 371). They are now trimmed to about 155 characters at a word boundary.
5. Tutorial OG type is now `video.other` with the video URL. Google can show large image and video previews (`max-image-preview: large`).
6. Sitemap: tutorial thumbnails added as image entries, and `lastModified` uses the real update date.
7. New tutorials now save `createdAt`/`updatedAt`. Google needs `uploadDate` for video rich results.
8. `public/llms.txt` added for ChatGPT, Perplexity and other AI search engines.
9. Google Search Console verification through the `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env variable.

## You have to do these
1. **Old tutorials need a date:** open each one in admin and click Save once. That adds `createdAt`, and the video can then appear in Google's video results.
2. **Google Search Console:** add the site (DNS or HTML-tag verification), submit `https://ahmadyttutorial.com/sitemap.xml`, and use "Request indexing" on the main pages. Do the same in Bing Webmaster Tools.
3. **YouTube:** put the website link in the channel's About → Links, and the matching tutorial page link in the first line of every video description. Links from YouTube are your biggest traffic source.
4. **Tutorial titles:** keep them under 60 characters with the search keyword first (e.g. "Baby Penguin AI Video with Google Flow – Free Prompt"). Fewer emojis.
5. Make a 1200×630 OG image for the home page. A square icon is used right now.
6. About page: add more detail on who Ahmad is, experience and channel stats (E-E-A-T).
7. Link each article to related tutorials, and each tutorial to 2–3 related articles (internal links).
