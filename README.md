# Banyeli OS
## Setup
1. Copy `.env.example` to `.env.local` and set Supabase and OpenAI keys.
2. Create a Supabase project and run `database/001_phase_one.sql` in its SQL editor.
3. In Supabase Auth, enable your preferred sign-in method and configure the Vercel URL.
4. Run `npm run dev`; validate with `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

`OPENAI_API_KEY` is server-only. The generator validates input and model JSON before returning it. Configure backups and keep exports outside the app.
