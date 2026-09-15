"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GENETIC_TESTS } from "@/lib/genetic";

export default function LabForm() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", fulfillment: "mail_nationwide", coverageStates: "", requestUrl: "", phone: "", city: "", state: "", zip: "" });
  const [tests, setTests] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const toggle = (s: string) => setTests((t) => (t.includes(s) ? t.filter((x) => x !== s) : [...t, s]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(""); setBusy(true);
    const res = await fetch("/api/genetic/labs", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...f, tests }) });
    const j = await res.json();
    setBusy(false);
    if (!res.ok || !j.ok) { setMsg(j.error || "Could not save."); return; }
    setMsg("Lab added ✓");
    setF({ name: "", fulfillment: "mail_nationwide", coverageStates: "", requestUrl: "", phone: "", city: "", state: "", zip: "" }); setTests([]);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 22 }}>
      <h3 style={{ margin: "0 0 14px" }}>Add a genetic lab</h3>
      <div className="field"><label>Lab name</label><input required value={f.name} onChange={set("name")} placeholder="Helix Genomics" /></div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div className="field" style={{ flex: 1, minWidth: 180 }}>
          <label>Fulfillment</label>
          <select value={f.fulfillment} onChange={set("fulfillment")}>
            <option value="mail_nationwide">Mail-order — nationwide</option>
            <option value="mail_by_state">Mail-order — specific states</option>
            <option value="in_person">In person (has a location)</option>
          </select>
        </div>
        <div className="field" style={{ flex: 1, minWidth: 200 }}><label>Order / intake link (URL)</label><input value={f.requestUrl} onChange={set("requestUrl")} placeholder="https://…" /></div>
      </div>
      {f.fulfillment === "mail_by_state" && (
        <div className="field"><label>States served (comma-separated, e.g. AZ, CA, TX)</label><input value={f.coverageStates} onChange={set("coverageStates")} placeholder="AZ, CA, NV" /></div>
      )}
      {f.fulfillment === "in_person" && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="field" style={{ flex: 1 }}><label>City</label><input value={f.city} onChange={set("city")} /></div>
          <div className="field" style={{ width: 80 }}><label>State</label><input value={f.state} onChange={set("state")} maxLength={2} /></div>
          <div className="field" style={{ width: 100 }}><label>ZIP</label><input value={f.zip} onChange={set("zip")} maxLength={5} /></div>
        </div>
      )}
      <div className="field" style={{ maxWidth: 220 }}><label>Phone (optional)</label><input value={f.phone} onChange={set("phone")} /></div>
      <div style={{ marginTop: 4 }}>
        <div className="kicker" style={{ marginBottom: 8 }}>Genetic tests this lab offers</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {GENETIC_TESTS.map((t) => {
            const on = tests.includes(t.slug);
            return (
              <button type="button" key={t.slug} onClick={() => toggle(t.slug)}
                style={{ cursor: "pointer", fontSize: 12.5, fontWeight: 700, padding: "7px 12px", borderRadius: 999, border: on ? "1px solid var(--violet2)" : "1px solid var(--line)", background: on ? "var(--violet)" : "#fff", color: on ? "#fff" : "var(--body)" }}>
                {t.short}
              </button>
            );
          })}
        </div>
      </div>
      {msg && <p className="note" style={{ marginTop: 14 }}>{msg}</p>}
      <button className="btn primary" style={{ marginTop: 16 }} disabled={busy}>{busy ? "Saving…" : "Add lab"}</button>
    </form>
  );
}
