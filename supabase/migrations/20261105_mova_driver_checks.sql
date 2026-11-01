-- MOVA driver verification.
-- 1. A required driver photo, kept in a private storage bucket. The driver uploads it from the app;
--    staff compare it with the ID shown in person; the passenger sees it once a ride is accepted.
-- 2. A staff-only checklist per driver: what was checked, card numbers and expiry dates.
--    No ID or insurance document is ever stored, only the result of the check.
-- 3. A driver cannot be approved or go online until the checklist is complete and nothing has expired.

-- Photo -----------------------------------------------------------------------------------------
alter table public.mova_drivers
  add column if not exists photo_path text,
  add column if not exists photo_updated_at timestamptz;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mova-driver-photos', 'mova-driver-photos', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Files live in "<driver id>/<name>". A driver can add files to their own folder but never replace
-- or delete one, so an approved photo cannot be swapped silently: a new photo means a new file,
-- registered through mova_set_driver_photo, which sends the driver back to verification.
drop policy if exists "MOVA photos: driver uploads own" on storage.objects;
create policy "MOVA photos: driver uploads own" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'mova-driver-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (select 1 from public.mova_drivers d where d.user_id = (select auth.uid()))
  );

drop policy if exists "MOVA photos: driver, staff, passenger on ride" on storage.objects;
create policy "MOVA photos: driver, staff, passenger on ride" on storage.objects for select to authenticated
  using (
    bucket_id = 'mova-driver-photos'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or (select public.mova_is_staff())
      or exists (
        select 1 from public.mova_rides r
        where r.passenger_id = (select auth.uid())
          and r.driver_id::text = (storage.foldername(name))[1]
          and r.status in ('accepted','arriving','in_progress')
      )
    )
  );

drop policy if exists "MOVA photos: staff delete" on storage.objects;
create policy "MOVA photos: staff delete" on storage.objects for delete to authenticated
  using (bucket_id = 'mova-driver-photos' and (select public.mova_is_staff()));

