-- MOVA Ops console v1: run once in Supabase → SQL Editor → Run
create table if not exists public.mova_staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','support')),
  created_at timestamptz not null default now()
);
alter table public.mova_staff enable row level security;
drop policy if exists "Staff can see their own staff row" on public.mova_staff;
create policy "Staff can see their own staff row" on public.mova_staff
  for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.mova_staff from anon;
grant select on public.mova_staff to authenticated;

alter table public.mova_signups
  add column if not exists status text not null default 'new'
    check (status in ('new','contacted','interview','committed','declined')),
  add column if not exists notes text check (char_length(notes) <= 2000),
  add column if not exists updated_at timestamptz not null default now();

drop policy if exists "Visitors can sign up" on public.mova_signups;
create policy "Visitors can sign up" on public.mova_signups
  for insert to anon, authenticated
  with check (consent = true and status = 'new' and notes is null);

drop policy if exists "Staff can read sign-ups" on public.mova_signups;
create policy "Staff can read sign-ups" on public.mova_signups
  for select to authenticated
  using ((select auth.jwt() ->> 'aal') = 'aal2'
         and exists (select 1 from public.mova_staff s where s.user_id = (select auth.uid())));

drop policy if exists "Staff can update sign-ups" on public.mova_signups;
create policy "Staff can update sign-ups" on public.mova_signups
  for update to authenticated
  using ((select auth.jwt() ->> 'aal') = 'aal2'
         and exists (select 1 from public.mova_staff s where s.user_id = (select auth.uid())))
  with check ((select auth.jwt() ->> 'aal') = 'aal2'
         and exists (select 1 from public.mova_staff s where s.user_id = (select auth.uid())));

grant select on public.mova_signups to authenticated;
grant update (status, notes, updated_at) on public.mova_signups to authenticated;
