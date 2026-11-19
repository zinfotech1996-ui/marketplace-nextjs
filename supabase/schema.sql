-- ============================================================
--  Marketplace — Supabase schema (Test 3)
--  Run in the Supabase SQL editor. Reuses the same project as
--  Test 1/2; only adds the marketplace tables + storage bucket.
-- ============================================================

-- If upgrading an existing deployment, run this first:
-- alter table public.listings add column if not exists location text;

-- 1. Listings
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 3 and 100),
  description text not null check (char_length(btrim(description)) between 10 and 2000),
  price numeric(10,2) not null check (price >= 0),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  category text not null,
  location text,
  image_path text,
  created_at timestamptz default now()
);

create index if not exists listings_created_at_idx on public.listings (created_at desc);
create index if not exists listings_category_idx on public.listings (category);

alter table public.listings enable row level security;

drop policy if exists "Listings are public" on public.listings;
create policy "Listings are public"
  on public.listings for select using (true);

drop policy if exists "Anyone can create a listing" on public.listings;
create policy "Anyone can create a listing"
  on public.listings for insert
  with check (
    char_length(btrim(title)) between 3 and 100 and
    char_length(btrim(description)) between 10 and 2000 and
    price >= 0
  );

grant select, insert on public.listings to anon, authenticated;

-- 2. Buyer messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_email text not null,
  message text not null check (char_length(btrim(message)) between 1 and 1000),
  created_at timestamptz default now()
);

alter table public.messages drop constraint if exists messages_buyer_email_check;
alter table public.messages
  add constraint messages_buyer_email_check
  check (buyer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

alter table public.messages enable row level security;

drop policy if exists "Anyone can send a message" on public.messages;
create policy "Anyone can send a message"
  on public.messages for insert
  with check (char_length(btrim(message)) between 1 and 1000);

grant insert on public.messages to anon, authenticated;

-- 3. Storage bucket for listing images (public)
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can upload listing images" on storage.objects;
create policy "Anyone can upload listing images"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'listing-images');

drop policy if exists "Listing images are public" on storage.objects;
create policy "Listing images are public"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'listing-images');
