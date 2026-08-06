# Ahmad YT Tutorial

The official website for the **Ahmad YT Tutorial** YouTube channel. Every tutorial video uploaded to YouTube gets a matching entry here with its thumbnail and the exact AI prompt used to create it — visitors can copy the full prompt with one click.

Live locally at `http://localhost:3000` after running the dev server (see below).

## Features

- **Home page** — animated hero banner, live search (filters as you type), category filter tabs, and a responsive grid of tutorial cards.
- **Tutorial detail pages** — each tutorial gets its own dedicated page (`/tutorial/[slug]`) with a large thumbnail, title, tools used, a copy-able AI prompt box, and a "Watch Video" button linking to YouTube.
- **About page** — explains how the channel + prompt-sharing workflow works.
- **Contact page** — social links (YouTube, WhatsApp, Instagram, Telegram, Facebook) and email, all editable from the admin panel.
- **Admin panel** (`/admin`) — password-protected dashboard to:
  - Add / edit / delete tutorials (title, description, category, YouTube link, tools used, thumbnail upload, AI prompt)
  - Add / rename / delete categories (used as filter tabs on the home page)
  - Edit About & Contact page content and social links

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, Server Actions)
- [Tailwind CSS](https://tailwindcss.com) for styling
- File-based JSON storage (`src/data/*.json`) — no external database required
- Cookie-based session auth for the admin panel

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Admin Panel

Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in with the password set in `.env.local` (`ADMIN_PASSWORD`).

Create a `.env.local` file (not committed to git) with:

```
ADMIN_PASSWORD=your-password-here
SESSION_TOKEN=a-long-random-string
```

### Production Build

Development mode is intentionally slower (on-demand compilation). For real traffic, always build and run in production mode:

```bash
npm run build
npm run start
```

## Project Structure

```
src/
  app/
    (site)/          Public pages: home, about, contact, tutorial/[slug]
    admin/            Admin panel: login, dashboard, videos, categories, settings
  components/          Shared UI components (Navbar, VideoCard, CopyPromptBox, etc.)
  data/                 JSON data: videos.json, categories.json, site-content.json
  lib/                   Data access + Server Actions (auth, video CRUD, category CRUD)
public/
  banner.mp4, banner.jpg  Hero section media
  uploads/                 Thumbnails uploaded via the admin panel
```

## Content Editing

All tutorials, categories, and site text are stored as JSON files under `src/data/` and are edited exclusively through the admin panel — no manual file editing needed. Changes go live immediately.
