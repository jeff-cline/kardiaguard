import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const db = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));

// DB fields for the catalog (rich content lives in src/lib/tests.ts for the pages).
const TESTS = [
  ["coronary-artery-calcium-cac-ct", "Coronary Artery Calcium (CAC) CT", "Calcified coronary plaque / future CAD risk", "Yes", 5, 1],
  ["lipid-panel", "Lipid panel (cholesterol)", "Total cholesterol, LDL, HDL, triglycerides", "Yes — blood draw", 5, 2],
  ["blood-pressure-screening", "Blood pressure screening", "Hypertension", "Yes", 5, 3],
  ["a1c-glucose", "A1C / glucose", "Diabetes-related cardiovascular risk", "Yes — blood draw", 5, 4],
  ["hs-crp", "hs-CRP", "Inflammation associated with cardiovascular risk", "Yes — blood draw", 4, 5],
  ["lipoprotein-a-lp-a", "Lipoprotein(a) / Lp(a)", "Inherited cardiovascular risk", "Yes — blood draw", 4, 6],
  ["apolipoprotein-b-apob", "Apolipoprotein B / ApoB", "Atherogenic particle burden", "Yes — blood draw", 4, 7],
  ["ankle-brachial-index-abi", "Ankle-Brachial Index (ABI)", "Peripheral artery disease", "Yes", 4, 8],
  ["abdominal-aortic-aneurysm-ultrasound", "Abdominal Aortic Aneurysm (AAA) ultrasound", "Abdominal aortic aneurysm", "Yes", 4, 9],
  ["carotid-ultrasound", "Carotid ultrasound", "Carotid plaque/stenosis", "Yes", 3, 10],
  ["resting-ecg-ekg", "Resting ECG / EKG", "Rhythm/electrical abnormalities", "Yes", 3, 11],
  ["echocardiogram", "Echocardiogram", "Heart structure, valves, pumping function", "Yes", 3, 12],
  ["exercise-stress-test", "Exercise stress test", "Ischemia/rhythm abnormalities under exertion", "Yes", 2, 13],
  ["ct-coronary-angiography-ccta", "CT coronary angiography (CCTA)", "Coronary artery narrowing / soft plaque", "Yes — with contrast", 3, 14],
];

async function main() {
  // 1) Tests
  for (const [slug, name, detects, noninvasive, screeningFit, sortOrder] of TESTS) {
    await db.test.upsert({
      where: { slug },
      update: { name, detects, noninvasive, screeningFit, sortOrder },
      create: { slug, name, detects, noninvasive, screeningFit, sortOrder },
    });
  }
  console.log(`Seeded ${TESTS.length} tests`);

  // 2) God account
  const godEmail = "jeff.cline@me.com";
  const passwordHash = await bcrypt.hash("TEMP!234", 10);
  const existing = await db.user.findUnique({ where: { email: godEmail } });
  if (!existing) {
    await db.user.create({ data: { email: godEmail, name: "Jeff Cline", role: "god", passwordHash, mustChangePassword: true } });
    console.log("Created God account jeff.cline@me.com (TEMP!234, force reset)");
  } else {
    console.log("God account already exists — left unchanged");
  }

  // 3) Mammo Express seed locations (the feeder for first testing)
  const seedFile = join(__dirname, "seed-locations.json");
  if (existsSync(seedFile)) {
    const locs = JSON.parse(readFileSync(seedFile, "utf8"));
    const testMap = Object.fromEntries((await db.test.findMany({ select: { id: true, slug: true } })).map((t) => [t.slug, t.id]));
    let n = 0;
    for (const l of locs) {
      const already = await db.location.findFirst({ where: { name: l.name, zip: l.zip || "" } });
      if (already) continue;
      const testIds = (l.tests || []).map((s) => testMap[s]).filter(Boolean);
      await db.location.create({
        data: {
          name: l.name, address: l.address || "", city: l.city || "", state: l.state || "", zip: l.zip || "",
          lat: l.lat ?? null, lng: l.lng ?? null, phone: l.phone || "", bookingUrl: l.bookingUrl || "",
          source: "mammo", tests: { create: testIds.map((id) => ({ testId: id })) },
        },
      });
      n++;
    }
    console.log(`Seeded ${n} Mammo Express locations`);
  } else {
    console.log("No seed-locations.json — skipping location seed (add via God dashboard)");
  }
}

main().then(() => db.$disconnect()).catch(async (e) => { console.error(e); await db.$disconnect(); process.exit(1); });
