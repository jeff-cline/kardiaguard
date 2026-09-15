import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TESTS, testBySlug, stars } from "@/lib/tests";

export function generateStaticParams() {
  return TESTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = testBySlug(slug);
  if (!t) return {};
  return {
    title: `${t.name} — what it detects, when to get it`,
    description: `${t.name}: ${t.detects}. When it's offered, why, and when it's routine — with USPSTF / AHA / Medicare guidance. ${t.noninvasive}.`,
    alternates: { canonical: `/tests/${t.slug}` },
  };
}

export default async function TestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = testBySlug(slug);
  if (!t) notFound();

  const faq = [
    { q: `What does ${t.short} detect?`, a: `${t.detects}. ${t.whatItIs}` },
    { q: `Is the ${t.short} test noninvasive?`, a: `${t.noninvasive}. ${t.whenOffered}` },
    { q: `When should you get ${t.short} screening?`, a: t.whenRoutine },
    { q: `Does Medicare cover ${t.short}?`, a: t.medicare },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero" style={{ paddingBottom: 8 }}>
        <Link href="/tests" style={{ fontSize: 14, fontWeight: 600 }}>← All heart tests</Link>
        <h1 className="big" style={{ marginTop: 14 }}>{t.name}</h1>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "6px 0 14px" }}>
          <span className="ni">{t.noninvasive}</span>
          <span className="pill">Screening fit <span style={{ color: "var(--gold)", marginLeft: 4 }}>{stars(t.screeningFit)}</span></span>
        </div>
        <p className="lead"><b>Detects:</b> {t.detects}</p>
      </section>

      <section style={{ marginTop: 30 }}>
        <div className="grid g2">
          <div className="card">
            <h3>What it is</h3>
            <p>{t.whatItIs}</p>
          </div>
          <div className="card">
            <h3>Where &amp; when it&rsquo;s offered</h3>
            <p>{t.whenOffered}</p>
          </div>
          <div className="card">
            <h3>Why it&rsquo;s offered</h3>
            <p>{t.whyOffered}</p>
          </div>
          <div className="card" style={{ borderColor: "var(--violet3)", background: "linear-gradient(180deg,#faf7ff,#fff)" }}>
            <h3>When it&rsquo;s routine</h3>
            <p style={{ color: "var(--body)" }}>{t.whenRoutine}</p>
          </div>
        </div>
        <div className="note" style={{ marginTop: 16 }}>
          <b>Insurance &amp; Medicare:</b> {t.medicare} Screenings are subject to insurance or Medicare
          approval, and some require a provider&rsquo;s order — check with your provider.
        </div>
      </section>

      <section>
        <div className="kicker">Common questions</div>
        <h2 className="sec">{t.short} — questions &amp; answers</h2>
        <div className="grid" style={{ gap: 12 }}>
          {faq.map((f) => (
            <div className="card" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="card" style={{ textAlign: "center", background: "linear-gradient(160deg,#faf7ff,#fff)", borderColor: "var(--violet3)" }}>
          <h2 className="sec" style={{ margin: "0 0 8px" }}>Want a reminder when this is due?</h2>
          <p className="sub" style={{ margin: "0 auto 18px" }}>Join Kardia Guard free — we&rsquo;ll tell you when {t.short} fits your age and guidelines, and help you find a facility near you.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link className="btn primary" href="/signup">Join free</Link>
            <Link className="btn ghost" href="/find">Find {t.short} near you →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
