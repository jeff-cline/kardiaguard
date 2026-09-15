import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { geocodeZip, milesBetween } from "@/lib/geo";

// GET /api/locations/search?zip=85001&tests=slug1,slug2
// Returns active locations sorted by distance that offer ALL selected tests
// (any test if none selected).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const zip = url.searchParams.get("zip") || "";
  const testSlugs = (url.searchParams.get("tests") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const origin = geocodeZip(zip);

  const wanted = testSlugs.length
    ? await db.test.findMany({ where: { slug: { in: testSlugs } }, select: { id: true, slug: true, name: true } })
    : [];
  const wantedIds = wanted.map((t) => t.id);

  const locations = await db.location.findMany({
    where: { active: true, lat: { not: null }, lng: { not: null } },
    include: { tests: { include: { test: { select: { slug: true, name: true } } } } },
  });

  const rows = locations
    .filter((l) => {
      if (!wantedIds.length) return true;
      const has = new Set(l.tests.map((lt) => lt.testId));
      return wantedIds.every((id) => has.has(id)); // must do ALL selected tests
    })
    .map((l) => ({
      id: l.id,
      name: l.name,
      address: l.address,
      city: l.city,
      state: l.state,
      zip: l.zip,
      phone: l.phone,
      bookingUrl: l.bookingUrl,
      lat: l.lat!,
      lng: l.lng!,
      tests: l.tests.map((lt) => ({ slug: lt.test.slug, name: lt.test.name })),
      miles: origin ? Math.round(milesBetween(origin.lat, origin.lng, l.lat!, l.lng!) * 10) / 10 : null,
    }))
    .sort((a, b) => (a.miles ?? 1e9) - (b.miles ?? 1e9));

  return NextResponse.json({ ok: true, origin, count: rows.length, locations: rows.slice(0, 60) });
}
