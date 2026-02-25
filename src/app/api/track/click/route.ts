import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const FALLBACK_URL = "https://surescore.com";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("e");
  const digestId = request.nextUrl.searchParams.get("d");
  const url = request.nextUrl.searchParams.get("u") || FALLBACK_URL;

  if (email && digestId) {
    // Fire-and-forget — never block the redirect
    prisma.digestClick
      .create({ data: { email, digestId, url } })
      .catch(() => {});
  }

  return NextResponse.redirect(url, 302);
}
