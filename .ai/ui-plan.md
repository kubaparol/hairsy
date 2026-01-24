# Architektura UI dla Hairsy

## 1. Przegląd struktury UI

### 1.1 Koncepcja architektury

Hairsy to aplikacja webowa do rezerwacji wizyt w salonach fryzjerskich, obsługująca dwie role użytkowników:

- **USER (Klient)** - przegląda salony, rezerwuje wizyty, zarządza swoimi wizytami
- **OWNER (Właściciel)** - zarządza salonem, usługami, kalendarzem i blokadami

Architektura UI dzieli aplikację na cztery strefy:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        STREFA PUBLICZNA                             │
│  (Landing, Lista salonów, Szczegóły salonu, Flow rezerwacji*)       │
├─────────────────────────────────────────────────────────────────────┤
│                         STREFA AUTH                                 │
│  (Sign-in, Sign-up z przełącznikiem roli)                           │
├─────────────────────────────────────────────────────────────────────┤
│                        STREFA USER                                  │
│  (/user: Dashboard, Moje wizyty, Ustawienia konta)                  │
├─────────────────────────────────────────────────────────────────────┤
│                        STREFA OWNER                                 │
│  (Kalendarz, Usługi, Ustawienia salonu, Onboarding)                 │
└─────────────────────────────────────────────────────────────────────┘

