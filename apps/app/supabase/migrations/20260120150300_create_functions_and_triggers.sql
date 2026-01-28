-- migration: create functions and triggers
-- purpose: add database functions and triggers for business logic
-- affected tables: profiles, salons, services, working_hours, bookings
-- functions: update_updated_at_column, is_salon_complete, anonymize_user_profile, get_booking_status

-- =============================================================================
-- function: update_updated_at_column
-- purpose: automatically update the updated_at timestamp on row update
-- usage: attached to tables via trigger
-- =============================================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

comment on function update_updated_at_column is 'trigger function to automatically update updated_at column on row modification';

-- =============================================================================
-- triggers: attach update_updated_at_column to all tables with updated_at
-- =============================================================================

-- trigger for profiles table
create trigger tr_profiles_updated_at
    before update on profiles
    for each row
    execute function update_updated_at_column();

comment on trigger tr_profiles_updated_at on profiles is 'automatically updates updated_at timestamp on profile modification';

-- trigger for salons table
create trigger tr_salons_updated_at
    before update on salons
    for each row
    execute function update_updated_at_column();

comment on trigger tr_salons_updated_at on salons is 'automatically updates updated_at timestamp on salon modification';

-- trigger for services table
create trigger tr_services_updated_at
    before update on services
    for each row
    execute function update_updated_at_column();

comment on trigger tr_services_updated_at on services is 'automatically updates updated_at timestamp on service modification';

-- trigger for working_hours table
create trigger tr_working_hours_updated_at
    before update on working_hours
    for each row
    execute function update_updated_at_column();

comment on trigger tr_working_hours_updated_at on working_hours is 'automatically updates updated_at timestamp on working hours modification';

-- trigger for bookings table
create trigger tr_bookings_updated_at
    before update on bookings
    for each row
    execute function update_updated_at_column();

comment on trigger tr_bookings_updated_at on bookings is 'automatically updates updated_at timestamp on booking modification';

-- =============================================================================
-- function: is_salon_complete
-- purpose: check if salon has all required data to be publicly visible
-- requirements: name, phone, full address, at least 1 working hours entry, at least 1 active service
-- returns: boolean indicating completeness
-- =============================================================================
create or replace function is_salon_complete(p_salon_id uuid)
returns boolean as $$
declare
    v_salon_data_complete boolean;
    v_has_working_hours boolean;
    v_has_services boolean;
begin
    -- check if salon has all required data fields populated
    select
        (name is not null and name != '' and
         phone is not null and phone != '' and
         street is not null and street != '' and
         street_number is not null and street_number != '' and
         postal_code is not null and postal_code != '' and
         city is not null and city != '')
    into v_salon_data_complete
    from salons
    where id = p_salon_id and deleted_at is null;

    -- return false if salon not found or data incomplete
    if v_salon_data_complete is null or not v_salon_data_complete then
        return false;
    end if;

    -- check if salon has at least one day of working hours defined
    select exists (
        select 1 from working_hours
        where salon_id = p_salon_id
    ) into v_has_working_hours;

    if not v_has_working_hours then
        return false;
    end if;

    -- check if salon has at least one active service
    -- use SECURITY DEFINER to bypass RLS and avoid recursion
    select exists (
        select 1 from services
        where salon_id = p_salon_id and deleted_at is null
    ) into v_has_services;

    return v_has_services;
end;
$$ language plpgsql stable security definer;

comment on function is_salon_complete is 'validates salon completeness: all required fields, working hours, and active services';

-- =============================================================================
-- function: anonymize_user_profile
-- purpose: gdpr-compliant user profile anonymization
-- behavior: clears personal data while preserving referential integrity
-- usage: called when user requests account deletion
-- =============================================================================
create or replace function anonymize_user_profile(p_user_id uuid)
returns void as $$
begin
    -- anonymize profile data
    -- email set to unique deleted marker
    -- first_name and phone set to null
    -- deleted_at timestamp recorded
    update profiles
    set
        first_name = null,
        email = 'deleted_' || id::text,
        phone = null,
        deleted_at = now()
    where id = p_user_id;
end;
$$ language plpgsql;

comment on function anonymize_user_profile is 'gdpr-compliant profile anonymization, preserves booking history references';

-- =============================================================================
-- function: get_booking_status
-- purpose: compute booking status dynamically based on end time
-- returns: 'completed' if end_time in past, 'upcoming' otherwise
-- usage: can be used in views or queries for status display
-- =============================================================================
create or replace function get_booking_status(p_end_time timestamptz)
returns text as $$
begin
    -- status is computed dynamically based on current time
    -- 'completed': booking end time has passed
    -- 'upcoming': booking end time is in the future
    if p_end_time < now() then
        return 'completed';
    else
        return 'upcoming';
    end if;
end;
$$ language plpgsql immutable;

comment on function get_booking_status is 'computes booking status dynamically: completed (past) or upcoming (future)';
