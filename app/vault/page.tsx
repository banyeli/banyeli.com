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

type PrivateVoice = { id: string; key: string; name: string; role_note: string };

const foundationVoices = [
  { key: "reyna", name: "REYNA · the past" },
  { key: "nocturna", name: "Nocturna · the present" },
  { key: "banyeli", name: "Banyeli" },
];

function MemoryPreview({ entry, identity = false }: { entry: VaultEntry; identity?: boolean }) {
  const label = entry.voice_key === "reyna" ? "REYNA · the past" : entry.voice_key === "nocturna" ? "Nocturna · the present" : entry.voice_key || "memory";
  return <article className={`vault-entry ${identity ? `vault-identity ${entry.voice_key}` : ""}`} key={entry.id}>
    <div><p className="eyebrow">{label}</p><h3>{entry.title || "Untitled memory"}</h3></div>
    <p>{entry.original_text.slice(0, 220)}{entry.original_text.length > 220 ? "…" : ""}</p>
    {!identity && entry.tags?.length ? <small>{entry.tags.map((tag) => `#${tag}`).join("  ")}</small> : null}
  </article>;
}

export default function Vault() {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [privateVoices, setPrivateVoices] = useState<PrivateVoice[]>([]);
  const [title, setTitle] = useState("");
  const [writing, setWriting] = useState("");
  const [voice, setVoice] = useState("reyna");
  const [tags, setTags] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Loading your private Vault…");
  const [saving, setSaving] = useState(false);
  const [addingVoice, setAddingVoice] = useState(false);
  const [voiceName, setVoiceName] = useState("");
  const [voiceRole, setVoiceRole] = useState("");

  async function loadEntries() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("source_materials").select("id,title,original_text,voice_key,tags,source_type,created_at").is("deleted_at", null).order("created_at", { ascending: false });
      if (error) throw error;
      setEntries((data || []) as VaultEntry[]);
      const { data: voices, error: voicesError } = await supabase.from("private_voices").select("id,key,name,role_note").eq("active", true).order("created_at");
      if (voicesError) throw voicesError;
      setPrivateVoices((voices || []) as PrivateVoice[]);
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
      const { error } = await supabase.from("source_materials").insert({ user_id: user.id, title: title.trim() || "Untitled memory", original_text: writing.trim(), source_type: "writing", voice_key: voice, tags: parsedTags, sensitivity_level: "private" });
      if (error) throw error;
      setTitle(""); setWriting(""); setTags("");
      setStatus("Saved to your private Vault.");
      await loadEntries();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "I could not save that yet.");
    } finally { setSaving(false); }
  }

  async function addVoice() {
    const name = voiceName.trim();
    if (!name) return;
    setStatus("Adding your voice privately…");
    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Please sign in again.");
      const key = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const { data, error } = await supabase.from("private_voices").insert({ user_id: user.id, key, name, role_note: voiceRole.trim() }).select("id,key,name,role_note").single();
      if (error) throw error;
      setPrivateVoices((current) => [...current, data as PrivateVoice]);
      setVoice((data as PrivateVoice).key);
      setVoiceName(""); setVoiceRole(""); setAddingVoice(false);
      setStatus(`${name} is ready to hold memories.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "I could not add that voice yet.");
    }
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
  const memoryBaseEntries = visibleEntries.filter((entry) => entry.voice_key === "reyna" || entry.voice_key === "nocturna").sort((a, b) => a.voice_key === "reyna" ? -1 : b.voice_key === "reyna" ? 1 : 0);
  const otherEntries = visibleEntries.filter((entry) => entry.voice_key !== "reyna" && entry.voice_key !== "nocturna");

  return <main className="vault-page">
    <nav className="vault-nav"><Link href="/dashboard">Banyeli</Link><span>Your private Vault</span><Link href="/dashboard">Dashboard</Link></nav>
    <section className="vault-intro"><p className="eyebrow">Private source memory</p><h1>Keep what<br /><i>matters.</i></h1></section>
    <section className="vault-layout">
      <form className="vault-compose" onSubmit={addWriting}>
        <div className="vault-compose-heading"><h2>Add a memory</h2><div className="vault-compose-actions"><button type="button" className="vault-add-voice" onClick={() => setAddingVoice((current) => !current)}>Add a voice</button><label className="vault-import">Import a .txt file<input type="file" accept="text/plain,.txt" onChange={importTextFile} /></label></div></div>
        {addingVoice ? <div className="vault-new-voice"><label>Voice name<input className="field" value={voiceName} onChange={(event) => setVoiceName(event.target.value)} placeholder="A name for this voice" required /></label><label>Her role<input className="field" value={voiceRole} onChange={(event) => setVoiceRole(event.target.value)} placeholder="How she holds or speaks from memory" /></label><button type="button" className="secondary" onClick={() => void addVoice()}>Keep this voice</button></div> : null}
        <label>Title<input className="field" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A name you will recognize" /></label>
        <div className="vault-row"><label>Voice<select className="field" value={voice} onChange={(event) => setVoice(event.target.value)}>{foundationVoices.map((item) => <option value={item.key} key={item.key}>{item.name}</option>)}{privateVoices.map((item) => <option value={item.key} key={item.id}>{item.name}{item.role_note ? ` · ${item.role_note}` : ""}</option>)}</select></label><label>Tags<input className="field" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="faith, healing" /></label></div>
        <label>Writing<textarea className="field vault-writing" value={writing} onChange={(event) => setWriting(event.target.value)} placeholder="Paste a memory, reflection, prayer, lyric, or story…" required /></label>
        <button className="btn" disabled={saving}>{saving ? "Saving…" : "Keep this privately"}</button>
        <p className="vault-status" aria-live="polite">{status}</p>
      </form>
      <section className="vault-library">
        <div className="vault-library-heading"><h2>Your memories</h2><input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your Vault" /></div>
        {memoryBaseEntries.length ? <section className="vault-memory-base"><header><p className="eyebrow">One Memory Base</p><h3>REYNA <i>&</i> Nocturna</h3><p>One lived story, held through the past and the present.</p></header><div className="vault-identity-lanes">{memoryBaseEntries.map((entry) => <MemoryPreview entry={entry} identity key={entry.id} />)}</div></section> : null}
        {otherEntries.map((entry) => <MemoryPreview entry={entry} key={entry.id} />)}
        {!visibleEntries.length && status.includes("ready") ? <p className="muted">Nothing saved yet. Your first memory can begin here.</p> : null}
      </section>
    </section>
  </main>;
}
