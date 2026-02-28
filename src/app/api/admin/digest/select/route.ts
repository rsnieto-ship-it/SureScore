import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const { digestId, candidateIds } = await request.json();

  if (!digestId || !Array.isArray(candidateIds)) {
    return NextResponse.json(
      { error: "digestId and candidateIds are required" },
      { status: 400 }
    );
  }

  if (candidateIds.length > 5) {
    return NextResponse.json(
      { error: "Select at most 5 candidates" },
      { status: 400 }
    );
  }

  // Deselect all candidates for this digest first
  await prisma.digestCandidate.updateMany({
    where: { digestId },
    data: { selected: false },
  });

  // Select the chosen ones
  if (candidateIds.length > 0) {
    await prisma.digestCandidate.updateMany({
      where: { id: { in: candidateIds } },
      data: { selected: true },
    });
  }

  return NextResponse.json({ ok: true });
}
