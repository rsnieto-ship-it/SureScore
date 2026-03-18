import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const SENDER_MAP: Record<string, string> = {
  info: "SureScore <info@surescore.com>",
  testprep: "SureScore Test Prep <testprep@surescore.com>",
  tia: "SureScore TIA <tia@surescore.com>",
};

function buildRawEmail(
  from: string,
  to: string,
  subject: string,
  htmlBody: string,
  plainBody?: string,
  headers?: Record<string, string>
): string {
  const boundary = `----=_Part_${Date.now().toString(36)}`;
  const lines: string[] = [];

  lines.push(`From: ${from}`);
  lines.push(`To: ${to}`);
  lines.push(`Subject: ${subject}`);
  lines.push(`MIME-Version: 1.0`);

  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      lines.push(`${key}: ${value}`);
    }
  }

  lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
  lines.push("");

  // Plain text part
  lines.push(`--${boundary}`);
  lines.push(`Content-Type: text/plain; charset=UTF-8`);
  lines.push(`Content-Transfer-Encoding: 7bit`);
  lines.push("");
  lines.push(plainBody || stripHtml(htmlBody));
  lines.push("");

  // HTML part
  lines.push(`--${boundary}`);
  lines.push(`Content-Type: text/html; charset=UTF-8`);
  lines.push(`Content-Transfer-Encoding: 7bit`);
  lines.push("");
  lines.push(htmlBody);
  lines.push("");
  lines.push(`--${boundary}--`);

  return lines.join("\r\n");
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function sendEmail({
  to,
  subject,
  htmlBody,
  plainBody,
  senderAlias = "info",
  headers,
}: {
  to: string;
  subject: string;
  htmlBody: string;
  plainBody?: string;
  senderAlias?: string;
  headers?: Record<string, string>;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const from = SENDER_MAP[senderAlias] || SENDER_MAP.info;
  const rawMessage = buildRawEmail(from, to, subject, htmlBody, plainBody, headers);

  try {
    const result = await ses.send(
      new SendRawEmailCommand({
        Source: from,
        Destinations: [to],
        RawMessage: { Data: new TextEncoder().encode(rawMessage) },
      })
    );
    return { success: true, messageId: result.MessageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function sendBulkEmail({
  recipients,
  subject,
  htmlBody,
  plainBody,
  senderAlias = "info",
  headers,
  onProgress,
}: {
  recipients: string[];
  subject: string;
  htmlBody: string;
  plainBody?: string;
  senderAlias?: string;
  headers?: Record<string, string>;
  onProgress?: (sent: number, failed: number, total: number) => void;
}): Promise<{ sent: number; failed: number; errors: Array<{ email: string; error: string }> }> {
  let sent = 0;
  let failed = 0;
  const errors: Array<{ email: string; error: string }> = [];

  for (let i = 0; i < recipients.length; i++) {
    const result = await sendEmail({
      to: recipients[i],
      subject,
      htmlBody,
      plainBody,
      senderAlias,
      headers,
    });

    if (result.success) {
      sent++;
    } else {
      failed++;
      errors.push({ email: recipients[i], error: result.error || "Unknown error" });
    }

    onProgress?.(sent, failed, recipients.length);

    // Rate limit: ~10 emails per second to stay well under SES limits
    if (i < recipients.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return { sent, failed, errors };
}

export { SENDER_MAP };
