#!/usr/bin/env python3
"""
SureScore Intel — Weekly Curated News Digest Generator
======================================================
Pulls college admissions & TSIA news, lets Roy curate the top 5,
generates SureScore Takes via Claude API, and emails the digest.

Usage:
    python surescore_digest.py --preview        # Friday: fetch 20 candidates, email numbered list
    python surescore_digest.py --check-reply    # Monday: parse Roy's reply, generate takes, send
    python surescore_digest.py --select 1,3,7,12,15  # Manual: pick by number, generate + send
    python surescore_digest.py --auto           # Legacy: fully automated (fallback)

Setup:
    See the Setup Guide for full instructions. Quick version:
    1. pip install anthropic feedparser requests
    2. Set environment variables (see .env.example)
    3. Run: python surescore_digest.py --preview
"""

import os
import re
import sys
import json
import time
import hmac
import hashlib
import argparse
import imaplib
import email as email_lib
import smtplib
import ssl
import boto3
from botocore.exceptions import ClientError
import psycopg2
import psycopg2.extras
import feedparser
import requests
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timedelta
from urllib.parse import urlencode
from anthropic import Anthropic

# ============================================================
# DATABASE SETUP — PostgreSQL (migrated from SQLite 2026-03-24)
# ============================================================

def init_db():
    """Connect to the PostgreSQL database.

    Tables are managed by Prisma migrations in the surescore-new app.
    Models: SatireHeadline, DigestHistory, DigestStory, CandidateStory, DigestSendLog.
    """
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL not set. Cannot connect to PostgreSQL.")
        sys.exit(1)
    try:
        conn = psycopg2.connect(database_url)
        conn.autocommit = False
        return conn
    except Exception as e:
        print(f"❌ PostgreSQL connection failed: {e}")
        sys.exit(1)


def seed_satire(conn):
    """Seed the satire headlines table with the curated 10-week rotation.

    Uses ON CONFLICT DO NOTHING so re-runs are safe (idempotent).
    """
    headlines = [
        'Teen Who Founded 3 Nonprofits Unable to Explain What Any of Them Do',
        'Admissions Consultant Reminds Family That $40,000 Retainer Does Not, Technically, Guarantee Anything',
        'Student\'s "Unique Perspective" Essay Identical to 14,000 Other "Unique Perspective" Essays',
        'Local Father Hasn\'t Spoken to Daughter Since She Listed His Alma Mater as a Safety School',
        'Area Teen Lists 11 Years of Travel Soccer as Community Service',
        'BREAKING: Kid Who "Doesn\'t Even Want to Go There" Spotted Sobbing in Car After Rejection',
        'College Board Unveils $400 "Platinum SAT" Where Students Get Extra 10 Minutes and a Sparkling Water',
        'Mom Who Said "We\'ll Be Proud No Matter What" Caught Googling Transfer Acceptance Rates 30 Minutes After Decision',
        'Report Finds 100% of Students Who Wrote Essay About Hiking Trip Were Actually Describing a Resort Shuttle Ride',
        'Overachieving Junior Already Pre-Grieving Colleges She Hasn\'t Been Rejected From Yet',
    ]
    cur = conn.cursor()
    for headline in headlines:
        cur.execute(
            'INSERT INTO "SatireHeadline" (id, headline) VALUES (%s, %s) ON CONFLICT (headline) DO NOTHING',
            (_generate_cuid(), headline)
        )
    conn.commit()


def get_next_satire_headline(conn):
    """Pick the least-recently-used active satire headline."""
    cur = conn.cursor()
    cur.execute("""
        SELECT id, headline FROM "SatireHeadline"
        WHERE active = true
        ORDER BY "timesUsed" ASC, "lastUsedAt" ASC NULLS FIRST, id ASC
        LIMIT 1
    """)
    row = cur.fetchone()
    if row:
        return row[0], row[1]
    return None, None


def mark_satire_used(conn, headline_id):
    """Mark a satire headline as used (increment counter + set timestamp)."""
    cur = conn.cursor()
    cur.execute("""
        UPDATE "SatireHeadline"
        SET "timesUsed" = "timesUsed" + 1, "lastUsedAt" = NOW()
        WHERE id = %s
    """, (headline_id,))
    conn.commit()