* Flow rezerwacji wymaga logowania przy finalizacji
```

### 1.2 Zasady projektowe

| Aspekt              | Decyzja                            |
| ------------------- | ---------------------------------- |
| Dostępność          | WCAG AA, focus states, ARIA labels |
| Język               | Tylko polski                       |
| Motyw kolorystyczny | Light (domyślny) + Dark (opcja)    |
| Zarządzanie stanem  | React Query z optimistic updates   |
| Routing             | React Router z nested routes       |

### 1.3 Breakpointy

| Nazwa | Szerokość | Główne zastosowanie            |
| ----- | --------- | ------------------------------ |
| `sm`  | 640px     | Telefony w orientacji poziomej |
| `md`  | 768px     | Tablety                        |
| `lg`  | 1024px    | Laptopy                        |
| `xl`  | 1280px    | Desktopy                       |

---

## 2. Lista widoków

### 2.1 Strefa publiczna

#### 2.1.1 Landing Page (`/`)

**Cel:** Wprowadzenie do aplikacji i przekierowanie do głównych przepływów.

**Kluczowe informacje:**

- Wartość aplikacji dla klientów i właścicieli
- Szybki dostęp do wyszukiwania salonów
- CTA do rejestracji/logowania

**Komponenty widoku:**

- `HeroSection` - główny nagłówek z wyszukiwarką
- `ValueProposition` - karty korzyści dla USER i OWNER
- `CTAButtons` - przyciski "Znajdź salon" i "Dla właścicieli"
- `Footer` - stopka z linkami

**UX/Dostępność:**

- Kontrast tekstu min. 4.5:1
- Focusable CTA buttons
- Semantic HTML (header, main, footer)

---

#### 2.1.2 Lista salonów (`/salons`)

**Cel:** Prezentacja kompletnych salonów z możliwością filtrowania i wyboru.

**Kluczowe informacje:**

- Lista salonów (nazwa, miasto, liczba usług, status otwarcia)
- Pole wyszukiwania/filtrowania po mieście
- Paginacja

**Komponenty widoku:**

- `SearchBar` - pole tekstowe z autocomplete miast
- `ViewToggle` - przełącznik grid/lista (stan w localStorage)
- `SalonGrid` / `SalonList` - siatka/lista kart salonów
- `SalonCard` - karta salonu (placeholder zdjęcia, nazwa, miasto, status)
- `Pagination` - klasyczna paginacja (limit/offset)
- `EmptyState` - komunikat przy braku wyników z sugestią innych miast

**UX/Dostępność:**

- Grid: 2 kolumny mobile, 3-4 desktop
- Keyboard navigation między kartami
- ARIA live region dla wyników wyszukiwania
- Skeleton loaders podczas ładowania

**Integracja API:**

- `useCompleteSalons(filters)` - pobranie listy salonów
- Query params: `city`, `limit`, `offset`

---

#### 2.1.3 Szczegóły salonu (`/salons/:id`)

**Cel:** Prezentacja informacji o salonie i umożliwienie rozpoczęcia rezerwacji.

**Kluczowe informacje:**

- Nazwa, opis, adres, telefon salonu
- Godziny pracy (lista pionowa z wyróżnieniem dzisiejszego dnia)
- Lista usług (płaska, bez kategorii)
- Mapa lokalizacji (jeśli są współrzędne)

**Komponenty widoku:**

- `SalonHeader` - nazwa, placeholder zdjęcia
- `SalonInfo` - opis, telefon, adres
- `WorkingHoursList` - godziny pracy z wyróżnieniem "Dziś"
- `ServicesList` - lista usług z cenami i czasem trwania
- `BookButton` - główny CTA "Zarezerwuj wizytę"
- `ServiceSelectModal` - modal/drawer wyboru usługi
- `LocationMap` - mapa z pinezką (opcjonalna)

**UX/Dostępność:**

- Focus trap w modalu wyboru usługi
- Mapa: odpowiedni alt text, możliwość pominięcia
- Sticky header z przyciskiem rezerwacji na mobile

**Integracja API:**

- `useSalon(salonId)` - dane salonu
- `useServicesBySalon(salonId)` - lista usług
- `useWorkingHoursBySalon(salonId)` - godziny pracy

**Przypadki brzegowe:**

- Salon niekompletny (bezpośredni link): komunikat "Salon niedostępny"
- Salon usunięty: przekierowanie do listy z toast

---

#### 2.1.4 Flow rezerwacji (`/salons/:id/book`)

**Cel:** Wybór terminu wizyty i finalizacja rezerwacji.

**Kluczowe informacje:**

- Wybrana usługa (nazwa, czas, cena)
- Dostępne terminy (siatka slotów)
- Podsumowanie przed finalizacją

**Komponenty widoku:**

- `BookingHeader` - informacje o salonie i usłudze
- `DateNavigator` - strzałki ← → + date picker
- `DateSlotGrid` - siatka dni i slotów godzinowych
  - Desktop: 5 dni
  - Mobile: 3 dni z horizontal scroll
- `SlotButton` - dostępny (primary) / zajęty (wyszarzony, nieaktywny)
- `DurationIndicator` - wizualizacja czasu trwania usługi
- `BookingSummary` - podsumowanie: data, godzina, usługa, cena
- `ConfirmButton` - finalizacja rezerwacji
- `AuthPrompt` - zachęta do logowania (jeśli niezalogowany)

**UX/Dostępność:**

- Zajęte sloty: `aria-disabled`, wizualnie wyszarzone
- Keyboard navigation w gridzie slotów
- Focus na pierwszym dostępnym slocie
- Optimistic update przy tworzeniu rezerwacji

**Integracja API:**

- `useAvailableSlots(salonId, serviceId, dateRange)` - dostępne sloty
- `useCreateOnlineBooking()` - utworzenie rezerwacji

**Przypadki brzegowe:**

- Slot zajęty między wyświetleniem a kliknięciem: toast "Termin zajęty" + refresh slotów
- Konflikt rezerwacji (race condition): rollback + toast z błędem
- Brak dostępnych slotów: EmptyState z sugestią innych dni
- Niezalogowany użytkownik: przekierowanie do `/sign-in` z returnUrl

---

### 2.2 Strefa autentykacji

#### 2.2.1 Strona logowania (`/sign-in`)

**Cel:** Logowanie do aplikacji.

**Kluczowe informacje:**

- Formularz logowania
- Link do rejestracji

**Komponenty widoku:**

- `AuthLayout` - layout strony auth (wspólny z `/sign-up`)
- `SignInForm` - formularz logowania: email, hasło
- `AuthLinks` - link do rejestracji (`/sign-up`)

**UX/Dostępność:**

- Walidacja inline pod polami formularza
- Error toast dla błędów serwera
- Focus management po błędzie logowania (focus na pierwszym błędnym polu)

**Integracja API:**

- `useSignIn()` - logowanie

**Przypadki brzegowe:**

- Nieprawidłowe hasło: inline error
- Brak konta: inline error
- Błąd sieci: toast z retry

---

#### 2.2.2 Strona rejestracji (`/sign-up`)

**Cel:** Rejestracja konta USER/OWNER z przełącznikiem roli i dynamicznym motywem.

**Kluczowe informacje:**

- Formularz rejestracji
- Przełącznik roli (USER/OWNER)
- Checkboxy GDPR
- Link do logowania

**Komponenty widoku:**

- `AuthLayout` - layout strony auth (wspólny z `/sign-in`)
- `RoleSwitcher` - toggle Klient/Biznes na górze strony
- `AuthBackground` - zdjęcie tła zależne od roli
  - USER: jasne, zdjęcie ludzi, copy "Dołącz i korzystaj"
  - OWNER: ciemne (granat/czerń), zdjęcie dashboardu, copy "Rozwijaj swój biznes z nami"
- `SignUpForm` - formularz rejestracji: email, hasło, imię, telefon
- `ConsentCheckboxes` - checkboxy GDPR (wymagane)
- `AuthLinks` - link do logowania (`/sign-in`)

**UX/Dostępność:**

- Smooth transition przy zmianie roli (300-500ms ease-in-out)
- Walidacja inline pod polami formularza
- Error toast dla błędów serwera
- ARIA labels dla toggle roli

**Integracja API:**

- `useSignIn()` - logowanie
- `useSignUp()` - rejestracja
- `useCreateConsent()` - zapis konsentów

**Przypadki brzegowe:**

- Email już istnieje: inline error
- Nieprawidłowe hasło: inline error
- Błąd sieci: toast z retry
- Konsenty niezaakceptowane: walidacja przed submit

---

### 2.3 Strefa USER

#### 2.3.1 Dashboard USER (`/user`)

**Cel:** Centralny punkt dla zalogowanego klienta z szybkim dostępem do kluczowych funkcji.

**Kluczowe informacje:**

- Nadchodzące wizyty (max 3)
- Szybkie wyszukiwanie salonów
- Ostatnie wizyty (max 5)

**Komponenty widoku:**

- `WelcomeHeader` - powitanie z imieniem użytkownika
- `QuickSearch` - wyszukiwarka z autocomplete miast
- `UpcomingBookings` - sekcja z kartami nadchodzących wizyt
- `BookingCard` - karta wizyty (salon, usługa, data, godzina)
- `RecentBookings` - lista ostatnich wizyt (skrócona)
- `ViewAllLink` - link "Zobacz wszystkie" do `/user/bookings`

**UX/Dostępność:**

- Skeleton loaders dla kart
- Empty state gdy brak wizyt
- Responsive layout: stack na mobile, grid na desktop

**Integracja API:**

- `useBookingsByClient(clientId, { status: 'upcoming', limit: 3 })`
- `useBookingsByClient(clientId, { status: 'completed', limit: 5 })`

---

#### 2.3.2 Moje wizyty (`/user/bookings`)

**Cel:** Pełna lista wizyt klienta z możliwością filtrowania.

**Kluczowe informacje:**

- Lista wszystkich wizyt z filtrowaniem
- Status wizyty (Nadchodzące/Zakończone)
- Szczegóły: salon, usługa, data, cena (snapshot)

**Komponenty widoku:**

- `FilterBar` - filtry:
  - Status: Nadchodzące/Zakończone (Tabs)
  - Salon: dropdown (opcjonalny)
  - Zakres dat: date range picker
- `BookingsList` - lista kart wizyt
- `BookingCard` - karta z:
  - Nazwa salonu, usługa (snapshot), data/godzina
  - Cena (snapshot z momentu rezerwacji)
  - Akcje: "Pokaż salon", "Zarezerwuj ponownie"
- `Pagination` - paginacja dla długich list
- `EmptyState` - komunikat przy braku wizyt

**UX/Dostępność:**

- Tabs z ARIA roles
- Ceny ze snapshotów (historical accuracy)
- "Zarezerwuj ponownie" → przekierowanie do flow rezerwacji z preselected usługą

**Integracja API:**

- `useBookingsByClient(clientId, filters)`

---

#### 2.3.3 Ustawienia konta (`/account`)

**Cel:** Zarządzanie danymi osobowymi i kontem użytkownika.

**Kluczowe informacje:**

- Dane profilu (imię, email, telefon)
- Opcja zmiany hasła
- Usunięcie konta

**Komponenty widoku:**

- `ProfileForm` - edycja danych profilu
- `PasswordChangeForm` - zmiana hasła
- `ThemeToggle` - przełącznik dark mode
- `DeleteAccountSection` - sekcja usuwania konta
- `DeleteConfirmDialog` - dialog potwierdzenia z hasłem

**UX/Dostępność:**

- Potwierdzenie hasłem przy usuwaniu konta
- Success toast po zapisaniu zmian
- Destructive action styling dla usuwania

**Integracja API:**

- `useProfile(userId)`
- `useUpdateProfile()`
- Supabase Auth: zmiana hasła
- `anonymizeProfile()` - usunięcie konta

**Przypadki brzegowe:**

- Nieprawidłowe hasło przy usuwaniu: inline error
- Sesja wygasła: przekierowanie do login

---

### 2.4 Strefa OWNER

#### 2.4.1 Onboarding OWNER (`/owner/onboarding`)

**Cel:** Wieloetapowy wizard konfiguracji salonu po pierwszej rejestracji.

**Kluczowe informacje:**

- Krok 1: Dane salonu (nazwa, opis, telefon)
- Krok 2: Adres (ulica, numer, kod, miasto)
- Krok 3: Godziny pracy (7 dni)
- Krok 4: Pierwsza usługa

**Komponenty widoku:**

- `StepperWizard` - progress bar z 4 krokami
- `SalonDataStep` - formularz danych salonu
- `AddressStep` - formularz adresu (bez Google Places)
- `WorkingHoursStep` - 7 wierszy z:
  - Toggle "Otwarte/Zamknięte"
  - TimeRangePicker (od-do)
  - Opcja "Skopiuj do dni roboczych"
- `FirstServiceStep` - formularz dodania usługi
- `SkipButton` - przycisk pominięcia kroku
- `NavigationButtons` - Wstecz/Dalej/Zakończ

**UX/Dostępność:**

- Dane zapisywane do localStorage między krokami
- Możliwość pominięcia kroków i powrotu później
- Progress bar odzwierciedla postęp
- Walidacja per krok (nie blokuje przejścia)

**Integracja API:**

- `useCreateSalon()` lub `useUpdateSalon()`
- `useUpsertWorkingHours()`
- `useCreateService()`
- `useSalonCompleteness(salonId)`

**Przypadki brzegowe:**

- Opuszczenie strony: dane w localStorage
- Powrót do onboardingu: załadowanie zapisanych danych
- Niekompletny salon: progress bar w panelu OWNER

---

#### 2.4.2 Kalendarz OWNER (`/owner`)

**Cel:** Główny widok zarządzania rezerwacjami i blokadami.

**Kluczowe informacje:**

- Rezerwacje ONLINE (z danymi klienta)
- Blokady MANUAL (bez danych klienta)
- Godziny pracy vs. poza godzinami

**Komponenty widoku:**

- `CalendarHeader` - data, nawigacja (← →), date picker
- `DayView` - widok dzienny (domyślny)
  - Białe tło: godziny pracy
  - Szare tło z pattern: poza godzinami
- `TimeSlotGrid` - siatka godzinowa (15-min intervals)
- `OnlineBookingBlock` - rezerwacja ONLINE:
  - Kolor: primary (niebieski)
  - Zawartość: imię klienta + usługa + cena
- `ManualBlock` - blokada MANUAL:
  - Kolor: secondary (szary/fioletowy)
  - Zawartość: notatka (opcjonalna)
- `CreateBlockPopover` - popover przy kliknięciu wolnego slotu
- `BookingDetailSheet` - sheet ze szczegółami rezerwacji
  - Dane klienta (imię, email, telefon)
  - Przycisk "Usuń"

**UX/Dostępność:**

- Klik na wolny slot → popover "Utwórz blokadę"
- Klik na rezerwację → sheet ze szczegółami
- Mobile: automatyczny widok dzienny
- Keyboard navigation między slotami
- ARIA labels dla bloków

**Integracja API:**

- `useBookingsBySalon(salonId, { start_date, end_date })`
- `useCreateManualBlock()`
- `useDeleteBooking()`
- `useWorkingHoursBySalon(salonId)`

**Przypadki brzegowe:**

- Konflikt przy tworzeniu blokady: toast z błędem
- Usunięcie rezerwacji: confirmation dialog + optimistic update

---

#### 2.4.3 Zarządzanie usługami (`/owner/services`)

**Cel:** CRUD usług oferowanych przez salon.

**Kluczowe informacje:**

- Lista usług (nazwa, czas, cena)
- Akcje: edycja, usuwanie
- Dodawanie nowej usługi

**Komponenty widoku:**

- `ServicesList` - lista/tabela usług
- `ServiceRow` - wiersz usługi z akcjami
- `AddServiceButton` - przycisk dodania
- `ServiceFormDialog` - dialog z formularzem usługi:
  - Nazwa (wymagane)
  - Opis (opcjonalne)
  - Czas trwania (select: 15, 30, 45... 240 min)
  - Cena (input numeryczny, 1-10000 PLN)
- `DeleteServiceDialog` - potwierdzenie usunięcia

**UX/Dostępność:**

- Walidacja: czas wielokrotność 15 min
- Blokada usunięcia przy przyszłych rezerwacjach
- Toast sukcesu/błędu
- Skeleton podczas ładowania

**Integracja API:**

- `useServicesBySalon(salonId)`
- `useCreateService()`
- `useUpdateService()`
- `useDeleteService()`

**Przypadki brzegowe:**

- Usługa z przyszłymi rezerwacjami: dialog z informacją, blokada usunięcia
- Ostatnia usługa: warning o wpływie na widoczność salonu

---

#### 2.4.4 Ustawienia salonu (`/owner/settings`)

**Cel:** Edycja danych salonu i godzin pracy.

**Kluczowe informacje:**

- Dane salonu (nazwa, opis, telefon, adres)
- Godziny pracy
- Status kompletności

**Komponenty widoku:**

- `SalonDataForm` - edycja danych podstawowych
- `AddressForm` - edycja adresu
- `WorkingHoursEditor` - edytor godzin pracy
- `CompletenessIndicator` - wskaźnik kompletności z checklistą
- `SaveButton` - zapis zmian

**UX/Dostępność:**

- Progress indicator dla kompletności
- Inline validation
- Success toast po zapisaniu

**Integracja API:**

- `useSalonByOwner(ownerId)`
- `useUpdateSalon()`
- `useUpsertWorkingHours()`
- `useSalonCompleteness(salonId)`

---

### 2.5 Komponenty nawigacyjne

#### 2.5.1 Sidebar OWNER

**Cel:** Główna nawigacja w panelu właściciela.

**Pozycje menu:**

1. Kalendarz (`/owner`)
2. Usługi (`/owner/services`)
3. Ustawienia salonu (`/owner/settings`)
4. Profil/Konto (`/account`)

**Warianty:**

- Desktop: collapsible sidebar (Shadcn Sidebar)
- Mobile: drawer (Sheet)

**Dodatkowe elementy:**

- Alert/banner gdy salon niekompletny
- Link do onboardingu w alertcie

---

#### 2.5.2 Header publiczny

**Cel:** Nawigacja w strefie publicznej i USER.

**Elementy:**

- Logo (link do `/`)
- Nawigacja: Salony, (Panel klienta `/user` - gdy zalogowany)
- Auth buttons: Login/Register lub Avatar z dropdown

---

## 3. Mapa podróży użytkownika

### 3.1 Flow USER - Rezerwacja wizyty

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │────▶│   /salons   │────▶│ /salons/:id │
│      /      │     │   (lista)   │     │  (szczegóły)│
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌─────────────┐             │ wybór usługi
                    │ /sign-in    │◀────────────┤
                    │(jeśli niezal)│             │
                    └──────┬──────┘             ▼
                           │            ┌─────────────┐
                           │            │/salons/:id/ │
                           └───────────▶│    book     │
                                        └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   /user     │
                                        │ (sukces)    │
                                        └─────────────┘
```

