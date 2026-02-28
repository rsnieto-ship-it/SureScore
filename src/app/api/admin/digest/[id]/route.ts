import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const digest = await prisma.digest.findUnique({
    where: { id },
    include: {
      candidates: { orderBy: { position: "asc" } },
      _count: { select: { sends: true } },
    },
  });

  if (!digest) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(digest);
}
