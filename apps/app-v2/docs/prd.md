# Product Requirements Document (PRD) - Hairsy

## 1. Przegląd Produktu

### 1.1 Cel Produktu

Stworzenie profesjonalnej platformy SaaS dla branży beauty, która łączy w sobie prostotę obsługi ("zero training required") z funkcjonalnościami klasy Enterprise. System ma eliminować "amatorskie" wrażenie starszych rozwiązań poprzez nowoczesny design (HeroUI - previously NextUI) i przemyślane User Experience.

### 1.2 Zakres MVP (Happy Path)

1. **Biznes**: Rejestracja `B2B` -> Dashboard -> Konfiguracja (Usługi, Grafik + Wyjątki, Pracownicy) -> Aktywacja Salonu.
2. **Klient**: Rejestracja `B2C` -> Wyszukanie Salonu -> Wybór Usługi/Pracownika -> Rezerwacja -> Potwierdzenie Email.

### 1.3 Persony

- **Właściciel (Owner)**: Przedsiębiorca, oczekuje narzędzia, które "samo działa" i wygląda dobrze przed klientem. Często korzysta z telefonu.
- **Klient (User)**: Osoba dbająca o wygląd, oczekuje szybkiej rezerwacji (3 kliknięcia) i pewności terminu.

## 2. Architektura i Założenia Techniczne

- **Frontend**: React + Vite + TypeScript.
- **UI Library**: **HeroUI (Previously NextUI)** (React Aria + Tailwind) - styl "Premium Modern".
- **Routing**: **TanStack Router** (Code-based routing).
  - `/business/*` - strefa dla właścicieli.
  - `/client/*` - strefa dla zalogowanych klientów.
  - `/` - publiczny marketplace.
- **Backend**: Supabase (Auth, DB, Realtime).
- **Powiadomienia**: Email (np. Resend/SendGrid).

## 3. Wymagania Funkcjonalne

### 3.1 Autentykacja i Dostęp (US-01)

#### 3.1.1 Rejestracja Biznesowa

- **Ścieżka**: `/auth/sign-up-as-business`.
- **Dane**: Email, Hasło, Nazwa Salonu, zgody GDPR.
- **Brak NIP i innych danych firmy**: Nie wymagamy danych rejestrowych na tym etapie.
- **Akcja**: Po rejestracji przekierowanie do Dashboardu Biznesowego (rola `OWNER`).

#### 3.1.2 Rejestracja Klienta

- **Ścieżka**: `/auth/sign-up-as-client`.
- **Dane**: Email, Hasło, Imię.
- **Akcja**: Po rejestracji przekierowanie do Dashboardu Klienta (rola `USER`).

#### 3.1.3 Logowanie

- **Ścieżka**: `/auth/sign-in`.
- **Logika**: Router wykrywa rolę użytkownika po zalogowaniu i przekierowuje:
  - `OWNER` -> `/business`.
  - `USER` -> `/client`.

### 3.2 Zarządzanie Salonem (US-02 - Dashboard)

#### 3.2.1 Onboarding "Dashboard-First"

- System nie blokuje użytkownika "wizardem".
- Widoczny pasek postępu ("Twoja konfiguracja: 30%").
- Salon jest niepubliczny (`status: DRAFT`) do momentu kliknięcia "Aktywuj".

#### 3.2.2 Model Pracowników

- **Zasób**: Wprowadzamy pojęcie `Resource` (Pracownik).
- Nawet dla jednoosobowego salonu tworzony jest 1 Pracownik powiązany z kontem Ownera.
- Usługi mogą być przypisane do konkretnych pracowników.

#### 3.2.3 Usługi i Kategorie

- Usługa posiada: Nazwa, Cena, Czas Trwania, **Czas Buforowy** (po wizycie), Kategorię.
- Kategorie pozwalają grupować usługi na liście (np. "Koloryzacja", "Strzyżenie").

#### 3.2.4 Grafik Pracy i Wyjątki

- Standardowe godziny otwarcia (Pon-Ndz).
- **Wyjątki**: Możliwość zdefiniowania zamknięcia salonu w konkretnym dniu (np. 1 listopada) lub zmiany godzin.

### 3.3 Kalendarz i Rezerwacje (US-03)

#### 3.3.1 Widok Kalendarza (Owner)

- Widok tygodniowy i dzienny.
- Obsługa **Drag & Drop** do przesuwania wizyt.
- Widok "Agenda" (Lista) dla urządzeń mobilnych.
- Oznaczenie wizyt różnymi kolorami (zależnie od statusu/pracownika).

#### 3.3.2 Blokowanie Terminów (Manual)

- Właściciel może dodać "Blokadę" (np. przerwa obiadowa, wizyta telefoniczna) bez podawania danych klienta.

#### 3.3.3 Rezerwacja Online (Klient)

- Wybór Usługi/Kategorii.
- Wybór Pracownika (lub "Ktokolwiek").
- Wybór Terminu (System pokazuje tylko dostępne sloty, uwzględniając czas trwania i bufor).
- Potwierdzenie rezerwacji (Instant Booking).

### 3.4 Powiadomienia (US-04)

- **Email**:
  - "Potwierdzenie rezerwacji" (do Klienta i Ownera).
  - "Anulowanie wizyty" (jeśli nastąpi).

### 3.5 Historia Klienta (Mini-CRM) (US-05)

- Właściciel wchodząc w szczegóły wizyty może kliknąć w Klienta.
- Widok: Lista poprzednich wizyt tego klienta, łączne wydatki, notatki (np. "wrażliwa skóra").

## 4. Ograniczenia i Edge Cases

1. **Konflikty**: System musi gwarantować atomowość rezerwacji (brak możliwości zarezerwowania tego samego slotu przez dwie osoby w tej samej milisekundzie - Constraint w DB).
2. **Strefy Czasowe**: Wszystkie czasy zapisywane w UTC, wyświetlane w czasie lokalnym Salonu.
3. **Modyfikacja Usługi**: Zmiana czasu trwania usługi nie wpływa na już istniejące rezerwacje (snapshot danych w rezerwacji).

## 5. Metryki Sukcesu V2

- **Czas Konfiguracji**: Właściciel jest w stanie zaaktywować salon w mniej niż 5 minut.
- **Konwersja Rejestracji**: % użytkowników kończących onboarding jest wyższy niż w V1 dzięki podejściu Dashboard-First.
- **Zadania**: Skuteczne umawianie wizyt przez Klienta bez błędów dostępności.
