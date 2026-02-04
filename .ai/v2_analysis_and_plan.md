# Hairsy V2 - Analiza i Rekomendacje

## 1. Ogólna Ocena Koncepcji V2

Twoja diagnoza problemów V1 ("zbyt proste", "sztywny onboarding", "nieprofesjonalne flow") jest **trafna**. Rynek SaaS dla beauty jest dojrzały (Booksy, Versum), więc użytkownicy (zarówno biznesowi, jak i klienci) mają wysokie oczekiwania co do UX. "Prostota" nie może oznaczać braku kluczowych funkcji czy "taniego" wyglądu.

Proponowany przez Ciebie kierunek zmian w `v2_concept.md` idzie w bardzo dobrą stronę. Poniżej przedstawiam zaktualizowaną analizę, uwzględniającą Twoje uwagi oraz głębszy przegląd funkcjonalności V1.

## 2. Krytyka Funkcjonalna V1 (Poza Onboardingiem)

Skupiłeś się na onboardingu, ale V1 ma też inne uproszczenia, które "trącą amatorszczyzną" w kontekście wersji B2B:

1.  **Kalendarz i Interakcja**:
    - _V1_: Prosta siatka slotów.
    - _Problem_: Właściciele salonów potrzebują widoku tygodniowego/dziennego z **Drag & Drop**. Przesuwanie wizyty "kliknij i przeciągnij" to standard, którego brak bardzo boli.
    - _Rekomendacja_: Wdrożenie biblioteki kalendarza z prawdziwego zdarzenia (np. `react-big-calendar` lub `@fullcalendar/react` mocno otylowanego).

2.  **Sztywne Godziny Pracy (Brak Wyjątków)**:
    - _V1_: Pon-Pt 9-17.
    - _Problem_: Prawdziwe życie to: "W ten piątek wychodzę wcześniej", "Święto 15 sierpnia zamknięte". Brak obsługi wyjątków sprawia, że system staje się bezużyteczny przy pierwszym nietypowym dniu.
    - _Rekomendacja_: System `Schedule Exceptions` (dni wolne, skrócone godziny na konkretną datę) to MVP dla produktu płatnego/B2B.

3.  **Proste Usługi**:
    - _V1_: Nazwa, Cena, Czas.
    - _Problem_: Fryzjerstwo to często: "Koloryzacja + Strzyżenie". Czy system obsłuży "Buffer Time" (sprzątanie po wizycie)? Czy obsłuży warianty (długie/krótkie włosy)?
    - _Rekomendacja_: Dodanie pola `buffer_time` (czas techniczny po usłudze) oraz prostego systemu tagów/kategorii, by odfiltrować usługi.

## 3. Kluczowe Obszary Techniczne i UX do Zmiany

### A. Architektura i Separacja

**Decyzja**: Zgodnie z ustaleniami:

- **Routing**: `TanStack Router` (Code-based routing dla lepszej kontroli typów).
- **Struktura**:
  - `/_public`: Marketplace (landing page, wyszukiwarka).
  - `/_auth`: Ekran logowania/rejestracji (wspólny lub rozdzielony, ale spójny wizualnie).
  - `/business`: Dashboard Właściciela.
  - `/client`: Panel Klienta (zmienione z `/_client` dla czytelności).

### B. UI/UX - Ucieczka od "Generycznego AI"

**Problem**: `shadcn/ui` (i szerzej Tailwind) stał się tak popularny, że aplikacje wyglądają identycznie.
**Rozwiązanie**: Chcemy efektu "WOW" i "Premium".
**Decyzja**: **NextUI** (React Aria + Tailwind).

- _Dlaczego?_: Użytkownik zaakceptował ten wybór. Pozwala na unikalny, "szklany" i nowoczesny wygląd, który odróżnia się od typowych dashboardów, zachowując łatwość Tailwinda.

### C. Onboarding "Dashboard-First" (Bez Zmian)

Podtrzymuję koncepcję wpuszczenia użytkownika do środka od razu. To standard nowoczesnych SaaS.

### D. Funkcjonalności "Premium" (Nowe priorytety)

1. **Powiadomienia Email**: Wdrażamy (potwierdzone).
2. **Historia Klienta (Mini-CRM)**: Widok historii wizyt danego klienta w panelu właściciela.
3. **Pracownicy i Zasoby**: Model danych musi wspierać `resourceId`.