**Kroki szczegółowe:**

1. **Wejście** → Landing page lub bezpośrednio `/salons`
2. **Wyszukiwanie** → Wpisanie miasta, filtrowanie listy
3. **Wybór salonu** → Klik na kartę salonu
4. **Przeglądanie** → Informacje, godziny, usługi
5. **Wybór usługi** → Klik "Zarezerwuj wizytę" → modal wyboru usługi
6. **Wybór terminu** → DateSlotGrid, nawigacja po dniach
7. **Logowanie** (jeśli potrzebne) → Przekierowanie do `/sign-in` z returnUrl
8. **Finalizacja** → Klik "Zarezerwuj" → toast sukcesu
9. **Potwierdzenie** → Dashboard z nową wizytą

### 3.2 Flow OWNER - Onboarding

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  /sign-up   │────▶│  /owner/    │────▶│  /owner/    │
│ (rejestracja)│    │ onboarding  │     │ onboarding  │
│  jako OWNER │     │  Krok 1     │     │  Krok 2     │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
       ┌─────────────┐     ┌─────────────┐     │
       │   /owner    │◀────│  /owner/    │◀────┤
       │ (kalendarz) │     │ onboarding  │     │
       │             │     │  Krok 4     │     ▼
       └─────────────┘     └─────────────┘ ┌─────────────┐
                                           │  /owner/    │
                                           │ onboarding  │
                                           │  Krok 3     │
                                           └─────────────┘
