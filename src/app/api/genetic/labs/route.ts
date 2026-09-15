import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { geocodeZip } from "@/lib/geo";

// POST /api/genetic/labs — create a genetic lab + the tests it offers. (God or lab)
export async function POST(req: Request) {
  const s = await getSession();
  if (!s || (s.role !== "god" && s.role !== "lab")) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });

  const fulfillment = ["mail_nationwide", "mail_by_state", "in_person"].includes(body.fulfillment) ? body.fulfillment : "mail_nationwide";
  const coverageStates = String(body.coverageStates || "").toUpperCase().replace(/[^A-Z, ]/g, "").trim();
  const zip = String(body.zip || "").trim().slice(0, 5);
  const geo = fulfillment === "in_person" ? geocodeZip(zip) : null;
  const testSlugs: string[] = Array.isArray(body.tests) ? body.tests.map(String) : [];
  const tests = testSlugs.length ? await db.geneticTest.findMany({ where: { slug: { in: testSlugs } } }) : [];

  const lab = await db.geneticLab.create({
    data: {
      name,
      fulfillment,
      coverageStates: fulfillment === "mail_by_state" ? coverageStates : "",
      requestUrl: String(body.requestUrl || "").trim(),
      phone: String(body.phone || "").trim(),
      city: String(body.city || geo?.city || "").trim(),
      state: String(body.state || geo?.state || "").trim().toUpperCase().slice(0, 2),
      zip,
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
      ownerId: s.role === "lab" ? s.uid : null,
      tests: { create: tests.map((t) => ({ testId: t.id })) },
    },
  });
  return NextResponse.json({ ok: true, id: lab.id });
}
