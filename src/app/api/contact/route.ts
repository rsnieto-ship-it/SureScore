import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/schemas";
import { sendNotification } from "@/lib/email";

const INTEREST_LABELS: Record<string, string> = {
  "ai-tutors": "AI Tutors (TSIA2, SAT, ACT Prep)",
  "tia-platform": "TIA Data Platform",
  "district-partnership": "District Partnership",
  "strategy-of-the-day": "Strategy of the Day",
  "general": "General Information",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fill out all required fields correctly." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Save form submission
    const submission = await prisma.formSubmission.create({
      data: {
        formType: "CONTACT",
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
        phone: data.phone || null,
        districtName: data.district,
        title: data.role,
      },
      create: {
        email: data.email,
        firstName: data.name.split(" ")[0],
        lastName: data.name.split(" ").slice(1).join(" ") || null,
        phone: data.phone || null,
        districtName: data.district,
        title: data.role,
        source: "website",
        status: "SUBSCRIBED",
      },
    });

    // Send notification email
    try {
      await sendNotification(
        `New Demo Request from ${data.name} (${data.district})`,
        `<h2>New Demo Request</h2>
         <p><strong>Name:</strong> ${data.name}</p>
         <p><strong>Email:</strong> ${data.email}</p>
         <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
         <p><strong>District:</strong> ${data.district}</p>
         <p><strong>Role:</strong> ${data.role}</p>
         <p><strong>Interest:</strong> ${INTEREST_LABELS[data.interest] || data.interest}</p>
         <p><strong>Message:</strong></p>
         <p>${data.message}</p>`
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
