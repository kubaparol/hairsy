# REST API Plan

## 1. Resources

The API is built using Supabase client library (`supabase-js`) directly, following the entity-based architecture pattern. Each resource maps to a database table and is organized as an entity module.

### 1.1 Profiles (`profiles`)

- **Database Table**: `profiles`
- **Entity Module**: `entities/profile/`
- **Description**: User profile data extending Supabase Auth users
- **Key Fields**: `id`, `role`, `first_name`, `email`, `phone`, `created_at`, `updated_at`, `deleted_at`

### 1.2 Salons (`salons`)

- **Database Table**: `salons`
- **Entity Module**: `entities/salon/`
- **Description**: Hair salon information and configuration
- **Key Fields**: `id`, `owner_id`, `name`, `description`, `phone`, `street`, `street_number`, `postal_code`, `city`, `latitude`, `longitude`, `created_at`, `updated_at`, `deleted_at`
- **Relations**: 1:1 with `profiles` (owner), 1:N with `services`, `working_hours`, `bookings`

### 1.3 Services (`services`)

- **Database Table**: `services`
- **Entity Module**: `entities/service/`
- **Description**: Services offered by salons
- **Key Fields**: `id`, `salon_id`, `name`, `description`, `duration_minutes`, `price`, `created_at`, `updated_at`, `deleted_at`
- **Relations**: N:1 with `salons`, 1:N with `bookings`

### 1.4 Working Hours (`working_hours`)

- **Database Table**: `working_hours`
- **Entity Module**: `entities/working-hours/`
- **Description**: Weekly schedule for salon operations
- **Key Fields**: `id`, `salon_id`, `day_of_week`, `open_time`, `close_time`, `created_at`, `updated_at`
- **Relations**: N:1 with `salons`

### 1.5 Bookings (`bookings`)

- **Database Table**: `bookings`
- **Entity Module**: `entities/booking/`
- **Description**: Appointment bookings and manual blocks
- **Key Fields**: `id`, `salon_id`, `client_id`, `service_id`, `type`, `start_time`, `end_time`, `service_name_snapshot`, `service_price_snapshot`, `service_duration_snapshot`, `note`, `created_at`, `updated_at`, `deleted_at`
- **Relations**: N:1 with `salons`, N:1 with `profiles` (client), N:1 with `services`

### 1.6 Consents (`consents`)

- **Database Table**: `consents`
- **Entity Module**: `entities/consent/`
- **Description**: GDPR consent records
- **Key Fields**: `id`, `user_id`, `policy_version`, `accepted_at`, `ip_address`, `user_agent`
- **Relations**: N:1 with `profiles`

## 2. API Functions

All API functions use Supabase client directly. Functions are organized in `api/` directories within each entity module.

### 2.1 Profile Entity

#### 2.1.1 Get Profile

- **Function**: `getProfile(userId: string)`
- **Supabase Query**: `supabase.from('profiles').select('*').eq('id', userId).single()`
- **Description**: Retrieve user profile by ID
- **Authorization**: RLS ensures users can only read their own profile
- **Response**: `Profile | null`
- **Errors**: `SupabaseError` on failure

#### 2.1.2 Update Profile

- **Function**: `updateProfile(userId: string, updates: Partial<Profile>)`
- **Supabase Query**: `supabase.from('profiles').update(updates).eq('id', userId).select().single()`
- **Description**: Update user profile fields
- **Authorization**: RLS ensures users can only update their own profile
- **Request Payload**: `{ first_name?: string, phone?: string }`
- **Response**: `Profile`
- **Errors**: `SupabaseError` on failure

#### 2.1.3 Check Profile Role

- **Function**: `getProfileRole(userId: string)`
- **Supabase Query**: `supabase.from('profiles').select('role').eq('id', userId).single()`
- **Description**: Get user role for authorization checks
- **Response**: `'OWNER' | 'USER' | null`
- **Errors**: `SupabaseError` on failure

### 2.2 Salon Entity

#### 2.2.1 Get Salon by ID

- **Function**: `getSalon(salonId: string)`
- **Supabase Query**: `supabase.from('salons').select('*').eq('id', salonId).is('deleted_at', null).single()`
- **Description**: Retrieve salon details
- **Authorization**: Public for complete salons, owner can see incomplete salons
- **Response**: `Salon | null`
- **Errors**: `SupabaseError` on failure

#### 2.2.2 Get Salon by Owner

- **Function**: `getSalonByOwner(ownerId: string)`
- **Supabase Query**: `supabase.from('salons').select('*').eq('owner_id', ownerId).is('deleted_at', null).maybeSingle()`
- **Description**: Get salon for a specific owner (1:1 relationship)
- **Authorization**: Owner can see their salon even if incomplete
- **Response**: `Salon | null`
- **Errors**: `SupabaseError` on failure

#### 2.2.3 List Complete Salons

- **Function**: `listCompleteSalons(filters?: SalonFilters)`
- **Supabase Query**: Uses view `v_complete_salons` or filters with `is_salon_complete()` function
- **Description**: Get public listing of complete salons
- **Query Parameters**:
  - `city?: string` - Filter by city name
  - `limit?: number` - Pagination limit (default: 50)
  - `offset?: number` - Pagination offset
- **Sorting**: Alphabetically by `name` (ASC)
- **Response**: `{ data: Salon[], count: number }`
- **Errors**: `SupabaseError` on failure

#### 2.2.4 Create Salon

- **Function**: `createSalon(ownerId: string, data: CreateSalonInput)`
- **Supabase Query**: `supabase.from('salons').insert({ ...data, owner_id: ownerId }).select().single()`
- **Description**: Create new salon for owner
- **Authorization**: Only users with `OWNER` role can create salons
- **Request Payload**:
  ```typescript
  {
    name?: string;
    description?: string;
    phone?: string;
    street?: string;
    street_number?: string;
    postal_code?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  }
  ```
