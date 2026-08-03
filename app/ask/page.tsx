"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Message = { role: "you" | "banyeli"; text: string };

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([{ role: "banyeli", text: "I’m here. What do you need clarity on?" }]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [speaking, setSpeaking] = useState<number | null>(null);

  async function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || sending) return;
    setDraft(""); setSending(true); setMessages((current) => [...current, { role: "you", text: message }]);
    try {
      const response = await fetch("/api/ask", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Banyeli could not answer right now.");
      setMessages((current) => [...current, { role: "banyeli", text: result.reply }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "banyeli", text: error instanceof Error ? error.message : "Banyeli could not answer right now." }]);
    } finally { setSending(false); }
  }

  async function hearBanyeli(text: string, index: number) {
    if (speaking !== null) return;
    setSpeaking(index);
    try {
      const response = await fetch("/api/speech", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
      if (!response.ok) throw new Error("Banyeli's voice could not play right now.");
      const audioUrl = URL.createObjectURL(await response.blob());
      const audio = new Audio(audioUrl);
      audio.onended = () => { URL.revokeObjectURL(audioUrl); setSpeaking(null); };
      audio.onerror = () => { URL.revokeObjectURL(audioUrl); setSpeaking(null); };
      await audio.play();
    } catch {
      setSpeaking(null);
    }
  }

  return <main className="ask-page">
    <nav className="ask-nav"><Link href="/dashboard">banyeli</Link><span>Ask Banyeli</span><Link href="/vault">Vault</Link></nav>
    <section className="ask-stage">
      <aside className={`ask-presence ${speaking !== null ? "is-speaking" : ""}`}>
        <video autoPlay muted loop playsInline aria-label="Banyeli"><source src="/banyeli-chief-of-staff.mp4" type="video/mp4" /></video>
        <div className="ask-video-fade" />
        <div className="ask-presence-label"><span>{speaking !== null ? "speaking" : "private line"}</span><p>Banyeli<br />with you</p></div>
      </aside>
      <div className="ask-conversation"><header><p className="eyebrow">Private line</p><h1>Ask<br /><i>Banyeli.</i></h1><p className="voice-ready">Her voice is ready.</p></header><div className="ask-thread" aria-live="polite">{messages.map((message, index) => <article className={`ask-message ${message.role}`} key={index}><span>{message.role === "you" ? "You" : "Banyeli"}</span><p>{message.text}</p>{message.role === "banyeli" ? <button type="button" className="hear-banyeli" onClick={() => hearBanyeli(message.text, index)} disabled={speaking !== null}>{speaking === index ? "Speaking…" : "Hear Banyeli"}</button> : null}</article>)}{sending ? <p className="ask-listening">Listening…</p> : null}</div><form className="ask-form" onSubmit={ask}><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Say what is on your mind…" aria-label="Ask Banyeli" rows={2} /><button type="submit" disabled={sending || !draft.trim()} aria-label="Send message">↑</button></form></div>
    </section>
  </main>;
}
