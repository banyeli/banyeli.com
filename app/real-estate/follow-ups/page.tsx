import Link from "next/link";
import "../real-estate.css";
import "../blue-galaxy.css";
export default function FollowUpsPage() { return <main className="real-estate-page"><nav className="re-nav"><Link href="/dashboard">Banyeli</Link><Link href="/real-estate">Real Estate</Link><a href="/real-estate/leads">Leads</a></nav><header className="re-header"><div><p className="eyebrow">Private CRM</p><h1>Follow-ups.</h1><p>No follow-ups due.</p></div></header><section className="re-panel"><p className="eyebrow">Your queue</p><h2>Nothing waiting for you.</h2><p className="re-brief">Follow-ups will appear only after a real lead is added.</p></section></main>; }
