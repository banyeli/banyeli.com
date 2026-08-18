import Link from "next/link";
import "../real-estate.css";
import "../blue-galaxy.css";
export default function LeadsPage() { return <main className="real-estate-page"><nav className="re-nav"><Link href="/dashboard">Banyeli</Link><Link href="/real-estate">Real Estate</Link><a href="/real-estate/follow-ups">Follow-ups</a></nav><header className="re-header"><div><p className="eyebrow">Private CRM</p><h1>Your leads.</h1><p>No lead records yet.</p></div></header><section className="re-panel"><p className="eyebrow">Lead inbox</p><h2>Your first real lead will appear here.</h2><p className="re-brief">This space stays empty until you add a lead or connect an approved intake source.</p></section></main>; }
