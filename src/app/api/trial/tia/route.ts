import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { tiaAnalysisSchema } from "@/lib/schemas";
import { sendNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = tiaAnalysisSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fill out all required fields correctly." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const submission = await prisma.formSubmission.create({
      data: {
        formType: "TIA_ANALYSIS",
        email: data.email,
        data: JSON.parse(JSON.stringify(data)),
      },
    });

    // Upsert contact record
    await prisma.contact.upsert({
      where: { email: data.email },
      update: {
        firstName: data.name.split(" ")[0],
        lastName: data.name.split(" ").slice(1).join(" ") || null,
        districtName: data.district,
      },
      create: {
        email: data.email,
        firstName: data.name.split(" ")[0],
        lastName: data.name.split(" ").slice(1).join(" ") || null,
        districtName: data.district,
        source: "tia-analysis",
        status: "SUBSCRIBED",
      },
    });

    // Notify Roy
    try {
      await sendNotification(
        `New TIA Analysis Request from ${data.name} (${data.district})`,
        `<h2>New TIA Appraiser Analysis Request</h2>
         <p><strong>Name:</strong> ${data.name}</p>
         <p><strong>Email:</strong> ${data.email}</p>
         <p><strong>District:</strong> ${data.district}</p>
         <p><strong>Notes:</strong> ${data.notes || "None"}</p>
         <hr />
         <p><em>Next step: Reply to ${data.email} to request their prior TIA submission data.</em></p>`
      );
      await prisma.formSubmission.update({
        where: { id: submission.id },
        data: { notified: true },
      });
    } catch (err) {
      console.error("Failed to send notification:", err);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
