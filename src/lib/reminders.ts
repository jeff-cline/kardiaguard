// The Kardia Guard reminders engine.
// A guideline-based matrix (USPSTF / AHA / ACC / Medicare) that turns a member's
// sex + age into a personalized screening cadence. Educational — not a
// prescription. Screenings are subject to insurance/Medicare approval and some
// need a provider's order.

export type Sex = "male" | "female" | "";

export type ScreeningRule = {
  slug: string;         // matches a heart-test slug in lib/tests.ts
  name: string;
  applies: (sex: Sex, age: number | null) => boolean;
  cadenceMonths: (age: number | null) => number | null; // null = one-time / discuss once
  cadenceLabel: (age: number | null) => string;
  rationale: string;
  priority: number;
};

export const SCREENING_RULES: ScreeningRule[] = [
  {
    slug: "blood-pressure-screening",
    name: "Blood pressure",
    applies: (_s, age) => age === null || age >= 18,
    cadenceMonths: (age) => (age === null || age >= 40 ? 12 : 36),
    cadenceLabel: (age) => (age === null || age >= 40 ? "Every year" : "Every 3 years"),
    rationale: "USPSTF: screen annually at 40+ (and if at higher risk); every 3–5 years for lower-risk adults 18–39.",
    priority: 1,
  },
  {
    slug: "lipid-panel",
    name: "Cholesterol (lipid panel)",
    applies: (sex, age) => age === null || age >= 40 || (sex === "male" && age >= 35) || (sex === "female" && age >= 45) || age >= 20,
    cadenceMonths: () => 48,
    cadenceLabel: () => "About every 4–5 years",
    rationale: "USPSTF supports lipid screening for men 35+, women 45+, and adults 20+ with risk factors; re-check periodically.",
    priority: 2,
  },
  {
    slug: "a1c-glucose",
    name: "A1C / blood sugar",
    applies: (_s, age) => age === null || (age >= 35 && age <= 70),
    cadenceMonths: () => 36,
    cadenceLabel: () => "Every 3 years",
    rationale: "USPSTF supports diabetes screening for adults 35–70 who are overweight or obese; repeat ~every 3 years if normal.",
    priority: 3,
  },
  {
    slug: "lipoprotein-a-lp-a",
    name: "Lipoprotein(a) — Lp(a)",
    applies: (_s, age) => age === null || age >= 18,
    cadenceMonths: () => null,
    cadenceLabel: () => "Once in a lifetime",
    rationale: "Increasingly recommended at least once, especially with a family history of early heart disease. Discuss with your provider.",
    priority: 4,
  },
  {
    slug: "coronary-artery-calcium-cac-ct",
    name: "Coronary calcium (CAC) score",
    applies: (_s, age) => age !== null && age >= 40 && age <= 75,
    cadenceMonths: () => null,
    cadenceLabel: () => "Discuss once",
    rationale: "ACC/AHA: consider once for adults ~40–75 at borderline/intermediate risk to guide prevention. A decision aid, not a yearly test.",
    priority: 5,
  },
  {
    slug: "abdominal-aortic-aneurysm-ultrasound",
    name: "Abdominal aortic aneurysm (AAA) ultrasound",
    applies: (sex, age) => sex === "male" && age !== null && age >= 65 && age <= 75,
    cadenceMonths: () => null,
    cadenceLabel: () => "One-time",
    rationale: "USPSTF: one-time ultrasound for men 65–75 who have ever smoked; selective for other men 65–75.",
    priority: 6,
  },
];

export function planFor(sex: Sex, age: number | null): ScreeningRule[] {
  return SCREENING_RULES.filter((r) => r.applies(sex, age)).sort((a, b) => a.priority - b.priority);
}

export function ageFromBirthYear(birthYear: number | null | undefined): number | null {
  if (!birthYear) return null;
  const a = new Date().getFullYear() - birthYear;
  return a > 0 && a < 130 ? a : null;
}

export function addMonths(d: Date, months: number): Date {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
}

export type DueStatus = { label: string; tone: "due" | "soon" | "ok" | "done"; nextDue: Date | null };

// Given a rule + when the member last had it (or null), what's the status?
export function dueStatus(rule: ScreeningRule, age: number | null, lastDone: Date | null, now: Date): DueStatus {
  const cadence = rule.cadenceMonths(age);
  if (cadence === null) {
    // one-time / discuss-once
    return lastDone ? { label: "Logged — done", tone: "done", nextDue: null } : { label: "Ask your provider", tone: "due", nextDue: null };
  }
  if (!lastDone) return { label: "Recommended now", tone: "due", nextDue: null };
  const next = addMonths(lastDone, cadence);
  const days = Math.round((next.getTime() - now.getTime()) / 86400000);
  if (days <= 0) return { label: "Due now", tone: "due", nextDue: next };
  if (days <= 90) return { label: `Due in ${Math.ceil(days / 30)} mo`, tone: "soon", nextDue: next };
  return { label: `Next: ${next.toLocaleDateString(undefined, { month: "short", year: "numeric" })}`, tone: "ok", nextDue: next };
}
