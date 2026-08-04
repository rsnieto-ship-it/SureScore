# Session Note 26 — Google News URLs Silently Gutted the Digest; Tuesday Send Blocked (2026-08-04)

## ⚠️ READ FIRST — UNFINISHED, TIME-CRITICAL

**`digest-send-batch1.yml` is DISABLED.** I disabled it manually at 12:16 UTC today to stop a broken newsletter from going to 2,966 subscribers. That workflow file holds *both* the Tuesday and Wednesday crons, so the Wednesday fallback is dead too.

**If it is still disabled at 12:00 UTC Wed 2026-08-05, no newsletter goes out this week at all.**

Re-enable with:
```
gh workflow enable digest-send-batch1.yml
```
Do NOT re-enable until the digest content is verified (see "How to finish" below) — the digest currently in the DB is the hollow one.

## Context
Roy asked to pick this week's articles before the Tuesday send. Batch `2026-08-03`, 15 candidates. The Tuesday auto-select fallback had already fired at 09:56 UTC and pre-picked 1, 2, 4, 10, 13. Roy chose **1, 2, 4, 5, 15**; `digest-select.yml` ran and succeeded at 12:13 UTC.

## What went wrong
Reading the saved digest back with `--show-digest` showed **only 1 of 5 stories had a real SureScore Take.** The other four had an empty take and only the RSS headline as synopsis.

Root cause: Google News `/rss/articles/` links are **opaque tokens, not HTTP redirects**. `requests.get()` on one lands on a JS shell with no article text, so `fetch_article_text()` returned `None`. Combined with commit `aa4410e` ("No SureScore Take without full article text" — correct behavior, it refuses to fabricate), those stories came out link-only.

**This failed silently.** The workflow exited 0 and went green. The fail-loud alerting from the 2026-07-06 audit does not cover this — it catches *runs* that didn't happen, not runs that produced empty content. A green digest-select run is NOT evidence the digest has takes.

Most feeds in the candidate pool are Google News feeds, so this has been degrading the majority of every week's batch. Only #1 and #13 in this week's batch of 15 had direct publisher URLs.

The in-code comment at the feed list asserted these tokens "cannot be resolved." **That was wrong** and is what made the bug invisible.

## Timing note (correct the workflow comment's claim)
`digest-send-batch1.yml` comments claim 90–200 min cron drift. **Recent actual drift is ~30–40 min**: 7/22 fired 12:33, 7/28 12:31, 7/29 12:41 UTC (cron is 12:00). Budget ~30 min after 12:00 UTC, not 90+. The block today landed with only ~15 min of margin because of this.

## The fix — PR #7, **OPEN, NOT MERGED**
https://github.com/rsnieto-ship-it/SureScore/pull/7
Branch: `fix/resolve-google-news-urls`

Adds `resolve_google_news_url()` to `digest-script/surescore_digest.py` — exchanges the token for the real publisher URL via the Google DotsSplashUi `batchexecute` RPC (signature + timestamp scraped from the article page). `fetch_article_text()` resolves first. Failures return the original URL, so worst case is the link-only behavior that already existed. Non-Google URLs pass through untouched.

Verified before/after on this week's picks:

| Story | Before | After |
|---|---:|---:|
| Texas colleges can consider CLT (Higher Ed Dive) | 0 | 3,484 chars |
| Alternative to SAT/ACT (Statesman) | 0 | 7,649 chars |
| SEC schools ranked by SAT (Longhorns Wire) | 0 | 11,760 chars |
| Teacher incentive pay (CBS19) | 0 | 0 — video page, host times out |

I could not merge it — `gh pr merge` was blocked twice by the Claude Code permission classifier. **Roy or the next session must merge it.**

## Article swap (approved by Roy, already done)
Pick #2 (CBS19, teacher incentive pay) resolves to a **video page** with no article body; cbs19.tv times out even at 45s. It will be link-only no matter what.

Replaced with the same SBEC/TIA story from a source that extracts: **Texas Tribune, "National teacher certification must comply with Texas' anti-DEI law"** (2026-07-24, 6,334 chars). Better story anyway — SBEC must reauthorize National Board Certification as a TIA pathway by Dec 31 2026 or it is automatically revoked.

Added via `digest-util.yml --add`, landed as **candidate #16**. Already in the DB.

Final pick list is therefore **1, 16, 4, 5, 15** (16 replaces 2).

## How to finish — in this order
1. **Merge PR #7.** `gh pr merge 7 --squash --delete-branch`. The select workflow checks out `main`; regenerating before the merge just reproduces the empty takes.
2. **Re-run select:** trigger `digest-select.yml` with picks `1,16,4,5,15`. Sends a review copy to Roy + Elizabeth only — this is safe, it does not mass-send.
3. **Verify content before enabling anything.** Get the newest `DigestHistory` id, then `python surescore_digest.py --show-digest <id>` (read-only). Confirm **all five stories have a non-empty TAKE and a real synopsis**, not just a headline. This is the step that was missing and caused the whole incident.
4. **Only then** `gh workflow enable digest-send-batch1.yml`. The Wednesday 12:00 UTC cron sends it; `DigestSendLog` dedupe prevents a double-send.
5. Confirm the Wednesday run actually sent (should take ~15-20 min, not ~20s — a 20s run means it deduped and sent to nobody).

Per CLAUDE.md this still counts as **this week's single send** — do not let a second one go out.

## Follow-ups worth doing (not started)
- **Add a content check to the fail-loud layer.** `--select`/`--generate` should exit nonzero and alert if any selected story ends with an empty take. This bug was invisible precisely because green ≠ correct. Highest-value item here.
- Fix the drift comment in `digest-send-batch1.yml` (says 90–200 min, actually ~30–40).
- The `batchexecute` RPC is a private Google endpoint and may break without notice. The direct publisher feeds (Community Impact, Houston Public Media) remain preferable; consider adding more direct feeds to reduce reliance on it.
- Consider having `--preview` flag candidates whose URLs won't extract, so bad picks are visible at selection time rather than after generation.

## State at session end
| Item | Status |
|---|---|
| Tuesday mass send | 🔴 Blocked, did not fire — nothing sent to subscribers |
| `digest-send-batch1.yml` | 🔴 **Disabled** — re-enable before Wed 12:00 UTC |
| PR #7 (the fix) | 🟡 Open, needs merge |
| Candidate #16 (Tribune TIA) | ✅ Added to batch `2026-08-03` |
| Digest in DB | 🟡 Still the hollow version — **do not send as-is** |
| Subscribers affected | ✅ None — caught before send |
