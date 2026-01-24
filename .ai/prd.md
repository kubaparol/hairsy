# Product Requirements Document (PRD) - Hairsy

## 1. Product Overview

### 1.1 Product Goal

Hairsy is an appointment booking application for small hair salons that:

- enables clients to book 24/7 without calling,
- gives the owner one calendar covering online bookings and manual blocks,
- eliminates the risk of double-booking as the highest quality priority.

### 1.2 MVP Scope (happy path end-to-end)

MVP focuses on the flow:

1. owner registers/logs in using email and password and completes salon data,
2. owner adds at least one service,
3. salon becomes visible in public listing,
4. client registers/logs in using email and password, finds salon, selects service and books an available slot,
5. booking appears in owner's calendar and client's panel.

### 1.3 Personas and Roles

- Owner (`OWNER`): creates and maintains salon profile, working hours, services, and booking/block calendar.
- Client (`USER`): browses salon list, books appointments, views their appointments.

### 1.4 Product and Technical Assumptions

- Authentication and registration exclusively through email and password.
- Organizational model: 1 owner = 1 employee = 1 calendar.
- Time grid: fixed 15-minute interval for the entire system.
- Booking window: earliest 1 hour from now, latest 1 month from now.
- Slot availability calculated on the backend and returned to client as a list of free slots.
- Occupancy types: `ONLINE` (client booking) and `MANUAL` (manual block by owner without client data).

## 2. User Problem

### 2.1 Salon Owner Problem

- Chaos in booking management: paper calendar, scattered information, phone calls during work.
- Lack of full day overview (online + phone) in one place.
- Risk of mistakes, including double bookings.

### 2.2 Client Problem

- Need to call salon during business hours, no 24/7 booking option.
- Uncertainty about availability and long booking time.

### 2.3 How MVP Solves the Problem

- Public listing of only complete salons shortens search time.
- Backend returns only free slots, simplifying client decision.
- Immediate booking acceptance shortens process to a click.
- Owner's unified calendar covers `ONLINE` and `MANUAL`.
- Anti-collision mechanisms eliminate double-booking.

## 3. Functional Requirements

### 3.1 Authentication, Roles and Access

#### 3.1.1 Login and Registration

- System must enable registration/login exclusively through email and password.
- System must store passwords securely (hashed; no plaintext storage).
- System must create user profile on first login.
- System must enforce consent acceptance (GDPR) during registration.

#### 3.1.2 Roles and Authorization

- System must support at least roles: `OWNER` and `USER`.
- Access to owner functions (salon onboarding, services, calendar) must be restricted to `OWNER`.
- Access to client panel (my appointments) must be restricted to logged-in `USER`/`OWNER` in context of own appointments.
- API must validate that user has access only to own resources (e.g., owner only to own salon and its bookings; client only to own bookings).

### 3.2 Salon Onboarding and Completeness Validation

#### 3.2.1 Required Salon Data

- System must require completion of at least: name, address, phone, working hours, minimum 1 service.
- Address must be geocoded (e.g., city and coordinates or standardized format).
- Working hours must have a simple weekly scheme (Mon-Sun, no breaks, no exceptions).

#### 3.2.2 Salon Visibility

- Incomplete salon (missing any required element) cannot be visible in public listing.
- Complete salon is visible in public listing.

#### 3.2.3 Employee Model

- System must treat owner as the only employee in MVP.
- Services are assigned to this single employee (implicitly).

### 3.3 Service Management (CRUD)

- System must enable `OWNER` to create, edit, delete and view services.
- Service must have fields: name, duration (in minutes), price.
- Service duration must be a multiple of 15 minutes.
- System must block service deletion if there are future ONLINE bookings assigned to this service (in MVP: product decision: deletion block or require transfer; default: block).

### 3.4 Public Salon Listing

#### 3.4.1 Salon List

