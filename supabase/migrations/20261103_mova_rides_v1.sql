-- MOVA apps, step 1: profiles, drivers, rides.
-- Ride changes go through the functions below (security definer) so the rules live in one place:
-- passengers request and cancel, approved online drivers accept and move the ride forward.
-- Prices are estimates computed here, never trusted from the app. No payment yet.

-- Staff check shared by every staff policy: a row in mova_staff and a session that passed 2FA.
create or replace function public.mova_is_staff()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((select auth.jwt() ->> 'aal') = 'aal2', false)
     and exists (select 1 from public.mova_staff s where s.user_id = (select auth.uid()));
$$;
revoke all on function public.mova_is_staff() from public, anon;
grant execute on function public.mova_is_staff() to authenticated;

-- Profiles: one per account, role chosen once.
create table if not exists public.mova_profiles (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  role text not null check (role in ('passenger','driver')),
  first_name text not null check (char_length(btrim(first_name)) between 1 and 80),
  phone text check (char_length(phone) <= 30),
  created_at timestamptz not null default now()
);
alter table public.mova_profiles enable row level security;
revoke all on public.mova_profiles from anon, authenticated;
grant select, insert on public.mova_profiles to authenticated;
grant update (first_name, phone) on public.mova_profiles to authenticated;

drop policy if exists "Own profile: read" on public.mova_profiles;
create policy "Own profile: read" on public.mova_profiles for select to authenticated
  using (user_id = (select auth.uid()) or (select public.mova_is_staff()));
drop policy if exists "Own profile: create" on public.mova_profiles;
create policy "Own profile: create" on public.mova_profiles for insert to authenticated
  with check (user_id = (select auth.uid()));
