import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// POST /api/reminders { on: boolean } — toggle the member's reminder opt-in.
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  await db.user.update({ where: { id: s.uid }, data: { remindersOn: Boolean(body.on) } });
  return NextResponse.json({ ok: true, on: Boolean(body.on) });
}
