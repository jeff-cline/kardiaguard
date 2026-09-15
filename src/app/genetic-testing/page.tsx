import type { Metadata } from "next";
import Link from "next/link";
import { GENETIC_TESTS } from "@/lib/genetic";

export const metadata: Metadata = {
  title: "Genetic testing for heart & inherited risk — how it works",
  description:
    "Know your inherited risk. Kardia Guard connects you to genetic testing for inherited cardiovascular disease, familial hypercholesterolemia, pharmacogenomics, and hereditary cancer — most by mail-order swab kit. Requires a provider's order; subject to insurance or Medicare approval.",
  alternates: { canonical: "/genetic-testing" },
};

const CATEGORIES = ["Cardiac", "Lipids", "Pharmacogenomics", "Hereditary Cancer"] as const;

export default function GeneticHub() {
  return (
    <main className="wrap">
      <section className="hero">
        <span className="eyebrow"><span className="beat" /> Genetic testing</span>
        <h1 className="big">Know what&rsquo;s written in <span className="u">your genes</span>.</h1>
        <p className="lead">
          Some heart risk is inherited — and knowledge is power. Kardia Guard connects you to genetic
          testing for inherited heart disease, cholesterol, medication response, and hereditary cancer.
          Most are <b>mail-order</b>: a swab kit comes to your door, you send it back.
        </p>
        <p className="disc" style={{ marginTop: 16 }}>
          Genetic testing generally requires a provider&rsquo;s order or prescription and is <b>subject to
          insurance or Medicare approval — check with your provider.</b> We connect you to labs and knowledge;
          we don&rsquo;t diagnose or interpret results.
        </p>
      </section>

      {CATEGORIES.map((cat) => {
        const tests = GENETIC_TESTS.filter((t) => t.category === cat);
        if (!tests.length) return null;
        return (
          <section key={cat}>
            <div className="kicker">{cat}</div>
            <div className="tlist">
              {tests.map((t) => (
                <Link className="trow" href={`/genetic-testing/${t.slug}`} key={t.slug}>
                  <div className="tn">
                    <div className="nm">{t.name}</div>
                    <div className="dt">{t.detects}</div>
                  </div>
                  <span className="ni">Mail-order</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section>
        <div className="kicker">How it works</div>
        <h2 className="sec">From question to answer — mostly by mail</h2>
        <div className="grid g3">
          {[
            { n: "1", t: "Request the test", d: "Tell us your ZIP and we match you to a lab that serves your state — nationwide or state-by-state." },
            { n: "2", t: "Swab at home", d: "The lab mails a simple cheek-swab or saliva kit to your door. You collect the sample and mail it back, prepaid." },
            { n: "3", t: "Results to your provider", d: "Results go to the ordering provider, who guides what they mean and any next steps — including testing relatives." },
          ].map((s) => (
            <div className="card" key={s.n}>
              <div className="pill" style={{ marginBottom: 10 }}>Step {s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn primary" href="/signup">Join free to request a test</Link>
          <Link className="btn ghost" href="/tests">See heart screening tests →</Link>
        </div>
      </section>
    </main>
  );
}
