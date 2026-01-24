# Plan implementacji widoku Autentykacji (Sign-In / Sign-Up)

## 1. Przegląd

Widok autentykacji obejmuje dwie strony: logowania (`/sign-in`) oraz rejestracji (`/sign-up`). Strony te umożliwiają użytkownikom uwierzytelnienie się w systemie Hairsy poprzez email i hasło. Widok rejestracji dodatkowo zawiera wybór roli (Klient/Właściciel salonu) oraz checkboxy zgód GDPR wymaganych do korzystania z aplikacji. Widoki współdzielą wspólny layout (`AuthLayout`) zapewniający spójny wygląd stron autentykacji.

Cel widoku:

- Umożliwienie rejestracji nowych użytkowników z zapisem roli i zgód GDPR (US-001, US-002)
- Umożliwienie logowania istniejących użytkowników (US-001)
- Przekierowanie zalogowanych użytkowników do odpowiednich części aplikacji na podstawie roli (US-003)

## 2. Routing widoku

| Ścieżka    | Komponent    | Opis               |
| ---------- | ------------ | ------------------ |
| `/sign-in` | `SignInPage` | Strona logowania   |
| `/sign-up` | `SignUpPage` | Strona rejestracji |

Obie trasy są chronione logiką `beforeLoad`, która przekierowuje zalogowanych użytkowników do `/app`.

## 3. Struktura komponentów

```
/sign-up
└── AuthLayout
    ├── AuthBackground (dynamiczne tło zależne od roli)
    ├── RoleSwitcher
    └── SignUpForm
        ├── Field (email)
        ├── Field (password)
        ├── Field (confirmPassword)
        ├── Field (firstName)
        ├── ConsentCheckboxes
        │   └── Checkbox[] (z linkami do regulaminów)
        └── Button (submit)
    └── AuthLinks (link do /sign-in)

/sign-in
└── AuthLayout
    └── SignInForm
        ├── Field (email)
        ├── Field (password)
        └── Button (submit)
    └── AuthLinks (link do /sign-up)
```

## 4. Szczegóły komponentów

### 4.1 AuthLayout

- **Opis**: Wspólny layout dla stron autentykacji. Zapewnia wycentrowany formularz, logo aplikacji oraz spójny styl wizualny. Obsługuje animowane tło zmieniające się w zależności od wybranej roli podczas rejestracji.

- **Główne elementy**:
  - `<div>` kontener pełnoekranowy z flexbox centering
  - Logo aplikacji Hairsy
  - Slot na children (formularz)
  - Opcjonalny `AuthBackground` dla dynamicznego tła

- **Obsługiwane interakcje**: Brak bezpośrednich interakcji

- **Obsługiwana walidacja**: Brak

- **Typy**:

  ```typescript
  interface AuthLayoutProps {
    children: React.ReactNode;
    backgroundVariant?: 'user' | 'owner' | 'default';
  }
  ```

- **Propsy**:
  - `children`: React.ReactNode - treść formularza
  - `backgroundVariant`: opcjonalny wariant tła ('user' | 'owner' | 'default')

---

### 4.2 RoleSwitcher

- **Opis**: Komponent przełącznika roli użytkownika (Klient/Biznes). Wyświetla dwa przyciski segmentowe z wizualnym wyróżnieniem aktywnej opcji. Zmiana roli powoduje animowaną zmianę motywu kolorystycznego strony.

- **Główne elementy**:
  - `<div>` kontener z `role="radiogroup"`
  - Dwa `<button>` z `role="radio"` (Klient, Biznes)
  - Animowany wskaźnik aktywnej opcji

- **Obsługiwane interakcje**:
  - `onClick` na przycisku - zmiana wybranej roli
  - Keyboard navigation (strzałki ← →)

- **Obsługiwana walidacja**: Brak (zawsze jedna z opcji jest wybrana)

