-- Il numero di telefono viene verificato con un codice SMS prima di mostrare la valutazione.
alter table public.leads add column if not exists phone_verified boolean not null default false;
