-- MOVA: live driver position during a ride.
-- The assigned driver's phone sends its position while the ride is accepted, arriving or in progress.
-- It is stored on the ride row, so the existing ride policy limits it to that passenger, that driver and staff.
-- It is wiped as soon as the ride is completed or cancelled. Re-runnable.

alter table public.mova_rides
  add column if not exists driver_lat double precision check (driver_lat between 41 and 52),
  add column if not exists driver_lng double precision check (driver_lng between -6 and 10),
  add column if not exists driver_heading real check (driver_heading between 0 and 360),
  add column if not exists driver_located_at timestamptz;

create or replace function public.mova_update_location(p_ride_id bigint, p_lat double precision, p_lng double precision, p_heading real default null)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if p_lat is null or p_lng is null or p_lat not between 41 and 52 or p_lng not between -6 and 10 then
    raise exception 'bad_position';
  end if;
  update public.mova_rides set
    driver_lat = p_lat,
    driver_lng = p_lng,
    driver_heading = case when p_heading between 0 and 360 then p_heading end,
    driver_located_at = now()
  where id = p_ride_id
    and driver_id = (select auth.uid())
    and status in ('accepted', 'arriving', 'in_progress');
  if not found then raise exception 'not_your_ride'; end if;
end $$;

revoke all on function public.mova_update_location(bigint, double precision, double precision, real) from public, anon;
grant execute on function public.mova_update_location(bigint, double precision, double precision, real) to authenticated;

-- Forget the position when the ride ends, whichever function ended it.
create or replace function public.mova_rides_clear_location()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  if new.status in ('completed', 'cancelled') then
    new.driver_lat := null;
    new.driver_lng := null;
    new.driver_heading := null;
    new.driver_located_at := null;
  end if;
  return new;
end $$;

drop trigger if exists mova_rides_clear_location on public.mova_rides;
create trigger mova_rides_clear_location before update on public.mova_rides
  for each row execute function public.mova_rides_clear_location();
