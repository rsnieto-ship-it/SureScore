/**
 * One-time Mailchimp CSV import script.
 *
 * Usage:
 *   npx tsx scripts/import-mailchimp.ts
 *
 * Reads all 3 CSV exports from ../contacts/ and imports into Postgres.
 * Uses raw pg for speed. Safe to re-run — uses email as dedup key.
 */

import "dotenv/config";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { resolve } from "path";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });

const CONTACTS_DIR = resolve(__dirname, "../../contacts");

type Status = "SUBSCRIBED" | "UNSUBSCRIBED" | "CLEANED";

const FILES: { file: string; status: Status }[] = [
  { file: "subscribed_email_audience_export_4263981540.csv", status: "SUBSCRIBED" },
  { file: "unsubscribed_email_audience_export_4263981540.csv", status: "UNSUBSCRIBED" },
  { file: "cleaned_email_audience_export_4263981540.csv", status: "CLEANED" },
];

function parseCSV(filePath: string) {
  const raw = readFileSync(filePath, "utf-8");
  const records: string[][] = parse(raw, {
    columns: false,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });
  return records.slice(1);
}

function cleanPhone(val: string | undefined): string | null {
  if (!val) return null;
  const cleaned = val.replace(/\s+/g, "").trim();
  return cleaned.length >= 7 ? cleaned : null;
}

function cleanStr(val: string | undefined): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  return trimmed || null;
}

function parseTags(raw: string | undefined): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (!trimmed) return [];
  return trimmed
    .split(",")
    .map((t) => t.replace(/^"+|"+$/g, "").trim())
    .filter(Boolean);
}

function cuid(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `c${ts}${rand}`;
}

interface ParsedRow {
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  districtType: string | null;
  districtName: string | null;
  zip: string | null;
  title: string | null;
  leid: string | null;
  tagNames: string[];
  status: Status;
}

function parseRows(rows: string[][], status: Status): ParsedRow[] {
  let leidIdx: number;
  if (status === "SUBSCRIBED") leidIdx = 25;
  else if (status === "UNSUBSCRIBED") leidIdx = 29;
  else leidIdx = 27;

  return rows
    .map((row) => {
      const email = cleanStr(row[0]);
      if (!email) return null;
      return {
        email: email.toLowerCase(),
        firstName: cleanStr(row[1]),
        lastName: cleanStr(row[2]),
        phone: cleanPhone(row[4]),
        districtType: cleanStr(row[6]),
        districtName: cleanStr(row[7]),
        zip: cleanStr(row[8]),
        title: cleanStr(row[13]),
        leid: cleanStr(row[leidIdx]),
        tagNames: parseTags(row[row.length - 1]),
        status,
      };
    })
    .filter((r): r is ParsedRow => r !== null);
}

async function main() {
  console.log("Starting Mailchimp import...\n");

  // Parse all files
  const allRows: ParsedRow[] = [];
  const allTagNames = new Set<string>();

  for (const { file, status } of FILES) {
    const filePath = resolve(CONTACTS_DIR, file);
    console.log(`Parsing ${file}...`);
    const rawRows = parseCSV(filePath);
    const parsed = parseRows(rawRows, status);
    allRows.push(...parsed);
    for (const row of parsed) {
      for (const t of row.tagNames) allTagNames.add(t);
    }
    console.log(`  ${parsed.length} rows (status: ${status})`);
  }

  console.log(`\nTotal rows: ${allRows.length}`);
  console.log(`Unique tags: ${allTagNames.size}`);

  const client = await pool.connect();

  try {
    // 1. Create tags
    console.log("\nCreating tags...");
    const tagMap = new Map<string, string>();
    for (const name of allTagNames) {
      const id = cuid();
      await client.query(
        `INSERT INTO "Tag" (id, name) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`,
        [id, name]
      );
      const res = await client.query(`SELECT id FROM "Tag" WHERE name = $1`, [name]);
      tagMap.set(name, res.rows[0].id);
    }
    console.log(`  ${tagMap.size} tags ready`);

    // 2. Insert contacts in batched transactions
    console.log(`\nImporting contacts...`);
    const BATCH = 100;
    let imported = 0;

    for (let i = 0; i < allRows.length; i += BATCH) {
      const batch = allRows.slice(i, i + BATCH);
      await client.query("BEGIN");

      for (const row of batch) {
        const id = cuid();
        await client.query(
          `INSERT INTO "Contact" (id, email, "firstName", "lastName", phone, "districtName", "districtType", title, zip, status, source, "mailchimpLeid", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now(), now())
           ON CONFLICT (email) DO UPDATE SET
             "firstName" = EXCLUDED."firstName",
             "lastName" = EXCLUDED."lastName",
             phone = EXCLUDED.phone,
             "districtName" = EXCLUDED."districtName",
             "districtType" = EXCLUDED."districtType",
             title = EXCLUDED.title,
             zip = EXCLUDED.zip,
             status = EXCLUDED.status,
             "mailchimpLeid" = EXCLUDED."mailchimpLeid",
             "updatedAt" = now()`,
          [id, row.email, row.firstName, row.lastName, row.phone,
           row.districtName, row.districtType, row.title, row.zip,
           row.status, "import", row.leid]
        );
      }

      await client.query("COMMIT");
      imported += batch.length;
      process.stdout.write(`  ${imported}/${allRows.length}\r`);
    }
    console.log(`\n  ${imported} contacts imported`);

    // 3. Link tags
    console.log("\nLinking tags...");
    const rowsWithTags = allRows.filter((r) => r.tagNames.length > 0);
    let linked = 0;

    await client.query("BEGIN");
    for (const row of rowsWithTags) {
      const contactRes = await client.query(
        `SELECT id FROM "Contact" WHERE email = $1`,
        [row.email]
      );
      if (contactRes.rows.length === 0) continue;
      const contactId = contactRes.rows[0].id;

      for (const tagName of row.tagNames) {
        const tagId = tagMap.get(tagName);
        if (!tagId) continue;
        await client.query(
          `INSERT INTO "ContactTag" ("contactId", "tagId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [contactId, tagId]
        );
      }

      linked++;
      if (linked % 200 === 0) {
        await client.query("COMMIT");
        await client.query("BEGIN");
        process.stdout.write(`  ${linked}/${rowsWithTags.length}\r`);
      }
    }
    await client.query("COMMIT");
    console.log(`\n  ${linked} contacts tagged`);

  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }

  // Summary
  const res = await pool.query(`
    SELECT
      count(*) as total,
      count(*) FILTER (WHERE status = 'SUBSCRIBED') as subscribed,
      count(*) FILTER (WHERE status = 'UNSUBSCRIBED') as unsubscribed,
      count(*) FILTER (WHERE status = 'CLEANED') as cleaned
    FROM "Contact"
  `);
  const s = res.rows[0];
  const tagCount = await pool.query(`SELECT count(*) FROM "Tag"`);

  console.log("\n=== Import Summary ===");
  console.log(`Total contacts: ${s.total}`);
  console.log(`  SUBSCRIBED:   ${s.subscribed}`);
  console.log(`  UNSUBSCRIBED: ${s.unsubscribed}`);
  console.log(`  CLEANED:      ${s.cleaned}`);
  console.log(`Tags: ${tagCount.rows[0].count}`);

  await pool.end();
}

main().catch((err) => {
  console.error("Import failed:", err);
  pool.end();
  process.exit(1);
});
