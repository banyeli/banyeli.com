import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const allowedEmails = () => new Set((process.env.PRIVATE_ALLOWED_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));

export async function GET(request: Request) {
  const requestUrl = new URL(request.url); const code = requestUrl.searchParams.get("code"); const next = requestUrl.searchParams.get("next") === "/settings" ? "/settings" : "/dashboard"; const response = NextResponse.redirect(new URL(next, requestUrl.origin));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !code) return NextResponse.redirect(new URL("/login?error=missing_configuration", requestUrl.origin));
  const supabase = createServerClient(url, key, { cookies: { getAll: () => request.headers.get("cookie")?.split("; ").map((part) => { const [name, ...value] = part.split("="); return { name, value: value.join("=") }; }) || [], setAll: (cookies: Array<{ name: string; value: string; options?: Record<string, unknown> }>) => cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options as never)) } });
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user?.email || !allowedEmails().has(data.user.email.toLowerCase())) { await supabase.auth.signOut(); return NextResponse.redirect(new URL("/login?error=private_access_only", requestUrl.origin)); }
  return response;
}