- **Response**: `Salon`
- **Errors**: `SupabaseError` on failure (e.g., duplicate owner_id)

#### 2.2.5 Update Salon

- **Function**: `updateSalon(salonId: string, updates: UpdateSalonInput)`
- **Supabase Query**: `supabase.from('salons').update(updates).eq('id', salonId).select().single()`
- **Description**: Update salon information
- **Authorization**: Only salon owner can update
- **Request Payload**: Same as `CreateSalonInput` (all fields optional)
- **Response**: `Salon`
- **Errors**: `SupabaseError` on failure

#### 2.2.6 Check Salon Completeness

- **Function**: `checkSalonCompleteness(salonId: string)`
- **Supabase Query**: `supabase.rpc('is_salon_complete', { p_salon_id: salonId })`
- **Description**: Check if salon meets all requirements for public visibility
- **Response**: `boolean`
- **Errors**: `SupabaseError` on failure

#### 2.2.7 Delete Salon (Soft Delete)

- **Function**: `deleteSalon(salonId: string)`
- **Supabase Query**: `supabase.from('salons').update({ deleted_at: new Date().toISOString() }).eq('id', salonId)`
- **Description**: Soft delete salon
- **Authorization**: Only salon owner can delete
- **Response**: `void`
- **Errors**: `SupabaseError` on failure

### 2.3 Service Entity

#### 2.3.1 Get Service

- **Function**: `getService(serviceId: string)`
- **Supabase Query**: `supabase.from('services').select('*').eq('id', serviceId).is('deleted_at', null).single()`
- **Description**: Retrieve service details
- **Response**: `Service | null`
- **Errors**: `SupabaseError` on failure

#### 2.3.2 List Services by Salon

- **Function**: `listServicesBySalon(salonId: string)`
- **Supabase Query**: `supabase.from('services').select('*').eq('salon_id', salonId).is('deleted_at', null).order('name')`
- **Description**: Get all active services for a salon
- **Authorization**: Public for complete salons, owner can see all
- **Response**: `Service[]`
- **Errors**: `SupabaseError` on failure

#### 2.3.3 Create Service

- **Function**: `createService(salonId: string, data: CreateServiceInput)`
- **Supabase Query**: `supabase.from('services').insert({ ...data, salon_id: salonId }).select().single()`
- **Description**: Create new service for salon
- **Authorization**: Only salon owner can create services
- **Request Payload**:
  ```typescript
  {
    name: string; // Required, max 255 chars
    description?: string;
    duration_minutes: number; // Required, 15-240, multiple of 15
    price: number; // Required, 1-10000 PLN (integer, no decimals)
  }
  ```
- **Response**: `Service`
- **Errors**: `SupabaseError` on validation failure (duration not multiple of 15, price out of range)

#### 2.3.4 Update Service

- **Function**: `updateService(serviceId: string, updates: UpdateServiceInput)`
- **Supabase Query**: `supabase.from('services').update(updates).eq('id', serviceId).select().single()`
- **Description**: Update service information
- **Authorization**: Only salon owner can update
- **Request Payload**: Same as `CreateServiceInput` (all fields optional except constraints)
- **Response**: `Service`
- **Errors**: `SupabaseError` on validation failure

#### 2.3.5 Delete Service

- **Function**: `deleteService(serviceId: string)`
- **Supabase Query**: Check for future bookings first, then soft delete
- **Description**: Soft delete service if no future bookings exist
- **Authorization**: Only salon owner can delete
- **Business Logic**:
  1. Check if service has future ONLINE bookings: `supabase.from('bookings').select('id').eq('service_id', serviceId).gte('start_time', new Date().toISOString()).eq('type', 'ONLINE').is('deleted_at', null)`
  2. If bookings exist, throw error
  3. Otherwise: `supabase.from('services').update({ deleted_at: new Date().toISOString() }).eq('id', serviceId)`
- **Response**: `void`
- **Errors**: `SupabaseError` if future bookings exist or on failure

### 2.4 Working Hours Entity

#### 2.4.1 Get Working Hours by Salon

- **Function**: `getWorkingHoursBySalon(salonId: string)`
- **Supabase Query**: `supabase.from('working_hours').select('*').eq('salon_id', salonId).order('day_of_week')`
- **Description**: Get all working hours for a salon (0-6 days)
- **Authorization**: Public for complete salons, owner can see all
- **Response**: `WorkingHours[]`
- **Errors**: `SupabaseError` on failure

#### 2.4.2 Get Working Hours for Day

- **Function**: `getWorkingHoursForDay(salonId: string, dayOfWeek: number)`
- **Supabase Query**: `supabase.from('working_hours').select('*').eq('salon_id', salonId).eq('day_of_week', dayOfWeek).maybeSingle()`
- **Description**: Get working hours for specific day (0=Sunday, 6=Saturday)
- **Response**: `WorkingHours | null`
- **Errors**: `SupabaseError` on failure

#### 2.4.3 Upsert Working Hours

- **Function**: `upsertWorkingHours(salonId: string, data: WorkingHoursInput[])`
- **Supabase Query**: `supabase.from('working_hours').upsert(data.map(d => ({ ...d, salon_id: salonId })), { onConflict: 'salon_id,day_of_week' })`
- **Description**: Create or update working hours for multiple days
- **Authorization**: Only salon owner can manage working hours
- **Request Payload**:
  ```typescript
  Array<{
    day_of_week: number; // 0-6
    open_time: string; // TIME format (HH:mm:ss)
    close_time: string; // TIME format (HH:mm:ss)
  }>;
  ```
