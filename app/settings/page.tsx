"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Settings() {
  const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  async function updatePassword(event: FormEvent) {
    event.preventDefault(); setError(""); setMessage("");
    if (password !== confirm) { setError("The two passwords do not match."); return; }
    const { error: updateError } = await createClient().auth.updateUser({ password });
    if (updateError) setError(updateError.message); else { setPassword(""); setConfirm(""); setMessage("Your backup password has been saved."); }
  }
  return <main className="shell page login-page"><section className="card login-card"><p className="eyebrow">Private settings</p><h1>Backup password</h1><p className="muted">This is optional. Your email link remains available, while a password gives you another way in.</p><form className="grid" onSubmit={updatePassword}><label>New password<input className="field" type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} minLength={8} required /></label><label>Confirm password<input className="field" type="password" autoComplete="new-password" value={confirm} onChange={event => setConfirm(event.target.value)} minLength={8} required /></label><button className="btn">Save backup password</button></form>{message && <p className="save-note" role="status">{message}</p>}{error && <p className="error" role="alert">{error}</p>}</section></main>;
}
