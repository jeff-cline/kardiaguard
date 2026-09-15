"use client";
import { useState } from "react";

type Routed = { name: string; fulfillment: string; requestUrl: string; phone: string; city: string; state: string } | null;

const fulfillmentLabel = (f: string) =>
  f === "mail_nationwide" ? "Mail-order (nationwide)" : f === "mail_by_state" ? "Mail-order (your state)" : "In person";

export default function RequestTestForm({ testSlug, testName }: { testSlug: string; testName: string }) {
  const [f, setF] = useState({ name: "", email: "", zip: "", company: "" });
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [routed, setRouted] = useState<Routed>(null);
  const [err, setErr] = useState("");
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setState("loading");
    try {
      const res = await fetch("/api/genetic/request", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...f, testSlug }) });
      const j = await res.json();
      if (!res.ok || !j.ok) { setErr(j.error || "Something went wrong."); setState("idle"); return; }
      setRouted(j.routed);
      setState("done");
    } catch { setErr("Network error — please try again."); setState("idle"); }
  }

  if (state === "done") {
    return (
      <div className="formcard" style={{ borderColor: "var(--violet3)" }}>
        <div style={{ fontSize: 26 }}>✅</div>
        <h3 style={{ margin: "6px 0" }}>Request received</h3>
        {routed ? (
          <>
            <p style={{ fontSize: 15, color: "var(--body)" }}>
              We&rsquo;ve matched you with <b>{routed.name}</b> — <b>{fulfillmentLabel(routed.fulfillment)}</b>
              {routed.fulfillment.startsWith("mail") ? ". They&rsquo;ll send a swab kit to your door; you collect the sample and mail it back in the prepaid envelope." : `${routed.city ? ` in ${routed.city}` : ""}${routed.state ? `, ${routed.state}` : ""}.`}
            </p>
            {routed.requestUrl && <a className="btn primary" href={routed.requestUrl} target="_blank" rel="noopener" style={{ marginTop: 6 }}>Continue with {routed.name} →</a>}
            {routed.phone && <p style={{ fontSize: 14, marginTop: 10 }}>Questions? Call {routed.phone}.</p>}
          </>
        ) : (
          <p style={{ fontSize: 15, color: "var(--body)" }}>Thanks — we&rsquo;ve logged your interest in <b>{testName}</b> and a partner lab will follow up. We&rsquo;re adding labs continuously.</p>
        )}
        <p className="disc" style={{ marginTop: 14 }}>
          Genetic testing generally requires a provider&rsquo;s order or prescription and is <b>subject to insurance or Medicare approval — check with your provider.</b> Kardia Guard connects you to labs; it does not diagnose or interpret results.
        </p>
      </div>
    );
  }

  return (
    <form className="formcard" onSubmit={submit}>
      <h3 style={{ margin: "0 0 4px" }}>Request this test</h3>
      <p className="sub" style={{ margin: "0 0 14px", fontSize: 14 }}>Tell us where to send the kit — we&rsquo;ll match you to a lab that serves your area.</p>
      <input className="hp" type="text" tabIndex={-1} autoComplete="off" aria-hidden value={f.company} onChange={set("company")} />
      <div className="field"><label>Full name</label><input required value={f.name} onChange={set("name")} autoComplete="name" /></div>
      <div className="field"><label>Email</label><input required type="email" value={f.email} onChange={set("email")} autoComplete="email" /></div>
      <div className="field"><label>ZIP code</label><input required value={f.zip} onChange={set("zip")} inputMode="numeric" maxLength={5} autoComplete="postal-code" /></div>
      {err && <p className="err">{err}</p>}
      <button className="btn pulse" style={{ width: "100%", justifyContent: "center" }} disabled={state === "loading"}>{state === "loading" ? "Requesting…" : "Request test →"}</button>
      <p className="disc" style={{ marginTop: 12 }}>
        Requesting connects you to a partner lab. Genetic tests generally require a provider&rsquo;s order / prescription and are <b>subject to insurance or Medicare approval — check with your provider.</b>
      </p>
    </form>
  );
}
