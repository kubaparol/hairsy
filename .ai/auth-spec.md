# Specyfikacja Techniczna - Moduł Autentykacji

## 1. Wprowadzenie

Niniejsza specyfikacja opisuje architekturę i implementację modułu rejestracji, logowania i odzyskiwania hasła dla aplikacji Hairsy. Moduł realizuje wymagania z User Stories US-001, US-002 i US-003 z dokumentu PRD.

### 1.1 Zakres funkcjonalności

- **US-001**: Rejestracja i logowanie przez email i hasło
- **US-002**: Wymuszanie zgód GDPR podczas rejestracji
- **US-003**: Ograniczenie dostępu do zasobów na podstawie roli użytkownika

### 1.2 Stack technologiczny

- **Frontend**: React, TypeScript, TanStack Router, TanStack Query, Tailwind CSS, Shadcn/UI
- **Backend**: Supabase (Auth + Database)
- **Autentykacja**: Supabase Auth z email/password

### 1.3 Istniejące komponenty

Aplikacja posiada już podstawową infrastrukturę autentykacji:

- API funkcje: `signUp`, `signIn`, `signOut`, `getSession`, `getUser`
- React hooks: `useSignUp`, `useSignIn`, `useSignOut`, `useSession`, `useUser`
- Formularz logowania: `SignInForm` w `features/auth/components/sign-in-form.tsx`
- Ochrona tras: `beforeLoad` w `appRoute` i `signInRoute`
- System błędów: `SupabaseError` z mapowaniem kodów błędów

## 2. Architektura Interfejsu Użytkownika

### 2.1 Struktura tras i routingu

#### 2.1.1 Trasy autentykacji (non-auth)

**Trasa: `/sign-up`**

- **Komponent**: `sign-up-form` w `features/auth/components/sign-up-form.tsx`
- **Route**: `features/auth/route.tsx` (rozszerzenie istniejącego pliku)
- **Ochrona**: `beforeLoad` sprawdza czy użytkownik jest już zalogowany → przekierowanie do `/app`
- **Funkcjonalność**: Formularz rejestracji z polami email, hasło, potwierdzenie hasła, imię, checkboxy zgód GDPR

**Trasa: `/sign-in`**

- **Komponent**: `sign-in-form` w `features/auth/components/sign-in-form.tsx`
- **Rozszerzenia**:
  - Link do rejestracji (`/sign-up`)
  - Link do odzyskiwania hasła (`/forgot-password`)
- **Ochrona**: `beforeLoad` sprawdza czy użytkownik jest już zalogowany → przekierowanie do `/app`

**Trasa: `/forgot-password`**

- **Komponent**: `forgot-password-form` w `features/auth/components/forgot-password-form.tsx`
- **Route**: `features/auth/route.tsx`
- **Ochrona**: `beforeLoad` sprawdza czy użytkownik jest już zalogowany → przekierowanie do `/app`
- **Funkcjonalność**: Formularz z polem email do wysłania linku resetującego hasło

**Trasa: `/reset-password`**

- **Komponent**: `reset-password-form` w `features/auth/components/reset-password-form.tsx`
- **Route**: `features/auth/route.tsx`
- **Ochrona**: `beforeLoad` sprawdza czy użytkownik jest już zalogowany → przekierowanie do `/app`
- **Query params**: `token` (hash z emaila), `type` (zawsze `recovery`)
- **Funkcjonalność**: Formularz z polami: nowe hasło, potwierdzenie hasła

#### 2.1.2 Trasy chronione (auth)

**Trasa: `/app`**

- **Ochrona**: `beforeLoad` sprawdza sesję → jeśli brak, przekierowanie do `/sign-in` z parametrem `redirect`

**Trasa: `/onboarding`** (dla OWNER)

- **Ochrona**: `beforeLoad` sprawdza:
  - Czy użytkownik jest zalogowany
  - Czy użytkownik ma rolę `OWNER`
- **Funkcjonalność**: Proces onboardingu salonu (poza zakresem tej specyfikacji)

### 2.2 Komponenty formularzy

#### 2.2.1 sign-up-form

**Lokalizacja**: `apps/app/src/features/auth/components/sign-up-form.tsx`

**Pola formularza**:

- `email` (string, required, type="email")
- `password` (string, required, type="password", minLength=8)
- `confirmPassword` (string, required, type="password")
- `firstName` (string, required, maxLength=100)
- `consents` (array of strings, required)

**Walidacja po stronie klienta**:

- Email: format email, wymagane
- Hasło: minimum 8 znaków, wymagane
- Potwierdzenie hasła: musi być identyczne z hasłem
- Imię: maksymalnie 100 znaków
- Zgody: wszystkie wymagane zgody muszą być zaznaczone

**Obsługa błędów**:

