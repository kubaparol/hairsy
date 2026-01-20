-- migration: create bookings table
-- purpose: create the bookings table for online reservations and manual blocks
-- affected tables: bookings
-- dependencies: requires btree_gist extension, profiles, salons, services tables
-- notes: uses exclusion constraint to prevent double-booking at database level

-- =============================================================================
-- extension: btree_gist
-- purpose: required for exclusion constraint on overlapping time ranges
-- =============================================================================
create extension if not exists btree_gist;

comment on extension btree_gist is 'enables gist indexes on btree types, required for booking overlap prevention';

-- =============================================================================
-- table: bookings
-- purpose: stores both online client reservations and manual owner blocks
-- relationships: n:1 with salons, n:1 with profiles (as client), n:1 with services
-- =============================================================================
create table bookings (
    id uuid primary key default gen_random_uuid(),
    salon_id uuid not null references salons(id) on delete cascade,
    client_id uuid references profiles(id) on delete set null,
    service_id uuid references services(id) on delete set null,
    type varchar(10) not null check (type in ('ONLINE', 'MANUAL')),
    start_time timestamptz not null,
    end_time timestamptz not null,
    service_name_snapshot varchar(255),
    service_price_snapshot integer,
    service_duration_snapshot integer,
    note varchar(500),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz,
    
    -- time range validation
    check (start_time < end_time),
    
    -- online bookings require client_id
    check (type = 'MANUAL' or client_id is not null),
    
    -- online bookings require service_id
    check (type = 'MANUAL' or service_id is not null),
    
    -- note field is only for manual blocks, max 500 chars
    check (type = 'ONLINE' or note is null or length(note) <= 500),
    
    -- exclusion constraint prevents overlapping bookings for the same salon
    -- only applies to non-deleted bookings
    -- this prevents double-booking at the database level, eliminating race conditions
    exclude using gist (
        salon_id with =,
        tstzrange(start_time, end_time) with &&
    ) where (deleted_at is null)
);

-- enable row level security on bookings table
alter table bookings enable row level security;

-- add comprehensive comments explaining booking types and constraints
comment on table bookings is 'client reservations and owner manual blocks with atomic double-booking prevention';
comment on column bookings.type is 'ONLINE: client reservation via app, MANUAL: owner block in calendar';
comment on column bookings.client_id is 'client profile, null for manual blocks, set null on client deletion';
comment on column bookings.service_id is 'service reference, null for manual blocks, set null on service deletion';
comment on column bookings.service_name_snapshot is 'snapshot of service name at booking time (for online bookings)';
comment on column bookings.service_price_snapshot is 'snapshot of service price at booking time (for online bookings)';
comment on column bookings.service_duration_snapshot is 'snapshot of service duration at booking time (for online bookings)';
comment on column bookings.note is 'optional note for manual blocks (max 500 chars)';
comment on column bookings.deleted_at is 'soft delete timestamp, deleted bookings do not count for overlap constraint';

-- add comment on the exclusion constraint
comment on constraint bookings_salon_id_tstzrange_excl on bookings is 
    'prevents overlapping bookings for the same salon, only applies to non-deleted bookings';