- **Typy**:

  ```typescript
  type UserRole = 'USER' | 'OWNER';

  interface RoleSwitcherProps {
    value: UserRole;
    onChange: (role: UserRole) => void;
    disabled?: boolean;
  }
  ```

- **Propsy**:
  - `value`: UserRole - aktualnie wybrana rola
  - `onChange`: (role: UserRole) => void - callback przy zmianie roli
  - `disabled`: boolean - opcjonalne wyłączenie interakcji

---

### 4.3 SignUpForm

- **Opis**: Formularz rejestracji użytkownika. Zawiera pola email, hasło, potwierdzenie hasła, imię oraz checkboxy zgód GDPR. Obsługuje walidację inline oraz wyświetlanie błędów serwera.

- **Główne elementy**:
  - `<form>` z `onSubmit`
  - `Field` dla email (type="email")
  - `Field` dla password (type="password")
  - `Field` dla confirmPassword (type="password")
  - `Field` dla firstName (type="text")
  - `ConsentCheckboxes` (checkboxy zgód)
  - `Button` submit z loading state

- **Obsługiwane interakcje**:
  - `onSubmit` - wysłanie formularza rejestracji
  - `onChange` na każdym polu - aktualizacja wartości
  - `onBlur` na polach - walidacja inline

- **Obsługiwana walidacja**:
  - `email`: wymagane, format email (RFC 5322), max 255 znaków
  - `password`: wymagane, min 8 znaków, min 1 wielka litera, min 1 cyfra, min 1 znak specjalny
  - `confirmPassword`: wymagane, musi być identyczne z `password`
  - `firstName`: wymagane, max 100 znaków, dozwolone: litery, spacje, myślniki, apostrofy
  - `consents`: wszystkie wymagane zgody muszą być zaznaczone

- **Typy**:

  ```typescript
  interface SignUpFormValues {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    role: UserRole;
    consents: string[];
  }

  interface SignUpFormProps {
    role: UserRole;
    onSuccess?: () => void;
  }
  ```

- **Propsy**:
  - `role`: UserRole - wybrana rola przekazana z RoleSwitcher
  - `onSuccess`: opcjonalny callback po udanej rejestracji

---

### 4.4 ConsentCheckboxes

- **Opis**: Komponent wyświetlający checkboxy zgód GDPR wymaganych podczas rejestracji. Każdy checkbox zawiera link do pełnego tekstu regulaminu/polityki prywatności.

- **Główne elementy**:
  - `<fieldset>` z `<legend>` "Wymagane zgody"
  - Lista `Checkbox` dla każdej zgody
  - `<a>` linki do pełnych tekstów dokumentów
  - Komunikat błędu walidacji

- **Obsługiwane interakcje**:
  - `onChange` na każdym checkbox - toggle stanu zgody
  - `onClick` na linku - otwarcie dokumentu w nowej karcie

- **Obsługiwana walidacja**:
  - Wszystkie zgody oznaczone jako `isRequired: true` muszą być zaznaczone
  - Błąd walidacji wyświetlany pod checkboxami

- **Typy**:

  ```typescript
  interface ConsentItem {
    id: string;
    policyVersion: string;
    label: string;
    description?: string;
    linkUrl?: string;
    isRequired: boolean;
  }

  interface ConsentCheckboxesProps {
    items: ConsentItem[];
    value: string[];
    onChange: (selectedIds: string[]) => void;
    error?: string;
  }
  ```

- **Propsy**:
  - `items`: ConsentItem[] - lista zgód do wyświetlenia
  - `value`: string[] - lista ID zaznaczonych zgód
  - `onChange`: callback z nową listą zaznaczonych zgód
  - `error`: opcjonalny komunikat błędu

---

### 4.5 SignInForm

- **Opis**: Formularz logowania użytkownika. Zawiera pola email i hasło z walidacją inline oraz obsługą błędów autentykacji.

- **Główne elementy**:
  - `<form>` z `onSubmit`
  - `Field` dla email (type="email")
  - `Field` dla password (type="password")
  - `Button` submit z loading state
  - Ogólny komunikat błędu autentykacji