```

**Kroki szczegółowe:**

1. **Rejestracja** → `/sign-up` z rolą OWNER
2. **Krok 1** → Dane salonu (nazwa, telefon, opis)
3. **Krok 2** → Adres (ulica, numer, kod, miasto)
4. **Krok 3** → Godziny pracy (7 dni)
5. **Krok 4** → Pierwsza usługa
6. **Zakończenie** → Przekierowanie do `/owner` (kalendarz)
7. **Weryfikacja** → Salon widoczny publicznie gdy kompletny

### 3.3 Flow OWNER - Zarządzanie kalendarzem

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   /owner    │────▶│   Klik na   │────▶│  Popover    │
│ (kalendarz) │     │ wolny slot  │     │ "Utwórz     │
│             │     │             │     │  blokadę"   │
└─────────────┘     └─────────────┘     └─────────────┘
      │
      │ klik na rezerwację
      ▼
┌─────────────┐     ┌─────────────┐
│   Sheet     │────▶│  Usunięcie  │
│ szczegóły   │     │ (opcjonalne)│
└─────────────┘     └─────────────┘
```

---

## 4. Układ i struktura nawigacji

### 4.1 Struktura routingu

```typescript
const routes = {
  // Strefa publiczna
  '/': 'LandingPage',
  '/salons': 'SalonListPage',
  '/salons/:id': 'SalonDetailPage',
  '/salons/:id/book': 'BookingFlowPage',

  // Strefa auth
  '/sign-in': 'SignInPage',
  '/sign-up': 'SignUpPage',

  // Strefa USER (wymaga auth + rola USER/OWNER)
  '/user': 'UserDashboardPage',
  '/user/bookings': 'UserBookingsPage',
  '/account': 'AccountSettingsPage',

  // Strefa OWNER (wymaga auth + rola OWNER)
  '/owner': 'OwnerCalendarPage',
  '/owner/onboarding': 'OnboardingWizardPage',
  '/owner/services': 'ServicesManagementPage',
  '/owner/settings': 'SalonSettingsPage',
};
```

