import Link from "next/link";

export default function ContentEngine() {
  return <main className="shell page"><nav className="nav"><b className="brand">Banyeli</b><Link href="/dashboard">Dashboard</Link><Link href="/viral-hooks">Viral Hooks</Link><Link href="/content-engine/viral-content">Viral Content</Link><Link href="/vault">Vault</Link></nav><p className="eyebrow">Content engine</p><h1>One true story.<br /><i>Many places to carry it.</i></h1><p className="muted">Create a full, platform-specific campaign without flattening what made the story matter.</p><Link className="btn" href="/content-engine/viral-content">Create Viral Content</Link></main>;
}