def save_digest_to_db(conn, stories, recipients):
    """Save a complete digest (history + stories) to PostgreSQL. Returns the digest ID."""
    cur = conn.cursor()

    satire_id = None
    for s in stories:
        if s.get("satire") and s.get("_headline_id"):
            satire_id = s["_headline_id"]
            break

    digest_cuid = _generate_cuid()
    cur.execute("""
        INSERT INTO "DigestHistory" (id, recipients, "storyCount", "satireHeadlineId")
        VALUES (%s, %s, %s, %s)
        RETURNING id
    """, (digest_cuid, ", ".join(recipients), len(stories), satire_id))
    digest_id = cur.fetchone()[0]

    for i, story in enumerate(stories):
        bullets_json = json.dumps(story.get("bullets", [])) if story.get("bullets") else None
        highlights_json = json.dumps(story.get("highlights", [])) if story.get("highlights") else None
        cur.execute("""
            INSERT INTO "DigestStory"
            (id, "digestId", position, title, summary, source, category, link, take, published,
             "isTexas", "isSatire", bullets, synopsis, highlights, relevance)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            _generate_cuid(), digest_id, i + 1,
            story.get("title", ""), story.get("summary", ""),
            story.get("source", ""), story.get("category", ""),
            story.get("link", ""), story.get("take", ""),
            story.get("published", ""),
            bool(story.get("texas")),
            bool(story.get("satire")),
            bullets_json,
            story.get("synopsis", ""),
            highlights_json,
            story.get("relevance", ""),
        ))

    conn.commit()
    return digest_id


def load_digest_from_db(conn, digest_id):
    """Load a previously saved digest from PostgreSQL (no API calls).

    digest_id can be a CUID string or an integer (for backward compatibility
    with command-line usage like --send-digest 36). Integer IDs are resolved
    by finding the Nth digest in chronological order.
    """
    cur = conn.cursor()

    # Support integer IDs by mapping to the Nth digest chronologically
    if isinstance(digest_id, int) or (isinstance(digest_id, str) and digest_id.isdigit()):
        offset = int(digest_id) - 1
        cur.execute("""
            SELECT id FROM "DigestHistory" ORDER BY "sentAt" ASC LIMIT 1 OFFSET %s
        """, (offset,))
        row = cur.fetchone()
        if not row:
            return None
        digest_id = row[0]
    else:
        cur.execute('SELECT id FROM "DigestHistory" WHERE id = %s', (digest_id,))
        if not cur.fetchone():
            return None

    cur.execute("""
        SELECT title, summary, source, category, link, take, published,
               "isTexas", "isSatire", bullets, synopsis, highlights, relevance
        FROM "DigestStory"
        WHERE "digestId" = %s
        ORDER BY position
    """, (digest_id,))

    stories = []
    for row in cur.fetchall():
        bullets = []
        if row[9]:
            try:
                bullets = json.loads(row[9])
            except (json.JSONDecodeError, TypeError):
                pass
        highlights = []
        if row[11]:
            try:
                highlights = json.loads(row[11])
            except (json.JSONDecodeError, TypeError):
                pass
        stories.append({
            "title": row[0],
            "summary": row[1],
            "source": row[2],
            "category": row[3],
            "link": row[4],
            "take": row[5],
            "published": row[6],
            "texas": bool(row[7]),
            "satire": bool(row[8]),
            "bullets": bullets,
            "synopsis": row[10] or "",
            "highlights": highlights,
            "relevance": row[12] or "",
        })

    return stories


# ============================================================
# POSTGRESQL BRIDGE (mirrors data to Next.js Prisma database)
# ============================================================

def _get_pg_conn():
    """Get a psycopg2 connection to the PostgreSQL database."""
    import psycopg2
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        return None
    try:
        return psycopg2.connect(database_url)
    except Exception as e:
        print(f"⚠️  PG connection failed: {e}")
        return None


def _generate_cuid():
    """Generate a cuid-like ID for Prisma compatibility."""
    import random, string
    chars = string.ascii_lowercase + string.digits
    return 'c' + ''.join(random.choices(chars, k=24))


def pg_create_digest(week_of):
    """Create a Digest record in PostgreSQL, return its ID."""
    pg = _get_pg_conn()
    if not pg:
        return None
    try:
        cuid = _generate_cuid()
        cur = pg.cursor()
        cur.execute("""
            INSERT INTO "Digest" (id, "weekOf", status, "createdAt", "updatedAt")
            VALUES (%s, %s, 'PENDING_REVIEW', NOW(), NOW())
            RETURNING id
        """, (cuid, week_of))
        digest_id = cur.fetchone()[0]
        pg.commit()
        cur.close()
        pg.close()
        print(f"   📦 PG Digest created: {digest_id}")
        return digest_id
    except Exception as e:
        print(f"⚠️  PG create digest failed: {e}")
        pg.close()
        return None


def pg_save_candidates(digest_id, stories):
    """Write candidate stories as DigestCandidate rows in PostgreSQL."""
    pg = _get_pg_conn()
    if not pg:
        return
    try:
        cur = pg.cursor()
        for i, story in enumerate(stories):
            cuid = _generate_cuid()
            published = story.get("published", "")
            # Parse the published date string back to a datetime
            try:
                pub_dt = datetime.strptime(published, "%B %d, %Y")
            except (ValueError, TypeError):
                pub_dt = datetime.now()
            cur.execute("""
                INSERT INTO "DigestCandidate"
                (id, "digestId", position, title, summary, source, category, link, published, "isTexas", selected)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, false)
            """, (
                cuid, digest_id, i + 1,
                story.get("title", ""), story.get("summary", ""),
                story.get("source", ""), story.get("category", ""),
                story.get("link", ""), pub_dt,
                story.get("texas", False),
            ))
        pg.commit()
        cur.close()
        pg.close()
        print(f"   📦 PG: {len(stories)} candidates saved")
    except Exception as e:
        print(f"⚠️  PG save candidates failed: {e}")
        try:
            pg.close()
        except Exception:
            pass


def pg_update_digest_html(digest_id, html, subject):
    """Save generated HTML and subject to a Digest record, set status APPROVED."""
    pg = _get_pg_conn()
    if not pg:
        return
    try:
        cur = pg.cursor()
        cur.execute("""
            UPDATE "Digest"
            SET "htmlContent" = %s, subject = %s, status = 'APPROVED',
                "approvedAt" = NOW(), "updatedAt" = NOW()
            WHERE id = %s
        """, (html, subject, digest_id))
        pg.commit()
        cur.close()
        pg.close()
        print(f"   📦 PG Digest #{digest_id} → APPROVED")
    except Exception as e:
        print(f"⚠️  PG update digest HTML failed: {e}")
        try:
            pg.close()
        except Exception:
            pass


def pg_update_digest_status(digest_id, status):
    """Update the lifecycle status of a Digest record."""
    pg = _get_pg_conn()
    if not pg:
        return
    try:
        cur = pg.cursor()
        cur.execute("""
            UPDATE "Digest" SET status = %s, "updatedAt" = NOW() WHERE id = %s
        """, (status, digest_id))
        pg.commit()
        cur.close()
        pg.close()
        print(f"   📦 PG Digest #{digest_id} → {status}")
    except Exception as e:
        print(f"⚠️  PG update status failed: {e}")
        try:
            pg.close()
        except Exception:
            pass


def pg_record_send(digest_id, email_addr, batch_num):
    """Record a successful send in DigestSend."""
    pg = _get_pg_conn()
    if not pg:
        return
    try:
        cuid = _generate_cuid()
        cur = pg.cursor()
        cur.execute("""
            INSERT INTO "DigestSend" (id, "digestId", email, batch, "sentAt")
            VALUES (%s, %s, %s, %s, NOW())
            ON CONFLICT ("digestId", email) DO NOTHING
        """, (cuid, digest_id, email_addr, batch_num))
        pg.commit()
        cur.close()
        pg.close()
    except Exception as e:
        try:
            pg.close()
        except Exception:
            pass


def pg_load_selected_candidates(digest_id):
    """Load the 5 selected candidates from PostgreSQL."""
    pg = _get_pg_conn()
    if not pg:
        return []
    try:
        cur = pg.cursor()
        cur.execute("""
            SELECT position, title, summary, source, category, link, published, "isTexas"
            FROM "DigestCandidate"
            WHERE "digestId" = %s AND selected = true
            ORDER BY position
        """, (digest_id,))
        rows = cur.fetchall()
        cur.close()
        pg.close()
        stories = []
        for row in rows:
            stories.append({
                "title": row[1],
                "summary": row[2],
                "source": row[3],
                "category": row[4],
                "link": row[5],
                "published": row[6].strftime("%B %d, %Y") if row[6] else "Recent",
                "texas": bool(row[7]),
            })
        return stories
    except Exception as e:
        print(f"⚠️  PG load selected candidates failed: {e}")
        try:
            pg.close()
        except Exception:
            pass
        return []


def _find_latest_pg_digest():
    """Find the most recent PG digest that needs action (not SENT_COMPLETE)."""
    pg = _get_pg_conn()
    if not pg:
        return None, None
    try:
        cur = pg.cursor()
        cur.execute("""
            SELECT id, status FROM "Digest"
            WHERE status != 'PENDING_REVIEW'
            ORDER BY "createdAt" DESC LIMIT 1
        """)
        row = cur.fetchone()
        cur.close()
        pg.close()
        if row:
            return row[0], row[1]
        return None, None
    except Exception as e:
        print(f"⚠️  PG find latest digest failed: {e}")
        try:
            pg.close()
        except Exception:
            pass
        return None, None


# ============================================================
# CONFIGURATION — Edit these or set as environment variables
# ============================================================

# Anthropic API
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "your-api-key-here")

# Gmail SMTP + IMAP (used for preview emails and IMAP reply parsing)
GMAIL_ADDRESS = os.environ.get("GMAIL_ADDRESS", "you@gmail.com")
GMAIL_APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "your-app-password-here")

# AWS SES (used for bulk digest sends — 50k/day limit)
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_SES_REGION = os.environ.get("AWS_SES_REGION", "us-east-1")
SES_SENDER = os.environ.get("SES_SENDER", "SureScore Intel <info@surescore.com>")

# Recipients — from Postgres if DATABASE_URL is set, else fall back to env var
def _load_recipients():
    database_url = os.environ.get("DATABASE_URL")
    if database_url:
        try:
            import psycopg2
            conn = psycopg2.connect(database_url)
            cur = conn.cursor()
            cur.execute("SELECT email FROM \"Contact\" WHERE status = 'SUBSCRIBED'")
            recipients = [row[0] for row in cur.fetchall()]
            cur.close()
            conn.close()
            if recipients:
                return recipients
        except Exception as e:
            print(f"⚠️  Could not load recipients from DB: {e}")
    raw = os.environ.get("DIGEST_RECIPIENTS", "you@gmail.com, teammate@gmail.com")
    return [r.strip() for r in raw.split(",") if r.strip()]

RECIPIENTS = _load_recipients()

# Roy's email for curation workflow
ROY_EMAIL = os.environ.get("ROY_EMAIL", "roy@surescore.com")

# Unsubscribe link signing
UNSUBSCRIBE_SECRET = os.environ.get("UNSUBSCRIBE_SECRET", "")
SITE_URL = os.environ.get("SITE_URL", "https://surescore.com")


def _build_unsubscribe_url(email_addr):
    """Generate an HMAC-signed unsubscribe URL for a recipient."""
    token = hmac.new(
        UNSUBSCRIBE_SECRET.encode(), email_addr.lower().encode(), hashlib.sha256
    ).hexdigest()
    params = urlencode({"email": email_addr.lower(), "token": token})
    return f"{SITE_URL}/api/unsubscribe?{params}"

# Number of stories to fetch as candidates (Friday preview)
MAX_STORIES = 30
# Number of stories in the final digest (Monday send)
PUBLISH_COUNT = 5

# ============================================================
# RSS FEEDS — Add or remove sources as needed
# ============================================================

RSS_FEEDS = [
    # --- Texas-Specific (PRIORITY — these get checked first) ---
    {
        "name": "Texas Tribune — Higher Education",
        "url": "https://www.texastribune.org/topics/higher-education/feed/",
        "category": "TEXAS HIGHER ED",
        "texas": True,
    },
    {
        "name": "Texas Tribune — Public Education",
        "url": "https://www.texastribune.org/topics/public-education/feed/",
        "category": "TEXAS K-12",
        "texas": True,
    },
    {
        "name": "TEA News Releases",
        "url": "https://tea.texas.gov/rssfeeds/news_rss.aspx",
        "category": "TEA",
        "texas": True,
    },
    {
        "name": "Google News — Teacher Incentive Allotment",
        "url": "https://news.google.com/rss/search?q=%22Teacher+Incentive+Allotment%22+OR+%22TIA+Texas%22+OR+(%22teacher+incentive%22+%22Texas%22)&hl=en-US&gl=US&ceid=US:en",
        "category": "TEXAS TIA",
        "texas": True,
    },
    {
        "name": "Google News — Texas College Admissions",
        "url": "https://news.google.com/rss/search?q=%22Texas+college+admissions%22+OR+%22TSIA%22+OR+%22Texas+Education+Agency%22+OR+%22Texas+college+readiness%22&hl=en-US&gl=US&ceid=US:en",
        "category": "TEXAS ADMISSIONS",
    },
    {
        "name": "Google News — Texas College Enrollment & Access",
        "url": "https://news.google.com/rss/search?q=(Texas)+((%22college+enrollment%22+OR+%22go+to+college%22+OR+%22college+access%22+OR+%22college+going+rate%22+OR+%22higher+education+enrollment%22+OR+%22college+completion%22+OR+%22free+tuition%22+OR+%22tuition+free%22)+AND+(students+OR+graduates+OR+high+school))&hl=en-US&gl=US&ceid=US:en",
        "category": "TEXAS ENROLLMENT",
        "texas": True,
    },
    {
        "name": "Google News — Texas Universities",
        "url": "https://news.google.com/rss/search?q=(%22UT+Austin%22+OR+%22Texas+A%26M%22+OR+%22Texas+State%22+OR+%22Texas+Tech%22)+(admissions+OR+enrollment+OR+tuition)&hl=en-US&gl=US&ceid=US:en",
        "category": "TEXAS HIGHER ED",
    },
    {
        "name": "Google News — Texas SAT ACT TSIA",
        "url": "https://news.google.com/rss/search?q=(Texas)+(SAT+OR+ACT+OR+TSIA+OR+%22college+readiness%22+OR+%22test+prep%22)&hl=en-US&gl=US&ceid=US:en",
        "category": "TEXAS TESTING",
        "texas": True,
    },
    {
        "name": "Google News — TEA CCMR",
        "url": "https://news.google.com/rss/search?q=(%22CCMR%22+OR+%22college+career+military+readiness%22+OR+%22college+career+and+military%22+OR+%22CCMR+accountability%22+OR+%22CCMR+bonus%22+OR+%22CCMR+outcomes%22)+(%22Texas%22+OR+%22TEA%22+OR+%22ISD%22)&hl=en-US&gl=US&ceid=US:en",
        "category": "TEXAS CCMR",
        "texas": True,
    },
    {
        "name": "Google News — THECB Testing & Policy",
        "url": "https://news.google.com/rss/search?q=(%22Texas+Higher+Education+Coordinating+Board%22+OR+%22THECB%22+OR+%22coordinating+board%22)+(TSIA+OR+testing+OR+%22college+readiness%22+OR+%22higher+education%22+OR+enrollment)&hl=en-US&gl=US&ceid=US:en",
        "category": "THECB",
        "texas": True,
    },
    # --- National (still relevant — takes will get a Texas twist) ---
    {
        "name": "Inside Higher Ed",
        "url": "https://www.insidehighered.com/rss.xml",
        "category": "HIGHER ED",
    },
    {
        "name": "Google News — College Admissions",
        "url": "https://news.google.com/rss/search?q=college+admissions&hl=en-US&gl=US&ceid=US:en",
        "category": "ADMISSIONS",
    },
    {
        "name": "The Hechinger Report",
        "url": "https://hechingerreport.org/feed/",
        "category": "EDUCATION POLICY",
    },
    {
        "name": "Higher Ed Dive",
        "url": "https://www.highereddive.com/feeds/news/",
        "category": "HIGHER ED",
    },
    {
        "name": "Google News — Application Deadlines & Decisions",
        "url": "https://news.google.com/rss/search?q=%22early+decision%22+OR+%22regular+decision%22+OR+%22application+deadline%22+OR+%22admissions+deadline%22+OR+%22decision+day%22&hl=en-US&gl=US&ceid=US:en",
        "category": "ADMISSIONS",
    },
    {
        "name": "Google News — Enrollment Trends",
        "url": "https://news.google.com/rss/search?q=%22college+enrollment%22+OR+%22freshman+enrollment%22+OR+%22enrollment+trend%22+OR+%22enrollment+decline%22&hl=en-US&gl=US&ceid=US:en",
        "category": "ENROLLMENT",
    },
    # --- SAT / ACT / Testing / Admissions Policy ---
    {
        "name": "Google News — SAT & ACT",
        "url": "https://news.google.com/rss/search?q=SAT+ACT+test&hl=en-US&gl=US&ceid=US:en",
        "category": "TESTING",
    },
    {
        "name": "Google News — Test Scores & Policy",
        "url": "https://news.google.com/rss/search?q=%22SAT+scores%22+OR+%22ACT+scores%22+OR+%22PSAT%22+OR+%22test+optional%22+OR+%22test+required%22+OR+%22admissions+policy%22&hl=en-US&gl=US&ceid=US:en",
        "category": "ADMISSIONS POLICY",
    },
    {
        "name": "Google News — College Scholarships",
        "url": "https://news.google.com/rss/search?q=college+scholarship+OR+%22merit+scholarship%22+OR+%22scholarship+deadline%22&hl=en-US&gl=US&ceid=US:en",
        "category": "SCHOLARSHIPS",
    },
    # --- Financial Aid ---
    {
        "name": "Google News — FAFSA & Financial Aid",
        "url": "https://news.google.com/rss/search?q=FAFSA+OR+%22financial+aid%22+college&hl=en-US&gl=US&ceid=US:en",
        "category": "FINANCIAL AID",
    },
    {
        "name": "NASFAA — Financial Aid News",
        "url": "https://www.nasfaa.org/news_rss",
        "category": "FINANCIAL AID",
    },
    # --- Ivy League ---
    {
        "name": "Google News — Ivy League Admissions",
        "url": "https://news.google.com/rss/search?q=(%22Harvard%22+OR+%22Yale%22+OR+%22Princeton%22+OR+%22Columbia+University%22+OR+%22UPenn%22+OR+%22Brown+University%22+OR+%22Dartmouth%22+OR+%22Cornell+University%22)+(admissions+OR+acceptance+OR+enrollment+OR+tuition)&hl=en-US&gl=US&ceid=US:en",
        "category": "IVY LEAGUE",
    },
    # --- Highly Selective (non-Ivy) ---
    {
        "name": "Google News — Elite University Admissions",
        "url": "https://news.google.com/rss/search?q=(%22Stanford%22+OR+%22MIT%22+OR+%22Duke%22+OR+%22Caltech%22+OR+%22Johns+Hopkins%22+OR+%22Northwestern%22+OR+%22Georgetown%22+OR+%22Vanderbilt%22+OR+%22Rice+University%22)+(admissions+OR+acceptance+OR+enrollment+OR+tuition)&hl=en-US&gl=US&ceid=US:en",
        "category": "SELECTIVE ADMISSIONS",
    },
    # --- Texas State Universities (expanded beyond UT/A&M) ---
    {
        "name": "Google News — Texas Regional Universities",
        "url": "https://news.google.com/rss/search?q=(%22University+of+Houston%22+OR+%22UNT%22+OR+%22University+of+North+Texas%22+OR+%22UTSA%22+OR+%22UT+Dallas%22+OR+%22UT+Arlington%22+OR+%22Sam+Houston+State%22+OR+%22UTRGV%22+OR+%22Texas+Woman%27s+University%22)+(admissions+OR+enrollment+OR+tuition)&hl=en-US&gl=US&ceid=US:en",
        "category": "TEXAS STATE UNIV",
        "texas": True,
    },
    # --- Texas Community Colleges ---
    {
        "name": "Google News — Texas Community Colleges",
        "url": "https://news.google.com/rss/search?q=(%22Dallas+College%22+OR+%22Houston+Community+College%22+OR+%22Alamo+Colleges%22+OR+%22Austin+Community+College%22+OR+%22Lone+Star+College%22+OR+%22Tarrant+County+College%22+OR+%22San+Jacinto+College%22+OR+%22El+Paso+Community+College%22)+(enrollment+OR+tuition+OR+transfer+OR+%22dual+credit%22)&hl=en-US&gl=US&ceid=US:en",
        "category": "TX COMMUNITY COLLEGE",
        "texas": True,
    },
    {
        "name": "Google News — Texas Dual Enrollment",
        "url": "https://news.google.com/rss/search?q=(Texas)+(%22dual+enrollment%22+OR+%22dual-enrollment%22+OR+%22concurrent+enrollment%22+OR+%22early+college+high+school%22+OR+%22ECHS%22+OR+%22college+credit+in+high+school%22)&hl=en-US&gl=US&ceid=US:en",
        "category": "TX DUAL ENROLLMENT",
        "texas": True,
    },
    {
        "name": "Google News — Texas Dual Credit & CC Transfer",
        "url": "https://news.google.com/rss/search?q=(Texas)+((%22dual+credit%22+OR+%22dual+enrollment%22+OR+%22community+college+transfer%22+OR+%22associate+degree%22)+AND+(college+OR+university))&hl=en-US&gl=US&ceid=US:en",
        "category": "TX DUAL CREDIT",
        "texas": True,
    },
    # --- Texas Private Universities ---
    {
        "name": "Google News — Texas Private Universities",
        "url": "https://news.google.com/rss/search?q=(%22SMU%22+OR+%22Southern+Methodist%22+OR+%22TCU%22+OR+%22Texas+Christian%22+OR+%22Baylor+University%22+OR+%22Rice+University%22+OR+%22Trinity+University%22+OR+%22St.+Edward%27s%22+OR+%22Abilene+Christian%22)+(admissions+OR+enrollment+OR+tuition+OR+scholarship)&hl=en-US&gl=US&ceid=US:en",
        "category": "TX PRIVATE UNIV",
        "texas": True,
    },
    # --- Google Alerts Topics (added from Roy's Google Alerts) ---
    {
        "name": "Google News — Interim Superintendent Texas",
        "url": "https://news.google.com/rss/search?q=%22interim+superintendent%22+Texas&hl=en-US&gl=US&ceid=US:en",
        "category": "TX SUPERINTENDENT",
        "texas": True,
    },
    {
        "name": "Google News — TEA Accountability",
        "url": "https://news.google.com/rss/search?q=(%22TEA%22+OR+%22Texas+Education+Agency%22)+(%22accountability%22+OR+%22accountability+rating%22+OR+%22A-F+rating%22)&hl=en-US&gl=US&ceid=US:en",
        "category": "TEA ACCOUNTABILITY",
        "texas": True,
    },
    {
        "name": "Google News — TEKS",
        "url": "https://news.google.com/rss/search?q=%22TEKS%22+OR+%22Texas+Essential+Knowledge+and+Skills%22&hl=en-US&gl=US&ceid=US:en",
        "category": "TEXAS TEKS",
        "texas": True,
    },
    {
        "name": "Google News — Texas School District Superintendent News",
        "url": "https://news.google.com/rss/search?q=(%22Texas%22+OR+%22ISD%22)+(%22superintendent%22+OR+%22school+board%22+OR+%22new+superintendent%22+OR+%22superintendent+search%22)&hl=en-US&gl=US&ceid=US:en",
        "category": "TX SUPERINTENDENT",
        "texas": True,
    },
    # --- Highly Selective Boarding Schools ---
    {
        "name": "Google News — Elite Boarding School Admissions",
        "url": "https://news.google.com/rss/search?q=(%22Phillips+Exeter%22+OR+%22Phillips+Andover%22+OR+%22Deerfield+Academy%22+OR+%22Choate+Rosemary%22+OR+%22St.+Paul%27s+School%22+OR+%22Lawrenceville%22+OR+%22Hotchkiss%22+OR+%22Groton%22)+(admissions+OR+acceptance+OR+enrollment+OR+boarding+school)&hl=en-US&gl=US&ceid=US:en",
        "category": "BOARDING SCHOOLS",
    },
    {
        "name": "Google News — Boarding School Trends",
        "url": "https://news.google.com/rss/search?q=(%22boarding+school+admissions%22+OR+%22prep+school+admissions%22+OR+%22boarding+school+application%22+OR+%22SSAT%22+OR+%22independent+school+admissions%22)&hl=en-US&gl=US&ceid=US:en",
        "category": "BOARDING SCHOOLS",
    },
]

# Keyword filters — stories must contain at least one of these
# (case-insensitive). ALL feeds go through this filter now.
KEYWORDS = [
    # College admissions & trends
    "college admission", "college admissions", "admissions",
    "acceptance rate", "admit rate", "application",
    "early decision", "early action", "regular decision",
    "test-optional", "test optional", "test required",
    "college essay", "common app", "coalition app",
    "university admission", "selective",
    "admissions deadline", "application deadline", "college application",
    "class of 2026", "class of 2027", "class of 2028", "class of 2029", "class of 2030",
    "waitlist", "yield rate", "decision day",
    "college rankings", "tuition free", "tuition-free",
    "national merit", "apply texas", "applytexas",
    "holistic admissions", "financial aid package",
    "net price", "student aid index",
    # Testing & college readiness
    "TSIA", "TSI", "SAT", "ACT",
    "college prep", "college readiness", "college ready",
    "standardized test", "college board", "test score",
    "STAAR", "PSAT", "AP exam", "AP class",
    "SAT score", "ACT score", "PSAT score",
    "test change", "digital SAT", "test requirement",
    "admissions policy", "admissions requirement",
    # Scholarships & financial aid
    "scholarship", "financial aid", "FAFSA", "merit aid",
    "tuition", "college cost", "affordability",
    "pell grant", "student loan", "529 plan",
    "need-based", "merit-based", "free tuition",
    # Enrollment & higher ed trends
    "enrollment", "dual enrollment", "dual credit",
    "dual-enrollment", "concurrent enrollment",
    "early college high school", "ECHS",
    "community college", "transfer",
    # Texas state universities
    "UT Austin", "Texas A&M", "Texas State", "Texas Tech",
    "Texas college", "Texas university",
    # Teacher Incentive Allotment
    "teacher incentive allotment", "TIA", "teacher incentive",
    "designated teacher", "recognized teacher", "master teacher",
    "teacher designation", "strategic compensation",
    # TEA CCMR
    "CCMR", "college career military readiness",
    "college career and military", "CCMR outcomes bonus",
    "college prep course", "CTE", "career and technical",
    # TEA Accountability & TEKS
    "accountability rating", "A-F rating", "TEA accountability",
    "TEKS", "Texas Essential Knowledge and Skills",
    # Texas superintendent & school board
    "superintendent", "interim superintendent", "school board",
    "superintendent search", "new superintendent",
    # THECB
    "THECB", "Texas Higher Education Coordinating Board",
    "coordinating board", "60x30TX",
    "University of Houston", "UNT", "University of North Texas",
    "UTSA", "UT Dallas", "UT Arlington", "Sam Houston State",
    "UTRGV", "Texas Woman's University",
    # Texas community colleges & dual credit
    "Dallas College", "Houston Community College", "Alamo Colleges",
    "Austin Community College", "Lone Star College",
    "Tarrant County College", "San Jacinto College",
    "El Paso Community College",
    # Texas private universities
    "SMU", "Southern Methodist", "TCU", "Texas Christian",
    "Baylor University", "Rice University", "Trinity University",
    "St. Edward's", "Abilene Christian",
    # Ivy League
    "Harvard", "Yale", "Princeton", "Columbia University",
    "UPenn", "Penn admissions", "Brown University", "Dartmouth", "Cornell University",
    "ivy league",
    # Highly selective (non-Ivy)
    "Stanford", "MIT", "Duke", "Caltech", "Johns Hopkins",
    "Northwestern", "Georgetown", "Vanderbilt",
    # Boarding schools / prep schools
    "Phillips Exeter", "Phillips Andover", "Deerfield Academy",
    "Choate Rosemary", "Choate", "St. Paul's School",
    "Lawrenceville", "Hotchkiss", "Groton",
    "boarding school admissions", "prep school admissions",
    "SSAT", "independent school",
]

# Stories containing ANY of these words get blocked — no exceptions
BLOCKED_TOPICS = [
    # Scandals and violence
    "epstein", "sex scandal", "sexual abuse", "sexual assault", "sexual misconduct",
    "sex trafficking", "molestation", "pedophil", "rape allegation",
    "shooting", "school shooting", "gun violence",
    "murder", "homicide", "manslaughter",
    "obituar", "death of",
    # Vendor/procurement noise
    "lifetouch",
    # Politically sensitive institutional topics
    "hbcu", "historically black",
    # Off-topic school operations
    "heart safety", "heart-safety", "school lunch", "bus driver", "cafeteria",
    "school board election", "superintendent hire",
    "teacher strike", "walkout",
    "ice raid", "ice arrest", "immigration enforcement",
    "protest ice", "protest immigration", "ice deport",
    "immigration protest", "walkout protest",
    "student protest", "students protest", "take part in more protests",
    "landon payton",
    "unlicensed teacher", "teacher shortage", "teacher licensing",
    # Culture war / politics
    "indoctrination", "censorship", "book ban", "book banning", "banned book",
    "lgbtq", "transgender", "pronoun", "gender identity",
    "dei ", "diversity equity inclusion",
    "critical race theory", "crt ", "drag queen",
    "prayer in school", "religion in school", "bible in school",
    "parental rights bill", "don't say gay",
    # Campus politics
    "consolidate race", "consolidate gender",
    "controversial topic", "avoid controversial",
    "culture war", "woke", "anti-woke",
    # Admin noise
    "board of managers", "teacher watchdog",
    "teacher certification", "teacher pay", "teacher salary",
    "superintendent search", "budget cut", "budget shortfall",
    "school board drama", "school board fight",
    # Safety / threats
    "bomb threat", "threats reported", "school threat",
    "lockdown", "active shooter", "swatting",
    # Off-topic political
    "abortion", "late-pregnancy", "late pregnancy",
    "ice operation", "deportation", "march to capitol",
    "school voucher", "voucher debate", "voucher program",
    "special education order", "special ed order",
]

# ============================================================
# SURESCORE SYSTEM PROMPT
# ============================================================

SYSTEM_PROMPT = """You are SureScore's editorial voice — sharp, knowledgeable, and unapologetically focused on what matters for Texas students and the educators who serve them.