- System must display only complete and active salons.
- System must enable filtering by city name (text input or selection).
- System must sort results alphabetically (by salon name).

#### 3.4.2 Salon Details

- Salon view must present basic salon information and service list.
- Salon view must enable transition to available slot selection for selected service.

### 3.5 Booking System and Availability Calculation

#### 3.5.1 Time Grid and Booking Window

- All slots must be based on 15-minute interval.
- System must prevent booking time earlier than now + 1 hour.
- System must prevent booking time later than now + 1 month.

#### 3.5.2 Available Slot Calculation (backend)

- Backend must return only free slots for selected service, considering:
  - salon working hours,
  - service duration,
  - existing ONLINE bookings,
  - existing MANUAL blocks.
- Backend cannot return slots that partially overlap with occupancies (time range collisions).

#### 3.5.3 Creating ONLINE Booking

- System must enable client to create `ONLINE` booking by selecting one of available slots.
- `ONLINE` booking must be immediately accepted (no owner approval process).
- System must enforce no double-booking, also under concurrent conditions (race condition).

#### 3.5.4 Manual Blocks

- System must enable `OWNER` to create `MANUAL` block for any free slot.
- `MANUAL` block cannot require client data.
- System must prevent creating `MANUAL` block conflicting with `ONLINE` or another `MANUAL`.

#### 3.5.5 Booking Status and Automatic Update

- System must maintain at least statuses: `Upcoming` and `Completed`.
- System must automatically change status to `Completed` after appointment time has passed (start + duration).
- Status change must apply to both `ONLINE` bookings and `MANUAL` blocks (in `OWNER` calendar).
- Automatic status change mechanism should be implemented as a scheduled job or equivalent mechanism.

### 3.6 Owner Panel (Calendar)

- System must provide calendar view for `OWNER` containing all occupancies: `ONLINE` and `MANUAL`.
- `ONLINE` entries must contain information allowing client identification (minimum dataset compliant with GDPR).
- `MANUAL` entries must be visible as occupied slot without client data.
- System must enable creating `MANUAL` block from calendar.
- System must present occupancy statuses and their automatic update.

### 3.7 Client Panel (My Appointments)

- System must provide logged-in client with list of all their `ONLINE` bookings.
- System must divide list into Upcoming and Completed.
- System cannot offer booking cancellation by client in MVP.

### 3.8 GDPR and Data Management

#### 3.8.1 Consents

- System must present and record consents required to use the application during registration.
- System must store timestamp and version of consent text (or policy version identifier).
- Required consents must be accepted before registration can be completed.

#### 3.8.2 Account Deletion

- System must enable user to delete account.
- Account deletion must delete user data cascadingly according to adopted policy:
  - user's `ONLINE` bookings: deletion or anonymization (product decision required before implementation; MVP: delete user personal data and leave entry as occupancy without data, to not break salon history),
  - user profile data: deletion,
  - consents: deletion or anonymization compliant with legal requirements (MVP: store minimal audit without identifying data, if required).

#### 3.8.3 Appointment History

- System must store full appointment history (`ONLINE` and `MANUAL`) in salon context.
- Client panel must display client appointment history divided into Upcoming/Completed.

## 4. Product Boundaries

### 4.1 Out of MVP Scope (out of scope)

- Online payments.
- Email/SMS/push notifications.
- Booking cancellation by client.
- Booking editing (drag and drop moving); in MVP possibly only deletion and re-creation on `OWNER` side.
- Multiple employees and assigning services to multiple calendars.
- Vacations, breaks, holidays, schedule exceptions.
- Reviews and ratings.
- Photo upload (placeholders).

### 4.2 Limitations and Simplifications

- One salon per `OWNER` account (if need for multiple salons arises, requires model extension).
- Simple weekly working hours without exceptions.
- Single time grid (15 minutes) shared for entire application.
- Bookings only in 1h–1 month window.

### 4.3 Open Decisions (to be clarified before implementation)

