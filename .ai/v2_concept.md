# Hairsy V2 - Analiza i Propozycja Koncepcyjna

## 1. Analiza V1 (Obecna Logika)

Na podstawie przeglądu `@prd.md` i `@mvp.md` oraz Twoich uwag, oto krytyka obecnego podejścia:

### Co działa (do zachowania):

- **Problem:** Podstawowa propozycja wartości (rezerwacja 24/7, brak podwójnych rezerwacji) jest solidna.
- **Prostota:** Podstawowa logika "slotów" jest dobra, ale jej _ekspozycja_ była zbyt surowa.

### Co wymaga poprawy (Elementy "Nieprofesjonalne"):

1.  **Ujednolicony Flow Autentykacji:**
    - _Problem:_ Posiadanie jednej strony "Rejestracja" z przełącznikiem "Jestem właścicielem salonu" sprawia wrażenie projektu z hackathonu, a nie produktu SaaS.
    - _Wpływ:_ Niskie zaufanie. Właściciele firm oczekują doświadczenia onboardingowego B2B ("Rozpocznij darmowy okres próbny", "Rozwijaj swój biznes"). Klienci oczekują doświadczenia B2C ("Zarezerwuj teraz").
    - _Rozwiązanie:_ Oddzielne punkty wejścia. Landing page `/dla-biznesu` vs Główny Marketplace.

2.  **Sztywny Onboarding (Więzienie Kreatora):**
    - _Problem:_ Zmuszanie właściciela do przejścia przez kreator natychmiast po zalogowaniu tworzy tarcie. Jeśli zrezygnują w trakcie, mogą czuć się "zablokowani" przy następnym wejściu.
    - _Wpływ:_ Wysoki wskaźnik rezygnacji podczas onboardingu.
    - _Rozwiązanie:_ **Strategia Dashboard First**. Pozwól im się zalogować i zobaczyć pusty (ale estetyczny) dashboard z paskiem postępu "Przewodnik Konfiguracji" (0/4 kroków zakończonych).

3.  **Ograniczenie "Jeden Właściciel = Jeden Pracownik":**
    - _Problem:_ Nawet jednoosobowi przedsiębiorcy często chcą odróżnić "Salon" od "Stylisty".
    - _Wpływ:_ System sprawia wrażenie tymczasowego / nieskalowalnego.
    - _Rozwiązanie:_ Zbuduj model danych dla `Salon -> Pracownicy` od samego początku, nawet jeśli Pracownik #1 jest tworzony automatycznie dla Właściciela.

4.  **UI/UX "Prostacki" vs "Czysty":**
    - _Problem:_ "Prosty" często oznacza "pozbawiony kontekstu".
    - _Rozwiązanie:_ "Profesjonalny" oznacza generyczne komponenty (avatary, odznaki statusu, szkielety ładowania) i mikro-interakcje (stany hover, animacje).

---

## 2. Propozycja Koncepcyjna V2: "Profesjonalnie i Skalowalnie"

### Główna Filozofia

**"Booksy-lite, ale Premium"**
Przestajemy traktować to jako "skrypt do rezerwacji", a zaczynamy traktować jako **Platformę** z dwoma różnymi obliczami:

1.  **Hairsy Biz:** Narzędzie SaaS do zarządzania.
2.  **Hairsy Marketplace:** Aplikacja konsumencka do odkrywania.

### Zmiany Funkcjonalne (Warstwa "Profesjonalna")

#### 1. Redesign Autentykacji i Onboardingu

- **Rozdział Flow:**
  - `app.hairsy.com` (lub root) -> Doświadczenie Klienta.
  - `biz.hairsy.com` (lub `/biz`) -> Doświadczenie Biznesowe.
- **Onboarding Dashboard-First:**
  - Właściciel rejestruje się -> Trafia na "Dashboard Salonu".
  - **Stan Pusty:** "Twój salon jest obecnie offline. Ukończ te 3 kroki, aby go opublikować."
  - **Krok 1:** Uzupełnij Profil (Nazwa, Adres).
  - **Krok 2:** Zdefiniuj Harmonogram (Wizualny wybierak tygodniowy).
  - **Krok 3:** Dodaj Usługi.
  - **Ręczna Aktywacja:** Właściciel klika "Opublikuj Salon", gdy czuje się gotowy.

#### 2. Ulepszony Model Danych

- **Salon != Właściciel:** `Salon` jest bytem. `Właściciel` to Użytkownik działający jako Administrator.
- **Wsparcie dla Personelu:**
  - Nawet dla MVP V2 wprowadzamy `resourceId` (Pracownik).
  - Usługi są przypisane do Pracowników (nawet jeśli jest tylko jeden).
  - _Korzyść:_ Pozwala na poprawną logikę "Kto wykonuje usługę?", co jest kluczowe dla profesjonalizmu.
- **Kategorie Usług:** Grupowanie usług (np. "Strzyżenie Męskie", "Koloryzacja"), aby uniknąć długiej, nieuporządkowanej listy.

#### 3. Doświadczenie Klienta (UX/UI)

- **Odkrywanie na Mapie:** (Opcjonalne, ale kontekst z poprzedniej historii sugeruje zainteresowanie) - Pokaż salony na mapie.
- **Wizualny Proces Rezerwacji:**
  - Wybierz Usługę (z czasem trwania/ceną).
  - Wybierz Personel (Opcjonalne / "Dowolny").
  - Wybierz Czas (Wizualny kalendarz, a nie tylko lista tekstowych slotów).

### Implementacja Estetyki UX/UI

- **Design System:** Użyj **Chakra UI** (+ Tailwind) jako wysokiej jakości, dostępnego fundamentu.
- **Wskazówki wizualne:**
  - Avatars dla salonów/stylistów (placeholders jeśli trzeba, ale ładne).
  - Odznaki statusu (Otwarte Teraz, Zamknięte).
  - Skeleton loaders (szkielety) zamiast spinnerów.

---

## 3. Rekomendowane Następne Kroki dla V2

1.  **Zatwierdzenie:** Potwierdź tę zmianę architektoniczną (Rozdział Autentykacji, Dashboard-First, Byt Pracownika).
2.  **Stos Technologiczny:**
    - _Frontend:_ React + Vite + Tailwind + Chakra UI.
    - _Router:_ lub TanStack Router dla czystego routingu `/biz` vs `/`.
    - _Stan:_ TanStack Query (kluczowe dla danych dashboardu).
3.  **Implementacja:** Rozpocznij od **Szkieletu Dashboardu Właściciela** (strona "SaaS"), ponieważ to on napędza treści dla strony użytkownika.