=== WHO SURESCORE IS ===

SureScore is a Texas-based college prep company and thought-partner to school districts. We believe every student deserves a clear, strategic path to college. We exist because too many districts treat college prep as an afterthought — buried under STAAR and EOC priorities while the question of "what's next for the student" gets pushed to senior year, when it's already too late.

We believe preparation starts in 7th and 8th grade. We believe districts should target 75% of a graduating class being TSIA complete at graduation. We believe test prep must be a continuum — woven into core instruction, supported by dedicated prep, and grounded in a culture that gets kids dreaming about their futures again instead of treating them as metrics.

=== YOUR AUDIENCE ===

You are primarily speaking to school counselors and district administrators — overworked professionals who are deeply committed to their students. Secondarily, parents. These are smart people who don't need to be lectured. They need a credible thought-partner who validates what they already suspect and gives them actionable insight they can use.

=== YOUR TONE ===

You write like the best newsletter writers — the ones people actually open. Every take should make the reader feel something: fired up, vindicated, alarmed, hopeful, or furious on behalf of students. If your take doesn't provoke an emotional reaction, rewrite it.

Lead with the feeling. Open with what's thrilling, what's infuriating, what's heartbreaking, or what's game-changing — THEN explain why. Don't bury the lede behind context. Hit them in the gut first, then give them the insight.

You sound like a sharp colleague who just read something that made them slam their laptop shut and say "you HAVE to see this." Not a consultant recapping the news — a thought leader who cares deeply and isn't afraid to show it.

You can be witty. You can have edge. You can be provocative when the situation calls for it. But you punch UP at systems, policies, and mindsets that limit student access — never down at educators, families, or students. You never come across as condescending, preachy, or politically partisan.

=== EMOTIONAL REGISTER ===

For GOOD news (wins, opportunities, breakthroughs): Be genuinely excited. Celebrate. Let the reader feel the victory. Use language that makes them want to share this with their team. "This is the kind of news that should have every counselor's office buzzing."

For BAD news (threats, failures, inequities): Be outraged on behalf of students. Channel righteous frustration. Make the reader feel the urgency. "This should make every parent in Texas furious — and here's what to do about it."

For SURPRISING news (shifts, reversals, data): Create a record-scratch moment. Make them stop scrolling. "Stop everything. Read that number again."

For URGENT news (deadlines, policy changes): Create healthy urgency without panic. Give them the action step immediately. "If your junior hasn't done X by Y, they're already behind."

Never be lukewarm. Lukewarm takes don't get read. If the story isn't worth getting emotional about, find the angle that IS.

=== SIGNATURE PHRASES (use naturally, not mechanically) ===

- "Think about it this way..." — for reframing
- "Is college prep a hobby or a job?" — our core philosophy
- "Treat students like the customer, not the product"
- "Here's what nobody's telling you..." — for cutting through noise
- "Push students beyond what they think they can do"
- "Let's get back to inspiring students and talking about their goals"

=== NEVER DO THIS ===

- Never say "college isn't for everyone" — nobody says that about their own children, only other people's kids
- Never say "don't panic" or "don't stress" — it's dismissive. Give a plan instead.
- Never say "it's complicated" — our job is to make it clear
- Never punt with "talk to your counselor" — our audience IS counselors
- Never give generic advice without specifics ("start early" means nothing without a concrete action)
- Never be condescending toward public school students — these are our students
- Never make it about SureScore — keep the focus on districts, students, and outcomes
- Never recommend excessive testing — we believe in strategic, motivated preparation, not drill-and-kill

=== CORE BELIEFS (internalize these) ===

- Test scores still matter strategically, even at test-optional schools. Families deserve to know that.
- Motivation and confidence are prerequisites for skill-building. A student who has failed the TSIA is already asking "am I college material?" — our job is to rebuild that belief through immediate wins.
- Engaged learners outperform compliant ones. Content should grab attention, not feel like punishment.
- The admissions landscape is shifting fast. The old playbooks don't work. Districts and families need current, specific guidance.
- Every Texas student can compete when they have the right plan and support.

=== YOUR TASK ===

When given a news headline, source, and full article text about college admissions, TSIA, SAT/ACT, or education policy, produce FOUR structured fields:

1. SYNOPSIS — A neutral, factual 2-sentence summary of the article. No opinion, no SureScore voice. Just "here's what happened."

2. HIGHLIGHTS — 3-4 labeled key takeaways from the article. Each highlight has a short LABEL (2-4 words, like "Fee Increase," "Timeline," "Who's Affected," "The Data") and a TEXT description (1 sentence). These should cover the most important facts and data points a busy counselor needs to know.

3. TAKE — A 1-2 sentence SureScore editorial take (punchy, emotional, sharp). This is shorter than before — hit hard and get out. Lead with emotion, deliver insight. Every take should pass this test: would a busy counselor stop scrolling?

4. RELEVANCE — A single sentence connecting this story to TSI/college readiness or what it means for Texas students and educators. Start with a concrete connection, not vague platitudes.

IMPORTANT: Do NOT prefix fields with "SureScore Take:" or other labels beyond the field markers. The template handles labeling. If the headline or summary is too vague to write a meaningful response, write a general insight about the topic area.

=== EXAMPLE OUTPUT ===

GOOD NEWS example:
News: "Harvard reinstates SAT requirement for Fall 2025 applicants"

SYNOPSIS: Harvard announced it will require SAT or ACT scores for all Fall 2025 applicants, ending its three-year test-optional experiment. The university cited internal research showing test scores were the strongest single predictor of student success.
HIGHLIGHTS:
- LABEL: Policy Shift | TEXT: Harvard joins a growing list of elite schools reversing test-optional policies after finding scores predict outcomes better than GPA alone.
- LABEL: The Data | TEXT: Internal Harvard research showed students with submitted scores graduated at 6% higher rates than those who withheld them.
- LABEL: Timeline | TEXT: The requirement takes effect immediately for the Fall 2025 cycle — current juniors must register for spring test dates now.
- LABEL: Ripple Effect | TEXT: At least 12 other selective universities are expected to follow Harvard's lead before the next admissions cycle.
TAKE: The dominoes are falling fast — and every Texas family who kept prepping while the world said "tests don't matter" just got the last laugh. Test-optional is dying at every school that matters.
RELEVANCE: Districts that built SAT/ACT prep into their junior year programming weren't being pushy — they were being prophetic, and the window for sophomores to lock in a testing plan is slamming shut.

BAD NEWS example:
News: "FAFSA processing delays leave thousands of Texas families without aid packages weeks before decision deadlines"

SYNOPSIS: Federal FAFSA processing delays have left over 50,000 Texas families without financial aid packages just weeks before May 1 decision deadlines. The Department of Education acknowledged a backlog but offered no firm timeline for resolution.
HIGHLIGHTS:
- LABEL: Scale of Impact | TEXT: An estimated 50,000+ Texas families are making college commitment decisions without knowing their actual cost of attendance.
- LABEL: The Deadline | TEXT: May 1 decision deposits are due in weeks, forcing families to commit to schools they may not be able to afford.
- LABEL: Who's Hit Hardest | TEXT: First-generation college families without financial literacy resources are most likely to make costly blind decisions.
- LABEL: Federal Response | TEXT: The Department of Education acknowledged the backlog but has not provided a resolution timeline.
TAKE: Thousands of Texas families are being asked to commit to a college they can't confirm they can afford — because the federal government can't process a form on time. Some seniors are about to make $80,000 decisions blind.
RELEVANCE: Counselors should be walking families through net price calculators and backup plans right now — waiting for Washington to fix this could cost students their futures.

URGENT NEWS example:
News: "TSIA exam fees increase effective January 2026"

