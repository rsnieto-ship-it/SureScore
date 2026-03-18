import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const email = await prisma.clientEmail.findUnique({
    where: { id },
    include: {
      sends: { orderBy: { sentAt: "desc" }, take: 100 },
    },
  });

  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  const [openCount, clickCount, uniqueOpens, uniqueClicks] = await Promise.all([
    prisma.clientEmailOpen.count({ where: { clientEmailId: id } }),
    prisma.clientEmailClick.count({ where: { clientEmailId: id } }),
    prisma.clientEmailOpen.groupBy({
      by: ["email"],
      where: { clientEmailId: id },
    }),
    prisma.clientEmailClick.groupBy({
      by: ["email"],
      where: { clientEmailId: id },
    }),
  ]);

  return NextResponse.json({
    email,
    stats: {
      totalOpens: openCount,
      totalClicks: clickCount,
      uniqueOpens: uniqueOpens.length,
      uniqueClicks: uniqueClicks.length,
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await prisma.clientEmail.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  if (existing.status !== "DRAFT") {
    return NextResponse.json(
      { error: "Only draft emails can be updated" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { subject, htmlBody, plainBody, senderAlias, targetTags, list } = body;

    const email = await prisma.clientEmail.update({
      where: { id },
      data: {
        ...(subject !== undefined && { subject }),
        ...(htmlBody !== undefined && { htmlBody }),
        ...(plainBody !== undefined && { plainBody }),
        ...(senderAlias !== undefined && { senderAlias }),
        ...(targetTags !== undefined && { targetTags }),
        ...(list !== undefined && { list }),
      },
    });

    return NextResponse.json({ email });
  } catch (error) {
    console.error("Update email error:", error);
    return NextResponse.json(
      { error: "Failed to update email" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await prisma.clientEmail.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  if (existing.status !== "DRAFT") {
    return NextResponse.json(
      { error: "Only draft emails can be deleted" },
      { status: 400 }
    );
  }

  await prisma.clientEmail.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