- `USER_ALREADY_EXISTS`: "Użytkownik z tym adresem email już istnieje"
- `WEAK_PASSWORD`: "Hasło jest zbyt słabe. Użyj co najmniej 8 znaków"
- `EMAIL_NOT_CONFIRMED`: "Sprawdź swoją skrzynkę email i potwierdź rejestrację"
- `RATE_LIMITED`: "Zbyt wiele prób rejestracji. Poczekaj chwilę i spróbuj ponownie"
- Ogólne błędy: wyświetlenie komunikatu z `error.message`

**Akcje po sukcesie**:

- Zapisanie zgód w bazie danych (tabela `consents`)
- Wyświetlenie komunikatu: "Sprawdź swoją skrzynkę email i potwierdź rejestrację"
- Przekierowanie do `/sign-in` po kliknięciu linku

**Walidacja zgód**:

- Wszystkie wymagane zgody muszą być zaznaczone przed wysłaniem formularza

**Hook**: `useSignUp` z `@/entities/auth/hooks/use-sign-up.ts`

**Dodatkowe elementy UI**:

- Link do strony logowania: "Masz już konto? Zaloguj się"
- Wskaźnik siły hasła
- Checkboxy dla wymaganych zgód GDPR:
  - Zgoda na przetwarzanie danych osobowych (wymagana)
  - Zgoda marketingowa (opcjonalna)
- Linki do pełnych tekstów regulaminów/polityk prywatności

#### 2.2.2 sign-in-form

**Lokalizacja**: `apps/app/src/features/auth/components/sign-in-form.tsx`

**Rozszerzenia**:

- Link do rejestracji: "Nie masz konta? Zarejestruj się" → `/sign-up`
- Link do odzyskiwania hasła: "Zapomniałeś hasła?" → `/forgot-password`

**Obsługa błędów** (rozszerzenie istniejącej):

- `INVALID_CREDENTIALS`: "Nieprawidłowy email lub hasło"
- `EMAIL_NOT_CONFIRMED`: "Sprawdź swoją skrzynkę email i potwierdź rejestrację"
- `RATE_LIMITED`: "Zbyt wiele prób logowania. Poczekaj chwilę i spróbuj ponownie"
- `SESSION_EXPIRED`: "Sesja wygasła. Zaloguj się ponownie"

**Akcje po sukcesie**:

- Inwalidacja routera: `await router.invalidate()`
- Przekierowanie do `redirectPath || '/app'`

#### 2.2.3 forgot-password-form

**Lokalizacja**: `apps/app/src/features/auth/components/forgot-password-form.tsx`

**Pola formularza**:

- `email` (string, required, type="email")

**Walidacja po stronie klienta**:

- Email: format email, wymagane

**Obsługa błędów**:

- `ROW_NOT_FOUND`: "Nie znaleziono użytkownika z tym adresem email" (bezpieczny komunikat, nie ujawnia czy email istnieje)
- `RATE_LIMITED`: "Zbyt wiele prób. Poczekaj chwilę i spróbuj ponownie"
- Ogólne błędy: wyświetlenie komunikatu z `error.message`

**Akcje po sukcesie**:

- Wyświetlenie komunikatu sukcesu: "Jeśli ten adres email istnieje w systemie, otrzymasz wiadomość z instrukcjami resetowania hasła"
- Link powrotu do logowania: "Powrót do logowania"

**Hook**: `useResetPassword` z `@/entities/auth/hooks/use-reset-password.ts`

**Dodatkowe elementy UI**:

- Informacja: "Podaj adres email, a wyślemy Ci link do resetowania hasła"
- Link powrotu do logowania

#### 2.2.4 reset-password-form

**Lokalizacja**: `apps/app/src/features/auth/components/reset-password-form.tsx`

**Pola formularza**:

- `password` (string, required, type="password", minLength=8)
- `confirmPassword` (string, required, type="password", sameAs="password")

**Walidacja po stronie klienta**:

- Hasło: minimum 8 znaków, wymagane
- Potwierdzenie hasła: musi być identyczne z hasłem

**Query params** (z URL):

- `token`: hash z linku resetującego
- `type`: typ akcji (zawsze `recovery`)

**Obsługa błędów**:

- `SESSION_EXPIRED`: "Link resetujący wygasł. Poproś o nowy link"
- `WEAK_PASSWORD`: "Hasło jest zbyt słabe. Użyj co najmniej 8 znaków"
- `INVALID_CREDENTIALS`: "Nieprawidłowy lub wygasły link resetujący"
- Ogólne błędy: wyświetlenie komunikatu z `error.message`

**Akcje po sukcesie**:

- Wyświetlenie komunikatu sukcesu: "Hasło zostało zmienione pomyślnie"
- Przekierowanie do `/sign-in` po kliknięciu linku

**Hook**: `useUpdatePassword` z `@/entities/auth/hooks/use-update-password.ts`

**Dodatkowe elementy UI**:

- Informacja o wymaganiach dotyczących hasła
- Link do logowania po sukcesie

