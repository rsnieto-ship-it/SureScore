/**
 * Add TIA client contacts with tags.
 *
 * Usage:
 *   npx tsx scripts/add-tia-clients.ts
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

interface TIAClient {
  email: string;
  firstName: string;
  lastName: string;
  districtName: string;
  title?: string;
  tags: string[];
}

const TIA_CLIENTS: TIAClient[] = [
  // United ISD — Core contacts
  { email: "sandra.kolarov@uisd.net", firstName: "Sandra", lastName: "Kolarov", districtName: "United ISD", tags: ["tia-client"] },
  { email: "bcaden43@uisd.net", firstName: "Brenda", lastName: "Cadena", districtName: "United ISD", tags: ["tia-client"] },
  { email: "vania.magallanes@uisd.net", firstName: "Vania", lastName: "Magallanes", districtName: "United ISD", tags: ["tia-client"] },

  // Duncanville ISD — Core contacts
  { email: "lnewton@duncanvilleisd.org", firstName: "Lucretia", lastName: "Newton", districtName: "Duncanville ISD", tags: ["tia-client"] },
  { email: "pbrown@duncanvilleisd.org", firstName: "Pamela", lastName: "Brown", districtName: "Duncanville ISD", tags: ["tia-client"] },
  { email: "snix@duncanvilleisd.org", firstName: "Samuel", lastName: "Nix", districtName: "Duncanville ISD", tags: ["tia-client"] },

  // Royse City ISD
  { email: "lancasterb@rcisd.org", firstName: "Brittany", lastName: "Lancaster", districtName: "Royse City ISD", tags: ["tia-client"] },
  { email: "holtn@rcisd.org", firstName: "Cody", lastName: "Holt", districtName: "Royse City ISD", tags: ["tia-client-tech"] },

  // United ISD — Stakeholders (Principals & Associate Principals)
  { email: "abrahamr@uisd.net", firstName: "Abraham", lastName: "Rodriguez III", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "apalapa@uisd.net", firstName: "Alfredo", lastName: "Palapa", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "apali04@uisd.net", firstName: "Agapito", lastName: "Palizo Jr.", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "apmeza@uisd.net", firstName: "Adamina", lastName: "Meza", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "aracelig@uisd.net", firstName: "Araceli", lastName: "Garza", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "atorres@uisd.net", firstName: "Anna", lastName: "Martinez", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "avela70@uisd.net", firstName: "Adriana", lastName: "Vela", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "azamor73@uisd.net", firstName: "Adriana", lastName: "Zamora", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "carlos.martinez@uisd.net", firstName: "Carlos", lastName: "Martinez", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "carlosv@uisd.net", firstName: "Carlos", lastName: "Valdez", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "cbenavid@uisd.net", firstName: "Claudia", lastName: "Benavides", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "ccaballero@uisd.net", firstName: "Cynthia", lastName: "Caballero", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "claref@uisd.net", firstName: "Clare", lastName: "Flores", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "csierr97@uisd.net", firstName: "Cynthia", lastName: "Sierra", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "descam79@uisd.net", firstName: "Diana", lastName: "Escamilla Flores", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "dguzman@uisd.net", firstName: "David", lastName: "Guzman", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "dkorrodi@uisd.net", firstName: "Diana", lastName: "Korrodi", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "eriksa96@uisd.net", firstName: "Erika", lastName: "Saldaña", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "gflores@uisd.net", firstName: "Griselda", lastName: "Flores Ibarra", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "gilbertoc@uisd.net", firstName: "Gilberto", lastName: "Cardenas", districtName: "United ISD", title: "Associate Principal", tags: ["tia-client-stakeholder"] },
  { email: "gmoren82@uisd.net", firstName: "Gilbert", lastName: "Moreno", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "hectorg@uisd.net", firstName: "Hector", lastName: "Garcia", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "imeldaf@uisd.net", firstName: "Imelda", lastName: "Flores", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "jcsalazar@uisd.net", firstName: "Jessica", lastName: "Salazar", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "jherre03@uisd.net", firstName: "Juan", lastName: "Herrera", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "jmartinez10@uisd.net", firstName: "Jonathan", lastName: "Edward Martinez", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "kgarza@uisd.net", firstName: "Karla", lastName: "Garza", districtName: "United ISD", title: "Associate Principal", tags: ["tia-client-stakeholder"] },
  { email: "lbarra54@uisd.net", firstName: "Liliana", lastName: "Barragan", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "lindadh@uisd.net", firstName: "Linda", lastName: "Mireles", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "luzserna@uisd.net", firstName: "Luz", lastName: "Ramirez", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "malvarez@uisd.net", firstName: "Martha", lastName: "Alvarez", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "marriaga@uisd.net", firstName: "Monica", lastName: "Arriaga", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "matias.ydrogo@uisd.net", firstName: "Matias", lastName: "Ydrogo", districtName: "United ISD", title: "Director", tags: ["tia-client-stakeholder"] },
  { email: "mcgomez@uisd.net", firstName: "Michelle", lastName: "Gomez", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "michellec@uisd.net", firstName: "Michelle", lastName: "Cantu", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "monzep@uisd.net", firstName: "Monica", lastName: "Zepeda", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "mshinn57@uisd.net", firstName: "Melissa", lastName: "Shinn", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "mtlopez@uisd.net", firstName: "Maria", lastName: "Lopez", districtName: "United ISD", title: "Associate Principal", tags: ["tia-client-stakeholder"] },
  { email: "muciaf@uisd.net", firstName: "Mucia", lastName: "Flores", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "ocantu@uisd.net", firstName: "Olga", lastName: "Cantu", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "parred73@uisd.net", firstName: "Pam", lastName: "Arredondo", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "rarizola@uisd.net", firstName: "Rosana", lastName: "Montemayor Arizola", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "rortiz@uisd.net", firstName: "Roberto", lastName: "Ortiz", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "rruiz@uisd.net", firstName: "Rosenda", lastName: "Ruiz", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "salvil94@uisd.net", firstName: "Salud", lastName: "Hernandez", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "sruiz@uisd.net", firstName: "Sylvia", lastName: "Ruiz", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "ssilva3@uisd.net", firstName: "Stephanie", lastName: "Silva Garcia", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "tesrod@uisd.net", firstName: "Tessie", lastName: "Rodriguez", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "vamaro06@uisd.net", firstName: "Veronica", lastName: "Amaro Garza", districtName: "United ISD", title: "Associate Principal", tags: ["tia-client-stakeholder"] },
  { email: "vasaldana@uisd.net", firstName: "Vanessa", lastName: "Saldaña", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "wnunez@uisd.net", firstName: "Wendy", lastName: "Nuñez", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
  { email: "ymauricio@uisd.net", firstName: "Yolanda", lastName: "Mauricio Alvarez", districtName: "United ISD", title: "Principal", tags: ["tia-client-stakeholder"] },
];

async function main() {
  console.log("Adding TIA clients...\n");

  const client = await pool.connect();

  try {
    // 1. Create tags
    const allTagNames = new Set<string>();
    for (const c of TIA_CLIENTS) {
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

    for (const c of TIA_CLIENTS) {
      const id = cuid();
      await client.query(
        `INSERT INTO "Contact" (id, email, "firstName", "lastName", "districtName", title, status, source, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, 'SUBSCRIBED', 'tia-client', now(), now())
         ON CONFLICT (email) DO UPDATE SET
           "firstName" = EXCLUDED."firstName",
           "lastName" = EXCLUDED."lastName",
           "districtName" = EXCLUDED."districtName",
           title = COALESCE(EXCLUDED.title, "Contact".title),
           "updatedAt" = now()`,
        [id, c.email, c.firstName, c.lastName, c.districtName, c.title || null]
      );
      console.log(`  + ${c.firstName} ${c.lastName} (${c.districtName}) ${c.title || ""}`);
    }

    await client.query("COMMIT");

    // 3. Link tags
    await client.query("BEGIN");

    for (const c of TIA_CLIENTS) {
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
    console.log(`\nAll ${TIA_CLIENTS.length} TIA clients added and tagged.`);

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