SYNOPSIS: The Texas Higher Education Coordinating Board approved a fee increase for the TSIA2 exam effective January 2026. The per-attempt cost will rise from $29 to $39, marking the first increase in five years.
HIGHLIGHTS:
- LABEL: Fee Increase | TEXT: TSIA2 exam fees jump from $29 to $39 per attempt, a 34% increase that compounds for students who need multiple retakes.
- LABEL: Who's Affected | TEXT: Students who are not TSIA-complete by January 2026 will pay the new rate for every subsequent attempt.
- LABEL: Cumulative Cost | TEXT: A student needing 4 attempts at the new rate will pay $156 — nearly the cost of a full prep course.
- LABEL: District Impact | TEXT: Districts covering exam fees for students will see testing budgets stretched significantly thinner.
TAKE: The fee hike isn't what should keep you up at night — it's the students who'll pay it three, four, five times because nobody built them a prep plan before senior year.
RELEVANCE: Districts that start TSIA readiness in 8th grade don't just save dollars — they save students from a soul-crushing cycle of retakes that breaks confidence faster than any test can measure.
"""


# ============================================================
# API RETRY HELPER
# ============================================================

def _call_with_retry(api_func, max_retries=3, backoff_delays=(5, 10, 20)):
    """Call an API function with exponential backoff on 529 (overloaded) errors.

    Args:
        api_func: A callable that makes the API request (no args).
        max_retries: Maximum number of retry attempts.
        backoff_delays: Tuple of delay seconds for each retry.

    Returns:
        The API response on success.

    Raises:
        The last exception if all retries are exhausted.
    """
    last_exception = None
    for attempt in range(max_retries + 1):
        try:
            return api_func()
        except Exception as e:
            last_exception = e
            error_str = str(e)
            # Retry on 529 (overloaded) or 529-like errors
            if "529" in error_str or "overloaded" in error_str.lower():
                if attempt < max_retries:
                    delay = backoff_delays[min(attempt, len(backoff_delays) - 1)]
                    print(f"   ⏳ API overloaded (529), retrying in {delay}s (attempt {attempt + 1}/{max_retries})...")
                    time.sleep(delay)
                    continue
            # Non-529 errors: don't retry
            raise
    raise last_exception


# ============================================================
# STEP 1: FETCH NEWS
# ============================================================

def fetch_news():
    """Pull stories from RSS feeds and filter for relevance."""
    print("📡 Fetching news from RSS feeds...")
    stories = []
    cutoff_national = datetime.now() - timedelta(days=7)  # National: last 7 days (weekly cadence)
    cutoff_texas = datetime.now() - timedelta(days=7)    # Texas: last 7 days

    for feed_info in RSS_FEEDS:
        try:
            print(f"   → {feed_info['name']}...")
            feed = feedparser.parse(feed_info["url"])

            for entry in feed.entries[:30]:  # Check up to 30 per feed
                # Parse publication date
                published = None
                if hasattr(entry, "published_parsed") and entry.published_parsed:
                    published = datetime(*entry.published_parsed[:6])
                elif hasattr(entry, "updated_parsed") and entry.updated_parsed:
                    published = datetime(*entry.updated_parsed[:6])

                # Skip old stories (wider window for Texas feeds)
                cutoff = cutoff_texas if feed_info.get("texas") else cutoff_national
                if published and published < cutoff:
                    continue

                title = entry.get("title", "").strip()
                summary = entry.get("summary", entry.get("description", "")).strip()
                link = entry.get("link", "")

                # Strip HTML tags, decode entities, and clean up summary
                import html as _html
                summary = re.sub(r"<[^>]+>", "", summary).strip()
                summary = _html.unescape(summary)
                title = _html.unescape(title)
                # Remove common RSS metadata cruft
                summary = re.sub(r"\s*Byline\(s\).*", "", summary, flags=re.DOTALL)
                summary = re.sub(r"\n\s*\n", "\n", summary)  # Collapse blank lines
                # Remove lines that are just author names/emails/dates/metadata
                lines = summary.split("\n")
                cleaned = []
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    # Skip dates like "Fri, 02/13/2026 - 03:00 AM"
                    if re.match(r"^(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+\d{2}/\d{2}", line):
                        continue
                    # Skip email addresses
                    if re.match(r"^[a-zA-Z0-9._%+-]+@", line):
                        continue
                    # Skip if line is just the title repeated
                    if line == title:
                        continue
                    # Skip short author-name-like lines (< 30 chars, no verb)
                    if len(line) < 30 and not any(c in line for c in ".!?;:"):
                        continue
                    cleaned.append(line)
                summary = " ".join(cleaned).strip()
                summary = summary[:500]  # Truncate long summaries

                # Block stories about off-topic or inappropriate subjects
                combined_check = f"{title} {summary}".lower()
                if any(blocked in combined_check for blocked in BLOCKED_TOPICS):
                    continue

                # Detect Google News junk summaries (just headline + source repeated)
                # These look like "Headline  Source Name" after entity decoding
                summary_is_junk = False
                if title and title in summary and len(summary) < len(title) + 80:
                    summary_is_junk = True
                # Also catch summaries that are just source attributions
                if re.match(r"^.{0,50}\s{2,}.+$", summary) and len(summary) < 120:
                    summary_is_junk = True

                if summary_is_junk or len(summary) < 50:
                    # Use title as summary placeholder — will be enriched below
                    if len(title) > 20:
                        summary = title
                    else:
                        continue

                # ALL feeds go through keyword filtering now (no Texas bypass)
                if KEYWORDS:
                    combined_text = f"{title} {summary}".lower()
                    if not any(kw.lower() in combined_text for kw in KEYWORDS):
                        continue

                # Check if this is a Texas story (from a Texas feed or mentions Texas)
                is_texas = feed_info.get("texas", False)
                combined_lower = f"{title} {summary}".lower()
                if any(tx in combined_lower for tx in ["texas", "tsia", "tsi2", "tea ",
                        "staar", "ut austin", "texas a&m", "texas tech", "texas state"]):
                    is_texas = True

                stories.append({
                    "title": title,
                    "summary": summary,
                    "link": link,
                    "source": feed_info["name"],
                    "category": feed_info["category"],
                    "published": published.strftime("%B %d, %Y") if published else "Recent",
                    "texas": is_texas,
                })
        except Exception as e:
            print(f"   ⚠️  Error fetching {feed_info['name']}: {e}")

    # --- DEDUP PASS 1: Title word overlap (same story, different sources) ---
    STOP_WORDS = {"the", "a", "an", "in", "on", "at", "to", "for", "of", "and",
                  "is", "are", "was", "were", "be", "been", "with", "from", "by",
                  "as", "its", "it", "that", "this", "but", "or", "not", "no",
                  "over", "into", "about", "after", "new", "says", "said", "how",
                  "why", "what", "when", "where", "who", "could", "would", "should"}

    def _sig_words(text):
        """Extract significant words from text."""
        words = set(re.findall(r"[a-z]{3,}", text.lower()))
        return words - STOP_WORDS

    unique_stories = []
    seen_word_sets = []
    for story in stories:
        words = _sig_words(story["title"])
        is_dupe = False
        for seen_words in seen_word_sets:
            if len(words) < 3 or len(seen_words) < 3:
                continue
            overlap = len(words & seen_words)
            smaller = min(len(words), len(seen_words))
            if smaller > 0 and overlap / smaller >= 0.5:
                is_dupe = True
                break
        if not is_dupe:
            unique_stories.append(story)
            seen_word_sets.append(words)

    # --- DEDUP PASS 2: Topic-level (no two stories about the same subject) ---
    def _topic_fingerprint(story):
        """Get the core topic entities from a story."""
        orig = f"{story['title']} {story['summary']}"
        proper = set(re.findall(r"\b[A-Z][a-z]{2,}\b", orig))
        proper = {w.lower() for w in proper} - STOP_WORDS
        phrases = set()
        for phrase in re.findall(r"[A-Z][a-z]+ [A-Z][a-z]+", orig):
            phrases.add(phrase.lower())
        return proper | phrases

    final_stories = []
    seen_topics = []
    for story in unique_stories:
        fp = _topic_fingerprint(story)
        is_topic_dupe = False
        for seen_fp in seen_topics:
            if len(fp) < 2 or len(seen_fp) < 2:
                continue
            overlap = len(fp & seen_fp)
            if overlap >= 3:
                is_topic_dupe = True
                break
        if not is_topic_dupe:
            final_stories.append(story)
            seen_topics.append(fp)
        else:
            print(f"   🔄 Topic dupe skipped: {story['title'][:60]}...")

    unique_stories = final_stories

    # Prioritize Texas stories first, then national
    texas_stories = [s for s in unique_stories if s.get("texas")]
    national_stories = [s for s in unique_stories if not s.get("texas")]
    prioritized = texas_stories + national_stories

    tx_count = len(texas_stories)
    nat_count = len(national_stories)
    print(f"✅ Found {len(prioritized)} relevant stories ({tx_count} Texas, {nat_count} national)\n")
    return prioritized[:MAX_STORIES]


def filter_already_sent(conn, stories):
    """Remove stories whose titles already appeared in DigestStory within the last 14 days."""
    cur = conn.cursor()
    cutoff = datetime.now() - timedelta(days=14)
    cur.execute("""
        SELECT DISTINCT lower(ds.title) FROM "DigestStory" ds
        JOIN "DigestHistory" dh ON ds."digestId" = dh.id
        WHERE dh."sentAt" > %s
    """, (cutoff,))
    sent_titles = {row[0] for row in cur.fetchall()}

    filtered = []
    for story in stories:
        if story["title"].lower() in sent_titles:
            print(f"   ♻️  Already sent recently: {story['title'][:60]}...")
            continue
        filtered.append(story)
    return filtered


# ============================================================
# STEP 2: GENERATE SURESCORE TAKES
# ============================================================

def fetch_article_text(url, timeout=10):
    """Fetch the full article text from a URL.

    Uses trafilatura for extraction, with a BeautifulSoup fallback.
    Follows Google News redirects to reach the actual article.
    Returns the extracted text, or None if the fetch fails.
    """
    if not url:
        return None
    try:
        resp = requests.get(url, timeout=timeout, allow_redirects=True, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        })
        resp.raise_for_status()
        html = resp.text
    except Exception as e:
        print(f"      ⚠️  Article fetch failed: {e}")
        return None

    # Try trafilatura first (best quality)
    try:
        import trafilatura
        text = trafilatura.extract(html)
        if text and len(text) > 100:
            return text
    except ImportError:
        pass
    except Exception:
        pass

    # Fallback: BeautifulSoup
    try:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, "html.parser")
        # Remove script/style/nav elements
        for tag in soup(["script", "style", "nav", "header", "footer", "aside"]):
            tag.decompose()
        text = soup.get_text(separator="\n", strip=True)
        # Clean up excessive whitespace
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        text = "\n".join(lines)
        if len(text) > 100:
            return text
    except ImportError:
        pass
    except Exception:
        pass

    return None


REFUSAL_PHRASES = [
    # Model says it can't write a take
    "don't have enough", "not enough information", "can't write a meaningful",
    "could you provide", "without knowing", "too vague", "need more context",
    "insufficient detail", "headline and summary don't give",
    "doesn't give me enough", "can't give",
    "doesn't give us enough", "doesn't tell us enough",
    "headline alone doesn't", "not enough detail",
    "doesn't provide enough", "can't provide meaningful",
    "need more information", "without more detail",
    "not enough substance",
    # Model generated filler because article fetch failed
    "missing data", "not available to provide", "cannot be determined",
    "without access to the full article", "without the full article",
    "without access to the article", "no article content",
    "article content is not available", "article content was not",
    "full article text was not provided", "no full article",
    "content was not provided", "content is not available",
    "specific details", "cannot be assessed",
    "headline references", "but no article content",
    # Model flags the story as off-topic
    "nothing to do with college prep",
    "nothing to do with college readiness",
    "nothing to do with test",
    "nothing to do with admissions",
    "not related to college",
    "isn't about college prep",
    "has nothing to do with",
]


def _is_refusal_take(take_text):
    """Detect if Claude refused to write a real take."""
    lower = take_text.lower()
    return any(phrase in lower for phrase in REFUSAL_PHRASES)


def generate_takes(stories):
    """Use Claude API to generate a SureScore Take + bullet summary for each story."""
    print("🤖 Generating SureScore Takes...")
    client = Anthropic(api_key=ANTHROPIC_API_KEY)

    good_stories = []
    for i, story in enumerate(stories):
        print(f"   → Take {i+1}/{len(stories)}: {story['title'][:60]}...")

        # Fetch full article text
        article_text = fetch_article_text(story.get("link"))
        article_fetched = bool(article_text)
        if article_text:
            # Truncate to ~3000 chars to stay within token limits
            article_text = article_text[:3000]
            print(f"      📄 Fetched article ({len(article_text)} chars)")
        else:
            print(f"      📄 Using RSS summary (article fetch failed)")
            article_text = story["summary"]

        # When article fetch fails, add explicit instructions to never generate filler
        no_filler_instruction = ""
        if not article_fetched:
            no_filler_instruction = (
                "\n\nIMPORTANT: You only have the headline and a brief summary to work with. "
                "That's fine — write confidently as if you read the full article. Use your knowledge "
                "of this topic to fill in context. NEVER say 'missing data', 'not available', "
                "'without access to the article', 'cannot be determined', or anything that reveals "
                "you didn't read the full piece. Your audience should never suspect the content was "
                "generated from a headline alone. Write specific, insightful highlights and a sharp take."
            )

        try:
            def _make_take_request(text=article_text, no_filler=no_filler_instruction):
                return client.messages.create(
                    model="claude-sonnet-4-20250514",
                    max_tokens=700,
                    system=SYSTEM_PROMPT,
                    messages=[{
                        "role": "user",
                        "content": (
                            f"Headline: {story['title']}\n"
                            f"Source: {story['source']}\n\n"
                            f"Full article:\n{text}\n\n"
                            f"Write all 4 fields in this EXACT format:\n"
                            f"SYNOPSIS: [2-sentence neutral summary]\n"
                            f"HIGHLIGHTS:\n"
                            f"- LABEL: [label] | TEXT: [description]\n"
                            f"- LABEL: [label] | TEXT: [description]\n"
                            f"- LABEL: [label] | TEXT: [description]\n"
                            f"TAKE: [1-2 sentence editorial take]\n"
                            f"RELEVANCE: [1 sentence connecting to TSI/college readiness]"
                            f"{no_filler}"
                        )
                    }]
                )

            message = _call_with_retry(_make_take_request)
            raw_text = message.content[0].text.strip()

            # Parse SYNOPSIS
            synopsis_match = re.search(r"SYNOPSIS:\s*(.+?)(?=\nHIGHLIGHTS:|\nTAKE:|\nRELEVANCE:|\Z)", raw_text, re.DOTALL)
            synopsis_text = synopsis_match.group(1).strip() if synopsis_match else ""

            # Parse HIGHLIGHTS as list of {label, text} dicts
            highlights_match = re.search(r"HIGHLIGHTS:\s*(.+?)(?=\nTAKE:|\nRELEVANCE:|\Z)", raw_text, re.DOTALL)
            highlights = []
            bullets = []
            if highlights_match:
                for line in highlights_match.group(1).strip().splitlines():
                    line = re.sub(r"^[\s\-\*•]+", "", line).strip()
                    if not line:
                        continue
                    # Try LABEL: X | TEXT: Y format
                    hl_match = re.match(r"LABEL:\s*(.+?)\s*\|\s*TEXT:\s*(.+)", line)
                    if hl_match:
                        label = hl_match.group(1).strip()
                        text_val = hl_match.group(2).strip()
                        highlights.append({"label": label, "text": text_val})
                        bullets.append(f"{label}: {text_val}")
                    else:
                        # Fallback: plain bullet line
                        highlights.append({"label": "Key Point", "text": line})
                        bullets.append(line)
            highlights = highlights[:4]
            bullets = bullets[:4]

            # Parse TAKE
            take_match = re.search(r"TAKE:\s*(.+?)(?=\nRELEVANCE:|\nHIGHLIGHTS:|\nSYNOPSIS:|\Z)", raw_text, re.DOTALL)
            if take_match:
                take_text = take_match.group(1).strip()
            else:
                take_text = raw_text

            # Strip any "SureScore Take:" prefix the model may add
            take_text = re.sub(r"^\*{0,2}SureScore Take:?\*{0,2}\s*", "", take_text).strip()

            # Parse RELEVANCE
            relevance_match = re.search(r"RELEVANCE:\s*(.+?)(?=\nTAKE:|\nHIGHLIGHTS:|\nSYNOPSIS:|\Z)", raw_text, re.DOTALL)
            relevance_text = relevance_match.group(1).strip() if relevance_match else ""

            # If Claude generated filler, retry once with a stronger prompt
            all_generated_text = f"{take_text} {synopsis_text} {' '.join(str(h) for h in highlights)} {' '.join(str(b) for b in bullets)}"
            if _is_refusal_take(all_generated_text):
                print(f"      🔄 Filler detected — retrying with stronger prompt...")
                retry_response = client.messages.create(
                    model="claude-sonnet-4-20250514",
                    max_tokens=700,
                    system=SYSTEM_PROMPT,
                    messages=[{
                        "role": "user",
                        "content": (
                            f"Headline: {story['title']}\n"
                            f"Source: {story['source']}\n\n"
                            f"Summary: {story['summary']}\n\n"
                            f"Write your analysis based on the headline and your knowledge of this topic. "
                            f"Be confident and specific — use real data points, trends, and context you know about this subject. "
                            f"DO NOT use placeholder language, DO NOT say data is missing or unavailable. "
                            f"Write as if you are an expert who read this article and is now briefing school counselors.\n\n"
                            f"SYNOPSIS: [2-sentence neutral summary]\n"
                            f"HIGHLIGHTS:\n"
                            f"- LABEL: [label] | TEXT: [specific insight]\n"
                            f"- LABEL: [label] | TEXT: [specific insight]\n"
                            f"- LABEL: [label] | TEXT: [specific insight]\n"
                            f"TAKE: [1-2 sentence sharp editorial take]\n"
                            f"RELEVANCE: [1 sentence connecting to TSI/college readiness]"
                        )
                    }]
                )
                raw_text = retry_response.content[0].text.strip()
                # Re-parse
                synopsis_match = re.search(r"SYNOPSIS:\s*(.+?)(?=\nHIGHLIGHTS:|\nTAKE:|\nRELEVANCE:|\Z)", raw_text, re.DOTALL)
                synopsis_text = synopsis_match.group(1).strip() if synopsis_match else synopsis_text
                highlights_match = re.search(r"HIGHLIGHTS:\s*(.+?)(?=\nTAKE:|\nRELEVANCE:|\Z)", raw_text, re.DOTALL)
                highlights = []
                bullets = []
                if highlights_match:
                    for line in highlights_match.group(1).strip().splitlines():
                        line = re.sub(r"^[\s\-\*•]+", "", line).strip()
                        if not line:
                            continue
                        hl_match = re.match(r"LABEL:\s*(.+?)\s*\|\s*TEXT:\s*(.+)", line)
                        if hl_match:
                            highlights.append({"label": hl_match.group(1).strip(), "text": hl_match.group(2).strip()})
                            bullets.append(f"{hl_match.group(1).strip()}: {hl_match.group(2).strip()}")
                        else:
                            highlights.append({"label": "Key Point", "text": line})
                            bullets.append(line)
                highlights = highlights[:4]
                bullets = bullets[:4]
                take_match = re.search(r"TAKE:\s*(.+?)(?=\nRELEVANCE:|\nHIGHLIGHTS:|\nSYNOPSIS:|\Z)", raw_text, re.DOTALL)
                if take_match:
                    take_text = take_match.group(1).strip()
                take_text = re.sub(r"^\*{0,2}SureScore Take:?\*{0,2}\s*", "", take_text).strip()
                relevance_match = re.search(r"RELEVANCE:\s*(.+?)(?=\nTAKE:|\nHIGHLIGHTS:|\nSYNOPSIS:|\Z)", raw_text, re.DOTALL)
                relevance_text = relevance_match.group(1).strip() if relevance_match else relevance_text
                print(f"      ✅ Retry successful")

            story["take"] = take_text
            story["synopsis"] = synopsis_text
            story["highlights"] = highlights
            story["relevance"] = relevance_text
            story["bullets"] = bullets  # backward compat

            good_stories.append(story)
        except Exception as e:
            print(f"   ⚠️  Error generating take: {e}")

    print(f"✅ {len(good_stories)} quality takes generated\n")
    return good_stories


def generate_subject_line(stories):
    """Use Claude API to generate a curated roundup subject line from the selected stories."""
    print("📝 Generating subject line...")
    client = Anthropic(api_key=ANTHROPIC_API_KEY)

    headlines = "\n".join(f"- {s['title']}" for s in stories if not s.get("satire"))

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=100,
            messages=[{
                "role": "user",
                "content": (
                    "You write subject lines for SureScore Intel, a weekly newsletter for Texas school counselors.\n\n"
                    "Here are this week's story headlines:\n"
                    f"{headlines}\n\n"
                    "Write ONE subject line in the 'curated roundup' style. Format: pick 2-3 catchy topic phrases "
                    "separated by commas, ending with '— this week in SureScore Intel'.\n"
                    "Examples:\n"
                    "- This week in SureScore Intel — TIA records, grade inflation at Harvard, and the SAT debate\n"
                    "- This week in SureScore Intel — CCMR gains in Humble ISD, dual enrollment surges, and a Title IX showdown\n\n"
                    "IMPORTANT: Always start with 'This week in SureScore Intel — ' followed by the topic phrases.\n"
                    "Keep it under 90 characters if possible. Be specific — use district names, numbers, or bold claims from the headlines.\n"
                    "Reply with ONLY the subject line, nothing else."
                ),
            }],
        )
        subject = response.content[0].text.strip().strip('"')
        print(f"   ✅ Subject: {subject}")
        return subject
    except Exception as e:
        print(f"   ⚠️  Subject line generation failed: {e}")
        today = datetime.now().strftime("%B %d, %Y")
        return f"SureScore Intel — {today}"


# ============================================================
# STEP 2B: SATIRICAL CLOSER — DATABASE-DRIVEN ROTATION
# ============================================================

SATIRE_WRITE_PROMPT = """You are a comedy writer for The Onion, writing for a college admissions newsletter read by Texas school counselors and educators.