### 4.2 Guardy i przekierowania

```
┌─────────────────────────────────────────────────────────────┐
│                        AuthGate                             │
│  - Sprawdza sesję Supabase                                 │
│  - Pobiera rolę użytkownika                                │
│  - Przekierowuje niezalogowanych do /sign-in              │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
    ┌───────────┐       ┌───────────┐       ┌───────────┐
    │ UserGuard │       │ OwnerGuard│       │  Public   │
    │ rola: any │       │rola: OWNER│       │ (no auth) │
    └───────────┘       └───────────┘       └───────────┘
```

**Logika przekierowań:**

| Sytuacja                    | Akcja                                                     |
| --------------------------- | --------------------------------------------------------- |
| Niezalogowany → `/user`     | Przekierowanie do `/sign-in?redirect=/user`               |
| Niezalogowany → `/owner`    | Przekierowanie do `/sign-in?redirect=/owner`              |
| USER → `/owner`             | Przekierowanie do `/user`                                 |
| OWNER bez salonu → `/owner` | Przekierowanie do `/owner/onboarding`                     |
| Zalogowany → `/sign-in`     | Przekierowanie do dashboardu (USER) lub kalendarz (OWNER) |
| Zalogowany → `/sign-up`     | Przekierowanie do dashboardu (USER) lub kalendarz (OWNER) |

