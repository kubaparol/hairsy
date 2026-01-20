-- migration: create rls policies
-- purpose: implement row level security policies for all tables
-- affected tables: profiles, salons, services, working_hours, bookings, consents
-- security model: owner can manage their salon, clients can view/book, public can view complete salons

-- =============================================================================
-- rls policies for profiles table
-- security model: users can only see and edit their own profile
-- =============================================================================

-- anon role: select policy (no access for anonymous users)
create policy profiles_select_anon on profiles
    for select
    to anon
    using (false);

comment on policy profiles_select_anon on profiles is 'anonymous users cannot view profiles';

-- anon role: insert policy (no access for anonymous users)
create policy profiles_insert_anon on profiles
    for insert
    to anon
    with check (false);

comment on policy profiles_insert_anon on profiles is 'anonymous users cannot create profiles';

-- anon role: update policy (no access for anonymous users)
create policy profiles_update_anon on profiles
    for update
    to anon
    using (false);

comment on policy profiles_update_anon on profiles is 'anonymous users cannot update profiles';

-- authenticated role: select own profile
create policy profiles_select_own on profiles
    for select
    to authenticated
    using (auth.uid() = id);

comment on policy profiles_select_own on profiles is 'authenticated users can view their own profile';

-- authenticated role: insert own profile (for profile creation after signup)
create policy profiles_insert_own on profiles
    for insert
    to authenticated
    with check (auth.uid() = id);

comment on policy profiles_insert_own on profiles is 'users can create their own profile after authentication';

-- authenticated role: update own profile
create policy profiles_update_own on profiles
    for update
    to authenticated
    using (auth.uid() = id);

comment on policy profiles_update_own on profiles is 'authenticated users can update their own profile';

-- =============================================================================
-- rls policies for salons table
-- security model: public can view complete salons, owners manage their own salon
-- =============================================================================

-- anon role: select complete salons
create policy salons_select_complete_anon on salons
    for select
    to anon
    using (
        deleted_at is null and
        is_salon_complete(id)
    );

comment on policy salons_select_complete_anon on salons is 'anonymous users can view complete salons only';

-- anon role: insert policy (no access for anonymous users)
create policy salons_insert_anon on salons
    for insert
    to anon
    with check (false);

comment on policy salons_insert_anon on salons is 'anonymous users cannot create salons';

-- anon role: update policy (no access for anonymous users)
create policy salons_update_anon on salons
    for update
    to anon
    using (false);

comment on policy salons_update_anon on salons is 'anonymous users cannot update salons';

-- anon role: delete policy (no access for anonymous users)
create policy salons_delete_anon on salons
    for delete
    to anon
    using (false);

comment on policy salons_delete_anon on salons is 'anonymous users cannot delete salons';

-- authenticated role: select complete salons (same as anon)
create policy salons_select_complete_authenticated on salons
    for select
    to authenticated
    using (
        deleted_at is null and
        is_salon_complete(id)
    );

comment on policy salons_select_complete_authenticated on salons is 'authenticated users can view complete salons';

-- authenticated role: select own salon (even if incomplete)
create policy salons_select_own on salons
    for select
    to authenticated
    using (
        deleted_at is null and
        owner_id = auth.uid()
    );

comment on policy salons_select_own on salons is 'owners can view their own salon even if incomplete';

-- authenticated role: insert own salon (only for owner role)
create policy salons_insert_owner on salons
    for insert
    to authenticated
    with check (
        owner_id = auth.uid() and
        exists (
            select 1 from profiles
            where id = auth.uid() and role = 'OWNER' and deleted_at is null
        )
    );

comment on policy salons_insert_owner on salons is 'only users with owner role can create salons';

-- authenticated role: update own salon
create policy salons_update_own on salons
    for update
    to authenticated
    using (owner_id = auth.uid())
    with check (owner_id = auth.uid());

comment on policy salons_update_own on salons is 'owners can update their own salon';

-- authenticated role: delete own salon (soft delete)
create policy salons_delete_own on salons
    for delete
    to authenticated
    using (owner_id = auth.uid());

comment on policy salons_delete_own on salons is 'owners can delete their own salon';

-- =============================================================================
-- rls policies for services table
-- security model: public can view services of complete salons, owners manage their services
-- =============================================================================

-- anon role: select services of complete salons
create policy services_select_public_anon on services
    for select
    to anon
    using (
        deleted_at is null and
        exists (
            select 1 from salons
            where salons.id = services.salon_id
            and salons.deleted_at is null
            and is_salon_complete(salons.id)
        )
    );

comment on policy services_select_public_anon on services is 'anonymous users can view services of complete salons only';

-- anon role: insert policy (no access for anonymous users)
create policy services_insert_anon on services
    for insert
    to anon
    with check (false);

