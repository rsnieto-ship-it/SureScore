import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendNotification(subject: string, html: string) {
  const to = process.env.NOTIFICATION_EMAIL;
  if (!to) {
    console.warn("NOTIFICATION_EMAIL not set — skipping email notification");
    return;
  }

  await transporter.sendMail({
    from: `SureScore Website <${process.env.GMAIL_ADDRESS}>`,
    to,
    subject,
    html,
  });
}
