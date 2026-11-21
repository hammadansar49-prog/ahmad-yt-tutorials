import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_session")?.value;
    if (!token || token !== process.env.SESSION_TOKEN) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Serve Markdown to agents that ask for it on public pages.
  const accept = request.headers.get("accept") ?? "";
  if (
    accept.includes("text/markdown") &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    !/\.[a-z0-9]+$/i.test(pathname)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/api/markdown";
    url.search = `?path=${encodeURIComponent(pathname)}`;
    const headers = new Headers(request.headers);
    headers.set("x-markdown-path", pathname);
    return NextResponse.rewrite(url, { request: { headers } });
  }

  const res = NextResponse.next();
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    res.headers.set("Vary", "Accept");
    res.headers.set(
      "Link",
      '</llms.txt>; rel="describedby"; type="text/plain", </.well-known/mcp/server-card.json>; rel="mcp-server-card"'
    );
  }
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/((?!_next/static|_next/image|favicon.ico|icon.png|sw.js).*)"],
};
