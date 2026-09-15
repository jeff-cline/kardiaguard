import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, startSession, roleHome } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
  }
  await startSession({ uid: user.id, role: user.role as never });
  const redirect = user.mustChangePassword ? "/change-password" : roleHome(user.role);
  return NextResponse.json({ ok: true, redirect });
}
