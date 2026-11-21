-- Contatti raccolti dal modulo della landing page.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text,
  phone text,
  zone text,
  need text not null,
  package_id text,
  valuation jsonb,
  privacy_consent boolean not null check (privacy_consent),
  marketing_consent boolean not null default false,
  source_page text
);

-- Nessun accesso pubblico: il server scrive con la service role key.
alter table public.leads enable row level security;