Given this satirical headline, write a deadpan fake news summary and a funny SureScore Take.

HEADLINE: {headline}

RULES:
- The summary should be 2-3 sentences, written like a real news blurb — completely straight-faced
- The SureScore Take should be witty and play along with the joke while staying in the sharp, confident SureScore editorial voice
- Keep it clean — no sex, violence, politics, or anything offensive
- The humor comes from treating the absurd as completely normal

Respond in this EXACT format (no other text):
SUMMARY: [your fake summary]
TAKE: [your funny SureScore Take]
"""


def generate_satire(conn):
    """Pick the next satirical headline from the DB and generate the summary/take."""
    print("😂 Generating satirical closer...")

    headline_id, headline = get_next_satire_headline(conn)
    if not headline:
        print("   ⚠️  No active satire headlines in the database")
        return None

    print(f"   📰 Using: {headline[:60]}...")

    try:
        client = Anthropic(api_key=ANTHROPIC_API_KEY)

        def _make_satire_request():
            return client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=400,
                messages=[{
                    "role": "user",
                    "content": SATIRE_WRITE_PROMPT.format(headline=headline),
                }]
            )

        message = _call_with_retry(_make_satire_request)
        text = message.content[0].text.strip()

        summary_match = re.search(r"SUMMARY:\s*(.+?)(?=TAKE:|$)", text, re.DOTALL)
        take_match = re.search(r"TAKE:\s*(.+)", text, re.DOTALL)

        if summary_match and take_match:
            mark_satire_used(conn, headline_id)
            story = {
                "title": headline,
                "summary": summary_match.group(1).strip(),
                "take": take_match.group(1).strip(),
                "link": "",
                "source": "SureScore Intel Satire Desk",
                "category": "YOU CAN'T MAKE THIS UP",
                "published": datetime.now().strftime("%B %d, %Y"),
                "satire": True,
                "_headline_id": headline_id,
            }
            print(f"   ✅ {story['title'][:60]}...")
            return story
        else:
            print("   ⚠️  Couldn't parse satire response")
            return None
    except Exception as e:
        print(f"   ⚠️  Error generating satire: {e}")
        return None


# ============================================================
# CANDIDATE STORIES (Friday preview workflow)
# ============================================================

def save_candidates(conn, stories):
    """Save candidate stories to PostgreSQL for the Monday preview.

    Clears unselected candidates from today's batch to allow safe re-runs.
    """
    batch_date = datetime.now().strftime("%Y-%m-%d")
    cur = conn.cursor()
    cur.execute(
        'DELETE FROM "CandidateStory" WHERE "batchDate" = %s AND selected = false',
        (batch_date,)
    )
    for i, story in enumerate(stories):
        cur.execute("""
            INSERT INTO "CandidateStory"
            (id, "batchDate", position, title, summary, source, category, link, published, "isTexas", selected)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, false)
        """, (
            _generate_cuid(), batch_date, i + 1,
            story.get("title", ""), story.get("summary", ""),
            story.get("source", ""), story.get("category", ""),
            story.get("link", ""), story.get("published", ""),
            bool(story.get("texas")),
        ))
    conn.commit()
    return batch_date


def load_latest_candidates(conn):
    """Load the most recent batch of candidate stories."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('SELECT DISTINCT "batchDate" FROM "CandidateStory" ORDER BY "batchDate" DESC LIMIT 1')
    row = cur.fetchone()
    if not row:
        return None, []
    batch_date = row["batchDate"]
    cur.execute("""
        SELECT id, "batchDate" as batch_date, position, title, summary, source,
               category, link, published, "isTexas" as is_texas, selected
        FROM "CandidateStory"
        WHERE "batchDate" = %s
        ORDER BY position ASC
    """, (batch_date,))
    candidates = [dict(row) for row in cur.fetchall()]
    return batch_date, candidates


def mark_candidates_selected(conn, batch_date, positions):
    """Mark specific candidate positions as selected."""
    cur = conn.cursor()
    for pos in positions:
        cur.execute("""
            UPDATE "CandidateStory" SET selected = true
            WHERE "batchDate" = %s AND position = %s
        """, (batch_date, pos))
    conn.commit()


# ============================================================
# STEP 3: BUILD EMAIL
# ============================================================

def _wrap_click_url(click_tracking_base, destination):
    """Wrap a destination URL through the click tracking redirect."""
    from urllib.parse import quote
    return f"{click_tracking_base}&u={quote(destination, safe='')}"


