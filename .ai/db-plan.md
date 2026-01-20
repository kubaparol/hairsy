# Schemat Bazy Danych PostgreSQL - Hairsy

## 1. Tabele

### 1.1 profiles

Rozszerzenie tabeli `auth.users` z Supabase o dane profilowe użytkownika.

| Kolumna    | Typ          | Ograniczenia                                             | Opis                                                               |
| ---------- | ------------ | -------------------------------------------------------- | ------------------------------------------------------------------ |
| id         | UUID         | PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE | Identyfikator użytkownika z Supabase Auth                          |
| role       | VARCHAR(10)  | NOT NULL, CHECK (role IN ('OWNER', 'USER'))              | Rola użytkownika                                                   |
| first_name | VARCHAR(100) | NULL                                                     | Imię użytkownika (wymagane przy rejestracji, NULL po anonimizacji) |
| email      | VARCHAR(255) | NOT NULL                                                 | Email użytkownika (ustawiany na 'deleted' po anonimizacji)         |
| phone      | VARCHAR(20)  | NULL                                                     | Numer telefonu (wymagany przy rejestracji, NULL po anonimizacji)   |
| created_at | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                                  | Data utworzenia                                                    |
| updated_at | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                                  | Data ostatniej aktualizacji                                        |
| deleted_at | TIMESTAMPTZ  | NULL                                                     | Data soft delete / anonimizacji                                    |

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL CHECK (role IN ('OWNER', 'USER')),
    first_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

### 1.2 salons

Dane salonu fryzjerskiego.

| Kolumna       | Typ            | Ograniczenia                                                | Opis                        |
| ------------- | -------------- | ----------------------------------------------------------- | --------------------------- |
| id            | UUID           | PRIMARY KEY, DEFAULT gen_random_uuid()                      | Identyfikator salonu        |
| owner_id      | UUID           | NOT NULL, UNIQUE, REFERENCES profiles(id) ON DELETE CASCADE | Właściciel salonu (1:1)     |
| name          | VARCHAR(255)   | NULL                                                        | Nazwa salonu                |
| description   | TEXT           | NULL                                                        | Opis salonu                 |
| phone         | VARCHAR(20)    | NULL                                                        | Telefon kontaktowy          |
| street        | VARCHAR(255)   | NULL                                                        | Ulica                       |
| street_number | VARCHAR(20)    | NULL                                                        | Numer budynku/lokalu        |
| postal_code   | VARCHAR(10)    | NULL                                                        | Kod pocztowy                |
| city          | VARCHAR(100)   | NULL                                                        | Miasto                      |
| latitude      | DECIMAL(10, 8) | NULL                                                        | Szerokość geograficzna      |
| longitude     | DECIMAL(11, 8) | NULL                                                        | Długość geograficzna        |
| created_at    | TIMESTAMPTZ    | NOT NULL, DEFAULT NOW()                                     | Data utworzenia             |
| updated_at    | TIMESTAMPTZ    | NOT NULL, DEFAULT NOW()                                     | Data ostatniej aktualizacji |
| deleted_at    | TIMESTAMPTZ    | NULL                                                        | Data soft delete            |

