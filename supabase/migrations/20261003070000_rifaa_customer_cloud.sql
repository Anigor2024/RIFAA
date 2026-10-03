-- RIFAA customer cloud schema
-- Applied to the dedicated Supabase project hsolegtgpisdqcahxjow.
-- Browser access is restricted with Row Level Security; live payment writes remain server-only by design.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  phone text not null default '',
  preferred_department text not null default 'all'
    check (preferred_department in ('all','women','men','kids')),
  email_updates boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null check (char_length(label) between 1 and 80),
  city text not null check (char_length(city) between 1 and 120),
  district text not null default '',
  street text not null check (char_length(street) between 1 and 180),
  building text,
  postal_code text,
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.wishlist_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null check (char_length(product_id) between 1 and 80),
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, product_id)
);

create table public.recently_viewed (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null check (char_length(product_id) between 1 and 80),
  viewed_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, product_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_reference text not null unique,
  commerce_mode text not null default 'demo' check (commerce_mode in ('demo','live')),
  status text not null default 'confirmed' check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  payment_status text not null default 'not_charged' check (payment_status in ('not_charged','pending','paid','failed','refunded')),
  currency text not null default 'SAR' check (currency = 'SAR'),
  customer_email text not null,
  customer_phone text not null,
  first_name text not null,
  last_name text not null,
  shipping_address jsonb not null,
  delivery_method_id text not null,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  delivery_fee numeric(12,2) not null check (delivery_fee >= 0),
  discount numeric(12,2) not null default 0 check (discount >= 0),
  total numeric(12,2) not null check (total >= 0),
  promo_code text,
  snapshot jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  product_name_ar text not null,
  product_name_en text not null,
  image text not null,
  size text not null,
  color_name_ar text not null,
  color_name_en text not null,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0 and quantity <= 20),
  line_total numeric(12,2) not null check (line_total >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table public.inventory_variants (
  product_id text not null,
  size text not null,
  color_name_en text not null,
  quantity integer not null default 0 check (quantity >= 0),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0 and reserved_quantity <= quantity),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (product_id, size, color_name_en)
);

create index addresses_user_id_idx on public.addresses(user_id);
create index recently_viewed_user_time_idx on public.recently_viewed(user_id, viewed_at desc);
create index orders_user_created_idx on public.orders(user_id, created_at desc);
create index order_items_order_idx on public.order_items(order_id);
create index order_items_user_idx on public.order_items(user_id);

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger addresses_updated_at before update on public.addresses
for each row execute function public.set_updated_at();
create trigger inventory_variants_updated_at before update on public.inventory_variants
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, first_name, last_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.phone, new.raw_user_meta_data->>'phone', '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.recently_viewed enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_variants enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "addresses_select_own" on public.addresses for select to authenticated using ((select auth.uid()) = user_id);
create policy "addresses_insert_own" on public.addresses for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "addresses_update_own" on public.addresses for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "addresses_delete_own" on public.addresses for delete to authenticated using ((select auth.uid()) = user_id);

create policy "wishlist_select_own" on public.wishlist_items for select to authenticated using ((select auth.uid()) = user_id);
create policy "wishlist_insert_own" on public.wishlist_items for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "wishlist_delete_own" on public.wishlist_items for delete to authenticated using ((select auth.uid()) = user_id);

create policy "recently_viewed_select_own" on public.recently_viewed for select to authenticated using ((select auth.uid()) = user_id);
create policy "recently_viewed_insert_own" on public.recently_viewed for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "recently_viewed_update_own" on public.recently_viewed for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "recently_viewed_delete_own" on public.recently_viewed for delete to authenticated using ((select auth.uid()) = user_id);

create policy "orders_select_own" on public.orders for select to authenticated using ((select auth.uid()) = user_id);
create policy "orders_insert_demo_own" on public.orders for insert to authenticated
with check ((select auth.uid()) = user_id and commerce_mode = 'demo' and payment_status = 'not_charged');

