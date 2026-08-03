create table if not exists public.private_voices(
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  key text not null,
  name text not null,
  role_note text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(user_id, key)
);

alter table public.private_voices enable row level security;

create policy "owners manage private voices" on public.private_voices
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