- **Obsługiwane interakcje**:
  - `onSubmit` - wysłanie formularza logowania
  - `onChange` na każdym polu - aktualizacja wartości
  - `onBlur` na polach - walidacja inline

- **Obsługiwana walidacja**:
  - `email`: wymagane, format email
  - `password`: wymagane

- **Typy**:

  ```typescript
  interface SignInFormValues {
    email: string;
    password: string;
  }

  interface SignInFormProps {
    redirectPath?: string;
    onSuccess?: () => void;
  }
  ```

- **Propsy**:
  - `redirectPath`: opcjonalna ścieżka przekierowania po logowaniu
  - `onSuccess`: opcjonalny callback po udanym logowaniu

---

### 4.6 AuthLinks

- **Opis**: Komponent nawigacyjny wyświetlający link do alternatywnej strony autentykacji (z sign-in do sign-up i odwrotnie).

- **Główne elementy**:
  - `<p>` z tekstem pomocniczym
  - `<Link>` (TanStack Router) do odpowiedniej strony

- **Obsługiwane interakcje**:
  - `onClick` na linku - nawigacja do drugiej strony auth

- **Obsługiwana walidacja**: Brak

- **Typy**:

  ```typescript
  interface AuthLinksProps {
    variant: 'sign-in' | 'sign-up';
  }
  ```

- **Propsy**:
  - `variant`: określa kontekst (na sign-in pokazuje link do sign-up i odwrotnie)

## 5. Typy

### 5.1 Typy formularzy

```typescript
// Wartości formularza rejestracji
interface SignUpFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  role: 'USER' | 'OWNER';
  consents: string[]; // tablica policy_version zaakceptowanych zgód
}

// Wartości formularza logowania
interface SignInFormValues {
  email: string;
  password: string;
}
```

### 5.2 Typy zgód GDPR

```typescript
// Element zgody GDPR
interface ConsentItem {
  id: string; // unikalny identyfikator
  policyVersion: string; // wersja polityki (np. "privacy_policy_v1")
  label: string; // tekst wyświetlany obok checkboxa
  description?: string; // opcjonalny opis rozszerzony
  linkUrl?: string; // URL do pełnego tekstu dokumentu
  isRequired: boolean; // czy zgoda jest wymagana do rejestracji
}

// Konfiguracja wymaganych zgód (stała aplikacji)
const REQUIRED_CONSENTS: ConsentItem[] = [
  {
    id: 'privacy-policy',
    policyVersion: 'privacy_policy_v1',
    label: 'Akceptuję Politykę Prywatności',
    linkUrl: '/privacy-policy',
    isRequired: true,
  },
  {
    id: 'terms-of-service',
    policyVersion: 'terms_of_service_v1',
    label: 'Akceptuję Regulamin',
    linkUrl: '/terms',
    isRequired: true,
  },
];
```

### 5.3 Typy DTO (Data Transfer Objects)

```typescript
// DTO dla tworzenia profilu użytkownika
interface CreateProfileInput {
  userId: string;
  email: string;
  firstName: string;
  role: 'OWNER' | 'USER';
}

// DTO dla akceptacji zgód
interface AcceptConsentsInput {
  userId: string;
  policyVersions: string[];
  ipAddress?: string;
  userAgent?: string;
}

// Rozszerzenie istniejącego SignUpCredentials o rolę
interface SignUpCredentialsWithRole extends SignUpCredentials {
  role: 'OWNER' | 'USER';
}
```

### 5.4 Typy odpowiedzi API

```typescript
// Profil użytkownika (z bazy danych)
type Profile = Tables<'profiles'>;

// Zgoda użytkownika (z bazy danych)
type Consent = Tables<'consents'>;
```

### 5.5 Schematy walidacji Zod