```sql
CREATE TABLE salons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255),
    description TEXT,
    phone VARCHAR(20),
    street VARCHAR(255),
    street_number VARCHAR(20),
    postal_code VARCHAR(10),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

### 1.3 services

Usługi oferowane przez salon.

| Kolumna          | Typ          | Ograniczenia                                                                                       | Opis                        |
| ---------------- | ------------ | -------------------------------------------------------------------------------------------------- | --------------------------- |
| id               | UUID         | PRIMARY KEY, DEFAULT gen_random_uuid()                                                             | Identyfikator usługi        |
| salon_id         | UUID         | NOT NULL, REFERENCES salons(id) ON DELETE CASCADE                                                  | Salon oferujący usługę      |
| name             | VARCHAR(255) | NOT NULL                                                                                           | Nazwa usługi                |
| description      | TEXT         | NULL                                                                                               | Opis usługi                 |
| duration_minutes | INTEGER      | NOT NULL, CHECK (duration_minutes >= 15 AND duration_minutes <= 240 AND duration_minutes % 15 = 0) | Czas trwania w minutach     |
| price            | INTEGER      | NOT NULL, CHECK (price >= 1 AND price <= 10000)                                                    | Cena w PLN (bez groszy)     |
| created_at       | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                                                                            | Data utworzenia             |
| updated_at       | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                                                                            | Data ostatniej aktualizacji |
| deleted_at       | TIMESTAMPTZ  | NULL                                                                                               | Data soft delete            |

```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL CHECK (
        duration_minutes >= 15 AND
        duration_minutes <= 240 AND
        duration_minutes % 15 = 0
    ),
    price INTEGER NOT NULL CHECK (price >= 1 AND price <= 10000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

### 1.4 working_hours

Godziny pracy salonu w schemacie tygodniowym.

| Kolumna     | Typ         | Ograniczenia                                            | Opis                                   |
| ----------- | ----------- | ------------------------------------------------------- | -------------------------------------- |
| id          | UUID        | PRIMARY KEY, DEFAULT gen_random_uuid()                  | Identyfikator                          |
| salon_id    | UUID        | NOT NULL, REFERENCES salons(id) ON DELETE CASCADE       | Salon                                  |
| day_of_week | INTEGER     | NOT NULL, CHECK (day_of_week >= 0 AND day_of_week <= 6) | Dzień tygodnia (0=niedziela, 6=sobota) |
| open_time   | TIME        | NOT NULL                                                | Godzina otwarcia                       |
| close_time  | TIME        | NOT NULL                                                | Godzina zamknięcia                     |
| created_at  | TIMESTAMPTZ | NOT NULL, DEFAULT NOW()                                 | Data utworzenia                        |
| updated_at  | TIMESTAMPTZ | NOT NULL, DEFAULT NOW()                                 | Data ostatniej aktualizacji            |

**Ograniczenia:**

- UNIQUE (salon_id, day_of_week) - jeden wpis na dzień tygodnia
- CHECK (open_time < close_time) - godzina otwarcia przed zamknięciem

```sql
CREATE TABLE working_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (salon_id, day_of_week),
    CHECK (open_time < close_time)
);
```

### 1.5 bookings

Rezerwacje online i blokady manualne.

| Kolumna                   | Typ          | Ograniczenia                                      | Opis                                |
| ------------------------- | ------------ | ------------------------------------------------- | ----------------------------------- |
| id                        | UUID         | PRIMARY KEY, DEFAULT gen_random_uuid()            | Identyfikator rezerwacji            |
| salon_id                  | UUID         | NOT NULL, REFERENCES salons(id) ON DELETE CASCADE | Salon                               |
| client_id                 | UUID         | NULL, REFERENCES profiles(id) ON DELETE SET NULL  | Klient (NULL dla MANUAL)            |
| service_id                | UUID         | NULL, REFERENCES services(id) ON DELETE SET NULL  | Usługa (NULL dla MANUAL)            |
| type                      | VARCHAR(10)  | NOT NULL, CHECK (type IN ('ONLINE', 'MANUAL'))    | Typ rezerwacji                      |
| start_time                | TIMESTAMPTZ  | NOT NULL                                          | Czas rozpoczęcia                    |
| end_time                  | TIMESTAMPTZ  | NOT NULL                                          | Czas zakończenia                    |
| service_name_snapshot     | VARCHAR(255) | NULL                                              | Snapshot nazwy usługi (dla ONLINE)  |
| service_price_snapshot    | INTEGER      | NULL                                              | Snapshot ceny usługi (dla ONLINE)   |
| service_duration_snapshot | INTEGER      | NULL                                              | Snapshot czasu trwania (dla ONLINE) |
| note                      | VARCHAR(500) | NULL                                              | Notatka (tylko dla MANUAL)          |
| created_at                | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                           | Data utworzenia                     |
| updated_at                | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                           | Data ostatniej aktualizacji         |
| deleted_at                | TIMESTAMPTZ  | NULL                                              | Data soft delete                    |

**Ograniczenia:**

- CHECK (start_time < end_time) - czas rozpoczęcia przed zakończeniem
- CHECK (type = 'MANUAL' OR client_id IS NOT NULL) - ONLINE wymaga client_id
- CHECK (type = 'MANUAL' OR service_id IS NOT NULL) - ONLINE wymaga service_id
- CHECK (type = 'ONLINE' OR note IS NULL OR LENGTH(note) <= 500) - notatka tylko dla MANUAL

```sql
-- Wymagane rozszerzenie dla exclusion constraint
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('ONLINE', 'MANUAL')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    service_name_snapshot VARCHAR(255),
    service_price_snapshot INTEGER,
    service_duration_snapshot INTEGER,
    note VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CHECK (start_time < end_time),
    CHECK (type = 'MANUAL' OR client_id IS NOT NULL),
    CHECK (type = 'MANUAL' OR service_id IS NOT NULL),
    CHECK (type = 'ONLINE' OR note IS NULL OR LENGTH(note) <= 500),
    -- Exclusion constraint zapobiegający double-booking
    EXCLUDE USING gist (
        salon_id WITH =,
        tstzrange(start_time, end_time) WITH &&
    ) WHERE (deleted_at IS NULL)
);
```

### 1.6 consents

Zgody GDPR użytkowników.

| Kolumna        | Typ         | Ograniczenia                                        | Opis                                    |
| -------------- | ----------- | --------------------------------------------------- | --------------------------------------- |
| id             | UUID        | PRIMARY KEY, DEFAULT gen_random_uuid()              | Identyfikator zgody                     |
| user_id        | UUID        | NOT NULL, REFERENCES profiles(id) ON DELETE CASCADE | Użytkownik                              |
| policy_version | VARCHAR(50) | NOT NULL                                            | Wersja polityki (np. privacy_policy_v1) |
| accepted_at    | TIMESTAMPTZ | NOT NULL, DEFAULT NOW()                             | Data akceptacji                         |
| ip_address     | INET        | NULL                                                | Adres IP podczas akceptacji             |
| user_agent     | TEXT        | NULL                                                | User agent przeglądarki                 |

```sql
CREATE TABLE consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    policy_version VARCHAR(50) NOT NULL,
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    UNIQUE (user_id, policy_version)
);
```

## 2. Relacje między tabelami

```
┌─────────────────┐
│   auth.users    │
│   (Supabase)    │
└────────┬────────┘
         │ 1:1
         ▼
┌─────────────────┐       ┌─────────────────┐
│    profiles     │──────►│    consents     │
│                 │  1:N  │                 │
└────────┬────────┘       └─────────────────┘
         │ 1:1
         ▼
┌─────────────────┐
│     salons      │
│                 │
└────────┬────────┘
         │
    ┌────┴────┬──────────────┐
    │ 1:N     │ 1:N          │ 1:N
    ▼         ▼              ▼
┌─────────┐ ┌──────────────┐ ┌─────────────┐
│services │ │working_hours │ │  bookings   │
└─────────┘ └──────────────┘ └──────┬──────┘
    │                               │
    │              ┌────────────────┘
    │              │ N:1 (client_id)
    └──────────────┤
      N:1          ▼
    (service_id) ┌─────────────────┐
                 │    profiles     │
                 │   (as client)   │
                 └─────────────────┘
```

### Kardynalność relacji

| Relacja                      | Kardynalność | Opis                                                     |
| ---------------------------- | ------------ | -------------------------------------------------------- |
| auth.users → profiles        | 1:1          | Każdy użytkownik Supabase ma dokładnie jeden profil      |
| profiles → salons            | 1:1          | Jeden właściciel ma maksymalnie jeden salon (w MVP)      |
| profiles → consents          | 1:N          | Użytkownik może mieć wiele zgód (różne wersje polityki)  |
| profiles → bookings (client) | 1:N          | Klient może mieć wiele rezerwacji                        |
| salons → services            | 1:N          | Salon oferuje wiele usług                                |
| salons → working_hours       | 1:N          | Salon ma godziny pracy dla każdego dnia tygodnia (max 7) |
| salons → bookings            | 1:N          | Salon ma wiele rezerwacji                                |
| services → bookings          | 1:N          | Usługa może być w wielu rezerwacjach                     |

## 3. Indeksy

```sql
-- Indeks dla wyszukiwania dostępności (najważniejszy dla wydajności)
CREATE INDEX idx_bookings_salon_time ON bookings (salon_id, start_time, end_time)
WHERE deleted_at IS NULL;

-- Indeks dla filtrowania salonów po mieście
CREATE INDEX idx_salons_city ON salons (city)
WHERE deleted_at IS NULL;

-- Indeks dla panelu klienta (moje rezerwacje)
CREATE INDEX idx_bookings_client ON bookings (client_id)
WHERE deleted_at IS NULL;

-- Indeks dla kalendarza właściciela
CREATE INDEX idx_bookings_salon_start ON bookings (salon_id, start_time)
WHERE deleted_at IS NULL;

-- Indeks dla usług salonu
CREATE INDEX idx_services_salon ON services (salon_id)
WHERE deleted_at IS NULL;

-- Indeks dla godzin pracy salonu
CREATE INDEX idx_working_hours_salon ON working_hours (salon_id);

-- Indeks dla profili (lookup po roli)
CREATE INDEX idx_profiles_role ON profiles (role)
WHERE deleted_at IS NULL;

-- Indeks dla zgód użytkownika
CREATE INDEX idx_consents_user ON consents (user_id);
```

## 4. Funkcje i Triggery

### 4.1 Automatyczna aktualizacja updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger dla każdej tabeli
CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tr_salons_updated_at
    BEFORE UPDATE ON salons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tr_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tr_working_hours_updated_at
    BEFORE UPDATE ON working_hours
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tr_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 4.2 Funkcja sprawdzająca kompletność salonu

```sql
CREATE OR REPLACE FUNCTION is_salon_complete(p_salon_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_salon_data_complete BOOLEAN;
    v_has_working_hours BOOLEAN;
    v_has_services BOOLEAN;
BEGIN
    -- Sprawdź kompletność danych salonu
    SELECT
        (name IS NOT NULL AND name != '' AND
         phone IS NOT NULL AND phone != '' AND
         street IS NOT NULL AND street != '' AND
         street_number IS NOT NULL AND street_number != '' AND
         postal_code IS NOT NULL AND postal_code != '' AND
         city IS NOT NULL AND city != '')
    INTO v_salon_data_complete
    FROM salons
    WHERE id = p_salon_id AND deleted_at IS NULL;

    IF v_salon_data_complete IS NULL OR NOT v_salon_data_complete THEN
        RETURN FALSE;
    END IF;

    -- Sprawdź czy salon ma zdefiniowane godziny pracy (min. 1 dzień)
    SELECT EXISTS (
        SELECT 1 FROM working_hours
        WHERE salon_id = p_salon_id
    ) INTO v_has_working_hours;

    IF NOT v_has_working_hours THEN
        RETURN FALSE;
    END IF;

    -- Sprawdź czy salon ma min. 1 aktywną usługę
    SELECT EXISTS (
        SELECT 1 FROM services
        WHERE salon_id = p_salon_id AND deleted_at IS NULL
    ) INTO v_has_services;

    RETURN v_has_services;
END;
$$ LANGUAGE plpgsql STABLE;
```

### 4.3 Funkcja do anonimizacji profilu użytkownika

```sql
CREATE OR REPLACE FUNCTION anonymize_user_profile(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles
    SET
        first_name = NULL,
        email = 'deleted_' || id::text,
        phone = NULL,
        deleted_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;
```

### 4.4 Funkcja pomocnicza - wyliczanie statusu rezerwacji

```sql
-- Status rezerwacji jest wyliczany dynamicznie, nie przechowywany
-- Ta funkcja może być używana w zapytaniach lub jako computed column w widoku

CREATE OR REPLACE FUNCTION get_booking_status(p_end_time TIMESTAMPTZ)
RETURNS TEXT AS $$
BEGIN
    IF p_end_time < NOW() THEN
        RETURN 'completed';
    ELSE
        RETURN 'upcoming';
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

## 5. Zasady Row Level Security (RLS)

### 5.1 Włączenie RLS dla wszystkich tabel

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
```

### 5.2 Polityki dla tabeli profiles

```sql
-- Użytkownik może widzieć i edytować tylko swój profil
CREATE POLICY profiles_select_own ON profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY profiles_update_own ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Profil tworzony automatycznie przez trigger przy rejestracji
CREATE POLICY profiles_insert_own ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);
```

### 5.3 Polityki dla tabeli salons

```sql
-- Publiczny dostęp do kompletnych salonów (dla listy)
CREATE POLICY salons_select_complete ON salons
    FOR SELECT
    USING (
        deleted_at IS NULL AND
        is_salon_complete(id)
    );

-- Właściciel widzi swój salon (nawet niekompletny)
CREATE POLICY salons_select_own ON salons
    FOR SELECT
    USING (
        deleted_at IS NULL AND
        owner_id = auth.uid()
    );

-- Tylko właściciel może tworzyć salon
CREATE POLICY salons_insert_owner ON salons
    FOR INSERT
    WITH CHECK (
        owner_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'OWNER' AND deleted_at IS NULL
        )
    );

-- Tylko właściciel może aktualizować swój salon
CREATE POLICY salons_update_own ON salons
    FOR UPDATE
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

-- Soft delete - tylko właściciel
CREATE POLICY salons_delete_own ON salons
    FOR DELETE
    USING (owner_id = auth.uid());
```

### 5.4 Polityki dla tabeli services

```sql
-- Publiczny dostęp do usług kompletnych salonów
CREATE POLICY services_select_public ON services
    FOR SELECT
    USING (
        deleted_at IS NULL AND
        EXISTS (
            SELECT 1 FROM salons
            WHERE salons.id = services.salon_id
            AND salons.deleted_at IS NULL
            AND is_salon_complete(salons.id)
        )
    );

-- Właściciel widzi swoje usługi (nawet dla niekompletnego salonu)
CREATE POLICY services_select_own ON services
    FOR SELECT
    USING (
        deleted_at IS NULL AND
        EXISTS (
            SELECT 1 FROM salons
            WHERE salons.id = services.salon_id
            AND salons.owner_id = auth.uid()
        )
    );

-- Tylko właściciel może zarządzać usługami swojego salonu
CREATE POLICY services_insert_own ON services
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM salons
            WHERE salons.id = services.salon_id
            AND salons.owner_id = auth.uid()
        )
    );

CREATE POLICY services_update_own ON services
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM salons
            WHERE salons.id = services.salon_id
            AND salons.owner_id = auth.uid()
        )
    );

CREATE POLICY services_delete_own ON services
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM salons
            WHERE salons.id = services.salon_id
            AND salons.owner_id = auth.uid()
        )
    );
```

### 5.5 Polityki dla tabeli working_hours

```sql
-- Publiczny dostęp do godzin pracy kompletnych salonów
CREATE POLICY working_hours_select_public ON working_hours
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM salons
            WHERE salons.id = working_hours.salon_id
            AND salons.deleted_at IS NULL
            AND is_salon_complete(salons.id)
        )
    );

-- Właściciel widzi godziny swojego salonu
CREATE POLICY working_hours_select_own ON working_hours
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM salons
            WHERE salons.id = working_hours.salon_id
            AND salons.owner_id = auth.uid()
        )
    );

-- Właściciel może zarządzać godzinami pracy
CREATE POLICY working_hours_insert_own ON working_hours
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM salons
            WHERE salons.id = working_hours.salon_id
            AND salons.owner_id = auth.uid()
        )
    );

CREATE POLICY working_hours_update_own ON working_hours
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM salons
            WHERE salons.id = working_hours.salon_id
            AND salons.owner_id = auth.uid()
        )
    );

CREATE POLICY working_hours_delete_own ON working_hours
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM salons
            WHERE salons.id = working_hours.salon_id
            AND salons.owner_id = auth.uid()
        )
    );
```

### 5.6 Polityki dla tabeli bookings

```sql
-- Klient widzi swoje rezerwacje
CREATE POLICY bookings_select_client ON bookings
    FOR SELECT
    USING (
        deleted_at IS NULL AND
        client_id = auth.uid()
    );

-- Właściciel widzi wszystkie rezerwacje swojego salonu
CREATE POLICY bookings_select_owner ON bookings
    FOR SELECT
    USING (
        deleted_at IS NULL AND
        EXISTS (
            SELECT 1 FROM salons
            WHERE salons.id = bookings.salon_id
            AND salons.owner_id = auth.uid()
        )
    );

-- Klient może tworzyć rezerwacje ONLINE
CREATE POLICY bookings_insert_client ON bookings
    FOR INSERT
    WITH CHECK (
        type = 'ONLINE' AND
        client_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND deleted_at IS NULL
        )
    );

-- Właściciel może tworzyć blokady MANUAL
CREATE POLICY bookings_insert_owner_manual ON bookings
    FOR INSERT
    WITH CHECK (
        type = 'MANUAL' AND
        client_id IS NULL AND
        EXISTS (
            SELECT 1 FROM salons
            WHERE salons.id = bookings.salon_id
            AND salons.owner_id = auth.uid()
        )
    );

-- Właściciel może aktualizować rezerwacje swojego salonu (np. soft delete)
CREATE POLICY bookings_update_owner ON bookings
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM salons
            WHERE salons.id = bookings.salon_id
            AND salons.owner_id = auth.uid()
        )
    );

-- Właściciel może usuwać (soft delete) rezerwacje
CREATE POLICY bookings_delete_owner ON bookings
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM salons
            WHERE salons.id = bookings.salon_id
            AND salons.owner_id = auth.uid()
        )
    );
```

### 5.7 Polityki dla tabeli consents

```sql
-- Użytkownik widzi swoje zgody
CREATE POLICY consents_select_own ON consents
    FOR SELECT
    USING (user_id = auth.uid());

-- Użytkownik może dodawać swoje zgody
CREATE POLICY consents_insert_own ON consents
    FOR INSERT
    WITH CHECK (user_id = auth.uid());
```

## 6. Widoki pomocnicze

### 6.1 Widok kompletnych salonów (dla publicznej listy)

```sql
CREATE VIEW v_complete_salons AS
SELECT
    s.id,
    s.name,
    s.description,
    s.phone,
    s.street,
    s.street_number,
    s.postal_code,
    s.city,
    s.latitude,
    s.longitude
FROM salons s
WHERE s.deleted_at IS NULL
AND is_salon_complete(s.id);
```

### 6.2 Widok rezerwacji z wyliczonym statusem

```sql
CREATE VIEW v_bookings_with_status AS
SELECT
    b.*,
    get_booking_status(b.end_time) AS status,
    p.first_name AS client_first_name,
    p.email AS client_email,
    p.phone AS client_phone
FROM bookings b
LEFT JOIN profiles p ON b.client_id = p.id
WHERE b.deleted_at IS NULL;
```

## 7. Dodatkowe uwagi i decyzje projektowe

### 7.1 Strefa czasowa

- Wszystkie kolumny czasowe używają typu `TIMESTAMPTZ` (timestamp with time zone)
- System działa w strefie czasowej `Europe/Warsaw`
- Zalecane ustawienie na poziomie sesji: `SET timezone = 'Europe/Warsaw';`

### 7.2 Soft Delete i GDPR

- Wszystkie główne encje mają kolumnę `deleted_at` dla soft delete
- Przy usunięciu konta użytkownika:
  - Profil jest anonimizowany (first_name = NULL, email = 'deleted_xxx', phone = NULL)
  - Rezerwacje pozostają jako rekordy historyczne z client_id wskazującym na zanonimizowany profil
  - Zgody są usuwane kaskadowo (ON DELETE CASCADE)

### 7.3 Status rezerwacji

- Status (`upcoming`/`completed`) jest wyliczany dynamicznie na podstawie `end_time < NOW()`
- Nie ma potrzeby schedulera do aktualizacji statusów
- Gwarantuje spójność bez dodatkowej logiki

### 7.4 Zapobieganie double-booking

- Exclusion constraint z rozszerzeniem `btree_gist` gwarantuje na poziomie bazy danych brak nakładających się rezerwacji
- Constraint działa atomowo, eliminując race conditions
- Warunek `WHERE (deleted_at IS NULL)` pozwala na "usunięte" rezerwacje w tym samym czasie

### 7.5 Snapshot usługi w rezerwacji

- Kolumny `service_name_snapshot`, `service_price_snapshot`, `service_duration_snapshot` przechowują dane usługi w momencie rezerwacji
- Pozwala to na poprawne wyświetlanie historii nawet po edycji/usunięciu usługi
- Snapshot powinien być wypełniany przez backend przy tworzeniu rezerwacji ONLINE

### 7.6 Walidacja kompletności salonu

- Funkcja `is_salon_complete()` sprawdza dynamicznie wszystkie wymagania
- Salon jest widoczny publicznie tylko gdy funkcja zwraca TRUE
- Wymagania: name, phone, pełny adres, min. 1 dzień godzin pracy, min. 1 usługa

### 7.7 Ograniczenia MVP

- Relacja owner:salon to 1:1 (wymuszane przez UNIQUE na owner_id)
- Brak anulowania rezerwacji przez klienta
- Brak wielu pracowników (implikowany jeden właściciel = jeden kalendarz)

### 7.8 Migracja do produkcji

Przed uruchomieniem produkcyjnym należy:

1. Utworzyć rozszerzenie `btree_gist`: `CREATE EXTENSION IF NOT EXISTS btree_gist;`
2. Wykonać migracje tabel w odpowiedniej kolejności (profiles → salons → services/working_hours → bookings → consents)
3. Włączyć RLS i utworzyć polityki
4. Dodać indeksy
5. Utworzyć funkcje i triggery
