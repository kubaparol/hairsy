-- migration: create base tables
-- purpose: create the foundational tables for the hairsy salon booking system
-- affected tables: profiles, salons, services, working_hours, consents
-- dependencies: requires supabase auth.users table
-- notes: all tables use soft delete pattern with deleted_at column

-- =============================================================================
-- table: profiles
-- purpose: extends supabase auth.users with profile data for salon owners and clients
-- relationships: 1:1 with auth.users, 1:1 with salons (for owners), 1:n with bookings (as client)
-- =============================================================================
create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    role varchar(10) not null check (role in ('OWNER', 'USER')),
    first_name varchar(100),
    email varchar(255) not null,
    phone varchar(20),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- enable row level security on profiles table
-- rls policies will be added in a separate migration
alter table profiles enable row level security;

-- add comment explaining the table purpose
comment on table profiles is 'user profiles extending supabase auth.users with role-based data';
comment on column profiles.role is 'user role: OWNER for salon owners, USER for clients';
comment on column profiles.deleted_at is 'soft delete timestamp, also used for gdpr anonymization';

-- =============================================================================
-- table: salons
-- purpose: stores hair salon information including location and contact details
-- relationships: 1:1 with profiles (owner), 1:n with services, working_hours, bookings
-- =============================================================================
create table salons (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null unique references profiles(id) on delete cascade,
    name varchar(255),
    description text,
    phone varchar(20),
    street varchar(255),
    street_number varchar(20),
    postal_code varchar(10),
    city varchar(100),
    latitude decimal(10, 8),
    longitude decimal(11, 8),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- enable row level security on salons table
alter table salons enable row level security;

-- add comments explaining table structure
comment on table salons is 'hair salon information, one salon per owner (mvp constraint)';
comment on column salons.owner_id is 'unique constraint enforces 1:1 relationship with owner';
comment on column salons.deleted_at is 'soft delete timestamp';

-- =============================================================================
-- table: services
-- purpose: services offered by salons with pricing and duration
-- relationships: n:1 with salons, 1:n with bookings
-- =============================================================================
create table services (
    id uuid primary key default gen_random_uuid(),
    salon_id uuid not null references salons(id) on delete cascade,
    name varchar(255) not null,
    description text,
    duration_minutes integer not null check (
        duration_minutes >= 15 and
        duration_minutes <= 240 and
        duration_minutes % 15 = 0
    ),
    price integer not null check (price >= 1 and price <= 10000),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- enable row level security on services table
alter table services enable row level security;

-- add comments explaining constraints
comment on table services is 'services offered by salons with pricing in pln (no cents)';
comment on column services.duration_minutes is 'duration in minutes, must be multiple of 15, range 15-240';
comment on column services.price is 'price in pln without cents, range 1-10000';

-- =============================================================================
-- table: working_hours
-- purpose: weekly schedule for salon opening hours
-- relationships: n:1 with salons
-- =============================================================================
create table working_hours (
    id uuid primary key default gen_random_uuid(),
    salon_id uuid not null references salons(id) on delete cascade,
    day_of_week integer not null check (day_of_week >= 0 and day_of_week <= 6),
    open_time time not null,
    close_time time not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (salon_id, day_of_week),
    check (open_time < close_time)
);

-- enable row level security on working_hours table
alter table working_hours enable row level security;

-- add comments explaining day_of_week convention
comment on table working_hours is 'weekly schedule for salon operating hours';
comment on column working_hours.day_of_week is 'day of week: 0=sunday, 1=monday, ..., 6=saturday';
comment on column working_hours.open_time is 'opening time, must be before close_time';

-- =============================================================================
-- table: consents
-- purpose: gdpr consent tracking for users
-- relationships: n:1 with profiles
-- =============================================================================
create table consents (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    policy_version varchar(50) not null,
    accepted_at timestamptz not null default now(),
    ip_address inet,
    user_agent text,
    unique (user_id, policy_version)
);

-- enable row level security on consents table
alter table consents enable row level security;

-- add comments explaining gdpr tracking
comment on table consents is 'gdpr consent tracking with versioning';
comment on column consents.policy_version is 'policy version identifier (e.g., privacy_policy_v1)';
comment on column consents.ip_address is 'ip address at time of consent acceptance';
comment on column consents.user_agent is 'browser user agent at time of consent acceptance';