```typescript
import { z } from 'zod';

// Schema walidacji formularza rejestracji
const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email jest wymagany')
      .email('Nieprawidłowy format email')
      .max(255, 'Email może mieć maksymalnie 255 znaków'),
    password: z
      .string()
      .min(8, 'Hasło musi mieć co najmniej 8 znaków')
      .regex(/[A-Z]/, 'Hasło musi zawierać co najmniej jedną wielką literę')
      .regex(/[0-9]/, 'Hasło musi zawierać co najmniej jedną cyfrę')
      .regex(
        /[^A-Za-z0-9]/,
        'Hasło musi zawierać co najmniej jeden znak specjalny',
      ),
    confirmPassword: z.string().min(1, 'Potwierdzenie hasła jest wymagane'),
    firstName: z
      .string()
      .min(1, 'Imię jest wymagane')
      .max(100, 'Imię może mieć maksymalnie 100 znaków')
      .regex(
        /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-']+$/,
        'Imię zawiera niedozwolone znaki',
      ),
    role: z.enum(['USER', 'OWNER']),
    consents: z.array(z.string()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła muszą być identyczne',
    path: ['confirmPassword'],
  });

// Schema walidacji formularza logowania
const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email jest wymagany')
    .email('Nieprawidłowy format email'),
  password: z.string().min(1, 'Hasło jest wymagane'),
});
```

## 6. Zarządzanie stanem

### 6.1 Stan formularza (React Hook Form)

Oba formularze wykorzystują `react-hook-form` z resolverem Zod do zarządzania stanem i walidacji:

```typescript
// SignUpForm
const form = useForm<SignUpFormValues>({
  resolver: zodResolver(signUpSchema),
  defaultValues: {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    role: 'USER',
    consents: [],
  },
  mode: 'onBlur', // walidacja przy blur
});

// SignInForm
const form = useForm<SignInFormValues>({
  resolver: zodResolver(signInSchema),
  defaultValues: {
    email: '',
    password: '',
  },
  mode: 'onBlur',
});
```

### 6.2 Stan roli (RoleSwitcher)

Stan wybranej roli jest zarządzany na poziomie strony `SignUpPage` i przekazywany do komponentów:

```typescript
const [selectedRole, setSelectedRole] = useState<UserRole>('USER');

// Synchronizacja z formularzem
useEffect(() => {
  form.setValue('role', selectedRole);
}, [selectedRole, form]);
```

### 6.3 Hooki mutacji

#### useSignUpWithProfile (nowy hook)

Hook łączący rejestrację, tworzenie profilu i akceptację zgód:

```typescript
interface UseSignUpWithProfileParams {
  credentials: SignUpCredentialsWithRole;
  consents: string[];
}

function useSignUpWithProfile(options?: {
  onSuccess?: () => void;
  onError?: (error: SupabaseError) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      credentials,
      consents,
    }: UseSignUpWithProfileParams) => {
      // 1. Rejestracja użytkownika
      const authData = await signUp(credentials);

      if (!authData.user) {
        throw new SupabaseError('Nie udało się utworzyć konta', 'UNKNOWN');
      }

      // 2. Tworzenie profilu
      await createProfile({
        userId: authData.user.id,
        email: credentials.email,
        firstName: credentials.firstName ?? '',
        role: credentials.role,
      });

      // 3. Akceptacja zgód
      await acceptConsents({
        userId: authData.user.id,
        policyVersions: consents,
        userAgent: navigator.userAgent,
      });

      return authData;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
```

#### useCreateProfile (nowy hook)

```typescript
function useCreateProfile() {
  return useMutation({
    mutationFn: createProfile,
  });
}
```

#### useAcceptConsents (nowy hook)

```typescript
function useAcceptConsents() {
  return useMutation({
    mutationFn: acceptConsents,
  });
}
```

### 6.4 Hooki query

#### useProfile (nowy hook)

```typescript
const profileKeys = {
  all: ['profile'] as const,
  byId: (id: string) => [...profileKeys.all, id] as const,
};

function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.byId(userId!),
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
  });
}
```

