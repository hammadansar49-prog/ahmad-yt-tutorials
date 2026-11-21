import { NextResponse } from "next/server";
import { serverCard } from "@/lib/mcp-card";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(serverCard, {
    headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" },
  });
}
