"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type VaultEntry = {
  id: string;
  title: string | null;
  original_text: string;
  voice_key: string | null;
  tags: string[] | null;
  source_type: string | null;
  created_at: string;
};

export default function Vault() {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [title, setTitle] = useState("");
  const [writing, setWriting] = useState("");
  const [voice, setVoice] = useState("reyna");
  const [tags, setTags] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Loading your private Vault…");
  const [saving, setSaving] = useState(false);

  async function loadEntries() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("source_materials").select("id,title,original_text,voice_key,tags,source_type,created_at").is("deleted_at", null).order("created_at", { ascending: false });
      if (error) throw error;
      setEntries((data || []) as VaultEntry[]);
      setStatus(data?.length ? "Your writing is held here privately." : "Your Vault is ready for its first memory.");
    } catch {
      setStatus("Your Vault is not connected yet. Check your Supabase setup, then refresh.");
    }
  }

  useEffect(() => { void loadEntries(); }, []);

  async function addWriting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!writing.trim()) return;
    setSaving(true);
    setStatus("Saving privately…");
    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Please sign in again.");
      const parsedTags = tags.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean);
      const { error } = await supabase.from("source_materials").insert({
        user_id: user.id,
        title: title.trim() || "Untitled memory",
        original_text: writing.trim(),
        source_type: "writing",
        voice_key: voice,
        tags: parsedTags,
        sensitivity_level: "private",
      });
      if (error) throw error;
      setTitle(""); setWriting(""); setTags("");
      setStatus("Saved to your private Vault.");
      await loadEntries();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "I could not save that yet.");
    } finally { setSaving(false); }
  }

  function importTextFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setWriting(String(reader.result || ""));
      if (!title.trim()) setTitle(file.name.replace(/\.txt$/i, ""));
      setStatus("Your file is ready. Review it, choose its voice, then save it privately.");
    };
    reader.readAsText(file);
  }

  const visibleEntries = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((entry) => [entry.title, entry.original_text, entry.voice_key, ...(entry.tags || [])].join(" ").toLowerCase().includes(needle));
  }, [entries, query]);

  return <main className="vault-page">
    <nav className="vault-nav"><Link href="/dashboard">Banyeli</Link><span>Your private Vault</span><Link href="/dashboard">Dashboard</Link></nav>
    <section className="vault-intro"><p className="eyebrow">Private source memory</p><h1>Keep what<br /><i>matters.</i></h1><p>Writing stays yours. Banyeli only uses what you choose to bring into a creation.</p></section>
    <section className="vault-layout">
      <form className="vault-compose" onSubmit={addWriting}>
        <div className="vault-compose-heading"><h2>Add a memory</h2><label className="vault-import">Import a .txt file<input type="file" accept="text/plain,.txt" onChange={importTextFile} /></label></div>
        <label>Title<input className="field" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A name you will recognize" /></label>
        <div className="vault-row"><label>Voice<select className="field" value={voice} onChange={(event) => setVoice(event.target.value)}><option value="reyna">REYNA · the past</option><option value="nocturna">Nocturna · the present</option><option value="banyeli">Banyeli</option></select></label><label>Tags<input className="field" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="faith, healing" /></label></div>
        <label>Writing<textarea className="field vault-writing" value={writing} onChange={(event) => setWriting(event.target.value)} placeholder="Paste a memory, reflection, prayer, lyric, or story…" required /></label>
        <button className="btn" disabled={saving}>{saving ? "Saving…" : "Keep this privately"}</button>
        <p className="vault-status" aria-live="polite">{status}</p>
      </form>
      <section className="vault-library"><div className="vault-library-heading"><h2>Your memories</h2><input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your Vault" /></div>{visibleEntries.map((entry) => <article className="vault-entry" key={entry.id}><div><p className="eyebrow">{entry.voice_key === "reyna" ? "REYNA · past" : entry.voice_key === "nocturna" ? "Nocturna · present" : entry.voice_key || "memory"}</p><h3>{entry.title || "Untitled memory"}</h3></div><p>{entry.original_text.slice(0, 220)}{entry.original_text.length > 220 ? "…" : ""}</p>{entry.tags?.length ? <small>{entry.tags.map((tag) => `#${tag}`).join("  ")}</small> : null}</article>)}{!visibleEntries.length && status.includes("ready") ? <p className="muted">Nothing saved yet. Your first memory can begin here.</p> : null}</section>
    </section>
  </main>;
}
