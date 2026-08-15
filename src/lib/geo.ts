type HeaderSource = { get(name: string): string | null };

// Resolve a visitor's country from the incoming request. On Vercel this is
// instant (the platform sets a header). On other hosts (Hostinger, local),
// we fall back to a free IP geolocation lookup, which may fail or be slow
// for local/private IPs. Accepts anything with a `.get()` method, so it
// works with both a real Request (API routes) and the read-only Headers
// object returned by next/headers' `headers()` (Server Components).
export async function resolveCountry(source: HeaderSource): Promise<string> {
  const vercelCountry = source.get("x-vercel-ip-country");
  if (vercelCountry) return vercelCountry;

  const forwardedFor = source.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    source.get("x-real-ip") ||
    "";

  if (!ip || ip === "::1" || ip.startsWith("127.") || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return "Unknown";
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country`, {
      // Kept short since this now also runs in the root layout on every
      // page load (to resolve translation language server-side) — a slow
      // geolocation lookup shouldn't visibly delay every page.
      signal: AbortSignal.timeout(1200),
    });
    const data = await res.json();
    if (data.status === "success" && data.country) {
      return data.country as string;
    }
  } catch {
    // ignore, fall through
  }

  return "Unknown";
}
