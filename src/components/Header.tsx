import Link from "next/link";
import { getSession, roleHome } from "@/lib/auth";

export default async function Header() {
  const s = await getSession();
  return (
    <header className="site-head">
      <div className="wrap bar">
        <Link className="brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="Kardia Guard" />
        </Link>
        <nav className="nav">
          <Link href="/tests">Heart tests</Link>
          <Link href="/genetic-testing">Genetic testing</Link>
          <Link href="/find">Find screening</Link>
          {s ? (
            <Link className="cta" href={roleHome(s.role)}>My portal</Link>
          ) : (
            <>
              <Link className="ghost" href="/login">Log in</Link>
              <Link className="cta" href="/signup">Join free</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
