-- Migration: separate_client_and_business_data
-- Purpose: Separate client personal data from salon data; add client_profiles and employees tables.
-- Affected: new tables public.client_profiles, public.employees; modified trigger handle_new_user.
-- RLS enabled on both new tables with granular policies.

-- ---------------------------------------------------------------------------
-- client_profiles: personal data for USER role (clients)
-- ---------------------------------------------------------------------------
create table public.client_profiles (
  id uuid primary key references public.profiles (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.client_profiles is 'Personal data for clients (role USER); id matches profiles.id.';

-- enable RLS
alter table public.client_profiles enable row level security;

-- authenticated: select own client_profile only
create policy "client_profiles_select_authenticated"
  on public.client_profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- authenticated: update own client_profile only
create policy "client_profiles_update_authenticated"
  on public.client_profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- anon: no direct access (insert is done by trigger with definer)

-- ---------------------------------------------------------------------------
-- employees: salon staff/resources (without user accounts in MVP)
-- ---------------------------------------------------------------------------
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons (id) on delete cascade,
  display_name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.employees is 'Salon employees/resources for bookings; no user accounts in MVP.';

alter table public.employees enable row level security;

-- authenticated: select employees of own salon only
create policy "employees_select_authenticated"
  on public.employees
  for select
  to authenticated
  using (
    salon_id in (
      select id from public.salons where owner_id = auth.uid()
    )
  );

-- authenticated: insert employees to own salon only
create policy "employees_insert_authenticated"
  on public.employees
  for insert
  to authenticated
  with check (
    salon_id in (
      select id from public.salons where owner_id = auth.uid()
    )
  );

-- authenticated: update employees of own salon only
create policy "employees_update_authenticated"
  on public.employees
  for update
  to authenticated
  using (
    salon_id in (
      select id from public.salons where owner_id = auth.uid()
    )
  )
  with check (
    salon_id in (
      select id from public.salons where owner_id = auth.uid()
    )
  );

-- authenticated: delete employees of own salon only
create policy "employees_delete_authenticated"
  on public.employees
  for delete
  to authenticated
  using (
    salon_id in (
      select id from public.salons where owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- updated_at triggers for new tables
-- ---------------------------------------------------------------------------
create trigger client_profiles_updated_at
  before update on public.client_profiles
  for each row
  execute procedure public.set_updated_at();

create trigger employees_updated_at
  before update on public.employees
  for each row
  execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- updated trigger function: handle both business and client signup
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
  first_name_value text;
  last_name_value text;
begin
  -- role from metadata or default USER
  user_role_value := coalesce(
    (new.raw_user_meta_data->>'role')::public.user_role,
    'USER'::public.user_role
  );

  -- always create profile
  insert into public.profiles (id, role)
  values (new.id, user_role_value);

  -- if OWNER, create salon
  if user_role_value = 'OWNER' then
    salon_name_value := new.raw_user_meta_data->>'salon_name';
    if salon_name_value is not null and trim(salon_name_value) != '' then
      insert into public.salons (name, owner_id)
      values (trim(salon_name_value), new.id);
    end if;
  end if;

  -- if USER, create client_profile
  if user_role_value = 'USER' then
    first_name_value := new.raw_user_meta_data->>'first_name';
    last_name_value := new.raw_user_meta_data->>'last_name';
    
    if first_name_value is not null and last_name_value is not null then
      insert into public.client_profiles (id, first_name, last_name, phone_number)
      values (
        new.id,
        trim(first_name_value),
        trim(last_name_value),
        new.raw_user_meta_data->>'phone_number'
      );
    end if;
  end if;

  return new;
end;
$$;

comment on function public.handle_new_user is 'On auth.users insert: create profile; if OWNER create salon, if USER create client_profile.';
