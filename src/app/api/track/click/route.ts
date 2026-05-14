import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const FALLBACK_URL = "https://surescore.com";

// Known bot user-agent patterns (email security scanners). Used only to
// suppress noise in DigestClick analytics — we no longer email anyone on
// click, so the cost of a missed bot here is just a slightly inflated
// click count, not inbox spam.
const BOT_PATTERNS = [
  /barracuda/i, /proofpoint/i, /mimecast/i, /messagelabs/i,
  /fortiguard/i, /fortimail/i, /sophos/i, /symantec/i, /broadcom/i,
  /fireeye/i, /trendmicro/i, /microsoftpreview/i, /outlooksafebrowse/i,
  /safelinks/i, /googlebot/i, /bingbot/i, /slurp/i, /spider/i,
  /crawl/i, /bot\b/i, /scanner/i, /curl/i, /wget/i,
  /python-requests/i, /go-http-client/i,
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

// Per Roy's lead/prospect definition (CLAUDE.md memory): a CLICK is a warm
// prospect, NOT a lead. Form submissions are leads. Previously this route
// fired sendNotification on every CTA click, which on 2026-05-14 (the first
// send after SES transport was wired up) flooded Roy's inbox with hundreds
// of "Lead:" emails — most from email security gateway prefetches, none of
// which were actually leads. Click data is still recorded in DigestClick;
// real engagement signals come via the analytics report and form submissions.
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("e");
  const digestId = request.nextUrl.searchParams.get("d");
  const url = request.nextUrl.searchParams.get("u") || FALLBACK_URL;
  const userAgent = request.headers.get("user-agent");

  if (email && digestId && !isBot(userAgent)) {
    prisma.digestClick
      .create({ data: { email, digestId, url } })
      .catch(() => {});
  }

  return NextResponse.redirect(url, 302);
}
