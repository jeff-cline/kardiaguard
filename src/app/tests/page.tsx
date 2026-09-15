import type { Metadata } from "next";
import Link from "next/link";
import { TESTS, stars } from "@/lib/tests";

export const metadata: Metadata = {
  title: "Heart screening tests — what they detect & when to get them",
  description:
    "A plain-language guide to the most useful heart screening tests — coronary calcium (CAC), lipid panel, blood pressure, A1C, Lp(a), ApoB, AAA ultrasound and more — what each detects, whether it's noninvasive, and how it fits routine screening.",
  alternates: { canonical: "/tests" },
};

export default function TestsPage() {
  return (
    <main className="wrap">
      <section className="hero" style={{ paddingBottom: 8 }}>
        <span className="eyebrow"><span className="beat" /> The knowledge</span>
        <h1 className="big">Heart screening tests, <span className="u">made clear</span>.</h1>
        <p className="lead">
          What each test detects, whether it&rsquo;s noninvasive, and how well it fits routine screening.
          Tap any test to learn when it&rsquo;s offered, why, and when it&rsquo;s routine — with the national
          guidance behind it.
        </p>
      </section>

      <section style={{ marginTop: 28 }}>
        <div className="tlist">
          {TESTS.map((t) => (
            <Link className="trow" href={`/tests/${t.slug}`} key={t.slug}>
              <div className="tn">
                <div className="nm">{t.name}</div>
                <div className="dt">{t.detects}</div>
              </div>
              <span className="ni">{t.noninvasive}</span>
              <span className="stars" title={`Screening fit ${t.screeningFit}/5`}>{stars(t.screeningFit)}</span>
            </Link>
          ))}
        </div>
        <p className="disc" style={{ marginTop: 20 }}>
          &ldquo;Screening fit&rdquo; reflects how commonly a test is used for routine screening of the general
          population — not how important it is for you specifically. Your provider decides what&rsquo;s right for
          you. Educational information based on USPSTF, American Heart Association, and Medicare guidance;
          not medical advice. Screenings are subject to insurance or Medicare approval.
        </p>
        <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn primary" href="/signup">Join free to get reminders for these</Link>
          <Link className="btn ghost" href="/find">Find these tests near you →</Link>
        </div>
      </section>
    </main>
  );
}
