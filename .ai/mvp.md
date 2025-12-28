# Application - Hairsy (MVP)

## Main Problem

The application solves the problem of **chaotic time and appointment management** in small hair salons, eliminating the need to maintain a paper calendar and answer phones during work, while enabling clients to book appointments 24/7.

## Minimum Feature Set

We focus on the "Happy Path" - from salon creation to successful booking.

### 1. Authentication and Users

- Login/Registration exclusively through **Google OAuth** (shared for Business and Client).
- Simple role division in the database: `USER` (Client) and `OWNER` (Business).

### 2. Business Path (Salon)

- **Onboarding (Creator):** Form after first login (Name, Address, Phone).
- **Working hours definition:** Simple scheme (e.g., Mon-Fri 9:00-17:00, Sat 10:00-14:00, Sun Closed).
- **Service management:** CRUD services (Name, Duration, Price).
- **Employee management:** MVP assumes **only one employee** (Owner) assigned to services.
- **Appointment Calendar:** View where client bookings come in and the ability to manually block a slot when a client calls.

### 3. Client Path

- **Salon Listing:** Simple list of all registered salons (filtering by city name).
- **Salon View:** Salon information + service list.
- **Booking:** Select service -> Select date and time (from available slots calculated on backend) -> Click "Book".
- **Client Panel:** "My Appointments" list (Only status: Upcoming / Completed).

### 4. Bookings (Core logic)

- System automatically accepts booking if the time slot is free (no owner approval flow).
- Blocking the time slot in the database so no one else can take it.
- Time grid based on intervals (e.g., every 15 min).
- Availability validation considering both `ONLINE` bookings and `MANUAL` blocks.

## What is NOT in MVP Scope (Out of Scope)

Features consciously omitted to deliver version 1.0 as quickly as possible:

1.  **Online payments** (settlement happens at the salon).
2.  **Email / SMS notifications** (user checks status in the app).
3.  **Booking cancellation by CLIENT** (requires calling the salon).
4.  **Booking editing** (moving appointments via drag&drop - in MVP owner deletes old and adds new).
5.  **Multiple employees** (model: 1 account = 1 calendar).
6.  **Reviews and ratings.**
7.  **Complex schedule rules** (vacations, irregular shifts, holidays, breaks).
8.  **Photo upload** (we use placeholders).

## Success Criteria

The goal is to confirm that the system can handle the "end-to-end" process.

1.  **Technical:** User A creates a salon, defines "Haircut" service. User B logs in, sees this salon, books "Haircut". Booking appears in User A's calendar.
2.  **Business:** Reducing the time needed to book an appointment to < 60 seconds (for a client with an account).
3.  **Stability:** No possibility of "double-booking" (two clients for the same time).
