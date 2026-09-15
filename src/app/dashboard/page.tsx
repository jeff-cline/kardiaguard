import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role !== "god") redirect("/portal");

  const [members, leads, clicks, booked, recentLeads, locationCount] = await Promise.all([
    db.user.count({ where: { role: "member" } }),
    db.lead.count(),
    db.booking.count(),
    db.booking.count({ where: { status: "booked" } }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 12, include: { bookings: true } }),
    db.location.count(),
  ]);
  const bookedLeadIds = new Set((await db.booking.findMany({ select: { leadId: true } })).map((b) => b.leadId).filter(Boolean));
  const convert = leads > 0 ? Math.round((bookedLeadIds.size / leads) * 100) : 0;

  return (
    <main className="wrap" style={{ paddingTop: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="kicker">God dashboard</div>
          <h1 className="big" style={{ fontSize: 34, margin: "4px 0" }}>Kardia Guard control</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link className="btn ghost" href="/dashboard/locations">Manage locations</Link>
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
