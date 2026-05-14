"""Lead sweeper — catches FormSubmission rows whose inline notification
never fired.

Runs daily via .github/workflows/lead-sweeper.yml. Belt-and-suspenders for
the case where the Next.js sendNotification path throws (Gmail App Password
revoked, SES throttle, network blip, etc.) — that path's catch block only
logs to console, so a single failure silently loses the lead forever.

Behavior:
  1. Find FormSubmission rows where notified = false AND createdAt is at
     least an hour old (gives the inline path time to retry/succeed).
  2. If any are found, email Roy + NOTIFICATION_EMAIL a structured summary.
  3. After the summary email is delivered, mark each row notified = true so
     we don't re-alert tomorrow.

Failures (DB, SES, anything) leave the rows un-marked so the next run picks
them up again. Loud is good here — there is no scenario where silent failure
is acceptable for leads.
"""
from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timedelta, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import boto3
import psycopg2
import psycopg2.extras


GRACE_MINUTES = 60
LOOKBACK_DAYS = 14  # ignore very old rows so a one-time backfill never explodes


def _fmt_lead(row: dict) -> tuple[str, str]:
    """Return (html_block, text_block) for one FormSubmission row."""
    data = row.get("data") or {}
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except json.JSONDecodeError:
            data = {}

    name = data.get("name") or " ".join(
        v for v in [data.get("firstName"), data.get("lastName")] if v
    ) or "(no name)"
    district = data.get("districtName") or data.get("district") or data.get("organization") or "(no district)"
    role = data.get("role") or data.get("title") or ""
    phone = data.get("phone") or ""
    interest = data.get("interest") or ""
    message = (data.get("message") or data.get("notes") or "").strip()

    submitted = row["createdAt"].astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    html = f"""
    <div style="border:1px solid #ddd; padding:14px; margin:10px 0; border-radius:6px;">
      <div style="font-size:17px; font-weight:bold;">{name} — {district}</div>
      <div style="color:#888; font-size:13px; margin-bottom:6px;">
        {role}{' • ' if role else ''}{row['formType']} form • Submitted {submitted}
      </div>
      <table style="font-size:14px;">
        <tr><td style="padding:2px 12px 2px 0; color:#666;">Email</td>
            <td><a href="mailto:{row['email']}">{row['email']}</a></td></tr>
        {'<tr><td style="padding:2px 12px 2px 0; color:#666;">Phone</td><td><a href="tel:' + phone + '">' + phone + '</a></td></tr>' if phone else ''}
        {'<tr><td style="padding:2px 12px 2px 0; color:#666;">Interest</td><td>' + interest + '</td></tr>' if interest else ''}
      </table>
      {'<div style="margin-top:8px; padding:8px; background:#f8f8f8; border-left:3px solid #4a90e2; font-style:italic;">' + message + '</div>' if message else ''}
    </div>
    """

    text_lines = [
        f"{name} — {district}",
        f"  Form:      {row['formType']}",
        f"  Submitted: {submitted}",
        f"  Email:     {row['email']}",
    ]
    if role:
        text_lines.append(f"  Role:      {role}")
    if phone:
        text_lines.append(f"  Phone:     {phone}")
    if interest:
        text_lines.append(f"  Interest:  {interest}")
    if message:
        text_lines.append(f"  Message:   {message}")
    return html, "\n".join(text_lines)


def _send_summary(rows: list[dict]) -> None:
    if not (os.environ.get("AWS_ACCESS_KEY_ID") and os.environ.get("AWS_SECRET_ACCESS_KEY")):
        raise RuntimeError("AWS credentials not set; cannot send sweeper summary")

    recipient = os.environ.get("NOTIFICATION_EMAIL") or os.environ.get("ROY_EMAIL", "roy@surescore.com")
    sender = os.environ.get("SES_SENDER", "SureScore Intel <info@surescore.com>")

    html_blocks: list[str] = []
    text_blocks: list[str] = []
    for r in rows:
        html_block, text_block = _fmt_lead(r)
        html_blocks.append(html_block)
        text_blocks.append(text_block)

    count = len(rows)
    subject = f"🚨 {count} unnotified lead{'s' if count != 1 else ''} (sweeper)"

    html = f"""
    <html><body style="font-family: Arial, sans-serif; max-width: 720px; margin: 0 auto; color: #222;">
    <h2 style="margin-bottom:4px;">🚨 {count} unnotified lead{'s' if count != 1 else ''}</h2>
    <p style="color:#666; margin-top:0;">
      These form submissions never triggered the inline notification email
      (Gmail/SES path threw). The daily lead-sweeper found them and is
      surfacing them so they don't get lost.
    </p>
    {''.join(html_blocks)}
    <hr>
    <p style="color:#888; font-size:12px;">
      Sweeper run: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}.
      After this email delivers, rows will be marked notified=true so we
      don't re-alert tomorrow.
    </p>
    </body></html>
    """

    text = (
        f"UNNOTIFIED LEADS — sweeper run\n"
        f"{'=' * 60}\n\n"
        + "\n\n".join(text_blocks)
        + f"\n\nSweeper run: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}\n"
    )

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = recipient
    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))

    ses = boto3.client(
        "ses",
        region_name=os.environ.get("AWS_SES_REGION", "us-east-1"),
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    ses.send_raw_email(
        Source=sender,
        Destinations=[recipient],
        RawMessage={"Data": msg.as_string()},
    )
    print(f"✅ Sweeper summary sent to {recipient} ({count} leads)")


def main() -> None:
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        sys.exit("❌ DATABASE_URL not set")

    cutoff = datetime.now(timezone.utc) - timedelta(minutes=GRACE_MINUTES)
    floor = datetime.now(timezone.utc) - timedelta(days=LOOKBACK_DAYS)

    conn = psycopg2.connect(db_url)
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            """
            SELECT id, "formType", email, data, "createdAt"
            FROM "FormSubmission"
            WHERE notified = false
              AND "createdAt" <= %s
              AND "createdAt" >= %s
            ORDER BY "createdAt" DESC
            """,
            (cutoff, floor),
        )
        rows = [dict(r) for r in cur.fetchall()]

        print(f"📋 Found {len(rows)} unnotified leads older than {GRACE_MINUTES} min, "
              f"newer than {LOOKBACK_DAYS} days")

        if not rows:
            print("✅ Nothing to report. Exiting clean.")
            return

        _send_summary(rows)

        # Only mark notified=true AFTER the summary email succeeds.
        ids = [r["id"] for r in rows]
        update_cur = conn.cursor()
        update_cur.execute(
            'UPDATE "FormSubmission" SET notified = true WHERE id = ANY(%s)',
            (ids,),
        )
        conn.commit()
        print(f"✅ Marked {len(ids)} rows notified=true")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
