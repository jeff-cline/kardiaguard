import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap in">
        <div style={{ maxWidth: 320 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="Kardia Guard" />
          <p className="disc" style={{ marginTop: 12 }}>
            Knowledge is power. Kardia Guard is a free service that connects you to heart-screening
            facilities and providers and helps you book — we don&rsquo;t diagnose or sell you a test.
          </p>
        </div>
        <div className="cols">
          <div>
            <h6>Learn</h6>
            <Link href="/tests">Heart tests</Link>
            <Link href="/genetic-testing">Genetic testing</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/find">Find screening near you</Link>
          </div>
          <div>
            <h6>Account</h6>
            <Link href="/signup">Join free</Link>
            <Link href="/login">Log in</Link>
          </div>
        </div>
      </div>
      <div className="wrap">
        <p className="fine">
          © {new Date().getFullYear()} Kardia Guard · Knowledge is Power. Educational information only,
          based on public guidance from the USPSTF, American Heart Association, and Medicare. Not medical
          advice and not a diagnosis. Screenings are subject to insurance or Medicare approval and some
          require a provider&rsquo;s order — always check with your provider.
        </p>
      </div>
    </footer>
  );
}
