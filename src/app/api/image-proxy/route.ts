import { NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const runtime = "nodejs";

const PRIVATE_IPV4 = [
  /^0\./,
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
  /^224\./,
  /^240\./,
  /^255\.255\.255\.255$/,
];

const isPrivateIp = (ip: string) => {
  if (isIP(ip) === 6) {
    return (
      ip === "::1" ||
      /^fc/i.test(ip) ||
      /^fd/i.test(ip) ||
      /^fe80/i.test(ip) ||
      /^::ffff:/i.test(ip) ||
      ip === "::"
    );
  }
  return PRIVATE_IPV4.some((re) => re.test(ip));
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Missing URL parameter", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(imageUrl);
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return new NextResponse("Unsupported protocol", { status: 400 });
  }

  // Block direct private-IP literals before DNS resolution.
  if (isIP(parsed.hostname) && isPrivateIp(parsed.hostname)) {
    return new NextResponse("Forbidden host", { status: 400 });
  }

  // DNS-resolve the hostname and reject any private/loopback/link-local result
  // to defend against rebinding and metadata endpoints (169.254.169.254, etc).
  try {
    const records = await lookup(parsed.hostname, { all: true });
    if (records.some((r) => isPrivateIp(r.address))) {
      return new NextResponse("Forbidden host", { status: 400 });
    }
  } catch {
    return new NextResponse("Unresolvable host", { status: 400 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      signal: AbortSignal.timeout(3000),
      redirect: "manual",
    });

    if (upstream.status >= 300 && upstream.status < 400) {
      return new NextResponse("Redirects not allowed", { status: 400 });
    }
    if (!upstream.ok) {
      return new NextResponse("Upstream error", { status: 400 });
    }

    const contentType = upstream.headers.get("Content-Type");
    if (!contentType || !contentType.startsWith("image/")) {
      return new NextResponse("Not an image", { status: 400 });
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
