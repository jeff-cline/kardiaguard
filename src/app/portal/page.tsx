import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { TESTS, stars } from "@/lib/tests";

export const dynamic = "force-dynamic";

export default async function Portal() {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role === "god") redirect("/dashboard");

  const age = user.birthYear ? new Date().getFullYear() - user.birthYear : null;
  // Simple, guideline-informed surfacing (educational — not a prescription).
  const recommended = TESTS.filter((t) => {
    if (t.slug === "blood-pressure-screening") return age === null || age >= 18;
    if (t.slug === "lipid-panel") return age === null || age >= (user.sex === "male" ? 35 : 45) || age >= 20;
    if (t.slug === "a1c-glucose") return age === null || age >= 35;
    if (t.slug === "abdominal-aortic-aneurysm-ultrasound") return user.sex === "male" && age !== null && age >= 65 && age <= 75;
    if (t.slug === "coronary-artery-calcium-cac-ct") return age === null || (age >= 40 && age <= 75);
    return t.screeningFit >= 4;
  });

  return (
    <main className="wrap" style={{ paddingTop: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="kicker">Your heart portal</div>
          <h1 className="big" style={{ fontSize: 32, margin: "4px 0" }}>Welcome{user.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
        </div>
        <a className="btn ghost" href="/api/logout">Log out</a>
      </div>

      <section style={{ marginTop: 24 }}>
        <div className="note">
          Knowledge is power. Below is a starting checklist based on general USPSTF / AHA guidance for
          {user.sex ? ` ${user.sex}s` : " adults"}{age ? ` around age ${age}` : ""}. It&rsquo;s educational — your
          provider decides what&rsquo;s right for you, and screenings are subject to insurance or Medicare approval.
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 className="sec" style={{ fontSize: 22 }}>Your screening checklist</h2>
        <div className="tlist" style={{ marginTop: 12 }}>
          {recommended.map((t) => (
            <Link className="trow" href={`/tests/${t.slug}`} key={t.slug}>
              <div className="tn"><div className="nm">{t.name}</div><div className="dt">{t.whenRoutine}</div></div>
              <span className="stars">{stars(t.screeningFit)}</span>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn primary" href="/find">Find these near you →</Link>
          <Link className="btn ghost" href="/tests">Learn about each test</Link>
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <div className="grid g2">
          <div className="card">
            <div className="ic">💜</div>
            <h3>Heart-healthy resources</h3>
            <p>A growing library to keep your heart strong — coming to your portal.</p>
          </div>
          <div className="card">
            <div className="ic">🏃</div>
            <h3>Movement is medicine</h3>
            <p>A 3-day-a-week movement routine with Krystalore — catalog access included free, with an optional live upgrade. Coming soon to your portal.</p>
          </div>
        </div>
        <p className="disc" style={{ marginTop: 14 }}>Reminders based on your age, sex, and national guidelines are on the way — we&rsquo;ll notify you when each screening is due.</p>
      </section>
    </main>
  );
}