create policy "order_items_select_own" on public.order_items for select to authenticated using ((select auth.uid()) = user_id);
create policy "order_items_insert_demo_own" on public.order_items for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.orders o
    where o.id = order_id
      and o.user_id = (select auth.uid())
      and o.commerce_mode = 'demo'
      and o.payment_status = 'not_charged'
  )
);

create policy "inventory_public_read" on public.inventory_variants for select to anon, authenticated using (true);

create or replace function public.create_demo_order(p_order jsonb, p_items jsonb)
returns uuid language plpgsql security invoker set search_path = public as $$
declare
  v_user_id uuid := auth.uid();
  v_order_id uuid;
  v_subtotal numeric(12,2);
  v_delivery_fee numeric(12,2);
  v_discount numeric(12,2);
  v_total numeric(12,2);
  v_item jsonb;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  v_subtotal := coalesce((p_order->>'subtotal')::numeric, 0);
  v_delivery_fee := coalesce((p_order->>'deliveryFee')::numeric, 0);
  v_discount := coalesce((p_order->>'discount')::numeric, 0);
  v_total := coalesce((p_order->>'total')::numeric, 0);

  if v_subtotal < 0 or v_delivery_fee < 0 or v_discount < 0 or v_total < 0 then
    raise exception 'Invalid order totals';
  end if;
  if abs(v_total - greatest(0, v_subtotal + v_delivery_fee - v_discount)) > 0.01 then
    raise exception 'Order total mismatch';
  end if;

  insert into public.orders (
    user_id, order_reference, commerce_mode, status, payment_status,
    customer_email, customer_phone, first_name, last_name, shipping_address,
    delivery_method_id, subtotal, delivery_fee, discount, total, promo_code, snapshot
  )
  values (
    v_user_id, p_order->>'orderReference', 'demo', 'confirmed', 'not_charged',
    p_order#>>'{customer,email}', p_order#>>'{customer,phone}',
    p_order#>>'{customer,firstName}', p_order#>>'{customer,lastName}',
    coalesce(p_order->'deliveryAddress', '{}'::jsonb),
    p_order#>>'{deliveryMethod,id}', v_subtotal, v_delivery_fee, v_discount,
    v_total, nullif(p_order->>'promoCodeApplied', ''), p_order
  )
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if coalesce((v_item->>'quantity')::integer, 0) <= 0
      or coalesce((v_item->>'quantity')::integer, 0) > 20
      or coalesce((v_item->>'unitPrice')::numeric, -1) < 0 then
      raise exception 'Invalid order item';
    end if;

    if abs(
      coalesce((v_item->>'lineTotal')::numeric, -1)
      - coalesce((v_item->>'unitPrice')::numeric, 0) * coalesce((v_item->>'quantity')::integer, 0)
    ) > 0.01 then
      raise exception 'Order line total mismatch';
    end if;

    insert into public.order_items (
      order_id, user_id, product_id, product_name_ar, product_name_en, image,
      size, color_name_ar, color_name_en, unit_price, quantity, line_total
    )
    values (
      v_order_id, v_user_id, v_item->>'productId', v_item->>'productNameAr',
      v_item->>'productNameEn', v_item->>'image', v_item->>'size',
      v_item->>'colorNameAr', v_item->>'colorNameEn',
      (v_item->>'unitPrice')::numeric, (v_item->>'quantity')::integer,
      (v_item->>'lineTotal')::numeric
    );
  end loop;

  return v_order_id;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.create_demo_order(jsonb, jsonb) from public, anon;
grant execute on function public.create_demo_order(jsonb, jsonb) to authenticated;

grant usage on schema public to anon, authenticated;
grant select on public.inventory_variants to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.addresses to authenticated;
grant select, insert, delete on public.wishlist_items to authenticated;
grant select, insert, update, delete on public.recently_viewed to authenticated;
grant select, insert on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;