comment on policy services_insert_anon on services is 'anonymous users cannot create services';

-- anon role: update policy (no access for anonymous users)
create policy services_update_anon on services
    for update
    to anon
    using (false);

comment on policy services_update_anon on services is 'anonymous users cannot update services';

-- anon role: delete policy (no access for anonymous users)
create policy services_delete_anon on services
    for delete
    to anon
    using (false);

comment on policy services_delete_anon on services is 'anonymous users cannot delete services';

-- authenticated role: select services of complete salons
create policy services_select_public_authenticated on services
    for select
    to authenticated
    using (
        deleted_at is null and
        exists (
            select 1 from salons
            where salons.id = services.salon_id
            and salons.deleted_at is null
            and is_salon_complete(salons.id)
        )
    );

comment on policy services_select_public_authenticated on services is 'authenticated users can view services of complete salons';

-- authenticated role: select own salon services (even if salon incomplete)
create policy services_select_own on services
    for select
    to authenticated
    using (
        deleted_at is null and
        exists (
            select 1 from salons
            where salons.id = services.salon_id
            and salons.owner_id = auth.uid()
        )
    );

comment on policy services_select_own on services is 'owners can view their salon services even if salon incomplete';

-- authenticated role: insert services for own salon
create policy services_insert_own on services
    for insert
    to authenticated
    with check (
        exists (
            select 1 from salons
            where salons.id = services.salon_id
            and salons.owner_id = auth.uid()
        )
    );

comment on policy services_insert_own on services is 'owners can create services for their salon';

-- authenticated role: update own salon services
create policy services_update_own on services
    for update
    to authenticated
    using (
        exists (
            select 1 from salons
            where salons.id = services.salon_id
            and salons.owner_id = auth.uid()
        )
    );

comment on policy services_update_own on services is 'owners can update their salon services';

-- authenticated role: delete own salon services
create policy services_delete_own on services
    for delete
    to authenticated
    using (
        exists (
            select 1 from salons
            where salons.id = services.salon_id
            and salons.owner_id = auth.uid()
        )
    );

comment on policy services_delete_own on services is 'owners can delete their salon services';

-- =============================================================================
-- rls policies for working_hours table
-- security model: public can view hours of complete salons, owners manage their hours
-- =============================================================================

-- anon role: select working hours of complete salons
create policy working_hours_select_public_anon on working_hours
    for select
    to anon
    using (
        exists (
            select 1 from salons
            where salons.id = working_hours.salon_id
            and salons.deleted_at is null
            and is_salon_complete(salons.id)
        )
    );

comment on policy working_hours_select_public_anon on working_hours is 'anonymous users can view working hours of complete salons only';

-- anon role: insert policy (no access for anonymous users)
create policy working_hours_insert_anon on working_hours
    for insert
    to anon
    with check (false);

comment on policy working_hours_insert_anon on working_hours is 'anonymous users cannot create working hours';

-- anon role: update policy (no access for anonymous users)
create policy working_hours_update_anon on working_hours
    for update
    to anon
    using (false);

comment on policy working_hours_update_anon on working_hours is 'anonymous users cannot update working hours';

-- anon role: delete policy (no access for anonymous users)
create policy working_hours_delete_anon on working_hours
    for delete
    to anon
    using (false);

comment on policy working_hours_delete_anon on working_hours is 'anonymous users cannot delete working hours';

-- authenticated role: select working hours of complete salons
create policy working_hours_select_public_authenticated on working_hours
    for select
    to authenticated
    using (
        exists (
            select 1 from salons
            where salons.id = working_hours.salon_id
            and salons.deleted_at is null
            and is_salon_complete(salons.id)
        )
    );

comment on policy working_hours_select_public_authenticated on working_hours is 'authenticated users can view working hours of complete salons';

-- authenticated role: select own salon working hours (even if salon incomplete)
create policy working_hours_select_own on working_hours
    for select
    to authenticated
    using (
        exists (
            select 1 from salons
            where salons.id = working_hours.salon_id
            and salons.owner_id = auth.uid()
        )
    );

comment on policy working_hours_select_own on working_hours is 'owners can view their salon working hours even if salon incomplete';

-- authenticated role: insert working hours for own salon
create policy working_hours_insert_own on working_hours
    for insert
    to authenticated
    with check (
        exists (
            select 1 from salons
            where salons.id = working_hours.salon_id
            and salons.owner_id = auth.uid()
        )
    );

comment on policy working_hours_insert_own on working_hours is 'owners can create working hours for their salon';

-- authenticated role: update own salon working hours
create policy working_hours_update_own on working_hours
    for update
    to authenticated
    using (
        exists (
            select 1 from salons
            where salons.id = working_hours.salon_id
            and salons.owner_id = auth.uid()
        )
    );

