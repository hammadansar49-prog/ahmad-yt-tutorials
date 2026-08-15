import { NextResponse } from "next/server";
import { incrementViews } from "@/lib/videos-store";
import { recordVisit } from "@/lib/site-stats-store";
import { resolveCountry } from "@/lib/geo";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const slug = typeof body.slug === "string" ? body.slug : null;

  const country = await resolveCountry(request.headers);
  await recordVisit(country);

  if (slug) {
    const views = await incrementViews(slug);
    return NextResponse.json({ views });
  }

  return NextResponse.json({ ok: true });
}