- Policy for deleting booking data after account deletion (full deletion vs anonymization).
- Minimum scope of client data visible to `OWNER` in calendar.
- Definition of "active salon" (e.g., active = complete; whether manual activity toggle exists).
- Time zone: default salon's, not client device (recommended).

## 5. User Stories

### 5.1 Authorization and Access Security

#### ID: US-001

**Title:** Login and Registration via Email and Password
**Description:** As a user I want to log in or register using email and password to securely use the application.
**Acceptance Criteria:**

- User can register with email and password.
- User can log in with email and password.
- After successful login, session is created and user enters the application.
- On first login, user profile is created.
- No alternative login mechanism exists in MVP.

#### ID: US-002

**Title:** Enforce GDPR Consents During Registration
**Description:** As a user I want to accept required consents during registration to use the product in compliance with GDPR.
**Acceptance Criteria:**

- During registration user sees required consent checkboxes in the registration form.
- Without accepting required consents user cannot complete registration.
- System saves information about acceptance (time, text version) upon successful registration.

#### ID: US-003

**Title:** Restrict Access to Resources (Authorization)
**Description:** As a system I want to restrict access to data based on role and resource owner to ensure privacy and security.
**Acceptance Criteria:**

- User cannot read or modify salon, services, calendar or bookings of another owner.
- Client cannot read list of other clients' bookings.
- Unauthorized access attempt ends with authorization error.

### 5.2 Onboarding and Salon Management (OWNER)

#### ID: US-004

**Title:** Start Owner Onboarding After First Login
**Description:** As an owner I want to go through onboarding after first login to configure the salon.
**Acceptance Criteria:**

- `OWNER` without complete salon is directed to onboarding.
- User can return to onboarding until required data is completed.

#### ID: US-005

**Title:** Complete Salon Data (name, phone, geocoded address)
**Description:** As an owner I want to complete basic salon data so clients can find me.
**Acceptance Criteria:**

- System requires name, phone and address.
- Address is geocoded and contains city.
- Cannot save salon as complete without required data.

#### ID: US-006

**Title:** Set Working Hours in Simple Weekly Scheme
**Description:** As an owner I want to define working hours for weekdays so system can calculate availability.
**Acceptance Criteria:**

- For each weekday can set: closed or opening-closing range.
- System validates range correctness (opening < closing).
- No support for breaks and exceptions in MVP.

#### ID: US-007

**Title:** Add First Service (completeness requirement)
**Description:** As an owner I want to add at least one service so salon can accept bookings.
**Acceptance Criteria:**

- Service has name, duration and price.
- Duration is a multiple of 15 minutes.
- Salon is not publicly visible if at least one service is missing.

#### ID: US-008

**Title:** Edit Service
**Description:** As an owner I want to edit a service to update the offer.
**Acceptance Criteria:**

- `OWNER` can change name, duration and price.
- Duration remains a multiple of 15 minutes.
- Change does not break existing bookings (historical bookings maintain correct presentation).

#### ID: US-009

**Title:** Delete Service Without Future Bookings
**Description:** As an owner I want to delete services to remove outdated items.
**Acceptance Criteria:**

- Cannot delete service if there are future ONLINE bookings for this service.
- If no future bookings exist, service is deleted and does not appear in salon view.

#### ID: US-010

**Title:** Salon Becomes Visible Only After Complete Configuration
**Description:** As an owner I want my salon to appear in listing only after data completion so clients see only ready offers.
**Acceptance Criteria:**

- Salon does not appear in public listing when any element is missing: name, address, hours, min. 1 service.
- After completing all elements salon appears in public listing.

### 5.3 Listing and Discovery (CLIENT)

#### ID: US-011

**Title:** Browse Public Salon List in City
**Description:** As a client I want to see salons in my city to choose a place for appointment.
**Acceptance Criteria:**

