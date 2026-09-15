import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendCoreEmail } from "@/lib/core";
import { planFor, ageFromBirthYear, dueStatus, type Sex } from "@/lib/reminders";

export const dynamic = "force-dynamic";

const RESEND_AFTER_DAYS = 25; // never remind the same due test more often than this
const SITE = "https://kardiaguard.com";

function digestHtml(firstName: string, due: { name: string; label: string }[]) {
  const rows = due
    .map((d) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee"><b>${d.name}</b> — <span style="color:#6D28D9">${d.label}</span></td></tr>`)
    .join("");
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1c1330;max-width:560px">
    <p>Hi ${firstName || "there"},</p>
    <p>Knowledge is power — and a quick reminder from <b>Kardia Guard</b>: based on national guidelines for your age and sex, these heart screenings look due:</p>
    <table style="width:100%;border-collapse:collapse;margin:8px 0 16px">${rows}</table>
    <p><a href="${SITE}/find" style="background:#6D28D9;color:#fff;font-weight:bold;padding:12px 20px;border-radius:10px;text-decoration:none;display:inline-block">Find a location near you →</a></p>
    <p style="font-size:13px;color:#6b6486;margin-top:18px">These are educational reminders based on USPSTF / AHA / Medicare guidance — not medical advice. Your provider decides what's right for you, and screenings are subject to insurance or Medicare approval; some need a provider's order. Manage or turn off reminders anytime in <a href="${SITE}/portal" style="color:#6D28D9">your portal</a>.</p>
    <p style="font-size:13px;color:#6b6486">— Kardia Guard · Knowledge is Power</p>
  </div>`;
}

async function run(req: Request) {
  const url = new URL(req.url);
  const secret = req.headers.get("x-cron-secret") || url.searchParams.get("secret") || "";
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const dry = url.searchParams.get("dry") === "1";
  const now = new Date();
  const cutoff = new Date(now.getTime() - RESEND_AFTER_DAYS * 86400000);

  const members = await db.user.findMany({
    where: { role: "member", remindersOn: true },
    include: { screeningLogs: true },
  });

  let scanned = 0, emailed = 0, wouldEmail = 0, testsQueued = 0;
  const sample: { email: string; due: string[] }[] = [];

  for (const m of members) {
    scanned++;
    const age = ageFromBirthYear(m.birthYear);
    const sex = (m.sex as Sex) || "";
    const logMap = new Map(m.screeningLogs.map((l) => [l.testSlug, l.doneOn]));

    // Only recurring (cadence) screenings that are due now.
    const due: { slug: string; name: string; label: string }[] = [];
    for (const rule of planFor(sex, age)) {
      if (rule.cadenceMonths(age) === null) continue; // skip one-time / discuss-once
      const st = dueStatus(rule, age, logMap.get(rule.slug) ?? null, now);
      if (st.tone !== "due") continue;
      due.push({ slug: rule.slug, name: rule.name, label: st.label });
    }
    if (!due.length) continue;

    // Dedupe: drop tests reminded within RESEND_AFTER_DAYS.
    const recent = await db.reminderSent.findMany({ where: { userId: m.id, testSlug: { in: due.map((d) => d.slug) }, sentOn: { gt: cutoff } } });
    const recentSlugs = new Set(recent.map((r) => r.testSlug));
    const fresh = due.filter((d) => !recentSlugs.has(d.slug));
    if (!fresh.length) continue;

    testsQueued += fresh.length;
    if (sample.length < 5) sample.push({ email: m.email, due: fresh.map((d) => d.name) });

    if (dry) { wouldEmail++; continue; }

    const sent = await sendCoreEmail({ to: m.email, subject: "Your heart screening reminder · Kardia Guard", html: digestHtml(m.name.split(" ")[0], fresh) });
    if (sent) {
      emailed++;
      for (const d of fresh) {
        await db.reminderSent.upsert({ where: { userId_testSlug: { userId: m.id, testSlug: d.slug } }, update: { sentOn: now }, create: { userId: m.id, testSlug: d.slug, sentOn: now } });
      }
    } else {
      wouldEmail++; // no Core key (or send failed) → not recorded, will retry when email is configured
    }
  }

  return NextResponse.json({ ok: true, dry, scanned, emailed, wouldEmail, testsQueued, emailConfigured: Boolean(process.env.CORE_PK && process.env.CORE_SK), sample });
}

export async function POST(req: Request) { return run(req); }
export async function GET(req: Request) { return run(req); }