### 4.3 Layouty

#### Layout publiczny

```
┌─────────────────────────────────────┐
│            Header                   │
├─────────────────────────────────────┤
│                                     │
│            Content                  │
│                                     │
├─────────────────────────────────────┤
│            Footer                   │
└─────────────────────────────────────┘
```

#### Layout USER (zalogowany)

```
┌─────────────────────────────────────┐
│       Header z Avatar               │
├─────────────────────────────────────┤
│                                     │
│            Content                  │
│                                     │
└─────────────────────────────────────┘
```

#### Layout OWNER

```
┌─────────────────────────────────────────────┐
│                 Header                       │
├──────────┬──────────────────────────────────┤
│          │                                   │
│ Sidebar  │           Content                 │
│          │                                   │
│          │                                   │
└──────────┴──────────────────────────────────┘
```

_Mobile: Sidebar jako drawer (Sheet)_

---

## 5. Kluczowe komponenty

### 5.1 Nowe komponenty do implementacji

#### RoleSwitcher

```
Cel: Toggle Klient/Biznes z animacją motywu
Props: value, onChange, disabled
Warianty: auth (duży), header (mały)
Użycie: /sign-up
```

#### StepperWizard

```
Cel: Wizard z progress bar i nawigacją między krokami
Props: steps[], currentStep, onStepChange, allowSkip
Użycie: /owner/onboarding
```

#### TimeRangePicker

```
Cel: Wybór godzin od-do dla godzin pracy
Props: startTime, endTime, onChange, disabled
Użycie: /owner/onboarding, /owner/settings
```

#### DateSlotGrid

```
Cel: Siatka dostępnych slotów godzinowych
Props:
  - slots: AvailableSlot[]
  - selectedSlot
  - onSelectSlot
  - daysToShow: number (3 mobile, 5 desktop)
  - serviceDuration: number
Użycie: /salons/:id/book
```

#### BookingCard

```
Cel: Karta rezerwacji (reużywalna)
Props:
  - booking: BookingWithStatus
  - variant: 'compact' | 'full'
  - actions: ('show-salon' | 'rebook')[]
Użycie: /user, /user/bookings
```

#### SalonCard

```
Cel: Karta salonu w liście
Props:
  - salon: Salon
  - variant: 'grid' | 'list'
Użycie: /salons
```

