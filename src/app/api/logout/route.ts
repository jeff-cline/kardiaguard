import { NextResponse } from "next/server";
import { endSession } from "@/lib/auth";

export async function POST() {
  await endSession();
  return NextResponse.json({ ok: true });
}
export async function GET() {
  await endSession();
  return NextResponse.redirect(new URL("/", process.env.APP_URL || "https://kardiaguard.com"));
}