#### useUserRole (nowy hook)

```typescript
function useUserRole() {
  const { data: session } = useSession();
  const { data: profile } = useProfile(session?.user?.id);

  return profile?.role ?? null;
}
```

## 7. Integracja API

### 7.1 Istniejące funkcje API (bez zmian)

| Funkcja      | Lokalizacja                        | Typ żądania         | Typ odpowiedzi                      |
| ------------ | ---------------------------------- | ------------------- | ----------------------------------- |
| `signUp`     | `entities/auth/api/sign-up.ts`     | `SignUpCredentials` | `AuthResponse['data']`              |
| `signIn`     | `entities/auth/api/sign-in.ts`     | `SignInCredentials` | `AuthTokenResponsePassword['data']` |
| `signOut`    | `entities/auth/api/sign-out.ts`    | `SignOutScope?`     | `void`                              |
| `getSession` | `entities/auth/api/get-session.ts` | -                   | `Session \| null`                   |

### 7.2 Nowe funkcje API

#### createProfile

```typescript
// entities/profile/api/create-profile.ts
export async function createProfile(
  input: CreateProfileInput,
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: input.userId,
      email: input.email,
      first_name: input.firstName,
      role: input.role,
    })
    .select()
    .single();

  if (error) {
    throw parseSupabaseError(error);
  }

  return data;
}
```

#### getProfile

```typescript
// entities/profile/api/get-profile.ts
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .is('deleted_at', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw parseSupabaseError(error);
  }

  return data;
}
```

#### acceptConsents

```typescript
// entities/consent/api/accept-consents.ts
export async function acceptConsents(
  input: AcceptConsentsInput,
): Promise<Consent[]> {
  const { data, error } = await supabase
    .from('consents')
    .insert(
      input.policyVersions.map((version) => ({
        user_id: input.userId,
        policy_version: version,
        ip_address: input.ipAddress,
        user_agent: input.userAgent,
      })),
    )
    .select();

  if (error) {
    throw parseSupabaseError(error);
  }

  return data;
}
```

### 7.3 Sekwencja wywołań API

#### Rejestracja (SignUpForm)

```
1. signUp(email, password, firstName)
   → Supabase Auth tworzy użytkownika

2. createProfile(userId, email, firstName, role)
   → Tworzenie rekordu w tabeli profiles

3. acceptConsents(userId, policyVersions, userAgent)
   → Zapis zgód GDPR w tabeli consents
```

#### Logowanie (SignInForm)

```
1. signIn(email, password)
   → Supabase Auth weryfikuje credentials i tworzy sesję

2. getProfile(userId) [opcjonalne, dla logiki przekierowania]
   → Pobranie profilu dla określenia roli

3. is_salon_complete(salonId) [jeśli OWNER]
   → Sprawdzenie kompletności salonu dla przekierowania
```

## 8. Interakcje użytkownika

### 8.1 Flow rejestracji

1. **Użytkownik wchodzi na `/sign-up`**
   - Wyświetla się formularz z domyślnie wybraną rolą "Klient"
   - Tło strony jest jasne (wariant USER)

2. **Użytkownik klika "Biznes" w RoleSwitcher**
   - Animowana zmiana tła na ciemny wariant (300-500ms)
   - Pole `role` w formularzu zmienia się na "OWNER"

3. **Użytkownik wypełnia pola formularza**
   - Walidacja inline przy blur na każdym polu
   - Błędy wyświetlane pod odpowiednimi polami

4. **Użytkownik zaznacza checkboxy zgód**
   - Wymagane zgody muszą być zaznaczone
   - Linki do regulaminów otwierają się w nowej karcie

5. **Użytkownik klika "Zarejestruj się"**
   - Przycisk przechodzi w stan loading (spinner)
   - Walidacja wszystkich pól
   - Jeśli błąd walidacji → focus na pierwszym błędnym polu
   - Jeśli sukces walidacji → wywołanie API