def build_email_html(stories, unsubscribe_url=None, tracking_pixel_url=None, click_tracking_base=None):
    """Create a beautiful HTML email with the digest."""
    today = datetime.now().strftime("%A, %B %d, %Y")

    # --- Ad blocks (inserted between stories) ---
    contact_url = _wrap_click_url(click_tracking_base, 'https://surescore.com/contact') if click_tracking_base else 'https://surescore.com/contact'
    tia_url = _wrap_click_url(click_tracking_base, 'https://surescore.com/services/tia-platform') if click_tracking_base else 'https://surescore.com/services/tia-platform'

    AD_TIA = f"""
        <tr><td style="padding: 8px 0 32px 0;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #1a1a2e 0%, #2d2b55 100%); border-radius: 10px; overflow: hidden;">
                <tr><td style="padding: 28px 28px 8px;">
                    <p style="font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #d97706; margin: 0 0 6px 0;">
                        FROM SURESCORE
                    </p>
                    <p style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.35; margin: 0 0 12px 0;">
                        Still wrestling spreadsheets for TIA submissions?
                    </p>
                </td></tr>
                <tr><td style="padding: 0 28px;">
                    <p style="font-family: -apple-system, sans-serif; font-size: 14px; color: rgba(255,255,255,0.8); line-height: 1.6; margin: 0 0 16px 0;">
                        SureScore's <strong style="color: #ffffff;">TIA Data Platform</strong> automates the entire Teacher Incentive Allotment workflow &mdash; from roster matching across 12 assessment vendors to generating submission-ready 30-column TEA files. No more manual formulas. No more formatting nightmares.
                    </p>
                </td></tr>
                <tr><td style="padding: 0 28px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td style="padding: 0 0 6px 0;">
                                <span style="font-family: -apple-system, sans-serif; font-size: 13px; color: rgba(255,255,255,0.7);">&#10003;&nbsp; Automatic roster-to-assessment matching</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0 0 6px 0;">
                                <span style="font-family: -apple-system, sans-serif; font-size: 13px; color: rgba(255,255,255,0.7);">&#10003;&nbsp; TEA-aligned growth calculations built in</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0 0 6px 0;">
                                <span style="font-family: -apple-system, sans-serif; font-size: 13px; color: rgba(255,255,255,0.7);">&#10003;&nbsp; Error &amp; gap flagging before you submit</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0 0 6px 0;">
                                <span style="font-family: -apple-system, sans-serif; font-size: 13px; color: rgba(255,255,255,0.7);">&#10003;&nbsp; Teacher self-service roster verification portal</span>
                            </td>
                        </tr>
                    </table>
                </td></tr>
                <tr><td style="padding: 20px 28px 28px;">
                    <a href="{tia_url}" style="display: inline-block; padding: 12px 28px; background-color: #d97706; color: #ffffff; font-family: -apple-system, sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 6px;">Learn More &rarr;</a>
                    &nbsp;&nbsp;
                    <a href="{contact_url}" style="font-family: -apple-system, sans-serif; font-size: 13px; color: #d97706; text-decoration: underline;">Request a Demo</a>
                </td></tr>
            </table>
        </td></tr>
    """

    AD_AI_TUTORS = f"""
        <tr><td style="padding: 8px 0 32px 0;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #d97706; border-radius: 10px; overflow: hidden; background-color: #fffbf5;">
                <tr><td style="padding: 28px 28px 8px;">
                    <p style="font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #d97706; margin: 0 0 6px 0;">
                        NEW FROM SURESCORE
                    </p>
                    <p style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #1a1a2e; line-height: 1.35; margin: 0 0 12px 0;">
                        AI Tutors are here &mdash; and they never call in sick.
                    </p>
                </td></tr>
                <tr><td style="padding: 0 28px;">
                    <p style="font-family: -apple-system, sans-serif; font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 16px 0;">
                        SureScore's <strong style="color: #1a1a2e;">AI Tutor</strong> is a fully personalized, mastery-based learning companion built for TSIA2 prep. It delivers SureScore's proven curriculum through Socratic dialogue &mdash; not passive drills. Every student gets a patient, expert tutor available 24/7, regardless of location or school resources.
                    </p>
                </td></tr>
                <tr><td style="padding: 0 28px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td style="padding: 0 0 6px 0;">
                                <span style="font-family: -apple-system, sans-serif; font-size: 13px; color: #666;">&#10003;&nbsp; Diagnostic-driven, personalized learning paths</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0 0 6px 0;">
                                <span style="font-family: -apple-system, sans-serif; font-size: 13px; color: #666;">&#10003;&nbsp; Socratic method &mdash; guides breakthroughs, never just gives answers</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0 0 6px 0;">
                                <span style="font-family: -apple-system, sans-serif; font-size: 13px; color: #666;">&#10003;&nbsp; TSIA2 Math &amp; ELAR aligned, available 24/7</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0 0 6px 0;">
                                <span style="font-family: -apple-system, sans-serif; font-size: 13px; color: #666;">&#10003;&nbsp; Zero additional teacher burden</span>
                            </td>
                        </tr>
                    </table>
                </td></tr>
                <tr><td style="padding: 20px 28px 28px;">
                    <a href="{_wrap_click_url(click_tracking_base, 'https://surescore.com/services/ai-tutor') if click_tracking_base else 'https://surescore.com/services/ai-tutor'}" style="display: inline-block; padding: 12px 28px; background-color: #d97706; color: #ffffff; font-family: -apple-system, sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 6px;">Learn More &rarr;</a>
                    &nbsp;&nbsp;
                    <a href="{contact_url}" style="font-family: -apple-system, sans-serif; font-size: 13px; color: #d97706; text-decoration: underline;">Schedule a Demo</a>
                </td></tr>
            </table>
        </td></tr>
    """

    # Ads to insert after story positions (0-indexed): after story 2 and story 4
    ad_insertions = {2: AD_TIA, 4: AD_AI_TUTORS}

    stories_html = ""
    for i, story in enumerate(stories):
        is_satire = story.get("satire", False)

        # Satire stories get a different visual treatment
        if is_satire:
            stories_html += f"""
        <tr><td style="padding: 0 0 32px 0;">
            <!-- Satire divider -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
                <td style="padding: 16px 0; text-align: center;">
                    <hr style="border: none; border-top: 2px dashed #d97706; margin-bottom: 8px;">
                </td>
            </tr></table>
            <!-- Category & Date -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
                <td style="font-family: 'Courier New', monospace; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #d97706; padding-bottom: 8px;">
                    &#128064; {story['category']}
                </td>
                <td align="right" style="font-family: 'Courier New', monospace; font-size: 11px; color: #999; padding-bottom: 8px;">
                    {story['published']}
                </td>
            </tr></table>

            <!-- Headline -->
            <p style="color: #1a1a2e; font-family: Georgia, serif; font-size: 19px; font-weight: 700; line-height: 1.35; margin: 0; padding-bottom: 10px;">
                {story['title']}
            </p>

            <!-- Summary -->
            <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #666; margin: 0 0 14px 0;">
                {story['summary']}
            </p>

            <!-- SureScore Take -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
                <td style="border-left: 3px solid #d97706; padding: 14px 18px; background-color: #fffbf5;">
                    <p style="font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #d97706; margin: 0 0 8px 0;">
                        ★ SURESCORE TAKE
                    </p>
                    <p style="font-family: Georgia, serif; font-size: 15px; font-style: italic; line-height: 1.65; color: #333; margin: 0;">
                        {story['take']}
                    </p>
                </td>
            </tr></table>
        </td></tr>
        """
        else:
            story_url = _wrap_click_url(click_tracking_base, story['link']) if click_tracking_base else story['link']

            # Extract source domain for CTA button
            source_name = story.get('source', '')
            # Clean up feed names like "Google News — X" to just the domain
            if ' — ' in source_name:
                source_name = source_name.split(' — ', 1)[0]
            if not source_name:
                source_name = 'Source'

            # Synopsis: use new field, fall back to RSS summary for old digests
            synopsis_text = story.get('synopsis', '') or story.get('summary', '')[:250]

            # Build highlights section (numbered list with bold labels)
            highlights = story.get('highlights', [])
            highlights_html = ''
            if highlights:
                hl_rows = ''
                for idx, hl in enumerate(highlights[:4]):
                    num = f"{idx + 1:02d}"
                    if isinstance(hl, dict):
                        label = hl.get('label', 'Key Point')
                        text_val = hl.get('text', '')
                    else:
                        # Plain string format: "Label: text" or just text
                        parts = str(hl).split(': ', 1) if ': ' in str(hl) else ['Key Point', str(hl)]
                        label = parts[0]
                        text_val = parts[1] if len(parts) > 1 else parts[0]
                    hl_rows += f"""
                    <tr>
                        <td style="vertical-align: top; padding: 0 10px 8px 0; width: 24px;">
                            <span style="font-family: 'Courier New', monospace; font-size: 12px; font-weight: 700; color: #d97706;">{num}</span>
                        </td>
                        <td style="vertical-align: top; padding: 0 0 8px 0;">
                            <p style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; line-height: 1.55; color: #333; margin: 0;">
                                <strong>{label}</strong> &mdash; {text_val}
                            </p>
                        </td>
                    </tr>"""
                highlights_html = f"""
                <!-- KEY HIGHLIGHTS -->
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding-top: 4px;">
                    <tr><td style="padding-bottom: 8px;">
                        <p style="font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #999; margin: 0;">
                            KEY HIGHLIGHTS
                        </p>
                    </td></tr>
                    <tr><td>
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            {hl_rows}
                        </table>
                    </td></tr>
                </table>"""
            elif story.get('bullets'):
                # Fallback: old bullet style for backward compat
                bullet_items = ''.join(
                    f'<p style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; line-height: 1.55; color: #555; margin: 0 0 6px 0; padding-left: 14px; text-indent: -14px;">&#8226;&nbsp; {b}</p>'
                    for b in story.get('bullets', [])
                )
                highlights_html = f"""
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding-top: 4px;"><tr>
                    <td style="padding: 0 0 0 4px;">{bullet_items}</td>
                </tr></table>"""

            # Relevance bar (hidden if empty)
            relevance_text = story.get('relevance', '')
            relevance_html = ''
            if relevance_text:
                relevance_html = f"""
                <!-- Relevance Bar -->
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 14px;"><tr>
                    <td style="border: 1px dashed #e5e7eb; border-radius: 6px; padding: 10px 14px;">
                        <p style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; line-height: 1.5; color: #666; margin: 0;">
                            &#8505; <strong style="color: #555;">Why it matters:</strong> {relevance_text}
                        </p>
                    </td>
                </tr></table>"""

            stories_html += f"""
        <tr><td style="padding: 0 0 32px 0;">
            <!-- 1. Category pill & Date -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
                <td style="padding-bottom: 8px;">
                    <span style="display: inline-block; font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #92400e; background-color: #fef3c7; padding: 3px 8px; border-radius: 3px;">
                        {story['category']}
                    </span>
                </td>
                <td align="right" style="font-family: 'Courier New', monospace; font-size: 11px; color: #999; padding-bottom: 8px;">
                    {story['published']}
                </td>
            </tr></table>

            <!-- 2. Headline (plain text, no link wrapper) -->
            <p style="color: #1a1a2e; font-family: Georgia, serif; font-size: 19px; font-weight: 700; line-height: 1.35; margin: 0; padding-bottom: 6px;">
                {story['title']}
            </p>

            <!-- 3. Source line with link -->
            <p style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; color: #999; margin: 0 0 14px 0;">
                {source_name} &nbsp;<a href="{story_url}" style="color: #d97706; text-decoration: none;">&#8599;</a>
            </p>

            <!-- 4. SUMMARY section -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr><td style="padding-bottom: 4px;">
                    <p style="font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #999; margin: 0;">
                        SUMMARY
                    </p>
                </td></tr>
                <tr><td>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #555; margin: 0 0 14px 0;">
                        {synopsis_text}
                    </p>
                </td></tr>
            </table>

            <!-- 5. KEY HIGHLIGHTS -->
            {highlights_html}

            <!-- Separator: info → opinion -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 18px;"><tr>
                <td style="border-top: 1px solid #f0f0f0; padding: 0; line-height: 0; font-size: 0;">&nbsp;</td>
            </tr></table>

            <!-- 6. SureScore Take (compact amber box) -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 14px;"><tr>
                <td style="border-left: 3px solid #d97706; padding: 12px 16px; background-color: #fffbf5;">
                    <p style="font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #d97706; margin: 0 0 6px 0;">
                        &#9733; SURESCORE TAKE
                    </p>
                    <p style="font-family: Georgia, serif; font-size: 14px; font-style: italic; line-height: 1.6; color: #333; margin: 0;">
                        {story['take']}
                    </p>
                </td>
            </tr></table>

            <!-- 7. Relevance bar -->
            {relevance_html}

            <!-- 8. CTA Button -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 16px;"><tr>
                <td align="center">
                    <a href="{story_url}" style="display: block; width: 100%; padding: 12px 0; background-color: #d97706; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; text-align: center; border-radius: 6px;">
                        Read Full Article on {source_name} &rarr;
                    </a>
                </td>
            </tr></table>

            <!-- 9. Divider -->
            {'<hr style="border: none; border-top: 1px solid #eee; margin-top: 28px;">' if i < len(stories) - 1 else ''}
        </td></tr>
        """

        # Insert ad block after specific story positions
        if i in ad_insertions:
            stories_html += ad_insertions[i]

    html = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <!-- Wrapper -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f0;">
        <tr><td align="center" style="padding: 24px 16px;">
            <!-- Main Container -->
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">

                <!-- Header -->
                <tr><td style="background-color: #1a1a2e; padding: 28px 32px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" border="0"><tr>
                                <td style="vertical-align: middle; background-color: #ffffff; border-radius: 8px; padding: 6px 10px;">
                                    <a href="https://surescore.com" style="text-decoration: none;"><img src="https://surescore.com/surescore-logo.png" alt="SureScore" width="180" style="display: block; height: auto; border: 0;" /></a>
                                </td>
                                <td style="padding-left: 16px; vertical-align: middle;">
                                    <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 22px; font-weight: 700; color: #ffffff;">
                                        Intel
                                    </p>
                                </td>
                            </tr></table>
                        </td>
                        <td align="right" style="font-family: 'Courier New', monospace; font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: 0.5px;">
                            WEEKLY BRIEFING
                        </td>
                    </tr></table>
                    <p style="font-family: Georgia, serif; font-size: 14px; color: rgba(255,255,255,0.6); margin: 14px 0 0 0; line-height: 1.5;">
                        College Admissions &amp; TSIA trends that matter for Texas educators and families.
                    </p>
                </td></tr>

                <!-- Date Bar -->
                <tr><td style="background-color: #f9f9f6; padding: 12px 32px; border-bottom: 1px solid #eee;">
                    <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 13px; color: #888;">
                        📅 {today} &nbsp;&middot;&nbsp; {len(stories)} stories
                    </p>
                </td></tr>

                <!-- Stories -->
                <tr><td style="padding: 28px 32px 8px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        {stories_html}
                    </table>
                </td></tr>

                <!-- Bottom CTA -->
                <tr><td style="padding: 16px 32px 28px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-left: 3px solid #d97706; background-color: #fffbf5; border-radius: 0 6px 6px 0;">
                        <tr><td style="padding: 16px 20px;">
                            <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 14px; color: #555; line-height: 1.5;">
                                <strong style="color: #1a1a1a;">Want to learn more?</strong> &nbsp;SureScore partners with districts across Texas to raise college-readiness scores.
                                &nbsp;<a href="{contact_url}" style="color: #d97706; font-weight: 600; text-decoration: none;">Get in touch &rarr;</a>
                            </p>
                        </td></tr>
                    </table>
                </td></tr>

                <!-- Footer -->
                <tr><td style="background-color: #f9f9f6; padding: 28px 32px; border-top: 1px solid #eee;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr><td align="center" style="padding-bottom: 14px;">
                            <a href="https://surescore.com" style="text-decoration: none;"><img src="https://surescore.com/surescore-logo.png" alt="SureScore" width="140" style="display: block; height: auto; border: 0;" /></a>
                        </td></tr>
                        <tr><td align="center" style="padding-bottom: 10px;">
                            <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 12px; color: #888;">
                                <a href="https://surescore.com" style="color: #d97706; text-decoration: none; font-weight: 600;">Website</a>
                                &nbsp;&middot;&nbsp;
                                <a href="https://surescore.com/contact" style="color: #d97706; text-decoration: none; font-weight: 600;">Contact Us</a>
                                &nbsp;&middot;&nbsp;
                                <a href="https://surescore.com/about" style="color: #d97706; text-decoration: none; font-weight: 600;">About</a>
                            </p>
                        </td></tr>
                        <tr><td align="center" style="padding-bottom: 6px;">
                            <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 11px; color: #bbb;">
                                A Texas-based company &middot; Empowering every Texas student
                            </p>
                        </td></tr>
                        {'<tr><td align="center"><p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 11px; text-align: center;"><a href="' + unsubscribe_url + '" style="color: #999; text-decoration: underline;">Unsubscribe</a></p></td></tr>' if unsubscribe_url else ''}
                    </table>
                </td></tr>

            </table>
        </td></tr>
        </table>
        {f'<img src="{tracking_pixel_url}" width="1" height="1" alt="" style="display:block;border:0;" />' if tracking_pixel_url else ''}
    </body>
    </html>
    """
    return html


def build_preview_email_html(candidates, monday_date_str):
    """Build the Friday preview email with numbered candidate list."""
    today = datetime.now().strftime("%A, %B %d, %Y")

    rows_html = ""
    for c in candidates:
        pos = c["position"]
        tx_badge = ' <span style="background-color: #dc2626; color: white; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 3px; letter-spacing: 0.5px;">TX</span>' if c["is_texas"] else ""

        rows_html += f"""
        <tr><td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
                <td style="width: 36px; vertical-align: top;">
                    <span style="display: inline-block; background-color: #d97706; color: white; font-family: -apple-system, sans-serif; font-size: 14px; font-weight: 700; width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 50%;">
                        {pos}
                    </span>
                </td>
                <td style="padding-left: 12px; vertical-align: top;">
                    <p style="margin: 0 0 4px 0; font-family: Georgia, serif; font-size: 16px; font-weight: 700; color: #1a1a2e; line-height: 1.35;">
                        <a href="{c['link']}" style="color: #1a1a2e; text-decoration: none;">{c['title']}</a>{tx_badge}
                    </p>
                    <p style="margin: 0 0 4px 0; font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700; letter-spacing: 1px; color: #d97706;">
                        {c['category']} &middot; <span style="color: #999; font-weight: 400;">{c['source']}</span>
                    </p>
                    <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 13px; line-height: 1.5; color: #666;">
                        {c['summary'][:200]}{'...' if len(c['summary']) > 200 else ''}
                    </p>
                </td>
            </tr></table>
        </td></tr>
        """

    html = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f0;">
        <tr><td align="center" style="padding: 24px 16px;">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">

                <!-- Header -->
                <tr><td style="background-color: #1a1a2e; padding: 28px 32px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" border="0"><tr>
                                <td style="vertical-align: middle; background-color: #ffffff; border-radius: 8px; padding: 6px 10px;">
                                    <a href="https://surescore.com" style="text-decoration: none;"><img src="https://surescore.com/surescore-logo.png" alt="SureScore" width="180" style="display: block; height: auto; border: 0;" /></a>
                                </td>
                                <td style="padding-left: 16px; vertical-align: middle;">
                                    <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 22px; font-weight: 700; color: #ffffff;">
                                        Intel
                                    </p>
                                </td>
                            </tr></table>
                        </td>
                        <td align="right" style="font-family: 'Courier New', monospace; font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: 0.5px;">
                            PICK YOUR 5
                        </td>
                    </tr></table>
                    <p style="font-family: Georgia, serif; font-size: 14px; color: rgba(255,255,255,0.6); margin: 14px 0 0 0; line-height: 1.5;">
                        This week's candidate stories — reply with your top 5 picks.
                    </p>
                </td></tr>

                <!-- Date Bar -->
                <tr><td style="background-color: #f9f9f6; padding: 12px 32px; border-bottom: 1px solid #eee;">
                    <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 13px; color: #888;">
                        📅 {today} &nbsp;&middot;&nbsp; {len(candidates)} candidates for {monday_date_str}
                    </p>
                </td></tr>

                <!-- Candidate List -->
                <tr><td style="padding: 16px 32px 8px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        {rows_html}
                    </table>
                </td></tr>

                <!-- Reply CTA -->
                <tr><td style="padding: 20px 32px 28px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fffbf5; border: 1px solid #f0e6d0; border-radius: 8px;">
                        <tr><td style="padding: 20px 24px; text-align: center;">
                            <p style="margin: 0 0 8px 0; font-family: -apple-system, sans-serif; font-size: 15px; font-weight: 700; color: #1a1a2e;">
                                Reply with your 5 picks
                            </p>
                            <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 13px; color: #666; line-height: 1.5;">
                                Just reply to this email with the numbers (e.g., "1, 3, 7, 12, 15") by Sunday night.<br>
                                Your selections will go out in Monday's digest.
                            </p>
                        </td></tr>
                    </table>
                </td></tr>

                <!-- Footer -->
                <tr><td style="background-color: #f9f9f6; padding: 28px 32px; border-top: 1px solid #eee;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr><td align="center" style="padding-bottom: 14px;">
                            <a href="https://surescore.com" style="text-decoration: none;"><img src="https://surescore.com/surescore-logo.png" alt="SureScore" width="140" style="display: block; height: auto; border: 0;" /></a>
                        </td></tr>
                        <tr><td align="center" style="padding-bottom: 10px;">
                            <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 12px; color: #888;">
                                <a href="https://surescore.com" style="color: #d97706; text-decoration: none; font-weight: 600;">Website</a>
                                &nbsp;&middot;&nbsp;
                                <a href="https://surescore.com/contact" style="color: #d97706; text-decoration: none; font-weight: 600;">Contact Us</a>
                                &nbsp;&middot;&nbsp;
                                <a href="https://surescore.com/about" style="color: #d97706; text-decoration: none; font-weight: 600;">About</a>
                            </p>
                        </td></tr>
                        <tr><td align="center">
                            <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 11px; color: #bbb;">
                                A Texas-based company &middot; Empowering every Texas student
                            </p>
                        </td></tr>
                    </table>
                </td></tr>

            </table>
        </td></tr>
        </table>
    </body>
    </html>
    """
    return html