### 2.3 Layouty i tryby wyświetlania

#### 2.3.1 Layout dla tras non-auth

**Komponent**: `auth-layout` w `features/auth/components/auth-layout.tsx`

**Funkcjonalność**:

- Wspólny layout dla `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`
- Prosty, minimalistyczny design
- Logo aplikacji
- Centralnie wyświetlony formularz
- Linki nawigacyjne między formularzami

**Użycie**:

```tsx
<AuthLayout>
  <SignInForm />
</AuthLayout>
```

**Uwaga**: W kodzie JSX używamy PascalCase dla komponentów React, ale nazwy plików są z myślnikiem (kebab-case).

#### 2.3.2 Layout dla tras auth

**Komponent**: `app-layout` w `features/app/components/app-layout.tsx`

**Funkcjonalność**:

- Layout dla zalogowanych użytkowników
- Header z menu użytkownika
- Nawigacja główna
- Wylogowanie

### 2.4 Komponenty pomocnicze

#### 2.4.1 error-message

**Lokalizacja**: `apps/app/src/shared/ui/components/error-message.tsx`

**Funkcjonalność**:

- Uniwersalny komponent do wyświetlania błędów
- Obsługa różnych typów błędów (SupabaseError, string, Error)
- Stylowanie zgodne z Shadcn/UI (Alert component)

**Props**:

```typescript
interface ErrorMessageProps {
  error: SupabaseError | Error | string | null;
  className?: string;
}
```

#### 2.4.2 password-strength-indicator

**Lokalizacja**: `apps/app/src/shared/ui/components/password-strength-indicator.tsx`

**Funkcjonalność**:

- Wskaźnik siły hasła
- Wizualna reprezentacja (bar, kolory)
- Wskazówki dotyczące wymagań hasła

#### 2.4.3 loading-button

**Lokalizacja**: `apps/app/src/shared/ui/components/loading-button.tsx`

**Funkcjonalność**:

- Przycisk z obsługą stanu ładowania
- Disabled podczas ładowania
- Wskaźnik ładowania (spinner)

## 3. Logika Backendowa

### 3.1 API funkcje autentykacji

#### 3.1.1 Istniejące funkcje (bez zmian)

**Lokalizacja**: `apps/app/src/entities/auth/api/`

- `signUp()` - rejestracja użytkownika
- `signIn()` - logowanie użytkownika
- `signOut()` - wylogowanie użytkownika
- `getSession()` - pobranie sesji
- `getUser()` - pobranie użytkownika z walidacją serwera

#### 3.1.2 Nowe funkcje API

**resetPassword()**

- **Lokalizacja**: `apps/app/src/entities/auth/api/reset-password.ts`
- **Funkcjonalność**: Wysyłanie emaila z linkiem resetującym hasło
- **Supabase API**: `supabase.auth.resetPasswordForEmail(email, options)`
- **Parametry**:
  ```typescript
  interface ResetPasswordOptions {
    email: string;
    redirectTo?: string; // URL do przekierowania po kliknięciu linku
  }
  ```
- **Obsługa błędów**: Mapowanie błędów Supabase do `SupabaseError`
- **Zwraca**: `void` (sukces) lub rzuca `SupabaseError`

**updatePassword()**

- **Lokalizacja**: `apps/app/src/entities/auth/api/update-password.ts`
- **Funkcjonalność**: Aktualizacja hasła użytkownika (używane po kliknięciu linku resetującego)
- **Supabase API**: `supabase.auth.updateUser({ password: newPassword })`
- **Parametry**:
  ```typescript
  interface UpdatePasswordOptions {
    password: string;
  }
  ```
- **Obsługa błędów**: Mapowanie błędów Supabase do `SupabaseError`
- **Zwraca**: `User` lub rzuca `SupabaseError`
- **Uwaga**: Wymaga aktywnej sesji (ustawionej przez Supabase po kliknięciu linku)

### 3.2 API funkcje profilu użytkownika

#### 3.2.1 createProfile()

**Lokalizacja**: `apps/app/src/entities/profile/api/create-profile.ts` (nowa encja)

**Funkcjonalność**: Tworzenie profilu użytkownika podczas rejestracji

**Supabase Query**:

```typescript
supabase
  .from('profiles')
  .insert({
    id: userId,
    email: user.email,
    role: 'USER',
    first_name: firstName,
  })
  .select()
  .single();
```

**Parametry**:

```typescript
interface CreateProfileInput {
  userId: string;
  email: string;
  firstName: string;
  role: 'OWNER' | 'USER';
}
```

**Obsługa błędów**:

- `UNIQUE_VIOLATION`: Profil już istnieje (nie jest błędem, można zignorować)
- `FOREIGN_KEY_VIOLATION`: Nieprawidłowy userId
- Ogólne błędy: `SupabaseError`

**Zwraca**: `Profile` lub rzuca `SupabaseError`

