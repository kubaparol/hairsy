-- migration: fix is_salon_complete recursion issue
-- purpose: add SECURITY DEFINER to is_salon_complete function to prevent RLS recursion
-- issue: function was called by RLS policies, which caused infinite recursion when checking services
-- solution: use SECURITY DEFINER to bypass RLS when checking completeness

-- =============================================================================
-- function: is_salon_complete (updated)
-- purpose: check if salon has all required data to be publicly visible
-- change: add SECURITY DEFINER to bypass RLS and prevent recursion
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
    -- SECURITY DEFINER allows function to bypass RLS and avoid recursion
    -- when RLS policies on services table call is_salon_complete
    select exists (
        select 1 from services
        where salon_id = p_salon_id and deleted_at is null
    ) into v_has_services;

    return v_has_services;
end;
$$ language plpgsql stable security definer;

comment on function is_salon_complete is 'validates salon completeness: all required fields, working hours, and active services. Uses SECURITY DEFINER to bypass RLS and prevent recursion.';
