import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import LabForm from "@/components/LabForm";

export const dynamic = "force-dynamic";

const fulfillmentLabel = (f: string) =>
  f === "mail_nationwide" ? "Mail — nationwide" : f === "mail_by_state" ? "Mail — by state" : "In person";

export default async function LabsAdmin() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role !== "god") redirect("/portal");

  const labs = await db.geneticLab.findMany({
    orderBy: { createdAt: "desc" },
    include: { tests: { include: { test: { select: { name: true } } } }, _count: { select: { requests: true } } },
  });

  return (
    <main className="wrap" style={{ paddingTop: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="kicker">God dashboard</div>
          <h1 className="big" style={{ fontSize: 30, margin: "4px 0" }}>Genetic labs</h1>
        </div>
        <Link className="btn ghost" href="/dashboard">← Dashboard</Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginTop: 22 }}>
        <LabForm />
        <section>
          <h2 className="sec" style={{ fontSize: 20 }}>{labs.length} labs</h2>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table className="data">
              <thead><tr><th>Name</th><th>Fulfillment</th><th>Coverage</th><th>Tests</th><th>Requests</th></tr></thead>
              <tbody>
                {labs.length === 0 && <tr><td colSpan={5} style={{ color: "var(--muted)" }}>No labs yet — add one above.</td></tr>}
                {labs.map((l) => (
                  <tr key={l.id}>
                    <td><b>{l.name}</b>{l.requestUrl ? "" : <span style={{ color: "var(--gold)" }}> · no intake link</span>}</td>
                    <td>{fulfillmentLabel(l.fulfillment)}</td>
                    <td>{l.fulfillment === "mail_nationwide" ? "All states" : l.fulfillment === "mail_by_state" ? (l.coverageStates || "—") : [l.city, l.state].filter(Boolean).join(", ")}</td>
                    <td style={{ maxWidth: 260 }}>{l.tests.map((t) => t.test.name).join(", ") || "—"}</td>
                    <td>{l._count.requests}</td>
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