drop policy if exists "Own profile: edit" on public.mova_profiles;
create policy "Own profile: edit" on public.mova_profiles for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Drivers: vehicle details and approval. Only staff can approve.
create table if not exists public.mova_drivers (
  user_id uuid primary key default auth.uid() references public.mova_profiles(user_id) on delete cascade,
  vehicle text not null check (char_length(btrim(vehicle)) between 2 and 80),
  plate text not null check (char_length(btrim(plate)) between 4 and 15),
  category text not null default 'standard' check (category in ('standard','confort','van')),
  approved boolean not null default false,
  online boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.mova_drivers enable row level security;
revoke all on public.mova_drivers from anon, authenticated;
grant select, insert on public.mova_drivers to authenticated;
grant update (vehicle, plate, category, online, approved, updated_at) on public.mova_drivers to authenticated;

drop policy if exists "Driver: read own" on public.mova_drivers;
create policy "Driver: read own" on public.mova_drivers for select to authenticated
  using (user_id = (select auth.uid()) or (select public.mova_is_staff()));
drop policy if exists "Driver: register" on public.mova_drivers;
create policy "Driver: register" on public.mova_drivers for insert to authenticated
  with check (
    user_id = (select auth.uid()) and approved = false and online = false
    and exists (select 1 from public.mova_profiles p where p.user_id = (select auth.uid()) and p.role = 'driver')
  );
drop policy if exists "Staff: manage drivers" on public.mova_drivers;
create policy "Staff: manage drivers" on public.mova_drivers for update to authenticated
  using ((select public.mova_is_staff())) with check ((select public.mova_is_staff()));

-- Drivers change their own details and online status through this function,
-- so they can never touch "approved" themselves. Editing vehicle details removes approval.
create or replace function public.mova_update_driver(p_vehicle text default null, p_plate text default null,
                                                     p_category text default null, p_online boolean default null)
returns public.mova_drivers
language plpgsql security definer set search_path = ''
as $$
declare d public.mova_drivers;
begin
  select * into d from public.mova_drivers where user_id = (select auth.uid()) for update;
  if not found then raise exception 'not_a_driver'; end if;
  if p_online and not d.approved then raise exception 'driver_not_approved'; end if;
  if p_online = false and exists (
    select 1 from public.mova_rides r where r.driver_id = d.user_id and r.status in ('accepted','arriving','in_progress')
  ) then raise exception 'ride_in_progress'; end if;
  update public.mova_drivers set
    vehicle  = coalesce(p_vehicle, vehicle),
    plate    = upper(coalesce(p_plate, plate)),
    category = coalesce(p_category, category),
    approved = case when (p_vehicle is not null and p_vehicle <> vehicle)
                      or (p_plate is not null and upper(p_plate) <> plate) then false else approved end,
    online   = case when (p_vehicle is not null and p_vehicle <> vehicle)
                      or (p_plate is not null and upper(p_plate) <> plate) then false
                    else coalesce(p_online, online) end,
    updated_at = now()
  where user_id = d.user_id
  returning * into d;
  return d;
end $$;

-- Rides.
create table if not exists public.mova_rides (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  passenger_id uuid not null references public.mova_profiles(user_id) on delete cascade,
  driver_id uuid references public.mova_drivers(user_id) on delete set null,
  status text not null default 'requested'
    check (status in ('requested','accepted','arriving','in_progress','completed','cancelled')),
  pickup_label text not null check (char_length(pickup_label) between 1 and 120),
  pickup_lat double precision not null check (pickup_lat between 41 and 52),
  pickup_lng double precision not null check (pickup_lng between -6 and 10),
  dropoff_label text not null check (char_length(dropoff_label) between 1 and 120),
  dropoff_lat double precision not null check (dropoff_lat between 41 and 52),
  dropoff_lng double precision not null check (dropoff_lng between -6 and 10),
  category text not null check (category in ('standard','confort','van')),
  km numeric(6,1) not null,
  minutes integer not null,
  price_estimate numeric(7,2) not null,
  night boolean not null default false,
  cancelled_by text check (cancelled_by in ('passenger','driver','staff')),
  accepted_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz
);
create index if not exists mova_rides_passenger_idx on public.mova_rides (passenger_id, created_at desc);
create index if not exists mova_rides_driver_idx on public.mova_rides (driver_id, created_at desc);
create index if not exists mova_rides_open_idx on public.mova_rides (created_at) where status = 'requested';
-- One active ride per passenger and per driver.
create unique index if not exists mova_rides_one_active_passenger on public.mova_rides (passenger_id)
  where status in ('requested','accepted','arriving','in_progress');
create unique index if not exists mova_rides_one_active_driver on public.mova_rides (driver_id)
  where status in ('accepted','arriving','in_progress');

alter table public.mova_rides enable row level security;
revoke all on public.mova_rides from anon, authenticated;
grant select on public.mova_rides to authenticated;

drop policy if exists "Rides: passenger, driver, open requests, staff" on public.mova_rides;
create policy "Rides: passenger, driver, open requests, staff" on public.mova_rides for select to authenticated
  using (
    passenger_id = (select auth.uid())
    or driver_id = (select auth.uid())
    or (status = 'requested' and exists (
          select 1 from public.mova_drivers d
          where d.user_id = (select auth.uid()) and d.approved and d.online))
    or (select public.mova_is_staff())
  );

create or replace function public.mova_request_ride(
  p_pickup_label text, p_pickup_lat double precision, p_pickup_lng double precision,
  p_dropoff_label text, p_dropoff_lat double precision, p_dropoff_lng double precision,
  p_category text)
returns public.mova_rides
language plpgsql security definer set search_path = ''
as $$
declare
  r public.mova_rides;
  v_km numeric; v_factor numeric; v_night boolean; v_raw numeric;
begin
  if not exists (select 1 from public.mova_profiles p where p.user_id = (select auth.uid()) and p.role = 'passenger') then
    raise exception 'not_a_passenger';
  end if;
  v_factor := case p_category when 'standard' then 1 when 'confort' then 1.3 when 'van' then 1.55 end;
  if v_factor is null then raise exception 'bad_category'; end if;
  -- Straight-line distance x 1.35, same example tariff as the website.
  v_km := 2 * 6371 * asin(sqrt(
            power(sin(radians(p_dropoff_lat - p_pickup_lat) / 2), 2)
            + cos(radians(p_pickup_lat)) * cos(radians(p_dropoff_lat))
              * power(sin(radians(p_dropoff_lng - p_pickup_lng) / 2), 2))) * 1.35;
  if v_km < 0.3 then raise exception 'same_place'; end if;
  if v_km > 150 then raise exception 'too_far'; end if;
  v_night := extract(hour from now() at time zone 'Europe/Paris') >= 21
          or extract(hour from now() at time zone 'Europe/Paris') < 6;
  v_raw := (4 + v_km * 1.9) * v_factor * (case when v_night then 1.2 else 1 end);
  insert into public.mova_rides (passenger_id, pickup_label, pickup_lat, pickup_lng,
                                 dropoff_label, dropoff_lat, dropoff_lng, category,
                                 km, minutes, price_estimate, night)
  values ((select auth.uid()), btrim(p_pickup_label), p_pickup_lat, p_pickup_lng,
          btrim(p_dropoff_label), p_dropoff_lat, p_dropoff_lng, p_category,
          round(v_km, 1), round(v_km / 24 * 60 + 3), greatest(8, round(v_raw * 2) / 2), v_night)
  returning * into r;
  return r;
exception when unique_violation then
  raise exception 'ride_already_active';
end $$;

create or replace function public.mova_accept_ride(p_ride_id bigint)
returns public.mova_rides
language plpgsql security definer set search_path = ''
as $$
declare r public.mova_rides;
begin
  if not exists (select 1 from public.mova_drivers d where d.user_id = (select auth.uid()) and d.approved and d.online) then
    raise exception 'driver_not_available';
  end if;
  update public.mova_rides
     set driver_id = (select auth.uid()), status = 'accepted', accepted_at = now(), updated_at = now()
   where id = p_ride_id and status = 'requested' and driver_id is null
  returning * into r;
  if not found then raise exception 'ride_taken'; end if;
  return r;
exception when unique_violation then
  raise exception 'driver_busy';
end $$;

create or replace function public.mova_advance_ride(p_ride_id bigint, p_status text)
returns public.mova_rides
language plpgsql security definer set search_path = ''
as $$
declare r public.mova_rides;
begin
  update public.mova_rides set
    status = p_status,
    started_at = case when p_status = 'in_progress' then now() else started_at end,
    completed_at = case when p_status = 'completed' then now() else completed_at end,
    updated_at = now()
  where id = p_ride_id and driver_id = (select auth.uid())
    and ((status = 'accepted' and p_status = 'arriving')
      or (status = 'arriving' and p_status = 'in_progress')
      or (status = 'in_progress' and p_status = 'completed'))
  returning * into r;
  if not found then raise exception 'bad_transition'; end if;
  return r;
end $$;

create or replace function public.mova_cancel_ride(p_ride_id bigint)
returns public.mova_rides
language plpgsql security definer set search_path = ''
as $$
declare r public.mova_rides;
begin
  update public.mova_rides set
    status = 'cancelled', cancelled_at = now(), updated_at = now(),
    cancelled_by = case when passenger_id = (select auth.uid()) then 'passenger' else 'driver' end
  where id = p_ride_id
    and ((passenger_id = (select auth.uid()) and status in ('requested','accepted','arriving'))
      or (driver_id = (select auth.uid()) and status in ('accepted','arriving')))
  returning * into r;
  if not found then raise exception 'cannot_cancel'; end if;
  return r;
end $$;

-- The other side of a ride: first name, plus the car for the passenger. Nothing else is shared.
create or replace function public.mova_ride_contact(p_ride_id bigint)
returns table (first_name text, vehicle text, plate text)
language sql stable security definer set search_path = ''
as $$
  select p.first_name,
         case when r.passenger_id = (select auth.uid()) then d.vehicle end,
         case when r.passenger_id = (select auth.uid()) then d.plate end
  from public.mova_rides r
  join public.mova_profiles p
    on p.user_id = case when r.passenger_id = (select auth.uid()) then r.driver_id else r.passenger_id end
  left join public.mova_drivers d on d.user_id = r.driver_id
  where r.id = p_ride_id
    and r.status in ('accepted','arriving','in_progress','completed')
    and (r.passenger_id = (select auth.uid()) or r.driver_id = (select auth.uid()));
$$;

revoke all on function public.mova_update_driver(text, text, text, boolean) from public, anon;
revoke all on function public.mova_request_ride(text, double precision, double precision, text, double precision, double precision, text) from public, anon;
revoke all on function public.mova_accept_ride(bigint) from public, anon;
revoke all on function public.mova_advance_ride(bigint, text) from public, anon;
revoke all on function public.mova_cancel_ride(bigint) from public, anon;
revoke all on function public.mova_ride_contact(bigint) from public, anon;
grant execute on function public.mova_update_driver(text, text, text, boolean) to authenticated;
grant execute on function public.mova_request_ride(text, double precision, double precision, text, double precision, double precision, text) to authenticated;
grant execute on function public.mova_accept_ride(bigint) to authenticated;
grant execute on function public.mova_advance_ride(bigint, text) to authenticated;
grant execute on function public.mova_cancel_ride(bigint) to authenticated;
grant execute on function public.mova_ride_contact(bigint) to authenticated;

-- Ops console: drivers with their sign-in e-mail, for staff only.
create or replace function public.mova_staff_drivers()
returns table (user_id uuid, first_name text, email text, vehicle text, plate text, category text,
               approved boolean, online boolean, created_at timestamptz)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.mova_is_staff() then raise exception 'not_staff'; end if;
  return query
    select d.user_id, p.first_name, u.email::text, d.vehicle, d.plate, d.category, d.approved, d.online, d.created_at
    from public.mova_drivers d
    join public.mova_profiles p on p.user_id = d.user_id
    join auth.users u on u.id = d.user_id
    order by d.approved, d.created_at desc;
end $$;
revoke all on function public.mova_staff_drivers() from public, anon;
grant execute on function public.mova_staff_drivers() to authenticated;
