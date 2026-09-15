import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { ROUTINE, LIVE_PRICE, LIVE_REGULAR, LIVE_INCLUDES } from "@/lib/movement";
import UpgradeButton from "@/components/UpgradeButton";

export const dynamic = "force-dynamic";

export default async function Movement() {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role === "god") redirect("/dashboard");

  return (
    <main className="wrap" style={{ paddingTop: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="kicker">Movement is medicine</div>
          <h1 className="big" style={{ fontSize: 32, margin: "4px 0" }}>Your 3-day-a-week routine</h1>
        </div>
        <Link className="btn ghost" href="/portal">← Portal</Link>
      </div>
      <p className="sub" style={{ marginTop: 8 }}>Move with Krystalore three days a week. Your Kardia Guard membership includes the full video catalog free — start any day.</p>

      <section style={{ marginTop: 24 }}>
        <div className="grid g3">
          {ROUTINE.map((d) => (
            <div className="card" key={d.day}>
              <div className="pill" style={{ marginBottom: 10 }}>{d.day}</div>
              <h3 style={{ fontSize: 18 }}>{d.theme}</h3>
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                {d.sessions.map((s) => (
                  <div key={s.title} style={{ borderTop: "1px solid var(--line)", paddingTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <b style={{ fontSize: 14.5, color: "var(--ink)" }}>{s.title}</b>
                      <span style={{ fontSize: 12.5, color: "var(--muted)", whiteSpace: "nowrap" }}>{s.minutes} min</span>
                    </div>
                    <p style={{ margin: "3px 0 0", fontSize: 13, color: "var(--muted)" }}>{s.focus}</p>
                    <span className="badge new" style={{ marginTop: 6, display: "inline-block" }}>{s.videoUrl ? "▶ Watch" : "Video coming"}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="disc" style={{ marginTop: 14 }}>Check with your provider before starting a new exercise routine, especially if you have a heart condition. Move at your own pace and stop if you feel unwell.</p>
      </section>

      {/* $99 live upgrade */}
      <section style={{ marginTop: 40 }}>
        <div className="card" style={{ background: "linear-gradient(160deg,#2E1065,#4a1d9e)", color: "#efe7ff", borderColor: "transparent" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div className="kicker" style={{ color: "#f3b6d8" }}>Go live with Krystalore</div>
              <h2 className="sec" style={{ color: "#fff", margin: "6px 0 10px" }}>The live accountability program</h2>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
                {LIVE_INCLUDES.map((i) => (
                  <li key={i} style={{ paddingLeft: 24, position: "relative", fontSize: 15 }}>
                    <span style={{ position: "absolute", left: 0, color: "#5cebb0", fontWeight: 800 }}>✓</span>{i}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ textAlign: "center", background: "rgba(255,255,255,.1)", borderRadius: 16, padding: "22px 26px", minWidth: 200 }}>
              <div style={{ fontSize: 14, color: "#d9c9f7", textDecoration: "line-through" }}>${LIVE_REGULAR}/mo regular</div>
              <div style={{ fontSize: 44, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>${LIVE_PRICE}<span style={{ fontSize: 18 }}>/mo</span></div>
              <div style={{ fontSize: 12.5, color: "#f3b6d8", fontWeight: 700, marginBottom: 14 }}>Kardia Guard member price</div>
              <UpgradeButton />
            </div>
          </div>
        </div>
        <p className="disc" style={{ marginTop: 12 }}>Optional upgrade. The 3-day video catalog above stays free with your membership.</p>
      </section>
    </main>
  );
}