- **Validation**: `open_time < close_time` (enforced by DB constraint)
- **Response**: `WorkingHours[]`
- **Errors**: `SupabaseError` on validation failure

#### 2.4.4 Delete Working Hours

- **Function**: `deleteWorkingHours(salonId: string, dayOfWeek: number)`
- **Supabase Query**: `supabase.from('working_hours').delete().eq('salon_id', salonId).eq('day_of_week', dayOfWeek)`
- **Description**: Remove working hours for a specific day
- **Authorization**: Only salon owner can delete
- **Response**: `void`
- **Errors**: `SupabaseError` on failure

### 2.5 Booking Entity

#### 2.5.1 Get Booking

- **Function**: `getBooking(bookingId: string)`
- **Supabase Query**: `supabase.from('bookings').select('*, service:services(*), salon:salons(*), client:profiles!bookings_client_id_fkey(*)').eq('id', bookingId).is('deleted_at', null).single()`
- **Description**: Retrieve booking with related data
- **Authorization**: Client can see own bookings, owner can see salon bookings
- **Response**: `BookingWithRelations | null`
- **Errors**: `SupabaseError` on failure

#### 2.5.2 List Bookings by Client

- **Function**: `listBookingsByClient(clientId: string, filters?: BookingFilters)`
- **Supabase Query**: Uses view `v_bookings_with_status` or filters bookings
- **Description**: Get all client's bookings with status
- **Query Parameters**:
  - `status?: 'upcoming' | 'completed'` - Filter by status
  - `limit?: number` - Pagination limit
  - `offset?: number` - Pagination offset
- **Response**: `{ data: BookingWithStatus[], count: number }`
- **Errors**: `SupabaseError` on failure

#### 2.5.3 List Bookings by Salon

- **Function**: `listBookingsBySalon(salonId: string, filters?: BookingFilters)`
- **Supabase Query**: `supabase.from('bookings').select('*, service:services(*), client:profiles!bookings_client_id_fkey(*)').eq('salon_id', salonId).is('deleted_at', null).order('start_time', { ascending: true })`
- **Description**: Get all bookings for salon (owner calendar view)
- **Authorization**: Only salon owner can access
- **Query Parameters**:
  - `start_date?: string` - Filter from date (ISO string)
  - `end_date?: string` - Filter to date (ISO string)
  - `type?: 'ONLINE' | 'MANUAL'` - Filter by booking type
  - `status?: 'upcoming' | 'completed'` - Filter by computed status
- **Response**: `{ data: BookingWithRelations[], count: number }`
- **Errors**: `SupabaseError` on failure

#### 2.5.4 Calculate Available Slots

- **Function**: `calculateAvailableSlots(salonId: string, serviceId: string, dateRange: DateRange)`
- **Description**: Calculate free time slots for a service considering working hours and existing bookings
- **Business Logic**:
  1. Get service: `getService(serviceId)` to get `duration_minutes`
  2. Get working hours: `getWorkingHoursBySalon(salonId)`
  3. Get existing bookings: `supabase.from('bookings').select('start_time, end_time').eq('salon_id', salonId).is('deleted_at', null).gte('start_time', dateRange.start).lte('start_time', dateRange.end)`
  4. Generate 15-minute slots within working hours
  5. Filter slots that:
     - Start >= now + 1 hour
     - End <= now + 1 month
     - Don't overlap with existing bookings (ONLINE or MANUAL)
     - Fit within service duration
     - Are within salon working hours for that day
  6. Return available slots
- **Request Payload**:
  ```typescript
  {
    salonId: string;
    serviceId: string;
    startDate: string; // ISO date string
    endDate: string; // ISO date string (max 1 month from start)
  }
  ```
- **Response**: `AvailableSlot[]` where `AvailableSlot = { startTime: string, endTime: string }`
- **Errors**: `SupabaseError` on failure

#### 2.5.5 Create Online Booking

- **Function**: `createOnlineBooking(clientId: string, data: CreateOnlineBookingInput)`
- **Supabase Query**:
  1. Get service to create snapshot: `getService(data.serviceId)`
  2. Insert booking: `supabase.from('bookings').insert({ ...data, client_id: clientId, type: 'ONLINE', service_name_snapshot: service.name, service_price_snapshot: service.price, service_duration_snapshot: service.duration_minutes }).select().single()`
- **Description**: Create ONLINE booking by client
- **Authorization**: Only authenticated users can create ONLINE bookings
- **Request Payload**:
  ```typescript
  {
    salon_id: string;
    service_id: string;
    start_time: string; // ISO timestamp
    end_time: string; // ISO timestamp (calculated: start_time + service duration)
  }
  ```
- **Validation**:
  - `start_time >= now + 1 hour`
  - `start_time <= now + 1 month`
  - Slot must be available (no conflicts)
  - `end_time = start_time + service.duration_minutes`
- **Response**: `Booking`
- **Errors**:
  - `SupabaseError` with constraint violation if double-booking (exclusion constraint)
  - `SupabaseError` if slot unavailable
  - `SupabaseError` if time window violated

#### 2.5.6 Create Manual Block

- **Function**: `createManualBlock(salonId: string, data: CreateManualBlockInput)`
- **Supabase Query**: `supabase.from('bookings').insert({ ...data, salon_id: salonId, type: 'MANUAL', client_id: null, service_id: null, note: data.note || null }).select().single()`
- **Description**: Create MANUAL block by owner
- **Authorization**: Only salon owner can create MANUAL blocks
- **Request Payload**:
  ```typescript
  {
    start_time: string; // ISO timestamp
    end_time: string; // ISO timestamp
    note?: string; // Optional, max 500 chars
  }
  ```
