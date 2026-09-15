import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import LocationForm from "@/components/LocationForm";

export const dynamic = "force-dynamic";

export default async function LocationsAdmin() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role !== "god") redirect("/portal");

  const locations = await db.location.findMany({
    orderBy: { createdAt: "desc" },
    include: { tests: { include: { test: { select: { name: true } } } } },
  });

  return (
    <main className="wrap" style={{ paddingTop: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="kicker">God dashboard</div>
          <h1 className="big" style={{ fontSize: 30, margin: "4px 0" }}>Screening locations</h1>
        </div>
        <Link className="btn ghost" href="/dashboard">← Dashboard</Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginTop: 22 }}>
        <LocationForm />
        <section>
          <h2 className="sec" style={{ fontSize: 20 }}>{locations.length} locations</h2>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table className="data">
              <thead><tr><th>Name</th><th>City/State</th><th>ZIP</th><th>Mapped</th><th>Tests</th><th>Source</th></tr></thead>
              <tbody>
                {locations.length === 0 && <tr><td colSpan={6} style={{ color: "var(--muted)" }}>No locations yet — add one above.</td></tr>}
                {locations.map((l) => (
                  <tr key={l.id}>
                    <td><b>{l.name}</b>{l.bookingUrl ? "" : <span style={{ color: "var(--gold)" }}> · no booking link</span>}</td>
                    <td>{[l.city, l.state].filter(Boolean).join(", ") || "—"}</td>
                    <td>{l.zip || "—"}</td>
                    <td>{l.lat != null ? "✓" : <span style={{ color: "#b91c1c" }}>no</span>}</td>
                    <td style={{ maxWidth: 260 }}>{l.tests.map((t) => t.test.name).join(", ") || "—"}</td>
                    <td>{l.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