6. **Odpowiedź API**
   - Sukces → Toast "Sprawdź email aby potwierdzić konto" + redirect do `/sign-in`
   - Błąd USER_ALREADY_EXISTS → Inline error pod polem email
   - Błąd WEAK_PASSWORD → Inline error pod polem password
   - Błąd sieciowy → Toast z możliwością retry

### 8.2 Flow logowania

1. **Użytkownik wchodzi na `/sign-in`**
   - Wyświetla się prosty formularz logowania
   - Jeśli przekierowany z chronionej trasy, parametr `redirect` jest zapisany

2. **Użytkownik wypełnia email i hasło**
   - Walidacja inline przy blur

3. **Użytkownik klika "Zaloguj się"**
   - Przycisk przechodzi w stan loading
   - Wywołanie API signIn

4. **Odpowiedź API**
   - Sukces → Przekierowanie:
     - Jeśli `redirect` parametr → do tej ścieżki
     - Jeśli OWNER bez salonu → `/owner/onboarding`
     - W przeciwnym razie → `/app`
   - Błąd INVALID_CREDENTIALS → Inline error "Nieprawidłowy email lub hasło"
   - Błąd EMAIL_NOT_CONFIRMED → Toast z instrukcją sprawdzenia email
   - Błąd RATE_LIMITED → Toast "Zbyt wiele prób, poczekaj..."

### 8.3 Nawigacja między stronami auth

- Na `/sign-in`: Link "Nie masz konta? Zarejestruj się" → `/sign-up`
- Na `/sign-up`: Link "Masz już konto? Zaloguj się" → `/sign-in`

## 9. Warunki i walidacja

### 9.1 Walidacja po stronie klienta

| Pole            | Warunek                       | Komunikat błędu                                        | Komponent              |
| --------------- | ----------------------------- | ------------------------------------------------------ | ---------------------- |
| email           | Wymagane                      | "Email jest wymagany"                                  | SignUpForm, SignInForm |
| email           | Format email                  | "Nieprawidłowy format email"                           | SignUpForm, SignInForm |
| email           | Max 255 znaków                | "Email może mieć maksymalnie 255 znaków"               | SignUpForm             |
| password        | Wymagane                      | "Hasło jest wymagane"                                  | SignUpForm, SignInForm |
| password        | Min 8 znaków                  | "Hasło musi mieć co najmniej 8 znaków"                 | SignUpForm             |
| password        | Min 1 wielka litera           | "Hasło musi zawierać co najmniej jedną wielką literę"  | SignUpForm             |
| password        | Min 1 cyfra                   | "Hasło musi zawierać co najmniej jedną cyfrę"          | SignUpForm             |
| password        | Min 1 znak specjalny          | "Hasło musi zawierać co najmniej jeden znak specjalny" | SignUpForm             |
| confirmPassword | Wymagane                      | "Potwierdzenie hasła jest wymagane"                    | SignUpForm             |
| confirmPassword | Zgodność z password           | "Hasła muszą być identyczne"                           | SignUpForm             |
| firstName       | Wymagane                      | "Imię jest wymagane"                                   | SignUpForm             |
| firstName       | Max 100 znaków                | "Imię może mieć maksymalnie 100 znaków"                | SignUpForm             |
| firstName       | Dozwolone znaki               | "Imię zawiera niedozwolone znaki"                      | SignUpForm             |
| consents        | Wszystkie wymagane zaznaczone | "Musisz zaakceptować wszystkie wymagane zgody"         | ConsentCheckboxes      |

### 9.2 Walidacja po stronie serwera (Supabase)

| Warunek                      | Kod błędu           | Obsługa w UI                  |
| ---------------------------- | ------------------- | ----------------------------- |
| Email już istnieje           | USER_ALREADY_EXISTS | Inline error pod email        |
| Hasło za słabe               | WEAK_PASSWORD       | Inline error pod password     |
| Nieprawidłowe dane logowania | INVALID_CREDENTIALS | Inline error w formularzu     |
| Email niepotwierdzony        | EMAIL_NOT_CONFIRMED | Toast z instrukcją            |
| Rate limit                   | RATE_LIMITED        | Toast z informacją o czekaniu |

