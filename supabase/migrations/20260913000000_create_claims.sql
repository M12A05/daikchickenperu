create extension if not exists pgcrypto;

create sequence if not exists public.claims_claim_number_seq;

create or replace function public.generate_claim_number()
returns text
language plpgsql
volatile
security definer
set search_path = pg_catalog, public
as $$
begin
  return 'LR-' || to_char(timezone('utc', now()), 'YYYY') || '-' ||
    lpad(nextval('public.claims_claim_number_seq')::text, 6, '0');
end;
$$;

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  claim_number text not null unique default public.generate_claim_number(),
  name text not null constraint claims_name_length_check check (char_length(btrim(name)) between 1 and 100),
  dni text constraint claims_dni_check check (dni is null or dni ~ '^\d{8}$'),
  claim_type text not null constraint claims_type_check check (claim_type in ('Reclamo', 'Queja')),
  email text not null constraint claims_email_length_check check (char_length(email) between 3 and 254),
  phone text not null constraint claims_phone_length_check check (char_length(phone) between 7 and 30),
  address text not null constraint claims_address_length_check check (char_length(btrim(address)) between 1 and 180),
  product_service text not null constraint claims_product_service_length_check check (char_length(btrim(product_service)) between 1 and 160),
  incident_date date,
  description text not null constraint claims_description_length_check check (char_length(btrim(description)) between 1 and 2000),
  consumer_request text not null constraint claims_request_length_check check (char_length(btrim(consumer_request)) between 1 and 500),
  privacy_accepted boolean not null default false constraint claims_privacy_check check (privacy_accepted),
  status text not null default 'received' constraint claims_status_check check (status in ('received', 'in_review', 'resolved', 'closed')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists claims_created_at_idx on public.claims (created_at desc);

alter table public.claims enable row level security;
alter table public.claims force row level security;

revoke all on table public.claims from anon, authenticated;
grant insert, select on table public.claims to service_role;
revoke all on sequence public.claims_claim_number_seq from anon, authenticated;
revoke all on function public.generate_claim_number() from public, anon, authenticated;
grant execute on function public.generate_claim_number() to service_role;
