import { markdownFor } from "@/lib/agent-content";

// Reached via a rewrite in src/proxy.ts when a request to a public page
// sends `Accept: text/markdown`.
export async function GET(request: Request) {
  const path =
    request.headers.get("x-markdown-path") ||
    new URL(request.url).searchParams.get("path") ||
    "/";
  const md = await markdownFor(path).catch((e) => {
    console.error("markdown error", e);
    return null;
  });
  if (md === null) {
    return new Response("# Not found\n", {
      status: 404,
      headers: { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept" },
    });
  }
  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Cache-Control": "public, max-age=300",
      "X-Robots-Tag": "noindex",
    },
  });
}
