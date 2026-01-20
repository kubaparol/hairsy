-- migration: create views
-- purpose: create helper views for common query patterns
-- affected views: v_complete_salons, v_bookings_with_status
-- notes: views simplify client queries and provide computed columns

-- =============================================================================
-- view: v_complete_salons
-- purpose: provides public list of salons ready for booking
-- usage: use this view for salon search and listing pages
-- filters: only includes complete and non-deleted salons
-- =============================================================================
create view v_complete_salons as
select
    s.id,
    s.name,
    s.description,
    s.phone,
    s.street,
    s.street_number,
    s.postal_code,
    s.city,
    s.latitude,
    s.longitude
from salons s
where s.deleted_at is null
and is_salon_complete(s.id);

comment on view v_complete_salons is 'public list of complete salons ready for booking, excludes incomplete/deleted salons';

-- =============================================================================
-- view: v_bookings_with_status
-- purpose: bookings with computed status and denormalized client info
-- usage: use this view for calendar displays and booking lists
-- computed columns: status (upcoming/completed based on end_time)
-- includes: client name, email, phone for display purposes
-- =============================================================================
create view v_bookings_with_status as
select
    b.id,
    b.salon_id,
    b.client_id,
    b.service_id,
    b.type,
    b.start_time,
    b.end_time,
    b.service_name_snapshot,
    b.service_price_snapshot,
    b.service_duration_snapshot,
    b.note,
    b.created_at,
    b.updated_at,
    b.deleted_at,
    -- computed status column
    get_booking_status(b.end_time) as status,
    -- denormalized client information for display
    p.first_name as client_first_name,
    p.email as client_email,
    p.phone as client_phone
from bookings b
left join profiles p on b.client_id = p.id
where b.deleted_at is null;

comment on view v_bookings_with_status is 'bookings with computed status and client info, excludes deleted bookings';
comment on column v_bookings_with_status.status is 'computed status: upcoming (future) or completed (past)';
comment on column v_bookings_with_status.client_first_name is 'denormalized client name for display, null for manual blocks or deleted clients';
comment on column v_bookings_with_status.client_email is 'denormalized client email for display, null for manual blocks or deleted clients';
comment on column v_bookings_with_status.client_phone is 'denormalized client phone for display, null for manual blocks or deleted clients';
