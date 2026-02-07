-- Migration: create_consents
-- Purpose: Table for storing GDPR and other consent records; extends handle_new_user trigger to record consent on signup.
-- Affected: new table public.consents; new enum public.consent_type; modified trigger handle_new_user.
-- GDPR Compliance: Stores proof of consent with timestamp, terms version, and optional metadata.

-- ---------------------------------------------------------------------------
-- enum type for consent categories
-- ---------------------------------------------------------------------------
create type public.consent_type as enum (
  'TERMS_AND_PRIVACY',  -- Akceptacja regulaminu i polityki prywatności (wymagana)
  'MARKETING'           -- Opcjonalna zgoda marketingowa (na przyszłość)
);

-- ---------------------------------------------------------------------------
-- consents: audit log of user consents
-- ---------------------------------------------------------------------------
create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  consent_type public.consent_type not null,
  granted_at timestamptz not null default now(),
  terms_version text not null,          -- wersja regulaminu/polityki, np. "2026-02-01"
  ip_address inet,                       -- opcjonalne, do audytu
  user_agent text,                       -- opcjonalne, do audytu
  revoked_at timestamptz,                -- null = aktywna zgoda

  constraint unique_active_consent unique (user_id, consent_type, revoked_at)
);

comment on table public.consents is 'Audit log of user consents for GDPR compliance. Each row represents a consent grant or revocation.';
comment on column public.consents.terms_version is 'Version identifier of terms/privacy policy accepted (e.g. date or semver)';
comment on column public.consents.revoked_at is 'When consent was revoked; NULL means consent is active';

-- ---------------------------------------------------------------------------
-- RLS policies for consents
-- ---------------------------------------------------------------------------
alter table public.consents enable row level security;

-- authenticated: select own consents only
create policy "consents_select_authenticated"
  on public.consents
  for select
  to authenticated
  using (auth.uid() = user_id);

-- no insert/update/delete policies for authenticated users
-- inserts are done by trigger with security definer

-- ---------------------------------------------------------------------------
-- extend handle_new_user trigger to record GDPR consent
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
  gdpr_accepted_value boolean;
  terms_version_value text;
  ip_address_value inet;
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

  -- Record GDPR consent if provided
  gdpr_accepted_value := coalesce((new.raw_user_meta_data->>'gdpr_accepted')::boolean, false);
  
  if gdpr_accepted_value = true then
    terms_version_value := coalesce(new.raw_user_meta_data->>'terms_version', '2026-02-01');
    
    -- Safely parse IP address (may be null or invalid)
    begin
      ip_address_value := (new.raw_user_meta_data->>'ip_address')::inet;
    exception when others then
      ip_address_value := null;
    end;

    insert into public.consents (
      user_id,
      consent_type,
      terms_version,
      ip_address,
      user_agent
    ) values (
      new.id,
      'TERMS_AND_PRIVACY',
      terms_version_value,
      ip_address_value,
      new.raw_user_meta_data->>'user_agent'
    );
  end if;

  return new;
end;
$$;

comment on function public.handle_new_user is 'On auth.users insert: create profile from metadata.role; if OWNER, create salon from metadata.salon_name; record GDPR consent if gdpr_accepted=true.';