### 9.3 Warunki wpływające na stan UI

| Warunek                                              | Efekt                                                     |
| ---------------------------------------------------- | --------------------------------------------------------- |
| `isPending` (mutacja w toku)                         | Przycisk submit disabled + spinner                        |
| Błąd walidacji                                       | Przycisk submit disabled, focus na pierwszym błędnym polu |
| Wymagane zgody niezaznaczone                         | Przycisk submit disabled                                  |
| Użytkownik zalogowany (context.auth.isAuthenticated) | Redirect do /app                                          |

## 10. Obsługa błędów

### 10.1 Błędy autentykacji

| Kod błędu             | Komunikat dla użytkownika                                                            | Sposób wyświetlenia             |
| --------------------- | ------------------------------------------------------------------------------------ | ------------------------------- |
| `INVALID_CREDENTIALS` | "Nieprawidłowy email lub hasło. Spróbuj ponownie."                                   | Inline error w formularzu       |
| `USER_ALREADY_EXISTS` | "Użytkownik z tym adresem email już istnieje."                                       | Inline error pod polem email    |
| `WEAK_PASSWORD`       | "Hasło jest zbyt słabe. Użyj co najmniej 8 znaków, w tym cyfr i znaków specjalnych." | Inline error pod polem password |
| `EMAIL_NOT_CONFIRMED` | "Email nie został potwierdzony. Sprawdź swoją skrzynkę pocztową."                    | Toast (Sonner)                  |
| `RATE_LIMITED`        | "Zbyt wiele prób. Poczekaj chwilę i spróbuj ponownie."                               | Toast (Sonner)                  |
| `SESSION_EXPIRED`     | "Sesja wygasła. Zaloguj się ponownie."                                               | Toast + redirect do /sign-in    |

### 10.2 Błędy sieciowe

| Scenariusz         | Obsługa                                                                    |
| ------------------ | -------------------------------------------------------------------------- |
| Brak połączenia    | Toast: "Błąd połączenia z serwerem. Sprawdź swoje połączenie internetowe." |
| Timeout            | Toast: "Żądanie przekroczyło limit czasu. Spróbuj ponownie."               |
| Błąd serwera (500) | Toast: "Wystąpił błąd serwera. Spróbuj ponownie później."                  |

### 10.3 Błędy walidacji formularza

- Wyświetlanie błędów inline pod każdym polem
- Focus na pierwszym polu z błędem przy próbie submit
- Komunikaty błędów w języku polskim
- Aria-describedby łączące pole z komunikatem błędu

### 10.4 Przypadki brzegowe

| Scenariusz                                    | Obsługa                                        |
| --------------------------------------------- | ---------------------------------------------- |
| Przeładowanie strony podczas rejestracji      | Utrata wprowadzonych danych (formularz czysty) |
| Wygaśnięcie sesji                             | Redirect do /sign-in z toast                   |
| Bezpośredni dostęp do /sign-in gdy zalogowany | Redirect do /app                               |
| Wielokrotne kliknięcie submit                 | Disabled button podczas mutacji                |

## 11. Kroki implementacji

### Krok 1: Utworzenie encji `profile`

1. Utworzyć strukturę katalogów:

   ```
   entities/profile/
   ├── api/
   │   ├── create-profile.ts
   │   ├── get-profile.ts
   │   └── index.ts
   ├── queries/
   │   ├── query-keys.ts
   │   ├── use-profile.ts
   │   ├── use-user-role.ts
   │   └── index.ts
   ├── mutations/
   │   ├── use-create-profile.ts
   │   └── index.ts
   └── index.ts
   ```