- **Validation**:
  - Slot must be available (no conflicts with ONLINE or other MANUAL)
  - `start_time < end_time`
- **Response**: `Booking`
- **Errors**: `SupabaseError` with constraint violation if conflict

#### 2.5.7 Delete Booking (Soft Delete)

- **Function**: `deleteBooking(bookingId: string)`
- **Supabase Query**: `supabase.from('bookings').update({ deleted_at: new Date().toISOString() }).eq('id', bookingId)`
- **Description**: Soft delete booking
- **Authorization**: Owner can delete any salon booking, client cannot delete (MVP limitation)
- **Response**: `void`
- **Errors**: `SupabaseError` on failure

#### 2.5.8 Get Booking Status

- **Function**: `getBookingStatus(booking: Booking)`
- **Description**: Calculate booking status (computed, not stored)
- **Business Logic**: Use DB function `get_booking_status(end_time)` or compute: `end_time < NOW() ? 'completed' : 'upcoming'`
- **Response**: `'upcoming' | 'completed'`

### 2.6 Consent Entity

#### 2.6.1 Get User Consents

- **Function**: `getUserConsents(userId: string)`
- **Supabase Query**: `supabase.from('consents').select('*').eq('user_id', userId).order('accepted_at', { ascending: false })`
- **Description**: Get all consents for a user
- **Authorization**: Users can only see their own consents
- **Response**: `Consent[]`
- **Errors**: `SupabaseError` on failure

#### 2.6.2 Check Consent

- **Function**: `checkConsent(userId: string, policyVersion: string)`
- **Supabase Query**: `supabase.from('consents').select('*').eq('user_id', userId).eq('policy_version', policyVersion).maybeSingle()`
- **Description**: Check if user has accepted specific policy version
- **Response**: `Consent | null`
- **Errors**: `SupabaseError` on failure

#### 2.6.3 Create Consent

- **Function**: `createConsent(userId: string, data: CreateConsentInput)`
- **Supabase Query**: `supabase.from('consents').insert({ ...data, user_id: userId }).select().single()`
- **Description**: Record user consent acceptance (called during registration)
- **Authorization**: Users can only create their own consents
- **Request Payload**:
  ```typescript
  {
    policy_version: string; // e.g., 'privacy_policy_v1'
    ip_address?: string; // Optional
    user_agent?: string; // Optional
  }
  ```
- **Response**: `Consent`
- **Errors**: `SupabaseError` on duplicate (UNIQUE constraint)

## 3. Queries (React Query Hooks)

Each entity module contains `queries/` directory with React Query hooks for data fetching.

### 3.1 Profile Queries

#### 3.1.1 `useProfile(userId: string)`

- **API Function**: `getProfile`
- **Query Key**: `['profile', userId]`
- **Description**: Fetch user profile
- **Stale Time**: 5 minutes

#### 3.1.2 `useProfileRole(userId: string)`

- **API Function**: `getProfileRole`
- **Query Key**: `['profile', userId, 'role']`
- **Description**: Fetch user role for authorization checks
- **Stale Time**: 5 minutes

### 3.2 Salon Queries

#### 3.2.1 `useSalon(salonId: string)`

- **API Function**: `getSalon`
- **Query Key**: `['salon', salonId]`
- **Description**: Fetch salon details
- **Stale Time**: 5 minutes

#### 3.2.2 `useSalonByOwner(ownerId: string)`

- **API Function**: `getSalonByOwner`
- **Query Key**: `['salon', 'owner', ownerId]`
- **Description**: Fetch salon for owner
- **Stale Time**: 2 minutes (may change during onboarding)

#### 3.2.3 `useCompleteSalons(filters?: SalonFilters)`

- **API Function**: `listCompleteSalons`
- **Query Key**: `['salons', 'complete', filters]`
- **Description**: Fetch public salon listing
- **Stale Time**: 10 minutes

#### 3.2.4 `useSalonCompleteness(salonId: string)`

- **API Function**: `checkSalonCompleteness`
- **Query Key**: `['salon', salonId, 'completeness']`
- **Description**: Check if salon is complete
- **Stale Time**: 1 minute (may change during onboarding)

### 3.3 Service Queries

#### 3.3.1 `useService(serviceId: string)`

- **API Function**: `getService`
- **Query Key**: `['service', serviceId]`
- **Description**: Fetch service details
- **Stale Time**: 5 minutes

#### 3.3.2 `useServicesBySalon(salonId: string)`

- **API Function**: `listServicesBySalon`
- **Query Key**: `['services', 'salon', salonId]`
- **Description**: Fetch all services for salon
- **Stale Time**: 5 minutes

### 3.4 Working Hours Queries

#### 3.4.1 `useWorkingHoursBySalon(salonId: string)`

- **API Function**: `getWorkingHoursBySalon`
- **Query Key**: `['working-hours', 'salon', salonId]`
- **Description**: Fetch working hours for salon
- **Stale Time**: 10 minutes (rarely changes)

### 3.5 Booking Queries

#### 3.5.1 `useBooking(bookingId: string)`

- **API Function**: `getBooking`
- **Query Key**: `['booking', bookingId]`
- **Description**: Fetch booking details
- **Stale Time**: 1 minute (may change)

#### 3.5.2 `useBookingsByClient(clientId: string, filters?: BookingFilters)`

- **API Function**: `listBookingsByClient`
- **Query Key**: `['bookings', 'client', clientId, filters]`
- **Description**: Fetch client's bookings
- **Stale Time**: 30 seconds (frequently changes)

