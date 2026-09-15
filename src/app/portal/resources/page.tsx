import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { RESOURCES } from "@/lib/resources";

export const dynamic = "force-dynamic";

export default async function Resources() {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role === "god") redirect("/dashboard");

  const cats = Array.from(new Set(RESOURCES.map((r) => r.category)));

  return (
    <main className="wrap" style={{ paddingTop: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="kicker">Heart-healthy resources</div>
          <h1 className="big" style={{ fontSize: 32, margin: "4px 0" }}>Keep your heart strong</h1>
        </div>
        <Link className="btn ghost" href="/portal">← Portal</Link>
      </div>
      <p className="sub" style={{ marginTop: 8 }}>A curated library from trusted sources — the American Heart Association, CDC, and NIH.</p>

      {cats.map((cat) => (
        <section key={cat} style={{ marginTop: 28 }}>
          <div className="kicker">{cat}</div>
          <div className="grid g3" style={{ marginTop: 10 }}>
            {RESOURCES.filter((r) => r.category === cat).map((r) => (
              <a className="card" key={r.title} href={r.url} target="_blank" rel="noopener">
                <h3 style={{ fontSize: 16 }}>{r.title}</h3>
                <p>{r.desc}</p>
                <div className="rel" style={{ padding: 0, border: "none", boxShadow: "none", marginTop: 8 }}><span className="go">Read →</span></div>
              </a>
            ))}
          </div>
        </section>
      ))}
      <p className="disc" style={{ marginTop: 24 }}>Links go to third-party organizations for education. Kardia Guard doesn&rsquo;t provide medical advice — talk with your provider about what&rsquo;s right for you.</p>
    </main>
  );
}
