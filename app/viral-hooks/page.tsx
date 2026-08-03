"use client";

import { useState } from "react";
import { BRAND_VOICES } from "@/lib/brand-voices";
import { platformValues, type HookResponse } from "@/lib/ai/schema";

export default function ViralHooks() {
  const [source, setSource] = useState("");
  const [voice, setVoice] = useState<keyof typeof BRAND_VOICES>("banyeli");
  const [platforms, setPlatforms] = useState<string[]>(["TikTok"]);
  const [data, setData] = useState<HookResponse>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/viral-hooks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ source, voice, objective: "Connection", audience: "People seeking honest reflection", emotions: ["recognition"], platforms, hookCount: 3, intensity: "grounded", cta: "Share your reflection" }),
    });
    const json = await response.json();
    setLoading(false);
    if (!response.ok) setError(json.error || "Generation failed.");
    else setData(json);
  }

  return <main className="shell page">
    <nav className="nav"><b className="brand">Banyeli</b><a href="/dashboard">Dashboard</a><a href="/vault">Vault</a><a href="/library">Library</a></nav>
    <p className="eyebrow">Phase 1 · Viral hooks</p>
    <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(42px,7vw,76px)" }}>Make room for the <i>truth.</i></h1>
    <form className="grid card" onSubmit={generate}>
      <label>Source material<textarea className="field" rows={10} value={source} onChange={(event) => setSource(event.target.value)} placeholder="Paste the original story, reflection, or idea…" required /></label>
      <label>Brand voice<select className="field" value={voice} onChange={(event) => setVoice(event.target.value as keyof typeof BRAND_VOICES)}>{Object.entries(BRAND_VOICES).map(([key, value]) => <option key={key} value={key}>{value.name}</option>)}</select></label>
      <fieldset><legend>Platforms</legend>{platformValues.map((platform) => <label key={platform} style={{ display: "inline-block", margin: "8px 12px 0 0" }}><input type="checkbox" checked={platforms.includes(platform)} onChange={() => setPlatforms((current) => current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform])} />{platform}</label>)}</fieldset>
      <button className="btn" disabled={loading}>{loading ? "Listening…" : "Generate hooks"}</button>
      {error && <p role="alert">{error}</p>}
    </form>
    {data?.platforms.map((group) => <section className="card" style={{ marginTop: 18 }} key={group.platform}><h2>{group.platform}</h2>{group.hooks.map((hook, index) => <article className="hook" key={index}><strong contentEditable suppressContentEditableWarning>{hook.hook}</strong><p className="muted">{hook.formula} · {hook.emotionalIntention}</p><small>{hook.brandSafetyNote}</small></article>)}</section>)}
  </main>;
}
