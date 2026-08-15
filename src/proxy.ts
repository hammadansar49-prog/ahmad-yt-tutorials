import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveCountry } from "@/lib/geo";
import { languageForCountry } from "@/lib/country-language-map";

const LANG_COOKIE = "site_lang";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_session")?.value;
    if (!token || token !== process.env.SESSION_TOKEN) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  // Resolve the visitor's translation language once (geo IP lookup) and
  // cache it in a cookie, so every subsequent page load just reads the
  // cookie instead of paying for the lookup again — this only runs on a
  // visitor's very first request.
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    const existing = request.cookies.get(LANG_COOKIE)?.value;
    if (!existing) {
      try {
        const country = await resolveCountry(request.headers);
        const lang = languageForCountry(country);
        response.cookies.set(LANG_COOKIE, lang ?? "en", {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
      } catch {
        // If geolocation fails, don't block the request — just try again
        // next time (no cookie gets set).
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/((?!_next/static|_next/image|favicon.ico|icon.png|sw.js).*)"],
};
