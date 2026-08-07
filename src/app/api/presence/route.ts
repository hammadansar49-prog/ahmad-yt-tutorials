import { NextResponse } from "next/server";
import { heartbeat, getOnlineCount } from "@/lib/presence-store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;
  if (sessionId) heartbeat(sessionId);
  return NextResponse.json({ online: getOnlineCount() });
}

export async function GET() {
  return NextResponse.json({ online: getOnlineCount() });
}
