# Session Note 3
**Date:** February 25, 2026

---

## Overview
Added click tracking to the SureScore Intel digest. Every story link and the CTA button now route through a redirect endpoint that logs clicks before sending the reader to the destination. Same pattern as open tracking but for link engagement.

---

## What Was Done

### Click Tracking API Endpoint
- **New route** (`src/app/api/track/click/route.ts`)
  - GET endpoint with query params: `e` (email), `d` (digestId), `u` (destination URL).
  - Logs a `DigestClick` record via Prisma (fire-and-forget — never blocks the redirect).
  - Returns a 302 redirect to the destination URL.
  - Falls back to `https://surescore.com` if no URL provided.

### DigestClick Database Model
- **Prisma schema** (`prisma/schema.prisma`) — Added `DigestClick` model:
  - Fields: `id` (cuid), `email`, `digestId`, `url`, `clickedAt` (auto-timestamped).
  - Indexes on `email` and `digestId`.
- **Migration** (`20260225212550_add_digest_click_tracking`) — Created `DigestClick` table in Railway Postgres.

### Digest Script Link Wrapping
- **Updated** `claude_stuff/surescore-digest/surescore-digest/surescore_digest.py`:
  - Added `_wrap_click_url(click_tracking_base, destination)` helper.
  - Added `click_tracking_base` parameter to `build_email_html()`.
  - Wrapped links through the click tracker:
    - Story headline links
    - "Read full story" links
    - CTA "Request a Demo" button
  - Left unwrapped: unsubscribe link, logo/header link, footer nav links.
  - Updated `send_email()` to build per-recipient click tracking base URL: `{SITE_URL}/api/track/click?e={email}&d={digestId}`

---

## Files Created
| File | Purpose |
|---|---|
| `src/app/api/track/click/route.ts` | Click tracking redirect endpoint |
| `prisma/migrations/20260225212550_add_digest_click_tracking/` | DigestClick migration |

## Files Modified
| File | Changes |
|---|---|
| `prisma/schema.prisma` | Added DigestClick model |
| `claude_stuff/surescore-digest/surescore-digest/surescore_digest.py` | Wrapped story + CTA links with click tracking URLs |

---

## Tracked URL Format
```
{SITE_URL}/api/track/click?e={email}&d={digestId}&u={encoded_destination}
```

---

## Verification
1. Prisma migration applied — DigestClick table exists in Railway Postgres.
2. Test: `curl -v "https://surescore.com/api/track/click?e=test@test.com&d=test&u=https://example.com"` — should 302 redirect.
3. Query the database to confirm click was logged.

---

## Next Steps
- Review [Parking Lot](parkinglot.md) for upcoming features and priorities
