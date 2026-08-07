// Resolve a visitor's country from the incoming request. On Vercel this is
// instant (the platform sets a header). On other hosts (Hostinger, local),
// we fall back to a free IP geolocation lookup, which may fail or be slow
// for local/private IPs.
export async function resolveCountry(request: Request): Promise<string> {
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  if (vercelCountry) return vercelCountry;

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "";

  if (!ip || ip === "::1" || ip.startsWith("127.") || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return "Unknown";
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country`, {
      signal: AbortSignal.timeout(2000),
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