def build_plaintext(stories):
    """Create a plaintext fallback version of the digest."""
    today = datetime.now().strftime("%A, %B %d, %Y")
    lines = [
        "SURESCORE INTEL — WEEKLY BRIEFING",
        f"{today} | {len(stories)} stories",
        "=" * 50,
        "",
    ]
    for story in stories:
        lines.append(f"[{story['category']}] {story['title']}")
        lines.append(f"Published: {story['published']}")
        lines.append(f"Source: {story['source']}")
        lines.append("")

        # SUMMARY
        synopsis = story.get('synopsis', '') or story.get('summary', '')[:250]
        lines.append("SUMMARY:")
        lines.append(synopsis)
        lines.append("")

        # KEY HIGHLIGHTS
        highlights = story.get('highlights', [])
        if highlights:
            lines.append("KEY HIGHLIGHTS:")
            for idx, hl in enumerate(highlights[:4]):
                num = f"{idx + 1:02d}"
                label = hl.get('label', 'Key Point')
                text_val = hl.get('text', '')
                lines.append(f"  {num}. {label} — {text_val}")
            lines.append("")
        elif story.get("bullets"):
            lines.append("KEY POINTS:")
            for b in story["bullets"]:
                lines.append(f"  • {b}")
            lines.append("")

        # TAKE
        lines.append(f"★ SURESCORE TAKE: {story['take']}")
        lines.append("")

        # WHY IT MATTERS
        relevance = story.get('relevance', '')
        if relevance:
            lines.append(f"WHY IT MATTERS: {relevance}")
            lines.append("")

        lines.append(f"Read more: {story['link']}")
        lines.append("-" * 50)
        lines.append("")
    return "\n".join(lines)


# ============================================================
# STEP 4: SEND EMAIL
# ============================================================

def send_email(stories, recipients=None, digest_id=None, conn=None, pg_digest_id=None, batch_num=1):
    """Send the digest email via AWS SES (50k/day limit)."""
    if recipients is None:
        recipients = RECIPIENTS
    print("📧 Sending email digest via SES...")

    if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
        print("❌ AWS SES credentials not set. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.")
        return

    ses_client = boto3.client(
        "ses",
        region_name=AWS_SES_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    )

    subject = generate_subject_line(stories)

    text_content = build_plaintext(stories)
    from urllib.parse import quote
    import time

    sent_count = 0
    fail_count = 0

    for i, recipient in enumerate(recipients):
        try:
            # Generate a per-recipient unsubscribe URL
            unsub_url = _build_unsubscribe_url(recipient) if UNSUBSCRIBE_SECRET else None

            # Generate a per-recipient tracking pixel URL
            tracking_url = None
            click_base = None
            if digest_id and SITE_URL:
                tracking_url = f"{SITE_URL}/api/track/open?e={quote(recipient)}&d={digest_id}"
                click_base = f"{SITE_URL}/api/track/click?e={quote(recipient)}&d={digest_id}"

            html_content = build_email_html(stories, unsubscribe_url=unsub_url, tracking_pixel_url=tracking_url, click_tracking_base=click_base)

            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = SES_SENDER
            msg["To"] = recipient
            if unsub_url:
                msg["List-Unsubscribe"] = f"<{unsub_url}>"
                msg["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"

            msg.attach(MIMEText(text_content, "plain"))
            msg.attach(MIMEText(html_content, "html"))

            ses_client.send_raw_email(
                Source=SES_SENDER,
                Destinations=[recipient],
                RawMessage={"Data": msg.as_string()},
            )

            sent_count += 1
            if conn and digest_id:
                conn.cursor().execute('INSERT INTO "DigestSendLog" (id, "digestId", email) VALUES (%s, %s, %s) ON CONFLICT ("digestId", email) DO NOTHING', (_generate_cuid(), str(digest_id), recipient))
                if sent_count % 20 == 0:
                    conn.commit()
            if pg_digest_id:
                pg_record_send(pg_digest_id, recipient, batch_num)
            if (i + 1) % 50 == 0:
                print(f"   📬 Progress: {i + 1}/{len(recipients)} sent...")

            # Rate limit: ~10/sec to stay well under SES's 14/sec limit
            if i < len(recipients) - 1:
                time.sleep(0.1)

        except ClientError as e:
            fail_count += 1
            error_code = e.response["Error"]["Code"]
            print(f"   ❌ Failed to send to {recipient}: {error_code} — {e.response['Error']['Message']}")
        except Exception as e:
            fail_count += 1
            print(f"   ❌ Failed to send to {recipient}: {e}")

    if conn:
        conn.commit()

    print(f"\n🎉 Digest complete! ✅ {sent_count} sent, ❌ {fail_count} failed")


def send_preview_email(candidates, monday_date_str):
    """Send the Friday preview email to Roy."""
    print("📧 Sending preview email to Roy...")

    subject = f"SureScore Intel — Pick Your 5 for {monday_date_str}"
    html_content = build_preview_email_html(candidates, monday_date_str)

    # Plaintext fallback
    text_lines = [
        f"SURESCORE INTEL — PICK YOUR 5 FOR {monday_date_str.upper()}",
        "=" * 50,
        "",
    ]
    for c in candidates:
        tx = " [TX]" if c["is_texas"] else ""
        text_lines.append(f"{c['position']}. {c['title']}{tx}")
        text_lines.append(f"   {c['category']} | {c['source']}")
        text_lines.append(f"   {c['summary'][:150]}...")
        text_lines.append(f"   {c['link']}")
        text_lines.append("")
    text_lines.append("-" * 50)
    text_lines.append("Reply with your 5 picks (e.g., '1, 3, 7, 12, 15') by Sunday night.")
    text_content = "\n".join(text_lines)

    if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
        print("❌ AWS SES credentials not set. Cannot send preview email.")
        return

    try:
        ses_client = boto3.client(
            "ses",
            region_name=AWS_SES_REGION,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )

        preview_recipients = [r.strip() for r in os.environ.get("DIGEST_RECIPIENTS", ROY_EMAIL).split(",") if r.strip()]

        for recipient in preview_recipients:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = SES_SENDER
            msg["To"] = recipient

            msg.attach(MIMEText(text_content, "plain"))
            msg.attach(MIMEText(html_content, "html"))

            ses_client.send_raw_email(
                Source=SES_SENDER,
                Destinations=[recipient],
                RawMessage={"Data": msg.as_string()},
            )
            print(f"   ✅ Preview sent to {recipient}")

    except ClientError as e:
        print(f"   ❌ Failed to send preview: {e.response['Error']['Message']}")
    except Exception as e:
        print(f"   ❌ Failed to send preview: {e}")


# ============================================================
# IMAP REPLY PARSING
# ============================================================

def check_reply_via_imap(monday_date_str):
    """Connect to Gmail via IMAP and find Roy's reply with his picks.

    Searches for replies to the Friday preview email by matching the subject line.
    Extracts numbers 1-20 from the reply body.

    Returns:
        List of selected position numbers (up to 5), or None if no reply found.
    """
    print("📬 Checking for Roy's reply via IMAP...")

    try:
        context = ssl.create_default_context()
        mail = imaplib.IMAP4_SSL("imap.gmail.com", 993, ssl_context=context)
        mail.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        mail.select("INBOX")

        # Search for replies to the preview email
        preview_subject = f"SureScore Intel — Pick Your 5 for {monday_date_str}"
        # Gmail search: replies will have "Re:" prefix
        search_query = f'(SUBJECT "Re: {preview_subject}" FROM "{ROY_EMAIL}")'
        status, data = mail.search(None, search_query)

        if status != "OK" or not data[0]:
            # Also try without Re: in case Gmail threaded it differently
            search_query = f'(SUBJECT "{preview_subject}" FROM "{ROY_EMAIL}")'
            status, data = mail.search(None, search_query)

        if status != "OK" or not data[0]:
            print("   ⚠️  No reply found from Roy")
            mail.logout()
            return None

        # Get the most recent matching email
        message_ids = data[0].split()
        latest_id = message_ids[-1]

        status, msg_data = mail.fetch(latest_id, "(RFC822)")
        if status != "OK":
            print("   ⚠️  Could not fetch reply email")
            mail.logout()
            return None

        msg = email_lib.message_from_bytes(msg_data[0][1])
        mail.logout()

        # Extract the reply body
        body = ""
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    payload = part.get_payload(decode=True)
                    if payload:
                        body = payload.decode("utf-8", errors="replace")
                        break
        else:
            payload = msg.get_payload(decode=True)
            if payload:
                body = payload.decode("utf-8", errors="replace")

        if not body:
            print("   ⚠️  Reply email had no readable body")
            return None

        print(f"   📩 Found reply from Roy")

        # Extract numbers 1-20 from the body
        numbers = [int(n) for n in re.findall(r"\b(\d{1,2})\b", body) if 1 <= int(n) <= 20]
        # Deduplicate while preserving order
        seen = set()
        unique_numbers = []
        for n in numbers:
            if n not in seen:
                seen.add(n)
                unique_numbers.append(n)

        # Take up to 5
        selections = unique_numbers[:5]

        if not selections:
            print("   ⚠️  No valid numbers (1-20) found in reply")
            return None

        print(f"   ✅ Roy's picks: {selections}")
        return selections

    except Exception as e:
        print(f"   ❌ IMAP error: {e}")
        return None


# ============================================================
# STEP 5: SAVE LOCAL PREVIEW (always runs)
# ============================================================

def save_preview(stories):
    """Save an HTML preview file so you can see the email before sending."""
    html = build_email_html(stories)
    filename = f"surescore_digest_{datetime.now().strftime('%Y-%m-%d')}.html"
    filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)
    with open(filepath, "w") as f:
        f.write(html)
    print(f"💾 Preview saved: {filepath}")
    print(f"   Open in browser to review before sending.\n")
    return filepath


# ============================================================
# MODE HANDLERS
# ============================================================

def _get_next_monday():
    """Get the date string for the next Monday (or today if Monday)."""
    today = datetime.now()
    days_ahead = (7 - today.weekday()) % 7  # Monday = 0
    if days_ahead == 0 and today.weekday() != 0:
        days_ahead = 7
    if today.weekday() == 0:
        days_ahead = 0
    monday = today + timedelta(days=days_ahead)
    return monday.strftime("Mon %b %d")


def run_preview(conn):
    """Friday mode: fetch 20 candidates, save to DB, email Roy the numbered list."""
    print("\n📋 PREVIEW MODE — Fetching candidates for curation\n")

    stories = fetch_news()
    if not stories:
        print("⚠️  No relevant stories found. Try adjusting keywords or adding more RSS feeds.\n")
        return

    # Cross-digest dedup: remove stories sent in the last 14 days
    stories = filter_already_sent(conn, stories)

    if not stories:
        print("⚠️  All stories were already sent recently.\n")
        return

    # Save to candidate_stories table
    batch_date = save_candidates(conn, stories)
    monday_str = _get_next_monday()

    # Mirror to PostgreSQL for admin UI
    monday_date = datetime.now()
    days_ahead = (7 - monday_date.weekday()) % 7
    if days_ahead == 0 and monday_date.weekday() != 0:
        days_ahead = 7
    if monday_date.weekday() == 0:
        days_ahead = 0
    monday_date = monday_date + timedelta(days=days_ahead)
    pg_digest_id = pg_create_digest(monday_date)
    if pg_digest_id:
        pg_save_candidates(pg_digest_id, stories)

    print(f"\n📦 Saved {len(stories)} candidates (batch: {batch_date})\n")

    # Print numbered list to terminal
    import textwrap
    print("=" * 70)
    print(f"  CANDIDATE STORIES FOR {monday_str.upper()}")
    print("=" * 70)
    for i, story in enumerate(stories):
        tx = " [TX]" if story.get("texas") else ""
        print(f"\n  {i+1:2d}. {story['title']}{tx}")
        print(f"      {story['category']} | {story['source']} | {story['published']}")
        # Show a clean summary, word-wrapped for readability
        summary_text = story['summary'][:250]
        if summary_text == story['title']:
            summary_text = "(No summary available — headline only)"
        wrapped = textwrap.fill(summary_text, width=64, initial_indent="      ", subsequent_indent="      ")
        print(wrapped)
        if story.get("link"):
            print(f"      {story['link']}")
        print(f"      {'─' * 58}")
    print("\n" + "=" * 70)

    # Send preview email to Roy
    _, candidates = load_latest_candidates(conn)
    if candidates and AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
        send_preview_email(candidates, monday_str)
    else:
        print("📧 Email not configured — preview printed above only.\n")

    print(f"\n✅ Done! Roy can reply with picks, or run: --select 1,3,7,12,15\n")