#### 3.5.3 `useBookingsBySalon(salonId: string, filters?: BookingFilters)`

- **API Function**: `listBookingsBySalon`
- **Query Key**: `['bookings', 'salon', salonId, filters]`
- **Description**: Fetch salon bookings (calendar view)
- **Stale Time**: 30 seconds (frequently changes)

#### 3.5.4 `useAvailableSlots(salonId: string, serviceId: string, dateRange: DateRange)`

- **API Function**: `calculateAvailableSlots`
- **Query Key**: `['available-slots', salonId, serviceId, dateRange]`
- **Description**: Fetch available time slots
- **Stale Time**: 10 seconds (very dynamic, slots can be taken quickly)
- **Refetch Interval**: 30 seconds (optional, for real-time updates)

### 3.6 Consent Queries

#### 3.6.1 `useUserConsents(userId: string)`

- **API Function**: `getUserConsents`
- **Query Key**: `['consents', 'user', userId]`
- **Description**: Fetch user consents
- **Stale Time**: 10 minutes

#### 3.6.2 `useConsent(userId: string, policyVersion: string)`

- **API Function**: `checkConsent`
- **Query Key**: `['consent', userId, policyVersion]`
- **Description**: Check if user has accepted specific consent
- **Stale Time**: 10 minutes

## 4. Mutations (React Query Hooks)

Each entity module contains `mutations/` directory with React Query mutation hooks for data modifications.

### 4.1 Profile Mutations

#### 4.1.1 `useUpdateProfile()`

- **API Function**: `updateProfile`
- **Invalidates**: `['profile', userId]`
- **Description**: Update user profile
- **Options**: `onSuccess`, `onError` callbacks

### 4.2 Salon Mutations

#### 4.2.1 `useCreateSalon()`

- **API Function**: `createSalon`
- **Invalidates**: `['salon', 'owner', ownerId]`, `['salons', 'complete']`
- **Description**: Create new salon
- **Options**: `onSuccess`, `onError` callbacks

#### 4.2.2 `useUpdateSalon()`

- **API Function**: `updateSalon`
- **Invalidates**: `['salon', salonId]`, `['salon', 'owner', ownerId]`, `['salons', 'complete']`, `['salon', salonId, 'completeness']`
- **Description**: Update salon information
- **Options**: `onSuccess`, `onError` callbacks

#### 4.2.3 `useDeleteSalon()`

- **API Function**: `deleteSalon`
- **Invalidates**: `['salon', salonId]`, `['salons', 'complete']`
- **Description**: Soft delete salon
- **Options**: `onSuccess`, `onError` callbacks

### 4.3 Service Mutations

#### 4.3.1 `useCreateService()`

- **API Function**: `createService`
- **Invalidates**: `['services', 'salon', salonId]`, `['salon', salonId, 'completeness']`, `['salons', 'complete']`
- **Description**: Create new service
- **Options**: `onSuccess`, `onError` callbacks

#### 4.3.2 `useUpdateService()`

- **API Function**: `updateService`
- **Invalidates**: `['service', serviceId]`, `['services', 'salon', salonId]`
- **Description**: Update service
- **Options**: `onSuccess`, `onError` callbacks

#### 4.3.3 `useDeleteService()`

- **API Function**: `deleteService`
- **Invalidates**: `['service', serviceId]`, `['services', 'salon', salonId]`, `['salon', salonId, 'completeness']`, `['salons', 'complete']`
- **Description**: Delete service (if no future bookings)
- **Options**: `onSuccess`, `onError` callbacks

### 4.4 Working Hours Mutations

#### 4.4.1 `useUpsertWorkingHours()`

- **API Function**: `upsertWorkingHours`
- **Invalidates**: `['working-hours', 'salon', salonId]`, `['salon', salonId, 'completeness']`, `['salons', 'complete']`, `['available-slots']` (all for this salon)
- **Description**: Create or update working hours
- **Options**: `onSuccess`, `onError` callbacks

#### 4.4.2 `useDeleteWorkingHours()`

- **API Function**: `deleteWorkingHours`
- **Invalidates**: `['working-hours', 'salon', salonId]`, `['salon', salonId, 'completeness']`, `['salons', 'complete']`
- **Description**: Delete working hours for a day
- **Options**: `onSuccess`, `onError` callbacks

### 4.5 Booking Mutations

#### 4.5.1 `useCreateOnlineBooking()`

- **API Function**: `createOnlineBooking`
- **Invalidates**:
  - `['bookings', 'client', clientId]`
  - `['bookings', 'salon', salonId]`
  - `['available-slots', salonId, serviceId]` (all date ranges)
- **Description**: Create ONLINE booking
- **Options**: `onSuccess`, `onError` callbacks

#### 4.5.2 `useCreateManualBlock()`

- **API Function**: `createManualBlock`
- **Invalidates**:
  - `['bookings', 'salon', salonId]`
  - `['available-slots', salonId]` (all services, all date ranges)
- **Description**: Create MANUAL block
- **Options**: `onSuccess`, `onError` callbacks

#### 4.5.3 `useDeleteBooking()`

- **API Function**: `deleteBooking`
- **Invalidates**:
  - `['booking', bookingId]`
  - `['bookings', 'client', clientId]` (if ONLINE)
  - `['bookings', 'salon', salonId]`
  - `['available-slots', salonId]` (all services)
- **Description**: Soft delete booking
- **Options**: `onSuccess`, `onError` callbacks

### 4.6 Consent Mutations

#### 4.6.1 `useCreateConsent()`

- **API Function**: `createConsent`
- **Invalidates**: `['consents', 'user', userId]`, `['consent', userId, policyVersion]`
- **Description**: Record consent acceptance
- **Options**: `onSuccess`, `onError` callbacks