**Uwaga**: Może być wywoływane przez trigger database po utworzeniu użytkownika w `auth.users`, ale powinno być również dostępne jako funkcja API na wypadek gdyby trigger nie zadziałał.

#### 3.2.2 getProfile()

**Lokalizacja**: `apps/app/src/entities/profile/api/get-profile.ts` (nowa encja)

**Funkcjonalność**: Pobranie profilu użytkownika

**Supabase Query**:

```typescript
supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .is('deleted_at', null)
  .single();
```

**Parametry**: `userId: string`

**Obsługa błędów**:

- `ROW_NOT_FOUND`: Profil nie istnieje
- `PERMISSION_DENIED`: Brak uprawnień (RLS)
- Ogólne błędy: `SupabaseError`

**Zwraca**: `Profile | null` lub rzuca `SupabaseError`

### 3.3 API funkcje zgód GDPR

#### 3.3.1 acceptConsents()

**Lokalizacja**: `apps/app/src/entities/consent/api/accept-consents.ts` (nowa encja)

**Funkcjonalność**: Zapisanie zaakceptowanych zgód użytkownika

**Supabase Query**:

```typescript
supabase.from('consents').insert(
  policyVersions.map((version) => ({
    user_id: userId,
    policy_version: version,
    ip_address: ipAddress,
    user_agent: userAgent,
  })),
);
```

**Parametry**:

```typescript
interface AcceptConsentsInput {
  userId: string;
  policyVersions: string[];
  ipAddress?: string;
  userAgent?: string;
}
```

**Obsługa błędów**:

- `UNIQUE_VIOLATION`: Zgoda już została zaakceptowana (można zignorować lub zaktualizować timestamp)
- `PERMISSION_DENIED`: Brak uprawnień (RLS)
- Ogólne błędy: `SupabaseError`

**Zwraca**: `Consent[]` lub rzuca `SupabaseError`

### 3.4 Walidacja danych wejściowych

#### 3.4.1 Walidacja email

**Reguły**:

- Format email zgodny z RFC 5322
- Maksymalna długość: 255 znaków
- Walidacja po stronie klienta i serwera (Supabase)

**Implementacja**:

- Po stronie klienta: HTML5 `type="email"` + regex (opcjonalnie)
- Po stronie serwera: Supabase Auth automatycznie waliduje format

#### 3.4.2 Walidacja hasła

**Reguły**:

- Minimum 8 znaków (wymaganie Supabase)
- Maksymalna długość: 72 znaki (ograniczenie bcrypt)
- Walidacja po stronie klienta i serwera

**Implementacja**:

- Po stronie klienta: HTML5 `minLength={8}` + walidacja w formularzu
- Po stronie serwera: Supabase Auth automatycznie sprawdza wymagania

#### 3.4.3 Walidacja imienia

**Reguły**:

- Wymagane pole
- Maksymalna długość: 100 znaków (zgodnie z schematem bazy danych)
- Dozwolone znaki: litery, spacje, myślniki, apostrofy

**Implementacja**:

- Po stronie klienta: `maxLength={100}` + regex (opcjonalnie)
- Po stronie serwera: constraint w bazie danych

### 3.5 Obsługa wyjątków

#### 3.5.1 Mapowanie błędów Supabase

**Lokalizacja**: `apps/app/src/entities/_shared/lib/parse-supabase-error.ts` (istniejący)

**Rozszerzenia**:

- Dodanie mapowania dla błędów resetowania hasła:
  - `email_not_found` → `ROW_NOT_FOUND` (ale bezpieczny komunikat)
  - `token_expired` → `SESSION_EXPIRED`
  - `invalid_token` → `INVALID_CREDENTIALS`

#### 3.5.2 Komunikaty błędów użytkownika

**Zasady**:

- Komunikaty w języku polskim
- Bezpieczne komunikaty (nie ujawniające informacji o istnieniu użytkownika)
- Konkretne wskazówki dotyczące rozwiązania problemu

**Przykłady**:

- Zamiast "Użytkownik nie istnieje" → "Jeśli ten adres email istnieje w systemie, otrzymasz wiadomość..."
- Zamiast "Nieprawidłowe hasło" → "Nieprawidłowy email lub hasło" (nie ujawnia które pole jest błędne)

## 4. System Autentykacji

### 4.1 Integracja z Supabase Auth

#### 4.1.1 Konfiguracja Supabase Auth

**Plik konfiguracyjny**: `apps/app/supabase/config.toml`

**Ustawienia** (istniejące):

- `enable_signup = true` - rejestracja włączona
- `enable_confirmations = false` - potwierdzenie email wyłączone (może być zmienione)
- `secure_password_change = false` - zmiana hasła bez reautentykacji

**Wymagane ustawienia dla resetowania hasła**:

- `enable_signup = true`
- Konfiguracja SMTP dla wysyłania emaili (w produkcji)
- Template emaila resetującego hasło (opcjonalnie)

