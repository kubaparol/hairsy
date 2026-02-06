-- Migration: create_profiles_and_salons
-- Purpose: Tables for user profiles (with role) and salons; trigger to create profile + salon on business signup.
-- Affected: new tables public.profiles, public.salons; new enums; trigger on auth.users.
-- RLS enabled on both tables with granular policies per role.

-- ---------------------------------------------------------------------------
-- enum types for role and salon status
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('OWNER', 'USER');

create type public.salon_status as enum ('DRAFT', 'ACTIVE');

-- ---------------------------------------------------------------------------
-- profiles: extended user data, one row per auth.users.id
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'USER',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Extended user profile; id matches auth.users. Role OWNER = business, USER = client.';

-- enable RLS (required for all new tables)
alter table public.profiles enable row level security;

-- authenticated: select own profile only
create policy "profiles_select_authenticated"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- authenticated: update own profile only
create policy "profiles_update_authenticated"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- anon: no direct access (insert is done by trigger with definer)
-- no insert/delete policies for authenticated; trigger performs insert.

-- ---------------------------------------------------------------------------
-- salons: one per business owner, status DRAFT until activated
-- ---------------------------------------------------------------------------
create table public.salons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  status public.salon_status not null default 'DRAFT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.salons is 'Salon/business entity. Owner is from profiles; status DRAFT until owner activates.';

alter table public.salons enable row level security;

-- authenticated: select only own salon(s)
create policy "salons_select_authenticated"
  on public.salons
  for select
  to authenticated
  using (auth.uid() = owner_id);

-- authenticated: update only own salon(s)
create policy "salons_update_authenticated"
  on public.salons
  for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- anon: no access. Insert is done by trigger.

-- ---------------------------------------------------------------------------
-- trigger function: create profile and optionally salon on auth user signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role_value public.user_role;
  salon_name_value text;
begin
  -- role from metadata or default USER
  user_role_value := coalesce(
    (new.raw_user_meta_data->>'role')::public.user_role,
    'USER'::public.user_role
  );

  insert into public.profiles (id, role)
  values (new.id, user_role_value);

  if user_role_value = 'OWNER' then
    salon_name_value := new.raw_user_meta_data->>'salon_name';
    if salon_name_value is not null and trim(salon_name_value) != '' then
      insert into public.salons (name, owner_id)
      values (trim(salon_name_value), new.id);
    end if;
  end if;

  return new;
end;
$$;

comment on function public.handle_new_user is 'On auth.users insert: create profile from metadata.role; if OWNER, create salon from metadata.salon_name.';

-- ---------------------------------------------------------------------------
-- trigger on auth.users
-- ---------------------------------------------------------------------------
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- updated_at maintenance (optional but useful)
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute procedure public.set_updated_at();

create trigger salons_updated_at
  before update on public.salons
  for each row
  execute procedure public.set_updated_at();
