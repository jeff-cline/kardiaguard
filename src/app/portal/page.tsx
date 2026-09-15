import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { planFor, ageFromBirthYear, dueStatus, type Sex } from "@/lib/reminders";
import { RESOURCES } from "@/lib/resources";
import LogDone from "@/components/LogDone";
import ReminderToggle from "@/components/ReminderToggle";

export const dynamic = "force-dynamic";

const toneBadge: Record<string, string> = { due: "clicked", soon: "clicked", ok: "new", done: "booked" };

export default async function Portal() {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role === "god") redirect("/dashboard");
  if (user.role === "lab") redirect("/lab");

  const age = ageFromBirthYear(user.birthYear);
  const sex = (user.sex as Sex) || "";
  const plan = planFor(sex, age);
  const logs = await db.screeningLog.findMany({ where: { userId: user.id } });
  const logMap = new Map(logs.map((l) => [l.testSlug, l.doneOn]));
  const now = new Date();

  return (
    <main className="wrap" style={{ paddingTop: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="kicker">Your heart portal</div>
          <h1 className="big" style={{ fontSize: 32, margin: "4px 0" }}>Welcome{user.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <ReminderToggle initialOn={user.remindersOn} />
          <a className="btn ghost" href="/api/logout">Log out</a>
        </div>
      </div>

      <section style={{ marginTop: 20 }}>
        <div className="note">
          <b>Your Heart Plan</b> is built from national USPSTF / AHA / Medicare guidance for
          {sex ? ` ${sex}s` : " adults"}{age ? ` around age ${age}` : ""}. Log when you last had each screening and
          we&rsquo;ll track when the next one is due — and remind you if reminders are on. Educational only; your
          provider decides what&rsquo;s right for you, and screenings are subject to insurance or Medicare approval.
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 className="sec" style={{ fontSize: 22 }}>Your screening schedule</h2>
        <div className="grid" style={{ gap: 12, marginTop: 12 }}>
          {plan.map((rule) => {
            const last = logMap.get(rule.slug) ?? null;
            const st = dueStatus(rule, age, last, now);
            return (
              <div className="card" key={rule.slug} style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <Link href={`/tests/${rule.slug}`} style={{ fontWeight: 800, color: "var(--ink)", fontSize: 16 }}>{rule.name}</Link>
                    <span className={`badge ${toneBadge[st.tone]}`}>{st.label}</span>
                    <span className="pill" style={{ fontSize: 11.5 }}>{rule.cadenceLabel(age)}</span>
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--muted)" }}>{rule.rationale}</p>
                  {last && <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--muted)" }}>Last logged: {new Date(last).toLocaleDateString()}</p>}
                </div>
                <LogDone testSlug={rule.slug} lastDone={last ? new Date(last).toISOString().slice(0, 10) : null} />
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn primary" href="/find">Find these near you →</Link>
          <Link className="btn ghost" href="/genetic-testing">Explore genetic testing</Link>
        </div>
      </section>

      <section style={{ marginTop: 44 }}>
        <div className="grid g2">
          <Link className="card" href="/portal/movement" style={{ display: "block" }}>
            <div className="ic">🏃</div>
            <h3>Movement is medicine</h3>
            <p>Your free 3-day-a-week routine with Krystalore — plus the option to go live with coaching &amp; accountability.</p>
            <div className="rel" style={{ padding: 0, border: "none", boxShadow: "none", marginTop: 8 }}><span className="go">Open movement →</span></div>
          </Link>
          <Link className="card" href="/portal/resources" style={{ display: "block" }}>
            <div className="ic">💜</div>
            <h3>Heart-healthy resources</h3>
            <p>A curated library — nutrition, blood pressure, cholesterol, stress, and more — from trusted sources.</p>
            <div className="rel" style={{ padding: 0, border: "none", boxShadow: "none", marginTop: 8 }}><span className="go">Open resources →</span></div>
          </Link>
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 className="sec" style={{ fontSize: 20 }}>Start here</h2>
        <div className="grid g3" style={{ marginTop: 12 }}>
          {RESOURCES.slice(0, 3).map((r) => (
            <a className="card" key={r.title} href={r.url} target="_blank" rel="noopener">
              <div className="pill" style={{ marginBottom: 8, fontSize: 11 }}>{r.category}</div>
              <h3 style={{ fontSize: 16 }}>{r.title}</h3>
              <p>{r.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
