/**
 * Add TSIA client contacts with tags.
 *
 * Usage:
 *   npx tsx scripts/add-tsia-clients.ts
 *
 * Safe to re-run — uses email as dedup key, ON CONFLICT DO NOTHING for tags.
 */

import "dotenv/config";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });

function cuid(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `c${ts}${rand}`;
}

interface TSIAClient {
  email: string;
  firstName: string;
  lastName: string;
  districtName: string;
  tags: string[];
}

const TSIA_CLIENTS: TSIAClient[] = [
  // United ISD
  { email: "mrosales@uisd.net", firstName: "Mario", lastName: "Rosales", districtName: "United ISD", tags: ["tsia-client"] },
  { email: "christian.davila@uisd.net", firstName: "Christian", lastName: "Davila", districtName: "United ISD", tags: ["tsia-client"] },
  { email: "dhurtado@uisd.net", firstName: "Diana", lastName: "Hurtado", districtName: "United ISD", tags: ["tsia-client"] },
  { email: "madegu91@uisd.net", firstName: "Maderlin", lastName: "Guerra", districtName: "United ISD", tags: ["tsia-client"] },
  { email: "karpen62@uisd.net", firstName: "Karla", lastName: "Pena Nunez", districtName: "United ISD", tags: ["tsia-client"] },
  { email: "lramo92@uisd.net", firstName: "Linda", lastName: "Ramon", districtName: "United ISD", tags: ["tsia-client"] },
  { email: "cristina.solis@uisd.net", firstName: "Cristina", lastName: "Solis", districtName: "United ISD", tags: ["tsia-client"] },
  { email: "svera@uisd.net", firstName: "Sonia", lastName: "Vera", districtName: "United ISD", tags: ["tsia-client"] },
  { email: "melissa.salinas@uisd.net", firstName: "Melissa", lastName: "Lopez", districtName: "United ISD", tags: ["tsia-client"] },
  { email: "aguti49@uisd.net", firstName: "Adriana", lastName: "Cardenas", districtName: "United ISD", tags: ["tsia-client"] },
  { email: "ddelarosa@uisd.net", firstName: "David", lastName: "De La Rosa", districtName: "United ISD", tags: ["tsia-client"] },
  { email: "jvillalobos@uisd.net", firstName: "Jessica", lastName: "Villalobos", districtName: "United ISD", tags: ["tsia-client"] },
  { email: "bmendo13@uisd.net", firstName: "Briseida", lastName: "Mendoza", districtName: "United ISD", tags: ["tsia-client"] },
  { email: "vbotello@uisd.net", firstName: "Vanessa", lastName: "Guzman", districtName: "United ISD", tags: ["tsia-client"] },
];

async function main() {
  console.log("Adding TSIA clients...\n");

  const client = await pool.connect();

  try {
    // 1. Create tags
    const allTagNames = new Set<string>();
    for (const c of TSIA_CLIENTS) {
      for (const t of c.tags) allTagNames.add(t);
    }

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
    console.log(`Tags ready: ${[...allTagNames].join(", ")}`);

    // 2. Upsert contacts
    await client.query("BEGIN");

    for (const c of TSIA_CLIENTS) {
      const id = cuid();
      await client.query(
        `INSERT INTO "Contact" (id, email, "firstName", "lastName", "districtName", status, source, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, 'SUBSCRIBED', 'tsia-client', now(), now())
         ON CONFLICT (email) DO UPDATE SET
           "firstName" = EXCLUDED."firstName",
           "lastName" = EXCLUDED."lastName",
           "districtName" = EXCLUDED."districtName",
           "updatedAt" = now()`,
        [id, c.email, c.firstName, c.lastName, c.districtName]
      );
      console.log(`  + ${c.firstName} ${c.lastName} (${c.districtName})`);
    }

    await client.query("COMMIT");

    // 3. Link tags
    await client.query("BEGIN");

    for (const c of TSIA_CLIENTS) {
      const contactRes = await client.query(
        `SELECT id FROM "Contact" WHERE email = $1`,
        [c.email]
      );
      if (contactRes.rows.length === 0) continue;
      const contactId = contactRes.rows[0].id;

      for (const tagName of c.tags) {
        const tagId = tagMap.get(tagName);
        if (!tagId) continue;
        await client.query(
          `INSERT INTO "ContactTag" ("contactId", "tagId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [contactId, tagId]
        );
      }
    }

    await client.query("COMMIT");
    console.log(`\nAll ${TSIA_CLIENTS.length} TSIA clients added and tagged.`);

  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }

  await pool.end();
}

main().catch((err) => {
  console.error("Failed:", err);
  pool.end();
  process.exit(1);
});