#### CalendarDayView

```
Cel: Widok dzienny kalendarza OWNER
Props:
  - date: Date
  - bookings: Booking[]
  - workingHours: WorkingHours
  - onSlotClick, onBookingClick
Użycie: /owner
```

#### EmptyState

```
Cel: Komunikat przy braku danych z sugestią akcji
Props:
  - icon
  - title
  - description
  - action?: { label, onClick }
Użycie: wszędzie gdzie może być brak danych
```

#### FilterBar

```
Cel: Pasek filtrów z różnymi typami kontrolek
Props:
  - filters: FilterConfig[]
  - values
  - onChange
Użycie: /user/bookings, /salons
```

### 5.2 Komponenty Shadcn do wykorzystania

| Komponent        | Użycie                              |
| ---------------- | ----------------------------------- |
| `Sidebar`        | Panel OWNER                         |
| `Sheet`          | Mobile drawer, szczegóły rezerwacji |
| `Dialog`         | Modalne formularze                  |
| `Form` + `Input` | Wszystkie formularze                |
| `Calendar`       | Date picker                         |
| `Select`         | Dropdowny                           |
| `Tabs`           | Filtrowanie statusów                |
| `Skeleton`       | Loading states                      |
| `Sonner` (Toast) | Notyfikacje                         |
| `Button`         | Wszystkie przyciski                 |
| `Card`           | Karty salonów, rezerwacji           |
| `Popover`        | Tooltips, quick actions             |
| `Progress`       | Progress bar w onboardingu          |
| `Switch`         | Toggle (godziny otwarte/zamknięte)  |

### 5.3 Wzorce obsługi stanu

#### Optimistic Updates Pattern

```typescript
// Przykład dla tworzenia rezerwacji
const mutation = useMutation({
  mutationFn: createOnlineBooking,
  onMutate: async (newBooking) => {
    // Anuluj zapytania w toku
    await queryClient.cancelQueries(['bookings']);

    // Zapisz poprzedni stan
    const previousBookings = queryClient.getQueryData(['bookings']);

    // Optimistic update
    queryClient.setQueryData(['bookings'], (old) => [...old, newBooking]);

    return { previousBookings };
  },
  onError: (err, newBooking, context) => {
    // Rollback
    queryClient.setQueryData(['bookings'], context.previousBookings);
    toast.error('Nie udało się zarezerwować. Termin może być już zajęty.');
  },
  onSettled: () => {
    queryClient.invalidateQueries(['bookings']);
    queryClient.invalidateQueries(['available-slots']);
  },
});
```

#### Error Handling Pattern

```typescript
// Walidacja inline + Toast dla błędów serwera
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange', // Walidacja inline
});

const onSubmit = async (data) => {
  try {
    await mutation.mutateAsync(data);
    toast.success('Zapisano pomyślnie');
  } catch (error) {
    if (isSupabaseError(error)) {
      toast.error(error.message);
    } else {
      toast.error('Wystąpił błąd. Spróbuj ponownie.');
    }
  }
};
```

#### Retry Pattern

```typescript
// Auto-retry z exponential backoff
const query = useQuery({
  queryKey: ['available-slots', salonId, serviceId],
  queryFn: () => calculateAvailableSlots(salonId, serviceId, dateRange),
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  staleTime: 10000, // 10 sekund
});
```

---

## 6. Mapowanie User Stories na UI