#### 4.1.2 Flow rejestracji

1. **Użytkownik wypełnia formularz rejestracji**
   - Email, hasło, potwierdzenie hasła, imię

2. **Wywołanie `signUp()`**
   - Supabase tworzy użytkownika w `auth.users`
   - Jeśli `enable_confirmations = true`, wysyłany jest email z linkiem potwierdzającym
   - Jeśli `enable_confirmations = false`, użytkownik jest automatycznie potwierdzony

3. **Trigger database (jeśli istnieje)**
   - Automatyczne utworzenie profilu w tabeli `profiles` z rolą `USER`

4. **Jeśli trigger nie istnieje**
   - Wywołanie `createProfile()` po rejestracji

5. **Przekierowanie użytkownika**
   - Jeśli wymagane potwierdzenie email → komunikat "Sprawdź email"
   - Jeśli nie wymagane → przekierowanie do `/sign-in`

#### 4.1.3 Flow logowania

1. **Użytkownik wypełnia formularz logowania**
   - Email i hasło

2. **Wywołanie `signIn()`**
   - Supabase weryfikuje credentials
   - Tworzy sesję w `auth.sessions`

3. **Przekierowanie użytkownika**
   - Jeśli OWNER bez salonu → `/onboarding`
   - W przeciwnym razie → `/app` lub `redirectPath`

#### 4.1.4 Flow resetowania hasła

1. **Użytkownik wypełnia formularz "Zapomniałem hasła"**
   - Email

2. **Wywołanie `resetPassword()`**
   - Supabase wysyła email z linkiem resetującym
   - Link zawiera token i parametr `type=recovery`
   - Link przekierowuje do `/reset-password?token=...&type=recovery`

3. **Użytkownik klika link w emailu**
   - Supabase automatycznie ustawia sesję recovery
   - Przekierowanie do `/reset-password` z tokenem w URL

4. **Użytkownik wypełnia formularz resetowania**
   - Nowe hasło i potwierdzenie

5. **Wywołanie `updatePassword()`**
   - Supabase aktualizuje hasło użytkownika
   - Sesja recovery jest zamieniana na normalną sesję logowania

6. **Przekierowanie użytkownika**
   - Komunikat sukcesu
   - Przekierowanie do `/sign-in` (lub automatyczne logowanie, w zależności od konfiguracji)

#### 4.1.5 Flow wylogowania

1. **Wywołanie `signOut()`**
   - Supabase usuwa sesję lokalną (`scope: 'local'`)
   - Opcjonalnie: `scope: 'global'` usuwa wszystkie sesje

2. **Czyszczenie cache**
   - `queryClient.clear()` usuwa wszystkie dane z cache React Query

3. **Przekierowanie**
   - Do `/sign-in`

### 4.2 Mechanizm sesji

#### 4.2.1 Subskrypcja zmian sesji

**Lokalizacja**: `apps/app/src/app/provider.tsx` (rozszerzenie istniejącego)

**Funkcjonalność**:

- Subskrypcja do zmian sesji Supabase: `supabase.auth.onAuthStateChange()`
- Automatyczna inwalidacja zapytań React Query przy zmianie sesji
- Aktualizacja routera przy zmianie stanu autentykacji

**Implementacja**:

```typescript
useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    // Inwalidacja zapytań auth
    queryClient.invalidateQueries({ queryKey: authKeys.all });

    // Aktualizacja routera
    router.invalidate();
  });

  return () => subscription.unsubscribe();
}, []);
```

#### 4.2.2 Odświeżanie sesji

**Automatyczne odświeżanie**:

- Supabase automatycznie odświeża tokeny przed wygaśnięciem
- `useSession()` hook ma `staleTime: 60 * 1000` (1 minuta) dla szybkiego wykrycia zmian

**Ręczne odświeżanie**:

- `getUser()` wykonuje request do serwera i weryfikuje sesję
- Używane w `beforeLoad` tras dla pewności aktualnego stanu

### 4.3 Ochrona tras (Route Guards)

#### 4.3.1 Guard dla tras non-auth

**Wzorzec**:

```typescript
beforeLoad: async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    throw redirect({ to: '/app' });
  }
};
```

**Zastosowanie**: `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`

#### 4.3.2 Guard dla tras auth

**Wzorzec**:

```typescript
beforeLoad: async ({ location }) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (!session || error) {
    throw redirect({
      to: '/sign-in',
      search: { redirect: location.pathname },
    });
  }
};
```

**Zastosowanie**: `/app`, `/onboarding`, wszystkie trasy wymagające autentykacji

#### 4.3.3 Guard dla tras OWNER

**Wzorzec**:

```typescript
beforeLoad: async () => {
  // ... standardowy guard auth ...

  const profile = await getProfile(session.user.id);

  if (profile?.role !== 'OWNER') {
    throw redirect({ to: '/app' });
  }
};
```

