import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/unsubscribe";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const token = request.nextUrl.searchParams.get("token");

  if (!email || !token) {
    return NextResponse.json(
      { error: "Missing email or token." },
      { status: 400 }
    );
  }

  if (!verifyToken(email, token)) {
    return NextResponse.json(
      { error: "Invalid or expired unsubscribe link." },
      { status: 400 }
    );
  }

  try {
    await prisma.contact.update({
      where: { email: email.toLowerCase() },
      data: { status: "UNSUBSCRIBED" },
    });
  } catch {
    // Contact may not exist — still redirect so the user sees confirmation
  }

  const siteUrl = process.env.SITE_URL || "https://surescore.com";
  return NextResponse.redirect(`${siteUrl}/unsubscribe/confirmed`);
}
