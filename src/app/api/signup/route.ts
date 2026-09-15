import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, startSession } from "@/lib/auth";
import { honeypotTripped, recaptchaOk, pushLeadToCore } from "@/lib/core";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // Honeypot — silently succeed so bots don't learn anything, create nothing.
  if (honeypotTripped(body)) return NextResponse.json({ ok: true, redirect: "/portal" });
  if (!(await recaptchaOk(body.recaptchaToken))) return NextResponse.json({ ok: true, redirect: "/portal" });

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const name = String(body.name || "").trim().slice(0, 120);
  const zip = String(body.zip || "").trim().slice(0, 10);
  const sex = ["male", "female"].includes(body.sex) ? body.sex : "";
  const birthYear = Number(body.birthYear) || null;

  if (!email || email.indexOf("@") < 1) return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ ok: false, error: "Password must be at least 8 characters." }, { status: 400 });

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ ok: false, error: "An account with this email already exists. Try logging in." }, { status: 409 });

  const user = await db.user.create({
    data: { email, name, zip, sex, birthYear: birthYear && birthYear > 1900 && birthYear < 2020 ? birthYear : null, role: "member", passwordHash: await hashPassword(password) },
  });

  // A member sign-up is a lead — record locally and push to the Core CRM.
  const coreLeadId = await pushLeadToCore({ name, email, zip, notes: "Kardia Guard free member signup" });
  await db.lead.create({ data: { userId: user.id, name, email, zip, source: "signup", coreLeadId } });

  await startSession({ uid: user.id, role: "member" });
  return NextResponse.json({ ok: true, redirect: "/portal" });
}
