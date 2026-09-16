create table if not exists public.catalog_items (
  id bigint primary key,
  type text not null constraint catalog_items_type_check check (type in ('product', 'promo')),
  name text not null constraint catalog_items_name_length_check
    check (char_length(btrim(name)) between 1 and 160),
  description text not null default '' constraint catalog_items_description_length_check
    check (char_length(description) <= 2000),
  price numeric(10, 2) not null constraint catalog_items_price_check
    check (price >= 0 and price::text not in ('NaN', 'Infinity', '-Infinity')),
  image text not null constraint catalog_items_image_check
    check (
      char_length(image) between 1 and 2048
      and image !~ '[[:cntrl:]]'
      and (
        (image ~ '^/[^/]' and image !~ '://')
        or lower(image) ~ '^https://[a-z0-9-]+\.supabase\.co/storage/v1/object/public/[^[:space:]/][^[:space:]]*$'
      )
    ),
  category text,
  original_price numeric(10, 2) constraint catalog_items_original_price_check
    check (
      original_price is null
      or (
        original_price >= price
        and original_price::text not in ('NaN', 'Infinity', '-Infinity')
      )
    ),
  badge text,
  savings text,
  expires_at timestamptz,
  sort_order integer not null default 0 constraint catalog_items_sort_order_check check (sort_order >= 0),
  is_active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'catalog_items' and column_name = 'desc'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'catalog_items' and column_name = 'description'
  ) then
    alter table public.catalog_items rename column "desc" to description;
  end if;
end
$$;

alter table public.catalog_items add column if not exists description text;
alter table public.catalog_items add column if not exists category text;
alter table public.catalog_items add column if not exists original_price numeric(10, 2);
alter table public.catalog_items add column if not exists badge text;
alter table public.catalog_items add column if not exists savings text;
alter table public.catalog_items add column if not exists expires_at timestamptz;
alter table public.catalog_items add column if not exists sort_order integer not null default 0;
alter table public.catalog_items add column if not exists is_active boolean not null default true;
alter table public.catalog_items add column if not exists featured boolean not null default false;
alter table public.catalog_items add column if not exists created_at timestamptz not null default timezone('utc', now());
alter table public.catalog_items add column if not exists updated_at timestamptz not null default timezone('utc', now());

update public.catalog_items
set description = ''
where description is null;

update public.catalog_items
set sort_order = 0
where sort_order is null;

update public.catalog_items
set is_active = true
where is_active is null;

update public.catalog_items
set featured = false
where featured is null;

update public.catalog_items
set created_at = timezone('utc', now())
where created_at is null;

update public.catalog_items
set updated_at = timezone('utc', now())
where updated_at is null;

alter table public.catalog_items alter column description set default '';
alter table public.catalog_items alter column description set not null;
alter table public.catalog_items alter column id set not null;
alter table public.catalog_items alter column type set not null;
alter table public.catalog_items alter column name set not null;
alter table public.catalog_items alter column price set not null;
alter table public.catalog_items alter column image set not null;
alter table public.catalog_items alter column sort_order set not null;
alter table public.catalog_items alter column is_active set not null;
alter table public.catalog_items alter column featured set not null;
alter table public.catalog_items alter column created_at set not null;
alter table public.catalog_items alter column updated_at set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'catalog_items_id_check') then
    alter table public.catalog_items
      add constraint catalog_items_id_check
      check (id is not null and id > 0) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'catalog_items_type_check') then
    alter table public.catalog_items
      add constraint catalog_items_type_check
      check (type is not null and type in ('product', 'promo')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'catalog_items_name_length_check') then
    alter table public.catalog_items
      add constraint catalog_items_name_length_check
      check (name is not null and char_length(btrim(name)) between 1 and 160) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'catalog_items_description_length_check') then
    alter table public.catalog_items
      add constraint catalog_items_description_length_check
      check (description is not null and char_length(description) <= 2000) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'catalog_items_price_check') then
    alter table public.catalog_items
      add constraint catalog_items_price_check
      check (price is not null and price >= 0
        and price::text not in ('NaN', 'Infinity', '-Infinity')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'catalog_items_image_check') then
    alter table public.catalog_items
      add constraint catalog_items_image_check
      check (
        image is not null
        and char_length(image) between 1 and 2048
        and image !~ '[[:cntrl:]]'
        and (
          (image ~ '^/[^/]' and image !~ '://')
          or lower(image) ~ '^https://[a-z0-9-]+\.supabase\.co/storage/v1/object/public/[^[:space:]/][^[:space:]]*$'
        )
      ) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'catalog_items_original_price_check') then
    alter table public.catalog_items
      add constraint catalog_items_original_price_check
      check (
        original_price is null
        or (
          original_price >= price
          and original_price::text not in ('NaN', 'Infinity', '-Infinity')
        )
      ) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'catalog_items_category_length_check') then
    alter table public.catalog_items
      add constraint catalog_items_category_length_check
      check (category is null or char_length(category) <= 80) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'catalog_items_badge_length_check') then
    alter table public.catalog_items
      add constraint catalog_items_badge_length_check
      check (badge is null or char_length(badge) <= 80) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'catalog_items_savings_length_check') then
    alter table public.catalog_items
      add constraint catalog_items_savings_length_check
      check (savings is null or char_length(savings) <= 80) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'catalog_items_sort_order_check') then
    alter table public.catalog_items
      add constraint catalog_items_sort_order_check
      check (sort_order is not null and sort_order >= 0) not valid;
  end if;
end
$$;

alter table public.catalog_items validate constraint catalog_items_id_check;
alter table public.catalog_items validate constraint catalog_items_type_check;
alter table public.catalog_items validate constraint catalog_items_name_length_check;
alter table public.catalog_items validate constraint catalog_items_description_length_check;
alter table public.catalog_items validate constraint catalog_items_price_check;
alter table public.catalog_items validate constraint catalog_items_image_check;
alter table public.catalog_items validate constraint catalog_items_original_price_check;
alter table public.catalog_items validate constraint catalog_items_category_length_check;
alter table public.catalog_items validate constraint catalog_items_badge_length_check;
alter table public.catalog_items validate constraint catalog_items_savings_length_check;
alter table public.catalog_items validate constraint catalog_items_sort_order_check;

create or replace function public.set_catalog_item_updated_at()
returns trigger
language plpgsql
security invoker
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_catalog_item_updated_at on public.catalog_items;
create trigger set_catalog_item_updated_at
  before update on public.catalog_items
  for each row execute function public.set_catalog_item_updated_at();

create index if not exists catalog_items_active_order_idx
  on public.catalog_items (is_active, sort_order, id);

create index if not exists catalog_items_type_idx
  on public.catalog_items (type, is_active, sort_order);

alter table public.catalog_items enable row level security;
alter table public.catalog_items force row level security;

revoke all on table public.catalog_items from anon, authenticated;
grant select on table public.catalog_items to anon, authenticated;

drop policy if exists "Public can read active catalog items" on public.catalog_items;
create policy "Public can read active catalog items"
  on public.catalog_items
  for select
  to anon, authenticated
  using (
    is_active = true
    and (expires_at is null or expires_at > now())
  );