- List shows only complete and active salons.
- Results are sorted alphabetically by salon name.
- Client can filter list by city.

#### ID: US-012

**Title:** No Results for Given City
**Description:** As a client I want to see a message when there are no salons in given city to know the filter works.
**Acceptance Criteria:**

- For city without salons system shows empty state (no results) and does not display salons from other cities.

#### ID: US-013

**Title:** Display Salon Details and Service List
**Description:** As a client I want to enter salon profile to see information and available services.
**Acceptance Criteria:**

- View contains basic salon information and service list.
- Client can select service and proceed to time selection.

### 5.4 Availability and Booking (CLIENT)

#### ID: US-014

**Title:** Fetch Available Slots for Service
**Description:** As a client I want to see only free slots for selected service to quickly book an appointment.
**Acceptance Criteria:**

- Backend returns only free slots.
- Slots comply with salon working hours.
- Slots consider service duration.
- Slots do not conflict with `ONLINE` or `MANUAL`.
- Slots are limited to 1h–1 month window.

#### ID: US-015

**Title:** Block Booking Outside Time Window
**Description:** As a system I want to block bookings outside allowed window to maintain product rules.
**Acceptance Criteria:**

- Attempt to book time < now + 1h is rejected.
- Attempt to book time > now + 1 month is rejected.
- Rejection is deterministic and visible as validation error.

#### ID: US-016

**Title:** Create Online Booking with Immediate Confirmation
**Description:** As a client I want to book selected free slot to have appointment certainty without waiting for confirmation.
**Acceptance Criteria:**

- Clicking free slot creates `ONLINE` booking.
- System confirms booking immediately (no waiting for approval).
- Booking appears in client panel as `Upcoming`.
- Booking appears in `OWNER` calendar.

#### ID: US-017

**Title:** Prevent Double-Booking on Concurrent Booking
**Description:** As a system I want to prevent double booking of same time range even with simultaneous requests to maintain consistency.
**Acceptance Criteria:**

- Two simultaneous attempts to book same slot result in maximum one booking created.
- Second attempt ends with unavailability message.
- System remains consistent in database (no two records for conflicting time ranges).

#### ID: US-018

**Title:** Handle Situation When Slot Became Unavailable Between Display and Click
**Description:** As a client I want to get clear information if slot was taken to quickly choose another time.
**Acceptance Criteria:**

- If slot was taken after list display, booking attempt ends with availability error.
- System suggests refreshing available slots.

### 5.5 Owner Calendar and Blocks (OWNER)

#### ID: US-019

**Title:** Display Calendar with Online Bookings and Manual Blocks
**Description:** As an owner I want to see all occupancies in one calendar to plan the day.
**Acceptance Criteria:**

- Calendar shows `ONLINE` and `MANUAL`.
- `ONLINE` contains minimal client data (compliant with adopted policy).
- `MANUAL` is visible as occupied slot without client data.

#### ID: US-020

**Title:** Manually Block Free Slot (`MANUAL` Block)
**Description:** As an owner I want to block free slot for calling client to avoid conflicts with online bookings.
**Acceptance Criteria:**

- `OWNER` can indicate free slot and create `MANUAL` block.
- System does not require client data.
- System rejects block attempt if conflict with `ONLINE` or another `MANUAL` occurs.

#### ID: US-021

**Title:** Reject Manual Block Conflicting with Online Booking
**Description:** As an owner I want to be prevented from blocking occupied time to not create conflicts.
**Acceptance Criteria:**

- Attempt to create `MANUAL` on occupied time range is rejected.
- Rejection returns unavailability information.

### 5.6 Statuses and Appointment History (CLIENT and OWNER)

#### ID: US-022

**Title:** My Appointments View (`Upcoming` and `Completed`)
**Description:** As a client I want to see list of my appointments divided by status to have control over bookings.
**Acceptance Criteria:**

