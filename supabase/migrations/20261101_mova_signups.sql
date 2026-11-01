-- MOVA waitlist sign-ups (passengers and drivers). Visitors can only insert.
create table if not exists public.mova_signups (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('passenger','driver')),
  first_name text check (char_length(first_name) <= 80),
  email text not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (char_length(phone) <= 30),
  commune text check (char_length(commune) <= 80),
  details text check (char_length(details) <= 200),
  has_vtc_card boolean,
  consent boolean not null check (consent = true)
);
alter table public.mova_signups enable row level security;
revoke all on public.mova_signups from anon, authenticated;
grant insert on public.mova_signups to anon, authenticated;
