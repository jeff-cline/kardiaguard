import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Kardia Guard works — free heart-health guidance",
  description:
    "How Kardia Guard works: join free, get guideline-based reminders for the right heart screenings at the right time, and find facilities near you to book. We connect knowledge — we don't diagnose.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorks() {
  return (
    <main className="wrap">
      <section className="hero">
        <span className="eyebrow"><span className="beat" /> How it works</span>
        <h1 className="big">Knowledge, reminders, and a way to <span className="u">act</span></h1>
        <p className="lead">Kardia Guard is a free service. We don&rsquo;t diagnose or sell tests — we connect you to trustworthy knowledge, remind you what fits you and when, and help you find a facility to book.</p>
      </section>

      <section>
        <div className="grid g3">
          {[
            { n: "1", t: "Join free", d: "Create an account with your ZIP, age, and sex. No cost, no catch." },
            { n: "2", t: "Get your knowledge & reminders", d: "See which heart screenings fit you based on USPSTF, American Heart Association, and Medicare guidance — with reminders when each is due." },
            { n: "3", t: "Find & book", d: "We map facilities near you that offer each test and connect you to book. Some tests may need a provider referral depending on your insurance." },
          ].map((s) => (
            <div className="card" key={s.n}>
              <div className="pill" style={{ marginBottom: 10 }}>Step {s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="kicker">What we promise — and what we don&rsquo;t</div>
        <h2 className="sec">Straight talk</h2>
        <div className="grid g2">
          <div className="card"><h3>We do</h3><p>Connect you to knowledge from national guidelines, remind you when screenings are due, map facilities near you, and help you book. Keep resources and a movement routine in your free portal.</p></div>
          <div className="card"><h3>We don&rsquo;t</h3><p>Diagnose, interpret results, or promise outcomes. Some tests require a provider&rsquo;s order and are subject to insurance or Medicare approval — always check with your provider.</p></div>
        </div>
        <div style={{ marginTop: 22 }}>
          <Link className="btn primary" href="/signup">Join Kardia Guard — free</Link>
        </div>
      </section>
    </main>
  );
}