comment on policy working_hours_update_own on working_hours is 'owners can update their salon working hours';

-- authenticated role: delete own salon working hours
create policy working_hours_delete_own on working_hours
    for delete
    to authenticated
    using (
        exists (
            select 1 from salons
            where salons.id = working_hours.salon_id
            and salons.owner_id = auth.uid()
        )
    );

comment on policy working_hours_delete_own on working_hours is 'owners can delete their salon working hours';

-- =============================================================================
-- rls policies for bookings table
-- security model: clients view own bookings, owners view/manage all salon bookings
-- =============================================================================

-- anon role: select policy (no access for anonymous users)
create policy bookings_select_anon on bookings
    for select
    to anon
    using (false);

comment on policy bookings_select_anon on bookings is 'anonymous users cannot view bookings';

-- anon role: insert policy (no access for anonymous users)
create policy bookings_insert_anon on bookings
    for insert
    to anon
    with check (false);

comment on policy bookings_insert_anon on bookings is 'anonymous users cannot create bookings';

-- anon role: update policy (no access for anonymous users)
create policy bookings_update_anon on bookings
    for update
    to anon
    using (false);

comment on policy bookings_update_anon on bookings is 'anonymous users cannot update bookings';

-- anon role: delete policy (no access for anonymous users)
create policy bookings_delete_anon on bookings
    for delete
    to anon
    using (false);

comment on policy bookings_delete_anon on bookings is 'anonymous users cannot delete bookings';

-- authenticated role: select own bookings (as client)
create policy bookings_select_client on bookings
    for select
    to authenticated
    using (
        deleted_at is null and
        client_id = auth.uid()
    );

comment on policy bookings_select_client on bookings is 'clients can view their own bookings';

-- authenticated role: select all bookings for owned salon
create policy bookings_select_owner on bookings
    for select
    to authenticated
    using (
        deleted_at is null and
        exists (
            select 1 from salons
            where salons.id = bookings.salon_id
            and salons.owner_id = auth.uid()
        )
    );

comment on policy bookings_select_owner on bookings is 'owners can view all bookings for their salon';

-- authenticated role: insert online bookings (clients)
create policy bookings_insert_client on bookings
    for insert
    to authenticated
    with check (
        type = 'ONLINE' and
        client_id = auth.uid() and
        exists (
            select 1 from profiles
            where id = auth.uid() and deleted_at is null
        )
    );

comment on policy bookings_insert_client on bookings is 'authenticated users can create online bookings as clients';

-- authenticated role: insert manual blocks (owners)
create policy bookings_insert_owner_manual on bookings
    for insert
    to authenticated
    with check (
        type = 'MANUAL' and
        client_id is null and
        exists (
            select 1 from salons
            where salons.id = bookings.salon_id
            and salons.owner_id = auth.uid()
        )
    );

comment on policy bookings_insert_owner_manual on bookings is 'owners can create manual blocks for their salon calendar';

-- authenticated role: update bookings for owned salon
create policy bookings_update_owner on bookings
    for update
    to authenticated
    using (
        exists (
            select 1 from salons
            where salons.id = bookings.salon_id
            and salons.owner_id = auth.uid()
        )
    );

comment on policy bookings_update_owner on bookings is 'owners can update bookings for their salon (e.g., soft delete)';

-- authenticated role: delete bookings for owned salon
create policy bookings_delete_owner on bookings
    for delete
    to authenticated
    using (
        exists (
            select 1 from salons
            where salons.id = bookings.salon_id
            and salons.owner_id = auth.uid()
        )
    );

comment on policy bookings_delete_owner on bookings is 'owners can delete bookings for their salon';

-- =============================================================================
-- rls policies for consents table
-- security model: users can view and create their own consents only
-- =============================================================================

-- anon role: select policy (no access for anonymous users)
create policy consents_select_anon on consents
    for select
    to anon
    using (false);

comment on policy consents_select_anon on consents is 'anonymous users cannot view consents';

-- anon role: insert policy (no access for anonymous users)
create policy consents_insert_anon on consents
    for insert
    to anon
    with check (false);

comment on policy consents_insert_anon on consents is 'anonymous users cannot create consents';

-- authenticated role: select own consents
create policy consents_select_own on consents
    for select
    to authenticated
    using (user_id = auth.uid());

comment on policy consents_select_own on consents is 'users can view their own consent records';

-- authenticated role: insert own consents
create policy consents_insert_own on consents
    for insert
    to authenticated
    with check (user_id = auth.uid());

comment on policy consents_insert_own on consents is 'users can record consent acceptance for themselves';
