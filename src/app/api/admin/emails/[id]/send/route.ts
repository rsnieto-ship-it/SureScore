import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendBulkEmail } from "@/lib/ses";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const clientEmail = await prisma.clientEmail.findUnique({ where: { id } });

  if (!clientEmail) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  if (clientEmail.status === "SENT" || clientEmail.status === "SENDING") {
    return NextResponse.json(
      { error: `Email is already ${clientEmail.status.toLowerCase()}` },
      { status: 400 }
    );
  }

  // Mark as SENDING
  await prisma.clientEmail.update({
    where: { id },
    data: { status: "SENDING" },
  });

  try {
    // Build recipient list: contacts matching targetTags, minus unsubscribes
    let contactWhere: Record<string, unknown> = {
      status: "SUBSCRIBED",
    };

    if (clientEmail.targetTags.length > 0) {
      contactWhere.tags = {
        some: {
          tag: {
            name: { in: clientEmail.targetTags },
          },
        },
      };
    }

    const contacts = await prisma.contact.findMany({
      where: contactWhere,
      select: { email: true },
    });

    // Get unsubscribed emails for this list
    const unsubscriptions = await prisma.unsubscription.findMany({
      where: { list: clientEmail.list },
      select: { email: true },
    });
    const unsubSet = new Set(unsubscriptions.map((u) => u.email.toLowerCase()));

    // Also filter out contacts already sent to (in case of retry)
    const alreadySent = await prisma.clientEmailSend.findMany({
      where: { clientEmailId: id },
      select: { email: true },
    });
    const sentSet = new Set(alreadySent.map((s) => s.email.toLowerCase()));

    const recipients = contacts
      .map((c) => c.email)
      .filter((email) => {
        const lower = email.toLowerCase();
        return !unsubSet.has(lower) && !sentSet.has(lower);
      });

    if (recipients.length === 0) {
      await prisma.clientEmail.update({
        where: { id },
        data: { status: "SENT", sentAt: new Date(), sentCount: 0, failCount: 0 },
      });
      return NextResponse.json({ ok: true, sent: 0, failed: 0, total: 0 });
    }

    // Send emails
    const result = await sendBulkEmail({
      recipients,
      subject: clientEmail.subject,
      htmlBody: clientEmail.htmlBody,
      plainBody: clientEmail.plainBody || undefined,
      senderAlias: clientEmail.senderAlias,
    });

    // Record sends for successful emails
    const successfulEmails = recipients.filter(
      (email) => !result.errors.some((e) => e.email === email)
    );

    if (successfulEmails.length > 0) {
      await prisma.clientEmailSend.createMany({
        data: successfulEmails.map((email) => ({
          clientEmailId: id,
          email,
        })),
        skipDuplicates: true,
      });
    }

    // Update email status
    await prisma.clientEmail.update({
      where: { id },
      data: {
        status: result.failed === recipients.length ? "FAILED" : "SENT",
        sentAt: new Date(),
        sentCount: { increment: result.sent },
        failCount: { increment: result.failed },
      },
    });

    return NextResponse.json({
      ok: true,
      sent: result.sent,
      failed: result.failed,
      total: recipients.length,
      errors: result.errors,
    });
  } catch (error) {
    console.error("Send email error:", error);

    await prisma.clientEmail.update({
      where: { id },
      data: { status: "FAILED" },
    });

    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
