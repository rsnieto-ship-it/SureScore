"""Dry-run the new score_candidate_relevance() filter against the latest
candidate batch. Calls the production function directly so this verifies
both the LLM scoring AND the Texas escape-hatch.

Run from the digest-script/ directory:
    source /path/to/.env && python3 dry_run_relevance.py
"""
import os
import sys
import psycopg2

# Import the production functions
import surescore_digest as sd


def main():
    if not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("❌ ANTHROPIC_API_KEY not set")
    if not os.environ.get("DATABASE_URL"):
        sys.exit("❌ DATABASE_URL not set")

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    batch_date, candidates = sd.load_latest_candidates(conn)
    if not candidates:
        sys.exit("❌ No candidate batch found")

    print(f"📦 Latest candidate batch: {batch_date} ({len(candidates)} stories)")
    tx_count = sum(1 for s in candidates if s.get("is_texas") or s.get("texas"))
    print(f"   ({tx_count} flagged as Texas)\n")

    kept = sd.score_candidate_relevance(candidates)

    print(f"\n📋 KEPT {len(kept)}/{len(candidates)}:\n")
    for s in kept:
        tx = "TX" if (s.get("is_texas") or s.get("texas")) else "  "
        score = s.get("relevance_score", "?")
        print(f"  [{tx}] score={score}  {s['title'][:75]}")

    conn.close()


if __name__ == "__main__":
    main()
