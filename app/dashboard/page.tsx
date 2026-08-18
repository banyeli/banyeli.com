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
        <Link href="/vault" aria-label="Private vault">◇</Link>
      </nav>

      <header className="banyeli-dashboard-header">
        <Link href="/settings" className="banyeli-settings-link">settings</Link>
      </header>

      <section className="banyeli-arrival">
        <article className="banyeli-presence">
          <video className="banyeli-chief-video" autoPlay muted loop playsInline aria-label="Banyeli">
            <source src="/banyeli-chief-of-staff.mp4" type="video/mp4" />
          </video>
          <div className="banyeli-video-fade" />
        </article>

        <div className="banyeli-space">
          <p className="banyeli-prompt">What is on your mind?</p>
          <div className="banyeli-choices">
            <Link href="/ask">Ask Banyeli <span>↗</span></Link>
            <Link href="/content-engine/viral-content">Create everywhere <span>↗</span></Link>
            <Link href="/viral-hooks">Find the hook <span>↗</span></Link>
            <Link href="/vault">Open the vault <span>↗</span></Link>
            <a href="/real-estate">Real Estate</a>
          </div>
        </div>
      </section>
    </main>
  );
}
