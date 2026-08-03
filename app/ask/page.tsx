"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Message = { role: "you" | "banyeli"; text: string };

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([{ role: "banyeli", text: "I’m here. What do you need clarity on?" }]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

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

  return <main className="ask-page">
    <nav className="ask-nav"><Link href="/dashboard">banyeli</Link><span>Ask Banyeli</span><Link href="/vault">Vault</Link></nav>
    <section className="ask-stage"><header><p className="eyebrow">Private line</p><h1>Ask<br /><i>Banyeli.</i></h1><button type="button" className="voice-pending" disabled>Voice mode · soon</button></header><div className="ask-thread" aria-live="polite">{messages.map((message, index) => <article className={`ask-message ${message.role}`} key={index}><span>{message.role === "you" ? "You" : "Banyeli"}</span><p>{message.text}</p></article>)}{sending ? <p className="ask-listening">Listening…</p> : null}</div><form className="ask-form" onSubmit={ask}><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Say what is on your mind…" aria-label="Ask Banyeli" rows={2} /><button type="submit" disabled={sending || !draft.trim()} aria-label="Send message">↑</button></form></section>
  </main>;
}
