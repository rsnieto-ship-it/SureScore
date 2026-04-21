import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sotdTrialSchema } from "@/lib/schemas";
import { sendNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = sotdTrialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fill out all required fields correctly." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const submission = await prisma.formSubmission.create({
      data: {
        formType: "SOTD_TRIAL",
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
        source: "sotd-trial",
        status: "SUBSCRIBED",
      },
    });

    // Notify Roy
    try {
      await sendNotification(
        `New SOTD Trial Request from ${data.name} (${data.district})`,
        `<h2>New TSIA Strategy of the Day — Free Trial Request</h2>
         <p><strong>Name:</strong> ${data.name}</p>
         <p><strong>Email:</strong> ${data.email}</p>
         <p><strong>District:</strong> ${data.district}</p>
         <p><strong>Subject:</strong> ${data.subject === "math" ? "Math" : "ELAR"}</p>
         <p><strong>Preferred Start Date:</strong> ${data.startDate}</p>
         <p><strong>Notes:</strong> ${data.notes || "None"}</p>
         <hr />
         <p><em>Next step: Reply to ${data.email} with roster template (Student ID, First Name, Last Name, Campus Name) for up to 2 teachers.</em></p>`
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
