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
  // Recipient is code-controlled and defaults to Roy. Production's
  // NOTIFICATION_EMAIL env var was stuck on admin@surescore.com — an
  // unwatched mailbox on a Vercel team we can't access — so real leads
  // (Huntsville/Winnsboro/Vernon ISD, 2026-06-11) were silently lost.
  // Set LEAD_NOTIFICATION_EMAIL to override; otherwise everything goes to Roy.
  const to = process.env.LEAD_NOTIFICATION_EMAIL || "roy@surescore.com";

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
