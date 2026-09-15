import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { pushLeadToCore } from "@/lib/core";

// POST /api/upgrade — member asks to start the $99/mo live movement program.
// (Billing via Stripe comes later; for now this flags interest + notifies the CRM.)
export async function POST() {
  const s = await getSession();
  if (!s) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  const user = await db.user.findUnique({ where: { id: s.uid } });
  if (!user) return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });
  await pushLeadToCore({ name: user.name, email: user.email, zip: user.zip, notes: "Kardia Guard — requested $99/mo LIVE movement program (Krystalore)" });
  return NextResponse.json({ ok: true });
}
