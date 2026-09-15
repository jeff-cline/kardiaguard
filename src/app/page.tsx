import Link from "next/link";
import { TESTS, stars } from "@/lib/tests";

export default function Home() {
  const featured = TESTS.filter((t) => t.screeningFit >= 4).slice(0, 6);
  return (
    <main className="wrap">
      <section className="hero">
        <span className="eyebrow"><span className="beat" /> Free heart-health companion</span>
        <h1 className="big">
          <span className="u">Knowledge is power.</span>
          <br />Especially about your heart.
        </h1>
        <p className="lead">
          Kardia Guard connects you to heart-screening facilities and providers near you, reminds you
          what to check and <b>when</b> based on national guidelines, and gives you the knowledge to make
          the right decisions. <b>Free to join.</b>
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
          <Link className="btn primary" href="/signup">Join free — get your reminders</Link>
          <Link className="btn ghost" href="/tests">Explore heart tests</Link>
        </div>
        <p className="disc" style={{ marginTop: 16 }}>
          We connect knowledge and help you book — we don&rsquo;t diagnose. Depending on your insurance,
          some tests may require a provider&rsquo;s recommendation, and screenings are subject to insurance
          or Medicare approval.
        </p>
      </section>

      <section>
        <div className="kicker">What you get</div>
        <h2 className="sec">Everything in one place — at no cost</h2>
        <div className="grid g4">
          {[
            { t: "Find screening near you", d: "See facilities and providers that offer the heart tests you need, mapped to your zip code." },
            { t: "Guideline-based reminders", d: "Know what to check and when — based on your age and sex and national USPSTF / AHA / Medicare guidance." },
            { t: "Heart-healthy resources", d: "A library to keep your heart strong, in the member back office when you join." },
            { t: "Movement is medicine", d: "A 3-day-a-week movement routine to keep you going — because staying active is prevention." },
          ].map((c) => (
            <div className="card" key={c.t}>
              <div className="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2">
                  <path d="M20.8 6.6a5 5 0 0 0-8.8-1.9A5 5 0 0 0 3.2 9c0 5 8.8 10 8.8 10s8.8-5 8.8-10a5 5 0 0 0-.2-2.4z" />
                </svg>
              </div>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="kicker">The knowledge</div>
        <h2 className="sec">The most useful heart screening tests</h2>
        <p className="sub">What each one detects and how well it fits routine screening. Tap any test for the full picture — when it&rsquo;s offered, why, and when it&rsquo;s routine.</p>
        <div className="tlist" style={{ marginTop: 18 }}>
          {featured.map((t) => (
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
        <div style={{ marginTop: 18 }}>
          <Link className="btn ghost" href="/tests">See all {TESTS.length} heart tests →</Link>
        </div>
      </section>

      <section>
        <div className="kicker">How it works</div>
        <h2 className="sec">Three steps to a heart plan that&rsquo;s yours</h2>
        <div className="grid g3">
          {[
            { n: "1", t: "Create your free account", d: "Tell us your zip, age, and sex. It takes a minute and costs nothing." },
            { n: "2", t: "Get your knowledge + reminders", d: "See which screenings fit you and when, based on national guidelines, with reminders so nothing slips." },
            { n: "3", t: "Find a facility and book", d: "We map the facilities near you that do each test and connect you to book. Some tests may need a provider referral." },
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
        <div className="card" style={{ textAlign: "center", background: "linear-gradient(160deg,#faf7ff,#fff)", borderColor: "var(--violet3)" }}>
          <div className="kicker">Knowledge is power</div>
          <h2 className="sec" style={{ margin: "6px 0 10px" }}>Take the guesswork out of your heart health</h2>
          <p className="sub" style={{ margin: "0 auto 20px" }}>Join free, get your personalized reminders, and find the screening that&rsquo;s right for you.</p>
          <Link className="btn primary" href="/signup">Join Kardia Guard — free</Link>
        </div>
      </section>
    </main>
  );
}
