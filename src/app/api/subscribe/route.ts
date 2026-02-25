import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { subscribeSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    await prisma.contact.upsert({
      where: { email },
      update: { status: "SUBSCRIBED" },
      create: {
        email,
        source: "website",
        status: "SUBSCRIBED",
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