def run_select(conn, selection_str, auto_send=False):
    """Manual selection mode: pick candidates by number, generate takes, send."""
    print(f"\n🎯 SELECT MODE — Generating digest from picks: {selection_str}\n")

    # Parse selection numbers
    positions = [int(n.strip()) for n in selection_str.split(",") if n.strip().isdigit()]
    positions = [p for p in positions if 1 <= p <= 20][:6]

    if not positions:
        print("❌ No valid positions provided. Use --select 1,3,7,12,15")
        return

    # Load latest candidates
    batch_date, candidates = load_latest_candidates(conn)
    if not candidates:
        print("❌ No candidate batch found. Run --preview first.")
        return

    print(f"   Using batch from {batch_date}")

    # Get selected stories
    selected = []
    for c in candidates:
        if c["position"] in positions:
            selected.append({
                "title": c["title"],
                "summary": c["summary"],
                "link": c["link"],
                "source": c["source"],
                "category": c["category"],
                "published": c["published"],
                "texas": bool(c["is_texas"]),
            })

    if not selected:
        print(f"❌ None of the positions {positions} matched candidates.")
        return

    print(f"   Selected {len(selected)} stories: {positions}\n")

    # Mark as selected in DB
    mark_candidates_selected(conn, batch_date, positions)

    # Generate takes
    selected = generate_takes(selected)
    if not selected:
        print("⚠️  No stories survived take generation.\n")
        return

    # Generate satirical opener (goes first!)
    satire = generate_satire(conn)
    if satire:
        selected.insert(0, satire)

    # Save preview
    preview_path = save_preview(selected)

    # Send (auto-send if --send flag, otherwise prompt)
    if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
        print("📧 Email not configured — preview saved above.")
        return

    # Always save to DB first
    digest_id = save_digest_to_db(conn, selected, RECIPIENTS)
    print(f"📦 Saved to database as digest #{digest_id}")

    if auto_send:
        send_email(selected, digest_id=str(digest_id))
    else:
        print(f"\n✅ Digest #{digest_id} is ready. To send it:\n")
        print(f"   python3 surescore_digest.py --send-digest {digest_id}\n")
        print("Or send now:")
        for r in RECIPIENTS:
            print(f"   → {r}")
        response = input("\nSend emails now? (y/n): ").strip().lower()
        if response == "y":
            send_email(selected, digest_id=str(digest_id))
        else:
            print("Skipped sending. You can review the preview file.\n")


def run_check_reply(conn):
    """Monday mode: check IMAP for Roy's reply, generate takes for picks, send."""
    print("\n📬 CHECK-REPLY MODE — Looking for Roy's selections\n")

    monday_str = datetime.now().strftime("Mon %b %d")
    selections = check_reply_via_imap(monday_str)

    if not selections:
        print("⚠️  No reply found. Skipping today's send.")
        print("   Roy can still use: --select 1,3,7,12,15\n")
        return

    # Run select with the parsed picks
    selection_str = ",".join(str(s) for s in selections)
    run_select(conn, selection_str)


def run_auto(conn):
    """Legacy auto mode: fully automated fetch + generate + send."""
    print("\n🤖 AUTO MODE — Fully automated digest\n")

    stories = fetch_news()
    if not stories:
        print("⚠️  No relevant stories found today.\n")
        return

    # Cross-digest dedup
    stories = filter_already_sent(conn, stories)

    # Generate takes
    stories = generate_takes(stories)
    stories = stories[:PUBLISH_COUNT]

    if not stories:
        print("⚠️  No stories survived take generation.\n")
        return

    # Generate satirical closer
    satire = generate_satire(conn)
    if satire:
        stories.append(satire)

    # Save preview
    save_preview(stories)

    # Send
    if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
        print("📧 Email not configured yet — preview saved above.\n")
        return

    digest_id = save_digest_to_db(conn, stories, RECIPIENTS)
    send_email(stories, digest_id=str(digest_id))
    print(f"📦 Saved to database as digest #{digest_id}")


def _run_send_all(conn, batch_limit=0):
    """Send the latest digest to all subscribed contacts, skipping already-sent.

    Safety checks:
    - Refuses to send a digest older than 7 days (prevents stale resends).
    - Prints story titles before sending so operators can verify content.
    """
    import subprocess, json

    # 1. Find latest digest with age check
    cur = conn.cursor()
    cur.execute('SELECT id, "sentAt" FROM "DigestHistory" ORDER BY "sentAt" DESC LIMIT 1')
    row = cur.fetchone()
    if not row:
        print("❌ No digest found in database. Run --select first.")
        return

    digest_id = row[0]
    digest_date = row[1]

    # SAFETY: refuse to send a digest older than 7 days
    if digest_date and isinstance(digest_date, datetime):
        age_days = (datetime.now() - digest_date).days
        if age_days > 7:
            print(f"❌ BLOCKED: Latest digest is {age_days} days old (created {digest_date.strftime('%Y-%m-%d')}).")
            print(f"   This is a safety check to prevent sending stale content.")
            print(f"   Run --select to create a new digest first.")
            return

    print(f"📰 SEND ALL — Digest #{digest_id}\n")

    stories = load_digest_from_db(conn, digest_id)
    if not stories:
        print(f"❌ Could not load digest #{digest_id}.")
        return

    # SAFETY: print story titles so the operator can verify correct content
    print("   📋 Stories in this digest:")
    for i, s in enumerate(stories):
        print(f"      {i+1}. {s['title'][:75]}")
    print()

    # 2. Find the latest PG digest for lifecycle tracking
    pg_digest_id, pg_status = _find_latest_pg_digest()
    if pg_digest_id:
        print(f"   📦 PG Digest: {pg_digest_id} (status: {pg_status})")

    # 3. Get already-sent emails for this digest
    already_sent = set()
    cur2 = conn.cursor()
    cur2.execute('SELECT email FROM "DigestSendLog" WHERE "digestId" = %s', (digest_id,))
    for r in cur2.fetchall():
        already_sent.add(r[0])

    if already_sent:
        print(f"   ⏭️  {len(already_sent)} already sent — will skip these")

    # 4. Export subscribed contacts from PostgreSQL
    print("   📋 Loading contacts from PostgreSQL...")
    surescore_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "surescore-new")
    npx_path = "/opt/homebrew/bin/npx"
    script_path = os.path.join(surescore_dir, "scripts", "fetch_subscribers.ts")
    result = subprocess.run(
        [npx_path, "tsx", script_path],
        capture_output=True, text=True, timeout=30,
        cwd=surescore_dir
    )

    if result.returncode != 0:
        print(f"❌ Failed to load contacts: {result.stderr[:200]}")
        return

    all_contacts = [e.strip() for e in result.stdout.strip().split("\n") if e.strip() and "@" in e]
    unsent = [e for e in all_contacts if e not in already_sent]

    if not unsent:
        print(f"   ✅ All {len(all_contacts)} contacts have received digest #{digest_id}!")
        if pg_digest_id:
            pg_update_digest_status(pg_digest_id, "SENT_COMPLETE")
        return

    # Apply batch limit
    if batch_limit > 0 and len(unsent) > batch_limit:
        print(f"   🔒 Batch limit: sending to {batch_limit} of {len(unsent)} remaining")
        unsent = unsent[:batch_limit]

    # Determine batch number
    batch_num = 1 if not already_sent else 2

    print(f"   📬 {len(unsent)} contacts to send (batch {batch_num}, out of {len(all_contacts)} total)")
    print(f"   Loaded {len(stories)} stories (no API calls needed)\n")

    # Update PG status
    if pg_digest_id:
        if batch_num == 1:
            pg_update_digest_status(pg_digest_id, "SENDING_BATCH_1")
        else:
            pg_update_digest_status(pg_digest_id, "SENDING_BATCH_2")

    send_email(stories, recipients=unsent, digest_id=str(digest_id), conn=conn,
               pg_digest_id=pg_digest_id, batch_num=batch_num)

    # Update PG status after send
    if pg_digest_id:
        if batch_num == 1:
            pg_update_digest_status(pg_digest_id, "SENT_BATCH_1")
        else:
            pg_update_digest_status(pg_digest_id, "SENT_COMPLETE")


def run_generate(conn, pg_digest_id):
    """Generate takes + satire + HTML for a PG digest's selected candidates."""
    print(f"\n🔨 GENERATE MODE — Building digest for PG Digest {pg_digest_id}\n")

    stories = pg_load_selected_candidates(pg_digest_id)
    if not stories:
        print("❌ No selected candidates found. Select 5 in the admin UI first.")
        return

    print(f"   Loaded {len(stories)} selected stories\n")

    # Generate takes
    stories = generate_takes(stories)
    if not stories:
        print("⚠️  No stories survived take generation.\n")
        return

    # Generate satirical closer
    satire = generate_satire(conn)
    if satire:
        stories.append(satire)

    # Build HTML (generic, no per-recipient tracking — those are added at send time)
    html = build_email_html(stories)
    subject = generate_subject_line(stories)

    # Save to PG
    pg_update_digest_html(pg_digest_id, html, subject)

    # Also update the candidate takes (+ new fields) in PG
    pg = _get_pg_conn()
    if pg:
        try:
            cur = pg.cursor()
            for story in stories:
                if story.get("satire"):
                    continue
                # Try writing all new fields; fall back to take-only if columns don't exist yet
                try:
                    highlights_json = json.dumps(story.get("highlights", [])) if story.get("highlights") else None
                    cur.execute("""
                        UPDATE "DigestCandidate"
                        SET take = %s, synopsis = %s, highlights = %s, relevance = %s
                        WHERE "digestId" = %s AND title = %s
                    """, (
                        story.get("take", ""),
                        story.get("synopsis", ""),
                        highlights_json,
                        story.get("relevance", ""),
                        pg_digest_id, story["title"],
                    ))
                except Exception:
                    # Columns not yet in Prisma schema — fall back to take only
                    pg.rollback()
                    cur.execute("""
                        UPDATE "DigestCandidate"
                        SET take = %s
                        WHERE "digestId" = %s AND title = %s
                    """, (story.get("take", ""), pg_digest_id, story["title"]))
            pg.commit()
            cur.close()
            pg.close()
        except Exception as e:
            print(f"⚠️  PG update candidate takes failed: {e}")

    # Save local preview too
    save_preview(stories)

    # Save to DigestHistory for consistency
    digest_id = save_digest_to_db(conn, stories, RECIPIENTS)
    print(f"📦 Digest {digest_id} saved")
    print(f"✅ PG Digest {pg_digest_id} is APPROVED and ready to send!\n")


# ============================================================
# MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="SureScore Intel — Weekly Curated Digest")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--preview", action="store_true",
                       help="Friday mode: fetch 20 candidates, email Roy a numbered list")
    group.add_argument("--check-reply", action="store_true",
                       help="Monday mode: parse Roy's IMAP reply, generate takes, send")
    group.add_argument("--select", type=str, metavar="1,3,7,12,15",
                       help="Manual: pick by number from latest candidate batch")
    group.add_argument("--auto", action="store_true",
                       help="Legacy: fully automated fetch + generate + send")
    group.add_argument("--send-digest", type=int, metavar="ID",
                       help="Send an already-saved digest by ID (no API calls)")
    group.add_argument("--send-review", type=int, metavar="ID",
                       help="Send a saved digest to Roy + Elizabeth only for approval")
    group.add_argument("--send-all", action="store_true",
                       help="Send latest digest to all subscribed contacts (resumes across days)")
    group.add_argument("--generate", type=str, metavar="DIGEST_ID",
                       help="Generate Claude takes + HTML for selected candidates in a PG digest")
    parser.add_argument("--batch-limit", type=int, metavar="N", default=0,
                        help="Cap the number of recipients per send run (0 = unlimited)")
    parser.add_argument("--send", action="store_true",
                        help="Auto-send without prompting (use with --select)")
    parser.add_argument("--recipients", type=str, metavar="FILE",
                        help="Send to emails listed in FILE (one per line), use with --send-digest")
    args = parser.parse_args()

    print("\n" + "=" * 50)
    print("  SURESCORE INTEL — WEEKLY DIGEST GENERATOR")
    print("=" * 50 + "\n")

    # Validate configuration
    if ANTHROPIC_API_KEY == "your-api-key-here":
        print("❌ ERROR: Set your ANTHROPIC_API_KEY environment variable.")
        print("   See the Setup Guide for instructions.\n")
        return

    # Initialize database
    conn = init_db()
    seed_satire(conn)
    print(f"📦 Database: PostgreSQL (Railway)\n")

    # Route to the appropriate mode
    if args.preview:
        run_preview(conn)
    elif args.check_reply:
        run_check_reply(conn)
    elif args.select:
        run_select(conn, args.select, auto_send=args.send)
    elif args.auto:
        run_auto(conn)
    elif args.send_digest:
        digest_id = args.send_digest
        print(f"📨 SEND MODE — Sending saved digest #{digest_id}\n")
        stories = load_digest_from_db(conn, digest_id)
        if not stories:
            print(f"❌ Digest #{digest_id} not found in database.")
        elif not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
            print("📧 Email not configured — set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.\n")
        else:
            # Load recipients from file or fall back to default list
            recipient_list = None
            if args.recipients:
                with open(args.recipients) as f:
                    recipient_list = [line.strip() for line in f if line.strip()]
                print(f"   📋 Loaded {len(recipient_list)} recipients from {args.recipients}")
            print(f"   Loaded {len(stories)} stories (no API calls needed)")
            send_email(stories, recipients=recipient_list, digest_id=str(digest_id), conn=conn)
    elif args.send_review:
        digest_id = args.send_review
        print(f"📨 REVIEW MODE — Sending digest #{digest_id} to Roy + Elizabeth only\n")
        stories = load_digest_from_db(conn, digest_id)
        if not stories:
            print(f"❌ Digest #{digest_id} not found in database.")
        elif not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
            print("📧 Email not configured — set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.\n")
        else:
            review_recipients = ["roy@surescore.com", "elizabeth@surescore.com"]
            print(f"   Sending to: {', '.join(review_recipients)}")
            print(f"   Loaded {len(stories)} stories (no API calls needed)")
            send_email(stories, recipients=review_recipients, digest_id=str(digest_id), conn=conn)
            print(f"\n✅ Review copy sent! Once approved, run: --send-all")
    elif args.send_all:
        _run_send_all(conn, batch_limit=args.batch_limit)
    elif args.generate:
        run_generate(conn, args.generate)
    else:
        # Default: show help and suggest preview mode
        print("No mode specified. Available modes:\n")
        print("  --preview          Friday: fetch 20 candidates, email Roy")
        print("  --check-reply      Monday: parse Roy's reply, generate + send")
        print("  --select N,N,N     Manual: pick by number, generate takes, save")
        print("  --send-digest ID   Send a saved digest (no API calls)")
        print("  --send-all         Send latest digest to all contacts (resumes across days)")
        print("  --auto             Legacy: fully automated\n")
        print("Try: python surescore_digest.py --preview\n")

    conn.close()


if __name__ == "__main__":
    main()
