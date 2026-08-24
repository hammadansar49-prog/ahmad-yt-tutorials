import { NextResponse } from "next/server";
import { getVideos } from "@/lib/videos-store";

// Video thumbnails/side pictures are stored as base64 data URIs directly on
// the Firestore document (no external image host). Embedding that raw data
// URI straight into every page's HTML (as <img src="data:...">) means the
// full image bytes get inlined into the page itself, every time, for every
// video shown — that's what was bloating pages like the admin videos list
// enough to blow past the hosting platform's response time. Serving the
// same bytes through a normal image URL instead means the browser requests
// it separately, lazily, and caches it like any other image — the page's
// own HTML stays small. The image content itself is unchanged.
export const dynamic = "force-dynamic";

function dataUriToResponse(dataUri: string | undefined): NextResponse {
  if (!dataUri || !dataUri.startsWith("data:")) {
    return new NextResponse("Not found", { status: 404 });
  }
  const match = dataUri.match(/^data:([^;]+);base64,([\s\S]*)$/);
  if (!match) return new NextResponse("Not found", { status: 404 });
  const [, contentType, base64] = match;
  const buffer = Buffer.from(base64, "base64");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; kind: string }> }
) {
  const { slug, kind } = await params;
  const videos = await getVideos();
  const video = videos.find((v) => v.slug === slug);
  if (!video) return new NextResponse("Not found", { status: 404 });

  if (kind === "thumbnail") {
    return dataUriToResponse(video.thumbnail);
  }

  const match = kind.match(/^side-(\d+)$/);
  if (match) {
    const index = Number(match[1]);
    return dataUriToResponse(video.sidePictures?.[index]);
  }

  return new NextResponse("Not found", { status: 404 });
}
