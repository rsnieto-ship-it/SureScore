import { sendEmail } from "@/lib/ses";

/**
 * Internal admin notification (form submissions, etc.). Uses SES, the same
 * transport as our digest sends.
 *
 * Was nodemailer/Gmail until 2026-05-14 — the App Password was silently
 * revoked some time after 3/25/2026 and every real lead between then and
 * now (La Joya ISD, Spring Branch ISD, La Villa ISD) was dropped with
 * just a console.error. The lead-sweeper workflow now catches that class
 * of failure too, but switching to SES removes the failure mode.
 */
export async function sendNotification(subject: string, html: string) {
  const to = process.env.NOTIFICATION_EMAIL;
  if (!to) {
    console.warn("NOTIFICATION_EMAIL not set — skipping email notification");
    return;
  }

  const result = await sendEmail({
    to,
    subject,
    htmlBody: html,
    senderAlias: "info",
  });

  if (!result.success) {
    // Re-throw so the caller's catch block runs (which logs the error and
    // leaves FormSubmission.notified = false, picked up by the sweeper).
    throw new Error(result.error || "SES notification failed");
  }
}