## 5. Authentication and Authorization

### 5.1 Authentication Mechanism

- **Provider**: Supabase Auth
- **Method**: Email and password only (MVP)
- **Session Management**: Handled by Supabase client library
- **Token Storage**: Managed by Supabase client (localStorage/sessionStorage)

### 5.2 Authorization (Row Level Security)

All authorization is handled by PostgreSQL Row Level Security (RLS) policies defined in the database schema. The Supabase client automatically enforces these policies.

#### 5.2.1 Profile Authorization

- Users can only read and update their own profile
- Profile creation is automatic on registration (trigger)

#### 5.2.2 Salon Authorization

- Public read access to complete salons only
- Owners can read their own salon (even if incomplete)
- Only users with `OWNER` role can create salons
- Only salon owner can update/delete their salon

#### 5.2.3 Service Authorization

- Public read access to services of complete salons
- Owners can read services of their salons (even if salon incomplete)
- Only salon owner can create/update/delete services

#### 5.2.4 Working Hours Authorization

- Public read access to working hours of complete salons
- Owners can read working hours of their salons
- Only salon owner can create/update/delete working hours

#### 5.2.5 Booking Authorization

- Clients can read their own ONLINE bookings
- Owners can read all bookings of their salon
- Clients can create ONLINE bookings (for themselves)
- Owners can create MANUAL blocks
- Only owners can update/delete bookings

#### 5.2.6 Consent Authorization

- Users can only read and create their own consents

### 5.3 Role-Based Access Control

- **Role Check**: Use `getProfileRole()` or `useProfileRole()` hook before allowing owner-specific actions
- **Frontend Guard**: Check role in React components before rendering owner features
- **Backend Enforcement**: RLS policies enforce role-based access at database level

## 6. Validation and Business Logic

### 6.1 Database-Level Validation

All validation constraints are enforced at the database level via CHECK constraints, foreign keys, and exclusion constraints.

#### 6.1.1 Profile Validation

- `role` must be `'OWNER'` or `'USER'`
- `email` is required and unique (via Supabase Auth)
- `first_name` max 100 characters
- `phone` max 20 characters

#### 6.1.2 Salon Validation

- `owner_id` must be unique (1:1 relationship)
- All address fields are optional but required for completeness check
- `latitude` and `longitude` are optional (for geocoding)

#### 6.1.3 Service Validation

- `name` is required, max 255 characters
- `duration_minutes` must be between 15 and 240, and multiple of 15
- `price` must be between 1 and 10000 (integer, PLN without decimals)

#### 6.1.4 Working Hours Validation

- `day_of_week` must be 0-6 (0=Sunday, 6=Saturday)
- `open_time < close_time` (enforced by CHECK constraint)
- Unique `(salon_id, day_of_week)` (one entry per day)

#### 6.1.5 Booking Validation

- `type` must be `'ONLINE'` or `'MANUAL'`
- `start_time < end_time`
- ONLINE bookings require `client_id` and `service_id`
- MANUAL blocks have `client_id = NULL` and `service_id = NULL`
- Exclusion constraint prevents overlapping bookings (double-booking)
- `note` max 500 characters (only for MANUAL)

### 6.2 Application-Level Validation

#### 6.2.1 Time Window Validation

- **Booking Window**: `start_time >= now + 1 hour` AND `start_time <= now + 1 month`
- **Implementation**: Validate in `createOnlineBooking()` and `createManualBlock()` before database insert
- **Error**: Return validation error if time window violated

#### 6.2.2 Slot Availability Validation

- **Implementation**: Use `calculateAvailableSlots()` to verify slot is available before creating booking
- **Double-Booking Prevention**: Database exclusion constraint provides final protection
- **Error Handling**: Catch exclusion constraint violation and return user-friendly error

#### 6.2.3 Service Deletion Validation

- **Business Rule**: Cannot delete service with future ONLINE bookings
- **Implementation**:
  1. Query for future bookings: `bookings.service_id = serviceId AND bookings.start_time >= NOW() AND bookings.type = 'ONLINE' AND bookings.deleted_at IS NULL`
  2. If any exist, throw error
  3. Otherwise, proceed with soft delete

#### 6.2.4 Salon Completeness Validation

- **Business Rule**: Salon must have: name, phone, full address (street, street_number, postal_code, city), at least 1 working hours entry, at least 1 active service
- **Implementation**: Use database function `is_salon_complete(salon_id)`
- **Usage**: Check before allowing salon to appear in public listing

#### 6.2.5 Duration Validation

- **Business Rule**: Service duration must be multiple of 15 minutes
- **Implementation**: Validate in `createService()` and `updateService()` before database insert
- **Database**: Also enforced by CHECK constraint

### 6.3 Business Logic Implementation

#### 6.3.1 Available Slot Calculation

**Algorithm**:

1. Get service duration: `service.duration_minutes`
2. Get working hours for salon: `getWorkingHoursBySalon(salonId)`
3. Get existing bookings in date range: Query `bookings` table for `salon_id` and time range
4. Generate candidate slots:
   - For each day in date range:
     - Get working hours for that day
     - Generate 15-minute slots from `open_time` to `close_time - duration_minutes`
     - Convert to full timestamps (date + time)
5. Filter candidate slots:
   - Remove slots where `start_time < now + 1 hour`
   - Remove slots where `start_time > now + 1 month`
   - Remove slots that overlap with existing bookings (ONLINE or MANUAL)
   - Remove slots where `end_time > close_time` for that day
6. Return filtered slots

**Time Zone**: All calculations use salon time zone (`Europe/Warsaw`)

