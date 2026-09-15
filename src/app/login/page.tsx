"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const res = await fetch("/api/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
      const j = await res.json();
      if (!res.ok || !j.ok) { setErr(j.error || "Invalid email or password."); setBusy(false); return; }
      router.push(j.redirect || "/portal");
    } catch { setErr("Network error — please try again."); setBusy(false); }
  }

  return (
    <main className="wrap">
      <section className="hero" style={{ paddingBottom: 20 }}>
        <h1 className="big">Welcome back</h1>
        <p className="lead">Log in to your Kardia Guard portal.</p>
      </section>
      <section style={{ marginTop: 10 }}>
        <form className="formcard" onSubmit={submit}>
          <div className="field"><label>Email</label><input required type="email" value={f.email} onChange={set("email")} autoComplete="email" /></div>
          <div className="field"><label>Password</label><input required type="password" value={f.password} onChange={set("password")} autoComplete="current-password" /></div>
          {err && <p className="err">{err}</p>}
          <button className="btn primary" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
          <p style={{ marginTop: 12, fontSize: 14 }}>New here? <Link href="/signup">Join free</Link></p>
        </form>
      </section>
    </main>
  );
}
