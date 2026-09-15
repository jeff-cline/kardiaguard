import "server-only";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./db";

const COOKIE = "kg_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const secret = () => process.env.SESSION_SECRET || "insecure-dev-secret";

export type Role = "god" | "investor" | "client" | "member";
export type Session = { uid: string; role: Role };

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}
export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

function sign(payload: Session): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const mac = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${mac}`;
}

function verify(token: string): Session | null {
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    if (p && typeof p.uid === "string" && typeof p.role === "string") return p as Session;
  } catch {}
  return null;
}

/** Set the session cookie — call from a Route Handler or Server Action. */
export async function startSession(s: Session) {
  const jar = await cookies();
  jar.set(COOKIE, sign(s), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  return raw ? verify(raw) : null;
}

/** Full user record for the current session (or null). */
export async function currentUser() {
  const s = await getSession();
  if (!s) return null;
  return db.user.findUnique({ where: { id: s.uid } });
}

export function roleHome(role: string): string {
  if (role === "god") return "/dashboard";
  if (role === "investor") return "/investor";
  if (role === "client") return "/client";
  return "/portal";
}
