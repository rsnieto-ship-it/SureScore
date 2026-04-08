import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const BOT_PATTERNS = [
  /barracuda/i, /proofpoint/i, /mimecast/i, /messagelabs/i,
  /fortiguard/i, /fortimail/i, /sophos/i, /symantec/i,
  /broadcom/i, /fireeye/i, /trendmicro/i, /microsoftpreview/i,
  /outlooksafebrowse/i, /safelinks/i, /googlebot/i, /bingbot/i,
  /spider/i, /crawl/i, /bot\b/i, /scanner/i, /curl/i, /wget/i,
  /python-requests/i, /go-http-client/i,
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return BOT_PATTERNS.some((p) => p.test(userAgent));
}

export async function POST(request: NextRequest) {
  const userAgent = request.headers.get("user-agent");
  if (isBot(userAgent)) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const body = await request.json();
    const { sessionId, digestId, email, timeOnPage, maxScroll } = body;

    if (!sessionId || !digestId) {
      return new NextResponse(null, { status: 400 });
    }

    const referrer = request.headers.get("referer") || null;

    // Upsert: create on first beacon, update on subsequent ones
    await prisma.$executeRawUnsafe(
      `INSERT INTO "DigestPageView" (id, "digestId", "sessionId", email, "timeOnPage", "maxScroll", "userAgent", referrer, "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       ON CONFLICT ("sessionId") DO UPDATE SET
         "timeOnPage" = $4,
         "maxScroll" = GREATEST("DigestPageView"."maxScroll", $5),
         "updatedAt" = NOW()`,
      digestId,
      sessionId,
      email || null,
      Math.min(timeOnPage || 0, 3600),
      Math.min(maxScroll || 0, 100),
      (userAgent || "").slice(0, 500),
      (referrer || "").slice(0, 500),
    );
  } catch {
    // Fire-and-forget — don't break the user experience
  }

  return new NextResponse(null, { status: 204 });
}