#### 6.3.2 Booking Status Calculation

**Algorithm**:

- Use database function: `get_booking_status(end_time)`
- Or compute: `end_time < NOW() ? 'completed' : 'upcoming'`
- Status is computed dynamically, not stored

**Usage**:

- In queries: Use view `v_bookings_with_status` or compute in application
- In React: Compute status from `end_time` field

#### 6.3.3 Snapshot Creation for ONLINE Bookings

**Algorithm**:
When creating ONLINE booking:

1. Fetch service: `getService(serviceId)`
2. Store snapshot fields:
   - `service_name_snapshot = service.name`
   - `service_price_snapshot = service.price`
   - `service_duration_snapshot = service.duration_minutes`
3. Insert booking with snapshots

**Purpose**: Preserve service data at booking time for historical accuracy

#### 6.3.4 Double-Booking Prevention

**Mechanism**:

1. **Application Level**: Check availability before insert using `calculateAvailableSlots()`
2. **Database Level**: Exclusion constraint on `(salon_id, tstzrange(start_time, end_time))` prevents overlapping bookings
3. **Error Handling**: Catch exclusion constraint violation and return user-friendly error

**Race Condition Protection**: Database exclusion constraint provides atomic protection against concurrent booking attempts

#### 6.3.5 Account Deletion and Anonymization

**Algorithm** (when user deletes account):

1. Call database function: `anonymize_user_profile(user_id)`
2. Function updates profile:
   - `first_name = NULL`
   - `email = 'deleted_' || id::text`
   - `phone = NULL`
   - `deleted_at = NOW()`
3. Bookings remain with `client_id` pointing to anonymized profile
4. Consents are deleted (CASCADE)

**Implementation**: Create API function `anonymizeProfile(userId: string)` that calls `supabase.rpc('anonymize_user_profile', { p_user_id: userId })`

## 7. Error Handling

### 7.1 Error Types

All API functions throw `SupabaseError` (from `entities/_shared/errors/supabase-error.ts`) which includes:

- `message`: User-friendly error message
- `code`: Supabase error code
- `details`: Additional error details

### 7.2 Common Error Scenarios

#### 7.2.1 Authentication Errors

- **Session Expired**: `session_not_found` or `invalid_token`
- **Invalid Credentials**: `invalid_credentials`
- **Handling**: Redirect to login, show error message

#### 7.2.2 Authorization Errors

- **RLS Policy Violation**: `new row violates row-level security policy`
- **Handling**: Show "Access Denied" message, log error

#### 7.2.3 Validation Errors

- **Constraint Violation**: Database CHECK constraint failures
- **Examples**:
  - Duration not multiple of 15: `duration_minutes constraint violation`
  - Price out of range: `price constraint violation`
  - Time window violation: Application-level validation error
- **Handling**: Show field-specific error messages

#### 7.2.4 Business Logic Errors

- **Double-Booking**: Exclusion constraint violation
- **Service Deletion with Bookings**: Custom validation error
- **Slot Unavailable**: Returned from availability check
- **Handling**: Show user-friendly error with suggested actions

#### 7.2.5 Not Found Errors

- **Resource Not Found**: `PGRST116` (no rows returned)
- **Handling**: Show "Not Found" message, redirect if appropriate

### 7.3 Error Response Format

All errors follow consistent format:

```typescript
{
  message: string; // User-friendly message
  code?: string; // Supabase error code
  details?: string; // Additional details
}
```

## 8. Performance Considerations

### 8.1 Query Optimization

#### 8.1.1 Indexing

- All queries benefit from indexes defined in database schema:
  - `idx_bookings_salon_time`: For availability queries
  - `idx_salons_city`: For city filtering
  - `idx_bookings_client`: For client panel queries
  - `idx_bookings_salon_start`: For owner calendar queries

#### 8.1.2 Pagination

- List endpoints support pagination via `limit` and `offset`
- Default limit: 50 items
- Consider cursor-based pagination for large datasets

#### 8.1.3 Query Selectivity

- Use `.select()` with specific fields when possible
- Use `.single()` or `.maybeSingle()` for single-row queries
- Avoid fetching unnecessary related data

### 8.2 Caching Strategy

#### 8.2.1 React Query Configuration

- **Stale Time**: Varies by data type (see Query hooks section)
- **Cache Time**: Default 5 minutes
- **Refetch On Window Focus**: Disabled for most queries
- **Refetch On Reconnect**: Enabled

#### 8.2.2 Cache Invalidation

- Mutations invalidate related queries
- Use query key factories for consistent invalidation
- Invalidate parent queries when child data changes

### 8.3 Real-Time Updates

#### 8.3.1 Supabase Realtime (Optional)

- Consider using Supabase Realtime subscriptions for:
  - Available slots updates (when bookings are created)
  - Calendar updates (for owner view)
- Implementation: Use `supabase.channel()` for subscriptions

#### 8.3.2 Polling (Alternative)

- For available slots: Short stale time (10 seconds) with optional refetch interval
- For calendar: Moderate stale time (30 seconds)

## 9. Data Types and Interfaces

### 9.1 Core Types