- View contains all client's `ONLINE` bookings.
- Bookings are divided into `Upcoming` and `Completed`.
- No cancellation option in MVP.

#### ID: US-023

**Title:** Automatic Status Change to Completed After Appointment Time
**Description:** As a system I want to automatically update appointment status after its time has passed so lists and calendar are current.
**Acceptance Criteria:**

- After time (start + duration) status changes to `Completed`.
- Applies to `ONLINE` bookings and `MANUAL` blocks in `OWNER` calendar.
- Change is automatic without user action.

#### ID: US-024

**Title:** Status Consistency Between `OWNER` Calendar and Client Panel
**Description:** As a user I want statuses to be consistent across the system to avoid misunderstandings.
**Acceptance Criteria:**

- Same booking has same status in client panel and `OWNER` calendar.

### 5.7 GDPR: Account Deletion and Data

#### ID: US-025

**Title:** Account Deletion by User
**Description:** As a user I want to delete account to exercise right to be forgotten.
**Acceptance Criteria:**

- User can initiate account deletion.
- After deletion account cannot log in (profile does not exist).
- User profile data is deleted cascadingly according to policy.

#### ID: US-026

**Title:** Deletion or Anonymization of Personal Data in Bookings After Account Deletion
**Description:** As a system I want to delete user personal data from history to meet GDPR requirements and maintain salon calendar consistency.
**Acceptance Criteria:**

- After account deletion salon history has no identifying user data.
- Occupancies from past appointments do not cause collisions or availability calculation errors.

### 5.8 Edge Cases and System Resilience

#### ID: US-027

**Title:** Validate Service Duration Relative to 15-Minute Interval
**Description:** As a system I want to enforce durations in 15-minute steps to simplify slot calculation.
**Acceptance Criteria:**

- Cannot create or update service with duration not divisible by 15.

#### ID: US-028

**Title:** Handle Incomplete Salon in Client UI (no access)
**Description:** As a client I do not want to see salon that is not ready to not waste time.
**Acceptance Criteria:**

- Incomplete salon is not visible in listing.
- If client lands on direct link to incomplete salon, system blocks access or shows unavailability message.

#### ID: US-029

**Title:** Time Zone Consistency When Calculating Slots
**Description:** As a system I want to calculate slots in one time zone to avoid time errors.
**Acceptance Criteria:**

- Working hours and slots are interpreted consistently in salon time zone.
- Time change (e.g., DST) does not cause generating slots outside working hours.

## 6. Success Metrics

### 6.1 Technical Metrics

- Zero double-booking cases in production (highest priority).
- End-to-end booking works: `OWNER` creates salon and service, `USER` books, entry appears in `OWNER` calendar.
- Incomplete salon is not visible in public listing.
- Automatic status change mechanism works and is deterministic.
- `ONLINE` bookings and `MANUAL` blocks do not conflict, and backend does not return occupied slots.
- No race condition on concurrent bookings (verified by tests and observation).

### 6.2 Business Metrics

- Time to book appointment by logged-in client below 60 seconds.
- Increase in 24/7 booking share (outside salon working hours) relative to phone bookings.
- Owner uses one calendar as source of truth for online and phone.

### 6.3 Stability and Compliance Metrics

- Time window validation 1h–1 month works for all edge cases.
- User can effectively delete account, and personal data is deleted/anonymized according to policy.
- Salon history remains consistent after client account deletion.

### 6.4 PRD Completion Checklist

- Can each user story be tested?
  - Yes: each story has acceptance criteria describing observable system behavior.
- Are acceptance criteria clear and concrete?
  - Yes: they describe concrete entry/exit conditions, validations and visible effects.
- Do we have enough user stories to build a fully functional application?
  - Yes: they cover onboarding, listing, bookings, calendar, appointment history, statuses, GDPR, authorization and edge cases.
- Have we included authentication and authorization requirements?
  - Yes: US-001, US-002, US-003 and requirements 3.1.
