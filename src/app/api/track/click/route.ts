import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendNotification } from "@/lib/email";

const FALLBACK_URL = "https://surescore.com";

// SureScore pages that indicate buying interest
const CTA_PATTERNS = [
  { pattern: /\/trial\/sotd/, label: "SOTD Free Trial" },
  { pattern: /\/trial\/tia/, label: "TIA Free Analysis" },
  { pattern: /\/services\/ai-tutor/, label: "AI Tutors" },
  { pattern: /\/services\/tia-platform/, label: "TIA Platform" },
  { pattern: /\/services\/strategy-of-the-day/, label: "Strategy of the Day" },
  { pattern: /\/services\/district-partnership/, label: "District Partnership" },
  { pattern: /\/contact/, label: "Contact Page" },
];

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

function getCTALabel(url: string): string | null {
  for (const { pattern, label } of CTA_PATTERNS) {
    if (pattern.test(url)) return label;
  }
  return null;
}

async function notifyLeadClick(email: string, url: string, ctaLabel: string) {
  try {
    // Look up contact info
    const contact = await prisma.contact.findUnique({
      where: { email },
      select: { firstName: true, lastName: true, districtName: true, title: true, phone: true },
    });

    const name = contact
      ? [contact.firstName, contact.lastName].filter(Boolean).join(" ") || email
      : email;
    const district = contact?.districtName || "Unknown district";
    const title = contact?.title || "";
    const phone = contact?.phone || "";

    await sendNotification(
      `Lead: ${name} (${district}) clicked ${ctaLabel}`,
      `<h2>Newsletter Lead Alert</h2>
       <p><strong>Who:</strong> ${name}</p>
       <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
       <p><strong>District:</strong> ${district}</p>
       ${title ? `<p><strong>Title:</strong> ${title}</p>` : ""}
       ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
       <p><strong>Clicked:</strong> ${ctaLabel}</p>
       <p><strong>URL:</strong> <a href="${url}">${url}</a></p>
       <hr />
       <p><em>This person clicked a CTA link in the SureScore Intel newsletter. Follow up!</em></p>`
    );
  } catch (err) {
    console.error("Failed to send lead notification:", err);
  }
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

    // Send lead notification for CTA clicks
    const ctaLabel = getCTALabel(url);
    if (ctaLabel) {
      // Fire and forget — don't delay the redirect
      notifyLeadClick(email, url, ctaLabel);
    }
  }

  return NextResponse.redirect(url, 302);
}
