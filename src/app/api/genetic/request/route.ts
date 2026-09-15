import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { honeypotTripped, recaptchaOk, pushLeadToCore } from "@/lib/core";
import { geocodeZip } from "@/lib/geo";
import { routeGeneticLab } from "@/lib/genetic-routing";

// POST /api/genetic/request { testSlug, name?, email, zip?, state?, company? }
// A "request test" — becomes a KPI (leads vs tests ordered) and lands in the CRM.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (honeypotTripped(body)) return NextResponse.json({ ok: true, routed: null });
  if (!(await recaptchaOk(body.recaptchaToken))) return NextResponse.json({ ok: true, routed: null });

  const testSlug = String(body.testSlug || "");
  const test = await db.geneticTest.findUnique({ where: { slug: testSlug } });
  if (!test) return NextResponse.json({ ok: false, error: "Unknown test." }, { status: 400 });

  const session = await getSession();
  let userId: string | null = null;
  let name = String(body.name || "").trim().slice(0, 120);
  let email = String(body.email || "").trim().toLowerCase();
  let zip = String(body.zip || "").trim().slice(0, 5);
  let state = String(body.state || "").trim().toUpperCase().slice(0, 2);

  // Signed-in members: fill from their account.
  if (session) {
    const u = await db.user.findUnique({ where: { id: session.uid } });
    if (u) { userId = u.id; name = name || u.name; email = email || u.email; zip = zip || u.zip; }
  }
  if (!email || email.indexOf("@") < 1) return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  if (!state && zip) { const g = geocodeZip(zip); if (g) state = g.state; }

  // Lead: reuse the member's latest lead, else create one (genetic source).
  let leadId: string | null = null;
  if (userId) {
    const lead = await db.lead.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
    leadId = lead?.id ?? null;
  }
  if (!leadId) {
    const coreLeadId = await pushLeadToCore({ name, email, zip, state, notes: `Genetic test request: ${test.name}` });
    const lead = await db.lead.create({ data: { userId, name, email, zip, source: "genetic", coreLeadId } });
    leadId = lead.id;
  }

  const lab = await routeGeneticLab(testSlug, state);
  await db.geneticRequest.create({
    data: { userId, leadId, testId: test.id, labId: lab?.id ?? null, state, status: "ordered" },
  });

  return NextResponse.json({
    ok: true,
    routed: lab ? { name: lab.name, fulfillment: lab.fulfillment, requestUrl: lab.requestUrl, phone: lab.phone, city: lab.city, state: lab.state } : null,
  });
}
