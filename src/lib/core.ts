import "server-only";

// Integration with the R0cketShip Core (137.220.56.129).
// Leads are pushed to the Core CRM (enriched + attributed) when a key pair is
// configured; otherwise they live only in this app's DB. Never throws.

export async function pushLeadToCore(input: {
  name?: string;
  email: string;
  phone?: string;
  zip?: string;
  state?: string;
  notes?: string;
}): Promise<string> {
  const base = process.env.CORE_BASE_URL || "";
  const pk = process.env.CORE_PK || "";
  const sk = process.env.CORE_SK || "";
  if (!base || !pk || !sk) return "";
  try {
    const res = await fetch(`${base}/api/core/lead`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-core-key": pk, "x-core-secret": sk },
      body: JSON.stringify({ ...input, creatorRef: "kardiaguard" }),
      // don't hang the signup on a slow Core
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return "";
    const j = await res.json().catch(() => ({}));
    return String(j.id || j.leadId || "");
  } catch {
    return "";
  }
}

// ---- reCAPTCHA (Core portable-guard, env-driven) --------------------------
// Inert until keys are set. In "monitor" it logs and passes; in "enforce" it
// blocks low scores. The honeypot below is always active.

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export function honeypotTripped(body: Record<string, unknown>): boolean {
  const v = String(body?.company ?? "").trim();
  return v.length > 0;
}

export async function recaptchaOk(token: string | undefined): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY || "";
  const mode = process.env.RECAPTCHA_MODE === "enforce" ? "enforce" : "monitor";
  if (!secret) return true; // not configured → pass (honeypot still guards)
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token || "" }),
      signal: AbortSignal.timeout(5000),
    });
    const j: { success?: boolean; score?: number } = await res.json().catch(() => ({}));
    const min = Number(process.env.RECAPTCHA_MIN_SCORE) || 0.5;
    const pass = Boolean(j.success) && (j.score === undefined || j.score >= min);
    if (mode === "monitor") return true; // log-and-pass while tuning
    return pass;
  } catch {
    return mode !== "enforce";
  }
}

export const recaptchaSiteKey = () => process.env.RECAPTCHA_SITE_KEY || "";
