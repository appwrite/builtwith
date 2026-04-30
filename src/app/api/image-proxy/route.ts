import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
    return new NextResponse("Invalid or missing URL parameter", { status: 400 });
  }

  try {
    const upstream = await fetch(imageUrl, { signal: AbortSignal.timeout(3000) });
    if (!upstream.ok) throw new Error("Failed to fetch image");

    const contentType = upstream.headers.get("Content-Type");
    if (!contentType || !contentType.startsWith("image/")) {
      throw new Error("Invalid content type");
    }

    const cacheControl =
      upstream.headers.get("Cache-Control") || "public, max-age=31536000";
    const buffer = Buffer.from(await upstream.arrayBuffer());

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": cacheControl,
      },
    });
  } catch {
    return new NextResponse("Error fetching image", { status: 400 });
  }
}
