import { createHmac, timingSafeEqual } from "crypto";

const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET!;
const SITE_URL = process.env.SITE_URL || "https://surescore.com";

export function generateToken(email: string): string {
  return createHmac("sha256", UNSUBSCRIBE_SECRET)
    .update(email.toLowerCase())
    .digest("hex");
}

export function verifyToken(email: string, token: string): boolean {
  const expected = generateToken(email);
  if (expected.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export function buildUnsubscribeUrl(email: string): string {
  const token = generateToken(email);
  const params = new URLSearchParams({ email: email.toLowerCase(), token });
  return `${SITE_URL}/api/unsubscribe?${params.toString()}`;
}