```typescript
// Profile
interface Profile {
  id: string;
  role: 'OWNER' | 'USER';
  first_name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Salon
interface Salon {
  id: string;
  owner_id: string;
  name: string | null;
  description: string | null;
  phone: string | null;
  street: string | null;
  street_number: string | null;
  postal_code: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Service
interface Service {
  id: string;
  salon_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Working Hours
interface WorkingHours {
  id: string;
  salon_id: string;
  day_of_week: number; // 0-6
  open_time: string; // TIME format
  close_time: string; // TIME format
  created_at: string;
  updated_at: string;
}

// Booking
interface Booking {
  id: string;
  salon_id: string;
  client_id: string | null;
  service_id: string | null;
  type: 'ONLINE' | 'MANUAL';
  start_time: string; // ISO timestamp
  end_time: string; // ISO timestamp
  service_name_snapshot: string | null;
  service_price_snapshot: number | null;
  service_duration_snapshot: number | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Booking with Relations
interface BookingWithRelations extends Booking {
  service?: Service;
  salon?: Salon;
  client?: Profile;
}

// Booking with Status
interface BookingWithStatus extends Booking {
  status: 'upcoming' | 'completed';
  client_first_name?: string | null;
  client_email?: string | null;
  client_phone?: string | null;
}

// Consent
interface Consent {
  id: string;
  user_id: string;
  policy_version: string;
  accepted_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

// Available Slot
interface AvailableSlot {
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
}
```

### 9.2 Input Types

```typescript
// Salon
interface CreateSalonInput {
  name?: string;
  description?: string;
  phone?: string;
  street?: string;
  street_number?: string;
  postal_code?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

interface UpdateSalonInput extends Partial<CreateSalonInput> {}

// Service
interface CreateServiceInput {
  name: string;
  description?: string;
  duration_minutes: number; // 15-240, multiple of 15
  price: number; // 1-10000
}

interface UpdateServiceInput extends Partial<CreateServiceInput> {}

// Working Hours
interface WorkingHoursInput {
  day_of_week: number; // 0-6
  open_time: string; // TIME format
  close_time: string; // TIME format
}

// Booking
interface CreateOnlineBookingInput {
  salon_id: string;
  service_id: string;
  start_time: string; // ISO timestamp
  end_time: string; // ISO timestamp (calculated)
}

interface CreateManualBlockInput {
  start_time: string; // ISO timestamp
  end_time: string; // ISO timestamp
  note?: string; // Max 500 chars
}

// Consent
interface CreateConsentInput {
  policy_version: string;
  ip_address?: string;
  user_agent?: string;
}

// Filters
interface SalonFilters {
  city?: string;
  limit?: number;
  offset?: number;
}

interface BookingFilters {
  start_date?: string;
  end_date?: string;
  type?: 'ONLINE' | 'MANUAL';
  status?: 'upcoming' | 'completed';
  limit?: number;
  offset?: number;
}

interface DateRange {
  start: string; // ISO date string
  end: string; // ISO date string
}
```

## 10. Implementation Notes

### 10.1 Entity Module Structure

Each entity follows this structure:

```
entities/
  {entity-name}/
    api/
      index.ts
      {operation}.ts
    queries/
      index.ts
      query-keys.ts
      use-{query-name}.ts
    mutations/
      index.ts
      use-{mutation-name}.ts
    index.ts
```

### 10.2 Query Key Factory Pattern

Use factory pattern for query keys:

```typescript
export const {entity}Keys = {
  all: ['{entity}'] as const,
  detail: (id: string) => [...{entity}Keys.all, id] as const,
  list: (filters?: Filters) => [...{entity}Keys.all, 'list', filters] as const,
} as const;
```

### 10.3 Error Handling Pattern

All API functions follow this pattern:

```typescript
export async function operation(...args) {
  const { data, error } = await supabase.from('table').operation();

  if (error) {
    throw parseSupabaseError(error);
  }

  return data;
}
```

### 10.4 Time Zone Handling

- All timestamps stored as `TIMESTAMPTZ` (timezone-aware)
- Application uses `Europe/Warsaw` timezone
- Set timezone in Supabase connection or session: `SET timezone = 'Europe/Warsaw'`
- Convert client-side dates to ISO strings with timezone before sending to API

### 10.5 Soft Delete Pattern

- All main entities support soft delete via `deleted_at` column
- Queries filter soft-deleted records: `.is('deleted_at', null)`
- Deletion mutations update `deleted_at` instead of using `.delete()`
- Exception: `working_hours` and `consents` use hard delete

### 10.6 Snapshot Pattern

- ONLINE bookings store service snapshots at creation time
- Snapshots preserve historical accuracy even if service is edited/deleted
- Always use snapshots when displaying booking history

## 11. Testing Considerations

### 11.1 Unit Tests

- Test API functions with mocked Supabase client
- Test validation logic independently
- Test error handling and parsing

### 11.2 Integration Tests

- Test React Query hooks with test query client
- Test cache invalidation logic
- Test error propagation

### 11.3 E2E Tests (Playwright)

- Test complete booking flow
- Test double-booking prevention
- Test authorization boundaries
- Test salon completeness validation

### 11.4 Database Tests

- Test RLS policies with different user roles
- Test exclusion constraints
- Test business logic functions (`is_salon_complete`, `get_booking_status`)

## 12. Security Considerations

### 12.1 Authentication

- All API calls require valid Supabase session
- Session managed by Supabase client library
- Tokens stored securely (localStorage/sessionStorage)

### 12.2 Authorization

- RLS policies enforce authorization at database level
- No need for application-level authorization checks (but can add for UX)
- Always verify user identity via `auth.uid()` in RLS policies

### 12.3 Input Validation

- Validate all inputs at application level before database insert
- Database constraints provide final validation layer
- Sanitize user inputs (especially for text fields)

### 12.4 Rate Limiting

- Consider Supabase rate limiting for API calls
- Implement client-side rate limiting for expensive operations (slot calculation)
- Cache expensive queries appropriately

### 12.5 Data Privacy

- Follow GDPR requirements for consent management
- Implement account deletion/anonymization properly
- Don't expose sensitive data in error messages
- Log errors without user-identifying information
