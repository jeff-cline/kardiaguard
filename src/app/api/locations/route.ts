import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { geocodeZip } from "@/lib/geo";

// POST /api/locations  (God/client) — create a screening location + its tests.
export async function POST(req: Request) {
  const s = await getSession();
  if (!s || (s.role !== "god" && s.role !== "client")) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  const zip = String(body.zip || "").trim().slice(0, 5);
  const geo = geocodeZip(zip);
  const testSlugs: string[] = Array.isArray(body.tests) ? body.tests.map(String) : [];
  const tests = testSlugs.length ? await db.test.findMany({ where: { slug: { in: testSlugs } } }) : [];

  const loc = await db.location.create({
    data: {
      name,
      address: String(body.address || "").trim(),
      city: String(body.city || geo?.city || "").trim(),
      state: String(body.state || geo?.state || "").trim(),
      zip,
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
      phone: String(body.phone || "").trim(),
      bookingUrl: String(body.bookingUrl || "").trim(),
      source: "manual",
      ownerId: s.role === "client" ? s.uid : null,
      tests: { create: tests.map((t) => ({ testId: t.id })) },
    },
  });
  return NextResponse.json({ ok: true, id: loc.id, geocoded: Boolean(geo) });
}