### E. Nowe Ustalenia (Odpowiedzi na Pytania)

1. **Dane Firmowe (NIP/REGON)**:
   - **Podczas Rejestracji**: _Nie wymagamy_. To zabija konwersję. Wymagamy tylko: Email, Hasło, Nazwa Salonu.
   - **Wymagane do**: "Zweryfikowania" konta lub (w przyszłości) wystawiania faktur za subskrypcję.
   - **Gdzie**: W Settings -> sekcja "Dane Rozliczeniowe" lub "Profil Firmy".
   - _Decyzja_: Rejestracja = min friction. Uzupełnienie danych = warunek wiarygodności (np. "verified badge" na marketplace).

2. **Flow Rejestracji i Logowania**:
   - **Logowanie**: `/login` (Wspólny). Po zalogowaniu router sprawdza rolę:
     - `OWNER` -> Redirect do `/business`
     - `USER` -> Redirect do `/client`
   - **Rejestracja (Rozdzielona)**:
     - Klient: `/register` (Standardowa, szybka).
     - Biznes: Landing page `/business` -> CTA "Zacznij za darmo" -> dedykowany formularz `/business/register`.
   - _Dlaczego osobno?_: Biznes potrzebuje innego copy ("Rozwijaj salon"), a klient innego ("Umów wizytę").

## 4. Krytyczna Weryfikacja "Best Ever" (Feasibility Check)

Aby system był "najlepszy ever", musi robić rzeczy, których MVP V1 nie robiło, ale musi być to technicznie wykonalne.

### Zagrożenia i "Dziury" w planie:

1. **Brak "No-Show Protection"**:
   - _Problem_: Dla fryzjera najgorsze jest "nie przyszedł".
   - _Fix w V2_: SMS-y przypominające (wymaga integracji np. z Twilio/SMSAPI, kosztowne) LUB powiadomienia email (darmowe, ale mniej skuteczne).
   - _Decyzja_: Email reminders w MVP V2 to mus. SMS opcjonalnie w V2.1.

2. **Google Calendar Sync**:
   - _Problem_: Mali fryzjerzy żyją w GCal. Jeśli Hairsy nie widzi ich "Prywatne: Dentysta", będą double-bookingi.
   - _Ocena_: To trudne technicznie (OAuth, Sync Tokens).
   - _Decyzja_: Na MVP V2 odpuszczamy (zbyt duży koszt dev), ale architektura (tabela `external_calendars`) powinna to przewidywać.

3. **SEO Marketplace**:
   - _Problem_: SPA (Single Page App) słabo się indeksuje.
   - _Fix_: Next.js byłby lepszy do SEO, ale wybraliśmy Vite (SPA).
   - _Decyzja_: Wystarczy SSR/SSG dla stron publicznych? Lub po prostu dobrze skonfigurowany `react-helmet-async` (meta tagi) dla poszczególnych salonów. Dla side-projectu/SaaS B2B, marketing bezpośredni (Sales) jest ważniejszy niż SEO organiczne na start.

4. **Mobile First dla Właściciela**:
   - _Review_: NextUI jest responsywne, ale kalendarz (react-big-calendar) na mobile to koszmar.
   - _Fix_: Potrzebujemy widoku "Agenda" (Lista) na mobile zamiast siatki tygodniowej. To musi być "First Class Citizen".

## 5. Plan Działania (Zaktualizowany)

1. **Zaktualizowanie PRD**: Przepisanie PRD pod kątem rozdzielenia ról i nowego flow.
2. **Setup Projektu `apps/app-v2`**:
   - Zainstalowanie `NextUI` (zamiast `shadcn/ui`).
   - Konfiguracja `TanStack Router`.
   - Konfiguracja `TanStack Query`.
   - Konfiguracja `Supabase` (Auth, Database).
3. **Implementacja**:
   - Krok 1: Auth & Layout (oddzielny layout dla Biz/Client).
   - Krok 2: Model Danych (Supabase/Firebase/Backend - nie zdefiniowano w V1, ale zakładam, że masz już backend lub używasz BaaS).
   - Krok 3: Dashboard Właściciela (CRUD Usług, Pracowników).
   - Krok 4: Publiczny Marketplace (z podstawowym SEO).

Zaktualizowałem plan o odpowiedzi na Twoje pytania i krytyczny przegląd. Przechodzimy do tworzenia PRD?
