import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { bookingSchema } from "@/lib/schemas";
import { sendNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fill out all required fields correctly." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Save form submission (no contact upsert — these are parents/students)
    await prisma.formSubmission.create({
      data: {
        formType: "BOOKING",
        email: data.email,
        data: JSON.parse(JSON.stringify(data)),
      },
    });

    // Send notification email
    await sendNotification(
      `New Booking from ${data.parentName} for ${data.studentName}`,
      `<h2>New Consultation Booking</h2>
       <p><strong>Student:</strong> ${data.studentName}</p>
       <p><strong>Parent/Guardian:</strong> ${data.parentName}</p>
       <p><strong>Email:</strong> ${data.email}</p>
       <p><strong>Phone:</strong> ${data.phone}</p>
       <p><strong>Program:</strong> ${data.program}</p>
       <p><strong>Grade:</strong> ${data.grade}</p>
       <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
       <p><strong>Notes:</strong> ${data.notes || "None"}</p>`
    ).catch((err) => console.error("Failed to send notification:", err));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