**Zastosowanie**: `/onboarding`

### 4.4 Różnicowanie ról użytkowników

#### 4.4.1 Role w systemie

**Role zdefiniowane w bazie danych**:

- `OWNER`: Właściciel salonu
- `USER`: Klient

**Przechowywanie**: Tabela `profiles`, kolumna `role`

#### 4.4.2 Ustalanie roli przy rejestracji

**Domyślna rola**: `USER`

**Zmiana roli na OWNER**:

- Może być wykonana przez administratora (poza zakresem MVP)
- Lub przez specjalny flow rejestracji właściciela (jeśli wymagane przez product)

**Uwaga**: W MVP zakładamy, że użytkownik wybiera rolę podczas rejestracji lub jest automatycznie przypisywana jako `USER`, a zmiana na `OWNER` następuje później (mechanizm do ustalenia z product).

#### 4.4.3 Sprawdzanie roli w komponentach

**Hook**: `useUserRole()` (nowy)

**Lokalizacja**: `apps/app/src/entities/profile/queries/use-user-role.ts`

**Implementacja**:

```typescript
export function useUserRole() {
  const { data: user } = useUser();
  const { data: profile } = useProfile(user?.id);

  return profile?.role ?? null;
}
```

**Użycie**:

```typescript
const role = useUserRole();

if (role === 'OWNER') {
  // Renderuj funkcje właściciela
}
```

### 4.5 Flow rejestracji i logowania

#### 4.5.1 Flow rejestracji

1. **Rejestracja**
   - Utworzenie użytkownika w `auth.users`
   - Akceptacja wymaganych zgód GDPR w formularzu rejestracji
   - Zapisanie zgód w tabeli `consents`
   - Utworzenie profilu w `profiles` (przez trigger lub ręcznie)

2. **Przekierowanie do właściwej strony**
   - Jeśli wymagane potwierdzenie email → komunikat "Sprawdź email"
   - Jeśli nie wymagane → przekierowanie do `/sign-in`

#### 4.5.2 Flow logowania

1. **Logowanie**
   - Użytkownik musi mieć już utworzone konto (rejestracja jest wymagana)
   - Weryfikacja credentials przez Supabase
   - Utworzenie sesji

2. **Przekierowanie do właściwej strony**
   - OWNER bez salonu → `/onboarding`
   - W przeciwnym razie → `/app`

## 5. Integracja z istniejącym kodem

### 5.1 Rozszerzenie istniejących modułów

#### 5.1.1 Rozszerzenie `entities/auth`

**Nowe pliki**:

- `api/reset-password.ts` - funkcja resetowania hasła
- `api/update-password.ts` - funkcja aktualizacji hasła
- `mutations/use-reset-password.ts` - hook dla resetowania hasła
- `mutations/use-update-password.ts` - hook dla aktualizacji hasła

**Rozszerzenia istniejących plików**:

- `api/index.ts` - eksport nowych funkcji
- `mutations/index.ts` - eksport nowych hooks
- `index.ts` - eksport wszystkich nowych elementów

#### 5.1.2 Nowa encja `entities/profile`

**Struktura**:

```
entities/profile/
  api/
    create-profile.ts
    get-profile.ts
    update-profile.ts
    index.ts
  queries/
    query-keys.ts
    use-profile.ts
    use-user-role.ts
    index.ts
  mutations/
    use-create-profile.ts
    use-update-profile.ts
    index.ts
  index.ts
```

#### 5.1.3 Nowa encja `entities/consent`

**Struktura**:

```
entities/consent/
  api/
    accept-consents.ts
    get-consents.ts
    index.ts
  queries/
    query-keys.ts
    use-consents.ts
    index.ts
  mutations/
    use-accept-consents.ts
    index.ts
  index.ts
```

### 5.2 Rozszerzenie routingu

#### 5.2.1 Rozszerzenie `features/auth/route.tsx`

**Nowe trasy**:

- `signUpRoute` - `/sign-up`
- `signInRoute` - `/sign-in`
- `forgotPasswordRoute` - `/forgot-password`
- `resetPasswordRoute` - `/reset-password`

#### 5.2.2 Aktualizacja `app/router.tsx`

**Dodanie nowych tras do drzewa routingu**:

```typescript
const routeTree = rootRoute.addChildren([
  signUpRoute,
  signInRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  appRoute,
  // ... inne trasy
]);
```

### 5.3 Rozszerzenie providera

#### 5.3.1 Aktualizacja `app/provider.tsx`

**Dodanie**:

- Subskrypcja do zmian sesji Supabase
- Automatyczna inwalidacja zapytań przy zmianie sesji
- Aktualizacja routera przy zmianie stanu autentykacji

## 6. Bezpieczeństwo

### 6.1 Ochrona przed atakami

#### 6.1.1 Rate Limiting

**Supabase Auth**:

- Automatyczne rate limiting dla prób logowania/rejestracji
- Konfiguracja w `config.toml`: `max_frequency = "1s"`

