"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { TESTS } from "@/lib/tests";
import type { MapLoc } from "@/components/MapView";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false, loading: () => <div style={{ height: 460, borderRadius: 16, background: "var(--lav)" }} /> });

type Result = MapLoc & { address: string; phone: string; bookingUrl: string; tests: { slug: string; name: string }[] };

export default function FindPage() {
  const [zip, setZip] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggle = (slug: string) => setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));

  async function search(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    const qs = new URLSearchParams();
    if (zip) qs.set("zip", zip);
    if (selected.length) qs.set("tests", selected.join(","));
    const res = await fetch(`/api/locations/search?${qs.toString()}`);
    const j = await res.json();
    setOrigin(j.origin || null);
    setResults(j.locations || []);
    setSearched(true);
    setBusy(false);
  }

  async function book(loc: Result) {
    try {
      const res = await fetch("/api/booking", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ locationId: loc.id, testSlug: selected[0] || "" }) });
      const j = await res.json();
      const url = j.bookingUrl || loc.bookingUrl;
      if (url) window.open(url, "_blank", "noopener");
      else alert("This location hasn't added an online booking link yet — please call them.");
    } catch {
      if (loc.bookingUrl) window.open(loc.bookingUrl, "_blank", "noopener");
    }
  }

  return (
    <main className="wrap">
      <section className="hero" style={{ paddingBottom: 10 }}>
        <span className="eyebrow"><span className="beat" /> Find screening near you</span>
        <h1 className="big">Where to get <span className="u">screened</span></h1>
        <p className="lead">Enter your ZIP and pick the test(s) you&rsquo;re looking for. We&rsquo;ll map the closest facilities that offer them and connect you to book.</p>
      </section>

      <section style={{ marginTop: 18 }}>
        <form onSubmit={search} className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="field" style={{ marginBottom: 0, width: 160 }}>
              <label>Your ZIP code</label>
              <input value={zip} onChange={(e) => setZip(e.target.value)} inputMode="numeric" maxLength={5} placeholder="85001" />
            </div>
            <button className="btn primary" disabled={busy} style={{ marginBottom: 0 }}>{busy ? "Searching…" : "Search"}</button>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="kicker" style={{ marginBottom: 8 }}>Looking for these tests (pick one or more)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TESTS.map((t) => {
                const on = selected.includes(t.slug);
                return (
                  <button type="button" key={t.slug} onClick={() => toggle(t.slug)}
                    style={{ cursor: "pointer", fontSize: 13, fontWeight: 700, padding: "8px 13px", borderRadius: 999,
                      border: on ? "1px solid var(--violet2)" : "1px solid var(--line)",
                      background: on ? "var(--violet)" : "#fff", color: on ? "#fff" : "var(--body)" }}>
                    {t.short}
                  </button>
                );
              })}
            </div>
            {selected.length > 1 && <p className="disc" style={{ marginTop: 10 }}>Showing locations that offer <b>all {selected.length}</b> selected tests.</p>}
          </div>
        </form>
      </section>

      {searched && (
        <section style={{ marginTop: 24 }}>
          <MapView origin={origin} locations={results} />
          <h2 className="sec" style={{ fontSize: 22, marginTop: 24 }}>{results.length} {results.length === 1 ? "location" : "locations"}{origin ? " near you" : ""}</h2>
          {results.length === 0 && <p className="sub" style={{ marginTop: 8 }}>No locations match yet. Try fewer tests or a nearby ZIP — we&rsquo;re adding facilities continuously. <Link href="/signup">Join free</Link> and we&rsquo;ll alert you when one opens near you.</p>}
          <div className="tlist" style={{ marginTop: 14 }}>
            {results.map((l) => (
              <div className="trow" key={l.id} style={{ cursor: "default" }}>
                <div className="tn">
                  <div className="nm">{l.name}</div>
                  <div className="dt">{[l.address, l.city, l.state].filter(Boolean).join(", ")} {l.zip}{l.miles != null ? ` · ${l.miles} mi` : ""}</div>
                  <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {l.tests.slice(0, 6).map((t) => <span key={t.slug} className="pill" style={{ fontSize: 11, padding: "3px 9px" }}>{t.name}</span>)}
                  </div>
                </div>
                <button className="btn pulse" style={{ padding: "10px 18px", fontSize: 14 }} onClick={() => book(l)}>Book →</button>
              </div>
            ))}
          </div>
          <p className="disc" style={{ marginTop: 18 }}>Booking connects you to the facility&rsquo;s own scheduling. Depending on your insurance, some tests may require a provider&rsquo;s referral, and screenings are subject to insurance or Medicare approval.</p>
        </section>
      )}
    </main>
  );
}