| US ID  | Tytuł                       | Widok/Komponent                                  |
| ------ | --------------------------- | ------------------------------------------------ |
| US-001 | Login/Rejestracja           | `/sign-in`, `/sign-up`                           |
| US-002 | Konsenty GDPR               | `/sign-up`, `ConsentCheckboxes`                  |
| US-003 | Autoryzacja                 | `AuthGate`, `OwnerGuard`                         |
| US-004 | Onboarding OWNER            | `/owner/onboarding`, `StepperWizard`             |
| US-005 | Dane salonu                 | `/owner/onboarding` krok 1, `/owner/settings`    |
| US-006 | Godziny pracy               | `/owner/onboarding` krok 3, `WorkingHoursEditor` |
| US-007 | Pierwsza usługa             | `/owner/onboarding` krok 4                       |
| US-008 | Edycja usługi               | `/owner/services`, `ServiceFormDialog`           |
| US-009 | Usunięcie usługi            | `/owner/services`, `DeleteServiceDialog`         |
| US-010 | Widoczność salonu           | `CompletenessIndicator`, alert w sidebar         |
| US-011 | Lista salonów               | `/salons`, `SalonGrid`                           |
| US-012 | Brak wyników                | `/salons`, `EmptyState`                          |
| US-013 | Szczegóły salonu            | `/salons/:id`                                    |
| US-014 | Dostępne sloty              | `/salons/:id/book`, `DateSlotGrid`               |
| US-015 | Blokada okna czasowego      | Walidacja w `DateSlotGrid`                       |
| US-016 | Rezerwacja ONLINE           | `/salons/:id/book`, `ConfirmButton`              |
| US-017 | Zapobieganie double-booking | Optimistic update + rollback                     |
| US-018 | Slot zajęty                 | Toast "Termin zajęty" + refresh                  |
| US-019 | Kalendarz OWNER             | `/owner`, `CalendarDayView`                      |
| US-020 | Blokada MANUAL              | `/owner`, `CreateBlockPopover`                   |
| US-021 | Konflikt blokady            | Toast z błędem                                   |
| US-022 | Moje wizyty                 | `/user/bookings`                                 |
| US-023 | Automatyczna zmiana statusu | Backend + odświeżenie cache                      |
| US-024 | Spójność statusów           | React Query cache synchronization                |
| US-025 | Usunięcie konta             | `/account`, `DeleteAccountSection`               |
| US-026 | Anonimizacja danych         | Backend `anonymize_user_profile()`               |
| US-027 | Walidacja czasu             | `ServiceFormDialog` (wielokrotność 15)           |
| US-028 | Niekompletny salon          | Redirect + "Salon niedostępny"                   |
| US-029 | Strefa czasowa              | Backend `Europe/Warsaw`                          |

---

## 7. Obsługa przypadków brzegowych

### 7.1 Stany błędów

| Scenariusz               | Obsługa UI                                     |
| ------------------------ | ---------------------------------------------- |
| Błąd sieci               | Toast z przyciskiem retry, auto-retry (max 3x) |
| Sesja wygasła            | Redirect do `/sign-in` z toast                 |
| 404 (salon nie istnieje) | Redirect do `/salons` z toast                  |
| 403 (brak uprawnień)     | Redirect do odpowiedniego dashboardu           |
| Konflikt rezerwacji      | Toast "Termin zajęty" + refresh slotów         |
| Walidacja formularza     | Inline errors pod polami                       |
| Błąd serwera (500)       | Toast z ogólnym komunikatem                    |

### 7.2 Stany ładowania

| Element          | Loading state                     |
| ---------------- | --------------------------------- |
| Lista salonów    | Skeleton cards (6-8 sztuk)        |
| Szczegóły salonu | Skeleton layout                   |
| Kalendarz        | Skeleton grid                     |
| Sloty            | Skeleton buttons                  |
| Formularze       | Disabled state + spinner w button |

### 7.3 Stany puste

| Widok                          | Empty state                                       |
| ------------------------------ | ------------------------------------------------- |
| Lista salonów (brak w mieście) | "Brak salonów w tym mieście" + sugestia innych    |
| Moje wizyty                    | "Nie masz jeszcze żadnych wizyt" + CTA do /salons |
| Usługi OWNER                   | "Dodaj pierwszą usługę" + CTA                     |
| Kalendarz (dzień pusty)        | Puste sloty (normalne)                            |

### 7.4 Responsywność - różnice

| Element       | Mobile         | Desktop          |
| ------------- | -------------- | ---------------- |
| DateSlotGrid  | 3 dni + scroll | 5 dni            |
| Lista salonów | 2 kolumny      | 3-4 kolumny      |
| Sidebar OWNER | Drawer (Sheet) | Collapsible      |
| Kalendarz     | Tylko dzień    | Dzień (domyślny) |
| Booking flow  | Full-screen    | Modal/inline     |

---

## 8. Bezpieczeństwo i dostępność

### 8.1 Bezpieczeństwo

- **Potwierdzenie hasłem** przy usuwaniu konta
- **RLS policies** jako główna warstwa autoryzacji
- **Brak auto-wylogowania** (zgodnie z decyzją)
- **CSRF protection** przez Supabase
- **Input sanitization** przed zapisem

### 8.2 Dostępność (WCAG AA)

- **Focus states** na wszystkich interaktywnych elementach
- **ARIA labels** dla custom components
- **Semantic HTML** (header, nav, main, footer)
- **Color contrast** minimum 4.5:1
- **Keyboard navigation** dla kalendarza i formularzy
- **Skip links** dla nawigacji
- **Error announcements** przez ARIA live regions

### 8.3 Internacjonalizacja

- **Język:** tylko polski (MVP)
- **Format daty:** DD.MM.YYYY
- **Format czasu:** HH:mm (24h)
- **Waluta:** PLN (bez groszy)
- **Strefa czasowa:** Europe/Warsaw