**Obsługa po stronie klienta**:

- Wyświetlanie komunikatu `RATE_LIMITED` użytkownikowi
- Disabled przycisku podczas oczekiwania

#### 6.1.2 Walidacja danych

**Po stronie klienta**:

- HTML5 validation attributes
- Walidacja w formularzach przed wysłaniem

**Po stronie serwera**:

- Supabase Auth automatycznie waliduje dane
- Constraints w bazie danych
- RLS (Row Level Security) dla ochrony danych

#### 6.1.3 Bezpieczne komunikaty błędów

**Zasady**:

- Nie ujawnianie informacji o istnieniu użytkownika
- Ogólne komunikaty dla błędów autentykacji
- Szczegółowe komunikaty tylko dla błędów walidacji (nie związanych z bezpieczeństwem)

### 6.2 Row Level Security (RLS)

#### 6.2.1 Polityki RLS dla `profiles`

**SELECT**: Użytkownik może odczytać tylko swój własny profil
**UPDATE**: Użytkownik może aktualizować tylko swój własny profil
**INSERT**: Automatyczne przez trigger lub przez użytkownika dla własnego profilu

#### 6.2.2 Polityki RLS dla `consents`

**SELECT**: Użytkownik może odczytać tylko swoje zgody
**INSERT**: Użytkownik może tworzyć tylko swoje zgody
**UPDATE/DELETE**: Zgody są niezmienne (tylko do odczytu po utworzeniu)

### 6.3 Bezpieczeństwo sesji

#### 6.3.1 Tokeny JWT

**Supabase Auth**:

- Automatyczne zarządzanie tokenami JWT
- Refresh token przed wygaśnięciem
- Secure storage w przeglądarce (httpOnly cookies w produkcji, jeśli skonfigurowane)

#### 6.3.2 Wylogowanie

**Scope wylogowania**:

- `local`: Tylko bieżące urządzenie (domyślnie)
- `global`: Wszystkie urządzenia
- `others`: Wszystkie urządzenia oprócz bieżącego

## 7. Testowanie

### 7.1 Scenariusze testowe

#### 7.1.1 Rejestracja

- ✅ Rejestracja z poprawnymi danymi
- ✅ Rejestracja z istniejącym emailem (błąd)
- ✅ Rejestracja ze słabym hasłem (błąd)
- ✅ Rejestracja z niepasującymi hasłami (walidacja klienta)
- ✅ Rejestracja z nieprawidłowym formatem email (walidacja klienta)

#### 7.1.2 Logowanie

- ✅ Logowanie z poprawnymi danymi
- ✅ Logowanie z nieprawidłowym hasłem (błąd)
- ✅ Logowanie z nieistniejącym emailem (błąd)
- ✅ Logowanie z niepotwierdzonym emailem (jeśli włączone)
- ✅ Przekierowanie po zalogowaniu (z i bez parametru `redirect`)

#### 7.1.3 Resetowanie hasła

- ✅ Wysłanie linku resetującego z poprawnym emailem
- ✅ Wysłanie linku resetującego z nieistniejącym emailem (bezpieczny komunikat)
- ✅ Kliknięcie linku resetującego i zmiana hasła
- ✅ Próba użycia wygasłego linku (błąd)
- ✅ Próba użycia nieprawidłowego tokenu (błąd)

#### 7.1.4 Zgody GDPR

- ✅ Wyświetlenie checkboxów zgód w formularzu rejestracji
- ✅ Akceptacja wszystkich wymaganych zgód podczas rejestracji
- ✅ Próba rejestracji bez akceptacji (walidacja formularza)
- ✅ Zapisanie zgód w bazie danych po rejestracji

#### 7.1.5 Ochrona tras

- ✅ Próba dostępu do `/app` bez logowania (przekierowanie)
- ✅ Próba dostępu do `/sign-in` po zalogowaniu (przekierowanie)

### 7.2 Testy integracyjne

#### 7.2.1 End-to-end flow rejestracji i logowania

1. Rejestracja nowego użytkownika z akceptacją zgód GDPR
2. Sprawdzenie utworzenia profilu i zapisania zgód
3. Logowanie z nowymi danymi
4. Przekierowanie do `/app` lub `/onboarding`

#### 7.2.2 End-to-end flow resetowania hasła

1. Wysłanie linku resetującego
2. Kliknięcie linku w emailu
3. Zmiana hasła
4. Logowanie z nowym hasłem

## 8. Uwagi implementacyjne

### 8.1 Wersjonowanie polityk GDPR

**Mechanizm**:

- Polityki są identyfikowane przez wersję (np. `privacy_policy_v1`)
- Każda nowa wersja wymaga ponownej akceptacji
- System sprawdza czy użytkownik ma zaakceptowaną najnowszą wersję

**Implementacja**:

