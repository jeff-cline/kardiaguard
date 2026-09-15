import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role !== "god") redirect("/portal");

  const [members, leads, clicks, booked, recentLeads, locationCount, geneticOrdered, geneticLeads, labCount, recentGenetic] = await Promise.all([
    db.user.count({ where: { role: "member" } }),
    db.lead.count(),
    db.booking.count(),
    db.booking.count({ where: { status: "booked" } }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 12, include: { bookings: true } }),
    db.location.count(),
    db.geneticRequest.count(),
    db.lead.count({ where: { source: "genetic" } }),
    db.geneticLab.count(),
    db.geneticRequest.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { test: { select: { name: true } }, lab: { select: { name: true } }, lead: { select: { email: true } } } }),
  ]);
  const bookedLeadIds = new Set((await db.booking.findMany({ select: { leadId: true } })).map((b) => b.leadId).filter(Boolean));
  const convert = leads > 0 ? Math.round((bookedLeadIds.size / leads) * 100) : 0;
  const geneticLeadIds = new Set((await db.geneticRequest.findMany({ select: { leadId: true } })).map((r) => r.leadId).filter(Boolean));
  const geneticConvert = geneticLeads > 0 ? Math.round((geneticLeadIds.size / geneticLeads) * 100) : 0;

  return (
    <main className="wrap" style={{ paddingTop: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="kicker">God dashboard</div>
          <h1 className="big" style={{ fontSize: 34, margin: "4px 0" }}>Kardia Guard control</h1>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn ghost" href="/dashboard/locations">Manage locations</Link>
          <Link className="btn ghost" href="/dashboard/labs">Manage genetic labs</Link>
          <a className="btn ghost" href="/api/logout">Log out</a>
        </div>
      </div>

      <div className="dash" style={{ marginTop: 22 }}>
        <div className="kpi"><div className="n tnum">{members}</div><div className="l">Free members</div></div>
        <div className="kpi"><div className="n tnum">{leads}</div><div className="l">Leads captured</div></div>
        <div className="kpi pulse"><div className="n tnum">{clicks}</div><div className="l">Booking clicks</div></div>
        <div className="kpi emer"><div className="n tnum">{booked}</div><div className="l">Booked appointments</div></div>
      </div>
      <div className="dash" style={{ marginTop: 14, gridTemplateColumns: "repeat(2,1fr)" }}>
        <div className="kpi emer"><div className="n tnum">{convert}%</div><div className="l">Lead → booked-appointment conversion</div></div>
        <div className="kpi"><div className="n tnum">{locationCount}</div><div className="l">Screening locations · <Link href="/dashboard/locations">manage →</Link></div></div>
      </div>

      <section style={{ marginTop: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <h2 className="sec" style={{ fontSize: 22, margin: 0 }}>Genetic testing</h2>
          <Link href="/dashboard/labs" style={{ fontSize: 14, fontWeight: 600 }}>Manage labs →</Link>
        </div>
        <div className="dash" style={{ marginTop: 14 }}>
          <div className="kpi"><div className="n tnum">{geneticLeads}</div><div className="l">Genetic leads</div></div>
          <div className="kpi emer"><div className="n tnum">{geneticOrdered}</div><div className="l">Tests requested / ordered</div></div>
          <div className="kpi emer"><div className="n tnum">{geneticConvert}%</div><div className="l">Lead → test-ordered conversion</div></div>
          <div className="kpi"><div className="n tnum">{labCount}</div><div className="l">Genetic labs</div></div>
        </div>
        {recentGenetic.length > 0 && (
          <div style={{ overflowX: "auto", marginTop: 14 }}>
            <table className="data">
              <thead><tr><th>Test</th><th>Requester</th><th>State</th><th>Routed lab</th><th>When</th></tr></thead>
              <tbody>
                {recentGenetic.map((r) => (
                  <tr key={r.id}>
                    <td>{r.test.name}</td>
                    <td>{r.lead?.email || "—"}</td>
                    <td>{r.state || "—"}</td>
                    <td>{r.lab?.name || <span style={{ color: "var(--gold)" }}>unrouted</span>}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 className="sec" style={{ fontSize: 22 }}>Recent leads</h2>
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table className="data">
            <thead><tr><th>Name</th><th>Email</th><th>ZIP</th><th>Source</th><th>Status</th><th>When</th></tr></thead>
            <tbody>
              {recentLeads.length === 0 && <tr><td colSpan={6} style={{ color: "var(--muted)" }}>No leads yet — signups will appear here.</td></tr>}
              {recentLeads.map((l) => {
                const isBooked = l.bookings.some((b) => b.status === "booked");
                const clicked = l.bookings.length > 0;
                return (
                  <tr key={l.id}>
                    <td>{l.name || "—"}</td>
                    <td>{l.email}</td>
                    <td>{l.zip || "—"}</td>
                    <td>{l.source}</td>
                    <td><span className={`badge ${isBooked ? "booked" : clicked ? "clicked" : "new"}`}>{isBooked ? "booked" : clicked ? "clicked" : "new"}</span></td>
                    <td>{new Date(l.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