create or replace function public.mova_set_driver_photo(p_path text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not exists (select 1 from public.mova_drivers where user_id = (select auth.uid())) then
    raise exception 'not_a_driver';
  end if;
  if p_path is null or split_part(p_path, '/', 1) <> (select auth.uid())::text
     or p_path !~ '^[0-9a-f-]{36}/[A-Za-z0-9_.-]{1,80}$'
     or not exists (select 1 from storage.objects o where o.bucket_id = 'mova-driver-photos' and o.name = p_path) then
    raise exception 'bad_photo';
  end if;
  if exists (
    select 1 from public.mova_rides r where r.driver_id = (select auth.uid()) and r.status in ('accepted','arriving','in_progress')
  ) then raise exception 'ride_in_progress'; end if;
  -- A new face has to be checked again: photo check reset, approval removed.
  update public.mova_driver_checks set photo_checked = false, updated_at = now() where driver_id = (select auth.uid());
  update public.mova_drivers
     set photo_path = p_path, photo_updated_at = now(), approved = false, online = false, updated_at = now()
   where user_id = (select auth.uid());
end $$;

-- Passenger side: the photo path of the driver on their active ride (then a short signed URL in the app).
create or replace function public.mova_ride_driver_photo(p_ride_id bigint)
returns text
language sql stable security definer set search_path = ''
as $$
  select d.photo_path
  from public.mova_rides r join public.mova_drivers d on d.user_id = r.driver_id
  where r.id = p_ride_id and r.passenger_id = (select auth.uid())
    and r.status in ('accepted','arriving','in_progress');
$$;

-- Checklist ---------------------------------------------------------------------------------------
create table if not exists public.mova_driver_checks (
  driver_id uuid primary key references public.mova_drivers(user_id) on delete cascade,
  photo_checked boolean not null default false,            -- photo matches the ID seen in person
  identity_checked boolean not null default false,         -- ID card or passport seen, valid
  vtc_card_number text check (char_length(vtc_card_number) <= 40),
  vtc_card_expiry date,
  vtc_card_checked boolean not null default false,         -- professional VTC card seen and verified
  revtc_number text check (char_length(revtc_number) <= 40),
  revtc_expiry date,
  revtc_checked boolean not null default false,            -- company listed in the VTC register
  license_expiry date,
  license_checked boolean not null default false,          -- driving licence (B, 3+ years) seen
  insurance_expiry date,
  insurance_checked boolean not null default false,        -- vehicle insurance for paid passenger transport
  rc_pro_expiry date,
  rc_pro_checked boolean not null default false,           -- professional liability insurance
  registration_checked boolean not null default false,     -- carte grise matches the plate in the app
  vehicle_first_registration date,
  notes text check (char_length(notes) <= 2000),
  checked_by uuid default auth.uid() references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);
alter table public.mova_driver_checks enable row level security;
revoke all on public.mova_driver_checks from anon, authenticated;
grant select, insert, update on public.mova_driver_checks to authenticated;

drop policy if exists "Staff: read checks" on public.mova_driver_checks;
create policy "Staff: read checks" on public.mova_driver_checks for select to authenticated
  using ((select public.mova_is_staff()));
drop policy if exists "Staff: add checks" on public.mova_driver_checks;
create policy "Staff: add checks" on public.mova_driver_checks for insert to authenticated
  with check ((select public.mova_is_staff()));
drop policy if exists "Staff: edit checks" on public.mova_driver_checks;
create policy "Staff: edit checks" on public.mova_driver_checks for update to authenticated
  using ((select public.mova_is_staff())) with check ((select public.mova_is_staff()));

-- Complete = photo on file, every box ticked, every date filled in and still valid today.
create or replace function public.mova_driver_checks_ok(p_driver uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((
    select d.photo_path is not null
       and c.photo_checked and c.identity_checked and c.vtc_card_checked and c.revtc_checked
       and c.license_checked and c.insurance_checked and c.rc_pro_checked and c.registration_checked
       and c.vtc_card_expiry > current_date and c.revtc_expiry > current_date
       and c.license_expiry > current_date and c.insurance_expiry > current_date
       and c.rc_pro_expiry > current_date
    from public.mova_drivers d join public.mova_driver_checks c on c.driver_id = d.user_id
    where d.user_id = p_driver
  ), false);
$$;

-- Guard on every driver update, whoever makes it (staff console or the driver's own app):
-- approving or going online needs a complete checklist; a new car resets the car checks.
create or replace function public.mova_drivers_guard()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.vehicle is distinct from old.vehicle or new.plate is distinct from old.plate then
    new.approved := false;
    new.online := false;
  end if;
  if ((new.approved and not old.approved) or (new.online and not old.online))
     and not public.mova_driver_checks_ok(new.user_id) then
    raise exception 'checks_incomplete';
  end if;
  return new;
end $$;
drop trigger if exists mova_drivers_guard on public.mova_drivers;
create trigger mova_drivers_guard before update on public.mova_drivers
  for each row execute function public.mova_drivers_guard();

-- A new car: its registration and insurance have to be checked again.
create or replace function public.mova_drivers_new_car()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  update public.mova_driver_checks
     set registration_checked = false, insurance_checked = false, updated_at = now()
   where driver_id = new.user_id;
  return null;
end $$;
drop trigger if exists mova_drivers_new_car on public.mova_drivers;
create trigger mova_drivers_new_car after update of vehicle, plate on public.mova_drivers
  for each row when (new.vehicle is distinct from old.vehicle or new.plate is distinct from old.plate)
  execute function public.mova_drivers_new_car();

-- Unticking a box or entering a past date takes the driver offline and removes approval at once.
create or replace function public.mova_checks_follow()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.mova_driver_checks_ok(new.driver_id) then
    update public.mova_drivers set approved = false, online = false, updated_at = now()
     where user_id = new.driver_id and (approved or online);
  end if;
  return null;
end $$;
drop trigger if exists mova_checks_follow on public.mova_driver_checks;
create trigger mova_checks_follow after insert or update on public.mova_driver_checks
  for each row execute function public.mova_checks_follow();

-- Documents expire on their own, without anyone editing a row. The ops console calls this on load;
-- the guard above also refuses to put an expired driver back online.
create or replace function public.mova_pause_expired_drivers()
returns integer
language plpgsql security definer set search_path = ''
as $$
declare n integer;
begin
  if not public.mova_is_staff() then raise exception 'not_staff'; end if;
  update public.mova_drivers d set approved = false, online = false, updated_at = now()
   where (d.approved or d.online) and not public.mova_driver_checks_ok(d.user_id);
  get diagnostics n = row_count;
  return n;
end $$;

-- Ops console list: now with photo, checklist status and the next document to expire.
drop function if exists public.mova_staff_drivers();
create function public.mova_staff_drivers()
returns table (user_id uuid, first_name text, email text, vehicle text, plate text, category text,
               approved boolean, online boolean, created_at timestamptz,
               photo_path text, checks_ok boolean, next_expiry date)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.mova_is_staff() then raise exception 'not_staff'; end if;
  return query
    select d.user_id, p.first_name, u.email::text, d.vehicle, d.plate, d.category, d.approved, d.online, d.created_at,
           d.photo_path, public.mova_driver_checks_ok(d.user_id),
           least(c.vtc_card_expiry, c.revtc_expiry, c.license_expiry, c.insurance_expiry, c.rc_pro_expiry)
    from public.mova_drivers d
    join public.mova_profiles p on p.user_id = d.user_id
    join auth.users u on u.id = d.user_id
    left join public.mova_driver_checks c on c.driver_id = d.user_id
    order by d.approved, d.created_at desc;
end $$;

revoke all on function public.mova_set_driver_photo(text) from public, anon;
revoke all on function public.mova_ride_driver_photo(bigint) from public, anon;
revoke all on function public.mova_driver_checks_ok(uuid) from public, anon;
revoke all on function public.mova_pause_expired_drivers() from public, anon;
revoke all on function public.mova_staff_drivers() from public, anon;
revoke all on function public.mova_drivers_guard() from public, anon, authenticated;
revoke all on function public.mova_checks_follow() from public, anon, authenticated;
revoke all on function public.mova_drivers_new_car() from public, anon, authenticated;
grant execute on function public.mova_set_driver_photo(text) to authenticated;
grant execute on function public.mova_ride_driver_photo(bigint) to authenticated;
grant execute on function public.mova_pause_expired_drivers() to authenticated;
grant execute on function public.mova_staff_drivers() to authenticated;
