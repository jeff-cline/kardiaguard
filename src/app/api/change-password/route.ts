import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const current = String(body.current || "");
  const next = String(body.next || "");
  if (next.length < 8) return NextResponse.json({ ok: false, error: "New password must be at least 8 characters." }, { status: 400 });
  const user = await db.user.findUnique({ where: { id: s.uid } });
  if (!user) return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });
  if (!(await verifyPassword(current, user.passwordHash))) return NextResponse.json({ ok: false, error: "Current password is incorrect." }, { status: 401 });
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(next), mustChangePassword: false } });
  return NextResponse.json({ ok: true });
}
