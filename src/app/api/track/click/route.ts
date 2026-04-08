import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const FALLBACK_URL = "https://surescore.com";

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
  /slurp/i,
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
  if (!userAgent) return true; // No UA = likely a bot
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("e");
  const digestId = request.nextUrl.searchParams.get("d");
  const url = request.nextUrl.searchParams.get("u") || FALLBACK_URL;
  const userAgent = request.headers.get("user-agent");

  // Record the click if it's not a bot, then redirect to the destination
  if (email && digestId && !isBot(userAgent)) {
    prisma.digestClick
      .create({ data: { email, digestId, url } })
      .catch(() => {});
  }

  return NextResponse.redirect(url, 302);
}
