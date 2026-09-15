import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// POST /api/booking { locationId, testSlug? }
// A member clicking a location's "Book" link becomes a booked appointment
// (the lead → booking conversion). Returns the location's bookingUrl to open.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const locationId = String(body.locationId || "");
  const testSlug = String(body.testSlug || "");
  const loc = await db.location.findUnique({ where: { id: locationId } });
  if (!loc) return NextResponse.json({ ok: false, error: "Location not found." }, { status: 404 });

  const s = await getSession();
  let userId: string | null = null;
  let leadId: string | null = null;
  if (s) {
    userId = s.uid;
    const lead = await db.lead.findFirst({ where: { userId: s.uid }, orderBy: { createdAt: "desc" } });
    leadId = lead?.id ?? null;
  }
  const test = testSlug ? await db.test.findUnique({ where: { slug: testSlug } }) : null;

  await db.booking.create({
    data: { locationId, userId, leadId, testId: test?.id ?? null, status: "booked" },
  });

  return NextResponse.json({ ok: true, bookingUrl: loc.bookingUrl || "" });
}
