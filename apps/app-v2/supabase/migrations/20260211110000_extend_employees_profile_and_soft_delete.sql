-- Migration: extend_employees_profile_and_soft_delete
-- Purpose: Extend employees with richer profile fields, soft-delete metadata,
--          validation constraints, and performance indexes.
-- Affected: public.employees table, trigger function for display_name sync.

-- ---------------------------------------------------------------------------
-- add profile fields and soft-delete metadata
-- ---------------------------------------------------------------------------
alter table public.employees
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists bio text,
  add column if not exists avatar_url text,
  add column if not exists phone_number text,
  add column if not exists email text,
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by uuid references public.profiles (id) on delete set null;

-- Backfill first_name / last_name from existing display_name for compatibility.
update public.employees
set
  first_name = coalesce(
    nullif(trim(split_part(display_name, ' ', 1)), ''),
    'Pracownik'
  ),
  last_name = coalesce(
    nullif(trim(regexp_replace(display_name, '^\S+\s*', '')), ''),
    'Brak'
  )
where first_name is null
   or last_name is null;

-- Required fields for the new employee form contract.
alter table public.employees
  alter column first_name set not null,
  alter column last_name set not null;

-- ---------------------------------------------------------------------------
-- lightweight data quality constraints
-- ---------------------------------------------------------------------------
alter table public.employees
  add constraint employees_first_name_len_chk
    check (char_length(trim(first_name)) between 1 and 80),
  add constraint employees_last_name_len_chk
    check (char_length(trim(last_name)) between 1 and 80),
  add constraint employees_bio_len_chk
    check (bio is null or char_length(bio) <= 500),
  add constraint employees_avatar_url_len_chk
    check (avatar_url is null or char_length(avatar_url) <= 2048),
  add constraint employees_phone_len_chk
    check (phone_number is null or char_length(trim(phone_number)) between 6 and 32),
  add constraint employees_email_format_chk
    check (
      email is null
      or (
        char_length(trim(email)) <= 320
        and lower(trim(email)) ~ '^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$'
      )
    );

-- ---------------------------------------------------------------------------
-- keep display_name synchronized with first + last name
-- ---------------------------------------------------------------------------
create or replace function public.sync_employee_display_name()
returns trigger
language plpgsql
as $$
begin
  new.first_name := trim(new.first_name);
  new.last_name := trim(new.last_name);
  new.display_name := trim(concat_ws(' ', new.first_name, new.last_name));
  return new;
end;
$$;

drop trigger if exists employees_sync_display_name on public.employees;

create trigger employees_sync_display_name
  before insert or update of first_name, last_name
  on public.employees
  for each row
  execute procedure public.sync_employee_display_name();

-- Ensure existing records are normalized after trigger creation.
update public.employees
set
  first_name = trim(first_name),
  last_name = trim(last_name)
where true;

comment on function public.sync_employee_display_name is
  'Synchronizes employees.display_name from first_name and last_name.';

-- ---------------------------------------------------------------------------
-- query performance indexes for employees list + filtering
-- ---------------------------------------------------------------------------
create index if not exists employees_salon_created_idx
  on public.employees (salon_id, created_at desc);

create index if not exists employees_salon_is_active_created_idx
  on public.employees (salon_id, is_active, created_at desc);

create index if not exists employees_not_deleted_idx
  on public.employees (salon_id, deleted_at)
  where deleted_at is null;
