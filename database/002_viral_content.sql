alter table public.campaigns add column if not exists metadata jsonb not null default '{}';
alter table public.source_materials add column if not exists source_version integer not null default 1;

create table if not exists public.generation_runs(
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  campaign_id uuid references public.campaigns on delete set null,
  source_id uuid references public.source_materials on delete set null,
  request_settings jsonb not null default '{}', response_summary jsonb not null default '{}',
  model text, prompt_version text not null, status text not null default 'running', error_message text,
  created_at timestamptz not null default now(), completed_at timestamptz
);
create table if not exists public.content_variants(
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users not null,
  generated_content_id uuid references public.generated_content on delete cascade not null,
  parent_variant_id uuid references public.content_variants on delete set null,
  generated_text text not null, transformation text, metadata jsonb not null default '{}',
  created_at timestamptz not null default now(), deleted_at timestamptz
);
alter table public.generation_runs enable row level security;
alter table public.content_variants enable row level security;
create policy "own generation runs" on public.generation_runs for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "own content variants" on public.content_variants for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
