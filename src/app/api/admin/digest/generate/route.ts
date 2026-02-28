import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  const { digestId } = await request.json();

  if (!digestId) {
    return NextResponse.json(
      { error: "digestId is required" },
      { status: 400 }
    );
  }

  // Verify the digest exists and has selected candidates
  const digest = await prisma.digest.findUnique({
    where: { id: digestId },
    include: {
      candidates: { where: { selected: true } },
    },
  });

  if (!digest) {
    return NextResponse.json({ error: "Digest not found" }, { status: 404 });
  }

  if (digest.candidates.length === 0) {
    return NextResponse.json(
      { error: "No candidates selected" },
      { status: 400 }
    );
  }

  // Run the Python generate script
  const scriptDir = path.resolve(
    process.cwd(),
    "..",
    "claude_stuff",
    "surescore-digest",
    "surescore-digest"
  );
  const envFile = path.join(scriptDir, ".env");

  try {
    const { stdout, stderr } = await execAsync(
      `cd "${scriptDir}" && source .env 2>/dev/null; python3 surescore_digest.py --generate ${digestId}`,
      { timeout: 120000, shell: "/bin/bash" }
    );

    if (stderr) {
      console.error("Generate stderr:", stderr);
    }
    console.log("Generate stdout:", stdout);

    // Reload the digest to get updated HTML
    const updated = await prisma.digest.findUnique({
      where: { id: digestId },
      select: { htmlContent: true, subject: true, status: true },
    });

    return NextResponse.json({
      ok: true,
      htmlContent: updated?.htmlContent ?? null,
      subject: updated?.subject ?? null,
      status: updated?.status ?? digest.status,
    });
  } catch (e) {
    console.error("Generate error:", e);
    return NextResponse.json(
      { error: "Generation failed. Check server logs." },
      { status: 500 }
    );
  }
}
