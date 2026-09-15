import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// POST /api/screening-log { testSlug, doneOn }  — member records a test they've had.
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const testSlug = String(body.testSlug || "").slice(0, 80);
  const dt = new Date(String(body.doneOn || ""));
  if (!testSlug || isNaN(dt.getTime())) return NextResponse.json({ ok: false, error: "Invalid input." }, { status: 400 });
  await db.screeningLog.upsert({
    where: { userId_testSlug: { userId: s.uid, testSlug } },
    update: { doneOn: dt },
    create: { userId: s.uid, testSlug, doneOn: dt },
  });
  return NextResponse.json({ ok: true });
}
