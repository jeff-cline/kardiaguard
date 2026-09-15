import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import LabForm from "@/components/LabForm";

export const dynamic = "force-dynamic";

const fulfillmentLabel = (f: string) =>
  f === "mail_nationwide" ? "Mail — nationwide" : f === "mail_by_state" ? "Mail — by state" : "In person";

export default async function LabPortal() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role === "god") redirect("/dashboard");
  if (s.role !== "lab") redirect("/portal");

  const labs = await db.geneticLab.findMany({
    where: { ownerId: s.uid },
    orderBy: { createdAt: "desc" },
    include: { tests: { include: { test: { select: { name: true } } } }, _count: { select: { requests: true } } },
  });
  const totalRequests = labs.reduce((n, l) => n + l._count.requests, 0);

  return (
    <main className="wrap" style={{ paddingTop: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="kicker">Genetic lab portal</div>
          <h1 className="big" style={{ fontSize: 30, margin: "4px 0" }}>Your labs &amp; coverage</h1>
        </div>
        <a className="btn ghost" href="/api/logout">Log out</a>
      </div>

      <div className="dash" style={{ marginTop: 22, gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="kpi"><div className="n tnum">{labs.length}</div><div className="l">Your labs / coverage entries</div></div>
        <div className="kpi emer"><div className="n tnum">{totalRequests}</div><div className="l">Test requests routed to you</div></div>
        <div className="kpi"><div className="n tnum">{new Set(labs.flatMap((l) => l.tests.map((t) => t.test.name))).size}</div><div className="l">Distinct tests offered</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginTop: 30 }}>
        <section>
          <h2 className="sec" style={{ fontSize: 20 }}>Your coverage</h2>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table className="data">
              <thead><tr><th>Name</th><th>Fulfillment</th><th>Coverage</th><th>Tests</th><th>Requests</th></tr></thead>
              <tbody>
                {labs.length === 0 && <tr><td colSpan={5} style={{ color: "var(--muted)" }}>Add your coverage below to start receiving requests.</td></tr>}
                {labs.map((l) => (
                  <tr key={l.id}>
                    <td><b>{l.name}</b></td>
                    <td>{fulfillmentLabel(l.fulfillment)}</td>
                    <td>{l.fulfillment === "mail_nationwide" ? "All states" : l.fulfillment === "mail_by_state" ? (l.coverageStates || "—") : [l.city, l.state].filter(Boolean).join(", ")}</td>
                    <td style={{ maxWidth: 240 }}>{l.tests.map((t) => t.test.name).join(", ") || "—"}</td>
                    <td>{l._count.requests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <LabForm />
      </div>
    </main>
  );
}
