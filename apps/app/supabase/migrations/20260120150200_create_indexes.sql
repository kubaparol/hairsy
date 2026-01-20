-- migration: create indexes
-- purpose: add performance indexes for common query patterns
-- affected tables: profiles, salons, services, working_hours, bookings, consents
-- notes: all indexes on soft-deletable tables include where deleted_at is null filter

-- =============================================================================
-- profiles indexes
-- =============================================================================

-- index for looking up users by role (e.g., finding all owners)
create index idx_profiles_role on profiles (role)
where deleted_at is null;

comment on index idx_profiles_role is 'fast lookup of users by role, excludes deleted profiles';

-- =============================================================================
-- salons indexes
-- =============================================================================

-- index for filtering salons by city (primary filter in salon search)
create index idx_salons_city on salons (city)
where deleted_at is null;

comment on index idx_salons_city is 'enables fast city-based salon filtering, excludes deleted salons';

-- =============================================================================
-- services indexes
-- =============================================================================

-- index for retrieving all services for a specific salon
create index idx_services_salon on services (salon_id)
where deleted_at is null;

comment on index idx_services_salon is 'fast retrieval of all active services for a salon';

-- =============================================================================
-- working_hours indexes
-- =============================================================================

-- index for retrieving working hours for a specific salon
create index idx_working_hours_salon on working_hours (salon_id);

comment on index idx_working_hours_salon is 'fast retrieval of weekly schedule for a salon';

-- =============================================================================
-- bookings indexes
-- =============================================================================

-- composite index for availability queries (most critical for performance)
-- covers queries checking salon availability within a time range
create index idx_bookings_salon_time on bookings (salon_id, start_time, end_time)
where deleted_at is null;

comment on index idx_bookings_salon_time is 'critical index for availability queries, excludes deleted bookings';

-- index for owner calendar view (retrieving all bookings for salon sorted by start_time)
create index idx_bookings_salon_start on bookings (salon_id, start_time)
where deleted_at is null;

comment on index idx_bookings_salon_start is 'optimizes owner calendar view, supports time-ordered booking retrieval';

-- index for client bookings panel (my reservations)
create index idx_bookings_client on bookings (client_id)
where deleted_at is null;

comment on index idx_bookings_client is 'enables fast retrieval of all client bookings';

-- =============================================================================
-- consents indexes
-- =============================================================================

-- index for retrieving all consents for a specific user
create index idx_consents_user on consents (user_id);

comment on index idx_consents_user is 'fast retrieval of all consent records for a user';