2. Zaimplementować funkcje API: `createProfile`, `getProfile`
3. Zaimplementować hooki: `useProfile`, `useUserRole`, `useCreateProfile`

### Krok 2: Utworzenie encji `consent`

1. Utworzyć strukturę katalogów:

   ```
   entities/consent/
   ├── api/
   │   ├── accept-consents.ts
   │   └── index.ts
   ├── mutations/
   │   ├── use-accept-consents.ts
   │   └── index.ts
   ├── config/
   │   └── required-consents.ts
   └── index.ts
   ```

2. Zaimplementować funkcję API: `acceptConsents`
3. Zaimplementować hook: `useAcceptConsents`
4. Zdefiniować konfigurację wymaganych zgód

### Krok 3: Utworzenie komponentów współdzielonych auth

1. Utworzyć `AuthLayout` w `features/auth/components/auth-layout.tsx`
2. Utworzyć `RoleSwitcher` w `features/auth/components/role-switcher.tsx`
3. Utworzyć `ConsentCheckboxes` w `features/auth/components/consent-checkboxes.tsx`
4. Utworzyć `AuthLinks` w `features/auth/components/auth-links.tsx`

### Krok 4: Implementacja SignUpForm

1. Utworzyć `SignUpForm` w `features/auth/components/sign-up-form.tsx`
2. Zdefiniować schemat walidacji Zod
3. Zintegrować z `react-hook-form`
4. Utworzyć hook `useSignUpWithProfile` łączący rejestrację, profil i zgody
5. Zaimplementować obsługę błędów i loading states

### Krok 5: Implementacja SignInForm

1. Utworzyć `SignInForm` w `features/auth/components/sign-in-form.tsx`
2. Zdefiniować schemat walidacji Zod
3. Zintegrować z `react-hook-form`
4. Wykorzystać istniejący hook `useSignIn`
5. Zaimplementować logikę przekierowania po zalogowaniu

### Krok 6: Utworzenie stron i tras

1. Rozszerzyć `features/auth/route.tsx` o trasę `/sign-up`:

   ```typescript
   export const signUpRoute = createRoute({
     getParentRoute: () => rootRoute,
     path: '/sign-up',
     beforeLoad: ({ context }) => {
       if (context.auth.isAuthenticated) {
         throw redirect({ to: '/app' });
       }
     },
     component: SignUpPage,
   });
   ```

2. Zaktualizować istniejącą trasę `/sign-in` z rzeczywistym komponentem
3. Dodać nowe trasy do `app/router.tsx`

### Krok 7: Style i animacje

1. Zaimplementować style dla `AuthLayout` (Tailwind CSS)
2. Dodać animację przejścia tła przy zmianie roli (CSS transitions)
3. Zastosować komponenty Shadcn/UI (Button, Input, Checkbox, Form)
4. Zapewnić responsywność (mobile-first)

### Krok 8: Dostępność (A11y)

1. Dodać ARIA labels do `RoleSwitcher` (role="radiogroup")
2. Połączyć komunikaty błędów z polami przez `aria-describedby`
3. Zaimplementować focus management przy błędach walidacji
4. Dodać skip links jeśli potrzebne
5. Przetestować nawigację klawiaturową

### Krok 9: Testowanie

1. Napisać testy jednostkowe dla schematów walidacji (Vitest)
2. Napisać testy komponentów (Vitest + Testing Library)
3. Napisać testy E2E dla flow rejestracji i logowania (Playwright):
   - Rejestracja nowego użytkownika
   - Logowanie istniejącego użytkownika
   - Obsługa błędów autentykacji
   - Przekierowania guardów tras

### Krok 10: Integracja i finalizacja

1. Przetestować integrację z Supabase Auth
2. Zweryfikować działanie z istniejącą infrastrukturą (`AuthGate`, route guards)
3. Sprawdzić edge cases (rate limiting, network errors)
4. Przegląd kodu i refaktoryzacja
5. Dokumentacja komponentów (JSDoc)
