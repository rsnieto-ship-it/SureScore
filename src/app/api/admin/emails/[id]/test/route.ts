import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/ses";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const clientEmail = await prisma.clientEmail.findUnique({ where: { id } });

  if (!clientEmail) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  const result = await sendEmail({
    to: "roy@surescore.com",
    subject: `[TEST] ${clientEmail.subject}`,
    htmlBody: clientEmail.htmlBody,
    plainBody: clientEmail.plainBody || undefined,
    senderAlias: clientEmail.senderAlias,
  });

  if (result.success) {
    return NextResponse.json({ ok: true, messageId: result.messageId });
  } else {
    return NextResponse.json(
      { error: result.error || "Failed to send test email" },
      { status: 500 }
    );
  }
}
