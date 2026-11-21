import { NextResponse } from "next/server";
import { searchTutorials, getTutorial } from "@/lib/agent-content";

// Public, read-only JSON search used by the WebMCP tools.
export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const slug = sp.get("slug");
  if (slug) {
    const t = await getTutorial(slug);
    return t
      ? NextResponse.json(t)
      : NextResponse.json({ error: "Tutorial not found" }, { status: 404 });
  }
  const results = await searchTutorials(
    sp.get("q") ?? "",
    sp.get("category") ?? "",
    Number(sp.get("limit") ?? 20) || 20
  );
  return NextResponse.json({ results });
}
