# Application - Hairsy (MVP)

## Główny Problem

Małe salony fryzjerskie i jednoosobowe działalności borykają się z "chaosem organizacyjnym": telefonami w trakcie strzyżenia, papierowymi kalendarzami i brakiem profesjonalnego wizerunku w sieci. Istniejące rozwiązania są często zbyt skomplikowane lub zbyt drogie ("kombajny").

Hairsy rozwiązuje ten problem dostarczając **eleganckie, profesjonalne i proste w obsłudze narzędzie**, które od pierwszego kontaktu buduje zaufanie ("premium feel") i automatyzuje proces rezerwacji 24/7.

## Zakres Funkcjonalny MVP (Minimum Viable Product)

Skupiamy się na "Happy Path", który musi być **bezbłędny w działaniu i zachwycający wizualnie**.

### 1. Autentykacja i Role

- **Separacja Ścieżek**:
  - **Dla Biznesu**: `/business/register` (Email, Hasło, Nazwa Salonu). Jasny komunikat B2B.
  - **Dla Klienta**: `/register` (Szybka rejestracja dla umawiających się).
- **Wspólne Logowanie**: `/login` (Router sam przekierowuje do odpowiedniego dashboardu).

### 2. Ścieżka Biznesowa (Dashboard Właściciela)

- **Onboarding "Dashboard-First"**:
  - Po rejestracji użytkownik widzi Dashboard z Checklistą Wdrożeniową (0/5 kroków).
  - Może swobodnie klikać po systemie, ale salon jest ukryty do momentu aktywacji.
- **Zarządzanie Kalendarzem**:
  - Kalendarz z widokiem Tygodniowym i Dziennym.
  - **Drag & Drop**: Przesuwanie wizyt myszką.
  - **Agenda View**: Dedykowany widok listy na mobile.
  - Blokady manualne ("Zadzwoniła Pani Grażynka").
- **Model Zasobów (Pracownicy)**:
  - Obsługa wielu pracowników (nawet jeśli domyślnie jest jeden - Właściciel).
  - Przypisywanie usług do pracowników.
- **Konfiguracja Salonu**:
  - Godziny pracy + **Wyjątki** (święta, urlopy).
  - Usługi z **Kategoriami** i **Czasem Buforowym** (sprzątanie).

### 3. Ścieżka Klienta (Marketplace)

- **Wyszukiwarka**: Prosta, elegancka, z mapą.
- **Profil Salonu**:
  - Zdjęcia, Opis, Godziny, Lista Usług (z podziałem na kategorie).
  - Wybór Pracownika (opcjonalny "Dowolny pracownik").
- **Rezerwacja**:
  - Wybór Usługi -> Wybór Daty/Czasu (Sloty) -> Potwierdzenie.
- **Moje Wizyty**:
  - Lista nadchodzących i historycznych wizyt.

### 4. Core Logic & System

- **Powiadomienia Email**: Potwierdzenia rezerwacji dla Klienta i Właściciela.
- **Brak Double-Booking**: Solidna walidacja dostępności po stronie backendu (dane w czasie rzeczywistym).
- **Estetyka**: HeroUI (Previously NextUI) (Modern), unikalny font, dopracowane mikro-interakcje.

## Co NIE wchodzi w zakres MVP (Out of Scope)

1. **Płatności Online**: Rozliczenie na miejscu w salonie.
2. **Synchronizacja Google Calendar**: Zbyt skomplikowane na start.
3. **SMS**: Kosztowne powiadomienia (tylko email w MVP).
4. **Rozbudowany CRM**: Tylko podstawowa historia wizyt.
5. **Aplikacja Mobilna (Native)**: Tylko RWD (PWA).

## Kryteria Sukcesu

1. **Wizualne**: Użytkownik po wejściu mówi "Wow, to wygląda lepiej niż Booksy".
2. **Użyteczność**: Właściciel jest w stanie skonfigurować salon w < 5 minut bez czytania instrukcji.
3. **Niezawodność**: Zero przypadków podwójnej rezerwacji.
