"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", password: "", zip: "", sex: "", birthYear: "", company: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const res = await fetch("/api/signup", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
      const j = await res.json();
      if (!res.ok || !j.ok) { setErr(j.error || "Something went wrong."); setBusy(false); return; }
      router.push(j.redirect || "/portal");
    } catch {
      setErr("Network error — please try again."); setBusy(false);
    }
  }

  return (
    <main className="wrap">
      <section className="hero" style={{ paddingBottom: 20 }}>
        <span className="eyebrow"><span className="beat" /> Free — always</span>
        <h1 className="big">Join <span className="u">Kardia Guard</span></h1>
        <p className="lead">Create your free account to get guideline-based reminders, heart-healthy resources, and help finding the screenings that fit you.</p>
      </section>
      <section style={{ marginTop: 10 }}>
        <form className="formcard" onSubmit={submit}>
          <input className="hp" type="text" tabIndex={-1} autoComplete="off" aria-hidden value={f.company} onChange={set("company")} />
          <div className="field"><label>Full name</label><input required value={f.name} onChange={set("name")} autoComplete="name" /></div>
          <div className="field"><label>Email</label><input required type="email" value={f.email} onChange={set("email")} autoComplete="email" /></div>
          <div className="field"><label>Password</label><input required type="password" minLength={8} value={f.password} onChange={set("password")} autoComplete="new-password" /></div>
          <div className="field"><label>ZIP code</label><input required value={f.zip} onChange={set("zip")} inputMode="numeric" maxLength={5} autoComplete="postal-code" /></div>
          <div style={{ display: "flex", gap: 12 }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Sex</label>
              <select value={f.sex} onChange={set("sex")}>
                <option value="">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
            <div className="field" style={{ flex: 1 }}><label>Birth year</label><input value={f.birthYear} onChange={set("birthYear")} inputMode="numeric" maxLength={4} placeholder="1960" /></div>
          </div>
          {err && <p className="err">{err}</p>}
          <button className="btn primary" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>{busy ? "Creating…" : "Create my free account"}</button>
          <p className="disc" style={{ marginTop: 12 }}>
            By joining you agree we may contact you with heart-health guidance and consent to our data
            practices. We connect knowledge and help you book — we don&rsquo;t diagnose or sell you a test.
            Some tests may require a provider referral and are subject to insurance or Medicare approval.
          </p>
          <p style={{ marginTop: 12, fontSize: 14 }}>Already a member? <Link href="/login">Log in</Link></p>
        </form>
      </section>
    </main>
  );
}
