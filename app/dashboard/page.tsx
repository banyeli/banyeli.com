import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="banyeli-world">
      <div className="banyeli-cosmos" aria-hidden="true">
        <i className="banyeli-star banyeli-star-one" />
        <i className="banyeli-star banyeli-star-two" />
        <i className="banyeli-star banyeli-star-three" />
        <i className="banyeli-star banyeli-star-four" />
        <i className="banyeli-mist banyeli-mist-pink" />
        <i className="banyeli-mist banyeli-mist-teal" />
      </div>

      <nav className="banyeli-rail" aria-label="Banyeli">
        <Link className="banyeli-mark" href="/dashboard" aria-label="Banyeli dashboard">b</Link>
        <span />
        <Link href="/vault" aria-label="Private vault">◇</Link>
      </nav>

      <header className="banyeli-dashboard-header">
        <span className="banyeli-private-line"><i /> private line</span>
        <Link href="/settings" className="banyeli-settings-link">settings</Link>
      </header>

      <section className="banyeli-arrival">
        <article className="banyeli-presence">
          <video className="banyeli-chief-video" autoPlay muted loop playsInline aria-label="Banyeli">
            <source src="/banyeli-chief-of-staff.mp4" type="video/mp4" />
          </video>
          <div className="banyeli-video-fade" />
          <div className="banyeli-presence-label"><span>01</span><p>Banyeli<br />with you</p></div>
        </article>

        <div className="banyeli-space">
          <p className="banyeli-whisper">You made it.</p>
          <h1>Begin<br /><em>anywhere.</em></h1>
          <p className="banyeli-prompt">What is on your mind?</p>
          <div className="banyeli-choices">
            <Link href="/viral-hooks">Find the hook <span>↗</span></Link>
            <Link href="/vault">Open the vault <span>↗</span></Link>
          </div>
          <p className="banyeli-corner-note">Just for you.</p>
        </div>
      </section>
    </main>
  );
}
