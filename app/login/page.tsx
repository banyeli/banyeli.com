"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function signIn(event: FormEvent) {
    event.preventDefault(); setMessage(""); setError("");
    try {
      const { error: signInError } = await createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
      if (signInError) throw signInError;
      setMessage("Check your email for your private Banyeli sign-in link.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Banyeli could not send the sign-in link."); }
  }
  return <main className="shell page login-page"><section className="card login-card"><p className="eyebrow">Private access</p><h1>Welcome back.</h1><p className="muted">Banyeli is a private studio. Enter an approved email and we’ll send a one-time sign-in link.</p><form className="grid" onSubmit={signIn}><label>Email address<input className="field" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required /></label><button className="btn">Send private sign-in link</button></form>{message && <p className="save-note" role="status">{message}</p>}{error && <p className="error" role="alert">{error}</p>}</section></main>;
}
