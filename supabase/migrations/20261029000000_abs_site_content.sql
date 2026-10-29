-- Schema for the ABS website content and admin panel (already applied to the Supabase project).

-- Admin allowlist: only these emails can change site content
create table public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create policy "admins can read admin list" on public.admins
  for select to authenticated using ((select public.is_admin()));
create policy "admins can add admins" on public.admins
  for insert to authenticated with check ((select public.is_admin()));
create policy "admins can remove admins" on public.admins
  for delete to authenticated using ((select public.is_admin()));

-- Single-row site settings stored as JSON (headline, address, WhatsApp, etc.)
create table public.site_settings (
  id text primary key default 'site' check (id = 'site'),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price text not null default '',
  duration text not null default '',
  description text not null default '',
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  phone text not null,
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.opening_hours (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  hours text not null,
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  text text not null,
  rating int not null default 5 check (rating between 1 and 5),
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  storage_path text,
  caption text not null default '',
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- RLS: everyone can read visible content; only admins can write (and see hidden rows)
do $$
declare t text;
begin
  foreach t in array array['services','contacts','opening_hours','reviews','gallery'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "public reads visible rows" on public.%I for select to anon, authenticated using (visible or (select public.is_admin()))', t);
    execute format('create policy "admins insert" on public.%I for insert to authenticated with check ((select public.is_admin()))', t);
    execute format('create policy "admins update" on public.%I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format('create policy "admins delete" on public.%I for delete to authenticated using ((select public.is_admin()))', t);
  end loop;
end $$;

alter table public.site_settings enable row level security;
create policy "public reads settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admins insert settings" on public.site_settings for insert to authenticated with check ((select public.is_admin()));
create policy "admins update settings" on public.site_settings for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Public media bucket for gallery photos, logo and hero video
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800, array['image/jpeg','image/png','image/webp','image/gif','image/avif','video/mp4','video/webm'])
on conflict (id) do nothing;

create policy "admins upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "admins update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
create policy "admins delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