- Lista wymaganych wersji polityk w konfiguracji aplikacji
- Zgody są akceptowane podczas rejestracji w formularzu `sign-up-form`

### 8.2 Konfiguracja wymaganych zgód

**Lokalizacja**: Konfiguracja aplikacji (env variables lub config file)

**Przykład**:

```typescript
const REQUIRED_CONSENTS = ['privacy_policy_v1', 'terms_of_service_v1'];
```

**Użycie**:

- W formularzu rejestracji (`sign-up-form`) do wyświetlenia checkboxów
- W `acceptConsents()` podczas rejestracji

### 8.3 Obsługa błędów sieciowych

**Strategia**:

- Retry dla błędów sieciowych (opcjonalnie)
- Wyświetlanie przyjaznych komunikatów
- Logowanie błędów w development mode

**Implementacja**:

- `SupabaseError.isRetryable()` sprawdza czy błąd można ponowić
- React Query automatycznie retryuje niektóre błędy (konfiguracja w `queryClient`)

### 8.4 Accessibility (A11y)

**Wymagania**:

- Wszystkie formularze powinny mieć odpowiednie `label` dla pól
- Komunikaty błędów powinny być powiązane z polami przez `aria-describedby`
- Przyciski powinny mieć odpowiednie stany (`disabled`, `aria-busy` podczas ładowania)
- Nawigacja klawiaturą powinna działać poprawnie

## 9. Podsumowanie

### 9.1 Nowe komponenty do utworzenia

**Frontend**:

- `SignUpForm` - formularz rejestracji (z checkboxami zgód GDPR)
- `ForgotPasswordForm` - formularz resetowania hasła
- `ResetPasswordForm` - formularz zmiany hasła
- `AuthLayout` - layout dla tras autentykacji
- `ErrorMessage` - komponent wyświetlania błędów (rozszerzenie)

**Backend/API**:

- `resetPassword()` - wysyłanie linku resetującego
- `updatePassword()` - aktualizacja hasła
- `createProfile()` - tworzenie profilu użytkownika
- `getProfile()` - pobranie profilu użytkownika
- `acceptConsents()` - akceptacja zgód (wywoływane podczas rejestracji)

**Hooks**:

- `useResetPassword()` - hook dla resetowania hasła
- `useUpdatePassword()` - hook dla aktualizacji hasła
- `useProfile()` - hook dla profilu użytkownika
- `useUserRole()` - hook dla roli użytkownika
- `useConsents()` - hook dla zgód
- `useAcceptConsents()` - hook dla akceptacji zgód (używany w formularzu rejestracji)

**Trasy**:

- `/sign-up` - rejestracja (z formularzem zgód GDPR)
- `/forgot-password` - resetowanie hasła
- `/reset-password` - zmiana hasła

### 9.2 Rozszerzenia istniejących komponentów

- `SignInForm` - dodanie linków do rejestracji i resetowania hasła
- `signInRoute` - bez zmian w logice, tylko rozszerzenie UI
- `appRoute` - sprawdzanie sesji w `beforeLoad`
- `app/provider.tsx` - dodanie subskrypcji zmian sesji
- `app/router.tsx` - dodanie nowych tras

### 9.3 Nowe encje

- `entities/profile/` - zarządzanie profilami użytkowników
- `entities/consent/` - zarządzanie zgodami GDPR

### 9.4 Kluczowe decyzje do podjęcia przez product

1. **Wersjonowanie polityk GDPR**: Jak identyfikować wersje polityk? (np. `privacy_policy_v1`)
2. **Lista wymaganych zgód**: Które zgody są wymagane? (privacy policy, terms of service, marketing?)
3. **Potwierdzenie email**: Czy włączyć `enable_confirmations` w Supabase?
4. **Rola przy rejestracji**: Jak użytkownik staje się OWNER? (wybór podczas rejestracji, późniejsza zmiana, przez admina?)
5. **Automatyczne logowanie po resetowaniu hasła**: Czy użytkownik powinien być automatycznie zalogowany po zmianie hasła?

### 9.5 Zgodność z wymaganiami

✅ **US-001**: Rejestracja i logowanie przez email/hasło - zrealizowane przez formularze i API funkcje
✅ **US-002**: Wymuszanie zgód GDPR - zrealizowane przez checkboxy w formularzu rejestracji
✅ **US-003**: Ograniczenie dostępu do zasobów - zrealizowane przez RLS, sprawdzanie roli w guardach, i funkcje API z walidacją uprawnień

### 9.6 Następne kroki

1. Implementacja nowych komponentów frontendowych
2. Implementacja nowych funkcji API
3. Implementacja nowych hooks React Query
4. Rozszerzenie routingu o nowe trasy
5. Aktualizacja guardów tras
6. Testowanie end-to-end wszystkich flow
7. Konfiguracja Supabase (SMTP, templates emaili)
8. Dokumentacja dla użytkowników końcowych (opcjonalnie)
