-- No photos, prompts, tokens or generation outputs are stored in these counters.
create table if not exists public.tryon_user_daily (
 day date not null, user_id uuid not null references auth.users(id) on delete cascade,
 attempts integer not null default 0 check (attempts between 0 and 3), primary key(day,user_id)
);
create index if not exists tryon_user_daily_user_idx on public.tryon_user_daily(user_id);
create table if not exists public.tryon_global_daily (
 day date primary key, attempts integer not null default 0 check (attempts between 0 and 30)
);
alter table public.tryon_user_daily enable row level security;
alter table public.tryon_global_daily enable row level security;
revoke all on public.tryon_user_daily,public.tryon_global_daily from public,anon,authenticated;
create or replace function public.reserve_tryon_attempt()
returns boolean language plpgsql security definer set search_path = '' as $$
declare u uuid:=auth.uid();d date:=(now() at time zone 'UTC')::date;global_used integer;user_used integer;
begin
 if u is null then raise exception 'Authentication required';end if;
 insert into public.tryon_global_daily(day,attempts) values(d,0) on conflict do nothing;
 select attempts into global_used from public.tryon_global_daily where day=d for update;
 if global_used>=30 then return false;end if;
 insert into public.tryon_user_daily(day,user_id,attempts) values(d,u,0) on conflict do nothing;
 select attempts into user_used from public.tryon_user_daily where day=d and user_id=u for update;
 if user_used>=3 then return false;end if;
 update public.tryon_user_daily set attempts=attempts+1 where day=d and user_id=u;
 update public.tryon_global_daily set attempts=attempts+1 where day=d;
 return true;
end;
$$;
revoke all on function public.reserve_tryon_attempt() from public,anon;
grant execute on function public.reserve_tryon_attempt() to authenticated;
