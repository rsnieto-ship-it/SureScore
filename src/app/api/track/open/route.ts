import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 1x1 transparent PNG
const PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAB" +
    "Nl7BcQAAAABJRU5ErkJggg==",
  "base64"
);

// Known bot user-agent patterns (email security scanners)
const BOT_PATTERNS = [
  /barracuda/i,
  /proofpoint/i,
  /mimecast/i,
  /messagelabs/i,
  /fortiguard/i,
  /fortimail/i,
  /sophos/i,
  /symantec/i,
  /broadcom/i,
  /fireeye/i,
  /trendmicro/i,
  /microsoftpreview/i,
  /outlooksafebrowse/i,
  /safelinks/i,
  /googlebot/i,
  /bingbot/i,
  /spider/i,
  /crawl/i,
  /bot\b/i,
  /scanner/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /go-http-client/i,
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("e");
  const digestId = request.nextUrl.searchParams.get("d");
  const userAgent = request.headers.get("user-agent");

  if (email && digestId && !isBot(userAgent)) {
    prisma.digestOpen
      .create({ data: { email, digestId } })
      .catch(() => {});
  }

  return new NextResponse(PIXEL, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}
