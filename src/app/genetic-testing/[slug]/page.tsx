import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GENETIC_TESTS, geneticBySlug } from "@/lib/genetic";
import RequestTestForm from "@/components/RequestTestForm";

export function generateStaticParams() {
  return GENETIC_TESTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = geneticBySlug(slug);
  if (!t) return {};
  return {
    title: `${t.name} — what it detects & how to get it`,
    description: `${t.name}: ${t.detects}. Who it's for, how the mail-order kit works, and the guidance behind it. Requires a provider's order; subject to insurance or Medicare approval.`,
    alternates: { canonical: `/genetic-testing/${t.slug}` },
  };
}

export default async function GeneticTestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = geneticBySlug(slug);
  if (!t) notFound();

  const faq = [
    { q: `What does the ${t.short} test detect?`, a: `${t.detects}. ${t.whatItIs}` },
    { q: `Who should consider ${t.short} testing?`, a: t.whoFor },
    { q: `How does the ${t.short} test work?`, a: t.howItWorks },
    { q: `Do I need a doctor's order for ${t.short}?`, a: "Yes — genetic testing generally requires a provider's order or prescription, and it is subject to insurance or Medicare approval. Check with your provider." },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero" style={{ paddingBottom: 8 }}>
        <Link href="/genetic-testing" style={{ fontSize: 14, fontWeight: 600 }}>← All genetic tests</Link>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "14px 0 6px" }}>
          <span className="pill">{t.category}</span>
          <span className="ni">Mail-order kit</span>
        </div>
        <h1 className="big" style={{ marginTop: 6 }}>{t.name}</h1>
        <p className="lead"><b>Detects:</b> {t.detects}</p>
      </section>

      <section style={{ marginTop: 26 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 22, alignItems: "start" }} className="gtwrap">
          <div className="grid" style={{ gap: 16 }}>
            <div className="card"><h3>What it is</h3><p>{t.whatItIs}</p></div>
            <div className="card"><h3>Who it&rsquo;s for</h3><p>{t.whoFor}</p></div>
            <div className="card"><h3>How it works</h3><p>{t.howItWorks}</p></div>
            <div className="card" style={{ borderColor: "var(--violet3)", background: "linear-gradient(180deg,#faf7ff,#fff)" }}>
              <h3>The guidance</h3><p style={{ color: "var(--body)" }}>{t.guidance}</p>
            </div>
            <div className="note">
              <b>Important:</b> Genetic testing generally requires a provider&rsquo;s order or prescription and is
              <b> subject to insurance or Medicare approval — check with your provider.</b> Results are best reviewed with your provider or a genetic counselor.
            </div>
          </div>
          <div style={{ position: "sticky", top: 84 }}>
            <RequestTestForm testSlug={t.slug} testName={t.name} />
          </div>
        </div>
      </section>

      <section>
        <div className="kicker">Common questions</div>
        <h2 className="sec">{t.short} — questions &amp; answers</h2>
        <div className="grid" style={{ gap: 12 }}>
          {faq.map((f) => (<div className="card" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>))}
        </div>
      </section>
    </main>
  );
}
