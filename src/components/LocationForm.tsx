"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TESTS } from "@/lib/tests";

export default function LocationForm() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", address: "", city: "", state: "", zip: "", phone: "", bookingUrl: "" });
  const [tests, setTests] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const toggle = (s: string) => setTests((t) => (t.includes(s) ? t.filter((x) => x !== s) : [...t, s]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(""); setBusy(true);
    const res = await fetch("/api/locations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...f, tests }) });
    const j = await res.json();
    setBusy(false);
    if (!res.ok || !j.ok) { setMsg(j.error || "Could not save."); return; }
    setMsg(j.geocoded ? "Location added and mapped ✓" : "Added — but ZIP didn't geocode (won't appear on the map until fixed).");
    setF({ name: "", address: "", city: "", state: "", zip: "", phone: "", bookingUrl: "" }); setTests([]);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 22 }}>
      <h3 style={{ margin: "0 0 14px" }}>Add a screening location</h3>
      <div className="field"><label>Name</label><input required value={f.name} onChange={set("name")} placeholder="Valley Heart Imaging" /></div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div className="field" style={{ flex: 2, minWidth: 200 }}><label>Address</label><input value={f.address} onChange={set("address")} /></div>
        <div className="field" style={{ flex: 1, minWidth: 90 }}><label>ZIP</label><input required value={f.zip} onChange={set("zip")} inputMode="numeric" maxLength={5} placeholder="85001" /></div>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div className="field" style={{ flex: 1 }}><label>City</label><input value={f.city} onChange={set("city")} /></div>
        <div className="field" style={{ width: 90 }}><label>State</label><input value={f.state} onChange={set("state")} maxLength={2} placeholder="AZ" /></div>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div className="field" style={{ flex: 1, minWidth: 160 }}><label>Phone</label><input value={f.phone} onChange={set("phone")} /></div>
        <div className="field" style={{ flex: 1, minWidth: 200 }}><label>Booking link (URL)</label><input value={f.bookingUrl} onChange={set("bookingUrl")} placeholder="https://…" /></div>
      </div>
      <div style={{ marginTop: 6 }}>
        <div className="kicker" style={{ marginBottom: 8 }}>Tests this location offers</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TESTS.map((t) => {
            const on = tests.includes(t.slug);
            return (
              <button type="button" key={t.slug} onClick={() => toggle(t.slug)}
                style={{ cursor: "pointer", fontSize: 12.5, fontWeight: 700, padding: "7px 12px", borderRadius: 999,
                  border: on ? "1px solid var(--violet2)" : "1px solid var(--line)", background: on ? "var(--violet)" : "#fff", color: on ? "#fff" : "var(--body)" }}>
                {t.short}
              </button>
            );
          })}
        </div>
      </div>
      {msg && <p className="note" style={{ marginTop: 14 }}>{msg}</p>}
      <button className="btn primary" style={{ marginTop: 16 }} disabled={busy}>{busy ? "Saving…" : "Add location"}</button>
    </form>
  );
}
