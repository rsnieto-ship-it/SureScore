import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50"));
  const status = searchParams.get("status") ?? "";

  const where: Record<string, unknown> = {};
  if (status) {
    where.status = status;
  }

  const [emails, total] = await Promise.all([
    prisma.clientEmail.findMany({
      where,
      include: {
        _count: { select: { sends: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.clientEmail.count({ where }),
  ]);

  return NextResponse.json({
    emails,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, htmlBody, plainBody, senderAlias, targetTags, list } = body;

    if (!subject || !htmlBody) {
      return NextResponse.json(
        { error: "subject and htmlBody are required" },
        { status: 400 }
      );
    }

    const email = await prisma.clientEmail.create({
      data: {
        subject,
        htmlBody,
        plainBody: plainBody || null,
        senderAlias: senderAlias || "info",
        targetTags: targetTags || [],
        list: list || "product-updates",
      },
    });

    return NextResponse.json({ email }, { status: 201 });
  } catch (error) {
    console.error("Create email error:", error);
    return NextResponse.json(
      { error: "Failed to create email" },
      { status: 500 }
    );
  }
}
