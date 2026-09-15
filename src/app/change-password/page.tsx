"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [f, setF] = useState({ current: "", next: "", confirm: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (f.next !== f.confirm) { setErr("New passwords don't match."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/change-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ current: f.current, next: f.next }) });
      const j = await res.json();
      if (!res.ok || !j.ok) { setErr(j.error || "Could not change password."); setBusy(false); return; }
      router.push("/dashboard");
    } catch { setErr("Network error — please try again."); setBusy(false); }
  }

  return (
    <main className="wrap">
      <section className="hero" style={{ paddingBottom: 20 }}>
        <h1 className="big">Set a new password</h1>
        <p className="lead">For your security, please choose a new password before continuing.</p>
      </section>
      <section style={{ marginTop: 10 }}>
        <form className="formcard" onSubmit={submit}>
          <div className="field"><label>Current password</label><input required type="password" value={f.current} onChange={set("current")} autoComplete="current-password" /></div>
          <div className="field"><label>New password</label><input required type="password" minLength={8} value={f.next} onChange={set("next")} autoComplete="new-password" /></div>
          <div className="field"><label>Confirm new password</label><input required type="password" minLength={8} value={f.confirm} onChange={set("confirm")} autoComplete="new-password" /></div>
          {err && <p className="err">{err}</p>}
          <button className="btn primary" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>{busy ? "Saving…" : "Save new password"}</button>
        </form>
      </section>
    </main>
  );
}
