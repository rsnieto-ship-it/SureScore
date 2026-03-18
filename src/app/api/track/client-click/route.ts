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
  if (!userAgent) return true;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("e");
  const clientEmailId = request.nextUrl.searchParams.get("c");
  const url = request.nextUrl.searchParams.get("u") || FALLBACK_URL;
  const confirmed = request.nextUrl.searchParams.get("confirmed");
  const userAgent = request.headers.get("user-agent");

  // Stage 1: First hit — serve an HTML page with JS redirect.
  // Bots won't execute JS, so they stop here.
  if (!confirmed) {
    const confirmUrl = new URL(request.url);
    confirmUrl.searchParams.set("confirmed", "1");

    const html = `<!DOCTYPE html>
<html><head>
<meta http-equiv="refresh" content="2;url=${url}">
<script>
fetch("${confirmUrl.toString()}", { keepalive: true });
window.location.replace("${url}");
</script>
</head>
<body>Redirecting...</body></html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Stage 2: JS callback — this is a real human click
  if (email && clientEmailId && !isBot(userAgent)) {
    prisma.clientEmailClick
      .create({ data: { email, clientEmailId, url } })
      .catch(() => {});
  }

  return new NextResponse(null, { status: 204 });
}
